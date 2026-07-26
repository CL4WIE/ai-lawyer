import type { Chat as PrismaChat, Message as PrismaMessage } from "@prisma/client";
import type { Chat, Message, Role } from "@/types";

export function toWireMessage(m: PrismaMessage): Message {
  return {
    id: m.id,
    role: m.role as Role,
    content: m.content,
    createdAt: m.createdAt.getTime(),
  };
}

export function toWireChat(c: PrismaChat & { messages?: PrismaMessage[] }): Chat {
  return {
    id: c.id,
    title: c.title,
    updatedAt: c.updatedAt.getTime(),
    messages: (c.messages ?? []).map(toWireMessage),
  };
}
