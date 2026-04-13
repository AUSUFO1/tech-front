import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Corrections Policy | Techfront",
  description: "Techfront Corrections Policy",
};

export default function CorrectionsPolicyPage() {
  return (
    <main className="mx-auto w-full max-w-[1040px] px-5 pb-16 pt-8 sm:px-8 lg:pt-10">
      <h1 className="font-display text-[2.7rem] font-bold tracking-[-0.06em] text-primary-text sm:text-[3.2rem]">
        Corrections Policy
      </h1>
      <p className="mt-3 text-[0.9rem] font-semibold uppercase tracking-[0.12em] text-muted-text">Updated April 13, 2026</p>

      <div className="mt-8 space-y-8 text-[1rem] leading-8 text-muted-text">
        <section>
          <h2 className="font-display text-[1.65rem] font-bold tracking-[-0.04em] text-primary-text">Our Commitment</h2>
          <p className="mt-3">
            Techfront aims to publish accurate and useful information. When we make a factual mistake, or when a meaningful clarification
            is required, we aim to correct the record promptly and transparently.
          </p>
        </section>

        <section>
          <h2 className="font-display text-[1.65rem] font-bold tracking-[-0.04em] text-primary-text">What We Correct</h2>
          <p className="mt-3">We may correct or clarify content where necessary, including:</p>
          <ul className="mt-3 list-disc pl-6">
            <li>incorrect names, titles, dates, figures, or locations</li>
            <li>incorrect job, scholarship, deadline, or eligibility details</li>
            <li>misleading summaries, captions, or contextual framing</li>
            <li>broken links or materially incorrect source references</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-[1.65rem] font-bold tracking-[-0.04em] text-primary-text">How Corrections Are Handled</h2>
          <p className="mt-3">
            Minor non-material edits, such as grammar, spelling, or formatting improvements, may be made without a formal correction
            note. Material factual corrections may be reflected in the article itself and, where appropriate, accompanied by a clear
            update or correction note.
          </p>
        </section>

        <section>
          <h2 className="font-display text-[1.65rem] font-bold tracking-[-0.04em] text-primary-text">Updates vs Corrections</h2>
          <p className="mt-3">
            Not every change is a correction. Some stories evolve because new verified information becomes available after publication. In
            such cases, Techfront may update the article to reflect the latest position. Corrections are used where previously published
            information was materially wrong or misleading.
          </p>
          <p className="mt-3">
            For general publishing standards, see our{" "}
            <Link href="/editorial-policy" className="text-primary-green underline-offset-4 hover:underline">
              Editorial Policy
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="font-display text-[1.65rem] font-bold tracking-[-0.04em] text-primary-text">How To Request a Correction</h2>
          <p className="mt-3">
            If you believe an article contains a factual error, please send the article link, a short explanation of the issue, and any
            source or evidence that supports your request.
          </p>
        </section>

        <section>
          <h2 className="font-display text-[1.65rem] font-bold tracking-[-0.04em] text-primary-text">Contact</h2>
          <p className="mt-3">
            Correction requests may be sent to{" "}
            <a className="text-primary-green underline-offset-4 hover:underline" href="mailto:support@techfront.com">
              support@techfront.com
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
