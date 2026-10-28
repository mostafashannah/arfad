#!/usr/bin/env python3
import glob, os
from core import *
import pages_a, pages_b, pages_c

pages_a.home()
pages_a.who_pages()
pages_a.services_pages()
pages_b.projects_pages()
pages_c.factory_pages()
pages_c.other_pages()
pages_c.redirects()

redirect_files = set(pages_c.REDIRECTS)
files = sorted(f for f in (os.path.basename(p) for p in glob.glob(os.path.join(ROOT, "*.html"))) if f not in redirect_files)
pages_c.sitemap_and_llms(files)
import json
with open(os.path.join(ROOT, "..", "backend", "db", "site-defaults.json"), "w") as fh:
    json.dump({"nav": [dict(i, active=True) for i in SITE_DEFAULTS["nav"]], "footer": SITE_DEFAULTS["footer"], "accreditations": SITE_DEFAULTS["accreditations"], "posts": POSTS_JSON, "certificates": pages_c.cert_defaults(), "vendors": [dict(name=n, no=no, logo=("/" + client_logo(lg) if lg and client_logo(lg) else None)) for n, no, lg in VENDORS]}, fh, ensure_ascii=False, indent=2)
with open(os.path.join(ROOT, "..", "backend", "db", "page-catalog.json"), "w") as fh:
    json.dump(PAGE_CATALOG, fh, ensure_ascii=False, indent=1, sort_keys=True)
import arabic
_n, _missing = arabic.build()
if _missing:
    print("UNTRANSLATED (%d):" % len(_missing), sorted(_missing)[:10])
print("arabic", _n, "pages")
print("done", len(files), "pages", "catalog", len(PAGE_CATALOG))
