"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

const navItems = [
  { label: "BLOG", href: "/blog" },
  { label: "JOBS", href: "/jobs" },
  { label: "OPPORTUNITIES", href: "/opportunities" },
  { label: "EARN", href: "/earn" },
  { label: "NEWS", href: "/news" },
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
      <span className="relative block h-4 w-8">
        <span className="absolute left-1 top-0 h-[2px] w-5 rounded-full bg-current" />
        <span className="absolute left-0 bottom-0 h-[2px] w-8 rounded-full bg-current" />
      </span>
    </button>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

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
            Techfront
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
            <button
              type="button"
              aria-label="Search"
              className="hidden h-11 w-11 items-center justify-center rounded-full text-primary-text transition-colors hover:bg-black/5 dark:hover:bg-white/8 sm:flex"
            >
              <Search className="h-5 w-5" strokeWidth={1.8} />
            </button>
            <ThemeToggle />
            <MenuTrigger open={menuOpen} onClick={handleMenuToggle} />
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 top-[92px] z-40 bg-card-background transition-all duration-300 lg:hidden ${
          menuOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-3 opacity-0"
        }`}
      >
        <div className="mx-auto flex h-full w-full max-w-[1360px] flex-col px-5 pb-8 pt-6 sm:px-8">
          <div className="pb-6">
            <Link
              href="/newsletter"
              onClick={handleMenuClose}
              className="inline-flex h-12 items-center justify-center bg-primary-green px-6 text-[0.74rem] font-bold uppercase tracking-[0.16em] !text-white transition-opacity hover:opacity-90"
            >
              Newsletter
            </Link>
            <form action="/search" className="mt-4">
              <label htmlFor="mobile-nav-search" className="sr-only">
                Search
              </label>
              <input
                id="mobile-nav-search"
                type="search"
                name="q"
                placeholder="Search jobs, news, guides"
                className="h-12 w-full border border-border bg-transparent px-4 text-[0.82rem] font-semibold tracking-[0.02em] text-primary-text placeholder:text-muted-text focus:border-primary-green focus:outline-none"
              />
            </form>
          </div>

          <div className="flex flex-1 flex-col">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleMenuClose}
                className={`border-b border-border py-5 font-display text-[1.75rem] font-bold leading-none tracking-[-0.04em] transition-colors ${
                  isActivePath(item.href) ? "text-primary-green" : "text-primary-text hover:text-primary-green"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
