import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

interface Params {
  params: { id: string };
}

async function getOwnedChat(id: string, userId: string) {
  const chat = await prisma.chat.findUnique({ where: { id } });
  if (!chat || chat.userId !== userId) return null;
  return chat;
}

export async function GET(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const chat = await getOwnedChat(params.id, session.user.id);
  if (!chat) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ shareId: chat.shareId });
}

export async function POST(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const chat = await getOwnedChat(params.id, session.user.id);
  if (!chat) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (chat.shareId) {
    return NextResponse.json({ shareId: chat.shareId });
  }

  const updated = await prisma.chat.update({
    where: { id: chat.id },
    data: { shareId: randomUUID().replace(/-/g, "") },
  });

  return NextResponse.json({ shareId: updated.shareId });
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const chat = await getOwnedChat(params.id, session.user.id);
  if (!chat) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.chat.update({ where: { id: chat.id }, data: { shareId: null } });

  return NextResponse.json({ ok: true });
}
