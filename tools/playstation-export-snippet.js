(() => {
  const clean = (value) => String(value || "").replace(/\s+/g, " ").trim();
  const blocked = /^(playstation|ps store|store|games|game library|recently purchased|download|installed|wishlist|sort|filter|search|profile|settings)$/i;
  const seen = new Map();

  function add(name, image = "") {
    const title = clean(name);
    if (!title || title.length < 2 || title.length > 90 || blocked.test(title)) return;
    const key = title.toLowerCase();
    const current = seen.get(key);
    if (!current || (!current.image && image)) {
      seen.set(key, {
        name: title,
        image: image || "",
        genres: [],
        playtimeHours: 0
      });
    }
  }

  function bestImage(element) {
    const image = element.querySelector?.("img") || (element.tagName === "IMG" ? element : null);
    return image?.currentSrc || image?.src || image?.getAttribute?.("data-src") || "";
  }

  const cardSelector = [
    "a[href]",
    "article",
    "li",
    "[role='link']",
    "[data-qa]",
    "[class*='tile']",
    "[class*='card']"
  ].join(",");

  document.querySelectorAll(cardSelector).forEach((element) => {
    const image = bestImage(element);
    const img = element.querySelector?.("img") || (element.tagName === "IMG" ? element : null);
    const name =
      clean(img?.alt) ||
      clean(element.getAttribute?.("aria-label")) ||
      clean(element.getAttribute?.("title")) ||
      clean(element.querySelector?.("[title]")?.getAttribute("title")) ||
      clean(element.innerText).split("\n").map(clean).find((line) => line.length >= 2 && line.length <= 90);

    if (image || /concept|product|game|title/i.test(element.getAttribute?.("href") || "")) {
      add(name, image);
    }
  });

  document.querySelectorAll("img[alt]").forEach((image) => {
    add(image.alt, image.currentSrc || image.src || "");
  });

  const games = Array.from(seen.values()).sort((left, right) => left.name.localeCompare(right.name));
  const payload = {
    source: location.href,
    exportedAt: new Date().toISOString(),
    games
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "playstation-library.json";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);

  console.log(`Exported ${games.length} PlayStation games.`);
  console.table(games.slice(0, 20));
})();
