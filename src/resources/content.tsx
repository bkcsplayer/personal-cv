import type { About, Blog, Gallery, Home, Newsletter, Person, Social, Work } from "@/types";
import { Line, Row, Text } from "@once-ui-system/core";

const person: Person = {
  firstName: "Cool",
  lastName: "Bao",
  name: "Cool Bao",
  role: "Full-Stack Developer & Entrepreneur",
  avatar: "/images/touxiang-cool.png",
  email: "bkcsplayer@gmail.com",
  location: "America/Edmonton", // Calgary, Canada (Mountain Time). IANA tz id.
  languages: ["English", "中文"],
  locale: "en",
};

const newsletter: Newsletter = {
  display: true,
  title: <>Subscribe to {person.firstName}'s Newsletter</>,
  description: (
    <>Stay updated on new projects, technical deep-dives, and lessons from the trenches.</>
  ),
};

const social: Social = [
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/bkcsplayer",
    essential: true,
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
    essential: true,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: <>Building the future, one repo at a time</>,
  featured: {
    display: true,
    title: (
      <Row gap="12" vertical="center">
        <strong className="ml-4">Cool Bao</strong>{" "}
        <Line background="brand-alpha-strong" vert height="20" />
        <Text marginRight="4" onBackground="brand-medium">
          Featured work
        </Text>
      </Row>
    ),
    href: "/work/frontierx-web3-ai-platform",
  },
  subline: (
    <>
      I'm {person.firstName}, a {person.role.toLowerCase()} based in Calgary, Canada.
      <br />
      Founder of FutureFrontier Technology Ltd and Khtain Block Technology Ltd.
      <br />I build production SaaS, Web3 platforms, AI pipelines, and trading systems — this is
      where they live.
    </>
  ),
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, ${person.role} from ${person.location}`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: true,
    link: "https://cal.com",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        I'm Cool Bao, a Calgary-based Full-Stack Developer and Entrepreneur. I build
        production-grade SaaS tools, Web3 platforms, AI pipelines, and automated trading systems. As
        founder of FutureFrontier Technology Ltd and Khtain Block Technology Ltd, I ship products
        that solve real business problems — from EV charger quoting to solar CRM, from AI content
        factories to prediction market trading engines. This site is the living wall of everything I
        build.
      </>
    ),
  },
  work: {
    display: true,
    title: "Work Experience",
    experiences: [
      {
        company: "FutureFrontier Technology Ltd / Khtain Block Technology Ltd",
        timeframe: "2023 - Present",
        role: "Founder & Full-Stack Developer",
        achievements: [
          <>
            Designed and deployed 15+ production web applications across solar, EV, finance, AI, and
            Web3 domains, serving real business clients on a single VPS infrastructure.
          </>,
          <>
            Architected Docker-based hosting on a single VPS running 10+ projects with Nginx reverse
            proxy, serving 15+ domains under the khtain.com namespace.
          </>,
          <>
            Built enterprise SaaS tools: EV charger quoting system, solar installation CRM with PDF
            invoicing, drone media management platform, and digital safety workflow for solar teams.
          </>,
          <>
            Developed FrontierX Web3 — a full-stack Web3+AI platform with ERC-20/721 smart
            contracts, staking, lottery, and AI hub deployed on Ethereum Sepolia testnet.
          </>,
          <>
            Created VibeSlide — an AI-powered PPT generation tool with Glassmorphism UI, and
            BioWeaver — an AI-powered biographical narrative platform for elderly storytellers.
          </>,
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true,
    title: "Education & Learning",
    institutions: [
      {
        name: "Self-Taught Engineer",
        description: (
          <>
            Continuous self-directed learning across full-stack web development (React, Next.js,
            FastAPI, Node.js), blockchain (Solidity, Web3), AI/ML (LLM pipelines, RAG, embeddings),
            DevOps (Docker, Nginx, VPS management), and quantitative trading. Built 60+ GitHub
            repositories and 30+ production projects as the primary learning method.
          </>
        ),
      },
      {
        name: "Open Source Contributor",
        description: (
          <>
            Published npm packages (text measurement/layout library), Claude Code plugin for web
            novel writing, and Claude Code configuration collections. Active on GitHub with
            contributions across the TypeScript/JavaScript ecosystem.
          </>
        ),
      },
    ],
  },
  technical: {
    display: true,
    title: "Technical Skills",
    skills: [
      {
        title: "Full-Stack Web",
        description: (
          <>
            React 19, Next.js 16, TypeScript, Node.js, Express, FastAPI, Vue 3, Go (Gin). Building
            everything from marketing sites to enterprise dashboards.
          </>
        ),
        tags: [
          { name: "TypeScript", icon: "typescript" },
          { name: "React", icon: "react" },
          { name: "Next.js", icon: "nextjs" },
          { name: "Vue", icon: "vuedotjs" },
          { name: "Node.js", icon: "nodejs" },
          { name: "Python", icon: "python" },
          { name: "Go", icon: "go" },
        ],
        images: [],
      },
      {
        title: "AI & Machine Learning",
        description: (
          <>
            Claude API, Google Gemini, OpenRouter multi-model routing, OpenAI Whisper transcription,
            pgvector + RAG semantic search, K-Means clustering, Bayesian probability models. Built
            AI pipelines for knowledge distillation, content generation, receipt OCR, and trading
            signal analysis.
          </>
        ),
        tags: [
          { name: "Claude", icon: "rocket" },
          { name: "Gemini", icon: "rocket" },
          { name: "Python", icon: "python" },
          { name: "FastAPI", icon: "javascript" },
        ],
        images: [],
      },
      {
        title: "Web3 & Blockchain",
        description: (
          <>
            Solidity smart contracts (ERC-20, ERC-721), Hardhat development framework, OpenZeppelin
            libraries, wagmi + RainbowKit frontend integration. 5+ contracts deployed on Ethereum
            Sepolia testnet with verified source code.
          </>
        ),
        tags: [
          { name: "Solidity", icon: "ethereum" },
          { name: "Ethereum", icon: "ethereum" },
          { name: "Hardhat", icon: "javascript" },
        ],
        images: [],
      },
      {
        title: "DevOps & Infrastructure",
        description: (
          <>
            Docker Compose multi-service orchestration, Nginx reverse proxy (20+ domains on single
            VPS), PM2 process management, Tailscale mesh networking (VPS + NAS + N305 server + dev
            PC), Baota Panel server administration.
          </>
        ),
        tags: [
          { name: "Docker", icon: "docker" },
          { name: "Nginx", icon: "nginx" },
          { name: "Linux", icon: "linux" },
          { name: "Git", icon: "git" },
        ],
        images: [],
      },
      {
        title: "Database & Storage",
        description: (
          <>
            PostgreSQL (15/16) with Alembic migrations and TimescaleDB for time-series data. Redis
            for caching and Celery task queues. SQLite for lightweight embedded databases. Synology
            NAS integration via FileStation API.
          </>
        ),
        tags: [
          { name: "PostgreSQL", icon: "postgres" },
          { name: "Redis", icon: "docker" },
          { name: "SQLite", icon: "javascript" },
        ],
        images: [],
      },
      {
        title: "Design & Tools",
        description: (
          <>
            TailwindCSS + shadcn/ui for rapid UI development, Once UI design system, Figma
            prototyping, TinaCMS for Git-backed content management. Biome for code formatting, Husky
            + lint-staged for pre-commit quality gates.
          </>
        ),
        tags: [
          { name: "Tailwind", icon: "tailwind" },
          { name: "Figma", icon: "figma" },
          { name: "HTML5", icon: "html5" },
          { name: "CSS3", icon: "css3" },
        ],
        images: [],
      },
    ],
  },
};

const blog: Blog = {
  path: "/blog",
  label: "Blog",
  title: "Writing about code, infrastructure, and shipping products",
  description: `Read what ${person.name} has been working on — technical deep-dives, project retrospectives, and lessons learned.`,
};

const work: Work = {
  path: "/work",
  label: "Work",
  title: `Projects – ${person.name}`,
  description: `Design and development projects by ${person.name} — SaaS tools, Web3 platforms, AI pipelines, and trading systems.`,
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery – ${person.name}`,
  description: `A photo collection by ${person.name}`,
  images: [
    {
      src: "/images/gallery/horizontal-1.jpg",
      alt: "Workspace setup",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-4.jpg",
      alt: "Code on screen",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-3.jpg",
      alt: "Server rack",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-1.jpg",
      alt: "Development environment",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-2.jpg",
      alt: "Terminal session",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-2.jpg",
      alt: "Dashboard view",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-4.jpg",
      alt: "Infrastructure diagram",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-3.jpg",
      alt: "Project architecture",
      orientation: "vertical",
    },
  ],
};

export { person, social, newsletter, home, about, blog, work, gallery };
