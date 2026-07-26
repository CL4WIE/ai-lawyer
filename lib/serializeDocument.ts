import type { Document as PrismaDocument } from "@prisma/client";
import type { DocumentTemplate, LegalDocument } from "@/types";

export function toWireDocument(d: PrismaDocument): LegalDocument {
  return {
    id: d.id,
    title: d.title,
    template: d.template as DocumentTemplate,
    content: d.content,
    updatedAt: d.updatedAt.getTime(),
  };
}
