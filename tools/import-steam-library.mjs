#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const contentPath = path.join(root, "content.json");
const defaultSteamId = "76561198819812464";
const storeDelayMs = 220;

function minutesToHours(minutes) {
  return Math.round((Number(minutes || 0) / 60) * 10) / 10;
}

function steamHeader(appid) {
  return `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/header.jpg`;
}

async function ask(question, fallback = "") {
  const rl = readline.createInterface({ input, output });
  const suffix = fallback ? ` [${fallback}]` : "";
  const answer = (await rl.question(`${question}${suffix}: `)).trim();
  rl.close();
  return answer || fallback;
}

async function fetchJson(url, label) {
  const response = await fetch(url, {
    headers: {
      "Accept": "application/json",
      "User-Agent": "PortfolioSteamImporter/1.0"
    }
  });
  if (!response.ok) {
    throw new Error(`${label} failed: HTTP ${response.status} ${response.statusText}`);
  }
  return response.json();
}

async function getOwnedGames(apiKey, steamId) {
  const params = new URLSearchParams({
    key: apiKey,
    steamid: steamId,
    include_appinfo: "true",
    include_played_free_games: "true",
    format: "json"
  });
  const data = await fetchJson(`https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?${params}`, "GetOwnedGames");
  return data?.response?.games || [];
}

async function getStoreDetails(appid) {
  const params = new URLSearchParams({
    appids: String(appid),
    cc: "cn",
    l: "schinese",
    filters: "basic,genres"
  });
  const data = await fetchJson(`https://store.steampowered.com/api/appdetails?${params}`, `AppDetails ${appid}`);
  const item = data?.[appid];
  return item?.success ? item.data : null;
}

function compactGame(game, details) {
  const genres = Array.isArray(details?.genres) ? details.genres.map((genre) => genre.description).filter(Boolean) : [];
  return {
    appid: Number(game.appid),
    name: details?.name || game.name || `App ${game.appid}`,
    image: details?.header_image || steamHeader(game.appid),
    genres,
    playtimeMinutes: Number(game.playtime_forever || 0),
    playtimeRecentMinutes: Number(game.playtime_2weeks || 0),
    playtimeHours: minutesToHours(game.playtime_forever),
    storeUrl: `https://store.steampowered.com/app/${game.appid}/`
  };
}

async function main() {
  const existing = JSON.parse(await fs.readFile(contentPath, "utf8"));
  const currentSteamId = existing?.steamLibrary?.steamId || defaultSteamId;
  const steamId = await ask("SteamID64", process.env.STEAM_ID || currentSteamId);
  const apiKey = process.env.STEAM_API_KEY || await ask("Steam Web API Key");
  if (!apiKey) {
    throw new Error("Steam Web API Key is required.");
  }

  console.log("\nReading Steam library...");
  const owned = await getOwnedGames(apiKey, steamId);
  if (!owned.length) {
    throw new Error("No games returned. Check that the API key is valid and Game Details is public.");
  }

  owned.sort((left, right) => Number(right.playtime_forever || 0) - Number(left.playtime_forever || 0));
  const total = owned.length;
  const imported = [];

  for (let index = 0; index < owned.length; index += 1) {
    const game = owned[index];
    let details = null;
    try {
      details = await getStoreDetails(game.appid);
    } catch (error) {
      console.warn(`Store details skipped for ${game.name || game.appid}: ${error.message}`);
    }
    imported.push(compactGame(game, details));
    console.log(`[${index + 1}/${total}] ${imported[index].name}`);
    await new Promise((resolve) => setTimeout(resolve, storeDelayMs));
  }

  existing.steamLibrary = {
    steamId,
    profileUrl: `https://steamcommunity.com/profiles/${steamId}/`,
    updatedAt: new Date().toISOString(),
    games: imported
  };
  existing.sections = existing.sections || {};
  existing.sections.steam = existing.sections.steam || {
    nav: "游戏库",
    kicker: "Steam Library",
    title: "游戏库",
    copy: "这些游戏记录了我的游玩兴趣、类型偏好和长期体验积累。"
  };
  existing.updatedAt = new Date().toISOString();

  await fs.writeFile(contentPath, JSON.stringify(existing, null, 2) + "\n", "utf8");
  console.log(`\nDone. Imported ${imported.length} games into content.json.`);
  console.log("Next: run PublishToGitHub.bat to publish the updated library.");
}

main().catch((error) => {
  console.error(`\nImport failed: ${error.message}`);
  process.exitCode = 1;
});
