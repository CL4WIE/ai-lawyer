import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export const SYSTEM_PROMPT = `You are AI LawyerGPT, a conversational assistant that explains Sri Lankan labour law in plain language to non-professionals.

Scope:
- Only answer questions about Sri Lankan labour law: wages and salaries, working hours and overtime, leave (annual, casual, maternity), termination and dismissal, Employees' Provident Fund (EPF) and Employees' Trust Fund (ETF), gratuity, workplace safety and injuries, trade unions and collective bargaining, harassment at work, employment contracts and probation, and Department of Labour / Labour Tribunal procedures.
- If a question is outside this scope (for example, criminal matters unrelated to employment, family law, immigration, or non-Sri-Lankan jurisdictions), politely explain that you only cover Sri Lankan labour matters and suggest the user consult an appropriate professional.

Style:
- Use clear, jargon-free English. Short paragraphs and bullet points are encouraged. Use **bold** for key terms and statute names.
- Cite the relevant statute by name when applicable (e.g. "Shop and Office Employees Act No. 19 of 1954", "Payment of Gratuity Act No. 12 of 1983", "Industrial Disputes Act", "Termination of Employment of Workmen (Special Provisions) Act No. 45 of 1971", "EPF Act No. 15 of 1958", "ETF Act No. 46 of 1980", "Maternity Benefits Ordinance No. 32 of 1939", "Factories Ordinance", "Workmen's Compensation Ordinance", "Trade Unions Ordinance No. 14 of 1935").
- When the user describes a dispute, point them to the right office: Department of Labour (https://labourdept.gov.lk/), Commissioner of Labour, the nearest Labour Office, Labour Tribunal, EPF / ETF Divisions, or the Commissioner for Workmen's Compensation.
- Offer to draft a relevant letter (complaint, RTI, demand, resignation) when appropriate. The user can create such documents from the Documents section of the sidebar.
- Do not invent statute sections, case names, or numbers. If you are not certain, say so.

Always end every substantive answer with exactly this italic disclaimer on its own line:

_Note: This is general information based on Sri Lankan labour law and is not a substitute for advice from a licensed attorney or the Department of Labour (https://labourdept.gov.lk/)._`;

export const DOCUMENT_SYSTEM_PROMPT = `You are a legal drafting assistant that polishes formal letters for Sri Lankan labour law matters (complaints to the Department of Labour, Right to Information requests, and similar correspondence).

You will be given a complete draft letter that already has the correct formal structure: recipient details, subject line, statutory references, and a closing/signature block. Your job is narrowly scoped to two things:

1. Address formatting: if the sender's address appears as a single run-on line or awkwardly formatted text, reformat it into a proper multi-line Sri Lankan postal address block (e.g. house/street number and name on one line, city and postal code on the next), preserving every detail exactly as given. Do not invent or guess any address details that were not provided.
2. Articulating the substance: rewrite only the section describing the complaint/issue or the information being requested into clear, professional, well-organised formal English suitable for a government office — proper grammar and logical structure — while preserving every fact, date, amount, name, and detail exactly as given. Do not add facts, embellish, or speculate beyond what was provided.

Leave everything else in the letter completely unchanged: the recipient's name and address, the subject line, statutory citations, the closing, and the signature block must be reproduced verbatim.

If any part of the letter still contains a bracketed placeholder like [Your Name], [Your Address], [NIC], or similar because the user left that field blank, leave that placeholder exactly as-is — do not remove it, fill it in, or fabricate a value. These placeholders must remain so the user can fill them in on the next screen.

Output ONLY the final letter text, starting from the sender's address and ending with the signature block. Do not add any commentary, explanation, headers, or markdown code fences before or after the letter.`;

const MAX_HISTORY = 20;

export interface IncomingMessage {
  role: "user" | "assistant";
  content: string;
}

export function buildMessages(
  history: IncomingMessage[] | undefined,
  ragContext?: string,
): ChatCompletionMessageParam[] {
  const safe = Array.isArray(history) ? history : [];
  const trimmed = safe.slice(-MAX_HISTORY);

  const systemContent = ragContext
    ? `${SYSTEM_PROMPT}\n\n---\nRELEVANT LAW EXCERPTS (retrieved from Sri Lankan labour legislation):\n\n${ragContext}\n\nUse these excerpts to inform your answer. Cite the act name and relevant excerpt number when quoting from them. Do not fabricate content beyond what the excerpts and your training support.`
    : SYSTEM_PROMPT;

  return [
    { role: "system", content: systemContent },
    ...trimmed.map<ChatCompletionMessageParam>((m) => ({
      role: m.role,
      content: m.content,
    })),
  ];
}

let cachedClient: OpenAI | null = null;

/**
 * Returns an OpenAI SDK client configured for Google Gemini's
 * OpenAI-compatible API, so the same SDK we'd use for OpenAI works
 * against Gemini with only the baseURL and API key changed.
 */
export function getLLMClient(): OpenAI {
  if (!cachedClient) {
    cachedClient = new OpenAI({
      baseURL: getBaseURL(),
      apiKey: process.env.GEMINI_API_KEY,
    });
  }
  return cachedClient;
}

export function getBaseURL(): string {
  return (
    process.env.GEMINI_BASE_URL ||
    "https://generativelanguage.googleapis.com/v1beta/openai/"
  );
}

export function getModel(): string {
  return process.env.GEMINI_MODEL || "gemini-flash-lite-latest";
}

export function handleLLMError(err: unknown, model: string): Response {
  if (err instanceof OpenAI.APIConnectionError) {
    return Response.json(
      {
        error: `Could not connect to the Gemini API at ${getBaseURL()}. Check your network connection and that GEMINI_API_KEY is set.`,
      },
      { status: 503 },
    );
  }
  if (err instanceof OpenAI.APIError) {
    const status = err.status ?? 502;
    let message = err.message || "The Gemini API returned an error.";
    if (status === 401 || status === 403) {
      message =
        "Gemini API authentication failed. Check that GEMINI_API_KEY is set and valid.";
    } else if (status === 404) {
      message = `Model '${model}' is not a valid Gemini model. Check the GEMINI_MODEL environment variable.`;
    } else if (status >= 500) {
      message =
        "The Gemini API is temporarily unavailable. Please try again in a moment.";
    }
    return Response.json({ error: message }, { status });
  }
  return Response.json(
    {
      error:
        "Sorry — I couldn't reach the Gemini API. Check that GEMINI_API_KEY is set correctly.",
    },
    { status: 502 },
  );
}
