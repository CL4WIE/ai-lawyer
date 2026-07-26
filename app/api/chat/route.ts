import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  buildMessages,
  getLLMClient,
  getModel,
  handleLLMError,
  type IncomingMessage,
} from "@/lib/llm";
import { retrieveContext } from "@/lib/rag";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Incoming {
  chatId?: string;
  messages?: IncomingMessage[];
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Incoming;
  try {
    body = (await req.json()) as Incoming;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const chatId = body.chatId;
  if (!chatId) {
    return NextResponse.json({ error: "chatId is required." }, { status: 400 });
  }
  const chat = await prisma.chat.findUnique({ where: { id: chatId } });
  if (!chat || chat.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Find the latest user message to use as the RAG query.
  const history = Array.isArray(body.messages) ? body.messages : [];
  const lastUserMessage = [...history].reverse().find((m) => m.role === "user");

  console.log("[Chat] User request:", lastUserMessage?.content ?? "(none)");

  const ragContext = lastUserMessage
    ? await retrieveContext(lastUserMessage.content)
    : "";

  const client = getLLMClient();
  const model = getModel();
  const messages = buildMessages(body.messages, ragContext || undefined);

  console.log("[Chat] System prompt:\n", messages[0]?.content);

  let completion: Awaited<
    ReturnType<typeof client.chat.completions.create>
  >;
  try {
    completion = await client.chat.completions.create({
      model,
      stream: true,
      temperature: 0.3,
      messages,
    });
  } catch (err) {
    return handleLLMError(err, model);
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let fullResponse = "";
      try {
        if (Symbol.asyncIterator in Object(completion)) {
          for await (const chunk of completion as AsyncIterable<{
            choices: { delta?: { content?: string | null } }[];
          }>) {
            const delta = chunk.choices[0]?.delta?.content;
            if (delta) {
              fullResponse += delta;
              controller.enqueue(encoder.encode(delta));
            }
          }
        }
      } catch {
        controller.enqueue(encoder.encode("\n\n_[stream interrupted]_"));
      } finally {
        console.log("[Chat] LLM response:", fullResponse);
        if (fullResponse) {
          await prisma.message.create({
            data: { chatId, role: "assistant", content: fullResponse },
          });
          await prisma.chat.update({
            where: { id: chatId },
            data: { updatedAt: new Date() },
          });
        }
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
