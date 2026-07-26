import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { DOCUMENT_SYSTEM_PROMPT, getLLMClient, getModel, handleLLMError } from "@/lib/llm";
import { getTemplate } from "@/lib/documentTemplates";
import type { DocumentTemplate } from "@/types";

interface GenerateBody {
  template?: string;
  values?: Record<string, string>;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: GenerateBody;
  try {
    body = (await req.json()) as GenerateBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const template = getTemplate(body.template as DocumentTemplate);
  if (!template) {
    return NextResponse.json({ error: "Unknown template." }, { status: 400 });
  }

  const values = body.values && typeof body.values === "object" ? body.values : {};
  const skeleton = template.render(values);

  const client = getLLMClient();
  const model = getModel();

  let content: string;
  try {
    const completion = await client.chat.completions.create({
      model,
      temperature: 0.3,
      messages: [
        { role: "system", content: DOCUMENT_SYSTEM_PROMPT },
        {
          role: "user",
          content: `Polish the address formatting and articulate the substance of the following draft letter, following your instructions exactly. Reproduce every other part verbatim.\n\n---\n${skeleton}\n---`,
        },
      ],
    });
    content = completion.choices[0]?.message?.content?.trim() || "";
  } catch (err) {
    return handleLLMError(err, model);
  }

  if (!content) {
    return NextResponse.json({ error: "The assistant returned no content." }, { status: 502 });
  }

  return NextResponse.json({ content });
}
