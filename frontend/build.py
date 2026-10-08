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
print("done", len(files), "pages")
