import Link from "next/link";
import { Scale } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { toWireChat } from "@/lib/serialize";
import { MessageList } from "@/components/chat/MessageList";

interface Props {
  params: { shareId: string };
}

export default async function SharedChatPage({ params }: Props) {
  const chatRecord = await prisma.chat.findUnique({
    where: { shareId: params.shareId },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  if (!chatRecord) {
    return (
      <main className="flex min-h-screen w-full flex-col items-center justify-center gap-3 bg-canvas px-4 text-center">
        <Scale className="h-6 w-6 text-subtle" strokeWidth={1.75} />
        <h1 className="text-lg font-semibold text-ink">
          This shared conversation could not be found.
        </h1>
        <p className="text-sm text-subtle">
          The link may be wrong, or the owner has stopped sharing it.
        </p>
        <Link
          href="/"
          className="mt-2 text-sm font-medium text-accent hover:underline"
        >
          Go to LegalEase
        </Link>
      </main>
    );
  }

  const chat = toWireChat(chatRecord);

  return (
    <main className="min-h-screen w-full bg-canvas">
      <header className="sticky top-0 z-10 border-b border-border/70 bg-canvas/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-content items-center justify-between px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-[15px] font-semibold tracking-tight"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-accentInk">
              <Scale className="h-4 w-4" strokeWidth={2} />
            </span>
            <span>LegalEase</span>
          </Link>
          <span className="text-xs text-subtle">Shared conversation · read-only</span>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 pt-4">
        <h1 className="hero-headline text-2xl font-normal text-ink">{chat.title}</h1>
      </div>

      <MessageList messages={chat.messages} />

      <div className="mx-auto max-w-3xl px-4 pb-10">
        <p className="border-t border-border/70 pt-4 text-center text-xs text-subtle">
          This is a read-only, shared view of a LegalEase conversation.
          LegalEase provides general information about Sri Lankan labour law
          and is not a substitute for advice from a licensed attorney.
        </p>
      </div>
    </main>
  );
}
