"use client";

import Link from "next/link";

type TrendingItem = {
  _id: string;
  title: string;
  slug: string;
  type: string;
};

export function TrendingTicker({ items }: { items: TrendingItem[] }) {
  if (!items.length) return null;
  return (
    <div className="w-full border-b border-border bg-card-background">
      <div className="mx-auto flex h-[40px] w-full max-w-[1360px] items-center gap-3 px-5 sm:px-8 lg:px-16 overflow-hidden">
        <span className="shrink-0 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-primary-green">
          Trending
        </span>
        <div className="w-px h-4 bg-border shrink-0" />
        <div className="flex-1 overflow-hidden relative">
          <div
            className="flex items-center gap-8 ticker-track"
            style={{ "--count": items.length } as React.CSSProperties}
          >
            {[...items, ...items, ...items].map((item, i) => (
              <Link
                key={`${item._id}-${i}`}
                href={"/" + item.type + "/" + item.slug}
                className="inline-flex items-center gap-1.5 whitespace-nowrap text-[0.75rem] font-semibold text-primary-text transition-colors hover:text-primary-green shrink-0"
              >
                <span className="font-bold text-primary-green text-[0.7rem]">
                  {(i % items.length) + 1}.
                </span>
                {item.title}
                <span className="ml-4 text-muted-text">·</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
