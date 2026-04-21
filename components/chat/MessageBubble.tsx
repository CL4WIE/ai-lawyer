import { Scale } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Message } from "@/types";

interface Props {
  message: Message;
}

function renderContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let listBuffer: string[] = [];

  const flushList = (key: number) => {
    if (listBuffer.length === 0) return;
    elements.push(
      <ul key={`ul-${key}`} className="my-2 list-disc space-y-1 pl-5">
        {listBuffer.map((item, i) => (
          <li key={i}>{renderInline(item.replace(/^\s*[-*]\s+/, ""))}</li>
        ))}
      </ul>,
    );
    listBuffer = [];
  };

  lines.forEach((line, i) => {
    if (/^\s*[-*]\s+/.test(line)) {
      listBuffer.push(line);
      return;
    }
    flushList(i);
    if (line.trim() === "") {
      elements.push(<div key={`sp-${i}`} className="h-2" />);
      return;
    }
    const numbered = /^(\d+)\.\s+(.*)$/.exec(line);
    if (numbered) {
      elements.push(
        <p key={i} className="my-1">
          <span className="font-medium">{numbered[1]}. </span>
          {renderInline(numbered[2])}
        </p>,
      );
      return;
    }
    elements.push(
      <p key={i} className="my-1">
        {renderInline(line)}
      </p>,
    );
  });
  flushList(lines.length);
  return elements;
}

function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*([^*]+)\*\*|_([^_]+)_)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[2]) {
      parts.push(
        <strong key={`b-${key++}`} className="font-semibold">
          {match[2]}
        </strong>,
      );
    } else if (match[3]) {
      parts.push(
        <em key={`i-${key++}`} className="italic text-muted">
          {match[3]}
        </em>,
      );
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

export function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";
  return (
    <div
      className={cn(
        "flex w-full gap-3 py-2",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      {!isUser && (
        <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-border bg-canvas text-ink">
          <Scale className="h-4 w-4" strokeWidth={1.75} />
        </div>
      )}
      <div
        className={cn(
          "max-w-[78%] text-[15px] leading-relaxed",
          isUser
            ? "rounded-3xl rounded-br-md bg-surface px-4 py-2.5 text-ink"
            : "text-ink",
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div>{renderContent(message.content)}</div>
        )}
      </div>
    </div>
  );
}
