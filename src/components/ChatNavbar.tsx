import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Menu, Cherry } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import IconButton from './IconButton';

interface ChatNavbarProps {
  onToggleSidebar: () => void;
}

export default function ChatNavbar({ onToggleSidebar }: ChatNavbarProps) {
  const chats = useChatStore((s) => s.chats);
  const activeChatId = useChatStore((s) => s.activeChatId);

  const chatTitle = useMemo(
    () => chats.find((c) => c.id === activeChatId)?.title ?? 'BerryBerry',
    [chats, activeChatId]
  );

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="md:hidden flex items-center gap-3 px-4 py-3
                 bg-white/60 backdrop-blur-xl border-b border-berry-100/30
                 sticky top-0 z-30"
    >
      <IconButton
        icon={<Menu className="w-5 h-5" />}
        onClick={onToggleSidebar}
        label="Open menu"
        variant="ghost"
        size="sm"
      />

      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-berry-400 to-berry-600 flex items-center justify-center">
          <Cherry className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-[14px] font-semibold text-berry-900 truncate">
          {chatTitle}
        </span>
      </div>
    </motion.nav>
  );
}
