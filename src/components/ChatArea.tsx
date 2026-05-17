import { useRef, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useChatStore } from '../store/chatStore';
import ChatBubble from './ChatBubble';
import WelcomeScreen from './WelcomeScreen';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';

export default function ChatArea() {
  const activeChatId = useChatStore((s) => s.activeChatId);
  const messages = useChatStore((s) => s.messages);
  const isTyping = useChatStore((s) => s.isTyping);
  const addMessage = useChatStore((s) => s.addMessage);

  // Derive active messages from raw state
  const activeMessages = useMemo(
    () => (activeChatId ? messages.filter((m) => m.chatId === activeChatId) : []),
    [messages, activeChatId]
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasMessages = activeMessages.length > 0;

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeMessages.length, isTyping]);

  return (
    <div className="flex-1 flex flex-col min-w-0 h-screen">
      {/* Messages or Welcome */}
      {hasMessages ? (
        <div className="flex-1 overflow-y-auto scroll-smooth">
          <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 space-y-6">
            {activeMessages.map((msg, index) => (
              <ChatBubble
                key={msg.id}
                message={msg}
                isLatest={index === activeMessages.length - 1}
              />
            ))}

            {/* Typing indicator */}
            <AnimatePresence>
              {isTyping && <TypingIndicator />}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>
        </div>
      ) : (
        <WelcomeScreen onSuggestionClick={addMessage} />
      )}

      {/* Input */}
      <ChatInput onSend={addMessage} disabled={isTyping} />
    </div>
  );
}
