import { create } from 'zustand';
import type { Chat, Message, Attachment } from '../types/chat';
import { sendToAI, formatAIError } from '../services/ai';
import imageCompression from 'browser-image-compression';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

// ─── Helpers ──────────────────────────────────────────────

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function truncate(text: string, max = 30): string {
  return text.length > max ? text.slice(0, max) + '…' : text;
}

async function processFiles(files: File[]): Promise<Attachment[]> {
  const attachments: Attachment[] = [];
  for (const file of files) {
    let finalFile = file;
    // Compress images
    if (file.type.startsWith('image/')) {
      try {
        finalFile = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        });
      } catch (e) {
        console.error("Error compressing image", e);
      }
    }
    
    // Convert to base64
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(finalFile);
    });
    
    // We will upload to Supabase Storage later in addMessage.
    // For now, keep the local dataUrl for instant preview.
    attachments.push({
      id: uid(),
      name: file.name,
      type: file.type,
      data: dataUrl,
    });
  }
  return attachments;
}

// Removed localStorage helpers

// ─── Store interface ─────────────────────────────────────

interface ChatStore {
  // State
  session: Session | null;
  chats: Chat[];
  messages: Message[];
  activeChatId: string | null;
  isTyping: boolean;
  isFetching: boolean;

  // Actions
  setSession: (session: Session | null) => void;
  fetchData: () => Promise<void>;
  createChat: () => Promise<string>;
  deleteChat: (chatId: string) => Promise<void>;
  setActiveChat: (chatId: string | null) => void;
  addMessage: (content: string, files?: File[]) => Promise<void>;
}

// ─── Store ───────────────────────────────────────────────

export const useChatStore = create<ChatStore>((set, get) => ({
  session: null,
  chats: [],
  messages: [],
  activeChatId: null,
  isTyping: false,
  isFetching: false,

  setSession: (session) => {
    set({ session });
    if (session) {
      get().fetchData();
    } else {
      set({ chats: [], messages: [], activeChatId: null });
    }
  },

  fetchData: async () => {
    const { session } = get();
    if (!session) return;
    
    set({ isFetching: true });
    try {
      const [{ data: chats }, { data: messages }] = await Promise.all([
        supabase.from('chats').select('*').order('created_at', { ascending: false }),
        supabase.from('messages').select('*').order('created_at', { ascending: true })
      ]);
      
      if (chats && messages) {
        // Map snake_case to camelCase
        const mappedChats = chats.map(c => ({ id: c.id, title: c.title, createdAt: new Date(c.created_at).getTime() }));
        const mappedMessages = messages.map(m => ({
          id: m.id,
          chatId: m.chat_id,
          role: m.role,
          content: m.content,
          attachments: m.attachments,
          createdAt: new Date(m.created_at).getTime()
        }));
        
        set({ 
          chats: mappedChats, 
          messages: mappedMessages,
          activeChatId: mappedChats.length > 0 ? mappedChats[0].id : null,
          isFetching: false 
        });
      }
    } catch (e) {
      console.error('Error fetching data', e);
      set({ isFetching: false });
    }
  },

  createChat: async () => {
    const { session } = get();
    if (!session) return '';

    const newChat = {
      user_id: session.user.id,
      title: 'New Chat',
    };

    const { data, error } = await supabase.from('chats').insert([newChat]).select().single();
    
    if (error || !data) {
      console.error('Error creating chat', error);
      return '';
    }

    const chat: Chat = { id: data.id, title: data.title, createdAt: new Date(data.created_at).getTime() };
    
    set((state) => ({ 
      chats: [chat, ...state.chats], 
      activeChatId: chat.id 
    }));
    
    return chat.id;
  },

  deleteChat: async (chatId: string) => {
    const { error } = await supabase.from('chats').delete().eq('id', chatId);
    if (error) {
      console.error('Error deleting chat', error);
      return;
    }

    set((state) => {
      const chats = state.chats.filter((c) => c.id !== chatId);
      const messages = state.messages.filter((m) => m.chatId !== chatId);
      const activeChatId =
        state.activeChatId === chatId
          ? chats.length > 0
            ? chats[0].id
            : null
          : state.activeChatId;

      return { chats, messages, activeChatId };
    });
  },

  setActiveChat: (chatId: string | null) => {
    set({ activeChatId: chatId });
  },

  addMessage: async (content: string, files?: File[]) => {
    const state = get();
    const { session } = state;
    if (!session) return;
    
    let targetChatId = state.activeChatId;

    // If no active chat, create one first
    if (!targetChatId) {
      targetChatId = await get().createChat();
      if (!targetChatId) return; // creation failed
    }

    // Determine if this is the first message in the chat
    const existingMessages = state.messages.filter(
      (m) => m.chatId === targetChatId
    );
    const isFirstMessage = existingMessages.length === 0;

    // Process files into attachments
    let attachments: Attachment[] = [];
    if (files && files.length > 0) {
      attachments = await processFiles(files);
      
      // Upload to Supabase Storage
      for (const att of attachments) {
        try {
          // Convert base64 back to Blob for upload
          const res = await fetch(att.data);
          const blob = await res.blob();
          const filePath = `${session.user.id}/${targetChatId}/${att.id}`;
          
          const { error: uploadError } = await supabase.storage
            .from('attachments')
            .upload(filePath, blob, { contentType: att.type });
            
          if (!uploadError) {
            const { data } = supabase.storage.from('attachments').getPublicUrl(filePath);
            att.data = data.publicUrl; // Replace base64 with public URL
          }
        } catch (e) {
          console.error("Upload failed", e);
        }
      }
    }

    // Insert user message to DB
    const { data: userMsgData, error: userErr } = await supabase.from('messages').insert([{
      chat_id: targetChatId,
      role: 'user',
      content,
      attachments: attachments.length > 0 ? attachments : null
    }]).select().single();

    if (userErr || !userMsgData) {
      console.error("Failed to save message", userErr);
      return;
    }

    const userMsg: Message = {
      id: userMsgData.id,
      chatId: userMsgData.chat_id,
      role: 'user',
      content,
      attachments: attachments.length > 0 ? attachments : undefined,
      createdAt: new Date(userMsgData.created_at).getTime(),
    };

    // Auto-title if first message
    if (isFirstMessage) {
      const newTitle = truncate(content);
      await supabase.from('chats').update({ title: newTitle }).eq('id', targetChatId);
      set((s) => ({
        chats: s.chats.map((c) => c.id === targetChatId ? { ...c, title: newTitle } : c)
      }));
    }

    // Add user message to local state
    set((s) => ({
      messages: [...s.messages, userMsg],
      activeChatId: targetChatId 
    }));

    // Show typing indicator
    set({ isTyping: true });

    // Build chat history for context (only this chat's messages)
    const chatHistory = get().messages.filter(
      (m) => m.chatId === targetChatId && m.id !== userMsg.id
    );

    try {
      const aiText = await sendToAI(content, chatHistory, userMsg.attachments);

      // Insert AI response
      const { data: aiMsgData, error: aiErr } = await supabase.from('messages').insert([{
        chat_id: targetChatId,
        role: 'assistant',
        content: aiText,
      }]).select().single();

      if (!aiErr && aiMsgData) {
        const aiMsg: Message = {
          id: aiMsgData.id,
          chatId: aiMsgData.chat_id,
          role: 'assistant',
          content: aiText,
          createdAt: new Date(aiMsgData.created_at).getTime(),
        };

        set((s) => ({
          messages: [...s.messages, aiMsg],
          isTyping: false
        }));
      } else {
        set({ isTyping: false });
      }

    } catch (error) {
      // Show a friendly error message as an AI reply locally
      const errorMsg: Message = {
        id: uid(),
        chatId: targetChatId!,
        role: 'assistant',
        content: formatAIError(error),
        createdAt: Date.now(),
      };

      set((s) => ({
        messages: [...s.messages, errorMsg],
        isTyping: false
      }));
    }
  },
}));
