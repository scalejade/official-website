import { SITE_URL } from '@/lib/locale-url';
import { getAllPosts, getCoverImage } from '@/data/blog';

/**
 * /feed.xml — RSS 2.0 feed of the newest Insights posts. Feed readers, news
 * aggregators and crawlers pick up new posts from here within hours, instead of
 * waiting for the next sitemap crawl.
 */

const FEED_SIZE = 50;

const escape = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const revalidate = 900;

export async function GET() {
    const posts = (await getAllPosts()).slice(0, FEED_SIZE);

    const items = posts
        .map((post) => {
            const url = `${SITE_URL}/blog/${post.slug}`;
            return `    <item>
      <title>${escape(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escape(post.excerpt)}</description>
      <category>${escape(post.category)}</category>
      <dc:creator>${escape(post.author)}</dc:creator>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <enclosure url="${escape(getCoverImage(post))}" type="image/jpeg" length="0"/>
    </item>`;
        })
        .join('\n');

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>ScaleJade Insights</title>
    <link>${SITE_URL}/blog</link>
    <description>News briefs and analysis on software, AI, data, cloud and ledger systems for regulated institutions in Indonesia, Singapore and APAC.</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${posts[0] ? `    <lastBuildDate>${new Date(posts[0].date).toUTCString()}</lastBuildDate>\n` : ''}${items}
  </channel>
</rss>
`;

    return new Response(body, {
        headers: {
            'Content-Type': 'application/rss+xml; charset=utf-8',
            'Cache-Control': 'public, max-age=0, s-maxage=900, stale-while-revalidate=86400',
        },
    });
}
