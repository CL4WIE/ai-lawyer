"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { TEMPLATES, getTemplate } from "@/lib/documentTemplates";
import type { DocumentTemplate, LegalDocument } from "@/types";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: (doc: LegalDocument) => void;
}

export function NewDocumentModal({ open, onClose, onCreated }: Props) {
  const [templateId, setTemplateId] = useState<DocumentTemplate>("complaint");
  const [values, setValues] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (open) {
      setTemplateId("complaint");
      setValues({});
      setIsGenerating(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const template = getTemplate(templateId);
  if (!template) return null;

  async function handleCreate() {
    if (!template) return;
    const title =
      values.title?.trim() ||
      `${template.label}${values.name ? ` — ${values.name}` : ""}`;

    let content = template.render(values);

    // The blank template has nothing for the LLM to improve (no address or
    // issue field to polish) — skip straight to creating it.
    if (template.id !== "custom") {
      setIsGenerating(true);
      try {
        const genRes = await fetch("/api/documents/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ template: template.id, values }),
        });
        if (genRes.ok) {
          const { content: generated } = (await genRes.json()) as { content: string };
          if (generated) content = generated;
        }
      } catch {
        // fall back to the raw template below
      } finally {
        setIsGenerating(false);
      }
    }

    const res = await fetch("/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, template: template.id, content }),
    });
    if (!res.ok) return;
    const doc = (await res.json()) as LegalDocument;
    onCreated(doc);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-canvas shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold text-ink">New document</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-muted hover:bg-sidebarHover hover:text-ink"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto chat-scroll px-6 py-5">
          <div className="mb-5">
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-subtle">
              Template
            </div>
            <div className="grid gap-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTemplateId(t.id);
                    setValues({});
                  }}
                  className={cn(
                    "rounded-xl border px-4 py-3 text-left transition",
                    templateId === t.id
                      ? "border-accent bg-surface"
                      : "border-border hover:bg-surface",
                  )}
                >
                  <div className="text-sm font-medium text-ink">{t.label}</div>
                  <div className="mt-0.5 text-xs text-muted">
                    {t.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {template.fields.map((f) => (
              <div key={f.id}>
                <label
                  htmlFor={f.id}
                  className="mb-1.5 block text-sm font-medium text-ink"
                >
                  {f.label}
                </label>
                {f.type === "textarea" ? (
                  <textarea
                    id={f.id}
                    value={values[f.id] ?? ""}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [f.id]: e.target.value }))
                    }
                    placeholder={f.placeholder}
                    rows={4}
                    className="w-full resize-none rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-ink placeholder:text-subtle focus:border-accent focus:outline-none"
                  />
                ) : (
                  <input
                    id={f.id}
                    type="text"
                    value={values[f.id] ?? ""}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [f.id]: e.target.value }))
                    }
                    placeholder={f.placeholder}
                    className="w-full rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-ink placeholder:text-subtle focus:border-accent focus:outline-none"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
          <Button variant="secondary" onClick={onClose} disabled={isGenerating}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={isGenerating}>
            {isGenerating ? "Drafting…" : "Create document"}
          </Button>
        </div>
      </div>
    </div>
  );
}
