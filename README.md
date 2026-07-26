# AI Lawyer — Sri Lankan Labour Law

A web-based AI legal conversational assistant focused on **Sri Lankan labour law**. It helps employees understand their rights in everyday language and generates letters and complaints they can send to their employer or the [Department of Labour](https://labourdept.gov.lk/).

This repository contains the **Next.js 14 frontend** (App Router + TypeScript + Tailwind CSS). The chat is powered by the **Google Gemini API** via its OpenAI-compatible Chat Completions API, with streaming responses. Access to `/chat` requires signing in (email + password via Auth.js), and each user's conversations and generated documents are persisted server-side in PostgreSQL, scoped to their account.

## What the assistant covers

The system prompt locks the assistant to Sri Lankan labour law, including:

- **Wages, salary, and deductions** — Shop and Office Employees Act (No. 19 of 1954), Wages Boards Ordinance.
- **Termination and dismissal** — Termination of Employment of Workmen (Special Provisions) Act (No. 45 of 1971), Industrial Disputes Act.
- **Labour Tribunal applications** — reinstatement and compensation for wrongful dismissal.
- **EPF and ETF** — EPF Act (No. 15 of 1958), ETF Act (No. 46 of 1980).
- **Working hours and overtime** — 8/45 hour limits, 1.5x overtime.
- **Annual, casual, and maternity leave** — Maternity Benefits Ordinance (No. 32 of 1939).
- **Gratuity** — Payment of Gratuity Act (No. 12 of 1983).
- **Workplace safety and injury** — Factories Ordinance, Workmen's Compensation Ordinance (No. 19 of 1934).
- **Trade unions and collective bargaining** — Trade Unions Ordinance (No. 14 of 1935).
- **Harassment** — Penal Code s. 345 plus employer duty of care.
- **Contracts, probation, and unlawful contract terms.**

Off-topic questions are politely declined.

## Features

- OpenAI-style marketing landing page at `/` with hero, three labour-law feature sections, disclaimer, and footer.
- ChatGPT-style conversational UI at `/chat`:
  - Collapsible sidebar with **New chat**, **Search chats**, **Documents** section (with a "new document" button), and a recent chats list.
  - `Codex`, `More`, `DALL-E`, and `Explore GPTs` items are intentionally omitted.
  - Empty-state "Ready when you are." headline with labour-law starter suggestions.
  - Streaming assistant replies — tokens appear progressively as they arrive from OpenAI.
  - Rounded pill composer with send, mic (placeholder), and attach (placeholder) buttons.
- Document generation and editing:
  - **Complaint to the Commissioner of Labour** (unpaid wages, unlawful termination, EPF/ETF/gratuity).
  - **Right to Information request** to the Department of Labour.
  - **Blank document** (resignation letters, HR complaints, demand letters, etc.).
  - Viewer at `/chat/documents/[id]` supports inline editing, copy, download as `.txt`, and delete.

## Getting started

### 1. Get a Gemini API key

Create a key at [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey).

### 2. Start a local Postgres database

```bash
docker compose -f ../docker-compose.yml up -d postgres
```

Or point `DATABASE_URL` (below) at any Postgres instance you already have running.

### 3. Run the frontend

```bash
npm install
cp .env.example .env.local
# Edit .env.local: set GEMINI_API_KEY, DATABASE_URL, and AUTH_SECRET
# (generate AUTH_SECRET with: openssl rand -base64 32)
npx prisma migrate dev
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) and sign up for an account at `/signup` — `/chat` requires being signed in.

> If `GEMINI_API_KEY` is missing or invalid, or the configured model name is wrong, the chat will reply with a clear error message telling you exactly what to do.

## Environment variables

Configured in [.env.local](.env.local) (copy from [.env.example](.env.example)):

| Variable             | Required | Default                                                        | Description                                                                          |
| -------------------- | -------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `GEMINI_API_KEY`     | yes      | —                                                                | API key for the Google Gemini API.                                                    |
| `GEMINI_MODEL`       | no       | `gemini-flash-lite-latest`                                       | The Gemini chat model to use.                                                          |
| `GEMINI_EMBED_MODEL` | no       | `gemini-embedding-001`                                           | The Gemini embedding model used for RAG retrieval. Must match the ingestion pipeline. |
| `GEMINI_BASE_URL`    | no       | `https://generativelanguage.googleapis.com/v1beta/openai/`      | Override only for a different OpenAI-compatible endpoint.                             |
| `QDRANT_BASE_URL`    | no       | `http://localhost:6333`                                         | Base URL of the Qdrant vector database used for RAG retrieval.                        |
| `QDRANT_API_KEY`     | no       | —                                                                | Required only when Qdrant is deployed with an API key (production). See [../DEPLOY.md](../DEPLOY.md). |
| `DATABASE_URL`       | yes      | —                                                                 | Postgres connection string for user accounts and chat/document history.               |
| `AUTH_SECRET`        | yes      | —                                                                 | Secret used by Auth.js to sign/encrypt session tokens. Generate with `openssl rand -base64 32`. |
| `AUTH_TRUST_HOST`    | no       | —                                                                 | Set to `true` in production behind a reverse proxy (see [../docker-compose.yml](../docker-compose.yml)). |

## Deploying

For running this app plus Qdrant on a VPS behind HTTPS, see [../DEPLOY.md](../DEPLOY.md).

## Scripts

| Script          | Description                                |
| --------------- | ------------------------------------------ |
| `npm run dev`   | Start the Next.js dev server on port 3000. |
| `npm run build` | Production build.                          |
| `npm start`     | Run the production build.                  |
| `npm run lint`  | Lint with the Next.js ESLint config.       |

## Project structure

```
app/
  layout.tsx                 Root layout, fonts, metadata
  page.tsx                   Landing page
  globals.css                Tailwind + global styles
  login/, signup/             Auth pages
  chat/
    page.tsx                 AI LawyerGPT conversational UI (session-gated)
    documents/[id]/page.tsx  Document viewer/editor (session-gated)
  api/
    auth/[...nextauth]/route.ts  Auth.js handlers
    signup/route.ts              Account creation
    chat/route.ts                 Gemini streaming chat endpoint
    chats/, documents/            CRUD for per-user chats/messages/documents
components/
  landing/                   Navbar, Hero, Features, CTA, Disclaimer, Footer
  auth/                      LoginForm, SignupForm
  chat/                      Sidebar, ChatShell, ChatHeader, MessageList,
                             MessageBubble, Composer, NewDocumentModal,
                             DocumentView, UserCard
  ui/                        Button
lib/
  cn.ts                      class name helper
  llm.ts                     Gemini client (via OpenAI SDK), system prompt, message builder
  prisma.ts                  Prisma client singleton
  serialize.ts, serializeDocument.ts  Prisma → wire-type mappers
  documentTemplates.ts       Labour Department complaint, RTI, and blank templates
prisma/
  schema.prisma              User, Chat, Message, Document models
types/
  index.ts                   Chat, Message, LegalDocument types
auth.ts, auth.config.ts      Auth.js v5 configuration
middleware.ts                Redirects unauthenticated users away from /chat
```

## How the chat works

```
Browser  ──POST /api/chat { chatId, messages }──▶  Route Handler  ──stream:true──▶  Gemini API
   ▲                                │
   └────── ReadableStream of UTF-8 text chunks (Content-Type: text/plain) ─────┘
```

1. `middleware.ts` and `app/chat/page.tsx` require a signed-in session before `/chat` renders.
2. `ChatShell` creates the chat (`POST /api/chats`) if needed, persists the user's message (`POST /api/chats/:id/messages`), then POSTs the conversation history plus `chatId` to `/api/chat`.
3. The route verifies the chat belongs to the signed-in user, prepends the labour-law system prompt, and forwards the last ~20 messages to the Gemini API (OpenAI-compatible `/chat/completions` endpoint) with `stream: true`.
4. The route streams the delta tokens straight back to the client as plain UTF-8 chunks, and once the stream ends, persists the full assistant reply to Postgres via Prisma.
5. The client appends each chunk to the in-progress assistant message as it arrives.
6. Errors (missing/invalid API key, invalid model, 5xx, network) are surfaced as a clear error message in the chat.

## Swapping the model or provider

To use a different Gemini model, set `GEMINI_MODEL=<name>` in `.env.local`. To switch to a different hosted provider (OpenAI, Anthropic, etc.), update `GEMINI_BASE_URL`/`apiKey` handling in [`lib/llm.ts`](lib/llm.ts) — the streaming response contract (`text/plain` chunked stream) stays the same, so the frontend does not need to change.

## Disclaimer

AI Lawyer provides general information about Sri Lankan labour law. It is **not a substitute for advice from a licensed attorney or the Department of Labour** ([labourdept.gov.lk](https://labourdept.gov.lk/)). For binding legal matters, please consult a qualified professional.
