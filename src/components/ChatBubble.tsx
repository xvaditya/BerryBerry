import { motion } from 'framer-motion';
import { Cherry, User, FileText, Volume2, Square } from 'lucide-react';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import type { ChatBubbleProps } from '../types';

function formatTime(epoch: number): string {
  return new Date(epoch).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Simple markdown-like rendering (bold, italic, code, tables)
function renderContent(text: string) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let inTable = false;
  let tableRows: string[][] = [];
  let tableKey = 0;

  const flushTable = () => {
    if (tableRows.length < 2) return;
    const headers = tableRows[0];
    const body = tableRows.slice(2); // skip separator row
    elements.push(
      <div key={`table-${tableKey++}`} className="overflow-x-auto my-3">
        <table className="w-full text-[12px] border-collapse">
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="text-left px-3 py-1.5 border-b border-berry-200/30 font-semibold text-berry-800">
                  {h.trim()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci} className="px-3 py-1.5 border-b border-berry-100/20 text-berry-700">
                    {renderInline(cell.trim())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableRows = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Table detection
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      if (!inTable) inTable = true;
      const cells = line.split('|').filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      tableRows.push(cells);
      continue;
    } else if (inTable) {
      inTable = false;
      flushTable();
    }

    // Heading
    if (line.startsWith('### ')) {
      elements.push(<h4 key={i} className="font-display font-bold text-[13px] text-berry-900 mt-3 mb-1">{renderInline(line.slice(4))}</h4>);
    } else if (line.startsWith('## ')) {
      elements.push(<h3 key={i} className="font-display font-bold text-[14px] text-berry-900 mt-3 mb-1">{renderInline(line.slice(3))}</h3>);
    } else if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={i} className="border-l-2 border-berry-300/50 pl-3 my-1.5 text-[13px] text-berry-700 italic">
          {renderInline(line.slice(2))}
        </blockquote>
      );
    } else if (line.startsWith('- ')) {
      elements.push(
        <div key={i} className="flex gap-2 my-0.5 text-[13px]">
          <span className="text-berry-400 mt-0.5 shrink-0">•</span>
          <span className="text-berry-800">{renderInline(line.slice(2))}</span>
        </div>
      );
    } else if (line.trim() === '') {
      elements.push(<div key={i} className="h-2" />);
    } else {
      elements.push(<p key={i} className="text-[13px] text-berry-800 leading-relaxed my-0.5">{renderInline(line)}</p>);
    }
  }

  if (inTable) flushTable();
  return elements;
}

function renderInline(text: string): React.ReactNode {
  // Bold, italic, inline code, emoji
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-berry-900">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i} className="italic text-berry-600">{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="px-1.5 py-0.5 rounded-md bg-berry-100/60 text-berry-700 text-[12px] font-mono">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

export default function ChatBubble({ message, isLatest }: ChatBubbleProps) {
  const isUser = message.role === 'user';
  const { isSpeaking, speak, stop } = useSpeechSynthesis();

  return (
    <motion.div
      initial={isLatest ? { opacity: 0, y: 16, filter: 'blur(6px)' } : false}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''} group`}
    >
      {/* Avatar */}
      <motion.div
        initial={isLatest ? { scale: 0.8 } : false}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
        className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm ${
          isUser
            ? 'bg-gradient-to-br from-berry-100 to-berry-200 text-berry-600'
            : 'bg-gradient-to-br from-berry-400 to-berry-600 text-white'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Cherry className="w-4 h-4" />}
      </motion.div>

      {/* Bubble */}
      <div className={`max-w-[85%] md:max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-gradient-to-br from-berry-500 to-berry-600 text-white shadow-berry rounded-tr-md'
              : 'bg-white/80 backdrop-blur-sm border border-berry-100/40 shadow-glass rounded-tl-md'
          }`}
        >
          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className={`flex flex-wrap gap-2 mb-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
              {message.attachments.map((att, i) => (
                <div key={i} className="relative group/att">
                  {att.type.startsWith('image/') ? (
                    <div className="w-48 h-auto rounded-lg overflow-hidden border border-berry-200/30">
                      <img src={att.data} alt={att.name} className="w-full h-auto object-cover" />
                    </div>
                  ) : (
                    <div className={`flex items-center gap-2 p-2 rounded-lg border max-w-[200px] ${
                      isUser ? 'bg-white/10 border-white/20' : 'bg-berry-50 border-berry-200/50'
                    }`}>
                      <FileText className={`w-5 h-5 shrink-0 ${isUser ? 'text-white/80' : 'text-berry-400'}`} />
                      <span className={`text-[11px] truncate ${isUser ? 'text-white' : 'text-berry-700'}`}>{att.name}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {isUser ? (
            <p className="text-[13px] leading-relaxed">{message.content}</p>
          ) : (
            <div>{renderContent(message.content)}</div>
          )}
        </div>

        {/* Timestamp & Actions */}
        <div className={`flex items-center gap-2 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${isUser ? 'justify-end' : ''}`}>
          {!isUser && (
            <button
              onClick={() => isSpeaking ? stop() : speak(message.content)}
              className={`p-1 rounded-md transition-colors ${
                isSpeaking 
                  ? 'bg-berry-100 text-berry-600' 
                  : 'hover:bg-white/60 text-berry-400 hover:text-berry-600'
              }`}
              title={isSpeaking ? "Stop speaking" : "Read aloud"}
            >
              {isSpeaking ? <Square className="w-3.5 h-3.5 fill-current" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          )}
          <p className="text-[10px] text-berry-300 px-1">
            {formatTime(message.createdAt)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
