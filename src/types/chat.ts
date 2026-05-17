// ============================================================
// BerryBerry — Chat Data Types
// ============================================================

export interface Chat {
  id: string;
  title: string;
  createdAt: number;
}

export interface Attachment {
  id: string;
  name: string;
  type: string; // mime type
  data: string; // Base64 dataURL
}

export interface Message {
  id: string;
  chatId: string;
  role: 'user' | 'assistant';
  content: string;
  attachments?: Attachment[];
  createdAt: number;
}
