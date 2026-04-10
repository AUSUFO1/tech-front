import type { Metadata } from "next";
import Image from "next/image";
import { NewsletterSubscribePanel } from "@/components/NewsletterSubscribePanel";

export const metadata: Metadata = {
  title: "Newsletter | Techfront",
  description: "Subscribe to Techfront newsletters for jobs, opportunities, guides, and weekly tech updates.",
};

const highlights = [
  "Jobs",
  "Opportunities",
  "Guides",
];

export default function NewsletterPage() {
  return (
    <main className="bg-background text-primary-text">
      <section className="mx-auto w-full max-w-[1360px] px-5 py-8 sm:px-8 lg:px-16 lg:py-10">
        <div className="relative overflow-hidden px-5 py-10 sm:px-8 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-10 lg:py-12">
          <div className="absolute inset-x-0 top-0 h-px bg-transparent" />
          <div className="absolute -left-16 top-12 h-40 w-40 rounded-full bg-gold-accent/12 blur-3xl" />
          <div className="absolute right-10 top-10 h-52 w-52 rounded-full bg-primary-green/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-gold-accent/10 blur-3xl" />
          <div className="max-w-[40rem]">
            <p className="text-[0.78rem] font-bold uppercase tracking-[0.18em] text-primary-green">
              Techfront Newsletter
            </p>
            <h1 className="mt-4 font-display text-[2.7rem] font-bold leading-[0.92] tracking-[-0.07em] text-primary-text sm:text-[4.1rem] lg:text-[5.3rem]">
              Subscribe to
              <br />
              our newsletters
            </h1>
            <p className="mt-5 max-w-[31rem] text-[1rem] leading-7 text-muted-text sm:text-[1.12rem] sm:leading-8">
              Subscribe and stay close to the stories, jobs, opportunities, and practical guides moving ambitious people forward.
            </p>
          </div>

          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="absolute right-6 top-8 h-44 w-44 rounded-full bg-gold-accent/18 blur-3xl" />
            <div className="absolute bottom-6 left-10 h-32 w-32 rounded-full bg-primary-green/10 blur-3xl" />
            <div className="newsletter-float relative">
              <Image
                src="/images/newsletter-envelope.png"
                alt="Techfront newsletter envelope artwork"
                width={520}
                height={520}
                className="h-auto w-full max-w-[13rem] object-contain drop-shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:max-w-[19rem] lg:max-w-[22rem]"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto w-full max-w-[1360px] px-5 py-6 sm:px-8 lg:px-16 lg:py-8">
          <div className="flex flex-wrap gap-3">
            {highlights.map((item) => (
              <span
                key={item}
                className="inline-flex items-center border border-border bg-card-background px-4 py-2 text-[0.74rem] font-bold uppercase tracking-[0.16em] text-primary-text transition-colors hover:border-gold-accent hover:text-gold-accent"
              >
                {item}
              </span>
            ))}
          </div>

          <NewsletterSubscribePanel />
        </div>
      </section>
    </main>
  );
}
