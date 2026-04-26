import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility | GizPulse",
  description: "GizPulse Accessibility Statement",
};

export default function AccessibilityPage() {
  return (
    <main className="mx-auto w-full max-w-[980px] px-5 pb-16 pt-8 sm:px-8 lg:pt-10">
      <h1 className="font-display text-[2.7rem] font-bold tracking-[-0.06em] text-primary-text sm:text-[3.2rem]">
        Accessibility
      </h1>
      <p className="mt-3 text-[0.9rem] font-semibold uppercase tracking-[0.12em] text-muted-text">
        Updated April 10, 2026
      </p>

      <div className="mt-8 space-y-7 text-[1rem] leading-8 text-muted-text">
        <p>
          GizPulse is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user
          experience for everyone and strive to comply with relevant accessibility standards.
        </p>

        <p>
          The Web Content Accessibility Guidelines (WCAG), available at{" "}
          <a className="text-primary-green underline-offset-4 hover:underline" href="https://www.w3.org/WAI/standards-guidelines/wcag/">
            https://www.w3.org/WAI/standards-guidelines/wcag/
          </a>
          , define requirements for improving accessibility across digital products. We aim to align with WCAG 2.1 Level AA.
        </p>

        <section>
          <h2 className="font-display text-[1.6rem] font-bold tracking-[-0.04em] text-primary-text">Accessibility Feedback</h2>
          <p className="mt-3">We welcome your feedback about accessibility barriers on any GizPulse page.</p>
          <ul className="mt-3 list-disc pl-6">
            <li>
              Email:{" "}
              <a className="text-primary-green underline-offset-4 hover:underline" href="mailto:support@gizpulse.com">
                support@gizpulse.com
              </a>
            </li>
            <li>Postal address: GizPulse, Lagos, Nigeria</li>
          </ul>
          <p className="mt-3">We try to respond within 5 business days.</p>
        </section>
      </div>
    </main>
  );
}
