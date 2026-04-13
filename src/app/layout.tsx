import type { Metadata } from "next";
import { cookies } from "next/headers";
import { draftMode } from "next/headers";
import Link from "next/link";
import { Inter, JetBrains_Mono, Sora, Source_Serif_4 } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeaderServer } from "@/components/SiteHeaderServer";
import { StructuredData } from "@/components/StructuredData";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getMetadataBase } from "@/lib/seo";
import "../styles/globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: "Techfront",
  description: "Stay Ahead. Stay Informed. Earn with Tech.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const { isEnabled: isDraftMode } = await draftMode();
  const savedTheme = cookieStore.get("techfront-theme")?.value;
  const serverTheme = savedTheme === "dark" ? "dark" : "light";
  const metadataBase = getMetadataBase();
  const siteUrl = metadataBase?.toString().replace(/\/$/, "");
  const siteStructuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Techfront",
      ...(siteUrl ? { url: siteUrl } : {}),
      slogan: "Stay Ahead. Stay Informed. Earn with Tech.",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Techfront",
      ...(siteUrl ? { url: siteUrl } : {}),
      ...(siteUrl
        ? {
            potentialAction: {
              "@type": "SearchAction",
              target: `${siteUrl}/search?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          }
        : {}),
    },
  ];

  return (
    <html
      id="top"
      lang="en"
      suppressHydrationWarning
      className={`${sora.variable} ${inter.variable} ${sourceSerif.variable} ${jetBrainsMono.variable} ${
        serverTheme === "dark" ? "dark" : ""
      }`}
      style={{ colorScheme: serverTheme }}
    >
      <head />
      <body>
        {isDraftMode ? (
          <div className="bg-[#1f7a41] px-4 py-2 text-center text-[0.74rem] font-semibold uppercase tracking-[0.12em] text-white">
            Preview Mode Active.
            <Link href="/api/draft/disable" className="ml-2 underline underline-offset-4">
              Exit Preview
            </Link>
          </div>
        ) : null}
        <StructuredData data={siteStructuredData} />
        <ThemeProvider>
          <SiteHeaderServer />
          <div className="pt-[92px]">{children}</div>
          <SiteFooter />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
