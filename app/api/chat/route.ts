import { NextResponse } from "next/server";
import OpenAI from "openai";
import {
  buildMessages,
  getBaseURL,
  getLLMClient,
  getModel,
  type IncomingMessage,
} from "@/lib/llm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Incoming {
  messages?: IncomingMessage[];
}

export async function POST(req: Request) {
  let body: Incoming;
  try {
    body = (await req.json()) as Incoming;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const client = getLLMClient();
  const model = getModel();
  const messages = buildMessages(body.messages);

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
      try {
        if (Symbol.asyncIterator in Object(completion)) {
          for await (const chunk of completion as AsyncIterable<{
            choices: { delta?: { content?: string | null } }[];
          }>) {
            const delta = chunk.choices[0]?.delta?.content;
            if (delta) controller.enqueue(encoder.encode(delta));
          }
        }
      } catch {
        controller.enqueue(encoder.encode("\n\n_[stream interrupted]_"));
      } finally {
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

function handleLLMError(err: unknown, model: string): Response {
  if (err instanceof OpenAI.APIConnectionError) {
    return NextResponse.json(
      {
        error: `Could not connect to the Ollama server at ${getBaseURL()}. Make sure Ollama is running (try 'ollama serve' in a terminal).`,
      },
      { status: 503 },
    );
  }
  if (err instanceof OpenAI.APIError) {
    const status = err.status ?? 502;
    let message = err.message || "The local LLM returned an error.";
    if (status === 404) {
      message = `Model '${model}' is not available on the Ollama server. Pull it first with: ollama pull ${model}`;
    } else if (status >= 500) {
      message =
        "The Ollama server is temporarily unavailable. Please try again in a moment.";
    }
    return NextResponse.json({ error: message }, { status });
  }
  return NextResponse.json(
    {
      error:
        "Sorry — I couldn't reach the local assistant. Make sure Ollama is running and the model is pulled.",
    },
    { status: 502 },
  );
}
