import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { toWireDocument } from "@/lib/serializeDocument";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const documents = await prisma.document.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(documents.map(toWireDocument));
}

interface CreateDocumentBody {
  title?: string;
  template?: string;
  content?: string;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: CreateDocumentBody;
  try {
    body = (await req.json()) as CreateDocumentBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.title || !body.template || typeof body.content !== "string") {
    return NextResponse.json({ error: "Invalid document." }, { status: 400 });
  }

  const document = await prisma.document.create({
    data: {
      userId: session.user.id,
      title: body.title,
      template: body.template,
      content: body.content,
    },
  });

  return NextResponse.json(toWireDocument(document));
}
