const STORAGE_KEY = "portfolio-site-data-v1";
const DEV_MODE_KEY = "portfolio-dev-mode";
const DEBUG_LOG_LIMIT = 80;
const APP_BUILD_VERSION = "20260614-local-source";
const debugLogs = [];
let debugCaptureReady = false;
let debugLogFilter = "";

const DEFAULT_SITE_DATA = {
  updatedAt: "2026-05-30T00:00:00.000Z",
  sections: {
    about: { nav: "介绍", kicker: "Personal Introduction", title: "个人介绍", copy: "" },
    experience: { nav: "经历", kicker: "Experience & Education", title: "经历与学习", copy: "" },
    projects: { nav: "作品", kicker: "Selected Work", title: "个人作品", copy: "" },
    steam: { nav: "游戏库", kicker: "Steam Library", title: "游戏库", copy: "这些游戏记录了我的游玩兴趣、类型偏好和长期体验积累。" },
    contact: { nav: "联系", kicker: "Contact", title: "一起聊聊游戏设计与战斗系统", copy: "" }
  },
  cv: {
    src: "",
    fileName: "",
    label: "下载 CV"
  },
  profile: {
    name: "你的名字",
    initials: "YY",
    kicker: "Game Designer / Gameplay Programmer",
    title: "游戏设计师 & 战斗系统程序员",
    summary: "我关注动作游戏中的时机、反馈、节奏和玩家决策，喜欢把设计想法落到可玩的系统里。",
    about: [
      "我是一名偏设计实现型的游戏创作者，工作重点放在战斗系统、镜头反馈、角色状态机和关卡节奏上。比起只写一个功能，我更在意玩家按下按钮之后，画面、声音、动画和数值是否形成清楚的回应。",
      "目前主要使用 Unreal Engine 和 C++ 做动作游戏原型，围绕完美闪避、弹反、处决、Boss 行为树、战斗镜头和 UI 反馈建立可迭代的玩法模块。",
      "我喜欢用研究的方式做设计：拆解优秀游戏，记录机制意图，再把假设做成小原型验证。这个网站可以作为个人介绍、作品归档和开发日志入口。"
    ],
    facts: [
      { value: "UE5", label: "主要引擎" },
      { value: "C++", label: "核心实现" },
      { value: "Combat", label: "设计方向" },
      { value: "Prototype", label: "当前阶段" }
    ],
    keywords: [
      { label: "技能", items: ["战斗系统", "玩法原型", "镜头反馈", "Boss AI"] },
      { label: "编程语言", items: ["C++", "Blueprint", "C#", "JavaScript"] },
      { label: "语言", items: ["中文", "英语", "日语"] },
      { label: "软件", items: ["Unreal Engine 5", "Unity", "Blender", "Git"] },
      { label: "AI", items: ["Claude", "Codex"] }
    ],
    links: [
      { label: "Email", href: "mailto:499133405@qq.com", icon: "mail", primary: true },
      { label: "GitHub", href: "https://github.com/", icon: "github" },
      { label: "Bilibili", href: "https://space.bilibili.com/", icon: "video" }
    ]
  },
  timeline: [
    {
      date: "2026-现在",
      title: "阴阳之力 | UE5 动作战斗项目",
      description: "搭建玩家战斗、Boss AI、完美闪避、弹反处决、镜头反馈和 HUD 表现等核心模块。",
      tags: ["Unreal Engine", "C++", "Action Combat"]
    },
    {
      date: "2026",
      title: "战斗反馈系统迭代",
      description: "围绕命中停顿、镜头冲击、受击反馈、血量表现和状态窗口设计可调参数，提升可读性和手感。",
      tags: ["Game Feel", "Camera", "UI Feedback"]
    },
    {
      date: "2025",
      title: "游戏机制研究与原型练习",
      description: "持续拆解动作、解谜和 Roguelike 游戏中的风险回报、节奏曲线与玩家学习路径。",
      tags: ["Gameplay Research", "Design Notes", "Prototyping"]
    }
  ],
  projects: [
    {
      title: "阴阳之力",
      year: "2026",
      role: "Solo Developer",
      category: "games",
      engine: "UE5",
      image: "assets/slash-preview.png",
      description: "以阴阳资源、近战攻防和高反馈动作为核心的第三人称动作游戏原型。",
      tags: ["Action", "Combat", "Boss"]
    },
    {
      title: "完美闪避与反击窗口",
      year: "2026",
      role: "Gameplay Programmer",
      category: "systems",
      engine: "C++",
      image: "assets/recovery-preview.png",
      description: "用通知窗口、状态约束和镜头反馈组合出更清晰的闪避收益与反击节奏。",
      tags: ["Dodge", "Timing", "Feedback"]
    },
    {
      title: "Boss 行为树战斗循环",
      year: "2026",
      role: "AI / Combat",
      category: "systems",
      engine: "UE5",
      image: "assets/blood-veins-preview.png",
      description: "处理近远距离攻击、受击恢复、压迫感参数和阶段切换，让敌人行为更稳定。",
      tags: ["Boss AI", "Behavior Tree", "Balance"]
    },
    {
      title: "动作镜头反馈库",
      year: "2026",
      role: "Tools / Feel",
      category: "design",
      engine: "Data Assets",
      image: "assets/slash-preview.png",
      description: "把攻击、处决和完美动作的镜头表现拆成可复用配置，方便快速调手感。",
      tags: ["Camera", "Data Asset", "Game Feel"]
    },
    {
      title: "生命值与受击表现",
      year: "2026",
      role: "UI / VFX",
      category: "design",
      engine: "UMG",
      image: "assets/blood-veins-preview.png",
      description: "探索伤痕、回血流动、屏幕边缘压迫等反馈，让战斗状态更容易被玩家感知。",
      tags: ["HUD", "VFX", "Readability"]
    },
    {
      title: "机制拆解笔记",
      year: "2025",
      role: "Research",
      category: "research",
      engine: "Notes",
      image: "assets/recovery-preview.png",
      description: "记录动作游戏中的风险回报、节奏设计、技能引导和玩家成长曲线。",
      tags: ["Research", "Design", "Analysis"]
    }
  ],
  research: [
    {
      title: "战斗节奏",
      description: "关注攻击前摇、取消窗口、破绽暴露和奖励反馈之间的关系。"
    },
    {
      title: "玩家可读性",
      description: "通过动画姿态、镜头重心、UI 层级和音效提示降低判断成本。"
    },
    {
      title: "原型验证",
      description: "用小范围可玩版本验证机制，再决定是否扩展成完整系统。"
    }
  ],
  steamLibrary: {
    steamId: "76561198819812464",
    profileUrl: "https://steamcommunity.com/profiles/76561198819812464/",
    updatedAt: "",
    games: []
  },
  customSections: []
};

const DEFAULT_HERO_STYLE = {
  fontFamily: '"Microsoft YaHei UI", "Microsoft YaHei", "Segoe UI", sans-serif',
  headingSize: "42px",
  lineHeight: "1.18",
  headingWeight: "780",
  maxWidth: "1120px",
  titleSize: "16px",
  titleLineHeight: "1.45",
  align: "center",
  nowrap: true
};

function cssLength(value, fallback) {
  const raw = String(value || "").trim();
  if (!raw) return fallback;
  return /^-?\d+(\.\d+)?$/.test(raw) ? `${raw}px` : raw;
}

function normalizeHeroStyle(value = {}) {
  const source = value && typeof value === "object" ? value : {};
  const align = ["left", "center", "right"].includes(source.align) ? source.align : DEFAULT_HERO_STYLE.align;
  return {
    fontFamily: String(source.fontFamily || DEFAULT_HERO_STYLE.fontFamily).trim(),
    headingSize: cssLength(source.headingSize, DEFAULT_HERO_STYLE.headingSize),
    lineHeight: String(source.lineHeight || DEFAULT_HERO_STYLE.lineHeight).trim(),
    headingWeight: String(source.headingWeight || DEFAULT_HERO_STYLE.headingWeight).trim(),
    maxWidth: cssLength(source.maxWidth, DEFAULT_HERO_STYLE.maxWidth),
    titleSize: cssLength(source.titleSize, DEFAULT_HERO_STYLE.titleSize),
    titleLineHeight: String(source.titleLineHeight || DEFAULT_HERO_STYLE.titleLineHeight).trim(),
    align,
    nowrap: source.nowrap !== false
  };
}

function applyHeroStyle(value) {
  const hero = document.querySelector(".hero");
  const inner = document.querySelector(".hero-inner");
  if (!hero || !inner) return;
  const style = normalizeHeroStyle(value);
  hero.style.setProperty("--hero-align", style.align);
  inner.style.setProperty("--hero-font-family", style.fontFamily);
  inner.style.setProperty("--hero-heading-size", style.headingSize);
  inner.style.setProperty("--hero-line-height", style.lineHeight);
  inner.style.setProperty("--hero-heading-weight", style.headingWeight);
  inner.style.setProperty("--hero-max-width", style.maxWidth);
  inner.style.setProperty("--hero-title-size", style.titleSize);
  inner.style.setProperty("--hero-title-line-height", style.titleLineHeight);
  inner.style.setProperty("--hero-align", style.align);
  inner.style.setProperty("--hero-white-space", style.nowrap ? "nowrap" : "normal");
}

const iconMap = {
  mail:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v12H4z" fill="none" stroke="currentColor" stroke-width="2"/><path d="m4 7 8 6 8-6" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  wechat:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 6a6 5 0 0 0-6 5 4.8 4.8 0 0 0 2.2 3.9l-.5 2 2.2-1a7.6 7.6 0 0 0 2.1.3 6 5 0 0 0 6-5 6 5 0 0 0-6-5z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M14.2 10.2a5.2 4.3 0 0 1 6.3 4.2 4.2 4.2 0 0 1-2 3.5l.4 1.7-1.9-.8a6.4 6.4 0 0 1-1.8.2 5.4 4.4 0 0 1-5.1-3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M7.7 10.4h.1M11.2 10.4h.1M14.4 14.1h.1M17.2 14.1h.1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  phone:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h3l1.5 4-2 1.2a11 11 0 0 0 5.3 5.3l1.2-2 4 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 5 6.2 2 2 0 0 1 7 4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  github:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3 19c.5.1.7-.2.7-.5v-2c-2.8.6-3.4-1.2-3.4-1.2-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 0 1.6 1.1 1.6 1.1.9 1.6 2.5 1.1 3.1.8.1-.7.4-1.1.7-1.4-2.2-.3-4.6-1.1-4.6-4.9 0-1.1.4-2 1.1-2.7-.1-.3-.5-1.3.1-2.7 0 0 .9-.3 2.8 1a9.8 9.8 0 0 1 5.2 0c2-1.3 2.8-1 2.8-1 .6 1.4.2 2.4.1 2.7.7.7 1.1 1.6 1.1 2.7 0 3.8-2.3 4.6-4.6 4.9.4.3.8 1 .8 2.1v3.1c0 .3.2.6.8.5A10 10 0 0 0 12 2z" fill="currentColor"/></svg>',
  video:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="6" width="16" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="m10 9 5 3-5 3z" fill="currentColor"/></svg>',
  gamepad:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10h10a4 4 0 0 1 3.8 5.3l-.5 1.5a2 2 0 0 1-3.2.8L15 16H9l-2.1 1.6a2 2 0 0 1-3.2-.8l-.5-1.5A4 4 0 0 1 7 10z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 13v3M6.5 14.5h3M16.8 13.5h.1M18.8 15.5h.1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  sun:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  moon:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 7 7 0 1 0 20 15.5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  edit:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20z" fill="none" stroke="currentColor" stroke-width="2"/><path d="m13.5 7.5 3 3" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  close:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  plus:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  save:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h12l2 2v14H5z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 4v6h8V4M8 20v-6h8v6" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  download:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  trash:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
};

const baseNavItems = [
  { id: "about", label: "介绍" },
  { id: "experience", label: "经历" },
  { id: "projects", label: "作品" },
  { id: "steam", label: "游戏库" },
  { id: "contact", label: "联系" }
];

const categoryLabels = {
  all: "全部",
  games: "游戏",
  systems: "系统",
  design: "设计",
  research: "研究"
};

const steamGenreFilters = [
  { id: "all", label: "全部", aliases: [] },
  { id: "role-playing", label: "角色扮演", aliases: ["角色扮演", "RPG"] },
  { id: "action", label: "动作", aliases: ["动作", "Action"] },
  { id: "indie", label: "独立游戏", aliases: ["独立", "Indie"] },
  { id: "strategy", label: "策略", aliases: ["策略", "Strategy"] }
];

const gamePlatformDefaults = [
  {
    id: "playstation",
    label: "PlayStation",
    logo: "playstation",
    description: "这里预留给 PlayStation 游戏。你可以先添加名字、类型和游玩时间，封面后续再补。",
    games: []
  },
  {
    id: "nintendo",
    label: "Nintendo",
    logo: "nintendo",
    description: "这里预留给 Nintendo 游戏。你可以先添加名字、类型和游玩时间，封面后续再补。",
    games: []
  }
];

const timelineGroups = [
  { id: "education", label: "教育", empty: "还没有添加教育经历。" },
  { id: "work", label: "工作", empty: "还没有添加工作经历。" }
];

const timelineGroupLabels = {
  education: "教育",
  work: "工作"
};

let siteData = cloneData(DEFAULT_SITE_DATA);
let lastDataSource = "default";
let activeProjectFilter = "all";
let activeSteamGenreFilter = "all";
const GAME_LIBRARY_PAGE_SIZE = 20;
const PROJECT_DETAIL_SECTION_INDEX = -2;
let activeSteamPage = 1;
const activePlatformPages = {};
let activeTimelineGroup = "work";
let revealObserver;
let scrollSpy;
let currentEditorTab = "profile";
let currentTimelineEditorGroup = "work";
let inlineEditMode = false;

function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function attr(value) {
  return escapeHtml(value);
}

function icon(name) {
  return iconMap[name] || "";
}

function toParagraphs(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  return String(value || "")
    .split(/\n\s*\n/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

function toTags(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  return String(value || "")
    .split(/[,，\n]/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

function toOrder(value, fallback = 999) {
  const numeric = Number.parseInt(value, 10);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : fallback;
}

function orderValue(item, index = 0) {
  return toOrder(item?.order, index + 1);
}

function cssSize(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  if (/^\d+(\.\d+)?$/.test(text)) return `${text}px`;
  if (/^\d+(\.\d+)?(px|%|rem|em|vw|vh|vmin|vmax)$/i.test(text)) return text;
  if (/^(min|max|clamp)\([\d\s.,/%a-z-]+\)$/i.test(text)) return text;
  return "";
}

function cssAspect(value) {
  const text = String(value || "").trim().replace(/\s+/g, " ");
  if (!text) return "";
  if (/^\d+(\.\d+)?\s*\/\s*\d+(\.\d+)?$/.test(text)) return text;
  if (/^\d+(\.\d+)?$/.test(text)) return text;
  return "";
}

function cssFit(value) {
  const text = String(value || "").trim();
  return ["cover", "contain", "fill", "scale-down"].includes(text) ? text : "";
}

function renderImageStyle(item) {
  const declarations = [];
  const width = cssSize(item?.imageWidth);
  const aspect = cssAspect(item?.imageAspect);
  const fit = cssFit(item?.imageFit);
  if (width) declarations.push(`--project-image-width: ${width}`);
  if (aspect) declarations.push(`--project-image-aspect: ${aspect}`);
  if (fit) declarations.push(`--project-image-fit: ${fit}`);
  return declarations.length ? ` style="${attr(declarations.join("; "))}"` : "";
}

function sortByOrder(items) {
  return [...items].sort((left, right) => {
    const leftOrder = orderValue(left, left.index ?? 0);
    const rightOrder = orderValue(right, right.index ?? 0);
    return leftOrder === rightOrder ? (left.index ?? 0) - (right.index ?? 0) : leftOrder - rightOrder;
  });
}

function getNextOrder(items) {
  return Math.max(0, ...items.map((item, index) => orderValue(item, index))) + 1;
}

function isFeatured(item, index = 0) {
  return orderValue(item, index) === 1;
}

function isCurrentTimelineItem(item) {
  return /现在|至今|当前|present|current|now/i.test(String(item?.date || ""));
}

function isProgrammingKeyword(value) {
  const text = String(value || "").trim();
  return /^(c\+\+|c#|c|blueprint|java|javascript|typescript|python|lua|gdscript|hlsl|glsl|shader|html|css|sql)$/i.test(text) || /蓝图|编程|脚本|script/i.test(text);
}

function normalizeKeywordGroups(groups) {
  const normalized = (Array.isArray(groups) ? groups : [])
    .map((group) => ({
      label: String(group?.label || "关键词").trim(),
      items: toTags(group?.items)
    }))
    .filter((group) => group.label || group.items.length);

  const hasProgrammingGroup = normalized.some((group) => group.label === "编程语言");
  const migrated = [];
  let migratedOldLanguage = false;

  normalized.forEach((group) => {
    if ((group.label === "语言" || group.label.toLowerCase() === "language") && group.items.some(isProgrammingKeyword) && !hasProgrammingGroup) {
      migrated.push({ ...group, label: "编程语言" });
      migratedOldLanguage = true;
      return;
    }

    migrated.push(group);
  });

  if (migratedOldLanguage && !migrated.some((group) => group.label === "语言")) {
    migrated.push({ label: "语言", items: ["中文", "英语", "日语"] });
  }

  return migrated;
}

function inferProjectLanguage(project) {
  const text = `${project.language || ""} ${project.engine || ""} ${toTags(project.tags).join(" ")}`;
  const languages = [];
  if (/C\+\+/i.test(text)) languages.push("C++");
  if (/Blueprint|蓝图|UE5|Unreal/i.test(text)) languages.push("Blueprint");
  if (/C#|Unity/i.test(text)) languages.push("C#");
  return languages.join(" / ") || String(project.language || "").trim();
}

function inferProjectGameType(project) {
  const tags = toTags(project.tags);
  return String(project.gameType || tags[0] || categoryLabels[project.category] || "").trim();
}

function normalizeProject(project, index = 0) {
  const item = project && typeof project === "object" ? project : {};
  const responsibility = String(item.responsibility || item.role || "Designer / Developer").trim();
  return {
    ...item,
    title: String(item.title || "未命名作品").trim(),
    year: String(item.year || "").trim(),
    role: String(item.role || responsibility).trim(),
    responsibility,
    category: String(item.category || "design").trim(),
    engine: String(item.engine || "").trim(),
    language: String(item.language || inferProjectLanguage(item)).trim(),
    gameType: inferProjectGameType(item),
    image: String(item.image || "assets/slash-preview.png").trim(),
    imageWidth: String(item.imageWidth || "").trim(),
    imageAspect: String(item.imageAspect || "").trim(),
    imageFit: String(item.imageFit || "cover").trim(),
    description: String(item.description || "").trim(),
    slug: projectCardSlug(item, index),
    website: String(item.website || item.url || item.href || "").trim(),
    detailBlocks: normalizeDetailBlocks(item.detailBlocks, item.details || ""),
    tags: toTags(item.tags),
    order: orderValue(item, index)
  };
}

function extractActionHref(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  if (text.startsWith("#")) return text;

  const urlMatch = text.match(/https?:\/\/[^\s"'<>]+/i);
  if (urlMatch) return urlMatch[0];

  const wwwMatch = text.match(/www\.[^\s"'<>]+/i);
  if (wwwMatch) return `https://${wwwMatch[0]}`;

  return text;
}

function normalizeProjects(projects) {
  return (Array.isArray(projects) ? projects : []).map((project, index) => normalizeProject(project, index));
}

function normalizeGamePlatforms(platforms) {
  const sourcePlatforms = Array.isArray(platforms) ? platforms : [];
  const byId = new Map(sourcePlatforms.map((platform) => [String(platform?.id || "").trim(), platform]));

  const defaults = gamePlatformDefaults.map((platform) => {
    const source = byId.get(platform.id) || {};
    byId.delete(platform.id);
    return normalizeGamePlatform({ ...platform, ...source });
  });

  const custom = Array.from(byId.values()).map((platform) => normalizeGamePlatform(platform));
  return [...defaults, ...custom].filter((platform) => platform.id && platform.label);
}

function normalizeGamePlatform(platform) {
  const source = platform && typeof platform === "object" ? platform : {};
  const id = slugify(source.id || source.label || "platform");
  return {
    id,
    label: String(source.label || source.name || id).trim(),
    logo: String(source.logo || id).trim(),
    description: String(source.description || "").trim(),
    games: (Array.isArray(source.games) ? source.games : []).map((game) => normalizeManualGame(game)).filter((game) => game.name)
  };
}

function normalizeManualGame(game) {
  const source = game && typeof game === "object" ? game : {};
  const minutes = Number(source.playtimeMinutes ?? source.minutes ?? 0);
  const hours = Number(source.playtimeHours ?? source.hours ?? 0);
  const playtimeMinutes = Number.isFinite(minutes) && minutes > 0
    ? Math.round(minutes)
    : Math.max(0, Math.round((Number.isFinite(hours) ? hours : 0) * 60));

  return {
    name: String(source.name || "").trim(),
    image: String(source.image || source.cover || "").trim(),
    genres: toTags(source.genres || source.genre || source.type),
    playtimeMinutes
  };
}

function createDetailBlock(type = "text", order = 1) {
  if (type === "image") {
    return {
      type: "image",
      order,
      src: "assets/recovery-preview.png",
      caption: "图片说明",
      alt: "",
      imageWidth: "",
      imageAspect: "",
      imageFit: "contain"
    };
  }

  if (type === "document") {
    return {
      type: "document",
      order,
      title: "文档标题",
      src: "assets/docs/example.pdf",
      description: "这里写文档说明。",
      fileName: "",
      preview: "auto"
    };
  }

  if (type === "video") {
    return {
      type: "video",
      order,
      title: "视频标题",
      src: "",
      description: "这里写视频说明。",
      poster: "",
      fileName: "",
      controls: true,
      loop: true,
      muted: true,
      autoplay: false
    };
  }
  return {
    type: "text",
    order,
    text: "在这里写详情文字。",
    textStyle: "body"
  };
}

function normalizeDetailBlock(block, index = 0) {
  const source = block && typeof block === "object" ? block : {};
  const type = source.type === "image" ? "image" : source.type === "document" ? "document" : source.type === "video" ? "video" : "text";

  if (type === "image") {
    return {
      type,
      order: orderValue(source, index),
      src: String(source.src || source.image || "").trim(),
      caption: String(source.caption || "").trim(),
      alt: String(source.alt || "").trim(),
      imageWidth: String(source.imageWidth || "").trim(),
      imageAspect: String(source.imageAspect || "").trim(),
      imageFit: String(source.imageFit || "contain").trim()
    };
  }

  if (type === "document") {
    return {
      type,
      order: orderValue(source, index),
      title: String(source.title || source.name || "文档").trim(),
      src: String(source.src || source.href || source.url || "").trim(),
      description: String(source.description || source.caption || "").trim(),
      fileName: String(source.fileName || source.filename || "").trim(),
      preview: String(source.preview || "auto").trim()
    };
  }

  if (type === "video") {
    return {
      type,
      order: orderValue(source, index),
      title: String(source.title || source.name || "视频").trim(),
      src: String(source.src || source.href || source.url || source.video || "").trim(),
      description: String(source.description || source.caption || "").trim(),
      poster: String(source.poster || source.cover || "").trim(),
      fileName: String(source.fileName || source.filename || "").trim(),
      controls: source.controls !== false,
      loop: source.loop !== false,
      muted: source.muted !== false,
      autoplay: Boolean(source.autoplay)
    };
  }
  return {
    type,
    order: orderValue(source, index),
    text: String(source.text || source.content || "").trim(),
    textStyle: normalizeDetailTextStyle(source.textStyle || source.style || source.variant)
  };
}

function normalizeDetailTextStyle(value) {
  const style = String(value || "body").trim();
  return ["body", "heading", "subheading", "callout", "code"].includes(style) ? style : "body";
}

function detailTextStyleLabel(value) {
  const labels = {
    body: "正文",
    heading: "大标题",
    subheading: "小标题",
    callout: "重点提示",
    code: "代码块"
  };
  return labels[normalizeDetailTextStyle(value)] || labels.body;
}
function detailBlockHasContent(block) {
  if (block.type === "image") return Boolean(block.src);
  if (block.type === "document") return Boolean(block.src || block.title || block.description);
  if (block.type === "video") return Boolean(block.src || block.title || block.description);
  return Boolean(block.text);
}

function normalizeDetailBlocks(blocks, fallbackText = "") {
  const sourceBlocks = Array.isArray(blocks) ? blocks : [];
  const normalized = sourceBlocks
    .map((block, index) => normalizeDetailBlock(block, index))
    .filter((block) => detailBlockHasContent(block));

  if (normalized.length) return normalized;

  const text = String(fallbackText || "").trim();
  return text ? [normalizeDetailBlock({ type: "text", order: 1, text }, 0)] : [];
}

function getOrderedDetailBlocks(card) {
  return sortByOrder(normalizeDetailBlocks(card?.detailBlocks, card?.details || card?.description).map((block, index) => ({ ...block, index })));
}

function detailBlocksToText(blocks) {
  return normalizeDetailBlocks(blocks)
    .filter((block) => block.type === "text" && block.text)
    .map((block) => block.text)
    .join("\n\n");
}

function customCardSlug(card, index = 0) {
  return slugify(card?.slug || card?.id || card?.title || `prototype-${index + 1}`);
}

function projectCardSlug(project, index = 0) {
  return slugify(project?.slug || project?.id || project?.title || `project-${index + 1}`);
}

function normalizeCustomCard(card, index = 0) {
  const source = card && typeof card === "object" ? card : {};
  return {
    ...source,
    title: String(source.title || `原型单元 ${index + 1}`).trim(),
    slug: customCardSlug(source, index),
    description: String(source.description || source.text || "").trim(),
    details: String(source.details || source.detail || source.description || source.text || "").trim(),
    detailBlocks: normalizeDetailBlocks(source.detailBlocks, source.details || source.detail || source.description || source.text),
    order: orderValue(source, index),
    image: String(source.image || source.src || "assets/recovery-preview.png").trim(),
    tags: toTags(source.tags || "Prototype"),
    imageWidth: String(source.imageWidth || "").trim(),
    imageAspect: String(source.imageAspect || "").trim(),
    imageFit: String(source.imageFit || "cover").trim()
  };
}

function getOrderedCustomCards(section) {
  return sortByOrder((section.cards || []).map((card, index) => ({ ...normalizeCustomCard(card, index), index })));
}

function normalizeCustomSection(section, index = 0) {
  const source = section && typeof section === "object" ? section : {};
  const body = toParagraphs(source.body);
  const images = Array.isArray(source.images) ? source.images : [];
  let cards = Array.isArray(source.cards) ? source.cards.map((card, cardIndex) => normalizeCustomCard(card, cardIndex)) : [];

  if (!cards.length && images.length) {
    cards = images.map((image, imageIndex) =>
      normalizeCustomCard(
        {
          title: image.caption || source.title || source.navTitle || `原型单元 ${imageIndex + 1}`,
          description: body[imageIndex] || body[0] || image.caption || "",
          image: image.src || "assets/recovery-preview.png",
          tags: image.tags || "Prototype",
          imageWidth: image.imageWidth,
          imageAspect: image.imageAspect,
          imageFit: image.imageFit
        },
        imageIndex
      )
    );
  }

  const shouldUseCards =
    String(source.layout || "").trim() === "cards" ||
    source.id === "prototype" ||
    source.navTitle === "原型设计" ||
    source.title === "原型设计";

  if (!cards.length && shouldUseCards) {
    cards = [
      normalizeCustomCard(
        {
          title: source.title || source.navTitle || "原型设计",
          description: body[0] || "在这里写原型说明。",
          image: "assets/recovery-preview.png",
          imageAspect: "16 / 9",
          imageFit: "cover",
          tags: "Prototype"
        },
        0
      )
    ];
  }

  return {
    ...source,
    id: String(source.id || `custom-${index + 1}`).trim(),
    navTitle: String(source.navTitle || source.title || "新页签").trim(),
    kicker: String(source.kicker || "Custom").trim(),
    title: String(source.title || source.navTitle || "新的标题页签").trim(),
    body,
    layout: String(source.layout || (cards.length ? "cards" : "")).trim(),
    cards,
    images: images.map((image) => ({
      src: String(image?.src || "").trim(),
      caption: String(image?.caption || "").trim(),
      alt: String(image?.alt || "").trim()
    }))
  };
}

function normalizeCustomSections(sections) {
  return (Array.isArray(sections) ? sections : []).map((section, index) => normalizeCustomSection(section, index));
}

function normalizeSteamLibrary(library) {
  const source = library && typeof library === "object" ? library : {};
  const games = Array.isArray(source.games) ? source.games : [];
  return {
    steamId: String(source.steamId || "76561198819812464"),
    profileUrl: String(source.profileUrl || "https://steamcommunity.com/profiles/76561198819812464/"),
    updatedAt: String(source.updatedAt || ""),
    games: games.map((game) => normalizeSteamGame(game)).filter((game) => game.name)
  };
}

function normalizeSteamGame(game) {
  const source = game && typeof game === "object" ? game : {};
  const appid = Number(source.appid || source.appId || 0);
  return {
    appid,
    name: String(source.name || "").trim(),
    image: String(source.image || source.headerImage || steamImageForApp(appid)).trim(),
    genres: toTags(source.genres || source.genre || source.type),
    playtimeMinutes: toOrder(source.playtimeMinutes ?? source.playtime_forever, 0),
    playtimeRecentMinutes: toOrder(source.playtimeRecentMinutes ?? source.playtime_2weeks, 0)
  };
}

function steamImageForApp(appid) {
  return appid ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/header.jpg` : "";
}

function formatPlaytime(minutes) {
  const value = Number(minutes || 0);
  if (!value) return "未记录";
  if (value < 60) return `${value} 分钟`;
  const hours = value / 60;
  return hours >= 100 ? `${Math.round(hours)} 小时` : `${hours.toFixed(1)} 小时`;
}

function formatSteamDate(value) {
  if (!value) return "尚未导入";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("zh-CN", { year: "numeric", month: "short", day: "numeric" });
}

function getOrderedSteamGames() {
  return [...siteData.steamLibrary.games].sort((left, right) => {
    if (right.playtimeMinutes !== left.playtimeMinutes) {
      return right.playtimeMinutes - left.playtimeMinutes;
    }
    return left.name.localeCompare(right.name);
  });
}

function steamGameMatchesFilter(game, filterId = activeSteamGenreFilter) {
  if (filterId === "all") return true;
  const filter = steamGenreFilters.find((item) => item.id === filterId);
  if (!filter) return true;
  const genres = toTags(game.genres).join(" ");
  return filter.aliases.some((alias) => genres.toLowerCase().includes(alias.toLowerCase()));
}

function getFilteredSteamGames(games = getOrderedSteamGames()) {
  return games.filter((game) => steamGameMatchesFilter(game));
}

function getPageCount(total, pageSize = GAME_LIBRARY_PAGE_SIZE) {
  return Math.max(1, Math.ceil(Number(total || 0) / pageSize));
}

function clampPage(page, total, pageSize = GAME_LIBRARY_PAGE_SIZE) {
  const pageCount = getPageCount(total, pageSize);
  return Math.min(Math.max(Number(page) || 1, 1), pageCount);
}

function getPagedItems(items, page, pageSize = GAME_LIBRARY_PAGE_SIZE) {
  const safeItems = Array.isArray(items) ? items : [];
  const safePage = clampPage(page, safeItems.length, pageSize);
  const start = (safePage - 1) * pageSize;
  return {
    page: safePage,
    pageCount: getPageCount(safeItems.length, pageSize),
    items: safeItems.slice(start, start + pageSize)
  };
}

function renderGamePagination({ total, page, target, platformId = "" }) {
  if (total <= GAME_LIBRARY_PAGE_SIZE) return "";
  const pageCount = getPageCount(total);
  const currentPage = clampPage(page, total);
  const prevAttrs = target === "platform"
    ? `data-platform-id="${attr(platformId)}" data-platform-page="${currentPage - 1}"`
    : `data-steam-page="${currentPage - 1}"`;
  const nextAttrs = target === "platform"
    ? `data-platform-id="${attr(platformId)}" data-platform-page="${currentPage + 1}"`
    : `data-steam-page="${currentPage + 1}"`;
  return `
    <nav class="game-pagination" aria-label="游戏库分页">
      <button type="button" ${prevAttrs}${currentPage <= 1 ? " disabled" : ""}>上一页</button>
      <span>第 ${escapeHtml(currentPage)} / ${escapeHtml(pageCount)} 页</span>
      <button type="button" ${nextAttrs}${currentPage >= pageCount ? " disabled" : ""}>下一页</button>
    </nav>
  `;
}

function renderSteamGenreFilters(games) {
  const host = document.getElementById("steam-library-filters");
  if (!host) return;
  host.innerHTML = steamGenreFilters
    .map((filter) => {
      const count = filter.id === "all" ? games.length : games.filter((game) => steamGameMatchesFilter(game, filter.id)).length;
      return `
        <button class="filter-button${activeSteamGenreFilter === filter.id ? " is-active" : ""}" type="button" data-steam-filter="${attr(filter.id)}">
          ${escapeHtml(filter.label)} <span class="count">${escapeHtml(count)}</span>
        </button>
      `;
    })
    .join("");
}

function getOrderedProjects(active = "all") {
  return sortByOrder(
    siteData.projects
      .map((project, index) => ({ ...project, index }))
      .filter((project) => active === "all" || project.category === active)
  );
}

function splitTimelineItems(value) {
  const text = String(value || "").trim();
  if (!text) return [];

  const numberedParts = text
    .replace(/\r\n/g, "\n")
    .split(/(?:^|\s+)(?:\d+|[一二三四五六七八九十]+)[.．、)]\s*/g)
    .map((item) => item.trim())
    .filter(Boolean);

  if (numberedParts.length > 1) return numberedParts;

  const lines = text
    .split(/\n+/g)
    .map((item) => item.replace(/^(?:[-*•]|(?:\d+|[一二三四五六七八九十]+)[.．、)])\s*/, "").trim())
    .filter(Boolean);

  return lines.length ? lines : [text];
}

function renderTimelineDescription(value, options = {}) {
  const items = splitTimelineItems(value);
  if (!items.length) return "";

  const listTag = options.numbered === false ? "ul" : "ol";
  const className = `timeline-points${options.plain ? " is-plain" : ""}`;

  return `
    <${listTag} class="${className}">
      ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
    </${listTag}>
  `;
}
function normalizeTimelineType(value) {
  return value === "education" ? "education" : "work";
}

function getTimelineGroupConfig(type) {
  const normalizedType = normalizeTimelineType(type);
  return timelineGroups.find((group) => group.id === normalizedType) || timelineGroups[1];
}

function normalizeTimeline(items) {
  return (Array.isArray(items) ? items : []).map((entry, index) => {
    const item = entry && typeof entry === "object" ? entry : {};
    return {
      date: item.date || "",
      title: item.title || "",
      description: item.description || "",
      tags: toTags(item.tags),
      type: normalizeTimelineType(item.type),
      order: orderValue(item, index)
    };
  });
}

function getTimelineEntries(type) {
  const normalizedType = normalizeTimelineType(type);
  return sortByOrder(
    siteData.timeline
      .map((item, index) => ({ ...item, index, type: normalizeTimelineType(item.type) }))
      .filter((item) => item.type === normalizedType)
  );
}

function normalizeSections(value) {
  const fallback = cloneData(DEFAULT_SITE_DATA.sections || {});
  const source = value && typeof value === "object" ? value : {};
  const result = {};

  baseNavItems.forEach((item) => {
    const base = fallback[item.id] || {};
    const custom = source[item.id] || {};
    result[item.id] = {
      nav: String(custom.nav || base.nav || item.label || item.id).trim(),
      kicker: String(custom.kicker || base.kicker || "").trim(),
      title: String(custom.title || base.title || "").trim(),
      copy: String(custom.copy || base.copy || "").trim()
    };
  });

  return result;
}

function normalizeData(data) {
  const fallback = cloneData(DEFAULT_SITE_DATA);
  const source = data && typeof data === "object" ? data : {};
  return {
    updatedAt: source.updatedAt || fallback.updatedAt,
    sections: normalizeSections(source.sections || fallback.sections),
    cv: normalizeCvDocument(source.cv || fallback.cv),
    profile: {
      ...fallback.profile,
      ...(source.profile || {}),
      heroGreeting: String(source.profile?.heroGreeting || fallback.profile.heroGreeting || "").trim(),
      heroStyle: normalizeHeroStyle(source.profile?.heroStyle || fallback.profile.heroStyle),
      about: toParagraphs(source.profile?.about || fallback.profile.about),
      facts: Array.isArray(source.profile?.facts) ? source.profile.facts : fallback.profile.facts,
      keywords: normalizeKeywordGroups(source.profile?.keywords || fallback.profile.keywords),
      links: Array.isArray(source.profile?.links) ? source.profile.links : fallback.profile.links
    },
    timeline: normalizeTimeline(Array.isArray(source.timeline) ? source.timeline : fallback.timeline),
    projects: normalizeProjects(Array.isArray(source.projects) ? source.projects : fallback.projects),
    steamLibrary: normalizeSteamLibrary(source.steamLibrary || fallback.steamLibrary),
    gamePlatforms: normalizeGamePlatforms(source.gamePlatforms || fallback.gamePlatforms),
    research: Array.isArray(source.research) ? source.research : fallback.research,
    customSections: normalizeCustomSections(source.customSections)
  };
}

function normalizeCvDocument(value) {
  const source = value && typeof value === "object" ? value : {};
  return {
    src: String(source.src || source.href || "").trim(),
    fileName: String(source.fileName || source.name || "").trim(),
    label: String(source.label || "下载 CV").trim()
  };
}

function isNewer(left, right) {
  return new Date(left?.updatedAt || 0).getTime() > new Date(right?.updatedAt || 0).getTime();
}

function isDevModeRequested() {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.has("dev") || localStorage.getItem(DEV_MODE_KEY) === "1";
  } catch {
    return false;
  }
}

function isLocalPreviewServer() {
  try {
    return ["127.0.0.1", "localhost", "::1"].includes(window.location.hostname);
  } catch {
    return false;
  }
}

function clearLocalPreviewData() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Local storage can be unavailable in restricted browser modes.
  }
}

function mergePublishedCustomSections(localSections, serverSections) {
  if (!Array.isArray(localSections) || !Array.isArray(serverSections)) {
    return Array.isArray(localSections) ? localSections : serverSections;
  }

  const serverSectionByKey = new Map(serverSections.map((section) => [section.id || section.title || section.navTitle, section]));
  return localSections.map((localSection) => {
    const serverSection = serverSectionByKey.get(localSection.id || localSection.title || localSection.navTitle);
    if (!serverSection || !Array.isArray(localSection.cards) || !Array.isArray(serverSection.cards)) {
      return localSection;
    }

    const serverCardsByKey = new Map(serverSection.cards.map((card) => [card.slug || card.title, card]));
    return {
      ...localSection,
      cards: localSection.cards.map((localCard) => {
        const serverCard = serverCardsByKey.get(localCard.slug || localCard.title);
        if (!serverCard || !shouldPreferPublishedAnimatedAsset(localCard.image, serverCard.image)) {
          return localCard;
        }

        return {
          ...localCard,
          image: serverCard.image,
          imageAspect: serverCard.imageAspect || localCard.imageAspect,
          imageFit: serverCard.imageFit || localCard.imageFit
        };
      })
    };
  });
}

function shouldPreferPublishedAnimatedAsset(localImage, serverImage) {
  const local = String(localImage || "");
  const server = String(serverImage || "").toLowerCase();
  return local.startsWith("data:image/") && (server.endsWith(".gif") || server.endsWith(".webp"));
}

function mergePublishedAdditions(localData, serverData) {
  if (!serverData) return localData;

  const merged = {
    ...serverData,
    ...localData,
    sections: {
      ...(serverData.sections || {}),
      ...(localData.sections || {})
    }
  };
  const localSteam = localData.steamLibrary;
  const serverSteam = serverData.steamLibrary;
  const localSteamCount = Array.isArray(localSteam?.games) ? localSteam.games.length : 0;
  const serverSteamCount = Array.isArray(serverSteam?.games) ? serverSteam.games.length : 0;

  if (
    serverSteam &&
    (!localSteam ||
      (serverSteamCount > 0 && localSteamCount === 0) ||
      isNewer({ updatedAt: serverSteam.updatedAt }, { updatedAt: localSteam.updatedAt }))
  ) {
    merged.steamLibrary = serverSteam;
  }

  merged.customSections = mergePublishedCustomSections(localData.customSections, serverData.customSections);

  return merged;
}

async function loadInitialData() {
  const serverData = await readServerData();

  if ((isDevModeRequested() || isLocalPreviewServer()) && serverData) {
    clearLocalPreviewData();
    lastDataSource = "content.json";
    return normalizeData(serverData);
  }

  const localData = readLocalData();
  if (localData) {
    const mergedLocalData = mergePublishedAdditions(localData, serverData);
    if (!serverData || isNewer(mergedLocalData, serverData)) {
      lastDataSource = "localStorage";
      return normalizeData(mergedLocalData);
    }
  }

  lastDataSource = serverData ? "content.json" : localData ? "localStorage" : "default";
  return normalizeData(serverData || localData || DEFAULT_SITE_DATA);
}
function readLocalData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function readServerData() {
  if (!["http:", "https:"].includes(window.location.protocol)) {
    return null;
  }

  try {
    const response = await fetch(`content.json?ts=${Date.now()}`, { cache: "no-store" });
    return response.ok ? response.json() : null;
  } catch {
    return null;
  }
}

async function saveServerData(data) {
  if (!["http:", "https:"].includes(window.location.protocol)) {
    return false;
  }

  try {
    const response = await fetch("api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return response.ok;
  } catch {
    return false;
  }
}


async function uploadAssetFile(file, kind = "files") {
  if (!file || !["http:", "https:"].includes(window.location.protocol)) return "";

  try {
    debugLog("upload", "start", { kind, fileName: file.name, size: file.size, type: file.type });
    const dataUrl = await readFileAsDataUrl(file);
    const response = await fetch("api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, fileName: file.name, dataUrl })
    });
    const result = await response.json().catch(() => null);
    const path = response.ok && result?.ok && result.path ? result.path : "";
    debugLog("upload", path ? "success" : "failed response", { status: response.status, path, result }, path ? "info" : "warn");
    return path;
  } catch (error) {
    debugLog("upload", "failed exception", { error: debugString(error) }, "error");
    return "";
  }
}

function assetKindForDetailType(type) {
  if (type === "image") return "images";
  if (type === "document") return "documents";
  if (type === "video") return "videos";
  return "files";
}

function debugTime() {
  return new Date().toLocaleTimeString("zh-CN", { hour12: false });
}

function debugString(value) {
  if (value instanceof Error) return `${value.name}: ${value.message}`;
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function debugLog(scope, message, details = {}, level = "info") {
  debugLogs.unshift({
    time: debugTime(),
    level,
    scope,
    message,
    details
  });
  debugLogs.splice(DEBUG_LOG_LIMIT);
  renderDebugLogPanel();
}

function getVisibleDetailState() {
  const headerHeight = document.querySelector(".site-header")?.getBoundingClientRect().height || 0;
  const viewportHeight = window.innerHeight || 0;
  const detailNodes = Array.from(document.querySelectorAll(".prototype-detail-hero, .prototype-detail-block"));
  const visibleCount = detailNodes.filter((node) => {
    const rect = node.getBoundingClientRect();
    return rect.bottom > headerHeight + 24 && rect.top < viewportHeight - 24;
  }).length;
  const pageRect = document.querySelector(".prototype-detail-page")?.getBoundingClientRect();
  return {
    scrollY: Math.round(window.scrollY || 0),
    viewportHeight: Math.round(viewportHeight),
    scrollHeight: Math.round(document.documentElement.scrollHeight || 0),
    detailTop: pageRect ? Math.round(pageRect.top) : null,
    detailHeight: pageRect ? Math.round(pageRect.height) : null,
    visibleDetailNodes: visibleCount
  };
}

function debugRouteState(extra = {}) {
  const host = document.getElementById("prototype-detail-route");
  return {
    hash: window.location.hash,
    route: document.body.dataset.route || "",
    slug: typeof getPrototypeHashSlug === "function" ? getPrototypeHashSlug() : "",
    detailBlocks: document.querySelectorAll(".prototype-detail-block").length,
    hostChildren: host?.children.length ?? -1,
    ...getVisibleDetailState(),
    ...extra
  };
}

function debugDataState(extra = {}) {
  return {
    build: APP_BUILD_VERSION,
    dataSource: lastDataSource,
    projectCount: siteData.projects?.length || 0,
    projectActionCount: document.querySelectorAll(".project-actions").length,
    projectDetailLinkCount: document.querySelectorAll(".project-action.is-primary").length,
    steamGameCount: siteData.steamLibrary?.games?.length || 0,
    platformModules: (siteData.gamePlatforms || []).map((platform) => ({
      id: platform.id || platform.label || "",
      label: platform.label || "",
      gameCount: platform.games?.length || 0
    })),
    editorButtonCount: document.querySelectorAll("[data-dev-open], [data-inline-edit-toggle], [data-inline-save]").length,
    ...extra
  };
}

function correctBlankPrototypeViewport(reason = "unknown") {
  if (document.body.dataset.route !== "prototype-detail") return;
  const before = debugRouteState({ reason });
  if (before.visibleDetailNodes > 0) return;

  const page = document.querySelector(".prototype-detail-page");
  if (!page) return;
  window.scrollTo({ top: page.offsetTop, behavior: "auto" });
  debugLog("scroll", "corrected blank prototype viewport", {
    before,
    after: debugRouteState({ reason })
  }, "warn");
}

function setupDebugCapture() {
  if (debugCaptureReady) return;
  debugCaptureReady = true;
  window.addEventListener("error", (event) => {
    debugLog("window.error", event.message || "Runtime error", {
      source: event.filename,
      line: event.lineno,
      column: event.colno,
      error: debugString(event.error)
    }, "error");
  });
  window.addEventListener("unhandledrejection", (event) => {
    debugLog("promise", "Unhandled rejection", { reason: debugString(event.reason) }, "error");
  });
}
function setText(selector, value) {
  document.querySelectorAll(selector).forEach((node) => {
    node.textContent = value;
  });
}

function renderAll() {
  renderNav();
  renderSectionMeta();
  renderProfile();
  renderTimeline();
  renderFilters(activeProjectFilter);
  renderProjects(activeProjectFilter);
  renderSteamLibrary();
  renderCustomSections();
  renderCurrentDetailRoute();
  setupScrollSpy();
  observeReveals();
  syncInlineEditControls();
}

function getSectionConfig(id) {
  return siteData.sections?.[id] || DEFAULT_SITE_DATA.sections?.[id] || baseNavItems.find((item) => item.id === id) || {};
}

function renderSectionMeta() {
  baseNavItems.forEach((item) => {
    const section = getSectionConfig(item.id);
    setText(`[data-section-kicker="${item.id}"]`, section.kicker || "");
    setText(`[data-section-title="${item.id}"]`, section.title || "");
    setText(`[data-section-copy="${item.id}"]`, section.copy || "");
  });
  renderCvActions();
  renderInlineMainToolbars();
}

function canUploadCv() {
  return isDevModeRequested() || inlineEditMode || Boolean(document.querySelector("[data-dev-open]"));
}

function renderCvActions() {
  const container = document.querySelector("[data-cv-actions]");
  if (!container) return;

  const cv = normalizeCvDocument(siteData.cv);
  const hasCv = Boolean(cv.src);
  const uploadVisible = canUploadCv();
  container.innerHTML = `
    ${hasCv ? `<a class="link-button cv-download-button" href="${attr(cv.src)}" download="${attr(cv.fileName || "CV")}">${escapeHtml(cv.label || "下载 CV")}</a>` : ""}
    ${uploadVisible ? `
      <label class="link-button cv-upload-button">
        ${hasCv ? "替换 CV" : "上传 CV"}
        <input class="visually-hidden" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" data-cv-upload />
      </label>
    ` : ""}
  `;
}

function renderNav() {
  const baseItems = baseNavItems.map((item) => ({
    ...item,
    label: getSectionConfig(item.id).nav || item.label
  }));
  const customItems = siteData.customSections.map((section) => ({
    id: section.id,
    label: section.navTitle || section.title || "新页签"
  }));
  const contactItem = baseItems.find((item) => item.id === "contact");
  const steamItem = baseItems.find((item) => item.id === "steam");
  const mainItems = baseItems.filter((item) => item.id !== "contact" && item.id !== "steam");
  const navItems = [...mainItems, ...customItems, steamItem, contactItem].filter(Boolean);

  document.querySelector(".site-nav").innerHTML = navItems
    .map((item) => `<a href="#${attr(item.id)}">${escapeHtml(item.label)}</a>`)
    .join("");
}

const softwareIconMap = [
  { pattern: /unreal|ue5|ue\b/i, slug: "unrealengine" },
  { pattern: /unity/i, slug: "unity" },
  { pattern: /blender/i, slug: "blender" },
  { pattern: /^git$/i, slug: "git" },
  { pattern: /github/i, slug: "github" },
  { pattern: /sketchup|sketch up/i, slug: "sketchup" },
  { pattern: /photoshop|photo shop|ps\b/i, slug: "adobephotoshop" },
  { pattern: /\bword\b|microsoft word/i, slug: "microsoftword" },
  { pattern: /\bexcel\b|microsoft excel/i, slug: "microsoftexcel" },
  { pattern: /powerpoint|power point|ppt/i, slug: "microsoftpowerpoint" }
];

const aiIconMap = [
  { pattern: /claude|anthropic/i, slug: "claude" },
  { pattern: /codex|openai/i, slug: "codex" },
  { pattern: /gemini|google/i, slug: "gemini" }
];

function isSoftwareKeywordGroup(group) {
  const label = String(group?.label || "").trim();
  return label === "软件" || /software/i.test(label);
}

function isAiKeywordGroup(group) {
  const label = String(group?.label || "").trim();
  return label === "AI" || label === "人工智能" || /artificial intelligence/i.test(label);
}

function isIconKeywordGroup(group) {
  return isSoftwareKeywordGroup(group) || isAiKeywordGroup(group);
}

function getKeywordIcon(item, group) {
  const label = String(item || "").trim();
  if (!label) return null;

  const aiGroup = isAiKeywordGroup(group);
  const iconMap = aiGroup ? aiIconMap : softwareIconMap;
  const match = iconMap.find((entry) => entry.pattern.test(label));
  if (!match) return null;

  return {
    label,
    src: "assets/" + (aiGroup ? "ai-icons/" : "software-icons/") + match.slug + ".svg"
  };
}

function renderProfileKeywordGroup(group) {
  const items = toTags(group.items);
  const iconGroup = isIconKeywordGroup(group);

  return `
    <article class="keyword-group${iconGroup ? " is-software" : ""} reveal">
      <h3>${escapeHtml(group.label)}</h3>
      ${iconGroup ? renderSoftwareIconList(items, group) : renderKeywordChipList(items)}
    </article>
  `;
}

function renderKeywordChipList(items) {
  return `
    <div class="keyword-list">
      ${items.map((item) => `<span class="keyword-chip">${escapeHtml(item)}</span>`).join("")}
    </div>
  `;
}

function renderSoftwareIconList(items, group) {
  return `
    <div class="software-icon-list">
      ${items.map((item) => renderSoftwareIconItem(item, group)).join("")}
    </div>
  `;
}

function renderSoftwareIconItem(item, group) {
  const iconData = getKeywordIcon(item, group);
  const fallback = String(item || "").trim().slice(0, 2).toUpperCase();

  return `
    <span class="software-icon-card" title="${attr(item)}">
      <span class="software-icon-mark" aria-hidden="true">
        ${
          iconData
            ? `<img src="${attr(iconData.src)}" alt="" loading="lazy" onerror="this.hidden=true; this.nextElementSibling.hidden=false;" /><span hidden>${escapeHtml(fallback)}</span>`
            : `<span>${escapeHtml(fallback)}</span>`
        }
      </span>
      <span>${escapeHtml(item)}</span>
    </span>
  `;
}

function renderContactLink(link) {
  const rawHref = String(link.href || "#").trim() || "#";
  const href =
    (link.icon === "mail" || String(link.label || "").toLowerCase() === "email") &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawHref)
      ? `mailto:${rawHref}`
      : rawHref;
  const isExternal = href.startsWith("http://") || href.startsWith("https://");
  return `
    <a class="link-button${link.primary ? " primary" : ""}" href="${attr(href)}" target="${isExternal ? "_blank" : "_self"}" rel="noreferrer">
      ${icon(link.icon)}
      <span>${escapeHtml(link.label)}</span>
    </a>
  `;
}

function renderProfile() {
  const { profile } = siteData;
  const heroGreeting = profile.heroGreeting || `Hi，我是${profile.name}，很高兴遇见你，`;
  document.title = `${profile.name} | Personal Portfolio`;
  setText("[data-profile-name]", profile.name);
  setText("[data-profile-greeting]", heroGreeting);
  setText("[data-profile-initials]", profile.initials);
  setText("[data-profile-kicker]", profile.kicker);
  setText("[data-profile-title]", profile.title);
  setText("[data-profile-summary]", profile.summary);
  setText("[data-current-year]", new Date().getFullYear());
  applyHeroStyle(profile.heroStyle);

  document.getElementById("about-copy").innerHTML = profile.about
    .map(
      (paragraph, index) => `<p data-inline-editable data-inline-profile-about="${index}">${escapeHtml(paragraph)}</p>`
    )
    .join("");

  document.getElementById("profile-facts").innerHTML = profile.facts
    .map(
      (fact) => `
        <div class="fact-item reveal">
          <strong>${escapeHtml(fact.value)}</strong>
          <span>${escapeHtml(fact.label)}</span>
        </div>
      `
    )
    .join("");

  document.getElementById("profile-keywords").innerHTML = profile.keywords
    .map(renderProfileKeywordGroup)
    .join("");

  const links = profile.links.map(renderContactLink).join("");
  ["about-links", "footer-links"].forEach((id) => {
    const container = document.getElementById(id);
    if (container) container.innerHTML = links;
  });
}

function renderTimeline() {
  const container = document.getElementById("timeline");
  const entries = siteData.timeline.map((item, index) => ({ ...item, index, type: normalizeTimelineType(item.type) }));
  const grouped = {
    work: sortByOrder(entries.filter((item) => item.type === "work")),
    education: sortByOrder(entries.filter((item) => item.type === "education"))
  };
  const hasAnyItems = grouped.work.length || grouped.education.length;

  container.innerHTML = hasAnyItems
    ? [renderTimelineGroup("work", grouped.work), renderTimelineGroup("education", grouped.education, true)].filter(Boolean).join("")
    : `<div class="timeline-empty reveal">还没有添加经历。</div>`;
}

function renderTimelineGroup(type, items, compact = false) {
  if (!items.length && compact) return "";

  const config = getTimelineGroupConfig(type);
  const title = type === "work" ? "工作经历" : "教育经历";
  const kicker = type === "work" ? "Work Experience" : "Education";

  return `
    <section class="timeline-group${compact ? " is-compact" : ""}">
      <div class="timeline-group-heading reveal">
        <div>
          <p>${escapeHtml(kicker)}</p>
          <h3>${escapeHtml(title)}</h3>
          <span class="timeline-group-count">${items.length}</span>
        </div>
        ${renderInlineTimelineGroupToolbar(type)}
      </div>
      <div class="timeline-list${items.length ? "" : " is-empty"}">
        ${
          items.length
            ? items.map((item) => renderTimelineItem(item, compact)).join("")
            : `<div class="timeline-empty reveal">${escapeHtml(config.empty)}</div>`
        }
      </div>
    </section>
  `;
}

function renderTimelineItem(item, compact = false) {
  const featured = !compact && isFeatured(item, item.index);

  return `
    <article class="timeline-item reveal${featured ? " is-featured" : ""}${isCurrentTimelineItem(item) ? " is-current" : ""}" data-inline-timeline-item="${item.index}">
      ${renderInlineTimelineItemToolbar(item.index)}
      <div class="timeline-date" data-inline-editable data-inline-timeline-field="date" data-timeline-index="${item.index}">${escapeHtml(item.date)}</div>
      <div class="timeline-card">
        <h3 data-inline-editable data-inline-timeline-field="title" data-timeline-index="${item.index}">${escapeHtml(item.title)}</h3>
        <div class="inline-rendered-block">${renderTimelineDescription(item.description, { numbered: !compact, plain: compact })}</div>
        <textarea class="inline-card-textarea" data-inline-timeline-field="description" data-timeline-index="${item.index}">${escapeHtml(item.description || "")}</textarea>
        <div class="tag-row">${toTags(item.tags).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
        <input class="inline-tags-input" value="${attr(toTags(item.tags).join(", "))}" data-inline-timeline-field="tags" data-timeline-index="${item.index}" aria-label="经历标签" />
      </div>
    </article>
  `;
}

function getProjectCounts() {
  return siteData.projects.reduce(
    (counts, project) => {
      const category = project.category || "design";
      counts.all += 1;
      counts[category] = (counts[category] || 0) + 1;
      return counts;
    },
    { all: 0 }
  );
}

function getProjectCategories() {
  const preferred = ["all", "games", "systems", "design", "research"];
  const custom = Array.from(new Set(siteData.projects.map((project) => project.category).filter(Boolean)));
  return [...preferred, ...custom.filter((category) => !preferred.includes(category))];
}

function renderFilters(active = "all") {
  const counts = getProjectCounts();
  const categories = getProjectCategories();
  if (!counts[active]) {
    activeProjectFilter = "all";
    active = "all";
  }

  document.getElementById("project-filters").innerHTML = categories
    .filter((category) => counts[category])
    .map(
      (category) => `
        <button class="filter-button${category === active ? " is-active" : ""}" type="button" data-filter="${attr(category)}">
          <span>${escapeHtml(categoryLabels[category] || category)}</span>
          <span class="count">${counts[category]}</span>
        </button>
      `
    )
    .join("");
}

function renderProjects(active = "all") {
  const projects = getOrderedProjects(active);

  document.getElementById("project-grid").innerHTML = projects
    .map(
      (project) => `
        <article class="project-card reveal${isFeatured(project, project.index) ? " is-featured" : ""}" data-inline-project-card="${project.index}">
          ${renderInlineProjectToolbar(project.index)}
          <div class="project-media"${renderImageStyle(project)}>
            <img src="${attr(project.image)}" alt="${attr(project.title)}" loading="lazy" />
          </div>
          <div class="project-body">
            <div class="project-meta">
              <span data-inline-editable data-inline-project-field="year" data-project-index="${project.index}">${escapeHtml(project.year)}</span>
            </div>
            <h3 data-inline-editable data-inline-project-field="title" data-project-index="${project.index}">${escapeHtml(project.title)}</h3>
            <p class="inline-rendered-block">${escapeHtml(project.description)}</p>
            <textarea class="inline-card-textarea" data-inline-project-field="description" data-project-index="${project.index}">${escapeHtml(project.description || "")}</textarea>
            <div class="project-keywords">
              ${renderProjectKeyword("引擎", project.engine, true, project.index, "engine")}
              ${renderProjectKeyword("职责", project.responsibility || project.role, true, project.index, "responsibility")}
              ${renderProjectKeyword("语言", project.language, false, project.index, "language")}
              ${renderProjectKeyword("类型", project.gameType, false, project.index, "gameType")}
            </div>
            ${renderProjectTags(project)}
            ${renderProjectActions(project)}
          </div>
        </article>
      `
    )
    .join("");
}

function isDetailProject(project) {
  const title = String(project?.title || "").trim();
  const slug = String(project?.slug || "").trim();
  return title === "阴阳之力" || slug === "阴阳之力";
}

function renderProjectActions(project, options = {}) {
  const showDetail = options.detail !== false && isDetailProject(project);
  const showWebsiteSlot = options.websitePlaceholder !== false;
  const website = extractActionHref(project.website);
  if (!showDetail && !website && !showWebsiteSlot) return "";

  return `
    <div class="project-actions">
      ${showDetail ? `<a class="project-action is-primary" href="${attr(projectDetailHref(project))}">查看详情</a>` : ""}
      ${website ? `<a class="project-action" href="${attr(website)}" target="_blank" rel="noopener">跳转网站</a>` : ""}
      ${!website && showWebsiteSlot ? `<span class="project-action is-disabled">暂无网站</span>` : ""}
    </div>
  `;
}

function renderProjectKeyword(label, value, primary = false, projectIndex = -1, field = "") {
  if (!String(value || "").trim()) return "";
  const inlineAttrs = projectIndex >= 0 && field
    ? ` data-inline-editable data-inline-project-field="${attr(field)}" data-project-index="${projectIndex}"`
    : "";
  return `
    <div class="project-keyword${primary ? " is-primary" : ""}">
      <span class="project-keyword-label">${escapeHtml(label)}</span>
      <strong${inlineAttrs}>${escapeHtml(value)}</strong>
    </div>
  `;
}

function renderProjectTags(project) {
  const tags = toTags(project.tags);
  return `
    ${tags.length ? `<div class="tag-row project-extra-tags">${tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>` : ""}
    <input class="inline-tags-input" value="${attr(tags.join(", "))}" data-inline-project-field="tags" data-project-index="${project.index}" aria-label="作品标签" />
  `;
}

function renderSteamLibrary() {
  const library = siteData.steamLibrary;
  const games = getOrderedSteamGames();
  const filteredGames = getFilteredSteamGames(games);
  const pagedGames = getPagedItems(filteredGames, activeSteamPage);
  activeSteamPage = pagedGames.page;
  const summary = document.getElementById("steam-summary");
  const grid = document.getElementById("steam-library-grid");
  if (!summary || !grid) return;

  const totalMinutes = games.reduce((sum, game) => sum + Number(game.playtimeMinutes || 0), 0);
  summary.innerHTML = `
    <article>
      <strong>${escapeHtml(games.length)}</strong>
      <span>已导入 Steam 游戏</span>
    </article>
    <article>
      <strong>${escapeHtml(formatPlaytime(totalMinutes))}</strong>
      <span>累计游玩</span>
    </article>
    <article>
      <strong>${escapeHtml(formatSteamDate(library.updatedAt))}</strong>
      <span>最近更新</span>
    </article>
  `;

  renderSteamGenreFilters(games);

  grid.innerHTML = filteredGames.length
    ? `${pagedGames.items.map(renderSteamGameCard).join("")}${renderGamePagination({ total: filteredGames.length, page: activeSteamPage, target: "steam" })}`
    : `<div class="steam-empty reveal">这个分类下暂时没有游戏。</div>`;

  renderGamePlatformModules();
}

function renderSteamGameCard(game) {
  const genres = toTags(game.genres);
  return `
    <article class="steam-card reveal">
      <div class="steam-media">
        <img src="${attr(game.image)}" alt="${attr(game.name)}" loading="lazy" />
        <div class="steam-platform-badge">${platformLogoMarkup("steam", "Steam")}<span>Steam</span></div>
      </div>
      <div class="steam-card-body">
        <h3>${escapeHtml(game.name)}</h3>
        <div class="steam-card-meta">
          <span>${escapeHtml(formatPlaytime(game.playtimeMinutes))}</span>
          ${game.playtimeRecentMinutes ? `<span>近两周 ${escapeHtml(formatPlaytime(game.playtimeRecentMinutes))}</span>` : ""}
        </div>
        <div class="tag-row steam-genre-row">
          ${genres.length ? genres.map((genre) => `<span class="tag">${escapeHtml(genre)}</span>`).join("") : `<span class="tag">未分类</span>`}
        </div>
      </div>
    </article>
  `;
}

function platformLogoMarkup(platform, label = platform) {
  const id = String(platform || "platform").toLowerCase();
  const text = String(label || platform || "").trim();
  const initials = id.includes("playstation") ? "PS" : id.includes("nintendo") ? "N" : id.includes("steam") ? "S" : text.slice(0, 2).toUpperCase();
  const steamMark = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="8" cy="15.5" r="3.2" fill="none" stroke="currentColor" stroke-width="2"/>
      <circle cx="16.3" cy="7.7" r="3.4" fill="none" stroke="currentColor" stroke-width="2"/>
      <path d="M10.7 13.4 14 10M4 13.8l2.6 1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `;
  return `<span class="platform-logo platform-logo-${attr(id)}" title="${attr(text)}">${id.includes("steam") ? steamMark : escapeHtml(initials)}</span>`;
}

function renderGamePlatformModules() {
  const host = document.getElementById("platform-game-modules");
  if (!host) return;
  host.innerHTML = siteData.gamePlatforms.map(renderGamePlatformModule).join("");
}

function renderGamePlatformModule(platform) {
  const games = [...platform.games].sort((left, right) => Number(right.playtimeMinutes || 0) - Number(left.playtimeMinutes || 0));
  const platformId = String(platform.id || platform.label || "platform");
  const pagedGames = getPagedItems(games, activePlatformPages[platformId] || 1);
  activePlatformPages[platformId] = pagedGames.page;
  const totalMinutes = games.reduce((sum, game) => sum + Number(game.playtimeMinutes || 0), 0);
  return `
    <section class="platform-module reveal">
      <div class="platform-module-head">
        <div class="platform-title-row">
          ${platformLogoMarkup(platform.logo || platform.id, platform.label)}
          <div>
            <h3>${escapeHtml(platform.label)}</h3>
            <p>${escapeHtml(platform.description || "可以在开发者模式里添加游戏。")}</p>
          </div>
        </div>
        <div class="platform-stats">
          <span>${escapeHtml(games.length)} 款</span>
          <span>${escapeHtml(formatPlaytime(totalMinutes))}</span>
        </div>
      </div>
      <div class="platform-game-grid">
        ${games.length ? `${pagedGames.items.map((game) => renderManualGameCard(game, platform)).join("")}${renderGamePagination({ total: games.length, page: pagedGames.page, target: "platform", platformId })}` : `<div class="platform-empty">这里已经预留好了。打开开发者模式的“游戏库”页签，就能添加 ${escapeHtml(platform.label)} 游戏。</div>`}
      </div>
    </section>
  `;
}

function renderManualGameCard(game, platform) {
  const genres = toTags(game.genres);
  const hasImage = String(game.image || "").trim();
  return `
    <article class="platform-game-card">
      <div class="platform-game-media">
        ${hasImage ? `<img src="${attr(game.image)}" alt="${attr(game.name)}" loading="lazy" />` : `<div class="platform-cover-placeholder">${platformLogoMarkup(platform.logo || platform.id, platform.label)}<span>封面待补</span></div>`}
      </div>
      <div class="platform-game-body">
        <h4>${escapeHtml(game.name)}</h4>
        <div class="steam-card-meta">
          <span>${escapeHtml(formatPlaytime(game.playtimeMinutes))}</span>
          <span>${escapeHtml(platform.label)}</span>
        </div>
        <div class="tag-row steam-genre-row">
          ${genres.length ? genres.map((genre) => `<span class="tag">${escapeHtml(genre)}</span>`).join("") : `<span class="tag">未分类</span>`}
        </div>
      </div>
    </article>
  `;
}

function renderResearch() {
  const host = document.getElementById("research-notes");
  if (!host) return;

  host.innerHTML = siteData.research
    .map(
      (note) => `
        <article class="note-item reveal">
          <h3>${escapeHtml(note.title)}</h3>
          <p>${escapeHtml(note.description)}</p>
        </article>
      `
    )
    .join("");
}

function renderCustomSections() {
  const host = document.getElementById("custom-sections");
  host.innerHTML = siteData.customSections.map((section, index) => renderCustomSection(section, index)).join("");
}

function renderCustomSection(section, index) {
  if (section.layout === "cards" || section.cards?.length) {
    return renderCustomCardSection(section, index);
  }

  return `
    <section class="section-band custom-section" id="${attr(section.id)}">
      ${renderInlineSectionToolbar(index, section)}
      <div class="section-inner custom-section-grid">
        <div>
          <p class="section-kicker">${escapeHtml(section.kicker || "Custom Section")}</p>
          <h2>${escapeHtml(section.title || section.navTitle || "新页签")}</h2>
          <div class="copy-stack">
            ${toParagraphs(section.body).map((paragraph, paragraphIndex) => `<p data-inline-editable data-inline-section-body data-section-index="${index}" data-body-index="${paragraphIndex}">${escapeHtml(paragraph)}</p>`).join("")}
          </div>
        </div>
        ${renderSectionImages(section.images || [], index)}
      </div>
    </section>
  `;
}

function renderCustomCardSection(section, index = 0) {
  const cards = getOrderedCustomCards(section);
  return `
    <section class="section-band custom-section" id="${attr(section.id)}">
      <div class="section-inner">
        <div class="section-heading">
          <div>
            <p class="section-kicker">${escapeHtml(section.kicker || "Custom Section")}</p>
            <h2>${escapeHtml(section.title || section.navTitle || "新页签")}</h2>
          </div>
          <p data-inline-editable data-inline-section-body data-section-index="${index}" data-body-index="0">${escapeHtml(toParagraphs(section.body)[0] || "")}</p>
          ${renderInlineSectionToolbar(index, section)}
        </div>
        <div class="project-grid custom-card-grid">
          ${cards.length ? cards.map((card) => renderCustomCard(card, section, index)).join("") : `<div class="platform-empty">还没有卡片。打开站内编辑模式后，可以直接添加卡片。</div>`}
        </div>
      </div>
    </section>
  `;
}

function renderCustomCard(card, section, sectionIndex = -1) {
  const image = card.image || "assets/recovery-preview.png";
  const cardIndex = card.index ?? 0;
  const isPrototype = isPrototypeSection(section);
  const cardMarkup = `
    <article class="project-card custom-card reveal" data-inline-custom-card="${sectionIndex}:${cardIndex}">
      <div class="project-media"${renderImageStyle(card)}>
        <img src="${attr(image)}" alt="${attr(card.title)}" loading="lazy" />
      </div>
      <div class="project-body">
        <div class="project-meta custom-card-meta">
          ${isPrototype ? "<span>查看详情</span>" : ""}
        </div>
        <h3 data-inline-editable data-inline-custom-card-field="title" data-section-index="${sectionIndex}" data-card-index="${cardIndex}">${escapeHtml(card.title)}</h3>
        <div class="inline-rendered-block">${renderCustomCardDescription(card.description)}</div>
        <textarea class="inline-card-textarea" data-inline-custom-card-field="description" data-section-index="${sectionIndex}" data-card-index="${cardIndex}">${escapeHtml(card.description || "")}</textarea>
        <div class="tag-row project-extra-tags">
          ${toTags(card.tags).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
        </div>
        ${isPrototype ? `<div class="project-actions custom-card-actions"><span class="project-action is-primary prototype-detail-button">查看详情</span></div>` : ""}
        <input class="inline-tags-input" value="${attr(toTags(card.tags).join(", "))}" data-inline-custom-card-field="tags" data-section-index="${sectionIndex}" data-card-index="${cardIndex}" aria-label="卡片标签" />
      </div>
    </article>
  `;

  const toolbar = renderInlineCardToolbar(sectionIndex, cardIndex);
  if (!isPrototype) {
    return `<div class="custom-card-shell">${toolbar}${cardMarkup}</div>`;
  }

  return `
    <div class="custom-card-shell prototype-card-shell">
      ${toolbar}
      <a class="prototype-card-link" href="${attr(prototypeCardHref(card))}" aria-label="查看 ${attr(card.title)} 详情">
        ${cardMarkup}
      </a>
    </div>
  `;
}

function isPrototypeSection(section) {
  return section?.id === "prototype" || section?.navTitle === "原型设计" || section?.title === "原型设计";
}

function prototypeCardHref(card) {
  return `#prototype/${encodeURIComponent(card.slug || customCardSlug(card, card.index || 0))}`;
}

function renderCustomCardDescription(description) {
  const lines = String(description || "")
    .split(/\n+/g)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) return "";
  if (lines.length === 1) return `<p>${escapeHtml(lines[0])}</p>`;

  const firstIsPoint = isListPoint(lines[0]);
  const restHasPoints = lines.slice(1).some(isListPoint);
  const lead = !firstIsPoint && restHasPoints ? lines[0] : "";
  const points = lead ? lines.slice(1) : lines;

  return `
    ${lead ? `<p class="project-points-lead">${escapeHtml(lead)}</p>` : ""}
    <ol class="project-points">
      ${points.map((point) => `<li>${escapeHtml(stripListMarker(point))}</li>`).join("")}
    </ol>
  `;
}

function isListPoint(value) {
  return /^\s*(\d+[.、)]|[-*•])\s+/.test(String(value || ""));
}

function stripListMarker(value) {
  return String(value || "").replace(/^\s*(\d+[.、)]|[-*•])\s+/, "").trim();
}

function getPrototypeSection() {
  return siteData.customSections.find((section) => isPrototypeSection(section));
}

function getPrototypeHashSlug() {
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash.startsWith("prototype/")) return "";
  return decodeURIComponent(hash.slice("prototype/".length));
}

function getProjectHashSlug() {
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash.startsWith("project/")) return "";
  return decodeURIComponent(hash.slice("project/".length));
}

function normalizeRouteSlug(value) {
  return String(value || "").trim().toLowerCase();
}

function getProjectBySlug(slug) {
  if (!slug) return null;
  const normalizedSlug = normalizeRouteSlug(slug);
  return getOrderedProjects("all").find((project) => {
    return normalizeRouteSlug(project.slug) === normalizedSlug || normalizeRouteSlug(projectCardSlug(project, project.index)) === normalizedSlug;
  }) || null;
}

function hasProjectDetail(project) {
  return getOrderedDetailBlocks(project).length > 0;
}

function projectDetailHref(project) {
  if (isDetailProject(project)) return "yinyang-design.html";
  return `#project/${encodeURIComponent(projectCardSlug(project, project.index))}`;
}

function getPrototypeCardBySlug(slug) {
  const section = getPrototypeSection();
  if (!section || !slug) return null;
  const normalizedSlug = normalizeRouteSlug(slug);
  return getOrderedCustomCards(section).find((card) => {
    return normalizeRouteSlug(card.slug) === normalizedSlug || normalizeRouteSlug(customCardSlug(card, card.index)) === normalizedSlug;
  }) || null;
}

function renderProjectDetailRoute(options = {}) {
  const host = document.getElementById("prototype-detail-route");
  if (!host) {
    debugLog("route", "project host missing", { hash: window.location.hash }, "warn");
    return;
  }

  const slug = getProjectHashSlug();
  const project = getProjectBySlug(slug);

  if (!slug) {
    return false;
  }

  document.body.dataset.route = "prototype-detail";

  if (!project) {
    debugLog("route", "project detail missing", {
      slug,
      projects: getOrderedProjects("all").map((item) => ({ title: item.title, slug: item.slug }))
    }, "error");
    host.innerHTML = `
      <section class="section-band prototype-detail-page">
        <div class="section-inner prototype-detail-inner">
          <a class="detail-back-link" href="#projects">返回作品</a>
          <p class="prototype-detail-empty">没有找到这个作品详情页：${escapeHtml(slug)}。</p>
        </div>
      </section>
    `;
    return true;
  }

  try {
    host.innerHTML = renderProjectDetailPage(project);
    observeReveals();
    debugLog("route", "project detail rendered", debugRouteState({ cardTitle: project.title }));
  } catch (error) {
    debugLog("route", "project detail render failed", { error: debugString(error), slug, projectTitle: project?.title }, "error");
    console.error("Project detail render failed", error);
    host.innerHTML = `
      <section class="section-band prototype-detail-page">
        <div class="section-inner prototype-detail-inner">
          <a class="detail-back-link" href="#projects">返回作品</a>
          <p class="prototype-detail-empty">作品详情页渲染失败，请检查刚添加的资源模块。</p>
        </div>
      </section>
    `;
  }

  if (options.scroll) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return true;
}

function renderPrototypeDetailRoute(options = {}) {
  const host = document.getElementById("prototype-detail-route");
  if (!host) {
    debugLog("route", "prototype host missing", { hash: window.location.hash }, "warn");
    return;
  }

  const slug = getPrototypeHashSlug();
  const section = getPrototypeSection();
  const card = getPrototypeCardBySlug(slug);

  if (!slug) {
    document.body.removeAttribute("data-route");
    host.innerHTML = "";
    debugLog("route", "not prototype detail route", debugRouteState());
    return;
  }

  if (!section || !card) {
    document.body.dataset.route = "prototype-detail";
    debugLog("route", "prototype card missing", {
      slug,
      hasSection: !!section,
      cards: section?.cards?.map((item) => ({ title: item.title, slug: item.slug })) || []
    }, "error");
    host.innerHTML = `
      <section class="section-band prototype-detail-page">
        <div class="section-inner prototype-detail-inner">
          <a class="detail-back-link" href="#prototype">返回原型设计</a>
          <p class="prototype-detail-empty">没有找到这个详情页：${escapeHtml(slug)}。请刷新页面或检查详情页路径。</p>
        </div>
      </section>
    `;
    return;
  }

  document.body.dataset.route = "prototype-detail";

  try {
    host.innerHTML = renderPrototypeDetailPage(section, card);
    observeReveals();
    debugLog("route", "prototype detail rendered", debugRouteState({ cardTitle: card.title }));
  } catch (error) {
    debugLog("route", "prototype detail render failed", { error: debugString(error), slug, cardTitle: card?.title }, "error");
    console.error("Prototype detail render failed", error);
    host.innerHTML = `
      <section class="section-band prototype-detail-page">
        <div class="section-inner prototype-detail-inner">
          <a class="detail-back-link" href="#${attr(section.id || "prototype")}">返回原型设计</a>
          <p class="prototype-detail-empty">详情页渲染失败。请删除或重新上传刚添加的资源模块。</p>
        </div>
      </section>
    `;
  }

  if (options.scroll) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function renderCurrentDetailRoute(options = {}) {
  if (renderProjectDetailRoute(options)) return;
  renderPrototypeDetailRoute(options);
}

function renderPrototypeDetailPage(section, card) {
  const image = card.image || "assets/recovery-preview.png";
  const heroImageStyle = renderImageStyle({ imageAspect: "16 / 9", imageFit: "cover" });
  const sectionIndex = siteData.customSections.findIndex((item) => item.id === section.id);
  const cardIndex = card.index ?? 0;
  return `
    <section class="section-band prototype-detail-page">
      <div class="section-inner prototype-detail-inner">
        <a class="detail-back-link" href="#${attr(section.id || "prototype")}">返回原型设计</a>
        ${renderInlineDetailPageToolbar(sectionIndex, cardIndex)}
        <div class="prototype-detail-hero reveal">
          <div class="prototype-detail-copy">
            <p class="section-kicker">${escapeHtml(section.kicker || "Prototype")}</p>
            <h1>${escapeHtml(card.title)}</h1>
            ${renderCustomCardDescription(card.description)}
            <div class="tag-row project-extra-tags">
              ${toTags(card.tags).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
            </div>
          </div>
          <div class="prototype-detail-media project-media"${heroImageStyle}>
            <img src="${attr(image)}" alt="${attr(card.title)}" loading="lazy" />
          </div>
        </div>
        <div class="prototype-detail-content reveal">
          ${renderPrototypeDetailContent(card, sectionIndex, cardIndex)}
        </div>
      </div>
    </section>
  `;
}

function renderProjectDetailPage(project) {
  const image = project.image || "assets/recovery-preview.png";
  const heroImageStyle = renderImageStyle({ imageAspect: "16 / 9", imageFit: "cover" });
  const projectIndex = Number.isInteger(project.index) ? project.index : siteData.projects.findIndex((item) => item === project);
  return `
    <section class="section-band prototype-detail-page">
      <div class="section-inner prototype-detail-inner">
        <a class="detail-back-link" href="#projects">返回作品</a>
        ${renderInlineDetailPageToolbar(PROJECT_DETAIL_SECTION_INDEX, projectIndex)}
        <div class="prototype-detail-hero reveal">
          <div class="prototype-detail-copy">
            <p class="section-kicker">Project</p>
            <h1>${escapeHtml(project.title)}</h1>
            ${renderCustomCardDescription(project.description)}
            ${renderProjectActions(project, { detail: false, websitePlaceholder: false })}
            <div class="tag-row project-extra-tags">
              ${toTags(project.tags).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
            </div>
          </div>
          <div class="prototype-detail-media project-media"${heroImageStyle}>
            <img src="${attr(image)}" alt="${attr(project.title)}" loading="lazy" />
          </div>
        </div>
        <div class="prototype-detail-content reveal">
          ${renderPrototypeDetailContent(project, PROJECT_DETAIL_SECTION_INDEX, projectIndex)}
        </div>
      </div>
    </section>
  `;
}

function renderPrototypeDetailContent(card, sectionIndex = -1, cardIndex = -1) {
  const blocks = getOrderedDetailBlocks(card);
  if (!blocks.length) {
    return `<p class="prototype-detail-empty">这里还没有详情内容。打开开发者模式，在这张原型卡片里添加文字或图片模块。</p>`;
  }

  return blocks.map((block) => {
    try {
      return renderPrototypeDetailModule(block, card, sectionIndex, cardIndex);
    } catch (error) {
      console.error("Prototype detail block render failed", block, error);
      return renderPrototypeDetailErrorBlock(block, sectionIndex, cardIndex);
    }
  }).join("");
}

function renderPrototypeDetailErrorBlock(block, sectionIndex = -1, cardIndex = -1) {
  const blockIndex = Number.isInteger(block?.index) ? block.index : -1;
  const type = String(block?.type || "模块");
  return `
    <section class="prototype-detail-block prototype-detail-text-block" data-inline-detail-block="${blockIndex}">
      ${renderInlineDetailBlockToolbar(sectionIndex, cardIndex, blockIndex, type)}
      <div class="prototype-detail-rendered">
        <p>${escapeHtml(type)} 渲染失败。这个模块已保留，可以删除后重新上传。</p>
      </div>
    </section>
  `;
}
function renderPrototypeDetailModule(block, card, sectionIndex = -1, cardIndex = -1) {
  if (block.type === "image") {
    const image = block.src || card.image || "assets/recovery-preview.png";
    const caption = String(block.caption || "").trim();
    const alt = block.alt || caption || card.title;
    return `
      <figure class="prototype-detail-block prototype-detail-image-block" data-inline-detail-block="${block.index}">
        ${renderInlineDetailBlockToolbar(sectionIndex, cardIndex, block.index, block.type)}
        <a class="prototype-detail-image project-media" href="${attr(image)}" target="_blank" rel="noopener"${renderImageStyle({ imageWidth: block.imageWidth })}>
          <img src="${attr(image)}" alt="${attr(alt)}" loading="lazy" />
        </a>
        <figcaption>
          <span data-inline-editable data-inline-detail-caption="${sectionIndex}:${cardIndex}:${block.index}">${escapeHtml(caption || "图片说明")}</span>
        </figcaption>
      </figure>
    `;
  }

  if (block.type === "document") {
    return renderPrototypeDetailDocumentModule(block, sectionIndex, cardIndex);
  }

  if (block.type === "video") {
    return renderPrototypeDetailVideoModule(block, sectionIndex, cardIndex);
  }

  return `
    <section class="prototype-detail-block prototype-detail-text-block" data-inline-detail-block="${block.index}">
      ${renderInlineDetailBlockToolbar(sectionIndex, cardIndex, block.index, block.type)}
      <div class="prototype-detail-rendered prototype-detail-text-${attr(normalizeDetailTextStyle(block.textStyle))}">${renderPrototypeDetailBlock(block.text, block.textStyle)}</div>
      <textarea class="inline-detail-textarea" data-inline-detail-text="${sectionIndex}:${cardIndex}:${block.index}">${escapeHtml(block.text || "")}</textarea>
    </section>
  `;
}

function renderPrototypeDetailDocumentModule(block, sectionIndex = -1, cardIndex = -1) {
  const source = String(block.src || "").trim();
  const title = block.title || documentDisplayName(source) || "文档";
  const description = String(block.description || "").trim();
  const canPreview = source && isPdfDocument(source) && block.preview !== "link";
  return `
    <article class="prototype-detail-block prototype-detail-document-block" data-inline-detail-block="${block.index}">
      ${renderInlineDetailBlockToolbar(sectionIndex, cardIndex, block.index, block.type)}
      <div class="prototype-document-head">
        <div>
          <h2>${escapeHtml(title)}</h2>
          ${description ? `<p>${escapeHtml(description)}</p>` : ""}
        </div>
        <div class="prototype-document-actions">
          ${source ? `<a href="${attr(source)}" target="_blank" rel="noopener">打开文档</a>` : ""}
          ${source ? `<a href="${attr(source)}" download="${attr(block.fileName || title)}">下载</a>` : ""}
        </div>
      </div>
      ${canPreview ? `
        <div class="prototype-document-preview">
          <iframe src="${attr(source)}" title="${attr(title)}" loading="lazy"></iframe>
        </div>
      ` : `
        <div class="prototype-document-placeholder">
          <strong>${source ? "当前格式适合打开或下载查看" : "还没有填写文档地址"}</strong>
          <span>${source ? "PDF 会自动显示网页内预览；Word、PPT、Excel 通常需要打开原文件。" : "在开发者模式里填 assets/docs/example.pdf、公开链接，或选择本地文档。"}</span>
        </div>
      `}
    </article>
  `;
}

function isPdfDocument(source) {
  const text = String(source || "").toLowerCase();
  return text.startsWith("data:application/pdf") || text.includes(".pdf") || text.includes("application/pdf");
}

function documentDisplayName(source) {
  const text = String(source || "").split(/[?#]/)[0];
  const name = text.split(/[\\/]/).pop();
  return name ? decodeURIComponent(name) : "";
}

function renderPrototypeDetailVideoModule(block, sectionIndex = -1, cardIndex = -1) {
  const source = String(block.src || "").trim();
  const title = block.title || videoDisplayName(source) || "视频";
  const rawDescription = String(block.description || "").trim();
  const description = /^本地视频路径[:：]/.test(rawDescription) ? "" : rawDescription;
  const poster = String(block.poster || "").trim();
  const controls = block.controls !== false;
  const loop = block.loop !== false;
  const muted = block.muted !== false;
  const autoplay = Boolean(block.autoplay);
  return `
    <article class="prototype-detail-block prototype-detail-video-block" data-inline-detail-block="${block.index}">
      ${renderInlineDetailBlockToolbar(sectionIndex, cardIndex, block.index, block.type)}
      <div class="prototype-video-head">
        <div>
          <h2>${escapeHtml(title)}</h2>
          ${description ? `<p>${escapeHtml(description)}</p>` : ""}
        </div>
      </div>
      ${source ? `
        <video class="prototype-video-player"${booleanVideoAttribute(controls, "controls")}${booleanVideoAttribute(loop, "loop")}${booleanVideoAttribute(muted, "muted")}${booleanVideoAttribute(autoplay, "autoplay")} playsinline preload="metadata"${poster ? ` poster="${attr(poster)}"` : ""}>
          <source src="${attr(source)}" type="${attr(videoMimeType(source))}" />
          你的浏览器不支持视频播放。
        </video>
      ` : `
        <div class="prototype-video-placeholder">
          <strong>还没有填写视频路径</strong>
          <span>把 MP4 放进 assets/prototype，再在高级字段里填写相对路径。</span>
        </div>
      `}
    </article>
  `;
}

function booleanVideoAttribute(condition, name) {
  return condition ? ` ${name}` : "";
}

function videoMimeType(source) {
  const text = String(source || "").split(/[?#]/)[0].toLowerCase();
  if (text.endsWith(".webm") || text.startsWith("data:video/webm")) return "video/webm";
  if (text.endsWith(".mov") || text.startsWith("data:video/quicktime")) return "video/quicktime";
  return "video/mp4";
}

function videoDisplayName(source) {
  const text = String(source || "").split(/[?#]/)[0];
  const name = text.split(/[\\/]/).pop();
  return name ? decodeURIComponent(name) : "";
}
function renderPrototypeDetailBlock(block, textStyle = "body") {
  const style = normalizeDetailTextStyle(textStyle);
  const rawText = String(block || "").trim();
  const lines = rawText
    .split(/\n+/g)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) return "";

  if (style === "heading") {
    return `<h2 class="prototype-text-heading">${escapeHtml(lines.join(" "))}</h2>`;
  }

  if (style === "subheading") {
    return `<h3 class="prototype-text-subheading">${escapeHtml(lines.join(" "))}</h3>`;
  }

  if (style === "callout") {
    return `<div class="prototype-text-callout">${lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}</div>`;
  }

  if (style === "code") {
    return `<pre class="prototype-text-code"><code>${escapeHtml(rawText)}</code></pre>`;
  }

  if (lines.length === 1) return `<p>${escapeHtml(lines[0])}</p>`;

  const firstIsPoint = isListPoint(lines[0]);
  const lead = !firstIsPoint ? lines[0] : "";
  const points = lead ? lines.slice(1) : lines;
  return `
    ${lead ? `<h2>${escapeHtml(lead)}</h2>` : ""}
    <ol class="project-points prototype-detail-points">
      ${points.map((point) => `<li>${escapeHtml(stripListMarker(point))}</li>`).join("")}
    </ol>
  `;
}
function setupPrototypeDetailRoutes() {
  window.addEventListener("hashchange", () => {
    const wasDetailRoute = document.body.dataset.route === "prototype-detail";
    renderCurrentDetailRoute({ scroll: true });

    if (wasDetailRoute && !getPrototypeHashSlug() && !getProjectHashSlug()) {
      const targetId = window.location.hash.replace(/^#/, "");
      window.requestAnimationFrame(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
      });
    }
  });
}

function renderSectionImages(images, sectionIndex = -1) {
  if (!images.length) {
    return "";
  }

  return `
    <div class="section-media-grid">
      ${images
        .map(
          (image, imageIndex) => `
            <figure class="section-media-item reveal" data-inline-section-image="${sectionIndex}:${imageIndex}">
              ${renderInlineSectionImageToolbar(sectionIndex, imageIndex)}
              <img src="${attr(image.src)}" alt="${attr(image.alt || image.caption || "section image")}" loading="lazy" />
              ${image.caption ? `<figcaption data-inline-editable data-inline-section-image-caption data-section-index="${sectionIndex}" data-image-index="${imageIndex}">${escapeHtml(image.caption)}</figcaption>` : ""}
            </figure>
          `
        )
        .join("")}
    </div>
  `;
}

function setupFilters() {
  document.getElementById("project-filters").addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    activeProjectFilter = button.dataset.filter;
    renderFilters(activeProjectFilter);
    renderProjects(activeProjectFilter);
    observeReveals();
  });

  document.getElementById("steam")?.addEventListener("click", (event) => {
    const steamPageButton = event.target.closest("[data-steam-page]");
    if (steamPageButton) {
      activeSteamPage = clampPage(steamPageButton.dataset.steamPage, getFilteredSteamGames().length);
      renderSteamLibrary();
      observeReveals();
      return;
    }

    const platformPageButton = event.target.closest("[data-platform-page]");
    if (platformPageButton) {
      const platformId = platformPageButton.dataset.platformId;
      const platform = siteData.gamePlatforms.find((item) => String(item.id || item.label || "platform") === platformId);
      activePlatformPages[platformId] = clampPage(platformPageButton.dataset.platformPage, platform?.games?.length || 0);
      renderGamePlatformModules();
      observeReveals();
      return;
    }

    const button = event.target.closest("[data-steam-filter]");
    if (!button) return;
    activeSteamGenreFilter = button.dataset.steamFilter || "all";
    activeSteamPage = 1;
    renderSteamLibrary();
    observeReveals();
  });
}

function setupTimelineTabs() {
  document.getElementById("timeline").addEventListener("click", (event) => {
    const button = event.target.closest("[data-timeline-tab]");
    if (!button) return;
    activeTimelineGroup = normalizeTimelineType(button.dataset.timelineTab);
    renderTimeline();
    observeReveals();
  });
}

function setupTheme() {
  const toggle = document.querySelector("[data-theme-toggle]");
  const themeIcon = document.querySelector("[data-theme-icon]");
  const savedTheme = localStorage.getItem("portfolio-theme");

  function applyTheme(theme) {
    document.body.dataset.theme = theme;
    themeIcon.innerHTML = icon(theme === "dark" ? "sun" : "moon");
    localStorage.setItem("portfolio-theme", theme);
  }

  applyTheme(savedTheme || "light");

  toggle.addEventListener("click", () => {
    applyTheme(document.body.dataset.theme === "dark" ? "light" : "dark");
  });
}

function observeReveals() {
  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach((item) => item.classList.add("is-visible"));
    return;
  }

  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );
  }

  document.querySelectorAll(".reveal:not(.is-visible)").forEach((item) => {
    revealObserver.observe(item);
  });
}

function setupScrollSpy() {
  if (scrollSpy) {
    scrollSpy.disconnect();
  }

  const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  scrollSpy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-45% 0px -45% 0px" }
  );

  sections.forEach((section) => scrollSpy.observe(section));
}

function setupParticleCanvas() {
  const canvas = document.getElementById("particle-canvas");
  const context = canvas.getContext("2d");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pointer = { x: -1000, y: -1000 };
  let width = 0;
  let height = 0;
  let inkMarks = [];
  let animationFrame = 0;
  let tick = 0;

  function colorFor(index) {
    const colors =
      document.body.dataset.theme === "dark"
        ? ["rgba(255,79,95,", "rgba(68,184,157,", "rgba(90,167,232,"]
        : ["rgba(198,32,46,", "rgba(19,124,106,", "rgba(35,105,164,"];
    return colors[index % colors.length];
  }

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(28, Math.max(14, Math.floor((width * height) / 52000)));
    inkMarks = Array.from({ length: count }, (_, index) => ({
      x: randomBetween(-width * 0.15, width * 1.15),
      y: randomBetween(-height * 0.1, height * 1.1),
      length: randomBetween(width * 0.24, width * 0.58),
      bend: randomBetween(-height * 0.16, height * 0.16),
      angle: randomBetween(-0.42, 0.42),
      width: randomBetween(0.8, 3.2),
      drift: randomBetween(0.08, 0.34),
      phase: randomBetween(0, Math.PI * 2),
      alpha: randomBetween(0.08, 0.22),
      color: colorFor(index),
      kind: index % 5 === 0 ? "accent" : "ink"
    }));
    draw();
  }

  function draw() {
    context.clearRect(0, 0, width, height);
    tick += reducedMotion ? 0 : 0.006;

    inkMarks.forEach((mark, index) => {
      const pointerDistance = Math.hypot(mark.x - pointer.x, mark.y - pointer.y);
      const push = pointerDistance < 180 ? (180 - pointerDistance) * 0.025 : 0;
      const wave = Math.sin(tick * mark.drift + mark.phase) * 18;
      const startX = mark.x + wave + push;
      const startY = mark.y + Math.cos(tick * mark.drift + mark.phase) * 10;
      const endY = startY + mark.bend * 0.36;

      context.save();
      context.translate(startX, startY);
      context.rotate(mark.angle);
      context.lineCap = "round";
      context.lineJoin = "round";
      context.globalCompositeOperation = document.body.dataset.theme === "dark" ? "screen" : "multiply";

      const isAccent = mark.kind === "accent";
      const baseAlpha = isAccent ? mark.alpha * 1.2 : mark.alpha;
      const gray = document.body.dataset.theme === "dark" ? "rgba(255,255,255," : "rgba(17,19,24,";
      context.strokeStyle = isAccent ? `${mark.color}${baseAlpha})` : `${gray}${baseAlpha})`;
      context.lineWidth = isAccent ? mark.width : mark.width * 1.2;
      context.beginPath();
      context.moveTo(0, 0);
      context.bezierCurveTo(
        mark.length * 0.28,
        mark.bend + wave * 0.4,
        mark.length * 0.72,
        endY - startY - mark.bend * 0.9,
        mark.length,
        endY - startY
      );
      context.stroke();

      if (!isAccent) {
        context.strokeStyle = `${mark.color}${mark.alpha * 0.32})`;
        context.lineWidth = Math.max(0.5, mark.width * 0.38);
        context.beginPath();
        context.moveTo(12, 9);
        context.bezierCurveTo(
          mark.length * 0.28,
          mark.bend + 28,
          mark.length * 0.72,
          endY - startY - mark.bend * 0.8 - 20,
          mark.length - 18,
          endY - startY + 6
        );
        context.stroke();
      }

      if (index % 4 === 0) {
        const gradient = context.createRadialGradient(0, 0, 0, 0, 0, 48);
        gradient.addColorStop(
          0,
          document.body.dataset.theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(17,19,24,0.045)"
        );
        gradient.addColorStop(1, "rgba(255,255,255,0)");
        context.fillStyle = gradient;
        context.beginPath();
        context.ellipse(0, 0, 48, 24, mark.phase, 0, Math.PI * 2);
        context.fill();
      }

      context.restore();
    });

    if (!reducedMotion) {
      animationFrame = window.requestAnimationFrame(draw);
    }
  }

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
  });
  document.querySelector("[data-theme-toggle]").addEventListener("click", () => {
    inkMarks.forEach((mark, index) => {
      mark.color = colorFor(index);
    });
  });

  resize();

  return () => {
    window.cancelAnimationFrame(animationFrame);
  };
}

function renderInlineMainToolbars() {
  const targets = [
    ["about", document.querySelector("[data-section-title='about']")?.closest(".about-copy-column")],
    ["experience", document.querySelector("[data-section-title='experience']")?.closest(".section-heading")],
    ["projects", document.querySelector("[data-section-title='projects']")?.closest(".section-heading")],
    ["steam", document.querySelector("[data-section-title='steam']")?.closest(".section-heading")]
  ];
  targets.forEach(([sectionId, target]) => {
    if (!target || target.querySelector(`.inline-main-toolbar[data-inline-main-toolbar="${sectionId}"]`)) return;
    target.insertAdjacentHTML("beforeend", renderInlineMainToolbar(sectionId));
  });
}

function renderInlineMainToolbar(sectionId) {
  const controls = {
    about: `<button type="button" data-inline-action="open-panel" data-editor-tab-target="profile">高级字段</button>`,
    experience: `<button type="button" data-inline-action="add-timeline" data-timeline-type="work">添加工作</button><button type="button" data-inline-action="add-timeline" data-timeline-type="education">添加教育</button><button type="button" data-inline-action="open-panel" data-editor-tab-target="experience">高级字段</button>`,
    projects: `<button type="button" data-inline-action="add-project">添加作品</button><button type="button" data-inline-action="open-panel" data-editor-tab-target="projects">高级字段</button>`,
    steam: `<button type="button" data-inline-action="open-panel" data-editor-tab-target="games">高级字段</button>`
  };
  return `<div class="inline-edit-toolbar inline-main-toolbar" data-inline-toolbar data-inline-main-toolbar="${attr(sectionId)}">${controls[sectionId] || ""}</div>`;
}

function renderInlineTimelineGroupToolbar(type) {
  return `
    <div class="inline-edit-toolbar inline-timeline-group-toolbar" data-inline-toolbar>
      <button type="button" data-inline-action="add-timeline" data-timeline-type="${attr(type)}">添加${type === "work" ? "工作" : "教育"}</button>
    </div>
  `;
}

function renderInlineTimelineItemToolbar(timelineIndex) {
  return `
    <div class="inline-edit-toolbar inline-item-toolbar inline-timeline-item-toolbar" data-inline-toolbar>
      <button type="button" data-inline-action="move-timeline-up" data-timeline-index="${timelineIndex}">上移</button>
      <button type="button" data-inline-action="move-timeline-down" data-timeline-index="${timelineIndex}">下移</button>
      <button type="button" data-inline-action="delete-timeline" data-timeline-index="${timelineIndex}">删除</button>
    </div>
  `;
}

function renderInlineProjectToolbar(projectIndex) {
  return `
    <div class="inline-edit-toolbar inline-item-toolbar inline-project-toolbar" data-inline-toolbar>
      <button type="button" data-inline-action="move-project-up" data-project-index="${projectIndex}">上移</button>
      <button type="button" data-inline-action="move-project-down" data-project-index="${projectIndex}">下移</button>
      <label>换图<input type="file" accept="image/*" data-inline-project-image-file data-project-index="${projectIndex}" /></label>
      <button type="button" data-inline-action="delete-project" data-project-index="${projectIndex}">删除</button>
    </div>
  `;
}

function renderInlineSectionToolbar(sectionIndex, section) {
  const isCards = section.layout === "cards" || section.cards?.length;
  return `
    <div class="inline-edit-toolbar inline-section-toolbar" data-inline-toolbar>
      ${isCards ? `<button type="button" data-inline-action="add-card" data-section-index="${sectionIndex}">添加卡片</button>` : ""}
      ${!isCards ? `<button type="button" data-inline-action="add-section-text" data-section-index="${sectionIndex}">添加文字</button>` : ""}
      ${!isCards ? `<button type="button" data-inline-action="add-section-image" data-section-index="${sectionIndex}">添加图片</button>` : ""}
      <button type="button" data-inline-action="open-panel" data-editor-tab-target="sections">高级字段</button>
    </div>
  `;
}

function renderInlineSectionImageToolbar(sectionIndex, imageIndex) {
  if (sectionIndex < 0 || imageIndex < 0) return "";
  return `
    <div class="inline-edit-toolbar inline-item-toolbar inline-section-image-toolbar" data-inline-toolbar>
      <label>换图<input type="file" accept="image/*" data-inline-section-image-file data-section-index="${sectionIndex}" data-image-index="${imageIndex}" /></label>
      <button type="button" data-inline-action="delete-section-image" data-section-index="${sectionIndex}" data-image-index="${imageIndex}">删除</button>
    </div>
  `;
}

function renderInlineCardToolbar(sectionIndex, cardIndex) {
  if (sectionIndex < 0) return "";
  return `
    <div class="inline-edit-toolbar inline-card-toolbar" data-inline-toolbar>
      <button type="button" data-inline-action="move-card-up" data-section-index="${sectionIndex}" data-card-index="${cardIndex}">上移</button>
      <button type="button" data-inline-action="move-card-down" data-section-index="${sectionIndex}" data-card-index="${cardIndex}">下移</button>
      <label>换图<input type="file" accept="image/*" data-inline-custom-card-image-file data-section-index="${sectionIndex}" data-card-index="${cardIndex}" /></label>
      <button type="button" data-inline-action="delete-card" data-section-index="${sectionIndex}" data-card-index="${cardIndex}">删除</button>
    </div>
  `;
}

function renderInlineDetailPageToolbar(sectionIndex, cardIndex) {
  if ((sectionIndex < 0 && sectionIndex !== PROJECT_DETAIL_SECTION_INDEX) || cardIndex < 0) return "";
  const editorTabTarget = sectionIndex === PROJECT_DETAIL_SECTION_INDEX ? "projects" : "sections";
  return `
    <div class="inline-edit-toolbar inline-detail-page-toolbar" data-inline-toolbar>
      <button type="button" data-inline-action="add-detail-text" data-section-index="${sectionIndex}" data-card-index="${cardIndex}">添加文字</button>
      <button type="button" data-inline-action="add-detail-image" data-section-index="${sectionIndex}" data-card-index="${cardIndex}">添加图片</button>
      <button type="button" data-inline-action="add-detail-document" data-section-index="${sectionIndex}" data-card-index="${cardIndex}">添加文档</button>
      <button type="button" data-inline-action="add-detail-video" data-section-index="${sectionIndex}" data-card-index="${cardIndex}">添加视频</button>
      <button type="button" data-inline-action="open-panel" data-editor-tab-target="${editorTabTarget}">高级字段</button>
    </div>
  `;
}
function renderInlineDetailBlockToolbar(sectionIndex, cardIndex, blockIndex, type) {
  if ((sectionIndex < 0 && sectionIndex !== PROJECT_DETAIL_SECTION_INDEX) || cardIndex < 0 || blockIndex < 0) return "";
  const textStyleControls = type === "text" ? renderInlineTextStyleControls(sectionIndex, cardIndex, blockIndex) : "";
  return `
    <div class="inline-edit-toolbar inline-block-toolbar" data-inline-toolbar>
      <button type="button" data-inline-action="move-detail-up" data-section-index="${sectionIndex}" data-card-index="${cardIndex}" data-block-index="${blockIndex}">上移</button>
      <button type="button" data-inline-action="move-detail-down" data-section-index="${sectionIndex}" data-card-index="${cardIndex}" data-block-index="${blockIndex}">下移</button>
      ${textStyleControls}
      ${type === "image" ? `<label>换图<input type="file" accept="image/*" data-inline-detail-image-file data-section-index="${sectionIndex}" data-card-index="${cardIndex}" data-block-index="${blockIndex}" /></label>` : ""}
      ${type === "document" ? `<label>换文档<input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" data-inline-detail-document-file data-section-index="${sectionIndex}" data-card-index="${cardIndex}" data-block-index="${blockIndex}" /></label>` : ""}
      ${type === "video" ? `<label>换视频<input type="file" accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov" data-inline-detail-video-file data-section-index="${sectionIndex}" data-card-index="${cardIndex}" data-block-index="${blockIndex}" /></label>` : ""}
      <button type="button" data-inline-action="delete-detail" data-section-index="${sectionIndex}" data-card-index="${cardIndex}" data-block-index="${blockIndex}">删除</button>
    </div>
  `;
}

function renderInlineTextStyleControls(sectionIndex, cardIndex, blockIndex) {
  const card = getInlineCard(sectionIndex, cardIndex);
  const block = card?.detailBlocks?.[blockIndex];
  const currentStyle = normalizeDetailTextStyle(block?.textStyle);
  const options = [
    ["body", "正文"],
    ["heading", "大标题"],
    ["subheading", "小标题"],
    ["callout", "重点"],
    ["code", "代码"]
  ];

  return `
    <span class="inline-text-style-group" aria-label="文字样式">
      ${options.map(([value, label]) => `
        <button type="button" class="inline-style-button${value === currentStyle ? " is-active" : ""}" data-inline-action="set-detail-text-style" data-section-index="${sectionIndex}" data-card-index="${cardIndex}" data-block-index="${blockIndex}" data-text-style="${value}">${label}</button>
      `).join("")}
    </span>
  `;
}
function setInlineEditMode(enabled) {
  const nextMode = Boolean(enabled);
  const shouldCommitInlineEdits = inlineEditMode && !nextMode;

  if (shouldCommitInlineEdits) {
    syncInlineEditsFromDom();
  }

  inlineEditMode = nextMode;

  if (shouldCommitInlineEdits) {
    renderAll();
    renderEditor();
  } else {
    document.body.dataset.inlineEdit = inlineEditMode ? "1" : "0";
    syncInlineEditControls();
    renderCvActions();
  }

  showToast(inlineEditMode ? "站内编辑已开启" : "站内编辑已关闭");
}

function syncInlineEditControls() {
  document.body.dataset.inlineEdit = inlineEditMode ? "1" : "0";
  const label = document.querySelector("[data-inline-edit-label]");
  if (label) label.textContent = inlineEditMode ? "退出站内编辑" : "站内编辑";
  document.querySelectorAll("[data-inline-editable]").forEach((element) => {
    element.contentEditable = inlineEditMode ? "true" : "false";
    element.spellcheck = false;
  });
}

function getInlineCard(sectionIndex, cardIndex) {
  if (sectionIndex === PROJECT_DETAIL_SECTION_INDEX) {
    return siteData.projects[cardIndex] || null;
  }
  return siteData.customSections[sectionIndex]?.cards?.[cardIndex] || null;
}

function moveOrderedItem(items, itemIndex, direction) {
  if (!Array.isArray(items)) return false;
  const ordered = sortByOrder(items.map((item, index) => ({ ...item, index })));
  const currentPosition = ordered.findIndex((item) => item.index === itemIndex);
  const targetPosition = currentPosition + direction;
  if (currentPosition < 0 || targetPosition < 0 || targetPosition >= ordered.length) return false;

  const otherIndex = ordered[targetPosition].index;
  const currentOrder = orderValue(items[itemIndex], itemIndex);
  const otherOrder = orderValue(items[otherIndex], otherIndex);
  items[itemIndex].order = otherOrder;
  items[otherIndex].order = currentOrder;
  return true;
}

function refreshInlineEdit() {
  renderAll();
  renderEditor();
}

function handleInlineEditClick(event) {
  const control = event.target.closest("[data-inline-action]");
  if (!control) return;
  event.preventDefault();
  event.stopPropagation();

  const action = control.dataset.inlineAction;
  const sectionIndex = Number(control.dataset.sectionIndex);
  const cardIndex = Number(control.dataset.cardIndex);
  const blockIndex = Number(control.dataset.blockIndex);

  if (action === "open-panel") {
    const targetTab = control.dataset.editorTabTarget || "sections";
    currentEditorTab = targetTab === "timeline" ? "experience" : targetTab;
    renderEditor();
    openEditor();
    return;
  }

  if (action === "add-project") {
    addInlineProject();
  } else if (action === "move-project-up") {
    moveOrderedItem(siteData.projects, Number(control.dataset.projectIndex), -1);
  } else if (action === "move-project-down") {
    moveOrderedItem(siteData.projects, Number(control.dataset.projectIndex), 1);
  } else if (action === "delete-project") {
    siteData.projects.splice(Number(control.dataset.projectIndex), 1);
  } else if (action === "add-timeline") {
    addInlineTimelineItem(control.dataset.timelineType);
  } else if (action === "move-timeline-up") {
    moveTimelineWithinGroup(Number(control.dataset.timelineIndex), -1);
  } else if (action === "move-timeline-down") {
    moveTimelineWithinGroup(Number(control.dataset.timelineIndex), 1);
  } else if (action === "delete-timeline") {
    siteData.timeline.splice(Number(control.dataset.timelineIndex), 1);
  } else if (action === "add-card") {
    addInlineCard(sectionIndex);
  } else if (action === "add-section-text") {
    addInlineSectionText(sectionIndex);
  } else if (action === "add-section-image") {
    addInlineSectionImage(sectionIndex);
  } else if (action === "move-card-up") {
    moveOrderedItem(siteData.customSections[sectionIndex]?.cards, cardIndex, -1);
  } else if (action === "move-card-down") {
    moveOrderedItem(siteData.customSections[sectionIndex]?.cards, cardIndex, 1);
  } else if (action === "delete-card") {
    siteData.customSections[sectionIndex]?.cards?.splice(cardIndex, 1);
  } else if (action === "add-detail-text") {
    addInlineDetailBlock(sectionIndex, cardIndex, "text");
  } else if (action === "add-detail-image") {
    addInlineDetailBlock(sectionIndex, cardIndex, "image");
  } else if (action === "add-detail-document") {
    addInlineDetailBlock(sectionIndex, cardIndex, "document");
  } else if (action === "add-detail-video") {
    addInlineDetailBlock(sectionIndex, cardIndex, "video");
  } else if (action === "move-detail-up") {
    moveOrderedItem(getInlineCard(sectionIndex, cardIndex)?.detailBlocks, blockIndex, -1);
  } else if (action === "move-detail-down") {
    moveOrderedItem(getInlineCard(sectionIndex, cardIndex)?.detailBlocks, blockIndex, 1);
  } else if (action === "set-detail-text-style") {
    setInlineDetailTextStyle(sectionIndex, cardIndex, blockIndex, control.dataset.textStyle);
  } else if (action === "delete-section-image") {
    siteData.customSections[sectionIndex]?.images?.splice(Number(control.dataset.imageIndex), 1);
  } else if (action === "delete-detail") {
    const card = getInlineCard(sectionIndex, cardIndex);
    card?.detailBlocks?.splice(blockIndex, 1);
    if (card) card.details = detailBlocksToText(card.detailBlocks);
  }

  refreshInlineEdit();
}

const INLINE_TEXT_FIELD_SELECTOR = [
  "[data-inline-project-field]",
  "[data-inline-timeline-field]",
  "[data-inline-custom-card-field]",
  "[data-inline-profile-about]",
  "[data-inline-section-body]",
  "[data-inline-section-image-caption]",
  "[data-inline-detail-caption]"
].join(", ");

function inlineInputValue(element) {
  return element.matches("input, textarea") ? element.value : element.textContent;
}

function updateInlineDetailTextField(textInput) {
  const [sectionIndex, cardIndex, blockIndex] = textInput.dataset.inlineDetailText.split(":").map(Number);
  const card = getInlineCard(sectionIndex, cardIndex);
  const block = card?.detailBlocks?.[blockIndex];
  if (!block || block.type !== "text") return;
  block.text = textInput.value;
  card.details = detailBlocksToText(card.detailBlocks);
}

function setInlineDetailTextStyle(sectionIndex, cardIndex, blockIndex, textStyle) {
  syncInlineEditsFromDom();
  const card = getInlineCard(sectionIndex, cardIndex);
  const block = card?.detailBlocks?.[blockIndex];
  if (!card || !block || block.type !== "text") return;
  block.textStyle = normalizeDetailTextStyle(textStyle);
  card.details = detailBlocksToText(card.detailBlocks);
  refreshInlineEdit();
}
function syncInlineEditsFromDom() {
  document.querySelectorAll("[data-inline-detail-text]").forEach(updateInlineDetailTextField);
  document.querySelectorAll(INLINE_TEXT_FIELD_SELECTOR).forEach(updateInlineTextField);
}

function updateInlineTextField(target) {
  const value = inlineInputValue(target).trim();

  if (target.matches("[data-inline-project-field]")) {
    const project = siteData.projects[Number(target.dataset.projectIndex)];
    const field = target.dataset.inlineProjectField;
    if (!project || !field) return true;
    if (field === "tags") project.tags = toTags(value);
    else {
      project[field] = value;
      if (field === "responsibility") project.role = value;
    }
    return true;
  }

  if (target.matches("[data-inline-timeline-field]")) {
    const item = siteData.timeline[Number(target.dataset.timelineIndex)];
    const field = target.dataset.inlineTimelineField;
    if (!item || !field) return true;
    item[field] = field === "tags" ? toTags(value) : value;
    return true;
  }

  if (target.matches("[data-inline-custom-card-field]")) {
    const card = getInlineCard(Number(target.dataset.sectionIndex), Number(target.dataset.cardIndex));
    const field = target.dataset.inlineCustomCardField;
    if (!card || !field) return true;
    card[field] = field === "tags" ? toTags(value) : value;
    return true;
  }

  if (target.matches("[data-inline-profile-about]")) {
    siteData.profile.about[Number(target.dataset.inlineProfileAbout)] = value;
    return true;
  }

  if (target.matches("[data-inline-section-body]")) {
    const section = siteData.customSections[Number(target.dataset.sectionIndex)];
    if (!section) return true;
    const body = toParagraphs(section.body);
    body[Number(target.dataset.bodyIndex)] = value;
    section.body = body;
    return true;
  }

  if (target.matches("[data-inline-section-image-caption]")) {
    const image = siteData.customSections[Number(target.dataset.sectionIndex)]?.images?.[Number(target.dataset.imageIndex)];
    if (image) image.caption = value;
    return true;
  }

  if (target.matches("[data-inline-detail-caption]")) {
    const [sectionIndex, cardIndex, blockIndex] = target.dataset.inlineDetailCaption.split(":").map(Number);
    const block = getInlineCard(sectionIndex, cardIndex)?.detailBlocks?.[blockIndex];
    if (block && block.type === "image") block.caption = value;
    return true;
  }

  return false;
}

function handleInlineEditInput(event) {
  const textInput = event.target.closest("[data-inline-detail-text]");
  if (textInput) {
    updateInlineDetailTextField(textInput);
    return;
  }

  const inlineTarget = event.target.closest(INLINE_TEXT_FIELD_SELECTOR);
  if (inlineTarget) updateInlineTextField(inlineTarget);
}

async function handleInlineEditChange(event) {
  const projectImageInput = event.target.closest("[data-inline-project-image-file]");
  if (projectImageInput) {
    await updateInlineImageField(projectImageInput, (input) => siteData.projects[Number(input.dataset.projectIndex)], "image");
    return;
  }

  const customCardImageInput = event.target.closest("[data-inline-custom-card-image-file]");
  if (customCardImageInput) {
    await updateInlineImageField(customCardImageInput, (input) => getInlineCard(Number(input.dataset.sectionIndex), Number(input.dataset.cardIndex)), "image");
    return;
  }

  const sectionImageInput = event.target.closest("[data-inline-section-image-file]");
  if (sectionImageInput) {
    await updateInlineImageField(sectionImageInput, (input) => siteData.customSections[Number(input.dataset.sectionIndex)]?.images?.[Number(input.dataset.imageIndex)], "src");
    return;
  }

  const imageInput = event.target.closest("[data-inline-detail-image-file]");
  if (imageInput) {
    await updateInlineDetailFile(imageInput, "image");
    return;
  }

  const documentInput = event.target.closest("[data-inline-detail-document-file]");
  if (documentInput) {
    await updateInlineDetailFile(documentInput, "document");
    return;
  }

  const videoInput = event.target.closest("[data-inline-detail-video-file]");
  if (videoInput) {
    await updateInlineDetailFile(videoInput, "video");
  }
}

async function updateInlineImageField(input, getTarget, fieldName) {
  const file = input.files?.[0];
  const target = getTarget(input);
  if (!file || !target) return;

  try {
    const uploadedPath = await uploadAssetFile(file, "images");
    const isAnimatedGif = file.type === "image/gif" || file.name.toLowerCase().endsWith(".gif");
    target[fieldName] = uploadedPath || (isAnimatedGif ? await readFileAsDataUrl(file) : await imageFileToDataUrl(file, { maxWidth: 1800, quality: 0.88 }));
    showToast(uploadedPath ? "图片已上传到 assets，记得保存" : "图片已写入 JSON，记得保存");
    refreshInlineEdit();
  } catch {
    showToast("图片读取失败");
  } finally {
    input.value = "";
  }
}
async function updateInlineDetailFile(input, type) {
  const file = input.files?.[0];
  if (!file) return;

  const sectionIndex = Number(input.dataset.sectionIndex);
  const cardIndex = Number(input.dataset.cardIndex);
  const blockIndex = Number(input.dataset.blockIndex);
  const block = getInlineCard(sectionIndex, cardIndex)?.detailBlocks?.[blockIndex];
  if (!block || block.type !== type) return;

  try {
    const uploadedPath = await uploadAssetFile(file, assetKindForDetailType(type));
    block.src = uploadedPath || await readFileAsDataUrl(file);
    if (type === "document" || type === "video") {
      block.fileName = file.name;
      if (!block.title || block.title === "文档标题" || block.title === "视频标题") block.title = file.name.replace(/\.[^.]+$/, "");
    }
    showToast(uploadedPath ? "文件已上传到 assets，记得保存" : "文件已写入 JSON，记得保存");
    refreshInlineEdit();
  } catch {
    showToast("文件读取失败");
  } finally {
    input.value = "";
  }
}
function addInlineProject() {
  siteData.projects.unshift({
    title: "新作品",
    year: String(new Date().getFullYear()),
    role: "Designer / Developer",
    responsibility: "Designer / Developer",
    category: "design",
    engine: "UE5",
    language: "C++ / Blueprint",
    gameType: "Prototype",
    order: getNextOrder(siteData.projects),
    image: "assets/slash-preview.png",
    imageWidth: "",
    imageAspect: "16 / 9",
    imageFit: "cover",
    description: "在这里写作品简介。",
    tags: ["Prototype"]
  });
}

function addInlineTimelineItem(type = "work") {
  const normalizedType = normalizeTimelineType(type);
  const label = timelineGroupLabels[normalizedType];
  currentTimelineEditorGroup = normalizedType;
  siteData.timeline.unshift({
    date: String(new Date().getFullYear()),
    title: `新${label}经历`,
    description: `1. 在这里写${label}经历的第一条内容。\n2. 在这里写第二条内容。`,
    tags: [label],
    type: normalizedType,
    order: getNextOrder(siteData.timeline.filter((item) => normalizeTimelineType(item.type) === normalizedType))
  });
}

function moveTimelineWithinGroup(itemIndex, direction) {
  const item = siteData.timeline[itemIndex];
  if (!item) return false;
  const type = normalizeTimelineType(item.type);
  const grouped = sortByOrder(siteData.timeline.map((entry, index) => ({ ...entry, index })).filter((entry) => normalizeTimelineType(entry.type) === type));
  const currentPosition = grouped.findIndex((entry) => entry.index === itemIndex);
  const target = grouped[currentPosition + direction];
  if (!target) return false;
  const currentOrder = orderValue(siteData.timeline[itemIndex], itemIndex);
  const otherOrder = orderValue(siteData.timeline[target.index], target.index);
  siteData.timeline[itemIndex].order = otherOrder;
  siteData.timeline[target.index].order = currentOrder;
  return true;
}

function addInlineCard(sectionIndex) {
  const section = siteData.customSections[sectionIndex];
  if (!section) return;
  section.layout = "cards";
  section.cards = section.cards || [];
  section.cards.push({
    order: getNextOrder(section.cards),
    title: "新卡片",
    slug: `prototype-${Date.now()}`,
    description: "在这里写卡片简介。",
    details: "目标\n1. 在这里写第一个详情条目。",
    detailBlocks: [{ type: "text", order: 1, text: "目标\n1. 在这里写第一个详情条目。" }],
    image: "assets/recovery-preview.png",
    imageWidth: "",
    imageAspect: "16 / 9",
    imageFit: "cover",
    tags: ["Prototype"]
  });
}

function addInlineSectionText(sectionIndex) {
  const section = siteData.customSections[sectionIndex];
  if (!section) return;
  const body = toParagraphs(section.body);
  body.push("在这里添加正文。");
  section.body = body;
}

function addInlineSectionImage(sectionIndex) {
  const section = siteData.customSections[sectionIndex];
  if (!section) return;
  section.images = section.images || [];
  section.images.push({ src: "assets/recovery-preview.png", caption: "图片说明", alt: "" });
}

function addInlineDetailBlock(sectionIndex, cardIndex, type) {
  const card = getInlineCard(sectionIndex, cardIndex);
  if (!card) return;
  card.detailBlocks = normalizeDetailBlocks(card.detailBlocks, card.details || card.description);
  card.detailBlocks.push(createDetailBlock(type, getNextOrder(card.detailBlocks)));
  card.details = detailBlocksToText(card.detailBlocks);
}

function enableDevMode() {
  localStorage.setItem(DEV_MODE_KEY, "1");
  if (!document.querySelector("[data-dev-open]")) {
    createEditorShell();
  }
  openEditor();
}

function setupDevMode() {
  const params = new URLSearchParams(window.location.search);
  if (params.has("dev") || localStorage.getItem(DEV_MODE_KEY) === "1") {
    createEditorShell();
  }

  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === "e") {
      event.preventDefault();
      enableDevMode();
    }
  });
}

function createEditorShell() {
  if (document.querySelector("[data-dev-open]")) return;

  document.body.insertAdjacentHTML(
    "beforeend",
    `
      <button class="dev-open-button" type="button" data-dev-open title="打开内容编辑器">
        ${icon("edit")}
        <span>高级编辑</span>
      </button>
      <button class="inline-edit-button" type="button" data-inline-edit-toggle title="切换站内编辑模式">
        ${icon("edit")}
        <span data-inline-edit-label>站内编辑</span>
      </button>
      <button class="inline-save-button" type="button" data-inline-save title="保存当前内容">
        ${icon("save")}
        <span>保存</span>
      </button>
      <button class="dev-log-button" type="button" data-dev-log-toggle title="打开调试日志">
        <span>日志</span>
      </button>
      <aside class="dev-log-panel" data-dev-log-panel aria-hidden="true">
        <div class="dev-log-header">
          <strong>Debug Log</strong>
          <div>
            <button type="button" data-dev-log-export>导出</button>
            <button type="button" data-dev-log-clear>清空</button>
            <button type="button" data-dev-log-close>关闭</button>
          </div>
        </div>
        <div class="dev-log-tools">
          <input type="search" data-dev-log-search placeholder="搜索 scope / message / details" />
          <span data-dev-log-count></span>
        </div>
        <div class="dev-log-body" data-dev-log-body></div>
      </aside>
      <aside class="dev-panel" data-dev-panel aria-hidden="true">
        <div class="dev-panel-header">
          <div>
            <p>Developer Mode</p>
            <h2>内容编辑器</h2>
          </div>
          <button class="icon-only" type="button" data-dev-close aria-label="关闭编辑器">${icon("close")}</button>
        </div>
        <div class="dev-tabs" role="tablist">
          <button class="dev-tab is-active" type="button" data-editor-tab="profile">个人</button>
          <button class="dev-tab" type="button" data-editor-tab="experience">经历</button>
          <button class="dev-tab" type="button" data-editor-tab="projects">作品</button>
          <button class="dev-tab" type="button" data-editor-tab="games">游戏库</button>
          <button class="dev-tab" type="button" data-editor-tab="sections">页签</button>
          <button class="dev-tab" type="button" data-editor-tab="data">数据</button>
        </div>
        <div class="dev-panel-body" data-editor-body></div>
        <div class="dev-panel-footer">
          <button class="dev-action primary" type="button" data-dev-save>${icon("save")}保存</button>
          <button class="dev-action" type="button" data-dev-export>${icon("download")}导出</button>
        </div>
      </aside>
      <div class="dev-scrim" data-dev-scrim></div>
      <div class="dev-toast" data-dev-toast></div>
      <input class="visually-hidden" type="file" accept="application/json" data-dev-import />
    `
  );

  renderEditor();
  bindEditorEvents();
}

function bindEditorEvents() {
  document.querySelector("[data-dev-open]").addEventListener("click", openEditor);
  document.querySelector("[data-dev-close]").addEventListener("click", closeEditor);
  document.querySelector("[data-dev-scrim]").addEventListener("click", closeEditor);
  document.querySelector("[data-dev-save]").addEventListener("click", saveCurrentContent);
  document.querySelector("[data-dev-export]").addEventListener("click", exportCurrentContent);
  document.querySelector("[data-dev-import]").addEventListener("change", importContentFile);
  document.querySelector("[data-inline-edit-toggle]").addEventListener("click", () => setInlineEditMode(!inlineEditMode));
  document.querySelector("[data-inline-save]").addEventListener("click", saveCurrentContent);
  document.querySelector("[data-dev-log-toggle]").addEventListener("click", toggleDebugLogPanel);
  document.querySelector("[data-dev-log-close]").addEventListener("click", closeDebugLogPanel);
  document.querySelector("[data-dev-log-clear]").addEventListener("click", clearDebugLogPanel);
  document.querySelector("[data-dev-log-export]").addEventListener("click", exportDebugLogPanel);
  document.querySelector("[data-dev-log-search]").addEventListener("input", updateDebugLogFilter);
  document.addEventListener("click", handleInlineEditClick);
  document.addEventListener("input", handleInlineEditInput);
  document.addEventListener("change", handleInlineEditChange);
  document.addEventListener("change", handleCvUploadChange);

  document.querySelector(".dev-tabs").addEventListener("click", (event) => {
    const tab = event.target.closest("[data-editor-tab]");
    if (!tab) return;
    syncFromEditor();
    currentEditorTab = tab.dataset.editorTab;
    renderEditor();
  });

  document.querySelector("[data-editor-body]").addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    handleEditorButton(button);
  });

  document.querySelector("[data-editor-body]").addEventListener("change", (event) => {
    const input = event.target.closest("input[type='file'][data-image-upload]");
    if (input) {
      handleImageUpload(input);
      return;
    }

    const documentInput = event.target.closest("input[type='file'][data-document-upload]");
    if (documentInput) {
      handleDocumentUpload(documentInput);
      return;
    }

    const videoInput = event.target.closest("input[type='file'][data-video-upload]");
    if (videoInput) {
      handleVideoUpload(videoInput);
    }
  });
}

function handleCvUploadChange(event) {
  const input = event.target.closest("[data-cv-upload]");
  if (!input) return;
  handleCvUpload(input);
}

async function handleCvUpload(input) {
  const file = input.files?.[0];
  if (!file) return;

  try {
    showToast("正在上传 CV...");
    const uploadedPath = await uploadAssetFile(file, "documents");
    if (!uploadedPath) {
      showToast("CV 上传失败：请双击 OpenEditor.bat，用 127.0.0.1:4173 打开后再传");
      return;
    }
    siteData.cv = normalizeCvDocument({
      src: uploadedPath,
      fileName: file.name,
      label: "下载 CV"
    });
    renderCvActions();
    renderEditor();
    showToast("CV 已上传，点击保存后生效");
  } catch {
    showToast("CV 上传失败");
  } finally {
    input.value = "";
  }
}

function renderDebugLogPanel() {
  const body = document.querySelector("[data-dev-log-body]");
  if (!body) return;
  const count = document.querySelector("[data-dev-log-count]");
  const search = document.querySelector("[data-dev-log-search]");
  const filter = debugLogFilter.trim().toLowerCase();
  if (search && search.value !== debugLogFilter) search.value = debugLogFilter;
  const visibleLogs = filter
    ? debugLogs.filter((entry) => {
        const haystack = `${entry.time} ${entry.level} ${entry.scope} ${entry.message} ${debugString(entry.details)}`.toLowerCase();
        return haystack.includes(filter);
      })
    : debugLogs;
  if (count) count.textContent = filter ? `${visibleLogs.length}/${debugLogs.length}` : `${debugLogs.length}`;
  body.innerHTML = visibleLogs.length
    ? visibleLogs.map((entry) => {
        const detail = entry.details && Object.keys(entry.details).length
          ? `<pre>${escapeHtml(debugString(entry.details))}</pre>`
          : "";
        return `
          <article class="dev-log-entry is-${attr(entry.level)}">
            <div><span>${escapeHtml(entry.time)}</span><b>${escapeHtml(entry.scope)}</b><em>${escapeHtml(entry.level)}</em></div>
            <p>${escapeHtml(entry.message)}</p>
            ${detail}
          </article>
        `;
      }).join("")
    : `<p class="dev-log-empty">${debugLogs.length ? "没有匹配的日志。" : "暂无日志。复现保存/上传问题后这里会显示记录。"}</p>`;
}

function openDebugLogPanel() {
  const panel = document.querySelector("[data-dev-log-panel]");
  if (!panel) return;
  panel.classList.add("is-open");
  panel.setAttribute("aria-hidden", "false");
  renderDebugLogPanel();
}

function closeDebugLogPanel() {
  const panel = document.querySelector("[data-dev-log-panel]");
  if (!panel) return;
  panel.classList.remove("is-open");
  panel.setAttribute("aria-hidden", "true");
}

function toggleDebugLogPanel() {
  const panel = document.querySelector("[data-dev-log-panel]");
  if (panel?.classList.contains("is-open")) closeDebugLogPanel();
  else openDebugLogPanel();
}

function clearDebugLogPanel() {
  debugLogs.splice(0);
  renderDebugLogPanel();
}

function updateDebugLogFilter(event) {
  debugLogFilter = event.target.value || "";
  renderDebugLogPanel();
}

function exportDebugLogPanel() {
  const payload = {
    exportedAt: new Date().toISOString(),
    url: window.location.href,
    filter: debugLogFilter,
    logs: debugLogs
  };
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `portfolio-debug-log-${stamp}.json`;
  link.click();
  URL.revokeObjectURL(url);
  debugLog("debug", "log exported", { count: debugLogs.length, filter: debugLogFilter });
}

function openEditor() {
  document.querySelector("[data-dev-panel]")?.classList.add("is-open");
  document.querySelector("[data-dev-scrim]")?.classList.add("is-open");
  document.querySelector("[data-dev-panel]")?.setAttribute("aria-hidden", "false");
}

function closeEditor() {
  document.querySelector("[data-dev-panel]")?.classList.remove("is-open");
  document.querySelector("[data-dev-scrim]")?.classList.remove("is-open");
  document.querySelector("[data-dev-panel]")?.setAttribute("aria-hidden", "true");
}

function renderEditor() {
  const body = document.querySelector("[data-editor-body]");
  if (!body) return;

  document.querySelectorAll("[data-editor-tab]").forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.editorTab === currentEditorTab);
  });

  const renderers = {
    profile: renderProfileEditor,
    experience: renderTimelineEditor,
    projects: renderProjectsEditor,
    games: renderGameLibraryEditor,
    sections: renderSectionsEditor,
    data: renderDataEditor
  };
  if (!renderers[currentEditorTab]) {
    debugLog("editor", "invalid editor tab fallback", { currentEditorTab }, "warn");
    currentEditorTab = "sections";
    document.querySelectorAll("[data-editor-tab]").forEach((tab) => {
      tab.classList.toggle("is-active", tab.dataset.editorTab === currentEditorTab);
    });
  }
  body.innerHTML = renderers[currentEditorTab]();
}

function renderProfileEditor() {
  const profile = siteData.profile;
  const heroStyle = normalizeHeroStyle(profile.heroStyle);
  const heroGreeting = profile.heroGreeting || `Hi，我是${profile.name}，很高兴遇见你，`;
  return `
    <div class="dev-form-grid">
      ${textarea("首屏欢迎语", "profile-hero-greeting", heroGreeting, 2)}
      ${field("欢迎语字体", "profile-hero-font-family", heroStyle.fontFamily)}
      ${field("欢迎语字号", "profile-hero-heading-size", heroStyle.headingSize)}
      ${field("欢迎语行距", "profile-hero-line-height", heroStyle.lineHeight)}
      ${field("欢迎语字重", "profile-hero-heading-weight", heroStyle.headingWeight)}
      ${field("首屏最大宽度", "profile-hero-max-width", heroStyle.maxWidth)}
      ${field("职业说明字号", "profile-hero-title-size", heroStyle.titleSize)}
      ${field("职业说明行距", "profile-hero-title-line-height", heroStyle.titleLineHeight)}
      <label class="dev-field">
        <span>首屏对齐</span>
        <select id="profile-hero-align">
          ${["left", "center", "right"]
            .map((option) => `<option value="${option}"${option === heroStyle.align ? " selected" : ""}>${option}</option>`)
            .join("")}
        </select>
      </label>
      <label class="dev-check-field">
        <input id="profile-hero-nowrap" type="checkbox"${heroStyle.nowrap ? " checked" : ""} />
        <span>欢迎语尽量保持一行</span>
      </label>
      ${field("姓名", "profile-name", profile.name)}
      ${field("头像缩写", "profile-initials", profile.initials)}
      ${field("英文身份", "profile-kicker", profile.kicker)}
      ${field("中文标题", "profile-title", profile.title)}
      ${textarea("一句话介绍", "profile-summary", profile.summary, 3)}
      ${textarea("个人介绍段落", "profile-about", profile.about.join("\\n\\n"), 8)}
    </div>
    <div class="dev-section-head">
      <h3>联系方式</h3>
      <button class="dev-small-button" type="button" data-add-link>${icon("plus")}添加</button>
    </div>
    <div class="dev-list">
      ${profile.links.map((link, index) => renderContactLinkEditor(link, index)).join("")}
    </div>
    <div class="dev-section-head">
      <h3>亮点数字</h3>
      <button class="dev-small-button" type="button" data-add-fact>${icon("plus")}添加</button>
    </div>
    <div class="dev-list" data-fact-list>
      ${profile.facts.map((fact, index) => renderFactEditor(fact, index)).join("")}
    </div>
    <div class="dev-section-head">
      <div>
        <h3>关键词分组</h3>
        <p>可以写技能、编程语言、语言、软件等。每组关键词用逗号或换行分隔。</p>
      </div>
      <button class="dev-small-button" type="button" data-add-keyword-group>${icon("plus")}添加分组</button>
    </div>
    <div class="dev-list">
      ${profile.keywords.map((group, index) => renderKeywordGroupEditor(group, index)).join("")}
    </div>
  `;
}

function renderContactLinkEditor(link, index) {
  return `
    <article class="dev-item" data-link-index="${index}">
      <div class="dev-item-head">
        <strong>${escapeHtml(link.label || "联系方式")}</strong>
        <button class="dev-icon-button danger" type="button" data-delete-link="${index}" aria-label="删除联系方式">${icon("trash")}</button>
      </div>
      <div class="dev-form-grid compact">
        ${field("显示文字", "link-label", link.label, `data-link-field="label"`)}
        ${field("链接 / 电话 / 微信", "link-href", link.href, `data-link-field="href"`)}
        ${contactIconField("图标", "link-icon", link.icon, `data-link-field="icon"`)}
        <label class="dev-check-field">
          <input type="checkbox" data-link-field="primary"${link.primary ? " checked" : ""} />
          <span>主按钮</span>
        </label>
      </div>
    </article>
  `;
}

function renderFactEditor(fact, index) {
  return `
    <div class="dev-mini-row" data-fact-index="${index}">
      <input aria-label="亮点值" data-fact-field="value" value="${attr(fact.value)}" />
      <input aria-label="亮点说明" data-fact-field="label" value="${attr(fact.label)}" />
      <button class="dev-icon-button danger" type="button" data-delete-fact="${index}" aria-label="删除亮点">${icon("trash")}</button>
    </div>
  `;
}

function renderKeywordGroupEditor(group, index) {
  return `
    <article class="dev-item" data-keyword-index="${index}">
      <div class="dev-item-head">
        <strong>${escapeHtml(group.label || "关键词分组")}</strong>
        <button class="dev-icon-button danger" type="button" data-delete-keyword-group="${index}" aria-label="删除关键词分组">${icon("trash")}</button>
      </div>
      <div class="dev-form-grid compact">
        ${field("分组标题", "keyword-label", group.label, `data-keyword-field="label"`)}
        ${textarea("关键词", "keyword-items", toTags(group.items).join(", "), 3, `data-keyword-field="items"`)}
      </div>
    </article>
  `;
}

function renderTimelineEditor() {
  currentTimelineEditorGroup = normalizeTimelineType(currentTimelineEditorGroup);
  const activeConfig = getTimelineGroupConfig(currentTimelineEditorGroup);
  const entries = getTimelineEntries(currentTimelineEditorGroup);

  return `
    <div class="dev-section-head">
      <div>
        <h3>经历与学习</h3>
        <p>把经历拆成教育和工作两个分类；内容条目可以每行写一条，也可以写成 1. 2. 3.。</p>
      </div>
    </div>
    <div class="dev-subtabs" role="tablist" aria-label="经历分类">
      ${timelineGroups
        .map(
          (group) => `
            <button class="dev-subtab${group.id === currentTimelineEditorGroup ? " is-active" : ""}" type="button" data-timeline-editor-tab="${attr(group.id)}">
              ${escapeHtml(group.label)}
            </button>
          `
        )
        .join("")}
    </div>
    <div class="dev-section-head nested">
      <h4>${escapeHtml(activeConfig.label)}经历</h4>
      <button class="dev-small-button" type="button" data-add-timeline="${attr(activeConfig.id)}">${icon("plus")}添加${escapeHtml(activeConfig.label)}</button>
    </div>
    <div class="dev-list" data-timeline-panel="${attr(activeConfig.id)}">
      ${
        entries.length
          ? entries.map((entry) => renderTimelineItemEditor(entry, entry.index)).join("")
          : `<div class="dev-empty">还没有${escapeHtml(activeConfig.label)}经历，点击上方按钮添加。</div>`
      }
    </div>
  `;
}

function renderTimelineItemEditor(item, index) {
  const type = normalizeTimelineType(item.type);
  const label = timelineGroupLabels[type];

  return `
    <article class="dev-item" data-timeline-index="${index}" data-timeline-type="${attr(type)}">
      <div class="dev-item-head">
        <strong>${escapeHtml(item.title || `未命名${label}经历`)}</strong>
        <button class="dev-icon-button danger" type="button" data-delete-timeline="${index}" aria-label="删除经历">${icon("trash")}</button>
      </div>
      <div class="dev-form-grid compact">
        ${field("排序", "timeline-order", orderValue(item, index), `data-timeline-field="order"`)}
        ${field("年份 / 时间", "timeline-date", item.date, `data-timeline-field="date"`)}
        ${field("标题", "timeline-title", item.title, `data-timeline-field="title"`)}
        ${textarea("内容条目", "timeline-description", item.description, 6, `data-timeline-field="description"`)}
        ${field("标签", "timeline-tags", toTags(item.tags).join(", "), `data-timeline-field="tags"`)}
      </div>
    </article>
  `;
}

function renderProjectsEditor() {
  return `
    <div class="dev-section-head">
      <div>
        <h3>作品卡片</h3>
        <p>排序数字越小越靠前；排序为 1 的作品会自动变大。引擎和职责会作为主关键词显示。</p>
      </div>
      <button class="dev-small-button" type="button" data-add-project>${icon("plus")}添加作品</button>
    </div>
    <div class="dev-list">
      ${getOrderedProjects("all").map((project) => renderProjectEditor(project, project.index)).join("")}
    </div>
  `;
}

function renderProjectEditor(project, index) {
  const tags = toTags(project.tags);

  return `
    <article class="dev-item" data-project-index="${index}">
      <div class="dev-item-head">
        <strong>${escapeHtml(project.title || "未命名作品")}</strong>
        <button class="dev-icon-button danger" type="button" data-delete-project="${index}" aria-label="删除作品">${icon("trash")}</button>
      </div>
      <div class="dev-form-grid compact">
        ${field("排序", "project-order", orderValue(project, index), `data-project-field="order"`)}
        ${field("标题", "project-title", project.title, `data-project-field="title"`)}
        ${field("详情页路径", "project-slug", project.slug || projectCardSlug(project, index), `data-project-field="slug" placeholder="例如 阴阳之力"`)}
        ${field("跳转网站", "project-website", project.website, `data-project-field="website" placeholder="https://... 或 #project/..."`)}
        ${field("年份", "project-year", project.year, `data-project-field="year"`)}
        ${selectField("分类", "project-category", project.category, `data-project-field="category"`)}
        ${field("引擎", "project-engine", project.engine, `data-project-field="engine"`)}
        ${field("我的职责", "project-responsibility", project.responsibility || project.role, `data-project-field="responsibility"`)}
        ${field("编程语言", "project-language", project.language, `data-project-field="language"`)}
        ${field("游戏类型", "project-game-type", project.gameType, `data-project-field="gameType"`)}
        ${field("图片宽度", "project-image-width", project.imageWidth, `data-project-field="imageWidth" placeholder="例如 100% / 620px"`)}
        ${field("图片比例", "project-image-aspect", project.imageAspect, `data-project-field="imageAspect" placeholder="例如 16 / 9"`)}
        ${imageFitField("图片显示", "project-image-fit", project.imageFit || "cover", `data-project-field="imageFit"`)}
        <div class="dev-field wide project-tags-editor">
          <div class="dev-inline-head">
            <span>补充标签</span>
            <button class="dev-small-button" type="button" data-add-project-tag="${index}">${icon("plus")}添加标签</button>
          </div>
          <div class="dev-list nested">
            ${
              tags.length
                ? tags.map((tag, tagIndex) => renderProjectTagEditor(tag, index, tagIndex)).join("")
                : `<div class="dev-empty compact">还没有补充标签，点击添加标签。</div>`
            }
          </div>
        </div>
        ${textarea("简介", "project-description", project.description, 4, `data-project-field="description"`)}
        ${renderDetailBlocksEditor(project, PROJECT_DETAIL_SECTION_INDEX, index)}
        ${imageField("图片", project.image, `data-project-field="image"`, "project", index)}
      </div>
    </article>
  `;
}

function renderProjectTagEditor(tag, projectIndex, tagIndex) {
  return `
    <div class="dev-mini-row project-tag-row" data-project-tag-index="${tagIndex}">
      <input aria-label="补充标签" data-project-tag-field="value" value="${attr(tag)}" />
      <button class="dev-icon-button danger" type="button" data-delete-project-tag="${projectIndex}:${tagIndex}" aria-label="删除补充标签">${icon("trash")}</button>
    </div>
  `;
}

function renderSectionsEditor() {
  return `
    <div class="dev-section-head">
      <div>
        <h3>固定栏目标题</h3>
        <p>这里可以修改导航文字、小标题、大标题和说明文字，比如 Selected Work。</p>
      </div>
    </div>
    <div class="dev-list">
      ${baseNavItems.map((item) => renderBaseSectionEditor(item)).join("")}
    </div>
    <div class="dev-section-head">
      <div>
        <h3>自定义标题页签</h3>
        <p>这里创建的页签会自动出现在顶部导航里，并在网站底部生成新章节。</p>
      </div>
      <button class="dev-small-button" type="button" data-add-section>${icon("plus")}添加页签</button>
    </div>
    <div class="dev-list">
      ${siteData.customSections.map((section, index) => renderSectionEditor(section, index)).join("")}
    </div>
  `;
}

function renderBaseSectionEditor(item) {
  const section = getSectionConfig(item.id);
  return `
    <article class="dev-item" data-base-section-id="${attr(item.id)}">
      <div class="dev-item-head">
        <strong>${escapeHtml(section.title || item.label || item.id)}</strong>
      </div>
      <div class="dev-form-grid compact">
        ${field("导航文字", `base-section-nav-${item.id}`, section.nav, `data-base-section-field="nav"`)}
        ${field("小标题", `base-section-kicker-${item.id}`, section.kicker, `data-base-section-field="kicker"`)}
        ${field("大标题", `base-section-title-${item.id}`, section.title, `data-base-section-field="title"`)}
        ${textarea("说明文字", `base-section-copy-${item.id}`, section.copy, 3, `data-base-section-field="copy"`)}
      </div>
    </article>
  `;
}

function renderSectionEditor(section, index) {
  return `
    <article class="dev-item" data-section-index="${index}">
      <div class="dev-item-head">
        <strong>${escapeHtml(section.navTitle || section.title || "新页签")}</strong>
        <button class="dev-icon-button danger" type="button" data-delete-section="${index}" aria-label="删除页签">${icon("trash")}</button>
      </div>
      <div class="dev-form-grid compact">
        ${field("导航页签名", "section-nav-title", section.navTitle, `data-section-field="navTitle"`)}
        ${field("章节 ID", "section-id", section.id, `data-section-field="id"`)}
        ${field("小标题", "section-kicker", section.kicker, `data-section-field="kicker"`)}
        ${field("大标题", "section-title", section.title, `data-section-field="title"`)}
        ${sectionLayoutField("显示格式", "section-layout", section.layout || (section.cards?.length ? "cards" : ""), `data-section-field="layout"`)}
        ${textarea("章节说明", "section-body", toParagraphs(section.body).join("\\n\\n"), 4, `data-section-field="body"`)}
      </div>
      <div class="dev-section-head nested">
        <h4>卡片单元</h4>
        <button class="dev-small-button" type="button" data-add-section-card="${index}">${icon("plus")}添加卡片</button>
      </div>
      <div class="dev-list nested">
        ${getOrderedCustomCards(section).map((card) => renderSectionCardEditor(card, index, card.index)).join("") || `<div class="dev-empty compact">还没有卡片，点击添加卡片。</div>`}
      </div>
      <div class="dev-section-head nested">
        <h4>旧版图片</h4>
        <button class="dev-small-button" type="button" data-add-section-image="${index}">${icon("plus")}添加图片</button>
      </div>
      <div class="dev-list nested">
        ${(section.images || []).map((image, imageIndex) => renderSectionImageEditor(image, index, imageIndex)).join("")}
      </div>
    </article>
  `;
}

function renderSectionCardEditor(card, sectionIndex, cardIndex) {
  const tags = toTags(card.tags);
  return `
    <article class="dev-item compact" data-section-card-index="${cardIndex}">
      <div class="dev-item-head">
        <strong>${escapeHtml(card.title || "原型单元")}</strong>
        <button class="dev-icon-button danger" type="button" data-delete-section-card="${sectionIndex}:${cardIndex}" aria-label="删除卡片">${icon("trash")}</button>
      </div>
      <div class="dev-form-grid compact">
        ${field("排序", "section-card-order", orderValue(card, cardIndex), `data-section-card-field="order"`)}
        ${field("标题", "section-card-title", card.title, `data-section-card-field="title"`)}
        ${field("详情页路径", "section-card-slug", card.slug, `data-section-card-field="slug" placeholder="例如 gravity-ball"`)}
        ${textarea("文本条目", "section-card-description", card.description, 5, `data-section-card-field="description"`)}
        ${renderDetailBlocksEditor(card, sectionIndex, cardIndex)}
        ${imageField("图片", card.image, `data-section-card-field="image"`, "section-card", sectionIndex, cardIndex)}
        ${field("图片宽度", "section-card-image-width", card.imageWidth, `data-section-card-field="imageWidth" placeholder="例如 100% / 620px"`)}
        ${field("图片比例", "section-card-image-aspect", card.imageAspect, `data-section-card-field="imageAspect" placeholder="例如 16 / 9"`)}
        ${imageFitField("图片显示", "section-card-image-fit", card.imageFit || "cover", `data-section-card-field="imageFit"`)}
        <div class="dev-field wide section-card-tags-editor">
          <div class="dev-inline-head">
            <span>标签</span>
            <button class="dev-small-button" type="button" data-add-section-card-tag="${sectionIndex}:${cardIndex}">${icon("plus")}添加标签</button>
          </div>
          <div class="dev-list nested">
            ${tags.length ? tags.map((tag, tagIndex) => renderSectionCardTagEditor(tag, sectionIndex, cardIndex, tagIndex)).join("") : `<div class="dev-empty compact">还没有标签，点击添加标签。</div>`}
          </div>
        </div>
      </div>
    </article>
  `;
}

function renderDetailBlocksEditor(card, sectionIndex, cardIndex) {
  const blocks = getOrderedDetailBlocks(card);
  return `
    <div class="dev-field wide detail-blocks-editor">
      <div class="dev-inline-head">
        <span>详情页模块</span>
        <div class="dev-inline-actions">
          <button class="dev-small-button" type="button" data-add-detail-block="${sectionIndex}:${cardIndex}:text">${icon("plus")}添加文字</button>
          <button class="dev-small-button" type="button" data-add-detail-block="${sectionIndex}:${cardIndex}:image">${icon("plus")}添加图片</button>
          <button class="dev-small-button" type="button" data-add-detail-block="${sectionIndex}:${cardIndex}:document">${icon("plus")}添加文档</button>
          <button class="dev-small-button" type="button" data-add-detail-block="${sectionIndex}:${cardIndex}:video">${icon("plus")}添加视频</button>
        </div>
      </div>
      <span class="dev-help">详情页会按模块排序从上到下显示，可以组合成文字、图片、文档预览、视频等结构。</span>
      <div class="dev-list nested detail-block-list">
        ${blocks.length ? blocks.map((block) => renderDetailBlockEditor(block, sectionIndex, cardIndex, block.index)).join("") : `<div class="dev-empty compact">还没有详情模块，点击添加文字、图片、文档或视频。</div>`}
      </div>
    </div>
  `;
}
function renderDetailBlockEditor(block, sectionIndex, cardIndex, blockIndex) {
  const typeLabels = {
    image: "图片模块",
    document: "文档模块",
    video: "视频模块",
    text: "文字模块"
  };
  const typeLabel = typeLabels[block.type] || typeLabels.text;
  return `
    <article class="dev-item compact detail-block-editor" data-detail-block-index="${blockIndex}" data-detail-block-type="${attr(block.type)}">
      <div class="dev-item-head">
        <strong>${escapeHtml(typeLabel)}</strong>
        <button class="dev-icon-button danger" type="button" data-delete-detail-block="${sectionIndex}:${cardIndex}:${blockIndex}" aria-label="删除详情模块">${icon("trash")}</button>
      </div>
      <div class="dev-form-grid compact">
        ${field("排序", "detail-block-order", orderValue(block, blockIndex), `data-detail-block-field="order"`)}
        <input type="hidden" data-detail-block-field="type" value="${attr(block.type)}" />
        ${renderDetailBlockFields(block, sectionIndex, cardIndex, blockIndex)}
      </div>
    </article>
  `;
}

function renderDetailBlockFields(block, sectionIndex, cardIndex, blockIndex) {
  if (block.type === "image") return renderDetailImageBlockEditor(block, sectionIndex, cardIndex, blockIndex);
  if (block.type === "document") return renderDetailDocumentBlockEditor(block, sectionIndex, cardIndex, blockIndex);
  if (block.type === "video") return renderDetailVideoBlockEditor(block, sectionIndex, cardIndex, blockIndex);
  return renderDetailTextBlockEditor(block);
}

function renderDetailTextBlockEditor(block) {
  const style = normalizeDetailTextStyle(block.textStyle);
  const options = [
    ["body", "正文"],
    ["heading", "大标题"],
    ["subheading", "小标题"],
    ["callout", "重点提示"],
    ["code", "代码块"]
  ];

  return `
    <label class="dev-field">
      <span>文字样式</span>
      <select data-detail-block-field="textStyle">
        ${options.map(([value, label]) => `<option value="${value}"${value === style ? " selected" : ""}>${label}</option>`).join("")}
      </select>
    </label>
    ${textarea("文字内容", "detail-block-text", block.text, 5, `data-detail-block-field="text"`)}
  `;
}
function renderDetailImageBlockEditor(block, sectionIndex, cardIndex, blockIndex) {
  return `
    ${imageField("图片", block.src, `data-detail-block-field="src"`, "detail-block", `${sectionIndex}-${cardIndex}`, blockIndex)}
    ${field("图片说明", "detail-block-caption", block.caption, `data-detail-block-field="caption"`)}
    ${field("替代文字", "detail-block-alt", block.alt, `data-detail-block-field="alt"`)}
    ${field("图片宽度", "detail-block-image-width", block.imageWidth, `data-detail-block-field="imageWidth" placeholder="例如 100% / 620px"`)}
  `;
}

function renderDetailDocumentBlockEditor(block, sectionIndex, cardIndex, blockIndex) {
  return `
    ${field("文档标题", "detail-block-document-title", block.title, `data-detail-block-field="title"`)}
    ${documentField("文档地址", block.src, `data-detail-block-field="src"`, "detail-document", `${sectionIndex}-${cardIndex}`, blockIndex)}
    ${field("文件名", "detail-block-document-file-name", block.fileName, `data-detail-block-field="fileName" placeholder="例如 combat-design.pdf"`)}
    ${textarea("文档说明", "detail-block-document-description", block.description, 3, `data-detail-block-field="description"`)}
  `;
}

function renderDetailVideoBlockEditor(block, sectionIndex, cardIndex, blockIndex) {
  return `
    ${field("视频标题", "detail-block-video-title", block.title, `data-detail-block-field="title"`)}
    ${videoField("视频路径", block.src, `data-detail-block-field="src"`, "detail-video", `${sectionIndex}-${cardIndex}`, blockIndex)}
    ${field("封面图", "detail-block-video-poster", block.poster, `data-detail-block-field="poster" placeholder="assets/prototype/poster.jpg"`)}
    ${textarea("视频说明", "detail-block-video-description", block.description, 3, `data-detail-block-field="description"`)}
  `;
}
function renderSectionCardTagEditor(tag, sectionIndex, cardIndex, tagIndex) {
  return `
    <div class="dev-mini-row section-card-tag-row" data-section-card-tag-index="${tagIndex}">
      <input aria-label="原型卡片标签" data-section-card-tag-field="value" value="${attr(tag)}" />
      <button class="dev-icon-button danger" type="button" data-delete-section-card-tag="${sectionIndex}:${cardIndex}:${tagIndex}" aria-label="删除标签">${icon("trash")}</button>
    </div>
  `;
}

function renderSectionImageEditor(image, sectionIndex, imageIndex) {
  return `
    <div class="dev-image-row" data-section-image-index="${imageIndex}">
      ${imageField("图片", image.src, `data-section-image-field="src"`, "section", sectionIndex, imageIndex)}
      ${field("说明", "section-image-caption", image.caption, `data-section-image-field="caption"`)}
      ${field("替代文字", "section-image-alt", image.alt, `data-section-image-field="alt"`)}
      <button class="dev-small-button danger" type="button" data-delete-section-image="${sectionIndex}:${imageIndex}">${icon("trash")}删除图片</button>
    </div>
  `;
}

function renderGameLibraryEditor() {
  return `
    <div class="dev-section-head">
      <div>
        <h3>主机游戏库</h3>
        <p>这里可以手动添加 PlayStation 和 Nintendo 游戏。封面可以先空着，后续再统一补。</p>
      </div>
    </div>
    <div class="dev-list">
      ${siteData.gamePlatforms.map((platform, index) => renderGamePlatformEditor(platform, index)).join("")}
    </div>
  `;
}

function renderGamePlatformEditor(platform, index) {
  return `
    <article class="dev-item" data-platform-index="${index}">
      <div class="dev-item-head">
        <strong>${escapeHtml(platform.label || "游戏平台")}</strong>
        <button class="dev-small-button" type="button" data-add-platform-game="${index}">${icon("plus")}添加游戏</button>
      </div>
      <div class="dev-form-grid compact">
        ${field("平台 ID", "platform-id", platform.id, `data-platform-field="id"`)}
        ${field("平台名称", "platform-label", platform.label, `data-platform-field="label"`)}
        ${field("Logo 类型", "platform-logo", platform.logo, `data-platform-field="logo"`)}
        ${textarea("模块说明", "platform-description", platform.description, 3, `data-platform-field="description"`)}
      </div>
      <div class="dev-section-head nested">
        <h4>游戏</h4>
      </div>
      <div class="dev-list nested">
        ${platform.games.length ? platform.games.map((game, gameIndex) => renderManualGameEditor(game, index, gameIndex)).join("") : `<div class="dev-empty compact">还没有游戏，点击“添加游戏”。</div>`}
      </div>
    </article>
  `;
}

function renderManualGameEditor(game, platformIndex, gameIndex) {
  return `
    <div class="dev-image-row" data-platform-game-index="${gameIndex}">
      <div class="dev-item-head">
        <strong>${escapeHtml(game.name || "新游戏")}</strong>
        <button class="dev-icon-button danger" type="button" data-delete-platform-game="${platformIndex}:${gameIndex}" aria-label="删除游戏">${icon("trash")}</button>
      </div>
      <div class="dev-form-grid compact">
        ${field("游戏名称", "platform-game-name", game.name, `data-platform-game-field="name"`)}
        ${field("类型", "platform-game-genres", toTags(game.genres).join("，"), `data-platform-game-field="genres"`)}
        ${field("游戏时间（小时）", "platform-game-playtime", manualGameHours(game), `data-platform-game-field="playtimeHours"`)}
        ${imageField("封面", game.image, `data-platform-game-field="image"`, "platform", platformIndex, gameIndex)}
      </div>
    </div>
  `;
}

function manualGameHours(game) {
  const hours = Number(game.playtimeMinutes || 0) / 60;
  return hours ? Number(hours.toFixed(1)) : "";
}

function renderDataEditor() {
  return `
    <div class="dev-data-panel">
      <h3>数据导入 / 导出</h3>
      <p>保存按钮会优先写入本地预览服务器的 content.json；如果不是用服务器打开，则保存到当前浏览器。</p>
      <div class="dev-button-row">
        <button class="dev-action" type="button" data-trigger-import>导入 JSON</button>
        <button class="dev-action danger" type="button" data-reset-content>恢复默认</button>
      </div>
      <textarea class="dev-json-preview" readonly>${escapeHtml(JSON.stringify(siteData, null, 2))}</textarea>
    </div>
  `;
}

function field(label, id, value, extra = "") {
  return `
    <label class="dev-field">
      <span>${escapeHtml(label)}</span>
      <input id="${attr(id)}" value="${attr(value || "")}" ${extra} />
    </label>
  `;
}

function textarea(label, id, value, rows = 4, extra = "") {
  return `
    <label class="dev-field wide">
      <span>${escapeHtml(label)}</span>
      <textarea id="${attr(id)}" rows="${rows}" ${extra}>${escapeHtml(value || "")}</textarea>
    </label>
  `;
}

function selectField(label, id, value, extra = "") {
  const categories = [
    ["games", "游戏"],
    ["systems", "系统"],
    ["design", "设计"],
    ["research", "研究"]
  ];
  return `
    <label class="dev-field">
      <span>${escapeHtml(label)}</span>
      <select id="${attr(id)}" ${extra}>
        ${categories
          .map(([optionValue, optionLabel]) => `<option value="${optionValue}"${optionValue === value ? " selected" : ""}>${optionLabel}</option>`)
          .join("")}
      </select>
    </label>
  `;
}

function imageFitField(label, id, value, extra = "") {
  const options = [
    ["cover", "裁切填满"],
    ["contain", "完整显示"],
    ["scale-down", "缩小适配"],
    ["fill", "拉伸填满"]
  ];
  return `
    <label class="dev-field">
      <span>${escapeHtml(label)}</span>
      <select id="${attr(id)}" ${extra}>
        ${options
          .map(([optionValue, optionLabel]) => `<option value="${optionValue}"${optionValue === value ? " selected" : ""}>${optionLabel}</option>`)
          .join("")}
      </select>
    </label>
  `;
}

function sectionLayoutField(label, id, value, extra = "") {
  const options = [
    ["cards", "卡片"],
    ["", "正文 + 图片"]
  ];
  return `
    <label class="dev-field">
      <span>${escapeHtml(label)}</span>
      <select id="${attr(id)}" ${extra}>
        ${options
          .map(([optionValue, optionLabel]) => `<option value="${optionValue}"${optionValue === value ? " selected" : ""}>${optionLabel}</option>`)
          .join("")}
      </select>
    </label>
  `;
}

function contactIconField(label, id, value, extra = "") {
  const icons = [
    ["mail", "Email"],
    ["wechat", "微信"],
    ["phone", "电话"],
    ["github", "GitHub"],
    ["video", "Bilibili"],
    ["gamepad", "Steam"]
  ];
  return `
    <label class="dev-field">
      <span>${escapeHtml(label)}</span>
      <select id="${attr(id)}" ${extra}>
        ${icons
          .map(([optionValue, optionLabel]) => `<option value="${optionValue}"${optionValue === value ? " selected" : ""}>${optionLabel}</option>`)
          .join("")}
      </select>
    </label>
  `;
}

function imageField(label, value, extra, target, index, imageIndex = "") {
  const imageInputId = `image-${target}-${index}-${imageIndex}`;
  return `
    <label class="dev-field wide">
      <span>${escapeHtml(label)}</span>
      <input value="${attr(value || "")}" ${extra} />
      <span class="dev-help">可以填 assets 路径或 https 图片；选择本地图片会自动复制到 assets/uploads/images。</span>
      <input id="${attr(imageInputId)}" type="file" accept="image/*" data-image-upload data-image-target="${target}" data-image-index="${attr(index)}" data-sub-image-index="${attr(imageIndex)}" />
    </label>
  `;
}

function documentField(label, value, extra, target, index, blockIndex = "") {
  const documentInputId = `document-${target}-${index}-${blockIndex}`;
  return `
    <label class="dev-field wide">
      <span>${escapeHtml(label)}</span>
      <input value="${attr(value || "")}" ${extra} />
      <span class="dev-help">可以填 assets/docs 或 https 地址；选择本地文档会自动复制到 assets/uploads/documents。</span>
      <input id="${attr(documentInputId)}" type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" data-document-upload data-document-target="${target}" data-document-index="${attr(index)}" data-sub-document-index="${attr(blockIndex)}" />
    </label>
  `;
}

function videoField(label, value, extra, target, index, blockIndex = "") {
  const videoInputId = `video-${target}-${index}-${blockIndex}`;
  return `
    <label class="dev-field wide">
      <span>${escapeHtml(label)}</span>
      <input id="${attr(videoInputId)}" value="${attr(value || "")}" ${extra} placeholder="assets/uploads/videos/demo.mp4" />
      <span class="dev-help">可以填 assets 路径；选择本地 MP4 / WebM 会自动复制到 assets/uploads/videos。</span>
      <input type="file" accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov" data-video-upload data-video-target="${target}" data-video-index="${attr(index)}" data-sub-video-index="${attr(blockIndex)}" />
    </label>
  `;
}
function handleEditorButton(button) {
  if (button.matches("[data-add-link]")) {
    syncFromEditor();
    siteData.profile.links.push({ label: "微信", href: "weixin://", icon: "wechat" });
    renderEditor();
  } else if (button.matches("[data-delete-link]")) {
    syncFromEditor();
    siteData.profile.links.splice(Number(button.dataset.deleteLink), 1);
    renderEditor();
  } else if (button.matches("[data-add-fact]")) {
    syncFromEditor();
    siteData.profile.facts.push({ value: "New", label: "说明" });
    renderEditor();
  } else if (button.matches("[data-delete-fact]")) {
    syncFromEditor();
    siteData.profile.facts.splice(Number(button.dataset.deleteFact), 1);
    renderEditor();
  } else if (button.matches("[data-add-keyword-group]")) {
    syncFromEditor();
    siteData.profile.keywords.push({ label: "新分组", items: ["关键词"] });
    renderEditor();
  } else if (button.matches("[data-delete-keyword-group]")) {
    syncFromEditor();
    siteData.profile.keywords.splice(Number(button.dataset.deleteKeywordGroup), 1);
    renderEditor();
  } else if (button.matches("[data-timeline-editor-tab]")) {
    syncFromEditor();
    currentTimelineEditorGroup = normalizeTimelineType(button.dataset.timelineEditorTab);
    renderEditor();
  } else if (button.matches("[data-add-timeline]")) {
    syncFromEditor();
    const type = normalizeTimelineType(button.dataset.addTimeline || currentTimelineEditorGroup);
    const label = timelineGroupLabels[type];
    currentTimelineEditorGroup = type;
    siteData.timeline.unshift({
      date: String(new Date().getFullYear()),
      title: `新${label}经历`,
      description: `1. 在这里写${label}经历的第一条内容。\n2. 在这里写第二条内容。`,
      tags: [label],
      type,
      order: getNextOrder(siteData.timeline.filter((item) => normalizeTimelineType(item.type) === type))
    });
    renderEditor();
  } else if (button.matches("[data-delete-timeline]")) {
    syncFromEditor();
    siteData.timeline.splice(Number(button.dataset.deleteTimeline), 1);
    renderEditor();
  } else if (button.matches("[data-add-project]")) {
    syncFromEditor();
    siteData.projects.unshift({
      title: "新作品",
      year: String(new Date().getFullYear()),
      role: "Designer / Developer",
      responsibility: "Designer / Developer",
      category: "design",
      engine: "UE5",
      language: "C++ / Blueprint",
      gameType: "Prototype",
      order: getNextOrder(siteData.projects),
      image: "assets/slash-preview.png",
      imageWidth: "",
      imageAspect: "16 / 9",
      imageFit: "cover",
      description: "在这里写作品简介。",
      tags: ["Prototype"]
    });
    renderEditor();
  } else if (button.matches("[data-delete-project]")) {
    syncFromEditor();
    siteData.projects.splice(Number(button.dataset.deleteProject), 1);
    renderEditor();
  } else if (button.matches("[data-add-project-tag]")) {
    syncFromEditor();
    const project = siteData.projects[Number(button.dataset.addProjectTag)];
    if (project) {
      project.tags = toTags(project.tags);
      project.tags.push("新标签");
    }
    renderEditor();
  } else if (button.matches("[data-delete-project-tag]")) {
    syncFromEditor();
    const [projectIndex, tagIndex] = button.dataset.deleteProjectTag.split(":").map(Number);
    const project = siteData.projects[projectIndex];
    if (project) {
      project.tags = toTags(project.tags);
      project.tags.splice(tagIndex, 1);
    }
    renderEditor();
  } else if (button.matches("[data-add-platform-game]")) {
    syncFromEditor();
    const platform = siteData.gamePlatforms[Number(button.dataset.addPlatformGame)];
    if (platform) {
      platform.games.push({ name: "新游戏", genres: ["未分类"], playtimeMinutes: 0, image: "" });
    }
    renderEditor();
  } else if (button.matches("[data-delete-platform-game]")) {
    syncFromEditor();
    const [platformIndex, gameIndex] = button.dataset.deletePlatformGame.split(":").map(Number);
    siteData.gamePlatforms[platformIndex]?.games?.splice(gameIndex, 1);
    renderEditor();
  } else if (button.matches("[data-add-section]")) {
    syncFromEditor();
    const nextNumber = siteData.customSections.length + 1;
    siteData.customSections.push({
      id: `custom-${Date.now()}`,
      navTitle: `页签${nextNumber}`,
      kicker: "Custom",
      title: "新的标题页签",
      body: ["在这里添加章节说明。"],
      layout: "cards",
      cards: [
        {
          order: 1,
          title: "新卡片",
          slug: "prototype-card",
          description: "在这里写卡片文本。",
          details: "设计目标\n1. 在这里写这个原型想验证的问题。\n2. 在这里写关键实现逻辑。\n3. 在这里写测试后的结论和下一步迭代。",
          detailBlocks: [
            { type: "text", order: 1, text: "设计目标\n1. 在这里写这个原型想验证的问题。\n2. 在这里写关键实现逻辑。" },
            { type: "image", order: 2, src: "assets/recovery-preview.png", caption: "原型截图", alt: "", imageWidth: "", imageAspect: "", imageFit: "contain" },
            { type: "text", order: 3, text: "测试结论\n1. 在这里写测试后的结论和下一步迭代。" }
          ],
          image: "assets/recovery-preview.png",
          imageWidth: "",
          imageAspect: "16 / 9",
          imageFit: "cover",
          tags: ["Prototype"]
        }
      ],
      images: []
    });
    renderEditor();
  } else if (button.matches("[data-delete-section]")) {
    syncFromEditor();
    siteData.customSections.splice(Number(button.dataset.deleteSection), 1);
    renderEditor();
  } else if (button.matches("[data-add-section-card]")) {
    syncFromEditor();
    const section = siteData.customSections[Number(button.dataset.addSectionCard)];
    if (section) {
      section.layout = "cards";
      section.cards = section.cards || [];
      section.cards.push({
        order: getNextOrder(section.cards),
        title: "新卡片",
        slug: `prototype-${Date.now()}`,
        description: "在这里写卡片文本。",
        details: "设计目标\n1. 在这里写这个原型想验证的问题。\n2. 在这里写关键实现逻辑。\n3. 在这里写测试后的结论和下一步迭代。",
        detailBlocks: [
          { type: "text", order: 1, text: "设计目标\n1. 在这里写这个原型想验证的问题。\n2. 在这里写关键实现逻辑。" },
          { type: "image", order: 2, src: "assets/recovery-preview.png", caption: "原型截图", alt: "", imageWidth: "", imageAspect: "", imageFit: "contain" },
          { type: "text", order: 3, text: "测试结论\n1. 在这里写测试后的结论和下一步迭代。" }
        ],
        image: "assets/recovery-preview.png",
        imageWidth: "",
        imageAspect: "16 / 9",
        imageFit: "cover",
        tags: ["Prototype"]
      });
    }
    renderEditor();
  } else if (button.matches("[data-delete-section-card]")) {
    syncFromEditor();
    const [sectionIndex, cardIndex] = button.dataset.deleteSectionCard.split(":").map(Number);
    siteData.customSections[sectionIndex]?.cards?.splice(cardIndex, 1);
    renderEditor();
  } else if (button.matches("[data-add-detail-block]")) {
    syncFromEditor();
    const [sectionIndex, cardIndex, type] = button.dataset.addDetailBlock.split(":");
    const card = getInlineCard(Number(sectionIndex), Number(cardIndex));
    if (card) {
      card.detailBlocks = normalizeDetailBlocks(card.detailBlocks, card.details || card.description);
      card.detailBlocks.push(createDetailBlock(type, getNextOrder(card.detailBlocks)));
      card.details = detailBlocksToText(card.detailBlocks);
    }
    renderEditor();
  } else if (button.matches("[data-delete-detail-block]")) {
    syncFromEditor();
    const [sectionIndex, cardIndex, blockIndex] = button.dataset.deleteDetailBlock.split(":").map(Number);
    const card = getInlineCard(sectionIndex, cardIndex);
    if (card) {
      card.detailBlocks = normalizeDetailBlocks(card.detailBlocks, card.details || card.description);
      card.detailBlocks.splice(blockIndex, 1);
      card.details = detailBlocksToText(card.detailBlocks);
    }
    renderEditor();
  } else if (button.matches("[data-add-section-card-tag]")) {
    syncFromEditor();
    const [sectionIndex, cardIndex] = button.dataset.addSectionCardTag.split(":").map(Number);
    const card = siteData.customSections[sectionIndex]?.cards?.[cardIndex];
    if (card) {
      card.tags = toTags(card.tags);
      card.tags.push("新标签");
    }
    renderEditor();
  } else if (button.matches("[data-delete-section-card-tag]")) {
    syncFromEditor();
    const [sectionIndex, cardIndex, tagIndex] = button.dataset.deleteSectionCardTag.split(":").map(Number);
    const card = siteData.customSections[sectionIndex]?.cards?.[cardIndex];
    if (card) {
      card.tags = toTags(card.tags);
      card.tags.splice(tagIndex, 1);
    }
    renderEditor();
  } else if (button.matches("[data-add-section-image]")) {
    syncFromEditor();
    const section = siteData.customSections[Number(button.dataset.addSectionImage)];
    section.images = section.images || [];
    section.images.push({ src: "assets/recovery-preview.png", caption: "图片说明", alt: "" });
    renderEditor();
  } else if (button.matches("[data-delete-section-image]")) {
    syncFromEditor();
    const [sectionIndex, imageIndex] = button.dataset.deleteSectionImage.split(":").map(Number);
    siteData.customSections[sectionIndex]?.images?.splice(imageIndex, 1);
    renderEditor();
  } else if (button.matches("[data-trigger-import]")) {
    document.querySelector("[data-dev-import]").click();
  } else if (button.matches("[data-reset-content]")) {
    if (confirm("确定恢复默认内容？当前浏览器保存的编辑会被清除。")) {
      localStorage.removeItem(STORAGE_KEY);
      siteData = cloneData(DEFAULT_SITE_DATA);
      renderAll();
      renderEditor();
      showToast("已恢复默认内容");
    }
  }
}

function collectDetailBlocks(cardRow) {
  return Array.from(cardRow.querySelectorAll("[data-detail-block-index]"))
    .map((blockRow, fallbackIndex) => {
      const type = blockRow.dataset.detailBlockType === "image" ? "image" : blockRow.dataset.detailBlockType === "document" ? "document" : blockRow.dataset.detailBlockType === "video" ? "video" : "text";
      const order = toOrder(blockRow.querySelector("[data-detail-block-field='order']")?.value, fallbackIndex + 1);

      if (type === "image") {
        return {
          type,
          order,
          src: blockRow.querySelector("[data-detail-block-field='src']")?.value.trim() || "",
          caption: blockRow.querySelector("[data-detail-block-field='caption']")?.value.trim() || "",
          alt: blockRow.querySelector("[data-detail-block-field='alt']")?.value.trim() || "",
          imageWidth: blockRow.querySelector("[data-detail-block-field='imageWidth']")?.value.trim() || "",
          imageAspect: "",
          imageFit: "contain"
        };
      }

      if (type === "document") {
        return {
          type,
          order,
          title: blockRow.querySelector("[data-detail-block-field='title']")?.value.trim() || "文档",
          src: blockRow.querySelector("[data-detail-block-field='src']")?.value.trim() || "",
          description: blockRow.querySelector("[data-detail-block-field='description']")?.value.trim() || "",
          fileName: blockRow.querySelector("[data-detail-block-field='fileName']")?.value.trim() || "",
          preview: "auto"
        };
      }

      if (type === "video") {
        return {
          type,
          order,
          title: blockRow.querySelector("[data-detail-block-field='title']")?.value.trim() || "视频",
          src: blockRow.querySelector("[data-detail-block-field='src']")?.value.trim() || "",
          description: blockRow.querySelector("[data-detail-block-field='description']")?.value.trim() || "",
          poster: blockRow.querySelector("[data-detail-block-field='poster']")?.value.trim() || "",
          fileName: "",
          controls: true,
          loop: true,
          muted: true,
          autoplay: false
        };
      }
      return {
        type,
        order,
        text: blockRow.querySelector("[data-detail-block-field='text']")?.value.trim() || "",
        textStyle: normalizeDetailTextStyle(blockRow.querySelector("[data-detail-block-field='textStyle']")?.value)
      };
    })
    .filter((block) => detailBlockHasContent(block));
}

function syncFromEditor() {
  const panel = document.querySelector("[data-dev-panel]");
  if (!panel || !panel.classList.contains("is-open")) return;
  siteData = collectEditorData();
}

function collectEditorData() {
  const next = normalizeData(siteData);
  const editorRoot = document.querySelector("[data-editor-body]") || document;

  const profileName = editorRoot.querySelector("#" + "profile-name");
  if (profileName) {
    next.profile.name = profileName.value.trim() || "你的名字";
    next.profile.initials = editorRoot.querySelector("#" + "profile-initials").value.trim() || "YY";
    next.profile.kicker = editorRoot.querySelector("#" + "profile-kicker").value.trim();
    next.profile.title = editorRoot.querySelector("#" + "profile-title").value.trim();
    next.profile.summary = editorRoot.querySelector("#" + "profile-summary").value.trim();
    next.profile.heroGreeting =
      editorRoot.querySelector("#" + "profile-hero-greeting")?.value.trim() ||
      `Hi，我是${next.profile.name}，很高兴遇见你，`;
    next.profile.heroStyle = normalizeHeroStyle({
      fontFamily: editorRoot.querySelector("#" + "profile-hero-font-family")?.value,
      headingSize: editorRoot.querySelector("#" + "profile-hero-heading-size")?.value,
      lineHeight: editorRoot.querySelector("#" + "profile-hero-line-height")?.value,
      headingWeight: editorRoot.querySelector("#" + "profile-hero-heading-weight")?.value,
      maxWidth: editorRoot.querySelector("#" + "profile-hero-max-width")?.value,
      titleSize: editorRoot.querySelector("#" + "profile-hero-title-size")?.value,
      titleLineHeight: editorRoot.querySelector("#" + "profile-hero-title-line-height")?.value,
      align: editorRoot.querySelector("#" + "profile-hero-align")?.value,
      nowrap: editorRoot.querySelector("#" + "profile-hero-nowrap")?.checked
    });
    next.profile.about = toParagraphs(editorRoot.querySelector("#" + "profile-about").value);
    next.profile.facts = Array.from(editorRoot.querySelectorAll("[data-fact-index]")).map((row) => ({
      value: row.querySelector("[data-fact-field='value']").value.trim(),
      label: row.querySelector("[data-fact-field='label']").value.trim()
    }));
    next.profile.keywords = Array.from(editorRoot.querySelectorAll("[data-keyword-index]")).map((row) => ({
      label: row.querySelector("[data-keyword-field='label']").value.trim() || "关键词",
      items: toTags(row.querySelector("[data-keyword-field='items']").value)
    }));
    next.profile.links = Array.from(editorRoot.querySelectorAll("[data-link-index]")).map((row) => ({
      label: row.querySelector("[data-link-field='label']").value.trim() || "联系方式",
      href: row.querySelector("[data-link-field='href']").value.trim(),
      icon: row.querySelector("[data-link-field='icon']").value,
      primary: row.querySelector("[data-link-field='primary']").checked
    }));
  }


  if (editorRoot.querySelector("[data-base-section-id]")) {
    next.sections = { ...next.sections };
    Array.from(editorRoot.querySelectorAll("[data-base-section-id]")).forEach((row) => {
      const id = row.dataset.baseSectionId;
      next.sections[id] = {
        nav: row.querySelector("[data-base-section-field='nav']").value.trim(),
        kicker: row.querySelector("[data-base-section-field='kicker']").value.trim(),
        title: row.querySelector("[data-base-section-field='title']").value.trim(),
        copy: row.querySelector("[data-base-section-field='copy']").value.trim()
      };
    });
  }

  if (editorRoot.querySelector("[data-timeline-panel]")) {
    const panel = editorRoot.querySelector("[data-timeline-panel]");
    const editedType = normalizeTimelineType(panel.dataset.timelinePanel || currentTimelineEditorGroup);
    const updatedTimeline = [...next.timeline];
    Array.from(editorRoot.querySelectorAll("[data-timeline-index]")).forEach((row) => {
      const index = Number(row.dataset.timelineIndex);
      updatedTimeline[index] = {
        order: toOrder(row.querySelector("[data-timeline-field='order']")?.value, index + 1),
        date: row.querySelector("[data-timeline-field='date']").value.trim(),
        title: row.querySelector("[data-timeline-field='title']").value.trim() || `未命名${timelineGroupLabels[editedType]}经历`,
        description: row.querySelector("[data-timeline-field='description']").value.trim(),
        tags: toTags(row.querySelector("[data-timeline-field='tags']").value),
        type: editedType
      };
    });
    next.timeline = updatedTimeline.filter(Boolean);
  }

  if (editorRoot.querySelector("[data-project-index]")) {
    const updatedProjects = [...next.projects];
    Array.from(editorRoot.querySelectorAll("[data-project-index]")).forEach((row) => {
      const index = Number(row.dataset.projectIndex);
      const responsibility = row.querySelector("[data-project-field='responsibility']").value.trim();
      const detailBlocks = collectDetailBlocks(row);
      updatedProjects[index] = {
        order: toOrder(row.querySelector("[data-project-field='order']")?.value, index + 1),
        slug: slugify(row.querySelector("[data-project-field='slug']")?.value.trim() || row.querySelector("[data-project-field='title']").value.trim() || `project-${index + 1}`),
        website: row.querySelector("[data-project-field='website']")?.value.trim() || "",
        title: row.querySelector("[data-project-field='title']").value.trim() || "未命名作品",
        year: row.querySelector("[data-project-field='year']").value.trim(),
        role: responsibility,
        responsibility,
        category: row.querySelector("[data-project-field='category']").value,
        engine: row.querySelector("[data-project-field='engine']").value.trim(),
        language: row.querySelector("[data-project-field='language']").value.trim(),
        gameType: row.querySelector("[data-project-field='gameType']").value.trim(),
        image: row.querySelector("[data-project-field='image']").value.trim(),
        imageWidth: row.querySelector("[data-project-field='imageWidth']")?.value.trim() || "",
        imageAspect: row.querySelector("[data-project-field='imageAspect']")?.value.trim() || "",
        imageFit: row.querySelector("[data-project-field='imageFit']")?.value.trim() || "cover",
        description: row.querySelector("[data-project-field='description']").value.trim(),
        details: detailBlocksToText(detailBlocks),
        detailBlocks,
        tags: Array.from(row.querySelectorAll("[data-project-tag-index]"))
          .map((tagRow) => tagRow.querySelector("[data-project-tag-field='value']").value.trim())
          .filter(Boolean)
      };
    });
    next.projects = updatedProjects.filter(Boolean);
  }

  if (editorRoot.querySelector("[data-platform-index]")) {
    next.gamePlatforms = Array.from(editorRoot.querySelectorAll("[data-platform-index]")).map((row) => ({
      id: slugify(row.querySelector("[data-platform-field='id']").value.trim() || row.querySelector("[data-platform-field='label']").value),
      label: row.querySelector("[data-platform-field='label']").value.trim() || "游戏平台",
      logo: row.querySelector("[data-platform-field='logo']").value.trim(),
      description: row.querySelector("[data-platform-field='description']").value.trim(),
      games: Array.from(row.querySelectorAll("[data-platform-game-index]")).map((gameRow) => ({
        name: gameRow.querySelector("[data-platform-game-field='name']").value.trim(),
        genres: toTags(gameRow.querySelector("[data-platform-game-field='genres']").value),
        playtimeHours: Number.parseFloat(gameRow.querySelector("[data-platform-game-field='playtimeHours']").value) || 0,
        image: gameRow.querySelector("[data-platform-game-field='image']").value.trim()
      })).filter((game) => game.name)
    }));
  }

  if (editorRoot.querySelector("[data-section-index]")) {
    next.customSections = Array.from(editorRoot.querySelectorAll("[data-section-index]")).map((row) => {
      const rawId = row.querySelector("[data-section-field='id']").value.trim();
      const section = {
        id: slugify(rawId || row.querySelector("[data-section-field='navTitle']").value || `custom-${Date.now()}`),
        navTitle: row.querySelector("[data-section-field='navTitle']").value.trim() || "新页签",
        kicker: row.querySelector("[data-section-field='kicker']").value.trim(),
        title: row.querySelector("[data-section-field='title']").value.trim(),
        body: toParagraphs(row.querySelector("[data-section-field='body']").value),
        layout: row.querySelector("[data-section-field='layout']")?.value.trim() || "",
        cards: [],
        images: []
      };

      const sourceSectionIndex = Number(row.dataset.sectionIndex);
      const existingCards = next.customSections[sourceSectionIndex]?.cards || [];
      const updatedCards = [...existingCards];
      Array.from(row.querySelectorAll("[data-section-card-index]")).forEach((cardRow, fallbackIndex) => {
        const cardIndex = Number(cardRow.dataset.sectionCardIndex);
        const targetIndex = Number.isFinite(cardIndex) ? cardIndex : fallbackIndex;
        const title = cardRow.querySelector("[data-section-card-field='title']").value.trim() || "未命名卡片";
        const detailBlocks = collectDetailBlocks(cardRow);
        updatedCards[targetIndex] = {
          order: toOrder(cardRow.querySelector("[data-section-card-field='order']")?.value, fallbackIndex + 1),
          title,
          slug: slugify(cardRow.querySelector("[data-section-card-field='slug']")?.value.trim() || title),
          description: cardRow.querySelector("[data-section-card-field='description']").value.trim(),
          details: detailBlocksToText(detailBlocks),
          detailBlocks,
          image: cardRow.querySelector("[data-section-card-field='image']").value.trim(),
          imageWidth: cardRow.querySelector("[data-section-card-field='imageWidth']")?.value.trim() || "",
          imageAspect: cardRow.querySelector("[data-section-card-field='imageAspect']")?.value.trim() || "",
          imageFit: cardRow.querySelector("[data-section-card-field='imageFit']")?.value.trim() || "cover",
          tags: Array.from(cardRow.querySelectorAll("[data-section-card-tag-index]"))
            .map((tagRow) => tagRow.querySelector("[data-section-card-tag-field='value']").value.trim())
            .filter(Boolean)
        };
      });
      section.cards = updatedCards.filter(Boolean);

      section.images = Array.from(row.querySelectorAll("[data-section-image-index]")).map((imageRow) => ({
        src: imageRow.querySelector("[data-section-image-field='src']").value.trim(),
        caption: imageRow.querySelector("[data-section-image-field='caption']").value.trim(),
        alt: imageRow.querySelector("[data-section-image-field='alt']").value.trim()
      }));

      return section;
    });
  }

  next.updatedAt = new Date().toISOString();
  return normalizeData(next);
}

function slugify(value) {
  const cleaned = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\u4e00-\u9fa5-]/g, "")
    .replace(/-+/g, "-");
  return cleaned || `custom-${Date.now()}`;
}

async function handleDocumentUpload(input) {
  const file = input.files?.[0];
  if (!file) return;

  try {
    const uploadedPath = await uploadAssetFile(file, "documents");
    const field = input.closest(".dev-field")?.querySelector("input:not([type='file'])");
    if (field) field.value = uploadedPath || await readFileAsDataUrl(file);

    const blockRow = input.closest("[data-detail-block-index]");
    const titleField = blockRow?.querySelector("[data-detail-block-field='title']");
    const fileNameField = blockRow?.querySelector("[data-detail-block-field='fileName']");
    if (titleField && !titleField.value.trim()) titleField.value = file.name.replace(/\.[^.]+$/, "");
    if (fileNameField) fileNameField.value = file.name;

    showToast(uploadedPath ? "文档已上传到 assets，点击保存后生效" : "文档已写入 JSON，点击保存后生效");
  } catch {
    showToast("文档读取失败");
  } finally {
    input.value = "";
  }
}

async function handleImageUpload(input) {
  const file = input.files?.[0];
  if (!file) return;

  try {
    const uploadedPath = await uploadAssetFile(file, "images");
    const isDetailImage = input.dataset.imageTarget === "detail-block";
    const isAnimatedGif = file.type === "image/gif" || file.name.toLowerCase().endsWith(".gif");
    const value = uploadedPath || (isDetailImage || isAnimatedGif
      ? await readFileAsDataUrl(file)
      : await imageFileToDataUrl(file, {
        maxWidth: 1600,
        quality: 0.84
      }));
    const field = input.closest(".dev-field")?.querySelector("input:not([type='file'])");
    if (field) {
      field.value = value;
      showToast(uploadedPath ? "图片已上传到 assets，点击保存后生效" : "图片已写入 JSON，点击保存后生效");
    }
  } catch {
    showToast("图片读取失败");
  } finally {
    input.value = "";
  }
}

async function handleVideoUpload(input) {
  const file = input.files?.[0];
  if (!file) return;

  try {
    const uploadedPath = await uploadAssetFile(file, "videos");
    const field = input.closest(".dev-field")?.querySelector("input:not([type='file'])");
    if (field && uploadedPath) field.value = uploadedPath;
    showToast(uploadedPath ? "视频已上传到 assets，点击保存后生效" : "视频上传失败，请检查格式或大小");
  } catch {
    showToast("视频上传失败");
  } finally {
    input.value = "";
  }
}
async function imageFileToDataUrl(file, options = {}) {
  if (options.preserveOriginal && file.size <= (options.originalLimit || 0)) {
    return readFileAsDataUrl(file);
  }

  const source = await readFileAsDataUrl(file);
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onerror = reject;
    image.onload = () => {
      const maxWidth = options.maxWidth || 1600;
      const scale = Math.min(1, maxWidth / image.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext("2d");
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", options.quality || 0.84));
    };
    image.src = source;
  });
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

function saveLocalPreviewData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.warn("Local preview save failed. The server save may still be valid.", error);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore cleanup failures; the server save result is the source of truth.
    }
    return false;
  }
}

async function saveCurrentContent() {
  debugLog("save", "start", debugRouteState());
  syncInlineEditsFromDom();
  syncFromEditor();
  const serverSaved = await saveServerData(siteData);
  const localSaved = serverSaved ? false : saveLocalPreviewData(siteData);
  debugLog("save", "data saved", { serverSaved, localSaved, updatedAt: siteData.updatedAt });

  if (serverSaved) {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // content.json has already been saved.
    }
  }

  try {
    renderAll();
    renderEditor();
    correctBlankPrototypeViewport("after-save-render");
    debugLog("save", "render after save complete", debugRouteState());
  } catch (error) {
    debugLog("save", "render after save failed", { error: debugString(error), ...debugRouteState() }, "error");
    showToast("保存后渲染失败：请打开日志查看原因");
    openDebugLogPanel();
    return;
  }

  if (serverSaved) {
    showToast("已保存到 content.json");
  } else {
    showToast(localSaved ? "已保存到当前浏览器，可导出 JSON" : "保存失败：图片数据过大，请压缩图片或导出 JSON");
  }
}
function exportCurrentContent() {
  syncFromEditor();
  const blob = new Blob([JSON.stringify(siteData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "portfolio-content.json";
  link.click();
  URL.revokeObjectURL(url);
}

function importContentFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      siteData = normalizeData(JSON.parse(String(reader.result)));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(siteData));
      renderAll();
      renderEditor();
      showToast("JSON 已导入");
    } catch {
      showToast("JSON 格式不正确");
    }
  };
  reader.readAsText(file, "utf-8");
  event.target.value = "";
}

function showToast(message) {
  const toast = document.querySelector("[data-dev-toast]");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2600);
}

async function init() {
  setupDebugCapture();
  siteData = await loadInitialData();
  renderAll();
  setupFilters();
  setupTimelineTabs();
  setupTheme();
  setupDevMode();
  setupPrototypeDetailRoutes();
  observeReveals();
  setupParticleCanvas();
  debugLog("init", "ready", {
    ...debugRouteState(),
    ...debugDataState()
  });
}

init();
