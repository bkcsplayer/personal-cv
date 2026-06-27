/**
 * Newsletter 共享逻辑 —— 用 Resend 发送博客更新邮件。
 *
 * 邮件内容从博客文章自动生成，目标是"勾起点击欲"：
 * 封面 + 标题 + 日期·阅读时长 + 真实开头节选 + "In this post" 小标题清单 + CTA + 退订。
 */

export interface NewsletterPost {
  slug: string;
  title: string;
  summary: string;
  image?: string;
  publishedAt: string;
  /** 文章正文 (MDX body)，用于自动提取节选、小标题、阅读时长 */
  content?: string;
}

const escapeHtml = (input: string): string =>
  input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const toAbsoluteUrl = (pathOrUrl: string, baseURL: string): string =>
  /^https?:\/\//.test(pathOrUrl) ? pathOrUrl : `${baseURL}${pathOrUrl}`;

/** 去掉常见 markdown 行内语法，留纯文本 */
const stripMarkdown = (input: string): string =>
  input
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // links -> text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/_{1,2}([^_]+)_{1,2}/g, "$1")
    .trim();

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
};

const estimateReadingMinutes = (content: string): number => {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

/** 抓正文前两段纯文本作为节选 */
const extractExcerpt = (content: string, maxChars = 420): string[] => {
  const lines = content.split(/\r?\n/);
  const paragraphs: string[] = [];
  let current: string[] = [];

  const isBlock = (line: string): boolean =>
    line === "" || /^(#{1,6}\s|[-*+]\s|>\s|```|\||\d+\.\s|!\[|<)/.test(line);

  for (const raw of lines) {
    const line = raw.trim();
    if (isBlock(line)) {
      if (current.length) {
        paragraphs.push(current.join(" "));
        current = [];
      }
      if (paragraphs.length >= 2) break;
    } else {
      current.push(line);
    }
  }
  if (current.length && paragraphs.length < 2) paragraphs.push(current.join(" "));

  let kept = paragraphs.slice(0, 2).map(stripMarkdown).filter(Boolean);
  // 控制总长度，超出则截断最后一段
  let total = 0;
  const out: string[] = [];
  for (const p of kept) {
    if (total >= maxChars) break;
    if (total + p.length > maxChars) {
      out.push(`${p.slice(0, maxChars - total).replace(/\s+\S*$/, "")}…`);
      break;
    }
    out.push(p);
    total += p.length;
  }
  return out;
};

/** 抓正文的 ## / ### 小标题，作为 "In this post" 清单 */
const extractSections = (content: string, max = 5): string[] => {
  const out: string[] = [];
  for (const raw of content.split(/\r?\n/)) {
    const m = raw.match(/^(#{2,3})\s+(.+)$/);
    if (m) {
      const title = stripMarkdown(m[2]);
      if (title && !out.includes(title)) out.push(title);
    }
    if (out.length >= max) break;
  }
  return out;
};

/**
 * 生成一封博客更新邮件的 HTML。
 * Resend 合并标签 {{{RESEND_UNSUBSCRIBE_URL}}} 会在发送时替换为真实退订链接（合规必需）。
 */
export function buildPostEmailHtml(post: NewsletterPost, baseURL: string): string {
  const postUrl = `${baseURL}/blog/${post.slug}`;
  const title = escapeHtml(post.title);
  const cover = post.image ? toAbsoluteUrl(post.image, baseURL) : "";
  const body = post.content ?? "";

  const dateStr = formatDate(post.publishedAt);
  const minutes = body ? estimateReadingMinutes(body) : 0;
  const metaParts = [dateStr, minutes ? `${minutes} min read` : ""].filter(Boolean);
  const metaLine = metaParts.join("&nbsp;&nbsp;·&nbsp;&nbsp;");

  // 节选：优先正文前两段，没有正文则回退到 summary
  const excerptParas = body.length ? extractExcerpt(body) : [post.summary].filter(Boolean);
  const excerptHtml = excerptParas
    .map(
      (p) =>
        `<p style="margin:0 0 14px;color:#a7b6c7;font-size:15px;line-height:1.7;">${escapeHtml(p)}</p>`,
    )
    .join("");

  const sections = body.length ? extractSections(body) : [];
  const sectionsBlock = sections.length
    ? `<tr><td style="padding:4px 0 28px;">
         <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#11161f;border:1px solid #1c2430;border-radius:12px;">
           <tr><td style="padding:18px 20px 6px;color:#7aa2c2;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;">In this post</td></tr>
           <tr><td style="padding:0 20px 16px;">
             ${sections
               .map(
                 (s) =>
                   `<div style="color:#cdd9e5;font-size:14px;line-height:1.6;padding:4px 0;">→&nbsp;&nbsp;${escapeHtml(s)}</div>`,
               )
               .join("")}
           </td></tr>
         </table>
       </td></tr>`
    : "";

  const coverBlock = cover
    ? `<tr><td style="padding:0 0 24px;">
         <a href="${postUrl}" style="text-decoration:none;">
           <img src="${cover}" alt="${title}" width="600"
                style="width:100%;max-width:600px;height:auto;border-radius:12px;display:block;" />
         </a>
       </td></tr>`
    : "";

  // 收件箱预览文字（preheader），用 summary
  const preheader = escapeHtml(post.summary || post.title);

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#0b0e14;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b0e14;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <tr>
            <td style="padding:0 0 16px;color:#2dd4bf;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;font-weight:600;">
              📬 New from Cool Bao
            </td>
          </tr>
          ${coverBlock}
          <tr>
            <td style="padding:0 0 8px;">
              <a href="${postUrl}" style="text-decoration:none;color:#e8eef5;font-size:26px;line-height:1.3;font-weight:700;">
                ${title}
              </a>
            </td>
          </tr>
          ${metaLine ? `<tr><td style="padding:0 0 20px;color:#5b6b7c;font-size:13px;">${metaLine}</td></tr>` : ""}
          <tr>
            <td style="padding:0 0 20px;">
              ${excerptHtml}
            </td>
          </tr>
          ${sectionsBlock}
          <tr>
            <td style="padding:0 0 32px;">
              <a href="${postUrl}"
                 style="display:inline-block;background:#2dd4bf;color:#04201d;text-decoration:none;
                        font-size:15px;font-weight:700;padding:14px 28px;border-radius:8px;">
                Read the full story →
              </a>
            </td>
          </tr>
          <tr>
            <td style="border-top:1px solid #1c2430;padding:24px 0 0;color:#5b6b7c;font-size:12px;line-height:1.6;">
              You're receiving this because you subscribed to Cool Bao's newsletter.<br />
              <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#7aa2c2;">Unsubscribe</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
