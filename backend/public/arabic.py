"""Builds the Arabic site (ar/*.html) from the built English pages using a translation table (translations_ar.py).
Text is matched by its exact English wording; layout, images and scripts are shared with the English site."""
import os, re, json, glob
from bs4 import BeautifulSoup, NavigableString, Comment

ROOT = os.path.dirname(os.path.abspath(__file__))
INLINE = {"em", "br", "strong", "b", "i", "small", "span", "sup", "sub", "time"}
SKIP = {"script", "style", "noscript", "svg", "path", "code"}
ATTRS = ["alt", "placeholder", "title", "aria-label", "content", "value"]

def norm(s):
    return re.sub(r"\s+", " ", s).strip()

def inline_only(el):
    for c in el.children:
        if isinstance(c, NavigableString):
            continue
        if c.name not in INLINE:
            return False
        if c.name == "span" and (c.get("class") or not inline_only(c)):
            return False
    return True

def has_text(el):
    return any(isinstance(c, NavigableString) and not isinstance(c, Comment) and re.search(r"[A-Za-z]{2}", str(c)) for c in el.descendants)

def key_of(el):
    return norm("".join(str(c) for c in el.children))

def parse(page_html):
    soup = BeautifulSoup(page_html, "lxml")
    for el in soup.find_all(True):
        for a in ("data-edit", "data-edit-link"):
            if a in el.attrs:
                del el.attrs[a]
    return soup

RULES = [
    (re.compile(r"^(Halspan|Warm Springs|RAMKOR|Strebord)\b"), None),
    (re.compile(r"^Certificate ([A-Z0-9-]+) · Spec ID (\d+)(?: · (.*?))? · Valid to December 31, 2026$"),
     lambda m: "الشهادة " + m.group(1) + " · رقم المواصفة " + m.group(2) + ((" · " + m.group(3)) if m.group(3) else "") + " · صالحة حتى 31 ديسمبر 2026"),
    (re.compile(r"^ID - (.+)$"), lambda m: "المعرّف - " + m.group(1)),
    (re.compile(r"^View (.+) gallery$"), lambda m: "عرض معرض " + m.group(1)),
    (re.compile(r"^View (.+)$"), lambda m: "عرض " + m.group(1)),
    (re.compile(r"^Download (.+)$"), lambda m: "تحميل " + m.group(1)),
]

def by_rule(k, attr=False):
    for rx, fn in RULES:
        if fn is not None and rx.pattern in (r"^View (.+)$", r"^Download (.+)$") and not attr:
            continue
        m = rx.match(k)
        if m:
            return k if fn is None else fn(m)
    return None

def collect(page_html):
    """Every translatable string of a built English page."""
    soup = parse(page_html)
    out = []
    def walk(el):
        for c in list(el.children):
            if isinstance(c, Comment) or isinstance(c, NavigableString):
                continue
            if c.name in SKIP or c.get("id") == "site-defaults":
                continue
            if inline_only(c) and has_text(c):
                out.append(key_of(c))
            else:
                walk(c)
        # loose text directly inside a mixed container
        for c in el.children:
            if isinstance(c, NavigableString) and not isinstance(c, Comment) and re.search(r"[A-Za-z]{2}", str(c)) and el.name not in SKIP and not inline_only(el):
                out.append(norm(str(c)))
    walk(soup.body or soup)
    for el in soup.find_all(True):
        for a in ATTRS:
            v = el.get(a)
            if isinstance(v, str) and re.search(r"[A-Za-z]{2}", v) and not (el.name == "meta" and el.get("name") not in ("description",) and el.get("property") not in ("og:title", "og:description", "og:site_name")) and not v.startswith(("http", "/", "#")) and not re.match(r"^[\w./#?=&:%-]+$", v):
                out.append(norm(v))
    t = soup.find("title")
    if t:
        out.append(norm(t.get_text()))
    return out

def prefix_assets(val):
    if not isinstance(val, str):
        return val
    if re.match(r"^(img/|files/|styles\\.css|fonts/)", val):
        return "../" + val
    return val

def translate(page_html, T, missing=None):
    soup = parse(page_html)
    html_tag = soup.find("html")
    if html_tag is not None:
        html_tag["lang"] = "ar"; html_tag["dir"] = "rtl"

    def tr(k):
        if k in T:
            return T[k]
        r = by_rule(k)
        if r is not None:
            return r
        if missing is not None:
            missing.add(k)
        return None

    def set_inner(el, arabic):
        el.clear()
        frag = BeautifulSoup(arabic, "html.parser")
        for node in list(frag.contents):
            el.append(node)

    def walk(el):
        for c in list(el.children):
            if isinstance(c, Comment) or isinstance(c, NavigableString):
                continue
            if c.name in SKIP or c.get("id") == "site-defaults":
                continue
            if inline_only(c) and has_text(c):
                a = tr(key_of(c))
                if a is not None:
                    set_inner(c, a)
            else:
                walk(c)
        if not inline_only(el):
            for c in list(el.children):
                if isinstance(c, NavigableString) and not isinstance(c, Comment) and re.search(r"[A-Za-z]{2}", str(c)) and el.name not in SKIP:
                    a = tr(norm(str(c)))
                    if a is not None:
                        c.replace_with(a)
    walk(soup.body or soup)
    for el in soup.find_all(True):
        for a in ATTRS:
            v = el.get(a)
            if isinstance(v, str):
                k = norm(v)
                if k in T:
                    el[a] = T[k]
                else:
                    r = by_rule(k, attr=True)
                    if r is not None:
                        el[a] = r
    t = soup.find("title")
    if t:
        a = tr(norm(t.get_text()))
        if a is not None:
            t.string = a
    # Arabic font + stylesheet, canonical address, no link to the English twin
    head = soup.find("head")
    if head is not None:
        first = head.find("link", rel="stylesheet")
        css = soup.new_tag("link", rel="stylesheet", href="../styles-ar.css")
        font = soup.new_tag("link", rel="stylesheet", href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap")
        anchor = None
        for l in head.find_all("link", rel="stylesheet"):
            if "styles.css" in (l.get("href") or ""):
                anchor = l
        if anchor is not None:
            anchor.insert_after(css); anchor.insert_after(font)
        else:
            head.append(font); head.append(css)
        for l in head.find_all("link", rel="canonical"):
            l["href"] = re.sub(r"(https?://[^/]+)/", r"\1/ar/", l["href"], count=1)
        for m in head.find_all("meta"):
            if m.get("property") == "og:url" and m.get("content"):
                m["content"] = re.sub(r"(https?://[^/]+)/", r"\1/ar/", m["content"], count=1)
            if m.get("property") == "og:locale":
                m["content"] = "ar_SA"
    # assets live one level up
    for el in soup.find_all(True):
        for a in ("src", "href", "poster", "data-src"):
            v = el.get(a)
            if isinstance(v, str) and re.match(r"^(img/|files/|styles\.css|fonts/)", v):
                el[a] = "../" + v
        st = el.get("style")
        if isinstance(st, str) and "url(" in st:
            el["style"] = re.sub(r"url\((['\"]?)(img/|files/)", lambda m: "url(" + m.group(1) + "../" + m.group(2), st)
    # inline JSON / scripts: asset paths and the Arabic flag
    out = str(soup)
    out = out.replace("img/accreditation/", "../img/accreditation/")
    out = re.sub(r'(?<![\w/.])(["\'])(img/[\w./-]+)', lambda m: m.group(1) + "../" + m.group(2), out) if False else out
    return out

def build(files_dir=ROOT):
    from translations_ar import T
    outdir = os.path.join(ROOT, "ar")
    os.makedirs(outdir, exist_ok=True)
    missing = set()
    pages = [f for f in sorted(glob.glob(os.path.join(ROOT, "*.html")))]
    n = 0
    for f in pages:
        name = os.path.basename(f)
        s = open(f, encoding="utf-8").read()
        if 'http-equiv="refresh"' in s or "<main" not in s:
            continue
        out = translate(s, T, missing)
        with open(os.path.join(outdir, name), "w", encoding="utf-8") as fh:
            fh.write(out)
        n += 1
    return n, missing

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "extract":
        allk = {}
        for f in sorted(glob.glob(os.path.join(ROOT, "*.html"))):
            s = open(f, encoding="utf-8").read()
            if 'http-equiv="refresh"' in s or "<main" not in s:
                continue
            for k in collect(s):
                allk.setdefault(k, os.path.basename(f))
        json.dump(allk, open(os.path.join(ROOT, "strings_en.json"), "w"), ensure_ascii=False, indent=0)
        print(len(allk))
