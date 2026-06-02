#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile as execFileCallback } from "node:child_process";
import { promisify } from "node:util";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const contentPath = path.join(root, "content.json");
const batchSize = 1;
const batchDelayMs = 300;
const fallbackDelayMs = 420;
const singleRequestDelayMs = 220;
const requestTimeoutMs = 18000;
const useSteamSpyFallback = false;
const execFile = promisify(execFileCallback);

function steamHeader(appid) {
  return `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/header.jpg`;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function readContent() {
  return JSON.parse(await fs.readFile(contentPath, "utf8"));
}

async function writeJsonAtomic(targetPath, value) {
  const tempPath = `${targetPath}.${Date.now()}.tmp`;
  await fs.writeFile(tempPath, value, "utf8");
  await fs.rename(tempPath, targetPath);
}

async function writeContent(content) {
  content.steamLibrary.updatedAt = new Date().toISOString();
  content.updatedAt = new Date().toISOString();
  await writeJsonAtomic(contentPath, JSON.stringify(content, null, 2) + "\n");
}

async function fetchJson(url, label) {
  try {
    return await fetchJsonWithNode(url);
  } catch (nodeError) {
    try {
      return await fetchJsonWithPowerShell(url);
    } catch (fallbackError) {
      throw new Error(`${label} failed: ${nodeError.message}; PowerShell fallback: ${fallbackError.message}`);
    }
  }
}

async function fetchJsonWithNode(url) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(requestTimeoutMs),
    headers: {
      "Accept": "application/json",
      "User-Agent": "Mozilla/5.0 PortfolioSteamDetailsRefresher/1.2"
    }
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }
  return response.json();
}

async function fetchJsonWithPowerShell(url) {
  const command = "$ProgressPreference='SilentlyContinue'; $url=[Environment]::GetEnvironmentVariable('STEAM_FETCH_URL'); (Invoke-WebRequest -UseBasicParsing -Uri $url -TimeoutSec 18).Content";
  const { stdout } = await execFile("powershell.exe", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", command], {
    env: { ...process.env, STEAM_FETCH_URL: url },
    windowsHide: true,
    maxBuffer: 32 * 1024 * 1024
  });
  return JSON.parse(stdout);
}

async function getStoreDetailsBatch(appids) {
  const params = new URLSearchParams({
    appids: appids.join(","),
    cc: "cn",
    l: "schinese",
    filters: "basic,genres,categories"
  });
  return fetchJson(`https://store.steampowered.com/api/appdetails?${params}`, `AppDetails batch ${appids[0]}`);
}

async function getStoreDetailsSingle(appid) {
  const params = new URLSearchParams({
    appids: String(appid),
    cc: "cn",
    l: "schinese",
    filters: "basic,genres,categories"
  });
  const data = await fetchJson(`https://store.steampowered.com/api/appdetails?${params}`, `AppDetails ${appid}`);
  const item = data?.[appid];
  return item?.success ? item.data : null;
}

async function getSteamSpyGenres(appid) {
  const params = new URLSearchParams({
    request: "appdetails",
    appid: String(appid)
  });
  const data = await fetchJson(`https://steamspy.com/api.php?${params}`, `SteamSpy ${appid}`);
  return String(data?.genre || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function genreNames(details) {
  return Array.isArray(details?.genres)
    ? details.genres.map((genre) => genre.description).filter(Boolean)
    : [];
}

function needsDetails(game) {
  const genres = Array.isArray(game.genres) ? game.genres.filter(Boolean) : [];
  return !genres.length;
}

function summarizeError(message) {
  return String(message || "")
    .replace(/\s+/g, " ")
    .slice(0, 220);
}

function applyStoreDetails(game, details) {
  const genres = genreNames(details);
  return {
    ...game,
    name: details?.name || game.name,
    image: details?.header_image || game.image || steamHeader(game.appid),
    genres,
    storeUrl: game.storeUrl || `https://store.steampowered.com/app/${game.appid}/`
  };
}

async function main() {
  const content = await readContent();
  const games = content.steamLibrary?.games;
  if (!Array.isArray(games) || !games.length) {
    throw new Error("No Steam games found in content.json. Run ImportSteamLibrary.bat first.");
  }

  let pendingIndexes = games
    .map((game, index) => ({ game, index }))
    .filter(({ game }) => needsDetails(game));

  console.log(`Steam games: ${games.length}`);
  console.log(`Missing genres before refresh: ${pendingIndexes.length}`);

  let updated = 0;
  let failed = 0;
  let steamSpyBlocked = false;

  for (let cursor = 0; cursor < pendingIndexes.length; cursor += batchSize) {
    const batch = pendingIndexes.slice(cursor, cursor + batchSize);
    const appids = batch.map(({ game }) => Number(game.appid)).filter(Boolean);
    if (!appids.length) continue;

    console.log(`\nBatch ${Math.floor(cursor / batchSize) + 1}: ${appids.join(", ")}`);

    const storeData = {};

    for (const { game, index } of batch) {
      const item = storeData?.[game.appid];
      let details = item?.success ? item.data : null;

      if (!details) {
        try {
          details = await getStoreDetailsSingle(game.appid);
          await sleep(singleRequestDelayMs);
        } catch (error) {
          console.warn(`  ${game.name || game.appid}: single store details failed: ${summarizeError(error.message)}`);
        }
      }

      const storeGenres = genreNames(details);
      let nextGame = details ? applyStoreDetails(game, details) : { ...game, genres: [] };

      if (!storeGenres.length && useSteamSpyFallback && !steamSpyBlocked) {
        try {
          const spyGenres = await getSteamSpyGenres(game.appid);
          if (spyGenres.length) {
            nextGame = {
              ...nextGame,
              image: nextGame.image || steamHeader(game.appid),
              genres: spyGenres
            };
          }
          await sleep(fallbackDelayMs);
        } catch (error) {
          failed += 1;
          const message = summarizeError(error.message);
          console.warn(`  ${game.name || game.appid}: fallback failed: ${message}`);
          if (/403|cloudflare|just a moment|enable javascript/i.test(message)) {
            steamSpyBlocked = true;
            console.warn("  SteamSpy appears blocked, skipping SteamSpy fallback for the rest of this run.");
          }
        }
      }

      games[index] = {
        ...nextGame,
        image: nextGame.image || steamHeader(game.appid),
        storeUrl: nextGame.storeUrl || `https://store.steampowered.com/app/${game.appid}/`
      };

      const genres = Array.isArray(games[index].genres) ? games[index].genres.filter(Boolean) : [];
      if (genres.length) updated += 1;
      console.log(`  [${index + 1}/${games.length}] ${games[index].name}: ${genres.join(", ") || "still missing"}`);
    }

    await writeContent(content);
    const remaining = games.filter(needsDetails).length;
    console.log(`Saved progress. Remaining without genres: ${remaining}`);
    await sleep(batchDelayMs);
  }

  const remaining = games.filter(needsDetails).length;
  await writeContent(content);
  console.log(`\nDone. Filled genres this run: ${updated}. Failed attempts: ${failed}. Remaining without genres: ${remaining}.`);
  console.log("Next: run PublishToGitHub.bat to publish the updated library.");
}

main().catch((error) => {
  console.error(`\nRefresh failed: ${error.message}`);
  process.exitCode = 1;
});
