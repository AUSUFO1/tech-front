import { getBlogContent, getJobsContent, getNewsContent, getOpportunitiesContent } from "@/lib/content";
import { isEarnCategory } from "@/lib/content-sections";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

type FeedItem = {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  category: string;
};

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const [{ featuredNews }, blogItems, jobs, opportunities] = await Promise.all([
    getNewsContent(),
    getBlogContent(),
    getJobsContent(),
    getOpportunitiesContent(),
  ]);

  const items: FeedItem[] = [
    ...featuredNews.map((item) => ({
      title: item.title,
      description: item.excerpt,
      url: `${origin}/news/${item.slug}`,
      publishedAt: item.publishedAt,
      category: "News",
    })),
    ...blogItems.map((item) => ({
      title: item.title,
      description: item.excerpt,
      url: `${origin}/${isEarnCategory(item.categoryTitle) ? "earn" : "blog"}/${item.slug}`,
      publishedAt: item.publishedAt,
      category: isEarnCategory(item.categoryTitle) ? "Earn" : "Blog",
    })),
    ...jobs.map((item) => ({
      title: item.title,
      description: item.excerpt,
      url: `${origin}/jobs/${item.slug}`,
      publishedAt: item.publishedAt,
      category: "Jobs",
    })),
    ...opportunities.map((item) => ({
      title: item.title,
      description: item.excerpt,
      url: `${origin}/opportunities/${item.slug}`,
      publishedAt: item.deadline,
      category: "Opportunities",
    })),
  ]
    .filter((item) => item.title && item.url && item.publishedAt)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 50);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>GizPulse</title>
    <link>${origin}</link>
    <description>GizPulse covers jobs, opportunities, guides, and news for ambitious readers in Nigeria and across the world.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items
      .map(
        (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.url)}</link>
      <guid>${escapeXml(item.url)}</guid>
      <description>${escapeXml(item.description || item.title)}</description>
      <category>${escapeXml(item.category)}</category>
      <pubDate>${new Date(item.publishedAt).toUTCString()}</pubDate>
    </item>`
      )
      .join("\n")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
