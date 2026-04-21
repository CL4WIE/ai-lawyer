"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChatHeader } from "./ChatHeader";
import { Composer } from "./Composer";
import { MessageList } from "./MessageList";
import { Sidebar } from "./Sidebar";
import { createId, getChat, saveChat } from "@/lib/storage";
import type { Chat, Message } from "@/types";

interface Props {
  initialDocumentId?: string;
}

function makeTitle(firstUserMessage: string): string {
  const trimmed = firstUserMessage.trim().replace(/\s+/g, " ");
  return trimmed.length <= 48 ? trimmed : `${trimmed.slice(0, 45)}…`;
}

export function ChatShell({ initialDocumentId }: Props) {
  const [activeChatId, setActiveChatId] = useState<string | undefined>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarKey, setSidebarKey] = useState(0);

  const chatIdRef = useRef<string | undefined>();
  chatIdRef.current = activeChatId;

  const bumpSidebar = useCallback(() => setSidebarKey((k) => k + 1), []);

  const handleNewChat = useCallback(() => {
    setActiveChatId(undefined);
    setMessages([]);
  }, []);

  const handleSelectChat = useCallback((id: string) => {
    const c = getChat(id);
    if (!c) return;
    setActiveChatId(id);
    setMessages(c.messages);
  }, []);

  const handleSend = useCallback(
    async (text: string) => {
      const userMsg: Message = {
        id: createId(),
        role: "user",
        content: text,
        createdAt: Date.now(),
      };

      let chatId = chatIdRef.current;
      const isFirstMessage = !chatId;
      if (!chatId) {
        chatId = createId();
        chatIdRef.current = chatId;
        setActiveChatId(chatId);
      }

      const nextAfterUser = [...messages, userMsg];
      setMessages(nextAfterUser);
      setIsLoading(true);

      const chatSoFar: Chat = {
        id: chatId,
        title: isFirstMessage ? makeTitle(text) : (getChat(chatId)?.title ?? makeTitle(text)),
        messages: nextAfterUser,
        updatedAt: Date.now(),
      };
      saveChat(chatSoFar);
      bumpSidebar();

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: nextAfterUser.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });
        const data = (await res.json()) as { role: "assistant"; content: string };
        const botMsg: Message = {
          id: createId(),
          role: "assistant",
          content: data.content,
          createdAt: Date.now(),
        };
        const final = [...nextAfterUser, botMsg];
        setMessages(final);
        saveChat({
          ...chatSoFar,
          messages: final,
          updatedAt: Date.now(),
        });
        bumpSidebar();
      } catch {
        const botMsg: Message = {
          id: createId(),
          role: "assistant",
          content:
            "Sorry — I couldn't reach the assistant. Please try again in a moment.",
          createdAt: Date.now(),
        };
        const final = [...nextAfterUser, botMsg];
        setMessages(final);
        saveChat({ ...chatSoFar, messages: final, updatedAt: Date.now() });
        bumpSidebar();
      } finally {
        setIsLoading(false);
      }
    },
    [messages, bumpSidebar],
  );

  const isEmpty = messages.length === 0 && !isLoading;

  const suggestions = useMemo(
    () => [
      "My employer hasn't paid my salary for two months. What can I do?",
      "I was dismissed after 3 years of service without a reason. What are my options?",
      "Am I entitled to gratuity if I resign after 6 years?",
      "Draft a complaint to the Labour Department about unpaid EPF contributions.",
    ],
    [],
  );

  useEffect(() => {
    if (initialDocumentId) {
      handleNewChat();
    }
  }, [initialDocumentId, handleNewChat]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-canvas">
      <Sidebar
        activeChatId={activeChatId}
        activeDocumentId={initialDocumentId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        refreshKey={sidebarKey}
      />
      <main className="flex min-w-0 flex-1 flex-col">
        <ChatHeader onNewChat={handleNewChat} />
        {isEmpty ? (
          <div className="flex flex-1 flex-col">
            <div className="flex flex-1 items-center justify-center">
              <div className="mx-auto w-full max-w-3xl px-4">
                <h1 className="hero-headline text-center text-4xl font-normal text-ink md:text-5xl">
                  Ready when you are.
                </h1>
                <div className="mt-8">
                  <Composer onSend={handleSend} disabled={isLoading} />
                </div>
                <div className="-mt-2 grid grid-cols-1 gap-2 px-4 sm:grid-cols-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSend(s)}
                      className="rounded-2xl border border-border bg-canvas px-4 py-3 text-left text-sm text-ink transition hover:bg-surface"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="chat-scroll flex-1 overflow-y-auto">
              <MessageList messages={messages} isLoading={isLoading} />
            </div>
            <Composer onSend={handleSend} disabled={isLoading} />
          </>
        )}
      </main>
    </div>
  );
}
