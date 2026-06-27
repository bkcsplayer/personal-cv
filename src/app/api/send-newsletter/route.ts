import { buildPostEmailHtml } from "@/lib/newsletter";
import { baseURL } from "@/resources";
import { getPosts } from "@/utils/utils";
import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 只发布「最近 N 天」内发布的新文章，避免首次运行把 12 篇旧文章全部群发出去。
const RECENT_WINDOW_DAYS = 7;
// 单次运行最多发几封，保险阀。
const MAX_PER_RUN = 3;

/**
 * GET /api/send-newsletter  —— 由 Vercel Cron 定时触发。
 *
 * 流程：列出已发过的 broadcast（用 name=slug 去重）→ 找出最近发布且未发过的新文章
 * → 用 Resend broadcasts.create({ send:true }) 立即群发给 Segment。
 *
 * 受 CRON_SECRET 保护：Vercel Cron 会自动带 Authorization: Bearer <CRON_SECRET>。
 */
export async function GET(req: Request): Promise<NextResponse> {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const apiKey = process.env.RESEND_API_KEY;
  const segmentId = process.env.RESEND_SEGMENT_ID;
  const from = process.env.NEWSLETTER_FROM;

  if (!apiKey || !segmentId || !from) {
    return NextResponse.json({ error: "Newsletter is not configured." }, { status: 500 });
  }

  const resend = new Resend(apiKey);

  // 已发送过的文章（broadcast.name 存的是 slug）
  const alreadySent = new Set<string>();
  const list = await resend.broadcasts.list();
  for (const b of list.data?.data ?? []) {
    if (b.name) alreadySent.add(b.name);
  }

  const now = Date.now();
  const windowMs = RECENT_WINDOW_DAYS * 24 * 60 * 60 * 1000;

  const candidates = getPosts(["src", "app", "blog", "posts"])
    .filter((post) => {
      if (alreadySent.has(post.slug)) return false;
      const ts = new Date(post.metadata.publishedAt).getTime();
      return Number.isFinite(ts) && now - ts <= windowMs;
    })
    .sort(
      (a, b) =>
        new Date(a.metadata.publishedAt).getTime() - new Date(b.metadata.publishedAt).getTime(),
    )
    .slice(0, MAX_PER_RUN);

  const sent: Array<{ slug: string; ok: boolean; id?: string; error?: string }> = [];

  for (const post of candidates) {
    const html = buildPostEmailHtml(
      {
        slug: post.slug,
        title: post.metadata.title,
        summary: post.metadata.summary,
        image: post.metadata.image,
        publishedAt: post.metadata.publishedAt,
        content: post.content,
      },
      baseURL,
    );

    const { data, error } = await resend.broadcasts.create({
      segmentId,
      from,
      subject: post.metadata.title,
      name: post.slug,
      html,
      send: true,
    });

    if (error) {
      console.error(`[send-newsletter] ${post.slug}:`, error);
    }
    sent.push({ slug: post.slug, ok: !error, id: data?.id, error: error?.message });
  }

  return NextResponse.json({ checked: candidates.length, sent });
}
