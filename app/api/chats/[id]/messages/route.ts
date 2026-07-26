import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { toWireMessage } from "@/lib/serialize";

interface Params {
  params: { id: string };
}

interface CreateMessageBody {
  role?: string;
  content?: string;
}

export async function POST(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const chat = await prisma.chat.findUnique({ where: { id: params.id } });
  if (!chat || chat.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body: CreateMessageBody;
  try {
    body = (await req.json()) as CreateMessageBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (
    (body.role !== "user" && body.role !== "assistant") ||
    typeof body.content !== "string"
  ) {
    return NextResponse.json({ error: "Invalid message." }, { status: 400 });
  }

  const message = await prisma.message.create({
    data: { chatId: chat.id, role: body.role, content: body.content },
  });
  await prisma.chat.update({
    where: { id: chat.id },
    data: { updatedAt: new Date() },
  });

  return NextResponse.json(toWireMessage(message));
}
