"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { ArrowUp, Mic, Plus } from "lucide-react";
import { cn } from "@/lib/cn";

interface Props {
  onSend: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function Composer({ onSend, disabled, placeholder }: Props) {
  const [value, setValue] = useState("");
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`;
  }, [value]);

  function submit(e?: FormEvent) {
    e?.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <form
      onSubmit={submit}
      className="mx-auto w-full max-w-3xl px-4 pb-6 pt-2"
    >
      <div className="flex items-end gap-2 rounded-3xl border border-border bg-canvas px-3 py-2 shadow-composer">
        <button
          type="button"
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-muted hover:bg-sidebarHover hover:text-ink"
          aria-label="Attach"
          title="Attach (coming soon)"
          disabled
        >
          <Plus className="h-5 w-5" strokeWidth={1.75} />
        </button>
        <textarea
          ref={taRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          rows={1}
          placeholder={placeholder ?? "Ask anything"}
          disabled={disabled}
          className="flex-1 resize-none bg-transparent py-2 text-[15px] text-ink placeholder:text-subtle focus:outline-none"
        />
        <button
          type="button"
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-muted hover:bg-sidebarHover hover:text-ink"
          aria-label="Voice input"
          title="Voice input (coming soon)"
          disabled
        >
          <Mic className="h-5 w-5" strokeWidth={1.75} />
        </button>
        <button
          type="submit"
          disabled={!canSend}
          className={cn(
            "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition",
            canSend
              ? "bg-ink text-white hover:bg-black/85"
              : "bg-sidebarHover text-subtle",
          )}
          aria-label="Send"
        >
          <ArrowUp className="h-4 w-4" strokeWidth={2.25} />
        </button>
      </div>
      <p className="mt-2 text-center text-[11px] text-subtle">
        AI Lawyer may make mistakes. Verify important information with a
        qualified attorney.
      </p>
    </form>
  );
}
