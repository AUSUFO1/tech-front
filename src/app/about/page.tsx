import type { Metadata } from "next";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaRss, FaXTwitter, FaYoutube } from "react-icons/fa6";

export const metadata: Metadata = {
  title: "About | Techfront",
  description: "About Techfront",
};

const team = [
  {
    name: "Yusuf",
    slug: "yusuf-abubakar",
    role: "Founder & Frontend Developer",
    bio: "Builds and scales Techfront's product experience, editorial systems, and frontend architecture.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Techfront Editorial",
    slug: "techfront-editorial",
    role: "Newsroom",
    bio: "Covers tech, jobs, opportunities, and practical growth stories with a sharp, beginner-friendly voice.",
    image:
      "https://images.unsplash.com/photo-1541534401786-2077eed87a72?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Community Desk",
    slug: "",
    role: "Audience & Growth",
    bio: "Supports distribution, reader feedback, and newsletter growth across Nigeria and global audiences.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-background text-primary-text">
      <section className="mx-auto w-full max-w-[1360px] border-b border-border px-5 py-12 sm:px-8 lg:px-16 lg:py-16">
        <p className="text-[0.74rem] font-bold uppercase tracking-[0.14em] text-primary-green">About Techfront</p>
        <h1 className="mt-5 max-w-[980px] font-display text-[2.1rem] font-bold leading-[1.03] tracking-[-0.05em] text-primary-text sm:text-[3rem]">
          A modern newsroom for tech careers, opportunities, and stories that move your life forward.
        </h1>
        <p className="mt-8 max-w-[900px] text-[1.2rem] leading-9 text-muted-text">
          Techfront exists to help readers move forward with clear information on jobs, opportunities, practical guides, and the
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

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <article key={member.name} className="bg-card-background p-4">
                {member.slug ? (
                  <Link href={`/authors/${member.slug}`} className="block">
                    <img src={member.image} alt={member.name} className="h-[280px] w-full object-cover" />
                  </Link>
                ) : (
                  <img src={member.image} alt={member.name} className="h-[280px] w-full object-cover" />
                )}
                <h3 className="mt-4 font-display text-[1.8rem] font-bold leading-none tracking-[-0.04em] text-primary-text">
                  {member.slug ? (
                    <Link href={`/authors/${member.slug}`} className="transition-colors hover:text-primary-green">
                      {member.name}
                    </Link>
                  ) : (
                    member.name
                  )}
                </h3>
                <p className="mt-2 text-[0.74rem] font-bold uppercase tracking-[0.14em] text-primary-green">{member.role}</p>
                <p className="mt-3 text-[0.98rem] leading-7 text-muted-text">{member.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="border-t border-border">
        <div className="mx-auto w-full max-w-[1360px] px-5 py-12 sm:px-8 lg:px-16 lg:py-14">
          <div className="flex flex-wrap items-center gap-4 border-b border-border pb-5 text-primary-text">
            <p className="text-[0.74rem] font-bold uppercase tracking-[0.14em] text-primary-green">Follow Us On</p>
            <div className="flex items-center gap-4">
              <Link href="#" aria-label="Facebook" className="transition-colors hover:text-primary-green">
                <FaFacebookF className="h-4 w-4" />
              </Link>
              <Link href="#" aria-label="Instagram" className="transition-colors hover:text-primary-green">
                <FaInstagram className="h-4 w-4" />
              </Link>
              <Link href="#" aria-label="X" className="transition-colors hover:text-primary-green">
                <FaXTwitter className="h-4 w-4" />
              </Link>
              <Link href="#" aria-label="LinkedIn" className="transition-colors hover:text-primary-green">
                <FaLinkedinIn className="h-4 w-4" />
              </Link>
              <Link href="#" aria-label="YouTube" className="transition-colors hover:text-primary-green">
                <FaYoutube className="h-4 w-4" />
              </Link>
              <Link href="#" aria-label="RSS" className="transition-colors hover:text-primary-green">
                <FaRss className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid gap-8 pt-8 lg:grid-cols-[260px_minmax(0,1fr)]">
            <h2 className="font-display text-[3rem] font-bold leading-none tracking-[-0.05em] text-primary-text">Contact Us</h2>
            <div className="space-y-6 text-[1.02rem] leading-8 text-muted-text">
              <div>
                <p className="text-[0.78rem] font-bold uppercase tracking-[0.14em] text-primary-green">Support</p>
                <p className="mt-2">
                  For questions, updates, partnerships, or general support, email{" "}
                  <a className="text-primary-green underline-offset-4 hover:underline" href="mailto:support@techfront.com">
                    support@techfront.com
                  </a>
                  .
                </p>
              </div>
              <div>
                <p className="text-[0.78rem] font-bold uppercase tracking-[0.14em] text-primary-green">PR & Story Pitches</p>
                <p className="mt-2">
                  Send story tips, press releases, or editorial pitches to{" "}
                  <a className="text-primary-green underline-offset-4 hover:underline" href="mailto:support@techfront.com">
                    support@techfront.com
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
