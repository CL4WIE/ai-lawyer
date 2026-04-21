export type Role = "user" | "assistant";

export interface Message {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}

export type DocumentTemplate = "complaint" | "request" | "custom";

export interface LegalDocument {
  id: string;
  title: string;
  template: DocumentTemplate;
  content: string;
  updatedAt: number;
}
