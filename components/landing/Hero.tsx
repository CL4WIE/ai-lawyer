import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/70">
      <div className="mx-auto max-w-content px-6 pb-24 pt-20 md:pb-32 md:pt-28">
        <p className="mb-6 text-sm font-medium uppercase tracking-[0.14em] text-subtle">
          Introducing AI LawyerGPT
        </p>
        <h1 className="hero-headline max-w-4xl text-[44px] font-normal text-ink md:text-[72px]">
          Legal guidance,
          <br />
          in plain language.
        </h1>
        <p className="mt-8 max-w-reading text-lg text-muted md:text-xl">
          A conversational assistant that understands everyday questions and
          answers with simplified explanations of your rights under Sri Lankan
          law. Draft complaint letters and request forms in minutes — without
          hiring a lawyer.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            href="/chat"
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[15px] font-medium text-white transition hover:bg-black/85"
          >
            Try AI LawyerGPT
            <ArrowRight
              className="h-4 w-4 transition group-hover:translate-x-0.5"
              strokeWidth={2}
            />
          </Link>
          <a
            href="#product"
            className="inline-flex h-12 items-center rounded-full border border-border bg-canvas px-6 text-[15px] font-medium text-ink transition hover:bg-surface"
          >
            Learn more
          </a>
        </div>
      </div>
    </section>
  );
}
