import re, json
from components import *
import datetime

FACTORY_ITEMS = [("Machineries","machinery.html","gear","Specialized woodworking machinery for precision cutting, CNC machining and finishing."),
                 ("Service Workflow","service-workflow.html","ruler","From drawing to delivery, in six controlled stages."),
                 ("Quality Policy","quality-policy.html","shield","Quality built into every stage."),
                 ("HSE Policy","hse-policy.html","flame","Safe workplaces. Responsible operations."),
                 ("Registered Vendors","registered-vendors.html","check","Registered with the Kingdom's leading clients and authorities."),
                 ("Our Clients","our-clients.html","users","Trusted by the Kingdom's leading organizations."),
                 ("Certificates & Awards","certificates.html","star","ISO, fire-rated, FSC and approval certificates.")]

def make_pdf(jpg, name):
    try:
        from PIL import Image
    except ImportError:
        return None
    out = os.path.join(ROOT, "files", "certificates")
    os.makedirs(out, exist_ok=True)
    dst = os.path.join(out, name + ".pdf")
    if os.path.exists(dst):
        return f"files/certificates/{name}.pdf"
    im = Image.open(os.path.join(ROOT, "img", "certs", jpg)).convert("RGB")
    im.save(dst, "PDF", resolution=150.0)
    return f"files/certificates/{name}.pdf"

def cert_card(jpg, title, sub, i=0):
    pdf = make_pdf(jpg, jpg.rsplit(".", 1)[0])
    dl = f'<a class="cert-dl" href="{pdf}" download>Download PDF</a>' if pdf else ""
    return (f'<div class="cert-photo-card rv flash on-light" style="--d:{(i%3)*.08:.2f}s"><a href="img/certs/{jpg}" target="_blank" rel="noopener"><div class="cert-thumb" style="background-image:url(\'img/certs/{jpg}\');"></div></a>'
            f'<div class="cert-cap"><h4>{esc(title)}</h4><p>{esc(sub)}</p><div class="cert-actions"><a href="img/certs/{jpg}" target="_blank" rel="noopener">View</a>{dl}</div></div></div>')

def pending_card(title, sub):
    return (f'<div class="cert-photo-card pending rv"><div class="cert-thumb pending-thumb">{icon("doc")}<span>Document to be provided</span></div>'
            f'<div class="cert-cap"><h4>{esc(title)}</h4><p>{esc(sub)}</p></div></div>')

def vendor_mark(v):
    src = client_logo(v["name"])
    if src:
        return '<span class="vendor-logo" data-client-logo="%s"><img src="%s" alt="%s"></span>' % (esc(v["name"]), src, esc(v["name"]))
    return '<span class="vendor-ico">%s</span>' % v["ico"]

CERT_FILES = json.load(open(os.path.join(ROOT, "cert_files.json"), encoding="utf-8"))
FIRE_FOLDERS = json.load(open(os.path.join(ROOT, "fire_certs.json"), encoding="utf-8"))

CERT_TABS = [
 ("fire", "Fire-Rated", "Intertek Fire-Rated Door Compliance Certificates",
  "ARFAD fire-rated doors are certified by Intertek for compliance with both American and British standards, ensuring tested performance, reliability, and safety.",
  [(g["name"], [(i["thumb"], i["title"], i["sub"], i["pdf"]) for i in g["items"]]) for g in FIRE_FOLDERS]),
 ("iso", "ISO", "Committed to Standards, Driven by Excellence",
  "ARFAD is certified to international ISO standards, reflecting our commitment to quality management, environmental responsibility, and the health &amp; safety of our people.",
  [("ISO Management System Certificates", [(i["thumb"], i["title"], i["sub"], i["pdf"]) for i in CERT_FILES["iso"]])]),
 ("fsc", "FSC COC", "FSC COC Certificates",
  "Forest Stewardship Council of UK approved ARFAD as a FSC-STD-40-004 V3-1 Chain of Custody Certification, FSC-STD-50-001 V2-1 Requirements and meeting the Standards for use of the FSC trademarks. LEED documentation supports projects with green-building requirements.",
  [("FSC COC Certificates", list(CERTS_FSC) + [(None, "LEED Certificates", "Document to be provided")])]),
 ("legal", "Legal", "Legal Certificates", "Commercial registration, licenses, permits and company legal documents.", [("Legal Certificates", [(i["thumb"], i["title"], i["sub"], i["pdf"]) for i in CERT_FILES["legal"]])]),
 ("aramco", "Aramco Approvals", "Saudi Aramco Approvals &amp; Appreciations",
  "ARFAD is a registered Saudi Aramco Manufacturer &amp; Service Provider, supported by recognized compliance credentials and a proven record of successful project delivery. Saudi Aramco Vendor Code: 10064085.",
  [("Approvals &amp; Appreciations", CERTS_ARAMCO)]),
]

def cert_logo(jpg):
    """Logo path with a content hash so a replaced logo is never served from a stale browser cache."""
    import hashlib
    p, k = _cert_logo(jpg)
    if p and has_file(p):
        p += "?v=" + hashlib.md5(open(os.path.join(ROOT, p), "rb").read()).hexdigest()[:8]
    return p, k

def _cert_logo(jpg):
    """The certificate maker's logo for a row: (image, chip style)."""
    j = jpg.lower()
    if j.startswith("legal/"):
        slug = j.split("/", 1)[1].rsplit(".", 1)[0]
        lp = f"img/certs/legal-logos/{slug}.png"
        if has_file(lp): return lp, "light wide"
    if j.startswith("fire/") or "intertek" in j: return "img/accreditation/light/intertek.png", "light"
    if "iso-9001" in j: return "img/accreditation/light/iso-9001.png", "light"
    if "iso-14001" in j: return "img/accreditation/light/iso-14001.png", "light"
    if "iso-45001" in j: return "img/accreditation/light/iso-45001.png", "light"
    if "iso" in j: return "img/accreditation/light/uaf.png", "light"
    if "fsc" in j: return "img/accreditation/light/fsc.png", "light"
    if "aramco" in j or "cybersecurity" in j: return "img/clients/saudi-aramco.png", "light"
    return None, "doc"

def cert_logo_html(jpg, view, title):
    img, kind = cert_logo(jpg)
    inner = f'<img src="{img}" alt="" loading="lazy">' if img else icon("doc")
    return f'<a class="cert-row-logo {kind}" href="{view}" target="_blank" rel="noopener" aria-label="View {esc(title)}">{inner}</a>'

def cert_row(jpg, title, sub, pdf=None, i=0):
    if isinstance(pdf, int):      # legacy positional i
        i, pdf = pdf, None
    given = pdf is not None
    pdf = pdf or make_pdf(jpg, jpg.rsplit(".", 1)[0])
    view = pdf if given else f"img/certs/{jpg}"
    dl = f'<a class="cert-btn dl" href="{pdf}" download aria-label="Download" title="Download"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v3h16v-3"/></svg></a>' if pdf else ""
    return (f'<div class="cert-row rv" style="--d:{i*.07:.2f}s">{cert_logo_html(jpg, view, title)}'
            f'<div class="cert-row-t"><h4>{esc(title)}</h4><p>{esc(sub)}</p></div>'
            f'<a class="cert-btn view" href="{view}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>View</a>{dl}</div>')

FOLDER_SVG = '<svg viewBox="0 0 64 52" aria-hidden="true"><path class="fo-back" d="M4 8a4 4 0 0 1 4-4h14l6 7h28a4 4 0 0 1 4 4v29a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path class="fo-front" d="M4 22a4 4 0 0 1 4-4h48a4 4 0 0 1 4 4v22a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/></svg>'

def cert_defaults():
    """The built-in certificates as plain data: the admin starts from this and the page JS renders saved edits."""
    import html as _h
    u = lambda t: _h.unescape(t)
    tabs = []
    for key, label, heading, lede, groups in CERT_TABS:
        items = []
        for gname, rows in groups:
            for c in rows:
                if c[0] is None:
                    items.append(dict(title=u(c[1]), sub=u(c[2]), file="", logo="", group=u(gname) if len(groups) > 1 else "", hidden=False, hideLogo=False))
                    continue
                jpg, title, sub = c[0], c[1], c[2]
                pdf = c[3] if len(c) > 3 else None
                pdf = pdf or make_pdf(jpg, jpg.rsplit(".", 1)[0])
                logo, _k = cert_logo(jpg)
                items.append(dict(title=u(title), sub=u(sub), file="/" + (pdf or f"img/certs/{jpg}"), logo=("/" + logo) if logo else "", group=u(gname) if len(groups) > 1 else "", hidden=title in HIDDEN_CERTS, hideLogo=False))
        tabs.append(dict(id=key, label=u(label), heading=u(heading), lede=u(lede), items=items))
    return dict(tabs=tabs)

FOLDER_LOGOS = {"Halspan": "img/brands/halspan.png", "Warm Springs": "img/brands/warm-springs.png", "Strebord & Ramkor": "img/brands/strebord.png"}

def folder_mark(name):
    lg = FOLDER_LOGOS.get(name)
    return f'<img class="fo-logo" src="{lg}" alt="{esc(name)}" loading="lazy">' if lg else FOLDER_SVG

def pending_row(title, sub):
    return f'<div class="cert-row pending rv"><div class="cert-row-t"><h4>{esc(title)}</h4><p>{esc(sub)}</p></div></div>'

HIDDEN_CERTS = {"ISO Promotional Poster"}  # kept in the admin list as hidden

def cert_tab_panel(key, title, lede, groups):
    groups = [(g, [c for c in rows if c[1] not in HIDDEN_CERTS]) for g, rows in groups]
    head = f'<div class="head"><h2>{title}</h2><p class="lede">{lede}</p></div>'
    empty = '<div class="cert-row pending"><div class="cert-row-t"><h4>Document to be provided</h4><p>This certificate will be added here as soon as it is received.</p></div></div>'
    if len(groups) == 1:
        rows = "".join(pending_row(c[1], c[2]) if c[0] is None else cert_row(*c, i=i) for i, c in enumerate(groups[0][1])) or empty
        return f'<div class="cert-panel" id="{key}" role="tabpanel" hidden>{head}<div class="cert-rows">{rows}</div></div>'
    folders = ""; views = ""
    for n, (gname, items) in enumerate(groups):
        fid = f"{key}-f{n}"
        cnt = len(items)
        folders += (f'<button type="button" class="cert-folder rv" data-folder="{fid}" style="--d:{n*.08:.2f}s">{folder_mark(gname)}'
                    f'<span class="fo-name">{gname}</span><span class="fo-count">{cnt} certificate{"" if cnt == 1 else "s"}</span></button>')
        rows = "".join(cert_row(*c, i=i) for i, c in enumerate(items)) or empty
        views += (f'<div class="cert-folder-view" id="{fid}" hidden><button type="button" class="cert-back">&larr; All folders</button>'
                  f'<h3 class="fo-title">{folder_mark(gname)}<span>{gname}</span></h3><div class="cert-rows">{rows}</div></div>')
    return f'<div class="cert-panel" id="{key}" role="tabpanel" hidden>{head}<div class="cert-folders">{folders}</div>{views}</div>'

FACTORY_GRAD = [("#0f3a66","#1d6fa5"),("#5a3d1e","#b0834a"),("#123a3a","#2f8a7a"),("#5b2a2a","#c0603f"),("#2a2f66","#4f6fd1"),("#1f4d2b","#5da35f"),("#4a2f6b","#9a63c7")]
FACTORY_IMG = ["machine-biesse-skipper-cnc.jpg","machine-reciprocating-spray.jpg","machine-wide-belt-sanding.jpg","machine-spray-booth-2.jpg","proj-aramco.jpg","proj-rc.jpg","mod-doors-teaser.jpg"]

def workflow_path():
    ic = ["doc","pen","wood","gear","shield","truck"]
    pos = [(1,1),(1,2),(1,3),(1,4),(2,1),(2,2)]
    nodes = ""
    for i, t in enumerate(PROCESS):
        r, c = pos[i]
        nodes += (f'<li class="wf-node" style="grid-row:{r};grid-column:{c};--d:{.5+i*.28:.2f}s"><span class="wf-circle">{icon(ic[i])}</span>'
                  f'<h4>{esc(t)}</h4><span class="wf-num">{i+1}</span></li>')
    nodes += f'<li class="wf-node wf-done" style="grid-row:2;grid-column:3;--d:{.5+6*.28:.2f}s"><span class="wf-circle">COMPLETE<br>{icon("check")}</span></li>'
    p = "M125 130 H875 C985 130 985 260 875 260 H150 C25 260 25 390 150 390 H625"
    svg = (f'<svg class="wf-svg" viewBox="0 0 1000 520" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="{p}" />'
           f'<path class="wf-flow" pathLength="1" d="{p}" /></svg>')
    return f'<div class="wf-wrap rv">{svg}<ol class="wf-grid">{nodes}</ol></div>'

def factory_pages():
    # ---- Factory main
    fcards = "".join(f'<a class="feature-card bright flash rv" style="--d:{k*.07:.2f}s;background-image:linear-gradient(135deg,{FACTORY_GRAD[k][0]},{FACTORY_GRAD[k][1]});" href="{h}"><div class="ico-wrap">{icon(ic)}</div><h4>{t}</h4><p>{d}</p><span class="view-link">Open &rarr;</span></a>' for k, (t, h, ic, d) in enumerate(FACTORY_ITEMS))
    inhouse = [("pen","In-house Design Studio","Engineers and draftsmen working in direct coordination with production and project teams."),
               ("spray","In-house Painting Spray Booths","Professional spray booths for lacquer, stain, and paint finishing."),
               ("truck","Storage and Logistics","Dedicated warehousing and transportation capabilities supporting project deliveries across KSA.")]
    icards = "".join(f'<div class="value-card rv flash on-light" style="--d:{k*.08:.2f}s"><div class="ico-wrap">{icon(ic)}</div><h4>{t}</h4><p>{d}</p></div>' for k, (ic, t, d) in enumerate(inhouse))
    body = f'''<main>
  {subhero_slides([("Factory",None)],"01 Factory &amp; Technology","Built in Jubail.<br>Trusted Across the Kingdom.","Built for Scale. Equipped for Excellence.",["factory-hero-1.jpg","factory-hero-2.jpg","factory-hero-3.jpg"])}
  {photo_band(None, f"""
    <p class="eyebrow">Factory Overview</p>
    <h2 style="margin-top:10px;max-width:24ch;">Built for Scale. Equipped for Excellence.</h2>
    <p class="band-lede" style="max-width:62ch;">A 20,000&nbsp;m&sup2; facility in Jubail Industrial City, with dedicated production zones from raw material storage to quality control.</p>""", cls="on-navy theme-gold")}
  <section class="section"><div class="wrap">
    {head("In-House Capability","Everything under one roof.","ARFAD Wood Factory is equipped with a comprehensive range of specialized woodworking machinery, supporting precision cutting, routing, shaping, sanding, pressing, edge banding, veneering, and CNC machining at industrial scale.")}
    <div class="value-grid">{icards}</div>
  </div></section>
  <section class="section on-alt"><div class="wrap">
    {head("Explore the Factory","Machinery, workflow, policies and certificates.")}
    <div class="feature-grid sector-grid" style="margin-top:0;">{fcards}</div>
  </div></section>
  {cta_band()}
</main>'''
    write("factory.html", page("Factory & Technology ARFAD", "Inside ARFAD's 20,000 m² factory in Jubail Industrial City: in-house capability, machinery, service workflow, policies and certificates.", "factory.html", body))

    # ---- Machinery
    photos = "".join(f'<figure class="machine-card rv flash on-light" style="--d:{(i%3)*.08:.2f}s"><div class="machine-img" style="background-image:url(\'img/{im}\');animation-delay:-{i*1.3:.1f}s"></div><figcaption>{esc(n)}</figcaption></figure>' for i, (im, n) in enumerate(MACHINE_PHOTOS))
    mlist = "".join(f'<li class="rv" style="--d:{(i%12)*.04:.2f}s"><span class="mn">{i+1:02d}</span>{esc(m)}</li>' for i, m in enumerate(MACHINE_LIST))
    body = f'''<main>
  {subhero([("Factory","factory.html"),("Machineries",None)],"Machinery &amp; Technology","Machinery &amp; Modern Technology","Advanced Machinery. Precise Output. Every Time.","machine-hot-cold-presser.jpg")}
  <section class="section"><div class="wrap">
    {head("Machinery & Technology","Advanced machinery. Precise output. Every time.","ARFAD Wood Factory is equipped with a comprehensive range of specialized woodworking machinery, supporting precision cutting, routing, shaping, sanding, pressing, edge banding, veneering, and CNC machining at industrial scale.")}
    <div class="machine-grid">{photos}</div>
  </div></section>
  {photo_band(None, f"""
    <p class="eyebrow">Machine List</p>
    <h2 style="margin-top:10px;max-width:24ch;">The ARFAD Machine Fleet.</h2>
    <ol class="machine-ol">{mlist}</ol>""")}
  {cta_band()}
</main>'''
    write("machinery.html", page("Machineries ARFAD", "Advanced woodworking machinery at ARFAD's Jubail factory: wide belt sanding, CEFLA drying, panel saws, presses, edge banding, CNC boring and six side molding.", "machinery.html", body))

    # ---- Service workflow
    body = f'''<main>
  {subhero([("Factory","factory.html"),("Service Workflow",None)],"02 Our Process","From Drawing to Delivery","Six controlled stages carry every project from brief to handover.","machine-reciprocating-spray.jpg")}
  <section class="section"><div class="wrap">
    {head("Service Workflow","From drawing to delivery.")}
    {workflow_path()}
  </div></section>
  {photo_band(None, '<div style="text-align:center;"><p class="eyebrow" style="justify-content:center;">Quality Control &amp; Inspection</p><h2 style="margin-top:12px;max-width:26ch;margin-inline:auto;">Every stage is reviewed, from the first brief to final handover.</h2><div class="hero-cta" style="justify-content:center;margin-top:26px;"><a class="btn" href="quality-policy.html">Our Quality Policy</a></div></div>', overlay=.6)}
  {cta_band()}
</main>'''
    write("service-workflow.html", page("Service Workflow ARFAD", "From drawing to delivery: client brief and requirements, design and engineering, material selection and procurement, factory production and CNC machining, quality control and inspection, site installation and handover.", "service-workflow.html", body))

    # ---- Quality Policy
    fw = ["Approved Shop Drawings & Specifications","Material Certificates & Submittal Review","Incoming Material Inspection","In-Process Factory Inspection","Final Product Inspection","Site Installation Inspection","Inspection Records & Quality Documentation"]
    body = f'''<main>
  {subhero([("Factory","factory.html"),("Quality Policy",None)],"Quality Management","Quality Management","Quality Built Into Every Stage.","projects/marafiq-3.jpg")}
  <section class="section"><div class="wrap">
    {split("Quality Built Into Every Stage.","Quality management",["Quality at ARFAD is managed through documented procedures, approved specifications, material control, production checks, and site supervision. Every stage is reviewed to ensure that the final output meets the required technical, functional, and finishing standards."],"quality-slide.jpg", extra='<div class="hero-cta" style="margin-top:26px;"><a class="btn solid flash" href="#policy-doc">View Quality Policy & Manual</a></div>')}
  </div></section>
  <section class="section on-alt"><div class="wrap">
    {head("Quality Framework","ISO 9001:2015 Certified Quality Management System")}
    {scope_grid(fw, "check")}
  </div></section>
  <section class="section" id="policy-doc"><div class="wrap">
    {head("Documented Policy","Quality Control Policy &amp; Procedures Manual.","The documented quality system that governs every stage, from pre-production review to final inspection and records.")}
    <div class="cert-rows"><div class="cert-row rv"><a class="cert-row-th" href="files/documents/quality-control-policy-and-procedures-manual.pdf" target="_blank" rel="noopener" aria-label="View Quality Control Policy &amp; Procedures Manual" style="background-image:url('img/certs/quality-manual.jpg');"></a>
      <div class="cert-row-t"><h4>Quality Control Policy &amp; Procedures Manual</h4><p>ARFAD International Industrial Company · 14 sections, 58 pages</p></div>
      <a class="cert-btn view" href="files/documents/quality-control-policy-and-procedures-manual.pdf" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>View</a>
      <a class="cert-btn dl" href="files/documents/quality-control-policy-and-procedures-manual.pdf" download aria-label="Download" title="Download"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v3h16v-3"/></svg></a></div></div>
  </div></section>
  {cta_band()}
</main>'''
    write("quality-policy.html", page("Quality Policy ARFAD", "Quality built into every stage: documented procedures, approved specifications, material control, production checks, and site supervision.", "quality-policy.html", body))

    # ---- HSE Policy
    ehs = ["Occupational Health & Safety","Factory & Site Safety Procedures","Employee & Subcontractor Safety Awareness","Hazard Identification & Emergency Response","Responsible Material Usage","Waste Management & Controlled Disposal"]
    body = f'''<main>
  {subhero([("Factory","factory.html"),("HSE Policy",None)],"Health, Safety &amp; Environmental Responsibility","Health, Safety &amp; Environmental<br>Responsibility","Safe Workplaces. Responsible Operations.","machine-spray-booth.jpg")}
  <section class="section"><div class="wrap">
    {split("Safe Workplaces. Responsible Operations.","HSE Policy",["ARFAD is committed to maintaining a safe and healthy working environment while minimizing environmental impact through controlled procedures, employee awareness, responsible practices, and compliance with applicable KSA regulations."],"machine-six-side-molding.jpg", extra='<div class="hero-cta" style="margin-top:26px;"><a class="btn solid flash" href="#policy-doc">View HSE Policy</a></div>')}
  </div></section>
  <section class="section on-alt focus-light"><div class="wrap">
    <p class="eyebrow">EHS Focus Areas</p>
    <h2 style="margin-top:10px;max-width:22ch;">Six focus areas, one standard.</h2>
    <div class="focus-grid">{"".join(f'<div class="focus-item rv flash on-light" style="--d:{k*.07:.2f}s">{icon("flame" if k in (0,1,3) else "leaf")}<span>{esc(t)}</span></div>' for k, t in enumerate(ehs))}</div>
  </div></section>
  <section class="section" id="policy-doc"><div class="wrap">
    {head("Documented Policy","HSE Policy document.","The documented HSE Policy will be published here as soon as it is received.")}
    <div class="cert-rows"><div class="cert-row pending rv"><div class="cert-row-t"><h4>HSE Policy</h4><p>Document to be provided</p></div></div></div>
  </div></section>
  {cta_band()}
</main>'''
    write("hse-policy.html", page("HSE Policy ARFAD", "ARFAD is committed to a safe and healthy working environment and to minimizing environmental impact, in compliance with applicable KSA regulations.", "hse-policy.html", body))

    # ---- Registered vendors
    def vmark(name, logo):
        src = client_logo(logo) if logo else None
        if src:
            return f'<span class="vendor-logo big"><img src="{src}" alt="{esc(name)}"></span>'
        return f'<span class="vendor-logo big mono">{esc("".join(w[0] for w in re.sub(r"[^A-Za-z ]", " ", name).split()[:2]).upper())}</span>'
    vcards = "".join(f'<div class="vendor-row rv flash on-light" style="--d:{(i%3)*.08:.2f}s">{vmark(n, lg)}<div><h4>{esc(n)}</h4><p class="vid">ID - {esc(no)}</p></div></div>' for i, (n, no, lg) in enumerate(VENDORS))
    body = f'''<main>
  {subhero([("Factory","factory.html"),("Registered Vendors",None)],"Registered Vendors","Registered. Compliant.<br>Recognized.","ARFAD is registered with the Kingdom's leading clients and authorities.","projects/marafiq-2.jpg")}
  <section class="section"><div class="wrap">
    {head("Registered Vendor Details","Registered with the Kingdom&rsquo;s leading clients.")}
    <div class="vendor-grid-2">{vcards}</div>
  </div></section>
  {cta_band()}
</main>'''
    write("registered-vendors.html", page("Registered Vendors ARFAD", "ARFAD registered vendor numbers: Saudi Aramco 10064085, SABIC 11047241, Royal Commission 14902, Ma'aden 40665, The Red Sea Co. S10357393, NEOM 10625781 and more.", "registered-vendors.html", body))

    # ---- Our clients
    tiles = "".join(logo_tile(n, (i % 6) * .05) for i, n in enumerate(CLIENTS))
    body = f'''<main>
  {subhero([("Factory","factory.html"),("Our Clients",None)],"Clients &amp; Partners","Trusted by the Kingdom's<br>Leading Organizations.","","projects/redsea-amaala-6.jpg")}
  <section class="section"><div class="wrap">
    {head("Our Clients","Clients and partners.","A 20-year portfolio spanning royal commissions, national giga-projects and the Kingdom's leading developers.")}
    <div class="logo-grid big" data-clients="grid">{tiles}</div>
  </div></section>
  {cta_band()}
</main>'''
    write("our-clients.html", page("Our Clients ARFAD", "Clients and partners of ARFAD: Royal Commission for Jubail & Yanbu, Saudi Aramco, SATORP, YASREF, SABIC, MA'ADEN, Red Sea Global, NEOM, AMAALA and more.", "our-clients.html", body))

    # ---- Certificates & Awards
    tabs = "".join(f'<button type="button" role="tab" class="cert-tab" data-tab="{k}" aria-controls="{k}">{lbl}</button>' for k, lbl, *_ in CERT_TABS)
    panels = "".join(cert_tab_panel(k, t, l, g) for k, lbl, t, l, g in CERT_TABS)
    body = f'''<main>
  {subhero([("Factory","factory.html"),("Certificates & Awards",None)],"Certifications &amp; Approvals","Certificates &amp; Awards","Certified. Approved. Compliant.","projects/neom-4.jpg")}
  <section class="section cert-hub"><div class="wrap">
    {head("Quality, Safety, Environment, Compliance, Trust","Certified. Approved. Compliant.","Choose a category to view and download each certificate separately.")}
    <div class="cert-tabs" role="tablist">{tabs}</div>
    {panels}
  </div></section>
  {cta_band()}
</main>'''
    write("certificates.html", page("Certificates & Awards ARFAD", "ARFAD certificates and awards: Intertek fire-rated door certificates, ISO 9001, ISO 14001, ISO 45001, FSC Chain of Custody and Saudi Aramco approvals.", "certificates.html", body))

def post_page():
    body = f'''<main>
  {subhero([("Media","media.html"),("Post",None)],"Media","<span data-post-title>News</span>","","from-drawing-to-delivery.jpg")}
  <section class="section"><div class="wrap">
    <article class="post-article" data-post-article>
      <div class="post-article-meta"><span class="post-cat" data-post-cat></span><time data-post-date></time></div>
      <div class="post-article-cover" data-post-cover hidden></div>
      <div class="post-article-body" data-post-body></div>
      <p class="post-missing" data-post-missing hidden>This post could not be found. It may have been removed.</p>
      <div class="hero-cta" style="margin-top:34px;"><a class="btn solid flash" href="media.html">&larr; Back to Media</a><a class="btn" href="contact.html">Contact Us</a></div>
    </article>
  </div></section>
  {cta_band()}
</main>'''
    write("post.html", page("Media ARFAD", "News, events and exhibitions from ARFAD International Industrial Co.", "media.html", body, path="post.html"))

def other_pages():
    post_page()
    # ---- Sustainability
    pts = ["FSC Chain of Custody Certified","Certified Wood Product Traceability","Responsible Wood Sourcing","Controlled Chain of Custody Procedures","Support for Sustainability-Focused Projects"]
    body = f'''<main>
  {subhero([("Sustainability",None)],"FSC® Certification &amp; Sustainability","FSC® Certification &amp;<br>Sustainability","Responsible Wood Sourcing. Certified Chain of Custody.","projects/redsea-amaala-7.jpg")}
  <section class="section"><div class="wrap">
    {split("Committed to Responsible Forestry","Sustainability &amp; FSC® Certification",
      ["ARFAD is FSC Chain of Custody certified, demonstrating its commitment to responsible wood sourcing and the traceability of certified wood products throughout the supply chain. This certification enables ARFAD to support projects with sustainability and responsible sourcing requirements.",
       "Forest Stewardship Council of UK approved ARFAD as a FSC-STD-40-004 V3-1 Chain of Custody Certification, FSC-STD-50-001 V2-1 Requirements and meeting the Standards for use of the FSC trademarks."],
      "fsc-timber.jpg", extra='<div class="hero-cta" style="margin-top:26px;"><a class="btn solid flash" href="certificates.html#fsc">View FSC Certificate</a></div>')}
  </div></section>
  <section class="section sus-impact"><div class="wrap about-grid">
    <div class="split-img" style="aspect-ratio:16/11;background-image:url('img/projects/el-eissa-2.jpg');"></div>
    <div>
      <p class="eyebrow">Sustainability</p>
      <h2 style="margin-top:10px;">Making a Positive Impact on the Environment.</h2>
      <p style="margin-top:20px;font-size:1.02rem;">Sustainability is our strategic approach to building a legacy for future generations, we understand the profound impact that the Woodwork industry can have on our natural resources and the environment. As a result, we prioritize integrating sustainable practices into all facets of our operations, ensuring that our activities, policies, and procedures align with environmentally responsible principles.</p>
      <figure class="sus-fsc"><img src="img/accreditation/fsc.png?v=2" alt="FSC® – the mark of responsible forestry"></figure>
    </div>
  </div></section>
  <section class="section on-alt"><div class="wrap">
    {head("Our Process","How we build responsibly.")}
    <ol class="sus-process">
      <li class="rv"><span class="sp-ico">{icon("wood")}</span><h4>Sustainable Materials</h4><p>We use only environmentally friendly and sustainable materials in our projects to reduce our environmental impact while creating long-lasting and durable structures.</p></li>
      <li class="rv" style="--d:.1s"><span class="sp-ico">{icon("gear")}</span><h4>Smart &amp; Digital Solutions</h4><p>Our team utilizes the latest technology and innovative digital solutions to deliver efficient and cost-effective projects while minimizing our environmental footprint.</p></li>
      <li class="rv" style="--d:.2s"><span class="sp-ico">{icon("leaf")}</span><h4>Maximizing Resource Utilization</h4><p>We maximize the utilization of resources to reduce waste and promote sustainability. Our team is trained to be resourceful and efficient, ensuring that every material and resource is used to its fullest potential.</p></li>
    </ol>
  </div></section>
  <section class="section"><div class="wrap">
    {head("Our Commitment","Our FSC® Chain of Custody certification.","Our FSC Chain of Custody certification ensures that the wood and wood-based materials we use are sourced from responsibly managed forests, supporting biodiversity, environmental protection, and the well-being of communities worldwide.")}
    {scope_grid(pts, "leaf")}
  </div></section>
  {cta_band()}
</main>'''
    write("sustainability.html", page("Sustainability & FSC Certification ARFAD", "ARFAD is FSC Chain of Custody certified, supporting responsible wood sourcing and the traceability of certified wood products.", "sustainability.html", body))

    # ---- Careers [DRAFT]
    body = f'''<main>
  {subhero([("Careers",None)],"Careers","Build Your Career<br>with ARFAD.","Join a team of 200+ production professionals building the Kingdom's architectural woodwork.","projects/neom-5.jpg")}
  <section class="section"><div class="wrap contact-grid">
    <div>
      {head("Join our team","Careers at ARFAD.","ARFAD's factory brings together engineers and draftsmen, CNC and machine operators, finishers, quality inspectors and site installation teams, all working to one standard from drawing to delivery.")}
      <div class="contact-card"><div class="contact-row"><span class="k">Open positions</span><span class="v">No vacancies are listed right now. Send us your CV and we will keep it on file.</span></div>
        <div class="contact-row"><span class="k">Email</span><span class="v"><a href="mailto:{EMAIL}">{EMAIL}</a></span></div></div>
    </div>
    <div class="contact-card form-card">
      <h3 style="margin-bottom:18px;">Send us your details</h3>
      {enquiry_form(["Engineering & Design","Production & CNC","Finishing & Spray","Quality & HSE","Site Installation","Administration","Other"], "Send Application", "Area of Interest", cv=True)}
    </div>
  </div></section>
  {cta_band("Questions about working at ARFAD?")}
</main>'''
    write("careers.html", page("Careers ARFAD", "Careers at ARFAD International Industrial Co. in Jubail Industrial City, Saudi Arabia.", "careers.html", body))

    # ---- Media
    allp = sorted(f for f in os.listdir(os.path.join(ROOT, "img", "projects")) if f.endswith(".jpg"))
    order = [s for s in ["neom","redsea-amaala","royal-commission","saudi-aramco","kafd","marafiq","ministry-of-defense","misk","movenpick","karan","primer-steak-house","el-eissa"]]
    allp.sort(key=lambda f: (order.index(re.sub(r"-\d+\.\w+$", "", f)) if re.sub(r"-\d+\.\w+$", "", f) in order else 99, int(re.sub(r"\D", "", f.rsplit("-",1)[-1]) or 0)))
    gal = gallery_filters(allp) + gallery(allp, meta=True) + '<p class="gal-empty" data-gf-empty hidden>No photos match this filter. Try another project or service.</p>'
    body = f'''<main>
  {subhero([("Media",None)],"Media","Events, Exhibitions<br>&amp; News.","Company events, exhibitions, news and announcements.","projects/redsea-amaala-4.jpg")}
  <section class="section" data-posts-section{"" if any(p.get("published", True) for p in POSTS_DEFAULT) else " hidden"}><div class="wrap">
    {head("Latest from ARFAD","Events, exhibitions and news.")}
    {post_filters()}
    {posts_grid()}
    <p class="gal-empty" data-posts-empty hidden>No posts in this category yet.</p>
  </div></section>
  <section class="section on-alt"><div class="wrap">{head("Photo gallery","From our projects.")}{gal}</div></section>
  {cta_band()}
</main>'''
    write("media.html", page("Media ARFAD", "ARFAD events, exhibitions, news and announcements.", "media.html", body))

    # ---- Contact
    def crow(ic, label, val):
        return f'<div class="ci-row"><span class="ci-ico">{icon(ic)}</span><span class="ci-text"><span class="ci-k">{label}</span><span class="ci-v">{val}</span></span></div>'
    rows = "".join([
        crow("pin", "Address", "<br>".join(ADDRESS_LINES)),
        crow("phone", "Phone", f'<a href="tel:{PHONE_LAND_TEL}">{PHONE_LAND}</a>'),
        crow("phone", "Mobile / WhatsApp", f'<a href="https://wa.me/{PHONE_MOBILE_WA}">{PHONE_MOBILE}</a>'),
        crow("mail", "Email", f'<a href="mailto:{EMAIL}">{EMAIL}</a>'),
        crow("flag", "Website", '<a href="https://www.arfad.com.sa">www.arfad.com.sa</a>'),
    ])
    body = f'''<main>
  {subhero([("Contact",None)],"Get in Touch","Let's build something<br>that lasts twenty years.","Reach out for a quote, a site visit, or a conversation about your next project.","projects/neom-3.jpg")}
  <section class="section"><div class="wrap contact-grid">
      <div class="contact-card contact-info">
        <h3>Contact Details</h3>
        <div class="ci-list">{rows}</div>
        <div class="hero-cta" style="margin-top:26px;"><a class="btn solid flash" href="mailto:{EMAIL}">Email Us</a><a class="btn" href="https://wa.me/{PHONE_MOBILE_WA}">WhatsApp Us</a></div>
      </div>
    <div class="contact-card form-card">
      <h3 style="margin-bottom:18px;">Enquiry</h3>
      {enquiry_form(["Quotation Request","General Enquiry","Project Enquiry","Supplier / Vendor","Careers","Other"], "Send Message")}
    </div>
  </div></section>
  <section class="section" style="padding-top:0;"><div class="wrap">
    <div class="map-box" style="padding:0;overflow:hidden;position:relative;aspect-ratio:21/9;">
        <iframe src="https://www.openstreetmap.org/export/embed.html?bbox=49.5967%2C26.9846%2C49.6767%2C27.0246&layer=mapnik&marker=27.0046%2C49.6367" width="100%" height="100%" style="border:0;position:absolute;inset:0;filter:saturate(.85) brightness(.95);" loading="lazy" title="ARFAD location map Jubail Industrial City"></iframe>
        <a href="https://www.google.com/maps/search/?api=1&query=ARFAD+International+Industrial+Co%2C+Jubail+Industrial+City%2C+Saudi+Arabia" target="_blank" rel="noopener" class="btn solid" style="position:absolute;left:16px;bottom:16px;z-index:2;">Open in Google Maps</a>
    </div>
  </div></section>
</main>'''
    write("contact.html", page("Contact ARFAD", "Get in touch with ARFAD International Industrial Co. in Jubail Industrial City, Saudi Arabia.", "contact.html", body))

REDIRECTS = {"quality.html":"quality-policy.html",
             "service-cladding.html":"service-wall-cladding.html","service-flooring.html":"service-cabinets.html#sub-floorings",
             "service-kitchens.html":"service-cabinets.html#sub-kitchens","service-wardrobes.html":"service-cabinets.html#sub-wardrobes","service-vanities.html":"service-cabinets.html#sub-vanities",
             "service-reception-counters.html":"service-joinery.html#sub-reception","service-exterior.html":"service-thermowood.html#sub-exterior"}

def redirects():
    for old, new in REDIRECTS.items():
        write(old, f'<!doctype html>\n<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
                   f'<title>Moved</title><meta http-equiv="refresh" content="0; url={new}"><link rel="canonical" href="{SITE_URL}/{new}"><meta name="robots" content="noindex">'
                   f'</head><body><p>This page has moved to <a href="{new}">{new}</a>.</p></body></html>\n')

def sitemap_and_llms(files):
    today = datetime.date.today().isoformat()
    urls = "".join(f"  <url>\n    <loc>{SITE_URL}/{f}</loc>\n    <lastmod>{today}</lastmod>\n    <priority>{'1.0' if f=='index.html' else '0.7'}</priority>\n  </url>\n" for f in files)
    write("sitemap.xml", '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls + "</urlset>\n")
    svc = "\n".join(f"  - [{s['title']}]({SITE_URL}/service-{s['slug']}.html)" for s in SERVICES)
    sec = "\n".join(f"  - [{s['title']}]({SITE_URL}/projects-{s['slug']}.html)" for s in SECTORS)
    write("llms.txt", f"""# ARFAD International Industrial Co.

> Architectural woodwork manufacturer based in Jubail Industrial City, Saudi Arabia, operating since 2004. ISO 9001:2015, ISO 14001:2015, ISO 45001:2018 and FSC Chain-of-Custody certified. Registered vendor for Saudi Aramco, the Royal Commission for Jubail & Yanbu, and Red Sea Global.

{TAGLINE}. ARFAD manufactures architectural wood works, interior furnishing and wooden furniture from a 20,000 m² factory in Jubail Industrial City, KSA.

## Key pages
- [Home]({SITE_URL}/index.html)
- [Who We Are]({SITE_URL}/about.html): About Us, Vision, Mission, Our Values, Why ARFAD
- [Services]({SITE_URL}/services.html):
{svc}
- [Projects]({SITE_URL}/projects.html), by sector:
{sec}
- [Factory]({SITE_URL}/factory.html): Machineries, Service Workflow, Quality Policy, HSE Policy, Registered Vendors, Our Clients, Certificates & Awards
- [Sustainability]({SITE_URL}/sustainability.html)
- [Careers]({SITE_URL}/careers.html)
- [Media]({SITE_URL}/media.html)
- [Contact]({SITE_URL}/contact.html)

## Contact
- Phone: {PHONE_LAND}
- Mobile / WhatsApp: {PHONE_MOBILE}
- Email: {EMAIL}
- Address: {", ".join(ADDRESS_LINES)}
""")
