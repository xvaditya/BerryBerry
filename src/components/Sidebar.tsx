import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Settings,
  MessageSquare,
  Trash2,
  X,
  Cherry,
  LogOut,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { useChatStore } from '../store/chatStore';
import { supabase } from '../lib/supabase';
import IconButton from './IconButton';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onCloseMobile: () => void;
}

export default function Sidebar({ isOpen, onToggle, onCloseMobile }: SidebarProps) {
  const chats = useChatStore((s) => s.chats);
  const activeChatId = useChatStore((s) => s.activeChatId);
  const setActiveChat = useChatStore((s) => s.setActiveChat);
  const createChat = useChatStore((s) => s.createChat);
  const deleteChat = useChatStore((s) => s.deleteChat);
  const messages = useChatStore((s) => s.messages);

  // Pre-compute message counts for all chats
  const messageCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const m of messages) {
      counts[m.chatId] = (counts[m.chatId] || 0) + 1;
    }
    return counts;
  }, [messages]);

  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewChat = () => {
    createChat();
    onCloseMobile();
  };

  const handleSelectChat = (id: string) => {
    setActiveChat(id);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-center justify-between mb-4">
          <motion.div
            className="flex items-center gap-2.5"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-berry-400 to-berry-600 flex items-center justify-center shadow-berry">
                <Cherry className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
            </div>
            <div>
              <h1 className="text-[15px] font-display font-bold text-berry-900 tracking-tight leading-none">
                BerryBerry
              </h1>
              <span className="text-[10px] text-berry-400 font-medium tracking-wider uppercase">
                AI English
              </span>
            </div>
          </motion.div>

          {/* Close on mobile */}
          <div className="md:hidden">
            <IconButton
              icon={<X className="w-4 h-4" />}
              onClick={onToggle}
              label="Close sidebar"
              variant="ghost"
              size="sm"
            />
          </div>
        </div>

        {/* New Chat Button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.01, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNewChat}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl
                     bg-gradient-to-r from-berry-500 to-berry-600 
                     hover:from-berry-400 hover:to-berry-500
                     text-white text-[13px] font-semibold
                     shadow-berry hover:shadow-berry-lg
                     transition-all duration-300 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </motion.button>

        {/* Search */}
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-berry-300" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl text-[13px]
                       bg-berry-50/60 border border-berry-100/60
                       text-berry-900 placeholder:text-berry-300
                       focus:outline-none focus:ring-2 focus:ring-berry-300/40 focus:border-berry-200
                       transition-all duration-200"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5 scrollbar-thin">
        <AnimatePresence mode="popLayout">
          {filteredChats.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 px-4"
            >
              <MessageSquare className="w-8 h-8 text-berry-200 mx-auto mb-2" />
              <p className="text-[13px] text-berry-300 font-medium">
                {searchQuery ? 'No chats found' : 'No conversations yet'}
              </p>
              <p className="text-[11px] text-berry-200 mt-1">
                {searchQuery
                  ? 'Try a different search'
                  : 'Start a new chat to begin learning'}
              </p>
            </motion.div>
          ) : (
            filteredChats.map((chat, index) => {
              const isActive = chat.id === activeChatId;
              const isHovered = chat.id === hoveredChatId;
              const msgCount = messageCounts[chat.id] || 0;

              return (
                <motion.div
                  key={chat.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  transition={{
                    duration: 0.25,
                    delay: index * 0.03,
                    layout: { duration: 0.2 },
                  }}
                  onMouseEnter={() => setHoveredChatId(chat.id)}
                  onMouseLeave={() => setHoveredChatId(null)}
                  onClick={() => handleSelectChat(chat.id)}
                  className={`
                    group relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer
                    transition-all duration-200 ease-out
                    ${
                      isActive
                        ? 'bg-berry-100/80 border border-berry-200/50 shadow-sm'
                        : 'hover:bg-berry-50/50 border border-transparent'
                    }
                  `}
                >
                  <MessageSquare
                    className={`w-4 h-4 shrink-0 transition-colors duration-200 ${
                      isActive ? 'text-berry-500' : 'text-berry-300'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-[13px] truncate transition-colors duration-200 ${
                        isActive
                          ? 'text-berry-900 font-semibold'
                          : 'text-berry-700 font-medium'
                      }`}
                    >
                      {chat.title}
                    </p>
                    <p className="text-[10px] text-berry-300 mt-0.5">
                      {msgCount} message{msgCount !== 1 ? 's' : ''}
                    </p>
                  </div>

                  {/* Delete button */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.button
                        type="button"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.15 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteChat(chat.id);
                        }}
                        className="absolute right-2 p-1.5 rounded-lg
                                   hover:bg-red-50 text-berry-300 hover:text-red-400
                                   transition-colors duration-150"
                        aria-label="Delete chat"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-berry-100/40 flex flex-col gap-1">
        <motion.button
          type="button"
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl
                     text-berry-600/70 hover:text-berry-700 hover:bg-berry-50/50
                     transition-all duration-200 cursor-pointer"
        >
          <Settings className="w-4 h-4" />
          <span className="text-[13px] font-medium">Settings</span>
        </motion.button>

        <motion.button
          type="button"
          onClick={async () => {
            await supabase.auth.signOut();
          }}
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl
                     text-red-500/70 hover:text-red-600 hover:bg-red-50/50
                     transition-all duration-200 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-[13px] font-medium">Log out</span>
        </motion.button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="hidden md:flex flex-col w-[280px] lg:w-[300px] h-screen
                   bg-white/70 backdrop-blur-xl border-r border-berry-100/40
                   shrink-0"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onToggle}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
                mass: 0.8,
              }}
              className="fixed left-0 top-0 bottom-0 w-[300px] max-w-[85vw]
                         bg-white/95 backdrop-blur-xl border-r border-berry-100/40
                         z-50 md:hidden shadow-2xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
