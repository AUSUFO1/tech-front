import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use | GizPulse",
  description: "GizPulse Terms of Use",
};

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-[1040px] px-5 pb-16 pt-8 sm:px-8 lg:pt-10">
      <h1 className="font-display text-[2.7rem] font-bold tracking-[-0.06em] text-primary-text sm:text-[3.2rem]">Terms of Use</h1>
      <p className="mt-3 text-[0.9rem] font-semibold uppercase tracking-[0.12em] text-muted-text">Updated April 10, 2026</p>

      <div className="mt-8 space-y-8 text-[1rem] leading-8 text-muted-text">
        <section>
          <h2 className="font-display text-[1.65rem] font-bold tracking-[-0.04em] text-primary-text">User Agreement</h2>
          <p className="mt-3">
            These Terms govern your use of GizPulse websites, applications, and services. By using the platform, you agree to these
            Terms and our{" "}
            <Link href="/privacy" className="text-primary-green underline-offset-4 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="font-display text-[1.65rem] font-bold tracking-[-0.04em] text-primary-text">Acceptable Use</h2>
          <p className="mt-3">
            You agree not to misuse the platform through unlawful activity, impersonation, malicious automation, security abuse, or
            infringement of third-party rights.
          </p>
        </section>

        <section>
          <h2 className="font-display text-[1.65rem] font-bold tracking-[-0.04em] text-primary-text">Content and Licensing</h2>
          <p className="mt-3">
            GizPulse owns or licenses platform content except user-submitted materials. By submitting content, you grant GizPulse a
            non-exclusive right to host, display, and distribute it for platform operation.
          </p>
        </section>

        <section>
          <h2 className="font-display text-[1.65rem] font-bold tracking-[-0.04em] text-primary-text">Jobs and Opportunity Disclaimer</h2>
          <p className="mt-3">
            Listings and opportunities are published for informational purposes only. GizPulse does not guarantee employment,
            acceptance, funding, or specific outcomes.
          </p>
        </section>

        <section>
          <h2 className="font-display text-[1.65rem] font-bold tracking-[-0.04em] text-primary-text">Disclaimer and Liability</h2>
          <p className="mt-3">
            Services are provided on an &quot;as is&quot; basis. To the maximum extent permitted by law, GizPulse disclaims warranties and is not
            liable for indirect or consequential damages.
          </p>
        </section>

        <section>
          <h2 className="font-display text-[1.65rem] font-bold tracking-[-0.04em] text-primary-text">Changes to Terms</h2>
          <p className="mt-3">We may update these Terms periodically. Continued use after updates indicates acceptance.</p>
        </section>

        <section>
          <h2 className="font-display text-[1.65rem] font-bold tracking-[-0.04em] text-primary-text">Contact</h2>
          <p className="mt-3">
            For legal or terms-related questions, contact{" "}
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
