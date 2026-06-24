# coolbao2026 — 我的项目墙 (Project Wall)

个人作品 / 项目展示站。前端用 **magic-portfolio**（Next.js 16 + Once UI），内容后台用 **TinaCMS**（Git-backed，本地直接读写 MDX，无需云账号）。

## 架构

```
浏览器  ──►  http://localhost:7931            前端展示（magic-portfolio）
浏览器  ──►  http://localhost:7931/admin       TinaCMS 内容后台
                    │
                    ▼
        src/app/work/projects/*.mdx   ← 「项目 Projects」collection
        src/app/blog/posts/*.mdx      ← 「博客 Blog」collection
```

TinaCMS 在 `/admin` 提供可视化编辑器，保存时直接写回上面这些 MDX 文件并提交到本地 Git。magic-portfolio 在构建/请求时从同样的文件读取渲染——**同一份内容，两个视角**。

## 端口

固定使用 **7931**（793x 系列，避免冲突）。TinaCMS 自身的 GraphQL 数据层跑在 `:4001`（由 CLI 内部管理）。

## 开发

```bash
npm install          # 仅首次
npm run dev          # tinacms dev -c "next dev -p 7931"
```

- 前台：http://localhost:7931
- 后台：http://localhost:7931/admin

`npm run dev` 会同时启动 TinaCMS（生成 schema + admin SPA）和 Next。
若只想跑纯前端不带 CMS：`npm run dev:next`。

## 内容管理（日常维护流程）

1. 打开 http://localhost:7931/admin
2. 选择「项目 Projects」或「博客 Blog」
3. 新建 / 编辑 / 删除条目，可视化填写标题、日期、封面图、正文（富文本）
4. 保存 → 自动写入对应 `.mdx` 文件并 commit 到本地 git
5. 前台立即热更新

### 字段映射

**项目 Projects** (`src/app/work/projects/*.mdx`)

| 后台字段 | frontmatter key |
|---|---|
| 标题 | `title` |
| 发布日期 | `publishedAt` |
| 摘要 | `summary` |
| 图片(多张) | `images[]` |
| 团队 | `team[]` (name/role/avatar/linkedIn) |
| 外部链接 | `link` |
| 正文 | MDX body |

**博客 Blog** (`src/app/blog/posts/*.mdx`)

| 后台字段 | frontmatter key |
|---|---|
| 标题 | `title` |
| 副标题 | `subtitle` |
| 摘要 | `summary` |
| 封面图 | `image` |
| 发布日期 | `publishedAt` |
| 标签 | `tag` |
| 正文 | MDX body |

## 站点信息（个人资料 / 社交链接）

这些是代码配置（含 JSX），不在 TinaCMS 里，直接改文件：
- `src/resources/content.tsx` — 姓名、角色、头像、邮箱、社交链接、首页文案等
- `src/resources/once-ui.config.ts` — 主题、配色、字体

## 构建 / 生产

```bash
npm run build        # tinacms build && next build
npm run start        # next start -p 7931
```

## 接入 Tina Cloud（可选，未来需要远程协作时）

默认本地模式无需账号。若要团队远程编辑：在 https://app.tina.io 创建项目，把 `clientId` / `token` 填入 `.env.local`（`NEXT_PUBLIC_TINA_CLIENT_ID`、`TINA_TOKEN`），并设置 `NEXT_PUBLIC_TINA_BRANCH`。

## 媒体

图片上传到 `public/images/`（TinaCMS media root）。也可手动放入该目录。

---

基底模板：[magic-portfolio](https://github.com/once-ui-system/magic-portfolio) (CC BY-NC 4.0) · CMS：[TinaCMS](https://github.com/tinacms/tinacms)
