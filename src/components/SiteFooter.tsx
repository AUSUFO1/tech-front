import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaRss, FaXTwitter, FaYoutube } from "react-icons/fa6";

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
  { label: "Accessibility", href: "/accessibility" },
];

const socialLinks = [
  { label: "Facebook", href: "#", icon: FaFacebookF },
  { label: "Instagram", href: "#", icon: FaInstagram },
  { label: "X", href: "#", icon: FaXTwitter },
  { label: "LinkedIn", href: "#", icon: FaLinkedinIn },
  { label: "YouTube", href: "#", icon: FaYoutube },
  { label: "RSS", href: "#", icon: FaRss },
];

export function SiteFooter() {
  return (
    <footer className="bg-primary-green text-white">
      <div className="mx-auto grid w-full max-w-[1360px] gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:px-16">
        <div>
          <Link href="/" className="font-display text-[2.6rem] font-bold tracking-[-0.08em] text-white">
            Techfront
          </Link>
          <p className="mt-6 text-[0.95rem] leading-7 text-white/95">
            Techfront 2026.
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
                Techfront covers jobs, opportunities, guides, and news for ambitious readers in Nigeria and across the world.
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
