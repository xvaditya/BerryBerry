import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, Mic, X, FileText, Square } from 'lucide-react';
import type { ChatInputProps } from '../types';
import IconButton from './IconButton';
import { useDictation } from '../hooks/useDictation';

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isListening, startListening, stopListening } = useDictation(
    useCallback((transcript) => {
      setValue((prev) => (prev ? prev + ' ' + transcript : transcript));
    }, [])
  );

  const handleMicClick = () => {
    if (isListening) stopListening();
    else startListening();
  };

  const canSend = (value.trim().length > 0 || files.length > 0) && !disabled;

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 150) + 'px';
  }, [value]);

  const handleSend = () => {
    if (!canSend) return;
    onSend(value.trim(), files);
    setValue('');
    setFiles([]);
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)].slice(0, 3)); // Max 3 files
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => setIsDragging(false);
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const droppedFiles = Array.from(e.dataTransfer.files).filter(f => 
        f.type.startsWith('image/') || f.type === 'application/pdf' || f.type === 'text/plain'
      );
      setFiles(prev => [...prev, ...droppedFiles].slice(0, 3));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="px-4 pb-4 pt-2 md:px-6 md:pb-6"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          animate={{
            boxShadow: isFocused
              ? '0 0 0 2px rgba(255,45,94,0.15), 0 8px 40px rgba(0,0,0,0.06)'
              : '0 8px 32px rgba(0,0,0,0.04)',
          }}
          transition={{ duration: 0.25 }}
          className={`
            flex flex-col gap-2 p-2 rounded-2xl
            bg-white/80 backdrop-blur-xl
            border transition-colors duration-200
            ${isFocused || isDragging ? 'border-berry-200/60' : 'border-berry-100/40'}
            ${isDragging ? 'bg-berry-50/80 ring-2 ring-berry-300 ring-offset-2' : ''}
          `}
        >
          {/* File Previews */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex gap-2 overflow-x-auto pb-1 px-1 mt-1"
              >
                {files.map((file, i) => (
                  <div key={i} className="relative group shrink-0">
                    {file.type.startsWith('image/') ? (
                      <div className="w-14 h-14 rounded-lg bg-berry-100 overflow-hidden border border-berry-200">
                        <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-berry-50 border border-berry-200 flex flex-col items-center justify-center p-1">
                        <FileText className={`w-5 h-5 ${file.type === 'application/pdf' ? 'text-red-400' : 'text-berry-400'} mb-1`} />
                        <span className="text-[8px] text-berry-600 truncate w-full text-center">{file.name}</span>
                      </div>
                    )}
                    <button
                      onClick={() => removeFile(i)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white rounded-full border border-berry-200 flex items-center justify-center text-berry-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-berry-50"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-end gap-2">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              accept="image/*,application/pdf,text/plain"
              onChange={handleFileChange}
            />

            {/* Attachment */}
            <IconButton
              icon={<Paperclip className="w-4 h-4" />}
              label="Attach file"
              onClick={() => fileInputRef.current?.click()}
              variant="ghost"
              size="sm"
              className="mb-0.5"
            />

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Ask me anything about English..."
            rows={1}
            disabled={disabled}
            className="flex-1 resize-none bg-transparent text-[14px] text-berry-900
                       placeholder:text-berry-300 leading-relaxed py-2 px-1
                       focus:outline-none disabled:opacity-50
                       max-h-[150px] scrollbar-thin"
          />

          {/* Mic */}
          <div className="relative mb-0.5">
            {isListening && (
              <motion.div
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute inset-0 bg-red-400 rounded-full"
              />
            )}
            <IconButton
              icon={isListening ? <Square className="w-4 h-4 fill-current" /> : <Mic className="w-4 h-4" />}
              label={isListening ? "Stop listening" : "Voice input"}
              variant={isListening ? "primary" : "ghost"}
              onClick={handleMicClick}
              size="sm"
              className={`relative z-10 ${isListening ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30' : ''}`}
            />
          </div>

          {/* Send */}
          <AnimatePresence mode="wait">
            <motion.div
              key={canSend ? 'active' : 'inactive'}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="mb-0.5"
            >
              <IconButton
                icon={<Send className="w-4 h-4" />}
                onClick={handleSend}
                label="Send message"
                variant={canSend ? 'primary' : 'default'}
                size="sm"
                disabled={!canSend}
              />
            </motion.div>
          </AnimatePresence>
        </div>
        </motion.div>

        {/* Disclaimer */}
        <p className="text-center text-[10px] text-berry-300 mt-2">
          BerryBerry can make mistakes. Verify important information.
        </p>
      </div>
    </motion.div>
  );
}
