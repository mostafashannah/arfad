from components import *

def home():
    cards = "".join(svc_card(s, i) for i, s in enumerate(SERVICES))
    sec_cards = "".join(
        f'<a class="gallery-card flash" href="projects-{s["slug"]}.html" style="background-image:url(\'img/{s["img"] if has_file("img/"+s["img"]) else "projects/"+s["img"]}\');">'
        f'<div class="gc-body"><p class="eyebrow">Project Sector</p><h4>{esc(s["title"])}</h4></div></a>' for s in SECTORS)
    body = f'''<main id="top">
  <section class="hero-slider hero-full">
    <div class="slide" style="background-image:url('img/factory.jpg');"></div>
    <div class="slide" style="background-image:url('img/proj-aramco.jpg');"></div>
    <div class="slide" style="background-image:url('img/proj-rc.jpg');"></div>
    <div class="hero-overlay"></div>
    <div class="hero-dots"></div>
    <div class="wrap hero-full-inner">
      <div class="hero-caption-track">
        <div class="hero-caption">
          <p class="eyebrow">Est. 2004 &middot; Jubail, KSA</p>
          <h1>Two Decades of Mastery <em>in WOODWORKS.</em></h1>
          <p class="hero-lede">Established in 2004, ARFAD operates in architectural wood works, interior furnishing and wooden furniture manufacturing from Jubail Industrial City.</p>
        </div>
        <div class="hero-caption">
          <p class="eyebrow">Mass Production</p>
          <h1>Built for Scale. <em>Equipped for Excellence.</em></h1>
          <p class="hero-lede">A 20,000&nbsp;m&sup2; factory with 200+ production employees and a comprehensive range of specialized woodworking machinery, supporting precision production at industrial scale.</p>
        </div>
        <div class="hero-caption">
          <p class="eyebrow">Our Projects</p>
          <h1>A 20-Year Portfolio <em>You Can Rely On.</em></h1>
          <p class="hero-lede">Housing communities, giga-projects, hotels, schools and government buildings delivered across the Kingdom since 2004.</p>
        </div>
      </div>
      <div class="hero-cta">
        <a class="btn solid flash" href="contact.html">Start a Project</a>
        <a class="btn" href="projects.html">View Our Work</a>
      </div>
    </div>
    <div class="hero-full-facts">
      <div class="hf-item"><span class="num">237,000+</span><span class="lbl">Wooden doors installed</span></div>
      <div class="hf-item"><span class="num">161,500+ m&sup2;</span><span class="lbl">Cladding, ceiling &amp; flooring works delivered</span></div>
      <div class="hf-item"><span class="num">347,000+ m&sup2;</span><span class="lbl">Kitchens &amp; wardrobes fitted</span></div>
      <div class="hf-item"><span class="num">20,000 m&sup2;</span><span class="lbl">Total built-up factory area</span></div>
    </div>
    <div class="hero-scroll-cue"><span></span></div>
  </section>

  <section class="section">
    <div class="wrap about-grid">
      <div>
        <p class="eyebrow">01 Who We Are</p>
        <h2 style="margin-top:10px;">Built in Jubail.<br>Trusted Across the Kingdom.</h2>
        <p style="margin-top:20px;font-size:1.02rem;">Established in 2004, ARFAD operates in architectural wood works, interior furnishing and wooden furniture manufacturing from Jubail Industrial City.</p>
        <p style="margin-top:16px;font-size:1.02rem;">Specializing in Wooden Doors, Kitchen Cabinets, Wardrobes, Cladding, Ceilings, Wooden Floorings, Timber &amp; WPC Decking, Countertops, Vanities, all types of Joineries and Custom Interior and Exterior Solutions. ARFAD serves residential, hospitality, government, industrial, and mega-project sectors across the Kingdom.</p>
        <div class="hero-cta" style="margin-top:26px;"><a class="btn solid flash" href="about.html">Read Our Story</a><a class="btn" href="why-arfad.html">Why ARFAD</a></div>
      </div>
      <div class="split-img" style="aspect-ratio:16/11;background-image:url('img/who-we-are.jpg');"></div>
    </div>
  </section>

  {photo_band("factory.jpg", f"""
      <p class="eyebrow">02 Mass Production</p>
      <h2 style="margin-top:10px;max-width:28ch;">Built for Scale. Equipped for Excellence.</h2>
      <p class="band-lede">A comprehensive range of specialized woodworking machinery supporting precision cutting, routing, shaping, sanding, pressing, edge banding, veneering, and CNC machining at industrial scale.</p>
      <div class="stat-grid fx-stats">
        <div class="stat-cell flash"><div class="ico-wrap">{icon("factory")}</div><div class="num">20,000 m&sup2;</div><div class="lbl">Total built-up factory area</div></div>
        <div class="stat-cell flash"><div class="ico-wrap">{icon("users")}</div><div class="num">200+</div><div class="lbl">Production employees</div></div>
        <div class="stat-cell flash"><div class="ico-wrap">{icon("wood")}</div><div class="num">237,000+</div><div class="lbl">Wooden doors installed</div></div>
        <div class="stat-cell flash"><div class="ico-wrap">{icon("star")}</div><div class="num">20+</div><div class="lbl">Years of excellence in woodwork</div></div>
      </div>
      <div style="margin-top:32px;" class="hero-cta"><a class="btn" href="factory.html">Explore the Factory</a><a class="btn" href="machinery.html">Machineries</a></div>""")}

  <section class="section on-alt">
    <div class="wrap">
      {head("03 What We Deliver","A full scope of architectural woodwork.","From certified fire-rated doors to custom joinery, traditional heritage carving and modern composite decking.")}
      <div class="svc-grid teaser">{cards}</div>
      <div style="margin-top:32px;"><a class="btn" href="services.html">View All Services</a></div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      {head("04 Our Projects","Every project we deliver is a physical reflection of our standards.","A 20-Year Portfolio You Can Rely On.")}
      <div class="feature-grid sector-grid" style="margin-top:0;">{sec_cards}</div>
      <div style="margin-top:32px;"><a class="btn solid flash" href="projects.html">View Full Project Portfolio</a></div>
      <div style="margin-top:56px;">{clients_marquee()}</div>
    </div>
  </section>

  <section class="section on-alt">
    <div class="wrap">
      {head("05 Media","Latest from ARFAD.","Events, exhibitions and news.")}
      {posts_grid(3)}
      <div style="margin-top:32px;"><a class="btn" href="media.html">View All Posts</a></div>
    </div>
  </section>

  {cta_band()}
</main>'''
    write("index.html", page("ARFAD International Industrial Co.",
        "Architectural wood works, interior furnishing and wooden furniture manufacturing from Jubail Industrial City, KSA since 2004.",
        "index.html", body))

WHO_ITEMS = [("About Us","about.html"),("Vision","vision.html"),("Mission","mission.html"),("Our Values","values.html"),("Why ARFAD","why-arfad.html")]

def who_pages():
    # About Us
    _ex = [("Vision","vision.html","why-arfad.jpg","A regional standard in architectural wood works."),
           ("Mission","mission.html","who-we-are.jpg","High-quality wood works that deliver long-term value."),
           ("Why ARFAD","why-arfad.html","svc-joinery.jpg","A system built for demanding projects.")]
    _ex_cards = "".join(
        '<a class="feature-card flash" href="%s" style="background:linear-gradient(180deg,rgba(10,37,64,.6),rgba(10,37,64,.94)),url(img/%s) center/cover;"><p class="eyebrow">Who We Are</p><h4>%s</h4><p>%s</p><span class="view-link">Read more &rarr;</span></a>' % (h, i, t, d)
        for t, h, i, d in _ex)
    explore_block = section(head("Explore", "More about ARFAD") + '<div class="feature-grid" style="margin-top:0;">' + _ex_cards + '</div>', "on-alt")
    body = f'''<main>
  {subhero([("Who We Are","about.html"),("About Us",None)],"01 Who We Are","Built in Jubail.<br>Trusted Across the Kingdom.","Luxury Wooden Works is Our Professional Identity.","who-we-are.jpg")}
  {subnav(WHO_ITEMS,"about.html")}
  <section class="section"><div class="wrap">
    {split("About Us","Built in Jubail. Trusted Across the Kingdom.",
      ["Established in 2004, ARFAD operates in architectural wood works, interior furnishing and wooden furniture manufacturing from Jubail Industrial City.",
       "Specializing in Wooden Doors, Kitchen Cabinets, Wardrobes, Cladding, Ceilings, Wooden Floorings, Timber &amp; WPC Decking, Countertops, Vanities, all types of Joineries and Custom Interior and Exterior Solutions. ARFAD serves residential, hospitality, government, industrial, and mega-project sectors across the Kingdom."],
      "who-we-are.jpg", extra='<div class="hero-cta" style="margin-top:26px;"><a class="btn solid flash" href="factory.html">Explore the Factory</a><a class="btn" href="projects.html">Our Projects</a></div>')}
  </div></section>
  {photo_band("why-arfad.jpg", f"""
    <div class="stat-grid fx-stats">
      <div class="stat-cell flash"><div class="ico-wrap">{icon("flag")}</div><div class="num">2004</div><div class="lbl">Established in Jubail Industrial City</div></div>
      <div class="stat-cell flash"><div class="ico-wrap">{icon("factory")}</div><div class="num">20,000 m&sup2;</div><div class="lbl">Total built-up factory area</div></div>
      <div class="stat-cell flash"><div class="ico-wrap">{icon("users")}</div><div class="num">200+</div><div class="lbl">Production employees</div></div>
      <div class="stat-cell flash"><div class="ico-wrap">{icon("wood")}</div><div class="num">237,000+</div><div class="lbl">Wooden doors installed</div></div>
    </div>""")}
  {explore_block}
  {cta_band()}
</main>'''
    write("about.html", page("About Us, Who We Are ARFAD", "ARFAD International Industrial Co., architectural wood works, interior furnishing and wooden furniture manufacturing from Jubail Industrial City since 2004.", "about.html", body))

    # Vision
    body = f'''<main>
  {subhero([("Who We Are","about.html"),("Vision",None)],"Philosophy","Our Vision","Where ARFAD is heading.","why-arfad.jpg")}
  {subnav(WHO_ITEMS,"vision.html")}
  <section class="section"><div class="wrap">
    <div class="statement rv"><span class="statement-mark">{icon("target")}</span>
      <p class="statement-text">To become a regional standard in architectural wood works, recognized for precision, integrity, and consistent project delivery.</p></div>
    <div class="vm-row">
      <div class="vm-item rv flash on-light"><div class="ico-wrap">{icon("ruler")}</div><h4>Precision</h4><p>Technical execution to approved drawings and specifications.</p></div>
      <div class="vm-item rv flash on-light" style="--d:.1s"><div class="ico-wrap">{icon("shield")}</div><h4>Integrity</h4><p>Documented procedures and honest delivery on every contract.</p></div>
      <div class="vm-item rv flash on-light" style="--d:.2s"><div class="ico-wrap">{icon("check")}</div><h4>Consistent Project Delivery</h4><p>The same standard from the first unit to the last.</p></div>
    </div>
    {cta_btns(("Read Our Mission","mission.html"),("Why ARFAD","why-arfad.html"))}
  </div></section>
  {cta_band()}
</main>'''
    write("vision.html", page("Vision ARFAD", "ARFAD's vision: to become a regional standard in architectural wood works, recognized for precision, integrity, and consistent project delivery.", "vision.html", body))

    # Mission
    body = f'''<main>
  {subhero([("Who We Are","about.html"),("Mission",None)],"Philosophy","Our Mission","What ARFAD does, every day.","who-we-are.jpg")}
  {subnav(WHO_ITEMS,"mission.html")}
  <section class="section"><div class="wrap">
    <div class="statement rv"><span class="statement-mark">{icon("flag")}</span>
      <p class="statement-text">To design, manufacture, supply, and install high-quality wood works that meet project specifications and deliver long-term value across every sector we serve.</p></div>
    <div class="vm-row four">
      <div class="vm-item rv flash on-light"><div class="ico-wrap">{icon("pen")}</div><h4>Design</h4><p>In-house design studio, with engineers and draftsmen working in direct coordination with production.</p></div>
      <div class="vm-item rv flash on-light" style="--d:.08s"><div class="ico-wrap">{icon("factory")}</div><h4>Manufacture</h4><p>Produced in a 20,000&nbsp;m&sup2; factory with specialized woodworking machinery.</p></div>
      <div class="vm-item rv flash on-light" style="--d:.16s"><div class="ico-wrap">{icon("truck")}</div><h4>Supply</h4><p>Dedicated warehousing and transportation supporting project deliveries across KSA.</p></div>
      <div class="vm-item rv flash on-light" style="--d:.24s"><div class="ico-wrap">{icon("wood")}</div><h4>Install</h4><p>Site installation and handover to the approved specification.</p></div>
    </div>
    {cta_btns(("See Our Process","service-workflow.html"),("Our Vision","vision.html"))}
  </div></section>
  {cta_band()}
</main>'''
    write("mission.html", page("Mission ARFAD", "ARFAD's mission: to design, manufacture, supply, and install high-quality wood works that meet project specifications and deliver long-term value.", "mission.html", body))

    # Values [DRAFT wording built from CP phrases]
    vals = [("ruler","Precision","Technical execution to approved shop drawings and specifications."),
            ("shield","Integrity","Documented procedures, honest reporting and accountable delivery."),
            ("check","Consistency","Consistent project delivery, from the first unit to the last."),
            ("star","Quality","Quality built into every stage, backed by an ISO 9001:2015 certified system."),
            ("flame","Safety","Safe workplaces for our people, our subcontractors and the sites we work on."),
            ("leaf","Responsibility","Responsible wood sourcing through FSC Chain of Custody certification.")]
    cells = "".join(f'<div class="value-card rv flash on-light" style="--d:{(i%3)*.08:.2f}s"><div class="ico-wrap">{icon(ic)}</div><h4>{t}</h4><p>{d}</p></div>' for i,(ic,t,d) in enumerate(vals))
    body = f'''<main>
  {subhero([("Who We Are","about.html"),("Our Values",None)],"Philosophy","Our Values","The principles behind every ARFAD project.","svc-joinery.jpg")}
  {subnav(WHO_ITEMS,"values.html")}
  <section class="section"><div class="wrap">
    {head("What guides us","Precision, integrity and consistent delivery.","Drawn from our vision, our quality framework and our commitment to safety and responsible sourcing.")}
    <div class="value-grid">{cells}</div>
  </div></section>
  {cta_band()}
</main>'''
    write("values.html", page("Our Values ARFAD", "The values behind ARFAD's work: precision, integrity, consistency, quality, safety and responsibility.", "values.html", body))

    # Why ARFAD
    why = [("gear","Controlled Manufacturing","A 20,000 m² factory with dedicated production zones, from raw material storage to quality control."),
           ("ruler","Technical Execution","Engineers and draftsmen working in direct coordination with production and project teams."),
           ("factory","Scalable Production","Specialized woodworking machinery supporting cutting, CNC machining and finishing at industrial scale."),
           ("truck","Project Readiness","Dedicated warehousing and transportation supporting project deliveries across KSA."),
           ("shield","Unyielding Quality Control","Every stage is reviewed, from incoming material inspection to site installation inspection."),
           ("star","Guaranteed Excellence","Twenty-plus years of delivery for the Kingdom's leading developers and authorities.")]
    cells = "".join(f'<div class="value-card rv flash on-light" style="--d:{(i%3)*.08:.2f}s"><div class="ico-wrap">{icon(ic)}</div><h4>{t}</h4><p>{d}</p></div>' for i,(ic,t,d) in enumerate(why))
    body = f'''<main>
  {subhero([("Who We Are","about.html"),("Why ARFAD",None)],"Why ARFAD","A System Built for<br>Demanding Projects.","Controlled manufacturing, technical execution, scalable production, project readiness, unyielding quality control and guaranteed excellence.","why-arfad.jpg")}
  {subnav(WHO_ITEMS,"why-arfad.html")}
  <section class="section"><div class="wrap">
    {head("The ARFAD system","Six reasons clients trust ARFAD.")}
    <div class="value-grid">{cells}</div>
  </div></section>
  {cta_band()}
</main>'''
    write("why-arfad.html", page("Why ARFAD", "A system built for demanding projects: controlled manufacturing, technical execution, scalable production, project readiness, unyielding quality control and guaranteed excellence.", "why-arfad.html", body))

def services_pages():
    cards = "".join(svc_card(s, i) for i, s in enumerate(SERVICES))
    body = f'''<main>
  {subhero([("Services",None)],"01 What We Deliver","A full scope of<br>architectural woodwork.","One factory, from certified fire-rated doors to custom joinery, traditional heritage carving and modern composite decking.","svc-doors.jpg")}
  <section class="section"><div class="wrap">
    <div class="svc-grid">{cards}</div>
  </div></section>
  {cta_band()}
</main>'''
    write("services.html", page("Services ARFAD", "Wooden doors, wall claddings, ceilings, floorings, kitchens, wardrobes, vanities, reception counters, furniture, exterior woodworks, countertops and traditional woodworks.", "services.html", body))

    for i, s in enumerate(SERVICES):
        extra = s.get("extra")
        blocks = []
        paras = s["intro"]
        blocks.append(f'<section class="section"><div class="wrap">{split(s["tagline"], esc(s["title"]), paras, s["img"], extra=cta_btns(("Request a Quote","contact.html"),("All Services","services.html")))}</div></section>')
        scope_html = head("Scope & subdivisions", esc(s["scope_title"])) + scope_grid(s["scope"])
        if s.get("scope2"):
            scope_html += f'<div style="margin-top:56px;">{head("", esc(s["scope2_title"]))}{scope_grid(s["scope2"], "wood")}</div>'
        blocks.append(f'<section class="section on-alt"><div class="wrap">{scope_html}</div></section>')
        if extra and extra["kind"] == "fire":
            blocks.append(photo_band("svc-doors.jpg", f"""
      <p class="eyebrow">{extra["eyebrow"]}</p>
      <h2 style="margin-top:10px;max-width:22ch;">{extra["title"]}</h2>
      <p class="band-lede" style="max-width:60ch;">{extra["lead"]}</p>
      <p class="band-lede" style="max-width:60ch;">{extra["text"]}</p>
      <div class="badge-line"><span>{icon("shield")}{extra["badge"]}</span><span>{icon("flame")}{extra["badge2"]}</span></div>
      <div style="margin-top:26px;" class="hero-cta"><a class="btn" href="certificates.html">View Fire-Rated Certificates</a></div>""", overlay=.82))
        if extra and extra["kind"] == "apps":
            blocks.append(photo_band("svc-wpc.jpg", f"""
      <p class="eyebrow">{extra["eyebrow"]}</p>
      <h2 style="margin-top:10px;max-width:24ch;">{extra["title"]}</h2>
      <p class="band-lede" style="max-width:62ch;">{extra["text"]}</p>
      <div class="chip-cloud">{"".join(f'<span class="chip-dark flash">{t}</span>' for t in extra["items"])}</div>
      <p class="photo-note">{extra["note"]}</p>""", overlay=.84))
        rel = [p for p in s["projects"] if p in PROJECT_PAGES]
        imgs = []
        for p in rel:
            imgs += PROJECT_PAGES[p]["imgs"][:3]
        parts = ""
        if rel:
            parts += head("Where we have delivered", "Related projects") + '<div class="feature-grid" style="margin-top:0;">' + "".join(project_card(p) for p in rel[:3]) + "</div>"
        if imgs:
            parts += f'<div style="margin-top:56px;">{head("Photo gallery", esc(s["title"]) + ", on site")}{gallery(imgs[:9])}</div>'
        if parts:
            blocks.append(f'<section class="section"><div class="wrap">{parts}</div></section>')
        blocks.append(f'<section class="section on-alt"><div class="wrap">{head("Explore","Other services from ARFAD.")}{other_services(s["slug"])}</div></section>')
        body = f'''<main>
  {subhero([("Services","services.html"),(esc(s["title"]),None)],f"{i+1:02d} Our Services", esc(s["title"]), s["tagline"], s["img"])}
  {chr(10).join(blocks)}
  {cta_band(f"Ready to start your {esc(s['title']).lower()} project?")}
</main>'''
        write(f"service-{s['slug']}.html", page(f"{s['title']} ARFAD", s["tagline"] + ". " + s["intro"][0], f"service-{s['slug']}.html", body))
