import type { Metadata } from "next";
import { contactEmail } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy | GizPulse",
  description: "GizPulse Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-[980px] px-5 pb-16 pt-8 sm:px-8 lg:pt-10">
      <h1 className="font-display text-[2.7rem] font-bold tracking-[-0.06em] text-primary-text sm:text-[3.2rem]">
        Privacy Policy
      </h1>
      <p className="mt-3 text-[0.9rem] font-semibold uppercase tracking-[0.12em] text-muted-text">Last updated: April 10, 2026</p>

      <div className="mt-8 space-y-8 text-[1rem] leading-8 text-muted-text">
        <section>
          <h2 className="font-display text-[1.65rem] font-bold tracking-[-0.04em] text-primary-text">1. Who We Are</h2>
          <p className="mt-3">
            GizPulse is a digital media platform publishing technology news, guides, job listings, and opportunities for readers in
            Nigeria and globally.
          </p>
        </section>
        <section>
          <h2 className="font-display text-[1.65rem] font-bold tracking-[-0.04em] text-primary-text">2. Information We Collect</h2>
          <p className="mt-3">
            We may collect personal information you provide directly, including your name, email address, and details submitted through
            forms, newsletters, comments, or support requests.
          </p>
          <p className="mt-3">
            We also collect technical and usage data automatically, such as IP address, browser type, device data, referral source,
            pages viewed, and interaction metrics.
          </p>
        </section>
        <section>
          <h2 className="font-display text-[1.65rem] font-bold tracking-[-0.04em] text-primary-text">3. How We Use Information</h2>
          <ul className="mt-3 list-disc pl-6">
            <li>deliver content, newsletters, and updates you request</li>
            <li>analyze traffic, performance, and reader engagement</li>
            <li>improve product experience and editorial quality</li>
            <li>prevent abuse, fraud, and security incidents</li>
            <li>comply with legal obligations</li>
          </ul>
        </section>
        <section>
          <h2 className="font-display text-[1.65rem] font-bold tracking-[-0.04em] text-primary-text">4. Cookies and Tracking</h2>
          <p className="mt-3">
            We use cookies and similar technologies for core functionality, analytics, and advertising/monetization. You may manage
            cookies through browser settings.
          </p>
        </section>
        <section>
          <h2 className="font-display text-[1.65rem] font-bold tracking-[-0.04em] text-primary-text">5. Data Sharing</h2>
          <p className="mt-3">
            We do not sell personal data for money. We may share information with service providers, legal authorities, or as required
            during business changes where legally permitted.
          </p>
        </section>
        <section>
          <h2 className="font-display text-[1.65rem] font-bold tracking-[-0.04em] text-primary-text">6. Your Rights</h2>
          <p className="mt-3">
            Depending on your location, you may have rights to access, correct, delete, or restrict processing of your data, and to
            withdraw consent where applicable.
          </p>
        </section>
        <section>
          <h2 className="font-display text-[1.65rem] font-bold tracking-[-0.04em] text-primary-text">7. Security and Retention</h2>
          <p className="mt-3">
            We use reasonable technical and organizational measures to protect data and retain data only as long as necessary for legal
            or operational purposes.
          </p>
        </section>
        <section>
          <h2 className="font-display text-[1.65rem] font-bold tracking-[-0.04em] text-primary-text">8. Children&apos;s Privacy</h2>
          <p className="mt-3">GizPulse is not intended for children under 13, and we do not knowingly collect their personal data.</p>
        </section>
        <section>
          <h2 className="font-display text-[1.65rem] font-bold tracking-[-0.04em] text-primary-text">9. Changes to This Policy</h2>
          <p className="mt-3">We may update this policy periodically. Material changes will be reflected by the updated date.</p>
        </section>
        <section>
          <h2 className="font-display text-[1.65rem] font-bold tracking-[-0.04em] text-primary-text">10. Contact</h2>
          <p className="mt-3">
            For privacy questions or requests, contact{" "}
            <a className="text-primary-green underline-offset-4 hover:underline" href={`mailto:${contactEmail}`}>
              {contactEmail}
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
