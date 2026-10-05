"""Find freely-licensed images on Wikimedia Commons and download them with attribution metadata.

Uses the MediaSearch HTML page for discovery and ?action=raw wikitext for license/author,
then pulls a 960px thumbnail from upload.wikimedia.org (the API endpoint is often rate limited).
Usage: python3 tools/fetch_commons.py < tools/queries.txt   (lines: tag | search terms [| n])
"""
import hashlib, json, re, sys, time, urllib.parse, urllib.request, pathlib

UA = "RetroCameraCollage/1.0 (educational short film)"
ROOT = pathlib.Path(__file__).resolve().parent.parent
RAW = ROOT / "assets" / "raw"; RAW.mkdir(parents=True, exist_ok=True)
META = RAW / "meta.json"
FREE = re.compile(r"\{\{\s*(cc-zero|cc0|pd-[\w-]+|public domain|cc-by(-sa)?-[234](\.\d)?[\w,-]*|self\s*\|[^}]*?(cc-by(-sa)?-[\d.]+|cc-zero|pd-\w+)|attribution|flickr-no known copyright restrictions)", re.I)


def get(url, tries=4):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    for i in range(tries):
        try:
            with urllib.request.urlopen(req, timeout=40) as r:
                return r.read()
        except Exception as e:
            print("  retry", i, e, file=sys.stderr); time.sleep(5 * (i + 1))
    return None


def search(q):
    html = get("https://commons.wikimedia.org/w/index.php?" + urllib.parse.urlencode(
        dict(search=q, title="Special:MediaSearch", type="image")))
    if not html: return []
    names, seen = [], set()
    for m in re.finditer(r'File:([^"&?<>#]+?\.(?:jpe?g|png))', html.decode("utf8", "ignore"), re.I):
        n = urllib.parse.unquote(m.group(1)).replace(" ", "_")
        if n not in seen: seen.add(n); names.append(n)
    return names


def thumb_url(name, w=960):
    h = hashlib.md5(name.encode()).hexdigest()
    q = urllib.parse.quote(name)
    return f"https://upload.wikimedia.org/wikipedia/commons/thumb/{h[0]}/{h[:2]}/{q}/{w}px-{q}"


def clean_author(s):
    s = re.sub(r"\[\[(?:[^|\]]*\|)?([^\]]*)\]\]", r"\1", s)
    s = re.sub(r"\[\S+ ([^\]]*)\]", r"\1", s)
    s = re.sub(r"\{\{[^}]*\}\}|'''?|<[^>]+>", "", s)
    return s.strip()[:120]


def main(tag, query, n):
    meta = json.loads(META.read_text()) if META.exists() else {}
    got = sum(1 for k in meta if k.startswith(tag + "_"))
    if got >= n: return
    for name in search(query):
        if got >= n: break
        if any(v.get("title") == "File:" + name for v in meta.values()): continue
        wt = get("https://commons.wikimedia.org/w/index.php?" + urllib.parse.urlencode(dict(title="File:" + name, action="raw")))
        if not wt: continue
        wt = wt.decode("utf8", "ignore")
        lic = FREE.search(wt)
        if not lic: continue
        am = re.search(r"\|\s*[Aa]uthor\s*=\s*(.+)", wt)
        data = get(thumb_url(name)) or get(thumb_url(name, 640))
        if not data or len(data) < 5000: continue
        fn = f"{tag}_{got}" + (".png" if name.lower().endswith(".png") else ".jpg")
        (RAW / fn).write_bytes(data)
        meta[fn] = dict(title="File:" + name, license=lic.group(1)[:60], artist=clean_author(am.group(1)) if am else "",
                        page="https://commons.wikimedia.org/wiki/File:" + urllib.parse.quote(name), query=query)
        META.write_text(json.dumps(meta, ensure_ascii=False, indent=1))
        got += 1; time.sleep(1.5)
    print(tag, got, flush=True)


if __name__ == "__main__":
    for line in sys.stdin:
        if "|" in line and not line.startswith("#"):
            parts = [x.strip() for x in line.split("|")]
            main(parts[0], parts[1], int(parts[2]) if len(parts) > 2 else 5)
            time.sleep(3)
