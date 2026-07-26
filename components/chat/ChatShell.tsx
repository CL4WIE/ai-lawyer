"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChatHeader } from "./ChatHeader";
import { Composer } from "./Composer";
import { MessageList } from "./MessageList";
import { Sidebar } from "./Sidebar";
import type { Chat, Message } from "@/types";

interface Props {
  initialDocumentId?: string;
  user: { name: string | null; email: string };
}

function makeTitle(firstUserMessage: string): string {
  const trimmed = firstUserMessage.trim().replace(/\s+/g, " ");
  return trimmed.length <= 48 ? trimmed : `${trimmed.slice(0, 45)}…`;
}

async function friendlyErrorMessage(res: Response): Promise<string> {
  let serverMessage = "";
  try {
    const data = (await res.json()) as { error?: string };
    if (data?.error) serverMessage = data.error;
  } catch {
    /* response body was not JSON */
  }
  if (serverMessage) return serverMessage;
  if (res.status === 401)
    return "The OpenAI API key is invalid. Please check your server configuration.";
  if (res.status === 429)
    return "The assistant is currently rate-limited or out of quota. Please try again shortly.";
  if (res.status >= 500)
    return "The assistant service is temporarily unavailable. Please try again in a moment.";
  return "Sorry — I couldn't reach the assistant. Please try again in a moment.";
}

export function ChatShell({ initialDocumentId, user }: Props) {
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

  const handleSelectChat = useCallback(async (id: string) => {
    const res = await fetch(`/api/chats/${id}`);
    if (!res.ok) return;
    const chat = (await res.json()) as Chat;
    setActiveChatId(id);
    setMessages(chat.messages);
  }, []);

  const handleSend = useCallback(
    async (text: string) => {
      const localUserId = `local-${Date.now()}`;
      const userMsg: Message = {
        id: localUserId,
        role: "user",
        content: text,
        createdAt: Date.now(),
      };

      let chatId = chatIdRef.current;
      if (!chatId) {
        const createRes = await fetch("/api/chats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: makeTitle(text) }),
        });
        if (!createRes.ok) return;
        const created = (await createRes.json()) as Chat;
        chatId = created.id;
        chatIdRef.current = chatId;
        setActiveChatId(chatId);
      }

      const assistantId = `local-${Date.now()}-assistant`;
      const assistantPlaceholder: Message = {
        id: assistantId,
        role: "assistant",
        content: "",
        createdAt: Date.now(),
      };

      const nextAfterUser = [...messages, userMsg];
      setMessages([...nextAfterUser, assistantPlaceholder]);
      setIsLoading(true);

      await fetch(`/api/chats/${chatId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "user", content: text }),
      });
      bumpSidebar();

      const finalize = (assistantContent: string) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: assistantContent } : m,
          ),
        );
        bumpSidebar();
      };

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chatId,
            messages: nextAfterUser.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        if (!res.ok || !res.body) {
          const errorMsg = await friendlyErrorMessage(res);
          finalize(errorMsg);
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: acc } : m,
            ),
          );
        }
        acc += decoder.decode();
        if (!acc) {
          acc = "_The assistant returned no content. Please try again._";
        }
        finalize(acc);
      } catch (error) {
        console.error("Error in handleSend", error);
        const errorMsg =
          "Sorry — I couldn't reach the assistant. Please check your connection and try again.";
        finalize(errorMsg);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, bumpSidebar],
  );

  const isEmpty = messages.length === 0;

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
        user={user}
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
              <MessageList messages={messages} />
            </div>
            <Composer onSend={handleSend} disabled={isLoading} />
          </>
        )}
      </main>
    </div>
  );
}
