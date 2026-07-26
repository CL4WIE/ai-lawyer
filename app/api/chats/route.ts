import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { toWireChat } from "@/lib/serialize";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const chats = await prisma.chat.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(chats.map((c) => toWireChat(c)));
}

interface CreateChatBody {
  title?: string;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: CreateChatBody;
  try {
    body = (await req.json()) as CreateChatBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const title = body.title?.trim() || "New chat";

  const chat = await prisma.chat.create({
    data: { userId: session.user.id, title },
  });

  return NextResponse.json(toWireChat(chat));
}
