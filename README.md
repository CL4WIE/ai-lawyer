# AI Lawyer — Sri Lankan Labour Law

A web-based AI legal conversational assistant focused on **Sri Lankan labour law**. It helps employees understand their rights in everyday language and generates letters and complaints they can send to their employer or the [Department of Labour](https://labourdept.gov.lk/).

This repository contains the **Next.js 14 frontend** (App Router + TypeScript + Tailwind CSS). It is intentionally scoped to the UI/UX layer: there is no real AI backend, no authentication, and no database. Assistant replies are produced by a small keyword-based mock, and chats/documents are persisted in the browser's `localStorage`.

## What the assistant covers

Topics handled by the mock responses are all drawn from Sri Lankan labour statutes and practice:

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

## Features

- OpenAI-style marketing landing page at `/` with hero, three labour-law feature sections, disclaimer, and footer.
- ChatGPT-style conversational UI at `/chat`:
  - Collapsible sidebar with **New chat**, **Search chats**, **Documents** section (with a "new document" button), and a recent chats list.
  - `Codex`, `More`, `DALL-E`, and `Explore GPTs` items are intentionally omitted.
  - Empty-state "Ready when you are." headline with labour-law starter suggestions.
  - Message list with user/assistant bubbles and a loading indicator.
  - Rounded pill composer with send, mic (placeholder), and attach (placeholder) buttons.
- Document generation and editing:
  - **Complaint to the Commissioner of Labour** (unpaid wages, unlawful termination, EPF/ETF/gratuity).
  - **Right to Information request** to the Department of Labour.
  - **Blank document** (resignation letters, HR complaints, demand letters, etc.).
  - Modal form fills the template with the user's details and saves it to `localStorage`.
  - Viewer at `/chat/documents/[id]` supports inline editing, copy, download as `.txt`, and delete.
- Mock `/api/chat` route that matches user messages against Sri Lankan labour-law topics and returns a plain-language answer with a non-advice disclaimer.

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script          | Description                                    |
| --------------- | ---------------------------------------------- |
| `npm run dev`   | Start the Next.js dev server on port 3000.    |
| `npm run build` | Production build.                             |
| `npm start`     | Run the production build.                     |
| `npm run lint`  | Lint with the Next.js ESLint config.          |

## Project structure

```
app/
  layout.tsx                 Root layout, fonts, metadata
  page.tsx                   Landing page
  globals.css                Tailwind + global styles
  chat/
    page.tsx                 AI LawyerGPT conversational UI
    documents/[id]/page.tsx  Document viewer/editor
  api/chat/route.ts          Mock POST endpoint
components/
  landing/                   Navbar, Hero, Features, CTA, Disclaimer, Footer
  chat/                      Sidebar, ChatShell, ChatHeader, MessageList,
                             MessageBubble, Composer, NewDocumentModal,
                             DocumentView, UserCard
  ui/                        Button
lib/
  cn.ts                      class name helper
  storage.ts                 localStorage persistence (SSR-safe)
  mockResponses.ts           Canned Sri Lankan labour-law answers
  documentTemplates.ts       Labour Department complaint, RTI, and blank templates
types/
  index.ts                   Chat, Message, LegalDocument types
```

## Extending to a real backend

The UI posts to `POST /api/chat` with `{ messages: [{ role, content }] }` and expects a JSON reply of shape `{ role: "assistant", content: string }`. To plug in a real LLM (e.g., an OpenAI model, or a custom Sri Lankan labour-law RAG service), replace the body of [`app/api/chat/route.ts`](app/api/chat/route.ts) — no changes are required on the frontend.

## Disclaimer

AI Lawyer provides general information about Sri Lankan labour law. It is **not a substitute for advice from a licensed attorney or the Department of Labour** ([labourdept.gov.lk](https://labourdept.gov.lk/)). For binding legal matters, please consult a qualified professional.
