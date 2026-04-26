import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaRss, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { socialUrls } from "@/lib/site-config";

const primaryLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/about#contact" },
  { label: "Authors", href: "/authors" },
  { label: "Jobs", href: "/jobs" },
  { label: "Opportunities", href: "/opportunities" },
  { label: "Newsletters", href: "/newsletter" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
  { label: "Editorial Policy", href: "/editorial-policy" },
  { label: "Corrections Policy", href: "/corrections-policy" },
  { label: "Accessibility", href: "/accessibility" },
];

const socialLinks = [
  { label: "Facebook", href: socialUrls.facebook, icon: FaFacebookF },
  { label: "Instagram", href: socialUrls.instagram, icon: FaInstagram },
  { label: "X", href: socialUrls.x, icon: FaXTwitter },
  { label: "LinkedIn", href: socialUrls.linkedin, icon: FaLinkedinIn },
  { label: "YouTube", href: socialUrls.youtube, icon: FaYoutube },
  { label: "RSS", href: socialUrls.rss, icon: FaRss },
];

export function SiteFooter() {
  return (
    <footer className="relative bg-primary-green text-white">
      <a
        href="#top"
        aria-label="Back to top"
        className="absolute right-5 top-0 inline-flex h-16 w-16 -translate-y-1/2 items-center justify-center rounded-full border border-[#d9cfaa] bg-[#f7f0cf] !text-[#0b1120] shadow-[0_10px_30px_rgba(11,17,32,0.18)] transition-transform hover:-translate-y-[55%] dark:border-white/25 dark:bg-[#0b1120] dark:!text-[#f7f0cf] sm:right-8 lg:right-16"
      >
        <ArrowUp className="h-8 w-8 !text-inherit" strokeWidth={1.8} />
      </a>

      <div className="mx-auto grid w-full max-w-[1360px] gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:px-16">
        <div>
          <Link href="/" className="font-display text-[2.6rem] font-bold tracking-[-0.08em] text-white">
            GizPulse
          </Link>
          <p className="mt-6 text-[0.95rem] leading-7 text-white/95">
            GizPulse 2026.
            <br />
            All rights reserved.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-[1rem] font-semibold text-white">
            {primaryLinks.map((link) => (
              <Link key={link.label} href={link.href} className="transition-opacity hover:opacity-80">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-5 border-t !border-white pt-5">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[0.74rem] font-bold uppercase tracking-[0.14em] text-white">
              {legalLinks.map((link) => (
                <Link key={link.label} href={link.href} className="transition-opacity hover:opacity-80">
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-2xl text-[0.95rem] leading-7 text-white/90">
                GizPulse covers jobs, opportunities, guides, and news for ambitious readers in Nigeria and across the world.
              </p>
              <div className="flex items-center gap-4 text-white">
                {socialLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      aria-label={link.label}
                      className="transition-opacity hover:opacity-80"
                    >
                      <Icon className="h-5 w-5" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
