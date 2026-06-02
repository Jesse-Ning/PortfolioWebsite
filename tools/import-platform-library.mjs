#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const contentPath = path.join(root, "content.json");

const platformDefaults = {
  playstation: {
    id: "playstation",
    label: "PlayStation",
    logo: "playstation",
    description: "这里预留给 PlayStation 游戏。你可以先添加名字、类型和游玩时间，封面后续再补。"
  },
  nintendo: {
    id: "nintendo",
    label: "Nintendo",
    logo: "nintendo",
    description: "这里预留给 Nintendo 游戏。你可以先添加名字、类型和游玩时间，封面后续再补。"
  }
};

async function ask(question, fallback = "") {
  const rl = readline.createInterface({ input, output });
  const suffix = fallback ? ` [${fallback}]` : "";
  const answer = (await rl.question(`${question}${suffix}: `)).trim();
  rl.close();
  return answer || fallback;
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\u4e00-\u9fa5-]/g, "")
    .replace(/-+/g, "-") || "platform";
}

function splitList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  return String(value || "")
    .split(/[,，、;；\n]/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseHours(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, value);
  }
  const text = String(value || "").replace(/,/g, "").trim();
  if (!text) return 0;
  const match = text.match(/(\d+(?:\.\d+)?)/);
  return match ? Math.max(0, Number(match[1])) : 0;
}

function normalizeGame(game) {
  if (typeof game === "string") {
    return { name: game.trim(), image: "", genres: [], playtimeMinutes: 0 };
  }

  const source = game && typeof game === "object" ? game : {};
  const name = String(source.name || source.title || source.gameTitle || source.label || "").trim();
  const minutes = Number(source.playtimeMinutes ?? source.minutes ?? 0);
  const hours = parseHours(source.playtimeHours ?? source.hours ?? source.playtime ?? source.time);

  return {
    name,
    image: String(source.image || source.cover || source.coverUrl || source.imageUrl || source.src || "").trim(),
    genres: splitList(source.genres || source.genre || source.type || source.types),
    playtimeMinutes: Number.isFinite(minutes) && minutes > 0 ? Math.round(minutes) : Math.round(hours * 60)
  };
}

function parseCsvLine(line) {
  const parts = line.split(/\t|,/).map((part) => part.trim()).filter(Boolean);
  return {
    name: parts[0] || "",
    genres: splitList(parts[1] || ""),
    playtimeHours: parseHours(parts[2] || ""),
    image: parts[3] || ""
  };
}

function parseInput(raw) {
  const text = raw.replace(/^\uFEFF/, "").trim();
  if (!text) return [];

  try {
    const data = JSON.parse(text);
    const games = Array.isArray(data) ? data : data.games || data.items || data.library || [];
    return games.map(normalizeGame).filter((game) => game.name);
  } catch {
    return text
      .split(/\r?\n/g)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => normalizeGame(parseCsvLine(line)))
      .filter((game) => game.name);
  }
}

function mergeGames(existingGames, importedGames) {
  const result = Array.isArray(existingGames) ? [...existingGames] : [];
  const indexByName = new Map(result.map((game, index) => [String(game.name || "").trim().toLowerCase(), index]));

  importedGames.forEach((game) => {
    const key = game.name.toLowerCase();
    const existingIndex = indexByName.get(key);
    if (existingIndex === undefined) {
      indexByName.set(key, result.length);
      result.push(game);
      return;
    }

    const existing = result[existingIndex];
    result[existingIndex] = {
      ...existing,
      ...game,
      image: game.image || existing.image || "",
      genres: game.genres.length ? game.genres : splitList(existing.genres),
      playtimeMinutes: game.playtimeMinutes || Number(existing.playtimeMinutes || 0)
    };
  });

  return result;
}

async function writeJsonAtomic(targetPath, value) {
  const tempPath = `${targetPath}.${Date.now()}.tmp`;
  await fs.writeFile(tempPath, value, "utf8");
  await fs.rename(tempPath, targetPath);
}

async function main() {
  const platformArg = (process.argv[2] || await ask("Platform", "playstation")).toLowerCase();
  const platformId = platformArg.includes("nintendo") ? "nintendo" : "playstation";
  const fallbackFile = platformId === "nintendo" ? "nintendo-library.json" : "playstation-library.json";
  const sourceArg = process.argv[3] || await ask("Source file", fallbackFile);
  const sourcePath = path.isAbsolute(sourceArg) ? sourceArg : path.join(root, sourceArg);

  const raw = await fs.readFile(sourcePath, "utf8");
  const importedGames = parseInput(raw);
  if (!importedGames.length) {
    throw new Error("No games found in the source file.");
  }

  const content = JSON.parse(await fs.readFile(contentPath, "utf8"));
  content.gamePlatforms = Array.isArray(content.gamePlatforms) ? content.gamePlatforms : [];

  const defaults = platformDefaults[platformId];
  let platform = content.gamePlatforms.find((item) => item.id === platformId);
  if (!platform) {
    platform = { ...defaults, games: [] };
    content.gamePlatforms.push(platform);
  }

  platform.id = platform.id || defaults.id;
  platform.label = platform.label || defaults.label;
  platform.logo = platform.logo || defaults.logo;
  platform.description = platform.description || defaults.description;
  platform.games = mergeGames(platform.games, importedGames);
  content.updatedAt = new Date().toISOString();

  await writeJsonAtomic(contentPath, JSON.stringify(content, null, 2) + "\n");

  console.log(`Imported ${importedGames.length} ${platform.label} games.`);
  console.log(`${platform.label} module now has ${platform.games.length} games.`);
  console.log("Next: run PublishToGitHub.bat when you are ready to publish.");
}

main().catch((error) => {
  console.error(`\nImport failed: ${error.message}`);
  process.exitCode = 1;
});
