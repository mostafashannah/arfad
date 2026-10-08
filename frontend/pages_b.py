from components import *
from collections import OrderedDict

def company(client):
    c = client
    if c.startswith("Saudi Aramco"): return "Saudi Aramco"
    if c.startswith(("AMAALA /","Red Sea")): return "Red Sea Global & AMAALA"
    if c.startswith("NEOM"): return "NEOM"
    if c.startswith("MISK"): return "MISK Foundation"
    if c.startswith("YASREF"): return "YASREF"
    if c.startswith("ZATCA"): return "ZATCA"
    if c.startswith("Al Eissa"): return "Al Eissa Compound (ZAC)"
    return c

def group_rows(rows):
    g = OrderedDict()
    for c, p, l, sc in rows:
        g.setdefault(company(c), []).append((c, p, l, sc))
    return g

def sector_img(s):
    return s["img"] if has_file("img/" + s["img"]) else "projects/" + s["img"]

def company_block(name, rows, i=0):
    trs = "".join(f'<tr><td>{esc(p)}</td><td class="loc">{esc(l) if l.strip() else "&nbsp;"}</td><td class="scope">{esc(sc)}</td></tr>' for c, p, l, sc in rows)
    sub = ""
    subs = sorted({c for c, _, _, _ in rows if c != name})
    if len(subs) and len(rows) > 1:
        sub = ""
    det = row_detail(rows[0][0])
    link = f'<a class="co-link" href="project-{det}.html">View gallery &rarr;</a>' if det else ""
    return (f'<div class="company-block rv" style="--d:{(i%2)*.08:.2f}s"><div class="company-head flash"><span class="co-mark">{esc("".join(w[0] for w in name.replace("&"," ").split()[:2]).upper())}</span>'
            f'<h3>{esc(name)}</h3><span class="co-count">{len(rows)} project{"s" if len(rows)!=1 else ""}</span>{link}</div>'
            f'<div class="table-wrap" style="margin-top:0;border-top-left-radius:0;border-top-right-radius:0;"><table class="proj-table"><thead><tr><th>Project</th><th>Location</th><th>Scope</th></tr></thead><tbody>{trs}</tbody></table></div></div>')

def projects_pages():
    # ---- overview
    sector_cards = "".join(
        f'<a class="gallery-card flash" href="projects-{s["slug"]}.html" style="background-image:url(\'img/{sector_img(s)}\');">'
        f'<div class="gc-body"><p class="eyebrow">Project Sector</p><h4>{esc(s["title"])}</h4><p>{s["intro"][:78].rsplit(" ",1)[0]}&hellip;</p></div></a>' for s in SECTORS)
    blocks = "".join(company_block(n, r, i) for i, (n, r) in enumerate(group_rows(ROWS).items()))
    body = f'''<main>
  {subhero([("Projects",None)],"01 Our Projects","Every project we deliver is a<br>physical reflection of our standards.","A 20-Year Portfolio You Can Rely On.","proj-rc.jpg")}
  <section class="section"><div class="wrap">
    {head("Project Sectors","Explore our work by sector.","The featured projects on this website represent highlights, but ARFAD's track record spans hundreds of completed contracts across KSA since 2004.")}
    <div class="feature-grid sector-grid" style="margin-top:0;">{sector_cards}</div>
  </div></section>
  {photo_band("factory.jpg", f"""
    <div class="stat-grid fx-stats three">
      <div class="stat-cell flash"><div class="ico-wrap">{icon("wood")}</div><div class="num">237,000+</div><div class="lbl">Wooden doors installed</div></div>
      <div class="stat-cell flash"><div class="ico-wrap">{icon("ruler")}</div><div class="num">161,500+ m&sup2;</div><div class="lbl">Cladding, ceiling &amp; flooring works delivered</div></div>
      <div class="stat-cell flash"><div class="ico-wrap">{icon("gear")}</div><div class="num">347,000+ m&sup2;</div><div class="lbl">Kitchens &amp; wardrobes fitted</div></div>
    </div>""")}
  <section class="section on-alt"><div class="wrap">
    {head("Project Summary Report","Our projects, by company.","Every project listed under the company it was delivered for.")}
    <div class="company-list">{blocks}</div>
  </div></section>
  <section class="section"><div class="wrap">{clients_marquee()}</div></section>
  {cta_band("Ready to start your project?")}
</main>'''
    write("projects.html", page("Projects ARFAD", "ARFAD's project portfolio by sector: industrial & infrastructure, hospitality & luxury development, residential and F&B, commercial & government, healthcare, education and specialized projects.", "projects.html", body))

    # ---- sector pages
    for s in SECTORS:
        rows = [r for r in ROWS if row_sector(r[0], r[1]) == s["slug"]]
        grouped = group_rows(rows)
        details = []
        for r in rows:
            d = row_detail(r[0])
            if d and d not in details: details.append(d)
        imgs = []
        for d in details:
            imgs += PROJECT_PAGES[d]["imgs"][:3]
        cards = ""
        n = 0
        for name, rs in grouped.items():
            items = "".join(
                f'<div class="proj-item rv flash on-light" style="--d:{(k%3)*.07:.2f}s"><h4>{esc(p)}</h4><p class="loc">{esc(l) if l.strip() else "&nbsp;"}</p><p>{esc(sc)}</p></div>' for k, (c, p, l, sc) in enumerate(rs))
            det = row_detail(rs[0][0])
            link = f'<a class="btn" href="project-{det}.html">View {esc(name)} gallery</a>' if det else ""
            cards += f'<div class="sector-company rv"><div class="company-head flash"><span class="co-mark">{esc("".join(w[0] for w in name.replace("&"," ").split()[:2]).upper())}</span><h3>{esc(name)}</h3><span class="co-count">{len(rs)} project{"s" if len(rs)!=1 else ""}</span></div><div class="proj-items">{items}</div><div style="margin-top:18px;">{link}</div></div>'
        others = "".join(f'<a href="projects-{o["slug"]}.html">{esc(o["title"])}</a>' for o in SECTORS if o["slug"] != s["slug"])
        gal = f'<div style="margin-top:56px;">{head("Photo gallery", esc(s["title"]) + ", on site")}{gallery(imgs[:9])}</div>' if imgs else ""
        body = f'''<main>
  {subhero([("Projects","projects.html"),(esc(s["title"]),None)],"Project Sector", esc(s["title"]), s["intro"], sector_img(s))}
  <section class="section"><div class="wrap">
    {head("Projects in this sector", esc(s["title"]))}
    {cards}
    {gal}
  </div></section>
  <section class="section on-alt"><div class="wrap">{head("Explore","Other project sectors.")}<div class="pill-links">{others}</div></div></section>
  <section class="section"><div class="wrap">{clients_marquee()}</div></section>
  {cta_band("Ready to start your project?")}
</main>'''
        write(f"projects-{s['slug']}.html", page(f"{s['title']} Projects ARFAD", s["intro"], f"projects-{s['slug']}.html", body))

    # ---- project detail pages
    for slug, p in PROJECT_PAGES.items():
        sector = None
        for r in ROWS:
            if row_detail(r[0]) == slug:
                sector = SECTOR_BY_SLUG[row_sector(r[0], r[1])]; break
        crumb = [("Projects","projects.html")]
        if sector: crumb.append((esc(sector["title"]), f"projects-{sector['slug']}.html"))
        crumb.append((esc(p["client"]), None))
        items = ""
        if p["items"]:
            items = head("Scope of work", "What we delivered.") + '<div class="proj-items wide">' + "".join(
                f'<div class="proj-item rv flash on-light" style="--d:{(k%3)*.07:.2f}s"><h4>{esc(t)}</h4><p>{esc(d)}</p></div>' for k, (t, d) in enumerate(p["items"])) + "</div>"
            if p.get("total"):
                items += f'<p class="total-line rv">{esc(p["total"])}</p>'
        items_section = '<section class="section on-alt"><div class="wrap">' + items + '</div></section>' if items else ""
        loc_li = f'<li>Location: {esc(p["loc"])}</li>' if p["loc"].strip() else ""
        body = f'''<main>
  {subhero(crumb,"Featured Project", esc(p["title"]), "", "projects/" + p["img"])}
  <section class="section"><div class="wrap">
    {split("Overview", esc(p["client"]), [esc(p["desc"])], "projects/" + p["img"], extra=f'<ul class="qual-list" style="margin-top:24px;"><li>Client: {esc(p["client"])}</li>{loc_li}</ul>' + cta_btns(("Request a Quote","contact.html"),("All Projects","projects.html")))}
  </div></section>
  {items_section}
  <section class="section"><div class="wrap">{head("Gallery","Project photos.")}{gallery(p["imgs"])}</div></section>
  {cta_band("Ready to start your next project?")}
</main>'''
        write(f"project-{slug}.html", page(f"{p['title']} ARFAD Projects", p["desc"], "projects.html", body, path=f"project-{slug}.html"))
