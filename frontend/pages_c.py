import re
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

def factory_pages():
    # ---- Factory main
    fcards = "".join(f'<a class="feature-card flash" href="{h}" style="background:linear-gradient(180deg,rgba(10,37,64,.62),rgba(10,37,64,.95)),url(img/factory.jpg) center/cover;"><div class="ico-wrap">{icon(ic)}</div><h4>{t}</h4><p>{d}</p><span class="view-link">Open &rarr;</span></a>' for t, h, ic, d in FACTORY_ITEMS)
    inhouse = [("pen","In-house Design Studio","Engineers and draftsmen working in direct coordination with production and project teams."),
               ("spray","In-house Painting Spray Booths","Professional spray booths for lacquer, stain, and paint finishing."),
               ("truck","Storage and Logistics","Dedicated warehousing and transportation capabilities supporting project deliveries across KSA.")]
    icards = "".join(f'<div class="value-card rv flash on-light" style="--d:{k*.08:.2f}s"><div class="ico-wrap">{icon(ic)}</div><h4>{t}</h4><p>{d}</p></div>' for k, (ic, t, d) in enumerate(inhouse))
    body = f'''<main>
  {subhero([("Factory",None)],"01 Factory &amp; Technology","Built in Jubail.<br>Trusted Across the Kingdom.","Built for Scale. Equipped for Excellence.","why-arfad.jpg")}
  {photo_band("factory.jpg", f"""
    <p class="eyebrow">Factory Overview</p>
    <h2 style="margin-top:10px;max-width:24ch;">Built for Scale. Equipped for Excellence.</h2>
    <div class="stat-grid fx-stats gold">
      <div class="stat-cell flash"><div class="ico-wrap">{icon("factory")}</div><div class="num">20,000 m&sup2;</div><div class="lbl">Total built-up factory area</div></div>
      <div class="stat-cell flash"><div class="ico-wrap">{icon("users")}</div><div class="num">200+</div><div class="lbl">Production employees</div></div>
      <div class="stat-cell flash"><div class="ico-wrap">{icon("wood")}</div><div class="num">237,000+</div><div class="lbl">Wooden doors installed</div></div>
      <div class="stat-cell flash"><div class="ico-wrap">{icon("star")}</div><div class="num">20+</div><div class="lbl">Years of excellence in woodwork</div></div>
    </div>""", cls="on-navy theme-gold")}
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
    photos = "".join(f'<figure class="machine-card rv flash on-light" style="--d:{(i%3)*.08:.2f}s"><div class="machine-img" style="background-image:url(\'img/{im}\');"></div><figcaption>{esc(n)}</figcaption></figure>' for i, (im, n) in enumerate(MACHINE_PHOTOS))
    mlist = "".join(f'<li class="rv" style="--d:{(i%12)*.04:.2f}s"><span class="mn">{i+1:02d}</span>{esc(m)}</li>' for i, m in enumerate(MACHINE_LIST))
    body = f'''<main>
  {subhero([("Factory","factory.html"),("Machineries",None)],"Machinery &amp; Technology","Machinery &amp; Modern Technology","Advanced Machinery. Precise Output. Every Time.","machine-sektar-panel-saw.jpg")}
  <section class="section"><div class="wrap">
    {head("Machinery & Technology","Advanced machinery. Precise output. Every time.","ARFAD Wood Factory is equipped with a comprehensive range of specialized woodworking machinery, supporting precision cutting, routing, shaping, sanding, pressing, edge banding, veneering, and CNC machining at industrial scale.")}
    <div class="machine-grid">{photos}</div>
  </div></section>
  {photo_band("machine-cefla-drying.jpg", f"""
    <p class="eyebrow">Machine List</p>
    <h2 style="margin-top:10px;max-width:24ch;">The ARFAD machine fleet.</h2>
    <ol class="machine-ol">{mlist}</ol>""", overlay=.9)}
  {cta_band()}
</main>'''
    write("machinery.html", page("Machineries ARFAD", "Advanced woodworking machinery at ARFAD's Jubail factory: wide belt sanding, CEFLA drying, panel saws, presses, edge banding, CNC boring and six side molding.", "machinery.html", body))

    # ---- Service workflow
    ic = ["doc","pen","wood","gear","shield","truck"]
    steps = "".join(f'<li class="tl-step rv flash on-light" style="--d:{i*.1:.2f}s"><span class="tl-n">{i+1:02d}</span><div class="ico-wrap">{icon(ic[i])}</div><h4>{esc(t)}</h4></li>' for i, t in enumerate(PROCESS))
    body = f'''<main>
  {subhero([("Factory","factory.html"),("Service Workflow",None)],"02 Our Process","From Drawing to Delivery","Six controlled stages carry every project from brief to handover.","from-drawing-to-delivery.jpg")}
  <section class="section"><div class="wrap">
    {head("Service Workflow","From drawing to delivery.")}
    <ol class="timeline">{steps}</ol>
  </div></section>
  {photo_band("from-drawing-to-delivery.jpg", '<div style="text-align:center;"><p class="eyebrow" style="justify-content:center;">Quality Control &amp; Inspection</p><h2 style="margin-top:12px;max-width:26ch;margin-inline:auto;">Every stage is reviewed, from the first brief to final handover.</h2><div class="hero-cta" style="justify-content:center;margin-top:26px;"><a class="btn" href="quality-policy.html">Our Quality Policy</a></div></div>', overlay=.86)}
  {cta_band()}
</main>'''
    write("service-workflow.html", page("Service Workflow ARFAD", "From drawing to delivery: client brief, design and engineering, material selection, factory production and CNC machining, quality control, site installation and handover.", "service-workflow.html", body))

    # ---- Quality Policy
    fw = ["Approved Shop Drawings & Specifications","Material Certificates & Submittal Review","Incoming Material Inspection","In-Process Factory Inspection","Final Product Inspection","Site Installation Inspection","Inspection Records & Quality Documentation"]
    body = f'''<main>
  {subhero([("Factory","factory.html"),("Quality Policy",None)],"Quality Management","Quality Management","Quality Built Into Every Stage.","quality.jpg")}
  <section class="section"><div class="wrap">
    {split("Quality Built Into Every Stage.","Quality management",["Quality at ARFAD is managed through documented procedures, approved specifications, material control, production checks, and site supervision. Every stage is reviewed to ensure that the final output meets the required technical, functional, and finishing standards."],"quality.jpg", extra='<div class="hero-cta" style="margin-top:26px;"><a class="btn solid flash" href="certificates.html">View ISO Certificates</a></div>')}
  </div></section>
  <section class="section on-alt"><div class="wrap">
    {head("Quality Framework","ISO 9001:2015 Certified Quality Management System")}
    {scope_grid(fw, "check")}
  </div></section>
  {cta_band()}
</main>'''
    write("quality-policy.html", page("Quality Policy ARFAD", "Quality built into every stage: documented procedures, approved specifications, material control, production checks, and site supervision.", "quality-policy.html", body))

    # ---- HSE Policy
    ehs = ["Occupational Health & Safety","Factory & Site Safety Procedures","Employee & Subcontractor Safety Awareness","Hazard Identification & Emergency Response","Responsible Material Usage","Waste Management & Controlled Disposal"]
    body = f'''<main>
  {subhero([("Factory","factory.html"),("HSE Policy",None)],"Safety &amp; Environmental Responsibility","Safety &amp; Environmental<br>Responsibility","Safe Workplaces. Responsible Operations.","factory.jpg")}
  <section class="section"><div class="wrap">
    {split("Safe Workplaces. Responsible Operations.","HSE Policy",["ARFAD is committed to maintaining a safe and healthy working environment while minimizing environmental impact through controlled procedures, employee awareness, responsible practices, and compliance with applicable KSA regulations."],"factory.jpg", extra='<div class="hero-cta" style="margin-top:26px;"><a class="btn solid flash" href="certificates.html">View ISO 14001 &amp; 45001</a></div>')}
  </div></section>
  {photo_band("factory.jpg", f"""
    <p class="eyebrow">EHS Focus Areas</p>
    <h2 style="margin-top:10px;max-width:22ch;">Six focus areas, one standard.</h2>
    <div class="focus-grid">{"".join(f'<div class="focus-item rv flash" style="--d:{k*.07:.2f}s">{icon("flame" if k in (0,1,3) else "leaf")}<span>{esc(t)}</span></div>' for k, t in enumerate(ehs))}</div>""", overlay=.88)}
  {cta_band()}
</main>'''
    write("hse-policy.html", page("HSE Policy ARFAD", "ARFAD is committed to a safe and healthy working environment and to minimizing environmental impact, in compliance with applicable KSA regulations.", "hse-policy.html", body))

    # ---- Registered vendors
    vcards = "".join(f'<div class="vendor-card rv flash on-light" style="--d:{(i%3)*.08:.2f}s">{vendor_mark(v)}<h4>{esc(v["name"])}</h4><p class="vendor-no"><small>Registered Vendor No.</small>{esc(v["no"])}</p><p>{esc(v["note"])}</p></div>' for i, v in enumerate(VENDORS))
    acards = "".join(cert_card(*c, i=i) for i, c in enumerate(CERTS_ARAMCO))
    body = f'''<main>
  {subhero([("Factory","factory.html"),("Registered Vendors",None)],"Registered Vendors","Registered. Compliant.<br>Recognized.","ARFAD is registered with the Kingdom's leading clients and authorities.","proj-aramco.jpg")}
  <section class="section"><div class="wrap">
    {head("Registered Vendor Details","Vendor registrations.")}
    <div class="vendor-grid">{vcards}</div>
  </div></section>
  <section class="section on-alt"><div class="wrap">
    {head("Saudi Aramco Approvals & Appreciations","Recognized. Compliant. Trusted.","ARFAD is a registered Saudi Aramco Manufacturer & Service Provider, supported by recognized compliance credentials and a proven record of successful project delivery. Saudi Aramco Vendor Code: 10064085.")}
    <div class="cert-photo-grid two">{acards}</div>
    <p class="total-line">Registered, Compliant, Recognized</p>
  </div></section>
  <section class="section"><div class="wrap">{clients_marquee()}</div></section>
  {cta_band()}
</main>'''
    write("registered-vendors.html", page("Registered Vendors ARFAD", "ARFAD registered vendor numbers: Saudi Aramco 10064085, Royal Commission 14902, Red Sea Global S10357393, SABIC 11047241 and MA'ADEN 40665.", "registered-vendors.html", body))

    # ---- Our clients
    tiles = "".join(logo_tile(n, (i % 6) * .05) for i, n in enumerate(CLIENTS))
    body = f'''<main>
  {subhero([("Factory","factory.html"),("Our Clients",None)],"Clients &amp; Partners","Trusted by the Kingdom's<br>Leading Organizations.","","proj-rc.jpg")}
  <section class="section"><div class="wrap">
    {head("Our Clients","Clients and partners.","A 20-year portfolio spanning royal commissions, national giga-projects and the Kingdom's leading developers.")}
    <div class="logo-grid" data-clients="grid">{tiles}</div>
  </div></section>
  <section class="section on-alt"><div class="wrap">{clients_marquee()}</div></section>
  {cta_band()}
</main>'''
    write("our-clients.html", page("Our Clients ARFAD", "Clients and partners of ARFAD: Royal Commission for Jubail & Yanbu, Saudi Aramco, SATORP, YASREF, SABIC, MA'ADEN, Red Sea Global, NEOM, AMAALA and more.", "our-clients.html", body))

    # ---- Certificates & Awards
    fire = "".join(cert_card(*c, i=i) for i, c in enumerate(CERTS_FIRE))
    iso = "".join(cert_card(*c, i=i) for i, c in enumerate(CERTS_ISO))
    fsc = "".join(cert_card(*c, i=i) for i, c in enumerate(CERTS_FSC)) + pending_card("LEED Certificates", "To be added") + pending_card("Legal Certificates", "To be added")
    body = f'''<main>
  {subhero([("Factory","factory.html"),("Certificates & Awards",None)],"Certifications &amp; Approvals","Certificates &amp; Awards","Certified. Approved. Compliant.","quality.jpg")}
  <section class="section"><div class="wrap">
    {head("Quality, Safety, Environment, Compliance, Trust","Certified. Approved. Compliant.","Our certifications and approvals reflect ARFAD's commitment to quality, safety, compliance, and industry standards.")}
    <div class="pill-links"><a href="#fire">Fire-Rated Certificates</a><a href="#iso">ISO Certifications</a><a href="#fsc">FSC, LEED &amp; Legal Certificates</a></div>
  </div></section>
  <section class="section cert-sec fire" id="fire"><div class="wrap">
    {head("Intertek Certifications","Fire-Rated Door Compliance Certificates","ARFAD fire-rated doors are certified by Intertek for compliance with both American and British standards, ensuring tested performance, reliability, and safety.")}
    <div class="cert-photo-grid">{fire}</div>
    <p class="total-line">Tested Performance, Fire Safety, International Standards, Reliable Quality, Trusted Compliance</p>
  </div></section>
  <section class="section on-alt cert-sec iso" id="iso"><div class="wrap">
    {head("ISO Certifications","Committed to Standards, Driven by Excellence","ARFAD is certified to international ISO standards, reflecting our commitment to quality management, environmental responsibility, and the health &amp; safety of our people. These certifications demonstrate our dedication to continuous improvement and sustainable business practices.")}
    <div class="cert-photo-grid">{iso}</div>
    <div class="pill-links" style="margin-top:28px;"><span>Americo</span><span>IAF</span><span>UAF</span></div>
  </div></section>
  <section class="section cert-sec fsc" id="fsc"><div class="wrap">
    {head("Sustainability & FSC® Certification","FSC, LEED & Legal Certificates","Forest Stewardship Council of UK approved ARFAD as a FSC-STD-40-004 V3-1 Chain of Custody Certification, FSC-STD-50-001 V2-1 Requirements and meeting the Standards for use of the FSC trademarks.")}
    <div class="cert-photo-grid">{fsc}</div>
  </div></section>
  {cta_band()}
</main>'''
    write("certificates.html", page("Certificates & Awards ARFAD", "ARFAD certificates and awards: Intertek fire-rated door certificates, ISO 9001, ISO 14001, ISO 45001 and FSC Chain of Custody.", "certificates.html", body))

def other_pages():
    # ---- Sustainability
    pts = ["FSC Chain of Custody Certified","Certified Wood Product Traceability","Responsible Wood Sourcing","Controlled Chain of Custody Procedures","Support for Sustainability-Focused Projects"]
    body = f'''<main>
  {subhero([("Sustainability",None)],"FSC® Certification &amp; Sustainability","FSC® Certification &amp;<br>Sustainability","Responsible Wood Sourcing. Certified Chain of Custody.","svc-wpc.jpg")}
  <section class="section"><div class="wrap">
    {split("Committed to Responsible Forestry","Sustainability &amp; FSC® Certification",
      ["ARFAD is FSC Chain of Custody certified, demonstrating its commitment to responsible wood sourcing and the traceability of certified wood products throughout the supply chain. This certification enables ARFAD to support projects with sustainability and responsible sourcing requirements.",
       "Forest Stewardship Council of UK approved ARFAD as a FSC-STD-40-004 V3-1 Chain of Custody Certification, FSC-STD-50-001 V2-1 Requirements and meeting the Standards for use of the FSC trademarks."],
      "quality.jpg", extra='<div class="hero-cta" style="margin-top:26px;"><a class="btn solid flash" href="certificates.html#fsc">View FSC Certificate</a></div>')}
  </div></section>
  <section class="section on-alt"><div class="wrap">
    {head("Our Commitment","Our FSC® Chain of Custody certification.","Our FSC Chain of Custody certification ensures that the wood and wood-based materials we use are sourced from responsibly managed forests, supporting biodiversity, environmental protection, and the well-being of communities worldwide.")}
    {scope_grid(pts, "leaf")}
  </div></section>
  {cta_band()}
</main>'''
    write("sustainability.html", page("Sustainability & FSC Certification ARFAD", "ARFAD is FSC Chain of Custody certified, supporting responsible wood sourcing and the traceability of certified wood products.", "sustainability.html", body))

    # ---- Careers [DRAFT]
    body = f'''<main>
  {subhero([("Careers",None)],"Careers","Build Your Career<br>with ARFAD.","Join a team of 200+ production professionals building the Kingdom's architectural woodwork.","who-we-are.jpg")}
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
    cats = [("camera","Events","Company events and site visits."),("flag","Exhibitions","Exhibitions and trade fairs ARFAD takes part in."),("news","News","Company announcements and project news.")]
    ccards = "".join(f'<div class="media-card rv flash on-light" style="--d:{i*.1:.2f}s"><div class="ico-wrap">{icon(ic)}</div><h4>{t}</h4><p>{d}</p><span class="soon">Updates will be posted here</span></div>' for i, (ic, t, d) in enumerate(cats))
    allp = sorted(f for f in os.listdir(os.path.join(ROOT, "img", "projects")) if f.endswith(".jpg"))
    order = [s for s in ["neom","redsea-amaala","royal-commission","saudi-aramco","kafd","marafiq","ministry-of-defense","misk","movenpick","karan","primer-steak-house","el-eissa"]]
    allp.sort(key=lambda f: (order.index(re.sub(r"-\d+\.\w+$", "", f)) if re.sub(r"-\d+\.\w+$", "", f) in order else 99, int(re.sub(r"\D", "", f.rsplit("-",1)[-1]) or 0)))
    gal = gallery(allp)
    body = f'''<main>
  {subhero([("Media",None)],"Media","Events, Exhibitions<br>&amp; News.","Company events, exhibitions, news and announcements.","factory.jpg")}
  <section class="section"><div class="wrap">
    {head("Latest from ARFAD","Events, exhibitions and news.")}
    <div class="value-grid">{ccards}</div>
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
  {subhero([("Contact",None)],"Get in Touch","Let's build something<br>that lasts twenty years.","Reach out for a quote, a site visit, or a conversation about your next project.","factory.jpg")}
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

REDIRECTS = {"quality.html":"quality-policy.html","service-cladding.html":"service-wall-cladding.html","service-cabinets.html":"service-kitchens.html",
             "service-joinery.html":"service-reception-counters.html","service-thermowood.html":"service-exterior.html","service-wpc.html":"service-exterior.html"}

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
