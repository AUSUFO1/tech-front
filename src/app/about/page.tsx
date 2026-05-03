import type { Metadata } from "next";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaRss, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { AppImage } from "@/components/AppImage";
import { getAuthorsContent } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";
import { contactEmail, socialUrls } from "@/lib/site-config";

export const metadata: Metadata = buildPageMetadata({
  title: "About | GizPulse",
  description: "Learn more about GizPulse, our mission, editorial focus, and the team behind the platform.",
  pathname: "/about",
});

const socialLinks = [
  { label: "Facebook", href: socialUrls.facebook, icon: FaFacebookF },
  { label: "Instagram", href: socialUrls.instagram, icon: FaInstagram },
  { label: "X", href: socialUrls.x, icon: FaXTwitter },
  { label: "LinkedIn", href: socialUrls.linkedin, icon: FaLinkedinIn },
  { label: "YouTube", href: socialUrls.youtube, icon: FaYoutube },
  { label: "RSS", href: socialUrls.rss, icon: FaRss },
];

export default async function AboutPage() {
  const authors = await getAuthorsContent();
  const featuredAuthors = authors.slice(0, 3);

  return (
    <main className="bg-background text-primary-text">
      <section className="mx-auto w-full max-w-[1360px] border-b border-border px-5 py-12 sm:px-8 lg:px-16 lg:py-16">
        <p className="text-[0.74rem] font-bold uppercase tracking-[0.14em] text-primary-green">About GizPulse</p>
        <h1 className="mt-5 max-w-[980px] font-display text-[2.1rem] font-bold leading-[1.03] tracking-[-0.05em] text-primary-text sm:text-[3rem]">
          A newsroom for tech careers, opportunities, and stories that move your life forward.
        </h1>
        <p className="mt-8 max-w-[900px] text-[1.2rem] leading-9 text-muted-text">
          GizPulse exists to help readers move forward with clear information on jobs, opportunities, practical guides, and the
          stories shaping technology in Nigeria and globally.
        </p>
        <p className="mt-8 font-display text-[2rem] font-bold tracking-[-0.04em] text-primary-green sm:text-[2.4rem]">
          Stay Ahead. Stay Informed. Earn with Tech.
        </p>
      </section>

      <section>
        <div className="mx-auto grid w-full max-w-[1360px] gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-16 lg:py-14">
          <div>
            <p className="text-[0.74rem] font-bold uppercase tracking-[0.14em] text-primary-green">Meet The Team</p>
            <h2 className="mt-2 font-display text-[3rem] font-bold leading-none tracking-[-0.05em] text-primary-text">Our Staff</h2>
          </div>

          {featuredAuthors.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featuredAuthors.map((member) => (
                <Link
                  key={member._id}
                  href={`/authors/${member.slug}`}
                  className="block bg-card-background p-4 transition-transform hover:-translate-y-1"
                >
                  <article>
                    <AppImage
                      src={member.imageUrl}
                      alt={member.name}
                      className="aspect-[4/5] w-full bg-card-background object-contain object-top"
                      width={900}
                      height={1120}
                      sizes="(max-width: 1280px) 50vw, 33vw"
                    />
                    <h3 className="mt-4 font-display text-[1.8rem] font-bold leading-none tracking-[-0.04em] text-primary-text transition-colors hover:text-primary-green">
                      {member.name}
                    </h3>
                    <p className="mt-2 text-[0.74rem] font-bold uppercase tracking-[0.14em] text-primary-green">{member.title}</p>
                    <p className="mt-3 line-clamp-5 text-[0.98rem] leading-7 text-muted-text">{member.bio}</p>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="border border-border bg-card-background p-6">
              <h3 className="font-display text-[1.8rem] font-bold tracking-[-0.04em] text-primary-text">Team profiles coming soon</h3>
              <p className="mt-3 max-w-2xl text-[1rem] leading-7 text-muted-text">
                Publish complete author profiles in Sanity and they will appear here automatically.
              </p>
            </div>
          )}
        </div>
      </section>

      <section id="contact" className="border-t border-border">
        <div className="mx-auto w-full max-w-[1360px] px-5 py-12 sm:px-8 lg:px-16 lg:py-14">
          <div className="flex flex-wrap items-center gap-4 border-b border-border pb-5 text-primary-text">
            <p className="text-[0.74rem] font-bold uppercase tracking-[0.14em] text-primary-green">Follow Us On</p>
            <div className="flex items-center gap-4">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link key={link.label} href={link.href} aria-label={link.label} className="transition-colors hover:text-primary-green">
                    <Icon className="h-4 w-4" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="grid gap-8 pt-8 lg:grid-cols-[260px_minmax(0,1fr)]">
            <h2 className="font-display text-[3rem] font-bold leading-none tracking-[-0.05em] text-primary-text">Contact Us</h2>
            <div className="space-y-6 text-[1.02rem] leading-8 text-muted-text">
              <div>
                <p className="text-[0.78rem] font-bold uppercase tracking-[0.14em] text-primary-green">Support</p>
                <p className="mt-2">
                  For questions, updates, partnerships, or general support, email{" "}
                  <a className="text-primary-green underline-offset-4 hover:underline" href={`mailto:${contactEmail}`}>
                    {contactEmail}
                  </a>
                  .
                </p>
              </div>
              <div>
                <p className="text-[0.78rem] font-bold uppercase tracking-[0.14em] text-primary-green">PR & Story Pitches</p>
                <p className="mt-2">
                  Send story tips, press releases, or editorial pitches to{" "}
                  <a className="text-primary-green underline-offset-4 hover:underline" href={`mailto:${contactEmail}`}>
                    {contactEmail}
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
