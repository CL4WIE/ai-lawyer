# AI Lawyer — Sri Lankan Labour Law

A web-based AI legal conversational assistant focused on **Sri Lankan labour law**. It helps employees understand their rights in everyday language and generates letters and complaints they can send to their employer or the [Department of Labour](https://labourdept.gov.lk/).

This repository contains the **Next.js 14 frontend** (App Router + TypeScript + Tailwind CSS). The chat is powered by a **locally running [Ollama](https://ollama.com/) server** via its OpenAI-compatible Chat Completions API, with streaming responses. Conversations and generated documents are persisted in the browser's `localStorage` (no auth, no database).

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

### 1. Install and run Ollama

Download Ollama from [https://ollama.com/download](https://ollama.com/download), install it, then pull a model and start the server:

```bash
ollama pull llama3.2
ollama serve   # usually started automatically by the installer
```

You can swap `llama3.2` for any chat-capable model (e.g. `llama3.1`, `qwen2.5`, `mistral`, `phi3`). Update `OLLAMA_MODEL` to match in `.env.local`.

Verify Ollama is reachable:

```bash
curl http://localhost:11434/api/tags
```

### 2. Run the frontend

```bash
npm install
cp .env.example .env.local
# Edit .env.local if Ollama is on a different host/port or you want a different model
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

> If Ollama is not running, or the configured model has not been pulled, the chat will reply with a clear error message telling you exactly what to do.

## Environment variables

Configured in [.env.local](.env.local) (copy from [.env.example](.env.example)):

| Variable           | Required | Default                       | Description                                                                                  |
| ------------------ | -------- | ----------------------------- | -------------------------------------------------------------------------------------------- |
| `OLLAMA_BASE_URL`  | no       | `http://localhost:11434/v1`   | The base URL of Ollama's OpenAI-compatible API. Change this if Ollama runs on another host. |
| `OLLAMA_MODEL`     | no       | `llama3.2`                    | The model name to use. Must already be pulled via `ollama pull <model>`.                    |

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
  chat/
    page.tsx                 AI LawyerGPT conversational UI
    documents/[id]/page.tsx  Document viewer/editor
  api/chat/route.ts          Ollama streaming chat endpoint
components/
  landing/                   Navbar, Hero, Features, CTA, Disclaimer, Footer
  chat/                      Sidebar, ChatShell, ChatHeader, MessageList,
                             MessageBubble, Composer, NewDocumentModal,
                             DocumentView, UserCard
  ui/                        Button
lib/
  cn.ts                      class name helper
  llm.ts                     Ollama client (via OpenAI SDK), system prompt, message builder
  storage.ts                 localStorage persistence (SSR-safe)
  documentTemplates.ts       Labour Department complaint, RTI, and blank templates
types/
  index.ts                   Chat, Message, LegalDocument types
```

## How the chat works

```
Browser  ──POST /api/chat──▶  Route Handler  ──stream:true──▶  Ollama (localhost:11434)
   ▲                                │
   └────── ReadableStream of UTF-8 text chunks (Content-Type: text/plain) ─────┘
```

1. `ChatShell` POSTs the conversation history to `/api/chat`.
2. The route prepends the labour-law system prompt and forwards the last ~20 messages to the local Ollama server (OpenAI-compatible `/v1/chat/completions` endpoint) with `stream: true`.
3. The route streams the delta tokens straight back to the client as plain UTF-8 chunks.
4. The client appends each chunk to the in-progress assistant message and persists the final result to `localStorage`.
5. Errors (Ollama not running, model not pulled, 5xx, network) are surfaced as a clear error message in the chat.

## Swapping the model or provider

To use a different local model, run `ollama pull <name>` and set `OLLAMA_MODEL=<name>` in `.env.local`. To switch to a hosted provider (OpenAI, Anthropic, etc.), update `OLLAMA_BASE_URL` and `apiKey` in [`lib/llm.ts`](lib/llm.ts) — the streaming response contract (`text/plain` chunked stream) stays the same, so the frontend does not need to change.

## Disclaimer

AI Lawyer provides general information about Sri Lankan labour law. It is **not a substitute for advice from a licensed attorney or the Department of Labour** ([labourdept.gov.lk](https://labourdept.gov.lk/)). For binding legal matters, please consult a qualified professional.
