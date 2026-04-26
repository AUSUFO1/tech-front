"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaRss, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { QuickLink } from "@/lib/content-types";
import { getQuickLinkHref } from "@/lib/link-mapping";
import { socialUrls } from "@/lib/site-config";

const navItems = [
  { label: "BLOG", href: "/blog" },
  { label: "JOBS", href: "/jobs" },
  { label: "OPPORTUNITIES", href: "/opportunities" },
  { label: "EARN", href: "/earn" },
  { label: "NEWS", href: "/news" },
];

const legalLinks = [
  { label: "About", href: "/about" },
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

type MenuTriggerProps = {
  open: boolean;
  onClick: () => void;
};

function MenuTrigger({ open, onClick }: MenuTriggerProps) {
  return (
    <button
      type="button"
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      onClick={onClick}
      className="flex h-11 w-11 items-center justify-center rounded-full text-primary-text transition-colors hover:bg-black/5 dark:hover:bg-white/8"
    >
      {open ? <X className="h-6 w-6" strokeWidth={2} /> : (
        <span className="relative block h-4 w-8">
          <span className="absolute left-1 top-0 h-[2px] w-5 rounded-full bg-current" />
          <span className="absolute left-0 bottom-0 h-[2px] w-8 rounded-full bg-current" />
        </span>
      )}
    </button>
  );
}

export function SiteHeader({ quickLinks }: { quickLinks: QuickLink[] }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const categoryGroups = navItems.map((item) => ({
    ...item,
    categories: quickLinks
      .filter((link) => {
        if (item.href === "/blog") return link.contentType === "blog";
        if (item.href === "/jobs") return link.contentType === "jobs";
        if (item.href === "/opportunities") return link.contentType === "opportunities";
        if (item.href === "/earn") return link.contentType === "earn";
        if (item.href === "/news") return link.contentType === "news";
        return false;
      })
      .map((link) => ({
        title: link.title,
        href: getQuickLinkHref(link.slug, link.contentType),
      })),
  }));

  useEffect(() => {
    if (!menuOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleMenuToggle = () => {
    setMenuOpen((current) => !current);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  const isActivePath = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-card-background">
        <div className="mx-auto flex h-[92px] w-full max-w-[1360px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-16">
          <Link
            href="/"
            className="shrink-0 font-display text-[2.05rem] font-bold tracking-[-0.07em] !text-primary-green sm:text-[2.45rem]"
            onClick={handleMenuClose}
          >
            GizPulse
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative pb-1 text-[0.72rem] font-bold uppercase tracking-[0.18em] transition-colors ${
                  isActivePath(item.href) ? "text-primary-green" : "text-primary-text hover:text-primary-green"
                } after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:w-full after:origin-left after:bg-primary-green after:transition-transform after:duration-200 ${
                  isActivePath(item.href) ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/newsletter"
              className="hidden rounded-full bg-primary-green px-6 py-3 text-[0.72rem] font-bold uppercase tracking-[0.16em] !text-white transition-opacity hover:opacity-90 lg:inline-flex"
            >
              Newsletter
            </Link>
            <Link
              href="/search"
              aria-label="Search"
              className="hidden h-11 w-11 items-center justify-center rounded-full text-primary-text transition-colors hover:bg-black/5 dark:hover:bg-white/8 sm:flex"
            >
              <Search className="h-5 w-5" strokeWidth={1.8} />
            </Link>
            <ThemeToggle />
            <MenuTrigger open={menuOpen} onClick={handleMenuToggle} />
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 top-[92px] z-40 overflow-y-auto border-t border-border bg-card-background transition-all duration-300 ${
          menuOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-3 opacity-0"
        }`}
      >
        <div className="mx-auto flex w-full max-w-[1360px] flex-col px-5 pb-8 pt-6 sm:px-8 lg:px-16 lg:pb-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_320px] lg:gap-10">
            <div>
              <div className="flex flex-wrap items-center gap-4 pb-6 text-primary-text">
                {socialLinks.map((link) => {
                  const Icon = link.icon;

                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={handleMenuClose}
                      aria-label={link.label}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border transition-colors hover:border-primary-green hover:text-primary-green"
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </Link>
                  );
                })}
              </div>

              <form action="/search" className="max-w-[34rem]">
                <label htmlFor="menu-nav-search" className="sr-only">
                  Search
                </label>
                <input
                  id="menu-nav-search"
                  type="search"
                  name="q"
                  placeholder="Search jobs, news, guides"
                  className="h-12 w-full border border-border bg-transparent px-4 text-[0.82rem] font-semibold tracking-[0.02em] text-primary-text placeholder:text-muted-text focus:border-primary-green focus:outline-none"
                />
              </form>

              <div className="mt-8 grid gap-8 lg:grid-cols-2">
                {categoryGroups.map((group) => (
                  <section key={group.href} className="border-t border-border pt-5">
                    <Link
                      href={group.href}
                      onClick={handleMenuClose}
                      className={`font-display text-[2rem] font-bold leading-none tracking-[-0.05em] transition-colors sm:text-[2.4rem] ${
                        isActivePath(group.href) ? "text-primary-green" : "text-primary-text hover:text-primary-green"
                      }`}
                    >
                      {group.label}
                    </Link>

                    <div className="mt-5 flex flex-wrap gap-3">
                      {group.categories.map((category) => (
                        <Link
                          key={`${group.href}-${category.href}-${category.title}`}
                          href={category.href}
                          onClick={handleMenuClose}
                          className="inline-flex border border-border bg-card-background px-3 py-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-primary-text transition-colors hover:border-primary-green hover:text-primary-green"
                        >
                          {category.title}
                        </Link>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>

            <aside className="border-t border-border pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <div>
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-muted-text">Explore</p>
                <div className="mt-4 grid gap-3">
                  {legalLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={handleMenuClose}
                      className="text-[0.92rem] font-semibold text-primary-text transition-colors hover:text-primary-green"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-8 border-t border-border pt-6">
                <Link
                  href="/newsletter"
                  onClick={handleMenuClose}
                  className="inline-flex rounded-full bg-primary-green px-5 py-3 text-[0.72rem] font-bold uppercase tracking-[0.16em] !text-white transition-opacity hover:opacity-90"
                >
                  Join Newsletter
                </Link>
              </div>

              <div className="mt-8 border-t border-border pt-6">
                <p className="max-w-[18rem] text-[0.92rem] leading-7 text-muted-text">
                  GizPulse covers jobs, opportunities, guides, and news for ambitious readers in Nigeria and across the world.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
