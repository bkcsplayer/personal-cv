<div align="center">

<img src=".github/assets/banner.png" alt="Cool bao — Personal CV & Project Wall" width="100%" />

<br/>

[![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TinaCMS](https://img.shields.io/badge/TinaCMS-EC4815?style=for-the-badge&logo=tina&logoColor=white)](https://tina.io/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React_19-149ECA?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)

**A self-hosted personal CV & project wall — edit content visually, ship instantly.**

Frontend powered by [Magic Portfolio](https://github.com/once-ui-system/magic-portfolio) · Content managed by [TinaCMS](https://tina.io) · Deployed on [Vercel](https://vercel.com)

</div>

<img src=".github/assets/divider.png" alt="" width="100%" />

## Overview

This is a developer portfolio built as a **living project wall**. The twist: instead of editing Markdown files by hand, every project and blog post is managed through a polished **visual editor at `/admin`** — yet the content stays as plain MDX in the repo, version-controlled by Git and rendered statically for speed and SEO.

> **One source of truth, two views.** The same MDX files power both the public site and the visual editor. Edit in the admin → the file updates and commits → the site updates. No database, no lock-in.

- **Visual CMS, file-based storage** — TinaCMS gives you a Notion-like editor; content lives as MDX in `src/app/**`.
- **Instant, SEO-friendly frontend** — Next.js 16 App Router + Once UI, fully static where it counts.
- **Git-native workflow** — every edit is a commit; push to deploy.
- **Zero-config deploys** — ships to Vercel out of the box.

<img src=".github/assets/divider.png" alt="" width="100%" />

## Live Preview

<div align="center">

<img src=".github/assets/home.png" alt="Homepage — hero and featured work" width="100%" />

<em>Homepage — hero, intro, and featured work</em>

</div>

<br/>

<table>
  <tr>
    <td width="50%"><img src=".github/assets/work.png" alt="Work — project wall" width="100%" /></td>
    <td width="50%"><img src=".github/assets/blog.png" alt="Blog — writing" width="100%" /></td>
  </tr>
  <tr>
    <td align="center"><em>/work — the project wall</em></td>
    <td align="center"><em>/blog — writing &amp; notes</em></td>
  </tr>
  <tr>
    <td colspan="2"><img src=".github/assets/about.png" alt="About — CV / résumé" width="100%" /></td>
  </tr>
  <tr>
    <td colspan="2" align="center"><em>/about — CV, experience &amp; skills</em></td>
  </tr>
</table>

<img src=".github/assets/divider.png" alt="" width="100%" />

## Architecture

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#1E1B4B','primaryTextColor':'#E9E4FF','primaryBorderColor':'#6366F1','lineColor':'#8B5CF6','secondaryColor':'#312E81','tertiaryColor':'#0E0B1F','fontFamily':'DM Sans, Segoe UI, sans-serif'}}}%%
flowchart LR
    subgraph Browser
        U([You / Visitors])
    end

    subgraph App["Next.js app · :7931"]
        FE["Public site<br/>Magic Portfolio + Once UI"]
        ADMIN["Visual editor<br/>/admin · TinaCMS"]
    end

    subgraph Content["Git-tracked MDX"]
        P["src/app/work/projects/*.mdx"]
        B["src/app/blog/posts/*.mdx"]
    end

    VERCEL["Vercel<br/>build + CDN"]

    U -->|browse| FE
    U -->|edit| ADMIN
    ADMIN -->|writes + commits| P
    ADMIN -->|writes + commits| B
    P -->|read at build/request| FE
    B -->|read at build/request| FE
    P -.->|git push| VERCEL
    B -.->|git push| VERCEL
    VERCEL -->|serves| U
```

The public site and the CMS are the **same Next.js app**. TinaCMS doesn't store content in a database — it reads and writes the very MDX files that the frontend renders. That keeps everything in Git and makes deploys deterministic.

<img src=".github/assets/divider.png" alt="" width="100%" />

## Editing Content via `/admin`

Open **`http://localhost:7931/admin`** (or `your-domain.com/admin` in production). You get a full visual editor — no Markdown required.

<div align="center">
<img src=".github/assets/admin-list.png" alt="TinaCMS collection list" width="100%" />
<em>Collections — every project &amp; post in one place, stored as <code>.mdx</code></em>
</div>

<br/>

<div align="center">
<img src=".github/assets/admin-edit.png" alt="TinaCMS visual editing form" width="100%" />
<em>Visual editor — title, date, summary, images, and rich-text body</em>
</div>

### The edit-to-live loop

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#1E1B4B','primaryTextColor':'#E9E4FF','primaryBorderColor':'#6366F1','lineColor':'#8B5CF6','actorBkg':'#312E81','actorTextColor':'#E9E4FF','signalColor':'#A78BFA','signalTextColor':'#C7C7D1','fontFamily':'DM Sans, Segoe UI, sans-serif'}}}%%
sequenceDiagram
    actor You
    participant Admin as /admin (TinaCMS)
    participant MDX as MDX file + Git
    participant Site as Public site
    participant Vercel

    You->>Admin: Open editor, change a project
    Admin->>MDX: Save → write .mdx + commit
    MDX-->>Site: Hot-reload (local) / rebuild
    Note over You,Site: See changes instantly in dev
    MDX->>Vercel: git push
    Vercel->>Site: Build and deploy
    Vercel-->>You: Live on your domain
```

**In short:** edit in the browser → file is written and committed → `push` → Vercel rebuilds and ships. Locally, changes hot-reload immediately.

### Field reference

<table>
<tr><th align="left">Projects — <code>src/app/work/projects/*.mdx</code></th><th align="left">Blog — <code>src/app/blog/posts/*.mdx</code></th></tr>
<tr valign="top"><td>

| Field | Key |
|---|---|
| 标题 Title | `title` |
| 发布日期 Published At | `publishedAt` |
| 摘要 Summary | `summary` |
| 图片 Images | `images[]` |
| 团队 Team | `team[]` |
| 外部链接 Link | `link` |
| 正文 Body | MDX body |

</td><td>

| Field | Key |
|---|---|
| 标题 Title | `title` |
| 副标题 Subtitle | `subtitle` |
| 摘要 Summary | `summary` |
| 封面图 Cover | `image` |
| 发布日期 Published At | `publishedAt` |
| 标签 Tag | `tag` |
| 正文 Body | MDX body |

</td></tr>
</table>

The collection schema lives in [`tina/config.ts`](tina/config.ts).

<img src=".github/assets/divider.png" alt="" width="100%" />

## Deployment on Vercel

The whole project deploys to Vercel with zero configuration.

```bash
npm i -g vercel
vercel            # preview deployment
vercel --prod     # production
```

| Setting | Value |
|---|---|
| Framework preset | Next.js |
| Build command | `npm run build` (`tinacms build && next build`) |
| Output | `.next` (automatic) |
| Node version | 20+ |

> **Going multi-user / remote editing?** Local mode edits the filesystem on the machine running `npm run dev`. To let editors update content from anywhere (and from the production `/admin`), connect a free [Tina Cloud](https://app.tina.io) project and set `NEXT_PUBLIC_TINA_CLIENT_ID`, `TINA_TOKEN`, and `NEXT_PUBLIC_TINA_BRANCH` in your Vercel env vars.

<img src=".github/assets/divider.png" alt="" width="100%" />

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI system | [Once UI](https://once-ui.com) + SCSS |
| Language | TypeScript 5 · React 19 |
| Content | MDX + gray-matter |
| CMS | TinaCMS 3 (Git-backed, local mode) |
| Hosting | Vercel |

<img src=".github/assets/divider.png" alt="" width="100%" />

## Getting Started

```bash
# 1. Install
npm install

# 2. Run dev (TinaCMS + Next.js together)
npm run dev
```

| URL | What |
|---|---|
| http://localhost:7931 | Public site |
| http://localhost:7931/admin | Visual content editor |

Useful scripts:

```bash
npm run dev        # TinaCMS dev server + Next on :7931
npm run dev:next   # Next only, no CMS
npm run build      # tinacms build && next build
npm run start      # serve production build on :7931
```

> Ports use the **793x** range to avoid local conflicts.

<img src=".github/assets/divider.png" alt="" width="100%" />

## Project Structure

```
.
├─ src/
│  ├─ app/
│  │  ├─ work/projects/*.mdx   # ← project wall content
│  │  ├─ blog/posts/*.mdx      # ← blog content
│  │  ├─ about/                # CV / résumé page
│  │  └─ ...                   # home, gallery, api, layout
│  ├─ components/              # Once UI components
│  └─ resources/
│     ├─ content.tsx           # ← your name, role, socials, copy
│     └─ once-ui.config.ts     # theme, colors, fonts, baseURL
├─ tina/
│  └─ config.ts                # ← CMS collections & fields
├─ public/images/              # media (avatar, covers, gallery)
└─ next.config.mjs
```

**To make it yours:** edit your identity (name, role, socials, intro) in [`src/resources/content.tsx`](src/resources/content.tsx), tweak theme and `baseURL` in [`src/resources/once-ui.config.ts`](src/resources/once-ui.config.ts), then manage projects & posts from `/admin`.

<img src=".github/assets/divider.png" alt="" width="100%" />

## Credits

- Frontend template — [Magic Portfolio](https://github.com/once-ui-system/magic-portfolio) by Once UI (CC BY-NC 4.0)
- Content management — [TinaCMS](https://github.com/tinacms/tinacms)

<div align="center">
<br/>
<sub>Built by <strong>Cool bao</strong> · Calgary, Canada</sub>
</div>
