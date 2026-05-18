import type {Metadata} from "next";
import Link from "next/link";
import {AppImage} from "@/components/AppImage";
import {getAuthorsContent} from "@/lib/content";
import {buildPageMetadata} from "@/lib/seo";
import {contactEmail, publicationLocation} from "@/lib/site-config";

export const metadata: Metadata = buildPageMetadata({
  title: "About Us | GizPulse",
  description: "Learn about GizPulse, our mission, editorial focus, content offering, and commitment to useful technology reporting.",
  pathname: "/about",
});

const contentOfferings = [
  {
    title: "Technology News",
    body:
      "We cover technology, startups, AI, digital policy, telecoms, fintech, and internet culture with context for readers in Nigeria and across the world.",
  },
  {
    title: "Jobs",
    body:
      "We surface remote, hybrid, and career-building roles for readers trying to grow in tech, product, operations, marketing, support, and adjacent digital fields.",
  },
  {
    title: "Opportunities",
    body:
      "We track scholarships, fellowships, grants, internships, bootcamps, and global programs that can help ambitious readers access learning, funding, and exposure.",
  },
  {
    title: "Guides",
    body:
      "We publish practical explainers and step-by-step guides that help readers solve everyday digital problems, learn useful tools, and make smarter online decisions.",
  },
  {
    title: "Earn With Tech",
    body:
      "We explain realistic ways to build income with digital skills, freelancing, career growth, online tools, and beginner-friendly technology paths.",
  },
  {
    title: "Newsletter",
    body:
      "Our newsletter gives readers a direct way to keep up with important stories, useful jobs, and opportunities without having to search for them every day.",
  },
];

export default async function AboutPage() {
  const authors = await getAuthorsContent();
  const featuredAuthors = authors.slice(0, 3);

  return (
    <main className="bg-background text-primary-text">
      <section className="mx-auto w-full max-w-[1360px] border-b border-border px-5 py-12 sm:px-8 lg:px-16 lg:py-16">
        <p className="text-[0.74rem] font-bold uppercase tracking-[0.14em] text-primary-green">About GizPulse</p>
        <h1 className="mt-5 max-w-[1040px] font-display text-[2.2rem] font-bold leading-[1.02] tracking-[-0.05em] text-primary-text sm:text-[3.35rem]">
          A technology publication for people who want to stay informed, find opportunities, and move forward.
        </h1>
        <div className="mt-8 max-w-[900px] text-[1.08rem] leading-8 text-muted-text">
          <p>
            GizPulse publishes technology news, practical guides, jobs, scholarships, opportunities, and career-focused stories for
            ambitious readers in Nigeria and across the world.
          </p>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto grid w-full max-w-[1360px] gap-8 px-5 py-12 sm:px-8 lg:grid-cols-2 lg:px-16 lg:py-14">
          <article className="border border-border bg-card-background p-6">
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-primary-green">Mission Statement</p>
            <h2 className="mt-4 font-display text-[2.2rem] font-bold leading-none tracking-[-0.05em] text-primary-text">
              Help readers move forward through useful technology information.
            </h2>
            <p className="mt-5 text-[1rem] leading-8 text-muted-text">
              Our mission is to make important technology stories, digital opportunities, and career information easier to understand
              and easier to act on.
            </p>
          </article>

          <article className="border border-border bg-card-background p-6">
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-primary-green">Vision Statement</p>
            <h2 className="mt-4 font-display text-[2.2rem] font-bold leading-none tracking-[-0.05em] text-primary-text">
              Become a reliable technology and opportunity desk for ambitious digital readers.
            </h2>
            <p className="mt-5 text-[1rem] leading-8 text-muted-text">
              We want GizPulse to be a trusted place readers return to for clear reporting, practical guidance, and opportunities that
              can improve their work, learning, and income.
            </p>
          </article>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-[1360px] px-5 py-12 sm:px-8 lg:px-16 lg:py-14">
          <div className="max-w-[760px]">
            <p className="text-[0.74rem] font-bold uppercase tracking-[0.14em] text-primary-green">Our Content Offering</p>
            <h2 className="mt-3 font-display text-[2.4rem] font-bold leading-none tracking-[-0.05em] text-primary-text">
              What GizPulse Covers
            </h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {contentOfferings.map((item) => (
              <article key={item.title} className="border border-border bg-card-background p-5">
                <h3 className="font-display text-[1.55rem] font-bold leading-tight tracking-[-0.04em] text-primary-text">
                  {item.title}
                </h3>
                <p className="mt-3 text-[0.98rem] leading-7 text-muted-text">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto grid w-full max-w-[1360px] gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-16 lg:py-14">
          <div>
            <p className="text-[0.74rem] font-bold uppercase tracking-[0.14em] text-primary-green">Editorial Standards</p>
            <h2 className="mt-2 font-display text-[2.8rem] font-bold leading-none tracking-[-0.05em] text-primary-text">
              How We Work
            </h2>
          </div>
          <div className="grid gap-5 text-[1rem] leading-8 text-muted-text md:grid-cols-2">
            <p>
              We aim to verify facts before publication, credit sources where appropriate, separate editorial content from sponsored
              material, and correct meaningful errors transparently.
            </p>
            <p>
              GizPulse is based in {publicationLocation}. For editorial questions, corrections, partnerships, or general inquiries,
              contact{" "}
              <a className="text-primary-green underline-offset-4 hover:underline" href={`mailto:${contactEmail}`}>
                {contactEmail}
              </a>
              .
            </p>
            <div className="md:col-span-2">
              <Link
                href="/editorial-policy"
                className="inline-flex rounded-full bg-primary-green px-5 py-3 text-[0.72rem] font-bold uppercase tracking-[0.16em] !text-white transition-opacity hover:opacity-90"
              >
                Read Editorial Policy
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto grid w-full max-w-[1360px] gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-16 lg:py-14">
          <div>
            <p className="text-[0.74rem] font-bold uppercase tracking-[0.14em] text-primary-green">Meet The Team</p>
            <h2 className="mt-2 font-display text-[2.8rem] font-bold leading-none tracking-[-0.05em] text-primary-text">Our Staff</h2>
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
    </main>
  );
}
