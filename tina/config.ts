import { defineConfig } from "tinacms";

// Local (Git-backed) mode. No Tina Cloud account required.
// Content is read/written directly to the MDX files that magic-portfolio renders.
// Branch / client id / token are only used if you later connect Tina Cloud.
const branch =
  process.env.NEXT_PUBLIC_TINA_BRANCH ||
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  "main";

export default defineConfig({
  branch,
  // Leave empty for local mode (tinacms dev). Fill in to use Tina Cloud later.
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public",
    },
  },

  // 内容搜索（仅 Tina Cloud）。必须是无条件的静态对象——否则客户端 admin 包
  // 读不到非 NEXT_PUBLIC 的 TINA_SEARCH_TOKEN，会误判为"未配置"。
  // indexerToken 只在服务端构建索引时用到真实值，客户端为空不影响查询。
  search: {
    tina: {
      indexerToken: process.env.TINA_SEARCH_TOKEN || "",
      stopwordLanguages: ["eng"],
    },
    indexBatchSize: 100,
    maxSearchIndexFieldLength: 100,
  },

  schema: {
    collections: [
      // ============ Work / Projects (项目墙核心) ============
      {
        name: "project",
        label: "项目 / Projects",
        path: "src/app/work/projects",
        format: "mdx",
        ui: {
          // slug = filename, generated from title
          filename: {
            slugify: (values) =>
              `${(values?.title || "untitled")
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "")}`,
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "标题 Title",
            isTitle: true,
            required: true,
          },
          {
            type: "datetime",
            name: "publishedAt",
            label: "发布日期 Published At",
            required: true,
            ui: { dateFormat: "YYYY-MM-DD" },
          },
          {
            type: "string",
            name: "summary",
            label: "摘要 Summary",
            ui: { component: "textarea" },
          },
          {
            type: "image",
            name: "images",
            label: "图片 Images",
            list: true,
          },
          {
            type: "object",
            name: "team",
            label: "团队 Team",
            list: true,
            ui: {
              itemProps: (item) => ({ label: item?.name || "Member" }),
            },
            fields: [
              { type: "string", name: "name", label: "Name" },
              { type: "string", name: "role", label: "Role" },
              { type: "image", name: "avatar", label: "Avatar" },
              { type: "string", name: "linkedIn", label: "LinkedIn URL" },
            ],
          },
          {
            type: "string",
            name: "link",
            label: "外部链接 Link",
          },
          {
            type: "rich-text",
            name: "body",
            label: "正文 Body",
            isBody: true,
          },
        ],
      },

      // ============ Blog Posts ============
      {
        name: "post",
        label: "博客 / Blog",
        path: "src/app/blog/posts",
        format: "mdx",
        ui: {
          filename: {
            slugify: (values) =>
              `${(values?.title || "untitled")
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "")}`,
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "标题 Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "subtitle",
            label: "副标题 Subtitle",
          },
          {
            type: "string",
            name: "summary",
            label: "摘要 Summary",
            ui: { component: "textarea" },
          },
          {
            type: "image",
            name: "image",
            label: "封面图 Cover Image",
          },
          {
            type: "datetime",
            name: "publishedAt",
            label: "发布日期 Published At",
            required: true,
            ui: { dateFormat: "YYYY-MM-DD" },
          },
          {
            type: "string",
            name: "tag",
            label: "标签 Tag",
          },
          {
            type: "rich-text",
            name: "body",
            label: "正文 Body",
            isBody: true,
          },
        ],
      },
    ],
  },
});
