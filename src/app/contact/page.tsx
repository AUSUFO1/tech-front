import type {Metadata} from "next";
import Link from "next/link";
import {FaWhatsapp} from "react-icons/fa6";
import {buildPageMetadata} from "@/lib/seo";
import {contactEmail, contactPhones, publicationLocation, socialUrls} from "@/lib/site-config";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact Us | GizPulse",
  description: "Contact GizPulse for editorial inquiries, story tips, corrections, partnerships, advertising, and general support.",
  pathname: "/contact",
});

const inquiryTypes = [
  {
    title: "Editorial Inquiries",
    body: "For questions about a story, article updates, corrections, source material, or editorial feedback.",
  },
  {
    title: "Story Tips & Press Releases",
    body: "Send technology news tips, product updates, founder stories, funding announcements, and opportunity leads.",
  },
  {
    title: "Advertising & Partnerships",
    body: "For sponsored placements, campaign discussions, brand partnerships, and newsletter opportunities.",
  },
  {
    title: "General Support",
    body: "For site questions, newsletter issues, account concerns, or anything else that needs the GizPulse team.",
  },
];

const socialLinks = [
  {label: "Facebook", href: socialUrls.facebook},
  {label: "Instagram", href: socialUrls.instagram},
  {label: "X", href: socialUrls.x},
  {label: "LinkedIn", href: socialUrls.linkedin},
  {label: "YouTube", href: socialUrls.youtube},
];

function getWhatsappHref(phone: string) {
  return `https://wa.me/${phone.replace(/\D/g, "")}`;
}

export default function ContactPage() {
  return (
    <main className="bg-background text-primary-text">
      <section className="mx-auto w-full max-w-[1360px] border-b border-border px-5 py-12 sm:px-8 lg:px-16 lg:py-16">
        <p className="text-[0.74rem] font-bold uppercase tracking-[0.14em] text-primary-green">Contact GizPulse</p>
        <h1 className="mt-5 max-w-[980px] font-display text-[2.2rem] font-bold leading-[1.02] tracking-[-0.05em] text-primary-text sm:text-[3.35rem]">
          Reach the GizPulse team for stories, corrections, partnerships, and support.
        </h1>
        <p className="mt-7 max-w-[820px] text-[1.08rem] leading-8 text-muted-text">
          We welcome useful story tips, reader feedback, partnership requests, and corrections that help us serve our audience better.
        </p>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto grid w-full max-w-[1360px] gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(300px,0.48fr)] lg:px-16 lg:py-14">
          <div className="grid gap-4 md:grid-cols-2">
            {inquiryTypes.map((item) => (
              <article key={item.title} className="border border-border bg-card-background p-5">
                <h2 className="font-display text-[1.55rem] font-bold leading-tight tracking-[-0.04em] text-primary-text">
                  {item.title}
                </h2>
                <p className="mt-3 text-[0.98rem] leading-7 text-muted-text">{item.body}</p>
              </article>
            ))}
          </div>

          <aside className="border border-border bg-card-background p-6">
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-primary-green">Primary Contact</p>
            <a
              href={`mailto:${contactEmail}`}
              className="mt-4 block break-words font-display text-[1.75rem] font-bold leading-tight tracking-[-0.04em] text-primary-text transition-colors hover:text-primary-green"
            >
              {contactEmail}
            </a>

            <div className="mt-7 border-t border-border pt-6">
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-primary-green">Phone / WhatsApp</p>
              <div className="mt-4 grid gap-3">
                {contactPhones.map((phone) => (
                  <a
                    key={phone}
                    href={getWhatsappHref(phone)}
                    className="inline-flex items-center gap-3 text-[1rem] font-semibold text-primary-text transition-colors hover:text-primary-green"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaWhatsapp className="h-4 w-4" />
                    {phone}
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-7 border-t border-border pt-6">
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-primary-green">Location</p>
              <p className="mt-3 text-[1rem] leading-7 text-muted-text">GizPulse is based in {publicationLocation}.</p>
            </div>
          </aside>
        </div>
      </section>

      <section>
        <div className="mx-auto grid w-full max-w-[1360px] gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-16 lg:py-14">
          <div>
            <p className="text-[0.74rem] font-bold uppercase tracking-[0.14em] text-primary-green">Find Us Online</p>
            <h2 className="mt-2 font-display text-[2.8rem] font-bold leading-none tracking-[-0.05em] text-primary-text">Social Channels</h2>
          </div>

          <div>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((link) => {
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="inline-flex items-center border border-border bg-card-background px-4 py-3 text-[0.74rem] font-bold uppercase tracking-[0.14em] text-primary-text transition-colors hover:border-primary-green hover:text-primary-green"
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
            <p className="mt-6 max-w-[760px] text-[1rem] leading-8 text-muted-text">
              For corrections, please include the article URL, the issue you noticed, and any supporting source that can help us review
              it quickly.
            </p>
            <Link
              href="/corrections-policy"
              className="mt-6 inline-flex rounded-full bg-primary-green px-5 py-3 text-[0.72rem] font-bold uppercase tracking-[0.16em] !text-white transition-opacity hover:opacity-90"
            >
              Read Corrections Policy
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
