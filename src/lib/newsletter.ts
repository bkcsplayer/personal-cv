/**
 * Newsletter 共享逻辑 —— 用 Resend 发送博客更新邮件。
 *
 * 邮件内容（摘要式）从博客文章 frontmatter 自动生成：
 * 封面图 + 标题 + 摘要 + "Read full post" 按钮 + 退订链接。
 */

export interface NewsletterPost {
  slug: string;
  title: string;
  summary: string;
  image?: string;
  publishedAt: string;
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

/**
 * 生成一封博客更新邮件的 HTML。
 * Resend 合并标签 {{{RESEND_UNSUBSCRIBE_URL}}} 会在发送时替换为真实退订链接（合规必需）。
 */
export function buildPostEmailHtml(post: NewsletterPost, baseURL: string): string {
  const postUrl = `${baseURL}/blog/${post.slug}`;
  const title = escapeHtml(post.title);
  const summary = escapeHtml(post.summary);
  const cover = post.image ? toAbsoluteUrl(post.image, baseURL) : "";

  const coverBlock = cover
    ? `<tr><td style="padding:0 0 24px;">
         <a href="${postUrl}" style="text-decoration:none;">
           <img src="${cover}" alt="${title}" width="600"
                style="width:100%;max-width:600px;height:auto;border-radius:12px;display:block;" />
         </a>
       </td></tr>`
    : "";

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#0b0e14;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b0e14;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <tr>
            <td style="padding:0 0 16px;color:#7aa2c2;font-size:13px;letter-spacing:0.04em;text-transform:uppercase;">
              New post on Cool Bao's blog
            </td>
          </tr>
          ${coverBlock}
          <tr>
            <td style="padding:0 0 12px;color:#e8eef5;font-size:24px;line-height:1.3;font-weight:700;">
              ${title}
            </td>
          </tr>
          <tr>
            <td style="padding:0 0 24px;color:#a7b6c7;font-size:15px;line-height:1.6;">
              ${summary}
            </td>
          </tr>
          <tr>
            <td style="padding:0 0 32px;">
              <a href="${postUrl}"
                 style="display:inline-block;background:#2dd4bf;color:#04201d;text-decoration:none;
                        font-size:15px;font-weight:600;padding:12px 24px;border-radius:8px;">
                Read full post →
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
