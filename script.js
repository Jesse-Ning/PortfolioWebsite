const STORAGE_KEY = "portfolio-site-data-v1";
const DEV_MODE_KEY = "portfolio-dev-mode";

const DEFAULT_SITE_DATA = {
  updatedAt: "2026-05-30T00:00:00.000Z",
  sections: {
    about: { nav: "介绍", kicker: "Personal Introduction", title: "个人介绍", copy: "" },
    experience: { nav: "经历", kicker: "Experience & Education", title: "经历与学习", copy: "" },
    projects: { nav: "作品", kicker: "Selected Work", title: "个人作品", copy: "" },
    steam: { nav: "游戏库", kicker: "Steam Library", title: "游戏库", copy: "这些游戏记录了我的游玩兴趣、类型偏好和长期体验积累。" },
    contact: { nav: "联系", kicker: "Contact", title: "一起聊聊游戏设计与战斗系统", copy: "" }
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
      { label: "软件", items: ["Unreal Engine 5", "Unity", "Blender", "Git"] }
    ],
    links: [
      { label: "Email", href: "mailto:yourname@example.com", icon: "mail", primary: true },
      { label: "微信", href: "weixin://", icon: "wechat" },
      { label: "电话", href: "tel:+86-000-0000-0000", icon: "phone" },
      { label: "GitHub", href: "https://github.com/", icon: "github" },
      { label: "Bilibili", href: "https://space.bilibili.com/", icon: "video" },
      { label: "Steam", href: "https://steamcommunity.com/", icon: "gamepad" }
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

const timelineGroups = [
  { id: "education", label: "教育", empty: "还没有添加教育经历。" },
  { id: "work", label: "工作", empty: "还没有添加工作经历。" }
];

const timelineGroupLabels = {
  education: "教育",
  work: "工作"
};

let siteData = cloneData(DEFAULT_SITE_DATA);
let activeProjectFilter = "all";
let activeTimelineGroup = "work";
let revealObserver;
let scrollSpy;
let currentEditorTab = "profile";
let currentTimelineEditorGroup = "work";

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
    description: String(item.description || "").trim(),
    tags: toTags(item.tags),
    order: orderValue(item, index)
  };
}

function normalizeProjects(projects) {
  return (Array.isArray(projects) ? projects : []).map((project, index) => normalizeProject(project, index));
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

function renderTimelineDescription(value) {
  const items = splitTimelineItems(value);
  if (!items.length) return "";

  return `
    <ol class="timeline-points">
      ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
    </ol>
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
    profile: {
      ...fallback.profile,
      ...(source.profile || {}),
      about: toParagraphs(source.profile?.about || fallback.profile.about),
      facts: Array.isArray(source.profile?.facts) ? source.profile.facts : fallback.profile.facts,
      keywords: normalizeKeywordGroups(source.profile?.keywords || fallback.profile.keywords),
      links: Array.isArray(source.profile?.links) ? source.profile.links : fallback.profile.links
    },
    timeline: normalizeTimeline(Array.isArray(source.timeline) ? source.timeline : fallback.timeline),
    projects: normalizeProjects(Array.isArray(source.projects) ? source.projects : fallback.projects),
    steamLibrary: normalizeSteamLibrary(source.steamLibrary || fallback.steamLibrary),
    research: Array.isArray(source.research) ? source.research : fallback.research,
    customSections: Array.isArray(source.customSections) ? source.customSections : []
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

  return merged;
}

async function loadInitialData() {
  const localData = readLocalData();
  const serverData = await readServerData();

  if (localData) {
    const mergedLocalData = mergePublishedAdditions(localData, serverData);
    if (isDevModeRequested() || !serverData || isNewer(mergedLocalData, serverData)) {
      return normalizeData(mergedLocalData);
    }
  }

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
  setupScrollSpy();
  observeReveals();
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
  const mainItems = baseItems.filter((item) => item.id !== "contact");
  const navItems = [...mainItems, ...customItems, contactItem].filter(Boolean);

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

function isSoftwareKeywordGroup(group) {
  const label = String(group?.label || "").trim();
  return label === "软件" || /software/i.test(label);
}

function getSoftwareIcon(item) {
  const label = String(item || "").trim();
  if (!label) return null;

  const match = softwareIconMap.find((entry) => entry.pattern.test(label));
  if (!match) return null;

  return {
    label,
    src: "assets/software-icons/" + match.slug + ".svg"
  };
}

function renderProfileKeywordGroup(group) {
  const items = toTags(group.items);
  const softwareGroup = isSoftwareKeywordGroup(group);

  return `
    <article class="keyword-group${softwareGroup ? " is-software" : ""} reveal">
      <h3>${escapeHtml(group.label)}</h3>
      ${softwareGroup ? renderSoftwareIconList(items) : renderKeywordChipList(items)}
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

function renderSoftwareIconList(items) {
  return `
    <div class="software-icon-list">
      ${items.map(renderSoftwareIconItem).join("")}
    </div>
  `;
}

function renderSoftwareIconItem(item) {
  const iconData = getSoftwareIcon(item);
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
  const href = String(link.href || "#").trim() || "#";
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
  document.title = `${profile.name} | Personal Portfolio`;
  setText("[data-profile-name]", profile.name);
  setText("[data-profile-initials]", profile.initials);
  setText("[data-profile-kicker]", profile.kicker);
  setText("[data-profile-title]", profile.title);
  setText("[data-profile-summary]", profile.summary);
  setText("[data-current-year]", new Date().getFullYear());

  document.getElementById("about-copy").innerHTML = profile.about
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
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
    <article class="timeline-item reveal${featured ? " is-featured" : ""}${isCurrentTimelineItem(item) ? " is-current" : ""}">
      <div class="timeline-date">${escapeHtml(item.date)}</div>
      <div class="timeline-card">
        <h3>${escapeHtml(item.title)}</h3>
        ${renderTimelineDescription(item.description)}
        <div class="tag-row">${toTags(item.tags).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
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
        <article class="project-card reveal${isFeatured(project, project.index) ? " is-featured" : ""}">
          <div class="project-media">
            <img src="${attr(project.image)}" alt="${attr(project.title)}" loading="lazy" />
          </div>
          <div class="project-body">
            <div class="project-meta">
              <span>${escapeHtml(project.year)}</span>
              <span>排序 ${escapeHtml(orderValue(project, project.index))}</span>
            </div>
            <h3>${escapeHtml(project.title)}</h3>
            <p>${escapeHtml(project.description)}</p>
            <div class="project-keywords">
              ${renderProjectKeyword("引擎", project.engine, true)}
              ${renderProjectKeyword("职责", project.responsibility || project.role, true)}
              ${renderProjectKeyword("语言", project.language, false)}
              ${renderProjectKeyword("类型", project.gameType, false)}
            </div>
            ${renderProjectTags(project)}
          </div>
        </article>
      `
    )
    .join("");
}

function renderProjectKeyword(label, value, primary = false) {
  if (!String(value || "").trim()) return "";
  return `
    <div class="project-keyword${primary ? " is-primary" : ""}">
      <span class="project-keyword-label">${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `;
}

function renderProjectTags(project) {
  const tags = toTags(project.tags);
  if (!tags.length) return "";
  return `<div class="tag-row project-extra-tags">${tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>`;
}

function renderSteamLibrary() {
  const library = siteData.steamLibrary;
  const games = getOrderedSteamGames();
  const summary = document.getElementById("steam-summary");
  const grid = document.getElementById("steam-library-grid");
  if (!summary || !grid) return;

  const totalMinutes = games.reduce((sum, game) => sum + Number(game.playtimeMinutes || 0), 0);
  summary.innerHTML = `
    <article>
      <strong>${escapeHtml(games.length)}</strong>
      <span>已导入游戏</span>
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

  grid.innerHTML = games.length
    ? games.map(renderSteamGameCard).join("")
    : `<div class="steam-empty reveal">还没有导入 Steam 游戏库。运行 ImportSteamLibrary.bat 后，这里会显示游戏名字、图片、类型和游玩时间。</div>`;
}

function renderSteamGameCard(game) {
  const genres = toTags(game.genres);
  return `
    <article class="steam-card reveal">
      <div class="steam-media">
        <img src="${attr(game.image)}" alt="${attr(game.name)}" loading="lazy" />
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
  host.innerHTML = siteData.customSections
    .map(
      (section, index) => `
        <section class="section-band custom-section" id="${attr(section.id)}">
          <div class="section-inner custom-section-grid">
            <div>
              <p class="section-kicker">${escapeHtml(section.kicker || "Custom Section")}</p>
              <h2>${escapeHtml(section.title || section.navTitle || "新页签")}</h2>
              <div class="copy-stack">
                ${toParagraphs(section.body).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
              </div>
            </div>
            ${renderSectionImages(section.images || [], index)}
          </div>
        </section>
      `
    )
    .join("");
}

function renderSectionImages(images) {
  if (!images.length) {
    return "";
  }

  return `
    <div class="section-media-grid">
      ${images
        .map(
          (image) => `
            <figure class="section-media-item reveal">
              <img src="${attr(image.src)}" alt="${attr(image.alt || image.caption || "section image")}" loading="lazy" />
              ${image.caption ? `<figcaption>${escapeHtml(image.caption)}</figcaption>` : ""}
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
        <span>编辑</span>
      </button>
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
    }
  });
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
    sections: renderSectionsEditor,
    data: renderDataEditor
  };
  body.innerHTML = renderers[currentEditorTab]();
}

function renderProfileEditor() {
  const profile = siteData.profile;
  return `
    <div class="dev-form-grid">
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
        ${field("年份", "project-year", project.year, `data-project-field="year"`)}
        ${selectField("分类", "project-category", project.category, `data-project-field="category"`)}
        ${field("引擎", "project-engine", project.engine, `data-project-field="engine"`)}
        ${field("我的职责", "project-responsibility", project.responsibility || project.role, `data-project-field="responsibility"`)}
        ${field("编程语言", "project-language", project.language, `data-project-field="language"`)}
        ${field("游戏类型", "project-game-type", project.gameType, `data-project-field="gameType"`)}
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
        ${textarea("正文", "section-body", toParagraphs(section.body).join("\\n\\n"), 7, `data-section-field="body"`)}
      </div>
      <div class="dev-section-head nested">
        <h4>图片</h4>
        <button class="dev-small-button" type="button" data-add-section-image="${index}">${icon("plus")}添加图片</button>
      </div>
      <div class="dev-list nested">
        ${(section.images || []).map((image, imageIndex) => renderSectionImageEditor(image, index, imageIndex)).join("")}
      </div>
    </article>
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
      <span class="dev-help">可以填 assets/example.png、https 图片地址，或选择本地图片。</span>
      <input id="${attr(imageInputId)}" type="file" accept="image/*" data-image-upload data-image-target="${target}" data-image-index="${attr(index)}" data-sub-image-index="${attr(imageIndex)}" />
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
  } else if (button.matches("[data-add-section]")) {
    syncFromEditor();
    const nextNumber = siteData.customSections.length + 1;
    siteData.customSections.push({
      id: `custom-${Date.now()}`,
      navTitle: `页签${nextNumber}`,
      kicker: "Custom",
      title: "新的标题页签",
      body: ["在这里添加正文。"],
      images: []
    });
    renderEditor();
  } else if (button.matches("[data-delete-section]")) {
    syncFromEditor();
    siteData.customSections.splice(Number(button.dataset.deleteSection), 1);
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

function syncFromEditor() {
  const panel = document.querySelector("[data-dev-panel]");
  if (!panel) return;
  siteData = collectEditorData();
}

function collectEditorData() {
  const next = normalizeData(siteData);

  const profileName = document.getElementById("profile-name");
  if (profileName) {
    next.profile.name = profileName.value.trim() || "你的名字";
    next.profile.initials = document.getElementById("profile-initials").value.trim() || "YY";
    next.profile.kicker = document.getElementById("profile-kicker").value.trim();
    next.profile.title = document.getElementById("profile-title").value.trim();
    next.profile.summary = document.getElementById("profile-summary").value.trim();
    next.profile.about = toParagraphs(document.getElementById("profile-about").value);
    next.profile.facts = Array.from(document.querySelectorAll("[data-fact-index]")).map((row) => ({
      value: row.querySelector("[data-fact-field='value']").value.trim(),
      label: row.querySelector("[data-fact-field='label']").value.trim()
    }));
    next.profile.keywords = Array.from(document.querySelectorAll("[data-keyword-index]")).map((row) => ({
      label: row.querySelector("[data-keyword-field='label']").value.trim() || "关键词",
      items: toTags(row.querySelector("[data-keyword-field='items']").value)
    }));
    next.profile.links = Array.from(document.querySelectorAll("[data-link-index]")).map((row) => ({
      label: row.querySelector("[data-link-field='label']").value.trim() || "联系方式",
      href: row.querySelector("[data-link-field='href']").value.trim(),
      icon: row.querySelector("[data-link-field='icon']").value,
      primary: row.querySelector("[data-link-field='primary']").checked
    }));
  }


  if (document.querySelector("[data-base-section-id]")) {
    next.sections = { ...next.sections };
    Array.from(document.querySelectorAll("[data-base-section-id]")).forEach((row) => {
      const id = row.dataset.baseSectionId;
      next.sections[id] = {
        nav: row.querySelector("[data-base-section-field='nav']").value.trim(),
        kicker: row.querySelector("[data-base-section-field='kicker']").value.trim(),
        title: row.querySelector("[data-base-section-field='title']").value.trim(),
        copy: row.querySelector("[data-base-section-field='copy']").value.trim()
      };
    });
  }

  if (document.querySelector("[data-timeline-panel]")) {
    const panel = document.querySelector("[data-timeline-panel]");
    const editedType = normalizeTimelineType(panel.dataset.timelinePanel || currentTimelineEditorGroup);
    const updatedTimeline = [...next.timeline];
    Array.from(document.querySelectorAll("[data-timeline-index]")).forEach((row) => {
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

  if (document.querySelector("[data-project-index]")) {
    const updatedProjects = [...next.projects];
    Array.from(document.querySelectorAll("[data-project-index]")).forEach((row) => {
      const index = Number(row.dataset.projectIndex);
      const responsibility = row.querySelector("[data-project-field='responsibility']").value.trim();
      updatedProjects[index] = {
        order: toOrder(row.querySelector("[data-project-field='order']")?.value, index + 1),
        title: row.querySelector("[data-project-field='title']").value.trim() || "未命名作品",
        year: row.querySelector("[data-project-field='year']").value.trim(),
        role: responsibility,
        responsibility,
        category: row.querySelector("[data-project-field='category']").value,
        engine: row.querySelector("[data-project-field='engine']").value.trim(),
        language: row.querySelector("[data-project-field='language']").value.trim(),
        gameType: row.querySelector("[data-project-field='gameType']").value.trim(),
        image: row.querySelector("[data-project-field='image']").value.trim(),
        description: row.querySelector("[data-project-field='description']").value.trim(),
        tags: Array.from(row.querySelectorAll("[data-project-tag-index]"))
          .map((tagRow) => tagRow.querySelector("[data-project-tag-field='value']").value.trim())
          .filter(Boolean)
      };
    });
    next.projects = updatedProjects.filter(Boolean);
  }

  if (document.querySelector("[data-section-index]")) {
    next.customSections = Array.from(document.querySelectorAll("[data-section-index]")).map((row) => {
      const rawId = row.querySelector("[data-section-field='id']").value.trim();
      const section = {
        id: slugify(rawId || row.querySelector("[data-section-field='navTitle']").value || `custom-${Date.now()}`),
        navTitle: row.querySelector("[data-section-field='navTitle']").value.trim() || "新页签",
        kicker: row.querySelector("[data-section-field='kicker']").value.trim(),
        title: row.querySelector("[data-section-field='title']").value.trim(),
        body: toParagraphs(row.querySelector("[data-section-field='body']").value),
        images: []
      };

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

async function handleImageUpload(input) {
  const file = input.files?.[0];
  if (!file) return;

  try {
    const dataUrl = await imageFileToDataUrl(file);
    const field = input.closest(".dev-field")?.querySelector("input:not([type='file'])");
    if (field) {
      field.value = dataUrl;
      showToast("图片已载入，点击保存后生效");
    }
  } catch {
    showToast("图片读取失败");
  } finally {
    input.value = "";
  }
}

function imageFileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const image = new Image();
      image.onerror = reject;
      image.onload = () => {
        const maxWidth = 1600;
        const scale = Math.min(1, maxWidth / image.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.84));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

async function saveCurrentContent() {
  syncFromEditor();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(siteData));
  const serverSaved = await saveServerData(siteData);
  renderAll();
  renderEditor();
  showToast(serverSaved ? "已保存到 content.json" : "已保存到当前浏览器，可导出 JSON");
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
  siteData = await loadInitialData();
  renderAll();
  setupFilters();
  setupTimelineTabs();
  setupTheme();
  setupDevMode();
  observeReveals();
  setupParticleCanvas();
}

init();
