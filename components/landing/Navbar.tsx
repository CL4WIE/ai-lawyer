import Link from "next/link";
import { Scale } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-canvas/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-content items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-[15px] font-semibold tracking-tight"
        >
          <Scale className="h-5 w-5" strokeWidth={1.75} />
          <span>AI Lawyer</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted md:flex">
          <a href="#product" className="hover:text-ink">
            Product
          </a>
          <a href="#documents" className="hover:text-ink">
            Documents
          </a>
          <a href="#about" className="hover:text-ink">
            About
          </a>
        </nav>
        <Link
          href="/chat"
          className="inline-flex h-9 items-center rounded-full bg-ink px-4 text-sm font-medium text-white transition hover:bg-black/85"
        >
          Try AI LawyerGPT
        </Link>
      </div>
    </header>
  );
}
