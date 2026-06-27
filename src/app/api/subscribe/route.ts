import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/subscribe  body: { email }
 * 把订阅者写入 Resend 的 Segment（= 订阅者名单，无需自建数据库）。
 */
export async function POST(req: Request): Promise<NextResponse> {
  const apiKey = process.env.RESEND_API_KEY;
  const segmentId = process.env.RESEND_SEGMENT_ID;

  if (!apiKey || !segmentId) {
    return NextResponse.json({ error: "Newsletter is not configured." }, { status: 500 });
  }

  let email = "";
  try {
    const body = (await req.json()) as { email?: unknown };
    email = String(body.email ?? "")
      .trim()
      .toLowerCase();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.contacts.create({
    email,
    unsubscribed: false,
    segments: [{ id: segmentId }],
  });

  if (error) {
    // 已存在的联系人视为成功（避免重复订阅报错给用户）
    if (/already|exist/i.test(error.message ?? "")) {
      return NextResponse.json({ ok: true, alreadySubscribed: true });
    }
    console.error("[subscribe] resend error:", error);
    return NextResponse.json({ error: "Subscription failed. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
