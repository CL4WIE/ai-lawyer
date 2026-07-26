import Link from "next/link";
import { Scale } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-canvas/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-content items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-[15px] font-semibold tracking-tight"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-accentInk">
            <Scale className="h-4 w-4" strokeWidth={2} />
          </span>
          <span>LegalEase</span>
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
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/chat"
            className="inline-flex h-9 items-center rounded-full bg-accent px-4 text-sm font-medium text-accentInk transition hover:bg-accentHover"
          >
            Try LegalEase
          </Link>
        </div>
      </div>
    </header>
  );
}
