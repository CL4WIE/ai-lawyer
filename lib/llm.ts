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
