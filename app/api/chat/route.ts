import { NextResponse } from "next/server";
import { getMockAnswer } from "@/lib/mockResponses";

export const runtime = "nodejs";

interface Incoming {
  messages?: { role: "user" | "assistant"; content: string }[];
}

export async function POST(req: Request) {
  let body: Incoming = {};
  try {
    body = (await req.json()) as Incoming;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const answer = getMockAnswer(lastUser?.content ?? "");

  await new Promise((r) => setTimeout(r, 650));

  return NextResponse.json({
    role: "assistant" as const,
    content: answer,
  });
}
