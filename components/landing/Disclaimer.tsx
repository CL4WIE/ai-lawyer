import { Info } from "lucide-react";

export function Disclaimer() {
  return (
    <div className="border-b border-border/70 bg-canvas">
      <div className="mx-auto flex max-w-content items-start gap-3 px-6 py-6 text-sm text-muted">
        <Info className="mt-0.5 h-4 w-4 flex-shrink-0" strokeWidth={1.75} />
        <p>
          AI Lawyer provides general legal information based on Sri Lankan law
          and is not a substitute for advice from a licensed attorney. For
          binding legal matters, please consult a qualified professional.
        </p>
      </div>
    </div>
  );
}
