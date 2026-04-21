"use client";

import { useEffect, useRef } from "react";
import { Scale } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import type { Message } from "@/types";

interface Props {
  messages: Message[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: Props) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, isLoading]);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-2 px-4 pb-6 pt-6">
      {messages.map((m) => (
        <MessageBubble key={m.id} message={m} />
      ))}
      {isLoading && (
        <div className="flex items-start gap-3 py-2">
          <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-border bg-canvas text-ink">
            <Scale className="h-4 w-4" strokeWidth={1.75} />
          </div>
          <div className="flex items-center gap-1 pt-3">
            <span className="h-2 w-2 animate-pulse rounded-full bg-subtle" />
            <span
              className="h-2 w-2 animate-pulse rounded-full bg-subtle"
              style={{ animationDelay: "120ms" }}
            />
            <span
              className="h-2 w-2 animate-pulse rounded-full bg-subtle"
              style={{ animationDelay: "240ms" }}
            />
          </div>
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}
