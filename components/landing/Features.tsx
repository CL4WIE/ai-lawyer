import { BookOpen, Scale, FileText } from "lucide-react";
import type { ReactNode } from "react";

interface FeatureRowProps {
  eyebrow: string;
  title: string;
  body: string;
  id?: string;
  reverse?: boolean;
  visual: ReactNode;
}

function FeatureRow({
  eyebrow,
  title,
  body,
  id,
  reverse,
  visual,
}: FeatureRowProps) {
  return (
    <section
      id={id}
      className="border-b border-border/70 py-20 md:py-28"
    >
      <div className="mx-auto grid max-w-content grid-cols-1 items-center gap-12 px-6 md:grid-cols-2 md:gap-16">
        <div className={reverse ? "md:order-2" : ""}>
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-subtle">
            {eyebrow}
          </p>
          <h2 className="hero-headline text-[34px] font-normal text-ink md:text-[48px]">
            {title}
          </h2>
          <p className="mt-6 max-w-reading text-lg text-muted">{body}</p>
        </div>
        <div className={reverse ? "md:order-1" : ""}>{visual}</div>
      </div>
    </section>
  );
}

function VisualCard({
  icon,
  lines,
}: {
  icon: ReactNode;
  lines: string[];
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-8">
      <div className="mb-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink text-white">
        {icon}
      </div>
      <div className="space-y-3">
        {lines.map((line, i) => (
          <div
            key={i}
            className="rounded-xl bg-canvas px-4 py-3 text-sm text-ink shadow-sm ring-1 ring-border/60"
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Features() {
  return (
    <>
      <FeatureRow
        id="product"
        eyebrow="Plain language"
        title="Understand labour law in everyday words."
        body="Sri Lankan statutes like the Shop and Office Employees Act, the Wages Boards Ordinance, and the Industrial Disputes Act — rephrased into clear, jargon-free explanations. Ask in the way you'd ask a friend, get answers you can actually act on."
        visual={
          <VisualCard
            icon={<BookOpen className="h-5 w-5" strokeWidth={1.75} />}
            lines={[
              "My employer hasn't paid my salary for 2 months. What are my rights?",
              "Under the Shop and Office Employees Act, wages must be paid on the agreed date…",
              "Would you like me to draft a complaint to the Labour Department?",
            ]}
          />
        }
      />
      <FeatureRow
        eyebrow="Know your rights"
        title="Built for Sri Lankan workers."
        body="Ask about unpaid wages, overtime, annual and maternity leave, EPF and ETF, gratuity, termination, workplace safety, and trade union rights. The assistant keeps context across the conversation so follow-up questions just work."
        reverse
        visual={
          <VisualCard
            icon={<Scale className="h-5 w-5" strokeWidth={1.75} />}
            lines={[
              "I was dismissed after 3 years without a reason. Can I fight this?",
              "Under the Termination Act, non-disciplinary termination needs the Commissioner's approval…",
              "You can apply to a Labour Tribunal within 6 months.",
            ]}
          />
        }
      />
      <FeatureRow
        id="documents"
        eyebrow="Documents"
        title="Draft Labour Department letters in minutes."
        body="From a complaint to the Commissioner of Labour about unpaid wages, to an EPF/ETF arrears letter or a Right to Information request to the Department of Labour — pick a template, fill in your details, and download a clean draft ready to sign."
        visual={
          <VisualCard
            icon={<FileText className="h-5 w-5" strokeWidth={1.75} />}
            lines={[
              "Complaint to the Commissioner of Labour — Unpaid Salary",
              "EPF / ETF Arrears Complaint Letter",
              "RTI Request — Department of Labour",
            ]}
          />
        }
      />
    </>
  );
}
