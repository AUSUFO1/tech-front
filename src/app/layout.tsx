import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Inter, JetBrains_Mono, Sora, Source_Serif_4 } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ThemeProvider } from "@/components/ThemeProvider";
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
  title: "Techfront",
  description: "Stay Ahead. Stay Informed. Earn with Tech.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const savedTheme = cookieStore.get("techfront-theme")?.value;
  const serverTheme = savedTheme === "dark" ? "dark" : "light";

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sora.variable} ${inter.variable} ${sourceSerif.variable} ${jetBrainsMono.variable} ${
        serverTheme === "dark" ? "dark" : ""
      }`}
      style={{ colorScheme: serverTheme }}
    >
      <head />
      <body>
        <ThemeProvider>
          <SiteHeader />
          <div className="pt-[92px]">{children}</div>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
