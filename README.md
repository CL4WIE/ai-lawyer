# AI Lawyer

A web-based AI legal conversational assistant that provides legal guidance to non-professionals, focused on Sri Lankan law. It understands everyday questions and answers with simplified explanations of users' rights, and it can generate legal documents such as complaint letters and RTI requests.

This repository contains the **Next.js 14 frontend** (App Router + TypeScript + Tailwind CSS). It is intentionally scoped to the UI/UX layer: there is no real AI backend, no authentication, and no database. Assistant replies are produced by a small keyword-based mock, and chats/documents are persisted in the browser's `localStorage`.

## Features

- OpenAI-style marketing landing page at `/` with hero, three feature sections, disclaimer, and footer.
- ChatGPT-style conversational UI at `/chat`:
  - Collapsible sidebar with **New chat**, **Search chats**, **Documents** section (with a "new document" button), and a recent chats list.
  - `Codex`, `More`, `DALL-E`, and `Explore GPTs` items are intentionally omitted.
  - Empty-state "Ready when you are." headline with starter suggestions.
  - Message list with user/assistant bubbles and a streaming-style loading indicator.
  - Rounded pill composer with send, mic (placeholder), and attach (placeholder) buttons.
- Document creation and editing:
  - Templates for **Police Complaint Letter**, **Right to Information Request**, and a **Blank Document**.
  - Modal form fills a template with the user's details and saves it to `localStorage`.
  - Viewer at `/chat/documents/[id]` supports inline editing, copy, download as `.txt`, and delete.
- Mock `/api/chat` route that matches user messages against a small library of Sri Lankan legal topics (tenancy, employment, consumer rights, police complaints, RTI, family law, motor accidents) and returns a plain-language answer with a non-advice disclaimer.

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
  mockResponses.ts           Canned Sri Lankan legal answers
  documentTemplates.ts       Complaint, RTI, and blank document templates
types/
  index.ts                   Chat, Message, LegalDocument types
```

## Extending to a real backend

The UI posts to `POST /api/chat` with `{ messages: [{ role, content }] }` and expects a JSON reply of shape `{ role: "assistant", content: string }`. To plug in a real LLM (e.g., OpenAI or a custom Sri Lankan legal RAG service), replace the body of [`app/api/chat/route.ts`](app/api/chat/route.ts) — no changes are required on the frontend.

## Disclaimer

AI Lawyer provides general legal information based on Sri Lankan law. It is **not a substitute for advice from a licensed attorney**. For binding legal matters, please consult a qualified professional.
