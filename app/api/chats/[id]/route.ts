import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { toWireChat } from "@/lib/serialize";

interface Params {
  params: { id: string };
}

export async function GET(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const chat = await prisma.chat.findUnique({
    where: { id: params.id },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  if (!chat || chat.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(toWireChat(chat));
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const chat = await prisma.chat.findUnique({ where: { id: params.id } });
  if (!chat || chat.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.chat.delete({ where: { id: params.id } });

  return NextResponse.json({ ok: true });
}
