"""Marks every editable text, image and hero in the built pages with data-edit="<key>" and
collects a catalog (written to backend/db/page-catalog.json) that the admin "Pages" editor reads.
Keys are hashes of the original content, so when the source text changes the old override simply stops applying."""
import hashlib, html, re
from html.parser import HTMLParser

TEXT_TAGS = {"h1", "h2", "h3", "h4", "p", "li", "figcaption"}
VOID = {"br", "img", "input", "meta", "link", "hr", "source", "area", "base", "col", "embed", "param", "track", "wbr"}
EXCL_ATTRS = {"data-posts", "data-clients", "data-gallery", "data-post-article", "data-posts-filters", "data-gf", "data-post-title", "data-post-body"}
URL_RE = re.compile(r"url\(\s*['\"]?([^'\")]+)['\"]?\s*\)")

def _h(s):
    return hashlib.sha1(s.encode("utf-8")).hexdigest()[:7]

class _Annot(HTMLParser):
    def __init__(self, src):
        super().__init__(convert_charrefs=False)
        self.src = src
        self.lines = [0]
        for m in re.finditer("\n", src):
            self.lines.append(m.end())
        self.stack = []          # open elements
        self.inserts = []        # (offset, text)
        self.items = []          # catalog entries
        self.seen = {}
        self.sections = []       # section index -> label
        self.main_depth = 0

    def _off(self):
        l, c = self.getpos()
        return self.lines[l - 1] + c

    def _key(self, prefix, basis):
        n = self.seen.get((prefix, basis), 0)
        self.seen[(prefix, basis)] = n + 1
        return f"{prefix}-{_h(basis)}" + (f"-{n}" if n else "")

    def _in_main(self):
        return any(e["tag"] == "main" for e in self.stack)

    def _excluded(self):
        for e in self.stack:
            if e["tag"] in ("script", "style", "noscript", "header", "footer", "nav"):
                return True
            if any(a in EXCL_ATTRS for a in e["attrs"]):
                return True
        return False

    def handle_starttag(self, tag, attrs):
        off = self._off()
        raw = self.get_starttag_text()
        d = dict(attrs)
        el = {"tag": tag, "attrs": d, "off": off, "raw": raw, "end": off + len(raw), "child_el": False, "hero_imgs": None, "section": None}
        if tag in VOID:
            if tag == "br" and self.stack:
                pass
            elif self.stack:
                self.stack[-1]["child_el"] = True
            return
        if self.stack and tag != "br":
            self.stack[-1]["child_el"] = True
        if tag == "section" and self._in_main():
            cl = (d.get("class") or "").split()
            self.sections.append("Page header" if ("detail-hero" in cl or "hero-slider" in cl) else "")
            el["section"] = len(self.sections) - 1
        self.stack.append(el)

    def handle_startendtag(self, tag, attrs):
        if self.stack and tag != "br":
            self.stack[-1]["child_el"] = True

    def _section_idx(self):
        for e in reversed(self.stack):
            if e["section"] is not None:
                return e["section"]
        return None

    def handle_endtag(self, tag):
        if not self.stack:
            return
        # pop to the matching open element
        i = len(self.stack) - 1
        while i >= 0 and self.stack[i]["tag"] != tag:
            i -= 1
        if i < 0:
            return
        el = self.stack[i]
        close_off = self._off()
        del self.stack[i + 1:]
        self.stack.pop()
        if not self._in_main() and el["tag"] != "main" and not any(e["tag"] == "main" for e in self.stack):
            return
        if self._excluded_for(el):
            return
        cls = (el["attrs"].get("class") or "").split()
        style = el["attrs"].get("style") or ""
        inner = self.src[el["end"]:close_off]
        # ---- hero (page header): one entry holding every image
        if el["tag"] == "section" and ("detail-hero" in cls or "hero-slider" in cls):
            urls = URL_RE.findall(inner)
            urls = [u for u in urls if not u.startswith("data:")]
            if urls:
                key = self._key("h", "hero")
                self.inserts.append((el["off"] + 1 + len("section"), f' data-edit="{key}"'))
                self.items.append({"key": key, "kind": "hero", "tag": "hero", "images": urls, "section": self._section_idx()})
            return
        # ---- text
        if el["tag"] in TEXT_TAGS or (el["tag"] == "a" and "btn" in cls) or (el["tag"] == "span" and ("eyebrow" in cls or "lbl" in cls)):
            if el["child_el"] or "data-edit" in el["raw"]:
                return
            if re.search(r"<(?!br\s*/?>)", inner):
                return
            text = html.unescape(re.sub(r"<br\s*/?>", "\n", inner)).strip()
            if not text or len(text) > 1200:
                return
            key = self._key("t", el["tag"] + text)
            self.inserts.append((el["off"] + 1 + len(el["tag"]), f' data-edit="{key}"'))
            self.items.append({"key": key, "kind": "text", "tag": el["tag"], "text": text, "section": self._section_idx()})
            return
        # ---- single background image on a block (cards, split images, bands)
        if "background" in style and not self._hero_inner(el):
            m = URL_RE.search(style)
            if m and not m.group(1).startswith("data:"):
                url = m.group(1)
                key = self._key("i", url)
                self.inserts.append((el["off"] + 1 + len(el["tag"]), f' data-edit="{key}"'))
                self.items.append({"key": key, "kind": "image", "tag": el["tag"], "url": url, "section": self._section_idx()})

    def _excluded_for(self, el):
        return self._excluded()

    def _hero_inner(self, el):
        return any(("detail-hero" in (e["attrs"].get("class") or "").split() or "hero-slider" in (e["attrs"].get("class") or "").split()) and e["tag"] == "section" for e in self.stack)

def annotate(page_html, filename):
    p = _Annot(page_html)
    p.feed(page_html)
    p.close()
    # first heading text of each section labels it
    for it in p.items:
        s = it["section"]
        if s is not None and it["kind"] == "text" and it["tag"] in ("h1", "h2") and not p.sections[s]:
            p.sections[s] = it["text"].replace("\n", " ")[:60]
        if it["kind"] == "hero":
            pass
    for it in p.items:
        s = it["section"]
        it["group"] = "Page header" if it["kind"] == "hero" else ((p.sections[s] if s is not None and p.sections[s] else f"Section {s + 1}") if s is not None else "Page")
        it.pop("section", None)
    out = page_html
    for off, txt in sorted(p.inserts, key=lambda x: -x[0]):
        out = out[:off] + txt + out[off:]
    t = re.search(r"<title>(.*?)</title>", page_html, re.S)
    return out, {"title": html.unescape(re.sub(r"\s+", " ", t.group(1))).strip() if t else filename, "items": p.items}
