import { Scale } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-canvas">
      <div className="mx-auto flex max-w-content flex-col items-start gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-ink">
          <Scale className="h-4 w-4" strokeWidth={1.75} />
          <span>AI Lawyer</span>
        </div>
        <p className="text-xs text-subtle">
          &copy; {new Date().getFullYear()} AI Lawyer. Built for Sri Lanka.
        </p>
      </div>
    </footer>
  );
}
