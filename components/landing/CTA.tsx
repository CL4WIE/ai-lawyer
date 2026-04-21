import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section id="about" className="border-b border-border/70 bg-surface">
      <div className="mx-auto max-w-content px-6 py-24 text-center md:py-32">
        <h2 className="hero-headline mx-auto max-w-3xl text-[36px] font-normal text-ink md:text-[56px]">
          Improved access to legal information, for everyone.
        </h2>
        <p className="mx-auto mt-6 max-w-reading text-lg text-muted">
          AI Lawyer is built for non-professionals who need quick, understandable
          answers. It&apos;s a companion to — not a replacement for — licensed
          legal counsel.
        </p>
        <div className="mt-10 flex justify-center">
          <Link
            href="/chat"
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[15px] font-medium text-white transition hover:bg-black/85"
          >
            Open AI LawyerGPT
            <ArrowRight
              className="h-4 w-4 transition group-hover:translate-x-0.5"
              strokeWidth={2}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
