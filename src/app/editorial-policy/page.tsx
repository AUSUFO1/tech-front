import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Editorial Policy | GizPulse",
  description: "GizPulse Editorial Policy",
};

export default function EditorialPolicyPage() {
  return (
    <main className="mx-auto w-full max-w-[1040px] px-5 pb-16 pt-8 sm:px-8 lg:pt-10">
      <h1 className="font-display text-[2.7rem] font-bold tracking-[-0.06em] text-primary-text sm:text-[3.2rem]">
        Editorial Policy
      </h1>
      <p className="mt-3 text-[0.9rem] font-semibold uppercase tracking-[0.12em] text-muted-text">Updated April 13, 2026</p>

      <div className="mt-8 space-y-8 text-[1rem] leading-8 text-muted-text">
        <section>
          <h2 className="font-display text-[1.65rem] font-bold tracking-[-0.04em] text-primary-text">Our Editorial Mission</h2>
          <p className="mt-3">
            GizPulse publishes news, guides, jobs, and opportunities for ambitious readers in Nigeria and across the world. Our goal
            is to produce useful, clear, and responsible coverage that helps readers make better career, learning, and industry
            decisions.
          </p>
        </section>

        <section>
          <h2 className="font-display text-[1.65rem] font-bold tracking-[-0.04em] text-primary-text">Accuracy and Verification</h2>
          <p className="mt-3">
            We aim to verify facts before publication and present information in a fair and context-aware manner. Where a story depends
            on dates, figures, deadlines, eligibility requirements, or policy changes, we aim to confirm those details using the most
            reliable available source before publishing.
          </p>
          <p className="mt-3">
            If a report includes uncertainty, developing facts, or incomplete information, we aim to make that clear rather than present
            assumptions as confirmed facts.
          </p>
        </section>

        <section>
          <h2 className="font-display text-[1.65rem] font-bold tracking-[-0.04em] text-primary-text">Independence and Fairness</h2>
          <p className="mt-3">
            GizPulse makes editorial decisions independently. We do not accept payment in exchange for favorable news coverage, and we
            aim to distinguish clearly between editorial content, sponsored material, and promotional content whenever such distinctions
            are relevant.
          </p>
        </section>

        <section>
          <h2 className="font-display text-[1.65rem] font-bold tracking-[-0.04em] text-primary-text">Sources and Attribution</h2>
          <p className="mt-3">
            We aim to credit original reporting, official announcements, public documents, data sources, and image sources where
            appropriate. When using quotations, statistics, or externally sourced claims, we aim to attribute them responsibly and avoid
            presenting third-party material in a misleading way.
          </p>
        </section>

        <section>
          <h2 className="font-display text-[1.65rem] font-bold tracking-[-0.04em] text-primary-text">Updates and Developing Stories</h2>
          <p className="mt-3">
            Some stories change after publication. When new verified information materially changes a published story, we may update the
            article to reflect the latest accurate position. Significant factual corrections are handled under our{" "}
            <Link href="/corrections-policy" className="text-primary-green underline-offset-4 hover:underline">
              Corrections Policy
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="font-display text-[1.65rem] font-bold tracking-[-0.04em] text-primary-text">Jobs and Opportunities Content</h2>
          <p className="mt-3">
            GizPulse publishes jobs, scholarships, grants, fellowships, and related opportunities for informational purposes. We aim to
            present these listings accurately, but deadlines, eligibility rules, compensation, and application requirements may change
            after publication. Readers should verify important details with the official organization before acting.
          </p>
        </section>

        <section>
          <h2 className="font-display text-[1.65rem] font-bold tracking-[-0.04em] text-primary-text">Authors and Accountability</h2>
          <p className="mt-3">
            GizPulse aims to publish under clear bylines wherever possible. Author pages identify the individual contributor or
            the editorial desk responsible for the work. Where a story is published under an editorial byline, GizPulse remains
            accountable for its accuracy, sourcing, updates, and corrections.
          </p>
        </section>

        <section>
          <h2 className="font-display text-[1.65rem] font-bold tracking-[-0.04em] text-primary-text">Reader Feedback</h2>
          <p className="mt-3">
            We welcome feedback that improves accuracy, clarity, or fairness. If you believe a published article contains an error or
            requires clarification, contact us and include the article link, the issue identified, and any supporting source you want us
            to review.
          </p>
        </section>

        <section>
          <h2 className="font-display text-[1.65rem] font-bold tracking-[-0.04em] text-primary-text">Contact</h2>
          <p className="mt-3">
            For editorial questions, corrections, or policy-related concerns, contact{" "}
            <a className="text-primary-green underline-offset-4 hover:underline" href="mailto:support@gizpulse.com">
              support@gizpulse.com
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
