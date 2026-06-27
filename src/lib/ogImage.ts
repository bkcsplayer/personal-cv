/**
 * 封面图兜底：文章/项目没设封面时，回退到动态生成的标题卡图。
 * `/api/og/generate?title=...` 会渲染一张带标题的品牌图。
 *
 * @param title  文章/项目标题
 * @param baseURL 站点根 URL；站内 <img> 用相对路径(传 "")，邮件等外部场景需传绝对 baseURL
 */
export function fallbackImage(title: string, baseURL = ""): string {
  return `${baseURL}/api/og/generate?title=${encodeURIComponent(title)}`;
}

/** 返回封面图：优先用已设的 image，否则用动态标题卡兜底 */
export function coverOrFallback(image: string | undefined, title: string, baseURL = ""): string {
  if (image && image.trim()) {
    return /^https?:\/\//.test(image) || !baseURL ? image : `${baseURL}${image}`;
  }
  return fallbackImage(title, baseURL);
}
