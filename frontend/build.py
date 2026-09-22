#!/usr/bin/env python3
import os

ROOT = os.path.dirname(os.path.abspath(__file__))

SITE_URL = "https://www.arfad.com.sa"

NAV_LINKS = [
    ("index.html", "Home"),
    ("about.html", "Who We Are"),
    ("services.html", "Services"),
    ("projects.html", "Projects"),
    ("factory.html", "Factory"),
    ("quality.html", "Quality"),
    ("contact.html", "Contact"),
]

def nav(active):
    links = []
    for href, label in NAV_LINKS:
        cur = ' aria-current="page"' if href == active else ""
        links.append(f'<a href="{href}"{cur}>{label}</a>')
    links_html = "\n      ".join(links)
    cta = "Request a Quote" if active != "contact.html" else "Email Us"
    cta_href = "contact.html" if active != "contact.html" else "mailto:info@arfad.com.sa"
    return f'''<header class="nav">
  <div class="nav-inner">
    <a class="brand" href="index.html">
      <img class="brand-mark" src="img/logo.png" alt="ARFAD logo">
      <span class="brand-name"><img src="img/wordmark.png" alt="ARFAD" style="height:15px;width:auto;display:block;"></span>
    </a>
    <nav class="links" id="primary-nav">
      {links_html}
    </nav>
    <a class="btn solid cta-desktop" href="{cta_href}">{cta}</a>
    <button type="button" class="nav-toggle" aria-expanded="false" aria-controls="primary-nav" aria-label="Open menu">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>'''

FOOTER = '''<footer id="contact">
  <div class="wrap foot-grid">
    <div>
      <img class="brand-mark lg" src="img/logo.png" alt="ARFAD logo" style="margin-bottom:14px;">
      <img src="img/wordmark.png" alt="ARFAD" style="height:22px;width:auto;display:block;margin-bottom:14px;">
      <h4 style="text-transform:none;letter-spacing:0;font-size:.95rem;color:var(--paper-on-navy);">ARFAD International Industrial Co.</h4>
      <p style="margin-top:8px;max-width:34ch;">Crafting excellence in wood since 2004. Luxury wooden works is our professional identity.</p>
    </div>
    <div class="foot-col-offset">
      <h4>Address</h4>
      <p>Support Industrial<br>Jubail Industrial City, KSA</p>
    </div>
    <div class="foot-col-offset">
      <h4>Contact</h4>
      <a href="tel:+966133417773">+966 13 341 7773</a>
      <a href="https://wa.me/966561210469">WhatsApp +966 56 121 0469</a>
      <a href="mailto:info@arfad.com.sa">info@arfad.com.sa</a>
    </div>
    <div class="foot-col-offset">
      <h4>Credentials</h4>
      <p>ISO 9001:2015 &middot; ISO 14001:2015<br>ISO 45001:2018 &middot; FSC&reg; CoC Certified</p>
      <p style="margin-top:8px;">Aramco Vendor 10064085<br>Royal Commission Vendor 14902<br>Red Sea Global Vendor S10357393</p>
    </div>
  </div>
  <div class="wrap foot-bottom">
    <span class="doc-tag">&copy; 2026 ARFAD International Industrial Co. Est. 2004</span>
    <span class="doc-tag">20+ Years of Excellence in Woodwork</span>
  </div>
</footer>'''

WHATSAPP_FAB = '''<a class="whatsapp-fab" href="https://wa.me/966561210469" target="_blank" rel="noopener" aria-label="Chat with ARFAD on WhatsApp">
  <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor" aria-hidden="true"><path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.386.699 4.606 1.902 6.47L4 29l7.72-1.865A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.6a9.57 9.57 0 0 1-4.885-1.34l-.35-.207-4.58 1.106 1.223-4.463-.228-.365A9.56 9.56 0 0 1 5.6 15c0-5.735 4.668-10.4 10.404-10.4C21.738 4.6 26.4 9.265 26.4 15s-4.662 10.4-10.396 10.4Zm5.71-7.79c-.313-.157-1.85-.913-2.137-1.017-.287-.104-.496-.157-.705.157-.208.313-.808 1.017-.99 1.226-.183.209-.365.235-.678.078-.313-.157-1.322-.487-2.518-1.552-.93-.83-1.559-1.855-1.741-2.168-.183-.313-.02-.482.137-.638.14-.14.313-.365.47-.548.157-.183.209-.313.313-.522.104-.209.052-.391-.026-.548-.078-.157-.705-1.7-.966-2.328-.254-.61-.512-.527-.705-.537l-.6-.011c-.209 0-.548.078-.835.391-.287.313-1.096 1.07-1.096 2.612s1.122 3.03 1.278 3.239c.157.209 2.208 3.372 5.35 4.728.747.323 1.33.516 1.784.66.749.238 1.431.204 1.97.124.601-.09 1.85-.756 2.11-1.487.261-.73.261-1.356.183-1.487-.078-.13-.287-.209-.6-.365Z"/></svg>
</a>'''

THEME_SWITCH = '''<div class="theme-switch" id="themeSwitch" role="group" aria-label="Color theme">
  <button type="button" class="theme-switch-btn" data-theme-choice="dark" aria-label="Dark mode" aria-pressed="false">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
  </button>
  <button type="button" class="theme-switch-btn" data-theme-choice="light" aria-label="Light mode" aria-pressed="true">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path></svg>
  </button>
</div>'''

THEME_INIT = '''<script>
(function(){
  try{
    var t = localStorage.getItem("arfad-theme") || "light";
    document.documentElement.setAttribute("data-theme", t);
  }catch(e){
    document.documentElement.setAttribute("data-theme", "light");
  }
})();
</script>'''

HEAD = '''<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="{canonical}">
<meta name="theme-color" content="#091423">
<meta property="og:type" content="website">
<meta property="og:site_name" content="ARFAD International Industrial Co.">
<meta property="og:title" content="{og_title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{canonical}">
<meta property="og:image" content="{site_url}/img/hero.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{og_title}">
<meta name="twitter:description" content="{desc}">
<meta name="twitter:image" content="{site_url}/img/hero.jpg">
<link rel="icon" href="img/logo.png">
<link rel="stylesheet" href="styles.css">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;1,500&display=swap">'''

ORG_SCHEMA = f'''<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "ARFAD International Industrial Co.",
  "alternateName": "ARFAD",
  "url": "{SITE_URL}/",
  "logo": "{SITE_URL}/img/logo.png",
  "image": "{SITE_URL}/img/hero.jpg",
  "description": "Architectural wood works, interior furnishing and wooden furniture manufacturing from Jubail Industrial City, KSA since 2004.",
  "foundingDate": "2004",
  "address": {{
    "@type": "PostalAddress",
    "streetAddress": "Support Industrial",
    "addressLocality": "Jubail Industrial City",
    "addressCountry": "SA"
  }},
  "telephone": "+966-13-341-7773",
  "email": "info@arfad.com.sa",
  "sameAs": []
}}
</script>'''

DOCTYPE_OPEN = '''<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
{head}
</head>
<body>
'''
DOCTYPE_CLOSE = '''
</body>
</html>
'''

JS_REVEAL_INIT = '''<script>
document.documentElement.classList.add("has-js");
if("scrollRestoration" in history){ history.scrollRestoration = "manual"; }
window.scrollTo(0,0);
window.addEventListener("pageshow", function(){ window.scrollTo(0,0); });
window.addEventListener("load", function(){ window.scrollTo(0,0); });
</script>'''

TRACK_SCRIPT = '''<script>
(function(){
  try{
    var payload = JSON.stringify({ path: location.pathname, referrer: document.referrer || null });
    if(navigator.sendBeacon){
      navigator.sendBeacon("/api/visit", new Blob([payload], { type: "application/json" }));
    } else {
      fetch("/api/visit", { method: "POST", headers: { "Content-Type": "application/json" }, body: payload, keepalive: true }).catch(function(){});
    }
  }catch(e){}
})();
</script>'''
JS_REVEAL_OBSERVER = '''<script>
(function(){
  var sel = ".head,.svc-card,.cert-card,.cert-photo-card,.feature-card,.stat-cell,.contact-card,.vm-item,.process-step,.table-wrap,.about-grid>div,.qual-cols>*,.detail-hero .wrap>*,.img-divider,.thumb-grid>*,.why-item,.client-band,.client-marquee,.foot-grid>*";
  var els = document.querySelectorAll(sel);
  if(!("IntersectionObserver" in window)){
    els.forEach(function(e){ e.classList.add("reveal-in"); });
    return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(en.isIntersecting){ en.target.classList.add("reveal-in"); io.unobserve(en.target); }
    });
  }, {threshold:.12, rootMargin:"0px 0px -60px 0px"});
  els.forEach(function(e){ io.observe(e); });
})();

/* hero slider: dot navigation + auto-advance (replaces the pure-CSS crossfade so slides, captions and dots stay in sync) */
(function(){
  document.querySelectorAll(".hero-slider").forEach(function(hero){
    var slides = Array.prototype.slice.call(hero.querySelectorAll(":scope > .slide"));
    var captions = Array.prototype.slice.call(hero.querySelectorAll(".hero-caption-track > .hero-caption"));
    var dotsBox = hero.querySelector(":scope > .hero-dots");
    if(slides.length < 2 || !dotsBox) return;
    var i = 0, timer;
    var dots = slides.map(function(_, idx){
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Show slide " + (idx + 1));
      if(idx === 0) b.classList.add("active");
      b.addEventListener("click", function(){ go(idx); restart(); });
      dotsBox.appendChild(b);
      return b;
    });
    function go(n){
      slides[i].classList.remove("active");
      if(captions[i]) captions[i].classList.remove("active");
      dots[i].classList.remove("active");
      i = n;
      slides[i].classList.add("active");
      if(captions[i]) captions[i].classList.add("active");
      dots[i].classList.add("active");
    }
    function restart(){
      clearInterval(timer);
      timer = setInterval(function(){ go((i + 1) % slides.length); }, 6500);
    }
    slides[0].classList.add("active");
    if(captions[0]) captions[0].classList.add("active");
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if(!reduceMotion) restart();
  });
})();

/* count-up effect for stat numbers (hero facts band + factory/quality stat grids) */
(function(){
  var nums = document.querySelectorAll(".hf-item .num, .stat-cell .num");
  if(!nums.length) return;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function parseTarget(text){
    var m = text.match(/[\\d,]+(\\.\\d+)?/);
    if(!m) return null;
    var raw = m[0];
    var value = parseFloat(raw.replace(/,/g, ""));
    if(isNaN(value)) return null;
    return {
      value: value,
      prefix: text.slice(0, m.index),
      suffix: text.slice(m.index + raw.length),
      decimals: raw.indexOf(".") > -1 ? raw.split(".")[1].length : 0
    };
  }

  function format(n, decimals){
    return n.toLocaleString("en-US", {minimumFractionDigits: decimals, maximumFractionDigits: decimals});
  }

  function animate(el, target){
    if(reduceMotion){ el.textContent = target.prefix + format(target.value, target.decimals) + target.suffix; return; }
    var duration = 1700, start = null;
    function ease(t){ return 1 - Math.pow(1 - t, 3); }
    function step(ts){
      if(start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var current = target.value * ease(p);
      el.textContent = target.prefix + format(current, target.decimals) + target.suffix;
      if(p < 1) requestAnimationFrame(step);
      else el.textContent = target.prefix + format(target.value, target.decimals) + target.suffix;
    }
    requestAnimationFrame(step);
  }

  var parsed = [];
  nums.forEach(function(el){
    var t = parseTarget(el.textContent);
    if(t){ parsed.push({el: el, target: t}); el.textContent = t.prefix + format(0, t.decimals) + t.suffix; }
  });

  if(!("IntersectionObserver" in window)){
    parsed.forEach(function(p){ animate(p.el, p.target); });
    return;
  }
  var io2 = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(en.isIntersecting){
        var match = parsed.filter(function(p){ return p.el === en.target; })[0];
        if(match){ animate(match.el, match.target); }
        io2.unobserve(en.target);
      }
    });
  }, {threshold:.4});
  parsed.forEach(function(p){ io2.observe(p.el); });
})();

/* light/dark mode switcher */
(function(){
  var group = document.getElementById("themeSwitch");
  if(!group) return;
  var btns = Array.prototype.slice.call(group.querySelectorAll(".theme-switch-btn"));
  function current(){ return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light"; }
  function sync(){
    var t = current();
    btns.forEach(function(b){
      var active = b.getAttribute("data-theme-choice") === t;
      b.classList.toggle("active", active);
      b.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }
  sync();
  btns.forEach(function(b){
    b.addEventListener("click", function(){
      var next = b.getAttribute("data-theme-choice");
      document.documentElement.setAttribute("data-theme", next);
      try{ localStorage.setItem("arfad-theme", next); }catch(e){}
      sync();
    });
  });
})();

/* mobile nav toggle */
(function(){
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");
  if(!toggle || !nav) return;
  toggle.addEventListener("click", function(){
    var open = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  nav.querySelectorAll("a").forEach(function(a){
    a.addEventListener("click", function(){
      document.body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    });
  });
})();

/* header background after scrolling past 50px */
(function(){
  var header = document.querySelector("header.nav");
  if(!header) return;
  function onScroll(){
    header.classList.toggle("nav-scrolled", window.scrollY > 50);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, {passive:true});
})();

</script>'''

SLIDES = ["hero.jpg", "factory.jpg", "proj-rc.jpg", "proj-rsg.jpg"]

def slider(compact=True, extra_class=""):
    slides = "\n  ".join(f'<div class="slide" style="background-image:url(\'img/{s}\');"></div>' for s in SLIDES)
    cls = "hero-slider compact" if compact else "hero-slider"
    if extra_class:
        cls += " " + extra_class
    return cls, slides

def _strip_tags(s):
    import re
    return re.sub(r"&\w+;", "", re.sub(r"<[^>]+>", "", s))

def page(title, desc, active, body, extra_head="", wrap=True, path=None):
    canonical_path = path or active
    canonical = f"{SITE_URL}/{canonical_path}"
    og_title = _strip_tags(title)
    head = THEME_INIT + "\n" + HEAD.format(title=title, desc=desc, canonical=canonical, og_title=og_title, site_url=SITE_URL)
    head += "\n" + ORG_SCHEMA
    if extra_head:
        head += "\n" + extra_head
    content = JS_REVEAL_INIT + "\n" + nav(active) + "\n" + body + "\n" + FOOTER + "\n" + WHATSAPP_FAB + "\n" + THEME_SWITCH + "\n" + JS_REVEAL_OBSERVER + "\n" + TRACK_SCRIPT
    if wrap:
        # standalone page (served as-is, not auto-wrapped by the Artifact skeleton)
        return DOCTYPE_OPEN.format(head=head) + content + DOCTYPE_CLOSE
    else:
        # entry page: the Artifact tool wraps this one in its own skeleton
        return head + "\n" + content

def write(name, content):
    with open(os.path.join(ROOT, name), "w") as f:
        f.write(content)
    print("wrote", name)

# ---------- INDEX ----------
idx_body = '''<main id="top">
  <section class="hero-slider hero-full">
    <div class="slide video-slide" style="background-image:url('img/svc-doors.jpg');">
      <video autoplay muted loop playsinline preload="auto" poster="img/svc-doors.jpg">
        <source src="img/hero-door.mp4" type="video/mp4">
      </video>
    </div>
    <div class="slide" style="background-image:url('img/svc-cladding.jpg');"></div>
    <div class="slide" style="background-image:url('img/svc-thermowood.jpg');"></div>
    <div class="hero-overlay"></div>
    <div class="hero-dots"></div>
    <div class="wrap hero-full-inner">
      <div class="hero-caption-track">
        <div class="hero-caption">
          <p class="eyebrow">01 Wooden Doors</p>
          <h1>Two decades of mastery <em>in wood.</em></h1>
          <p class="hero-lede">Architectural wood works, interior furnishing and wooden furniture manufacturing, engineered and produced from a 20,000&nbsp;m&sup2; factory in Jubail Industrial City trusted across the Kingdom's most demanding projects since 2004.</p>
        </div>
        <div class="hero-caption">
          <p class="eyebrow">02 Cladding &amp; Ceilings</p>
          <h1>Architectural cladding, <em>engineered to last.</em></h1>
          <p class="hero-lede">Internal and external wall cladding, decorative and slatted ceilings finished to withstand the Kingdom's climate.</p>
        </div>
        <div class="hero-caption">
          <p class="eyebrow">03 Thermowood &amp; WPC</p>
          <h1>Outdoor finishes built <em>for extremes.</em></h1>
          <p class="hero-lede">Thermally modified timber and WPC decking, cladding and pergolas engineered for heat, humidity and weather resistance.</p>
        </div>
      </div>
      <div class="hero-cta">
        <a class="btn solid" href="contact.html">Start a Project</a>
        <a class="btn" href="projects.html">View Our Work</a>
      </div>
    </div>
    <div class="hero-full-facts">
      <div class="hf-item"><span class="num">237,000+</span><span class="lbl">Wooden doors installed</span></div>
      <div class="hf-item"><span class="num">347,000 m&sup2;</span><span class="lbl">Kitchens &amp; wardrobes fitted</span></div>
      <div class="hf-item"><span class="num">20,000 m&sup2;</span><span class="lbl">Factory in Jubail</span></div>
      <div class="hf-item"><span class="num">200+</span><span class="lbl">Production employees</span></div>
    </div>
    <div class="hero-scroll-cue"><span></span></div>
  </section>

  <section class="section">
    <div class="wrap about-grid">
      <div>
        <p class="eyebrow">01 Who We Are</p>
        <h2 style="margin-top:10px;">Built in Jubail.<br>Trusted across the Kingdom.</h2>
        <p style="margin-top:20px;font-size:1.02rem;">Established in 2004, ARFAD operates in architectural wood works, interior furnishing and wooden furniture manufacturing from Jubail Industrial City serving residential, hospitality, government, industrial, and mega-project sectors across the Kingdom.</p>
        <p style="margin-top:16px;font-size:1.02rem;">Every project is engineered and produced in-house, from raw timber to finished installation, giving clients a single accountable partner from design through delivery. Two decades of certifications, vendor registrations and repeat business stand behind that promise.</p>
        <div class="hero-cta" style="margin-top:26px;">
          <a class="btn solid" href="about.html">Read Our Story</a>
        </div>
      </div>
      <div style="border-radius:16px;overflow:hidden;box-shadow:var(--shadow);aspect-ratio:16/11;background:url('img/who-we-are.jpg') center/cover;"></div>
    </div>
  </section>

  <div class="img-divider" style="background-image:url('img/svc-joinery.jpg');"></div>

  <section class="section on-alt">
    <div class="wrap">
      <div class="head">
        <p class="eyebrow">02 What We Deliver</p>
        <h2>A full scope of architectural woodwork.</h2>
        <p class="ink-soft">Nine disciplines, one factory from certified fire-rated doors to custom joinery, traditional heritage carving and modern composite decking.</p>
      </div>
      <div class="svc-grid teaser">
        <a class="svc-card" href="service-doors.html">
          <div class="thumb" style="background-image:url('img/mod-doors-teaser.jpg');"></div>
          <div class="body"><span class="idx">01</span><h3>Wooden Doors</h3><p>Fire-rated to X-ray protected, certified up to 120 minutes.</p></div>
        </a>
        <a class="svc-card" href="service-joinery.html">
          <div class="thumb" style="background-image:url('img/svc-joinery.jpg');"></div>
          <div class="body"><span class="idx">02</span><h3>Joinery</h3><p>Custom joints, timber framing and architectural moldings.</p></div>
        </a>
        <a class="svc-card" href="service-cabinets.html">
          <div class="thumb" style="background-image:url('img/svc-interior.jpg');"></div>
          <div class="body"><span class="idx">03</span><h3>Interior Woodworks</h3><p>Kitchen cabinets, wardrobes, vanities and storage systems.</p></div>
        </a>
        <a class="svc-card" href="service-cladding.html">
          <div class="thumb" style="background-image:url('img/svc-cladding.jpg');"></div>
          <div class="body"><span class="idx">04</span><h3>Cladding &amp; Ceilings</h3><p>Internal and external wall cladding, decorative and slatted ceilings.</p></div>
        </a>
        <a class="svc-card" href="service-thermowood.html">
          <div class="thumb" style="background-image:url('img/svc-thermowood.jpg');"></div>
          <div class="body"><span class="idx">05</span><h3>Thermowood</h3><p>Exterior cladding, decking, pergolas, louvers and canopies.</p></div>
        </a>
        <a class="svc-card" href="service-furniture.html">
          <div class="thumb" style="background-image:url('img/svc-furniture.jpg');"></div>
          <div class="body"><span class="idx">06</span><h3>Furniture &amp; Interiors</h3><p>Loose, hotel, restaurant and office furniture, custom pieces.</p></div>
        </a>
        <a class="svc-card" href="service-countertops.html">
          <div class="thumb" style="background-image:url('img/svc-countertops-reception.jpg');"></div>
          <div class="body"><span class="idx">07</span><h3>Countertops &amp; Surfaces</h3><p>Natural stone, engineered stone and quartz, fabricated in-house.</p></div>
        </a>
        <a class="svc-card" href="service-traditional.html">
          <div class="thumb" style="background-image:url('img/svc-traditional.jpg');"></div>
          <div class="body"><span class="idx">08</span><h3>Traditional Woodworks</h3><p>Hand-carved panels, mashrabiya screens, Islamic-patterned doors.</p></div>
        </a>
        <a class="svc-card" href="service-wpc.html">
          <div class="thumb" style="background-image:url('img/svc-wpc.jpg');"></div>
          <div class="body"><span class="idx">09</span><h3>WPC Works</h3><p>Wood-look decking, cladding and pergolas built for weather resistance.</p></div>
        </a>
      </div>
      <div style="margin-top:32px;"><a class="btn" href="services.html">View All 9 Services</a></div>
    </div>
  </section>

  <section class="section on-navy" style="background:linear-gradient(180deg, rgba(10,37,64,.93), rgba(10,37,64,.97)), url('img/factory.jpg') center/cover;">
    <div class="wrap">
      <p class="eyebrow">03 Factory &amp; Technology</p>
      <h2 style="margin-top:10px;max-width:26ch;">Built for scale. Equipped for excellence.</h2>
      <div class="stat-grid">
        <div class="stat-cell"><div class="num">20,000 m&sup2;</div><div class="lbl">Total built-up factory area</div></div>
        <div class="stat-cell"><div class="num">200+</div><div class="lbl">Production employees</div></div>
        <div class="stat-cell"><div class="num">30+</div><div class="lbl">CNC &amp; precision machines</div></div>
        <div class="stat-cell"><div class="num">2004</div><div class="lbl">Operating since</div></div>
      </div>
      <div style="margin-top:32px;"><a class="btn" href="factory.html">Explore the Factory</a></div>
    </div>
  </section>

  <div class="img-divider" style="background-image:url('img/svc-furniture.jpg');"></div>

  <section class="section">
    <div class="wrap">
      <div class="head">
        <p class="eyebrow">04 Our Projects</p>
        <h2>Trusted by the Kingdom's leading organisations.</h2>
        <p class="ink-soft">A twenty-year portfolio spanning royal commissions, national giga-projects and the Kingdom's leading developers.</p>
      </div>
      <div class="feature-grid">
        <a class="feature-card" href="project-royal-commission.html" style="background:linear-gradient(180deg,rgba(10,37,64,.55),rgba(10,37,64,.93)), url('img/proj-rc.jpg') center/cover;">
          <p class="eyebrow">Royal Commission &middot; Jubail &amp; Yanbu</p>
          <h4>Registered Vendor No. 14902</h4>
          <p>7 housing &amp; school phases across Jubail.</p>
        </a>
        <a class="feature-card" href="project-saudi-aramco.html" style="background:linear-gradient(180deg,rgba(10,37,64,.55),rgba(10,37,64,.93)), url('img/proj-aramco.jpg') center/cover;">
          <p class="eyebrow">Saudi Aramco</p>
          <h4>Registered Vendor No. 10064085</h4>
          <p>Al Mutrafiah, SDHOP, SATORP &amp; King Salman Maritime Complex.</p>
        </a>
        <a class="feature-card" href="project-redsea-amaala.html" style="background:linear-gradient(180deg,rgba(10,37,64,.55),rgba(10,37,64,.93)), url('img/proj-rsg.jpg') center/cover;">
          <p class="eyebrow">Red Sea Global &amp; AMAALA</p>
          <h4>Registered Vendor No. S10357393</h4>
          <p>4,758+ doors across staff villages and luxury resorts.</p>
        </a>
        <a class="feature-card" href="project-neom.html" style="background:linear-gradient(180deg,rgba(10,37,64,.55),rgba(10,37,64,.93)), url('img/proj-neom.jpg') center/cover;">
          <p class="eyebrow">NEOM</p>
          <h4>Multipurpose Hall, Auditorium &amp; VIP Lounge</h4>
          <p>100 doors, 1,700 m&sup2; cladding, bespoke joinery and premium VIP-grade finishes.</p>
        </a>
        <a class="feature-card" href="project-ministry-of-defense.html" style="background:linear-gradient(180deg,rgba(10,37,64,.55),rgba(10,37,64,.93)), url('img/proj-mod.jpg') center/cover;">
          <p class="eyebrow">Ministry of Defense</p>
          <h4>Supporting Buildings &middot; Al Qassim</h4>
          <p>Doors for 100 flats, 1,500 m&sup2; wall cladding and 250 m&sup2; ceiling works.</p>
        </a>
        <a class="feature-card" href="projects.html" style="background:linear-gradient(180deg,rgba(10,37,64,.55),rgba(10,37,64,.93)), url('img/proj-hospitality.jpg') center/cover;">
          <p class="eyebrow">Hospitality &amp; Commercial</p>
          <h4>Movenpick, KARAN, MISK, KAFD</h4>
          <p>5-star hotel joinery, school campuses and premium woodworks across Riyadh's financial district.</p>
        </a>
      </div>
      <div style="margin-top:32px;"><a class="btn solid" href="projects.html">View Full Project Portfolio</a></div>
    </div>
  </section>

  <div class="img-divider" style="background-image:url('img/svc-thermowood.jpg');"></div>

  <section class="section cta-band">
    <div class="wrap" style="text-align:center;">
      <p class="eyebrow" style="justify-content:center;">Get in touch</p>
      <h2 style="margin-top:14px;font-size:clamp(1.9rem,4vw,2.8rem);max-width:22ch;margin-inline:auto;">Let's build something that lasts twenty years.</h2>
      <div class="hero-cta" style="justify-content:center;margin-top:30px;">
        <a class="btn cta-band-btn" href="contact.html">Request a Quote</a>
        <a class="btn cta-band-btn-outline" href="mailto:info@arfad.com.sa">Email Us</a>
      </div>
    </div>
  </section>
</main>'''
write("index.html", page(
    "ARFAD International Industrial Co.",
    "Architectural wood works, interior furnishing and wooden furniture manufacturing from Jubail Industrial City, KSA since 2004.",
    "index.html", idx_body, wrap=False))

# ---------- ABOUT ----------
about_body = '''<main>
  <section class="hero-slider compact">
    <div class="slide" style="background-image:url('img/who-we-are.jpg');"></div>
    <div class="slide" style="background-image:url('img/svc-joinery.jpg');"></div>
    <div class="slide" style="background-image:url('img/svc-interior.jpg');"></div>
    <div class="hero-overlay"></div>
    <div class="hero-dots"></div>
    <div class="wrap">
      <p class="crumb"><a href="index.html">Home</a> / Who We Are</p>
      <div class="hero-caption-track">
        <div class="hero-caption">
          <p class="eyebrow">01 Who We Are</p>
          <h1>Built in Jubail.<br>Trusted across the Kingdom.</h1>
          <p class="hero-lede">Two decades of mastery in architectural wood works, interior furnishing and wooden furniture manufacturing.</p>
        </div>
        <div class="hero-caption">
          <p class="eyebrow">Custom Joinery</p>
          <h1>Precision joinery,<br>crafted in-house.</h1>
          <p class="hero-lede">Every cabinet, door frame and fitted unit engineered and produced under one roof.</p>
        </div>
        <div class="hero-caption">
          <p class="eyebrow">Interior Furnishing</p>
          <h1>Interiors finished<br>to the last detail.</h1>
          <p class="hero-lede">From kitchens to wardrobes, our interior furnishing carries the same standard across every project.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap about-grid">
      <div style="border-radius:16px;overflow:hidden;box-shadow:var(--shadow);aspect-ratio:16/10;background:url('img/who-we-are.jpg') center/cover;"></div>
      <div>
        <p class="eyebrow">01 Who We Are</p>
        <h2 style="margin-top:10px;">Built in Jubail.<br>Trusted across the Kingdom.</h2>
        <p style="margin-top:20px;font-size:1.02rem;">Established in 2004, ARFAD operates in architectural wood works, interior furnishing and wooden furniture manufacturing from Jubail Industrial City.</p>
        <p>Specializing in wooden doors, kitchen cabinets, wardrobes, cladding, ceilings, wooden flooring, timber &amp; WPC decking, countertops, vanities, all types of joineries and custom interior and exterior solutions ARFAD serves residential, hospitality, government, industrial, and mega-project sectors across the Kingdom.</p>
      </div>
    </div>
    <div class="wrap vm-row">
      <div class="vm-item">
        <h4>Vision</h4>
        <p>To become a regional standard in architectural wood works recognized for precision, integrity, and consistent project delivery.</p>
      </div>
      <div class="vm-item">
        <h4>Mission</h4>
        <p>To design, manufacture, supply, and install high-quality wood works that meet project specifications and deliver long-term value across every sector we serve.</p>
      </div>
      <div class="vm-item">
        <h4>Why ARFAD</h4>
        <p>A system built for demanding projects controlled manufacturing, technical execution, and scalable production backed by unyielding quality control.</p>
      </div>
    </div>
  </section>

  <div class="img-divider" style="background-image:url('img/why-arfad.jpg');"></div>

  <section class="section on-alt">
    <div class="wrap">
      <div class="head">
        <p class="eyebrow">02 Our Process</p>
        <h2>From drawing to delivery.</h2>
        <p class="ink-soft">Six controlled stages carry every project from brief to handover, with quality review built into each one.</p>
      </div>
      <div style="border-radius:16px;overflow:hidden;box-shadow:var(--shadow);aspect-ratio:16/7;margin-bottom:36px;background:url('img/from-drawing-to-delivery.jpg') center/cover;"></div>
      <div class="process-list">
        <div class="process-step"><div class="n">01</div><h4>Client Brief &amp; Requirements</h4></div>
        <div class="process-step"><div class="n">02</div><h4>Design &amp; Engineering</h4></div>
        <div class="process-step"><div class="n">03</div><h4>Material Selection &amp; Procurement</h4></div>
        <div class="process-step"><div class="n">04</div><h4>Factory Production &amp; CNC Machining</h4></div>
        <div class="process-step"><div class="n">05</div><h4>Quality Control &amp; Inspection</h4></div>
        <div class="process-step"><div class="n">06</div><h4>Site Installation &amp; Handover</h4></div>
      </div>
    </div>
  </section>
</main>'''
write("about.html", page(
    "Who We Are ARFAD",
    "ARFAD's story, vision, mission and process two decades of architectural woodwork mastery from Jubail, KSA.",
    "about.html", about_body))

# ---------- SERVICES ----------
services = [
    ("01","doors","Wooden Doors","mod-doors-teaser.jpg","Fire-rated, non-fire rated, solid, flush, louver, sliding, pocket and X-ray protected doors, Intertek certified up to 120 minutes fire resistance."),
    ("02","joinery","Joinery","svc-joinery.jpg","Custom joints, timber framing, architectural moldings, reception counters, hotel, restaurant, office and retail joinery, built to spec."),
    ("03","cabinets","Interior Woodworks","svc-cabinets.jpg","Kitchen cabinets, wardrobes, vanities and storage systems manufactured for residential and hospitality scale."),
    ("04","cladding","Cladding &amp; Ceilings","svc-cladding.jpg","Internal and external wooden wall cladding, decorative panels, slatted wood, wooden and slatted ceilings engineered for precision."),
    ("05","thermowood","Thermowood","svc-thermowood.jpg","Exterior cladding, decking, pergolas, louvers, screens and canopies built for durability and dimensional stability outdoors."),
    ("06","furniture","Furniture &amp; Interiors","svc-furniture.jpg","Loose, hotel, restaurant and office furniture, custom seating and bespoke pieces for schools, auditoriums, villas and airports."),
    ("07","countertops","Countertops &amp; Surfaces","svc-countertops-reception.jpg","Natural stone, engineered stone, quartz, kitchen and vanity tops, fabricated and finished in-house."),
    ("08","traditional","Traditional Woodworks","svc-traditional.jpg","Hand-carved panels, geometric mashrabiya screens, Islamic-patterned doors and mosque furniture rooted in Arabic craftsmanship."),
    ("09","wpc","WPC Works","svc-wpc.jpg","Wood-look decking, wall cladding, pergolas and fencing engineered for weather resistance and low maintenance."),
]
SERVICE_FEATURES = {
    "doors": ["Fire-rated up to 120 minutes, Intertek certified","Solid, flush, louver and X-ray protected core options","Sliding and pocket door systems available","Ironmongery and hardware fitted in-house"],
    "joinery": ["Custom timber framing and architectural moldings","Reception counters and bespoke millwork","Hotel, restaurant, office and retail fit-outs","Built to architect shop drawings and specification"],
    "cabinets": ["Kitchen cabinets and fitted wardrobes","Vanities and bathroom storage systems","Engineered for residential and hospitality scale","Soft-close hardware and moisture-resistant finishes"],
    "cladding": ["Internal and external wall cladding","Decorative panels and slatted wood ceilings","Engineered for precision alignment","Weather-rated finishes for exterior use"],
    "thermowood": ["Exterior cladding, decking and pergolas","Thermally modified for dimensional stability","Louvers, screens and canopies","Built to withstand heat and humidity"],
    "furniture": ["Loose furniture for hotels and offices","Custom seating for schools and auditoriums","Bespoke pieces for villas and airports","Finished to match interior design specification"],
    "countertops": ["Natural stone and engineered quartz","Kitchen and vanity tops","Fabricated and finished in-house","Precision-cut and polished to order"],
    "traditional": ["Hand-carved panels and screens","Geometric mashrabiya patterns","Islamic-patterned doors and mosque furniture","Rooted in Arabic craftsmanship traditions"],
    "wpc": ["Wood-look decking and wall cladding","Pergolas and fencing systems","Engineered for weather resistance","Low-maintenance, long-lasting finish"],
}

cards = []
for idx, anchor, title, img, desc in services:
    cards.append(f'''<a class="svc-card" href="service-{anchor}.html">
          <div class="thumb" style="background-image:url('img/{img}');"></div>
          <div class="body"><span class="idx">{idx}</span><h3>{title}</h3><p>{desc}</p></div>
        </a>''')
cards_html = "\n        ".join(cards)

services_body = f'''<main>
  <section class="hero-slider compact">
    <div class="slide" style="background-image:url('img/svc-doors.jpg');"></div>
    <div class="slide" style="background-image:url('img/svc-traditional.jpg');"></div>
    <div class="slide" style="background-image:url('img/svc-thermowood.jpg');"></div>
    <div class="hero-overlay"></div>
    <div class="hero-dots"></div>
    <div class="wrap">
      <p class="crumb"><a href="index.html">Home</a> / Services</p>
      <div class="hero-caption-track">
        <div class="hero-caption">
          <p class="eyebrow">01 What We Deliver</p>
          <h1>A full scope of<br>architectural woodwork.</h1>
          <p class="hero-lede">Nine disciplines, one factory from certified fire-rated doors to custom joinery, traditional heritage carving and modern composite decking.</p>
        </div>
        <div class="hero-caption">
          <p class="eyebrow">Traditional Woodworks</p>
          <h1>Heritage craftsmanship,<br>hand-carved.</h1>
          <p class="hero-lede">Mashrabiya screens, Islamic-patterned doors and hand-carved panels rooted in traditional technique.</p>
        </div>
        <div class="hero-caption">
          <p class="eyebrow">Thermowood &amp; WPC</p>
          <h1>Modern finishes for<br>outdoor spaces.</h1>
          <p class="hero-lede">Weather-resistant decking, cladding and pergolas built for the Kingdom's climate.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="svc-grid">
        {cards_html}
      </div>
    </div>
  </section>

</main>'''
write("services.html", page(
    "Services ARFAD",
    "Nine architectural woodwork disciplines: doors, joinery, cabinets, cladding, thermowood, furniture, countertops, traditional woodworks and WPC.",
    "services.html", services_body))

# ---------- SERVICE DETAIL PAGES ----------
for idx, anchor, title, img, desc in services:
    features = SERVICE_FEATURES[anchor]
    features_html = "\n        ".join(f'<li>{f}</li>' for f in features)
    others = [s for s in services if s[1] != anchor][:4]
    others_html = "\n        ".join(
        f'''<a class="svc-card" href="service-{a}.html">
          <div class="thumb" style="background-image:url('img/{oimg}');"></div>
          <div class="body"><span class="idx">{oidx}</span><h3>{t}</h3><p>{od[:70].rsplit(' ',1)[0]}&hellip;</p></div>
        </a>''' for oidx, a, t, oimg, od in others
    )
    detail_body = f'''<main>
  <section class="detail-hero" style="background-image:url('img/{img}');">
    <div class="hero-overlay"></div>
    <div class="wrap">
      <p class="crumb"><a href="index.html">Home</a> / <a href="services.html">Services</a> / {title}</p>
      <p class="eyebrow">{idx} Our Services</p>
      <h1>{title}</h1>
    </div>
  </section>

  <section class="section">
    <div class="wrap about-grid">
      <div>
        <p class="eyebrow">Overview</p>
        <h2 style="margin-top:10px;">{title}</h2>
        <p style="margin-top:20px;font-size:1.02rem;">{desc}</p>
        <ul class="qual-list" style="margin-top:24px;">
        {features_html}
        </ul>
        <div class="hero-cta" style="margin-top:30px;">
          <a class="btn solid" href="contact.html">Request a Quote</a>
          <a class="btn" href="services.html">All Services</a>
        </div>
      </div>
      <div style="border-radius:16px;overflow:hidden;box-shadow:var(--shadow);aspect-ratio:16/11;background:url('img/{img}') center/cover;"></div>
    </div>
  </section>

  <section class="section on-alt">
    <div class="wrap">
      <div class="head">
        <p class="eyebrow">Explore</p>
        <h2>Other services from ARFAD.</h2>
      </div>
      <div class="svc-grid">
        {others_html}
      </div>
    </div>
  </section>

  <section class="section cta-band">
    <div class="wrap" style="text-align:center;">
      <p class="eyebrow" style="justify-content:center;">Get in touch</p>
      <h2 style="margin-top:14px;font-size:clamp(1.9rem,4vw,2.8rem);max-width:26ch;margin-inline:auto;">Ready to start your {title.lower()} project?</h2>
      <div class="hero-cta" style="justify-content:center;margin-top:30px;">
        <a class="btn cta-band-btn" href="contact.html">Request a Quote</a>
        <a class="btn cta-band-btn-outline" href="mailto:info@arfad.com.sa">Email Us</a>
      </div>
    </div>
  </section>
</main>'''
    write(f"service-{anchor}.html", page(
        f"{title} ARFAD",
        f"{desc}",
        "services.html", detail_body, path=f"service-{anchor}.html"))

# ---------- FACTORY ----------
factory_body = '''<main>
  <section class="hero-slider compact">
    <div class="slide" style="background-image:url('img/factory.jpg');"></div>
    <div class="slide" style="background-image:url('img/svc-doors.jpg');"></div>
    <div class="slide" style="background-image:url('img/quality.jpg');"></div>
    <div class="hero-overlay"></div>
    <div class="hero-dots"></div>
    <div class="wrap">
      <p class="crumb"><a href="index.html">Home</a> / Factory</p>
      <div class="hero-caption-track">
        <div class="hero-caption">
          <p class="eyebrow">01 Factory &amp; Technology</p>
          <h1>Built for scale.<br>Equipped for excellence.</h1>
          <p class="hero-lede">A 20,000&nbsp;m&sup2; factory in Jubail Industrial City, equipped with a comprehensive range of specialized woodworking machinery.</p>
        </div>
        <div class="hero-caption">
          <p class="eyebrow">Production Line</p>
          <h1>Precision manufacturing,<br>door by door.</h1>
          <p class="hero-lede">CNC-driven production lines turning certified specifications into finished units at scale.</p>
        </div>
        <div class="hero-caption">
          <p class="eyebrow">Quality Control</p>
          <h1>Every batch checked<br>before it ships.</h1>
          <p class="hero-lede">Material control and production checks are built into every stage of the factory floor.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="stat-grid" style="background:var(--line);border-color:var(--line);">
        <div class="stat-cell" style="background:var(--navy);"><div class="num">20,000 m&sup2;</div><div class="lbl">Total built-up factory area</div></div>
        <div class="stat-cell" style="background:var(--navy);"><div class="num">200+</div><div class="lbl">Production employees</div></div>
        <div class="stat-cell" style="background:var(--navy);"><div class="num">30+</div><div class="lbl">CNC &amp; precision machines</div></div>
        <div class="stat-cell" style="background:var(--navy);"><div class="num">2004</div><div class="lbl">Operating since</div></div>
      </div>
      <div class="zones" style="margin-top:56px;">
        <div class="zone" style="color:var(--ink);"><h4 style="color:var(--bronze-deep);">Dedicated Production Zones</h4><p style="color:var(--ink-soft);">Raw material storage &middot; Cutting &middot; CNC machining &middot; Edge banding &middot; Assembly &middot; Finishing &middot; Quality control</p></div>
        <div class="zone" style="color:var(--ink);"><h4 style="color:var(--bronze-deep);">In-House Capability</h4><p style="color:var(--ink-soft);">A design studio with engineers and draftsmen working in direct coordination with production, professional spray booths for lacquer, stain and paint finishing, and dedicated warehousing and logistics supporting deliveries across KSA.</p></div>
      </div>
    </div>
  </section>

  <section class="section on-alt">
    <div class="wrap">
      <div class="head">
        <p class="eyebrow">Machinery &amp; Modern Technology</p>
        <h2>Advanced machinery. Precise output. Every time.</h2>
        <p class="ink-soft">ARFAD's factory is equipped with a comprehensive range of specialized woodworking machinery, supporting precision cutting, routing, shaping, sanding, pressing, edge banding, veneering, and CNC machining at industrial scale.</p>
      </div>
      <div class="thumb-grid" style="margin-bottom:36px;">
        <div class="thumb-photo" style="background-image:url('img/machine-cefla-drying.jpg');"></div>
        <div class="thumb-photo" style="background-image:url('img/machine-sektar-panel-saw.jpg');"></div>
        <div class="thumb-photo" style="background-image:url('img/machine-wide-belt-sanding.jpg');"></div>
        <div class="thumb-photo" style="background-image:url('img/machine-hot-cold-presser.jpg');"></div>
        <div class="thumb-photo" style="background-image:url('img/machine-cabinet-presser.jpg');"></div>
        <div class="thumb-photo" style="background-image:url('img/machine-edge-banding.jpg');"></div>
        <div class="thumb-photo" style="background-image:url('img/machine-six-side-molding.jpg');"></div>
        <div class="thumb-photo" style="background-image:url('img/machine-spray-booth.jpg');"></div>
        <div class="thumb-photo" style="background-image:url('img/machine-reciprocating-spray.jpg');"></div>
      </div>
      <ul class="machine-list">
        <li>Circular Table Saw Machine</li><li>Wide Belt Sander Machine</li>
        <li>Surface Planer Machine</li><li>Hydraulic Press Machine</li>
        <li>Shaper Machine</li><li>Manual Press Machine</li>
        <li>Thickness Planer Machine</li><li>Mortising Machine</li>
        <li>Edge Bonding Machine</li><li>Band Saw Machine</li>
        <li>Automatic Lathe Machine</li><li>CNC Router Machine</li>
        <li>NC Panel Sizing Machine</li><li>Head Router Machine</li>
        <li>Automatic Guillotine Machine</li><li>Frame Press Machine</li>
        <li>Veneer Splicing Machine</li><li>Table Presser Machine</li>
        <li>Veneer Cutter Machine</li><li>Biesse Skipper CNC Boring Machine</li>
        <li>Six-Side Molding Machine</li><li>Sektar 430 Panel Saw Machine</li>
        <li>Single Side Edge Banding Machine</li><li>CEFLA Hot &amp; Cold Presser Machine</li>
      </ul>
    </div>
  </section>

  <section class="section on-navy">
    <div class="wrap" style="text-align:center;">
      <p class="eyebrow" style="justify-content:center;">Quality, safety &amp; sustainability</p>
      <h2 style="margin-top:14px;">Every stage is reviewed from raw material to final handover.</h2>
      <div class="hero-cta" style="justify-content:center;margin-top:26px;">
        <a class="btn solid" href="quality.html">See Our Quality Standards</a>
      </div>
    </div>
  </section>
</main>'''
write("factory.html", page(
    "Factory &amp; Technology ARFAD",
    "Inside ARFAD's 20,000 m² factory in Jubail: production zones, in-house capability and the full CNC machinery fleet.",
    "factory.html", factory_body))

# ---------- QUALITY ----------
quality_body = '''<main>
  <section class="hero-slider compact">
    <div class="slide" style="background-image:url('img/quality.jpg');"></div>
    <div class="slide" style="background-image:url('img/svc-traditional.jpg');"></div>
    <div class="slide" style="background-image:url('img/svc-interior.jpg');"></div>
    <div class="hero-overlay"></div>
    <div class="hero-dots"></div>
    <div class="wrap">
      <p class="crumb"><a href="index.html">Home</a> / Quality</p>
      <div class="hero-caption-track">
        <div class="hero-caption">
          <p class="eyebrow">01 Quality, Safety &amp; Sustainability</p>
          <h1>Quality built into<br>every stage.</h1>
          <p class="hero-lede">Managed through documented procedures, approved specifications, material control, production checks and site supervision.</p>
        </div>
        <div class="hero-caption">
          <p class="eyebrow">FSC&reg; Chain of Custody</p>
          <h1>Responsibly sourced,<br>certified timber.</h1>
          <p class="hero-lede">FSC&reg; Chain of Custody certification governs the timber behind every ARFAD project.</p>
        </div>
        <div class="hero-caption">
          <p class="eyebrow">Finished Standard</p>
          <h1>The same standard,<br>on every interior.</h1>
          <p class="hero-lede">Interior furnishing inspected to the same specification as our largest industrial contracts.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap qual-cols">
      <div>
        <p class="eyebrow">Quality Framework</p>
        <h2 style="margin-top:10px;">Quality built into every stage.</h2>
        <p style="margin-top:16px;">Every stage is reviewed to ensure the final output meets required technical, functional and finishing standards, backed by an ISO 9001:2015 certified quality management system.</p>
        <ul class="qual-list">
          <li>Approved shop drawings &amp; specifications</li>
          <li>Material certificates &amp; submittal review</li>
          <li>Incoming material &amp; in-process factory inspection</li>
          <li>Final product &amp; site installation inspection</li>
          <li>Full inspection records &amp; quality documentation</li>
          <li>FSC Chain of Custody responsible, traceable wood sourcing</li>
          <li>Occupational health &amp; safety, hazard identification, controlled waste disposal</li>
        </ul>
      </div>
      <div class="cert-grid" style="grid-template-columns:1fr 1fr;">
        <div class="cert-card"><div class="badge">ISO</div><h4>ISO 9001:2015</h4><p>Quality Management System</p></div>
        <div class="cert-card"><div class="badge">ISO</div><h4>ISO 14001:2015</h4><p>Environmental Management System</p></div>
        <div class="cert-card"><div class="badge">ISO</div><h4>ISO 45001:2018</h4><p>Occupational Health &amp; Safety</p></div>
        <div class="cert-card"><div class="badge">FSC</div><h4>FSC Chain of Custody</h4><p>Certified responsible wood sourcing</p></div>
        <div class="cert-card"><div class="badge">&check;</div><h4>Intertek Certified</h4><p>Fire-rated doors up to 120 minutes</p></div>
        <div class="cert-card"><div class="badge">AR</div><h4>Aramco Registered</h4><p>Vendor code 10064085</p></div>
        <div class="cert-card"><div class="badge">RC</div><h4>Royal Commission Registered</h4><p>Jubail &amp; Yanbu Vendor 14902</p></div>
        <div class="cert-card"><div class="badge">RSG</div><h4>Red Sea Global Registered</h4><p>Vendor S10357393</p></div>
      </div>
    </div>
  </section>

  <section class="section on-alt">
    <div class="wrap">
      <div class="head">
        <p class="eyebrow">Intertek Fire-Rated Door Certifications</p>
        <h2>Tested performance, fire safety, international standards.</h2>
        <p class="ink-soft">ARFAD's fire-rated doors are certified by Intertek for compliance with both American and British standards, ensuring tested performance, reliability and safety.</p>
      </div>
      <div class="cert-grid" style="grid-template-columns:repeat(3,1fr);margin-top:24px;">
        <div class="cert-card"><div class="badge">&check;</div><h4>Warm Springs</h4><p>20&ndash;90 min fire door frame &middot; Cert. WHI18-28731422</p></div>
        <div class="cert-card"><div class="badge">&check;</div><h4>Halspan</h4><p>Universal 20&ndash;30 min fire door &middot; Cert. WHI18-28731426</p></div>
        <div class="cert-card"><div class="badge">&check;</div><h4>Streboard</h4><p>44 FD30 particle board core door &middot; Cert. WHI22-28731442</p></div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap qual-cols">
      <div>
        <p class="eyebrow">Sustainability</p>
        <h2>Committed to responsible forestry.</h2>
        <p class="ink-soft" style="margin-top:16px;">ARFAD is FSC Chain of Custody certified, demonstrating its commitment to responsible wood sourcing and the traceability of certified wood products throughout the supply chain (FSC-STD-40-004 V3-1 &middot; FSC-STD-50-001 V2-1). Our FSC Chain of Custody certification ensures that the wood and wood-based materials we use are sourced from responsibly managed forests, supporting biodiversity, environmental protection and the well-being of communities worldwide.</p>
        <p class="ink-soft" style="margin-top:16px;">Every timber shipment entering our Jubail factory is checked against its FSC claim before it reaches production, and that traceability carries through to the finished door, panel or piece of furniture installed on site. It is a standard we apply equally across residential, hospitality, government and industrial projects, regardless of scale.</p>
      </div>
      <div style="border-radius:16px;overflow:hidden;box-shadow:var(--shadow);aspect-ratio:4/3;background:url('img/quality.jpg') center/cover;"></div>
    </div>
  </section>

  <section class="section on-navy">
    <div class="wrap" style="text-align:center;">
      <p class="eyebrow" style="justify-content:center;">Saudi Aramco Approvals &amp; Appreciations</p>
      <h2 style="margin-top:14px;max-width:34ch;margin-inline:auto;">Recognized. Compliant. Trusted.</h2>
      <p class="ink-soft" style="max-width:60ch;margin:14px auto 0;">ARFAD is a registered Saudi Aramco Manufacturer &amp; Service Provider under Vendor Code No. 10064085 (E-Reference No. 0005893), supported by recognized compliance credentials and a proven record of successful project delivery.</p>
    </div>
  </section>

  <section class="section on-alt">
    <div class="wrap">
      <div class="head">
        <p class="eyebrow">Certificate Gallery</p>
        <h2>Every certificate, on file.</h2>
        <p class="ink-soft">The original scanned certificates behind every claim on this page click any image to view it full size.</p>
      </div>
      <div class="cert-photo-grid">
        <a class="cert-photo-card" href="img/certs/cert-iso-9001.jpg" target="_blank" rel="noopener">
          <div class="cert-thumb" style="background-image:url('img/certs/cert-iso-9001.jpg');"></div>
          <div class="cert-cap"><h4>ISO 9001:2015</h4><p>Quality Management System &middot; Cert. AMER31996</p></div>
        </a>
        <a class="cert-photo-card" href="img/certs/cert-iso-45001.jpg" target="_blank" rel="noopener">
          <div class="cert-thumb" style="background-image:url('img/certs/cert-iso-45001.jpg');"></div>
          <div class="cert-cap"><h4>ISO 45001:2018</h4><p>Occupational Health &amp; Safety &middot; Cert. AMER31997</p></div>
        </a>
        <a class="cert-photo-card" href="img/certs/cert-iso-14001.jpg" target="_blank" rel="noopener">
          <div class="cert-thumb" style="background-image:url('img/certs/cert-iso-14001.jpg');"></div>
          <div class="cert-cap"><h4>ISO 14001:2015</h4><p>Environmental Management System &middot; Cert. AMER31998</p></div>
        </a>
        <a class="cert-photo-card" href="img/certs/cert-intertek-warmsprings.jpg" target="_blank" rel="noopener">
          <div class="cert-thumb" style="background-image:url('img/certs/cert-intertek-warmsprings.jpg');"></div>
          <div class="cert-cap"><h4>Intertek Warm Springs</h4><p>Fire door frame compliance certificate</p></div>
        </a>
        <a class="cert-photo-card" href="img/certs/cert-intertek-halspan.jpg" target="_blank" rel="noopener">
          <div class="cert-thumb" style="background-image:url('img/certs/cert-intertek-halspan.jpg');"></div>
          <div class="cert-cap"><h4>Intertek Halspan</h4><p>Fire door compliance certificate</p></div>
        </a>
        <a class="cert-photo-card" href="img/certs/cert-intertek-streboard.jpg" target="_blank" rel="noopener">
          <div class="cert-thumb" style="background-image:url('img/certs/cert-intertek-streboard.jpg');"></div>
          <div class="cert-cap"><h4>Intertek Streboard</h4><p>Fire door assembly compliance certificate</p></div>
        </a>
        <a class="cert-photo-card" href="img/certs/cert-fsc.jpg" target="_blank" rel="noopener">
          <div class="cert-thumb" style="background-image:url('img/certs/cert-fsc.jpg');"></div>
          <div class="cert-cap"><h4>FSC&reg; Chain of Custody</h4><p>Cert. C902050CU-COC-01.2024 &middot; valid to 04 Apr 2029</p></div>
        </a>
        <a class="cert-photo-card" href="img/certs/cert-aramco-appreciation.jpg" target="_blank" rel="noopener">
          <div class="cert-thumb" style="background-image:url('img/certs/cert-aramco-appreciation.jpg');"></div>
          <div class="cert-cap"><h4>Saudi Aramco Appreciation</h4><p>Al Mutrafiah Home Ownership Housing Inc.&nbsp;I</p></div>
        </a>
        <a class="cert-photo-card" href="img/certs/cert-cybersecurity.jpg" target="_blank" rel="noopener">
          <div class="cert-thumb" style="background-image:url('img/certs/cert-cybersecurity.jpg');"></div>
          <div class="cert-cap"><h4>Cybersecurity Compliance</h4><p>Saudi Aramco SACS-002 &middot; assessed by RSM Saudi Arabia</p></div>
        </a>
      </div>
    </div>
  </section>

  <section class="section on-navy">
    <div class="wrap" style="text-align:center;">
      <p class="eyebrow" style="justify-content:center;">Safety &amp; environmental responsibility</p>
      <h2 style="margin-top:14px;max-width:32ch;margin-inline:auto;">Safe workplaces. Responsible operations.</h2>
      <p class="ink-soft" style="max-width:56ch;margin:14px auto 0;">ARFAD is committed to maintaining a safe and healthy working environment while minimizing environmental impact through controlled procedures, employee awareness, responsible practices, and compliance with applicable KSA regulations.</p>
    </div>
  </section>
</main>'''
write("quality.html", page(
    "Quality &amp; Certifications ARFAD",
    "ISO 9001, ISO 14001, ISO 45001, FSC Chain of Custody and Intertek fire-door certification, ARFAD's quality, safety and sustainability standards.",
    "quality.html", quality_body))

# ---------- PROJECTS ----------
rows = [
    ("Saudi Aramco","Home Ownership, Al Mutrafiah Inc. 1","Jubail","494 villas · 6,653 doors · 180 kitchens · 494 vanities · handrails"),
    ("Saudi Aramco","Home Ownership, Al Mutrafiah Inc. 2","Jubail","344 villas · 4,984 doors · 344 kitchens"),
    ("Saudi Aramco","SDHOP, South Dharan Housing","Dharan","110 villas · 1,500 doors (treated sub-frames)"),
    ("Saudi Aramco / SATORP","SATORP Housing","Jubail","110 villas · 110 vanity tops · handrails"),
    ("Saudi Aramco / RC","6 Mosques","Al Jubail","Islamic design doors · loose furniture"),
    ("Saudi Aramco (Khonaini)","King Salman Maritime Complex","Ras Al Khair","4,500 wooden doors"),
    ("Royal Commission","Phase C71, Apartments (Azmeel)","Al Jubail","7,000 doors · 326 kitchens · furniture"),
    ("Royal Commission","Phase C13, Housing","Al Jubail","348 villas · 2,500 doors · 348 kitchens · 348 wardrobes · 348 vanities"),
    ("Royal Commission","Phase C08/C09, Housing","Al Jubail","400 villas · 800 doors · 400 kitchens · 400 wardrobes · 400 vanities"),
    ("Royal Commission","Phase C03, Housing","Al Jubail","287 villas · 287 folding doors · handrails"),
    ("Royal Commission","Phase C16, Apartments","Al Jubail","8 buildings (7 storey) · wardrobes throughout"),
    ("Royal Commission","Phase C05, Apartments","Al Jubail","640 louvre doors · 40-storey handrails"),
    ("Royal Commission","Schools, Mutrafiah Phase 5","Al Jubail","Full doors &amp; joinery works"),
    ("SABIC","Al Mutrafiah Housing","Al Jubail","1,248 villas · 1,248 kitchens · external doors · vanity shelves"),
    ("MA'ADEN","Aluminium Housing","Al Jubail","794 villas · 794 kitchens · doors · handrails · vanity tops"),
    ("YASREF (Khonaini)","Housing Phase 1","Yanbu Al Bahr","1,620 doors · 90 villas handrails · 90 villas partitions"),
    ("ZATCA (EG&amp;G)","Haditha Housing Project","Al Haditha","3,348 wooden doors"),
    ("GACA","Prince Naif International Airport","Al Qassim","55 doors · specialized airport joinery"),
    ("Retal Urban Dev.","South Murcia, Nesaj Town","Nesaj Town","2,466 wooden doors"),
    ("Saudi Railway Company","Warehouses, Al Nuairiyah","Al Nuairiyah","Wooden doors &amp; joinery throughout"),
    ("Ministry of Defense","Supporting Buildings","Al Qassim","Doors (100 flats) · 1,500 m² cladding · 250 m² ceiling"),
    ("Dareen Villas","Housing Project","Al Jubail","69 villas · doors · kitchen cabinets"),
    ("NAJD","Bachelor Apartments","Al Jubail","40 kitchen cabinets · wardrobes"),
    ("East Dammam","Housing Project","Dammam","Louvre doors · kitchens · vanity tops"),
    ("NEOM (BECo)","Multipurpose Hall","NEOM","100 doors · 1,700 m² cladding · 500 m² ceiling · 100 m² flooring"),
    ("NEOM (BECo)","Auditorium","NEOM","High-end joinery &amp; cladding"),
    ("NEOM (BECo)","VIP Lounge","NEOM","Luxury joinery · custom panelling · VIP interior finishes"),
    ("Red Sea Global (BECo)","AMAALA Staff Village, Package 1","AMAALA","3,192 wooden doors"),
    ("Red Sea Global (Astra)","Staff Village, Zones 1, 2 &amp; 7","AMAALA","1,566 doors · hotel, villa, police &amp; fire station joinery"),
    ("Red Sea Global (Haif)","Secondary Infrastructure","AMAALA","Thermowood exterior cladding"),
    ("Red Sea Global (Al Tamimi)","Six Senses Resorts","AMAALA Triple Bay","Full luxury resort joinery"),
    ("Red Sea Co. (NESMA)","Southern Dunes Hotel","NEOM","250 doors · 3,000 m² cladding · 1,000 m² ceiling"),
    ("Movenpick","5-Star Hotel, Wa'ad Al Shamal","Wa'ad Al Shamal","850 doors · kitchens · 4,850 m² cladding"),
    ("KARAN Group","5-Star Hotel","Al Jubail","Cladding, restaurants &amp; function rooms · doors"),
    ("KARAN Group","Bachelor Apartments","Al Jubail","744 flats · 744 doors · 744 kitchens"),
    ("MISK Foundation (Baytur)","MISK School Phase 1 &amp; 2","Riyadh","1,500 doors · 2,000 m² cladding · 700 m² ceiling"),
    ("KAFD","King Abdullah Financial District","Riyadh","Premium woodworks &amp; joinery"),
    ("MARAFIQ","New Head Office","Al Jubail","Complete office joinery"),
    ("Al Eissa Compound","Project, ZAC"," ","External &amp; internal doors · roof canopies · shade pavilions"),
    ("PRIMER Steak House","Restaurant &amp; Lounge","Riyadh","Full interior fit-out · dining furniture · bar joinery"),
    ("AMAALA Hospital (BEC)","Hospital Project","AMAALA","Doors · wall cladding · joinery · custom casework"),
]
row_html = "\n            ".join(
    f'<tr><td class="client">{c}</td><td>{p}</td><td class="loc">{l}</td><td class="scope">{s}</td></tr>'
    for c,p,l,s in rows
)
clients = ["Royal Commission for Jubail &amp; Yanbu","Saudi Aramco","SATORP","YASREF","SABIC","MA'ADEN","MARAFIQ",
           "Red Sea Global","AMAALA","NEOM","MISK Schools","KAFD","Six Senses","Movenpick","Saudi Arabian Baytur",
           "BEC Arabia","Hassan Allam","GACA","Dar Al-Arkan","TMG"]
chips_html = "\n        ".join(f'<span class="chip">{c}</span>' for c in clients)
chips_track_html = "\n        ".join(f'<span class="chip">{c}</span>' for c in (clients + clients))

# ---------- PROJECT DETAIL GALLERIES ----------
PROJECT_GALLERIES = {
    "royal-commission": ("Royal Commission for Jubail &amp; Yanbu","Royal Commission","Al Jubail",
        "7 housing &amp; school phases across Jubail 2,500+ doors, kitchens, wardrobes, vanity tops and handrails delivered. Registered Vendor No. 14902.",
        ["royal-commission-1.jpg"]),
    "saudi-aramco": ("Saudi Aramco","Saudi Aramco","Jubail &middot; Dharan &middot; Ras Al Khair",
        "Al Mutrafiah Home Ownership Housing, SDHOP, SATORP, King Salman Maritime Complex &amp; Royal Commission mosques. Registered Vendor No. 10064085.",
        ["saudi-aramco-1.jpg"]),
    "neom": ("NEOM Multipurpose Hall, Auditorium &amp; VIP Lounge","NEOM (BECo)","NEOM",
        "100 doors, 1,700&nbsp;m&sup2; cladding, 500&nbsp;m&sup2; ceiling and 100&nbsp;m&sup2; flooring for the Multipurpose Hall, plus high-end joinery and cladding for the Auditorium and luxury custom panelling for the VIP Lounge.",
        ["neom-1.jpg","neom-2.jpg","neom-3.jpg","neom-4.jpg","neom-5.jpg","neom-6.jpg"]),
    "redsea-amaala": ("Red Sea Global &amp; AMAALA","Red Sea Global","AMAALA &middot; Triple Bay",
        "4,758+ doors installed across AMAALA staff villages (Packages 1, Zones 1/2/7), thermowood exterior cladding for secondary infrastructure, and full luxury resort joinery for the Six Senses Resorts at Triple Bay. Registered Vendor No. S10357393.",
        ["redsea-amaala-1.jpg","redsea-amaala-2.jpg","redsea-amaala-3.jpg","redsea-amaala-4.jpg","redsea-amaala-5.jpg",
         "redsea-amaala-6.jpg","redsea-amaala-7.jpg","redsea-amaala-8.jpg","redsea-amaala-9.jpg","redsea-amaala-10.jpg"]),
    "kafd": ("King Abdullah Financial District","KAFD","Riyadh",
        "Premium woodworks and joinery custom vanities, cabinetry and architectural millwork delivered for one of Riyadh's landmark financial developments.",
        ["kafd-1.jpg","kafd-2.jpg","kafd-3.jpg"]),
    "karan": ("KARAN Group Hotel &amp; Housing","KARAN Group","Al Jubail",
        "Cladding for a 5-star hotel's restaurants and function rooms, plus 744 doors and 744 kitchens for bachelor apartments.",
        ["karan-1.jpg","karan-2.jpg","karan-3.jpg"]),
    "marafiq": ("MARAFIQ New Head Office","MARAFIQ","Al Jubail",
        "Complete office joinery for MARAFIQ's new head office custom millwork, reception counters and workspace fit-out.",
        ["marafiq-1.jpg","marafiq-2.jpg","marafiq-3.jpg"]),
    "ministry-of-defense": ("Ministry of Defense Supporting Buildings","Ministry of Defense","Al Qassim",
        "Doors for 100 flats, 1,500&nbsp;m&sup2; of wall cladding and 250&nbsp;m&sup2; of ceiling works across the Ministry's supporting buildings.",
        ["ministry-of-defense-1.jpg","ministry-of-defense-2.jpg","ministry-of-defense-3.jpg"]),
    "misk": ("MISK School Phase 1 &amp; 2","MISK Foundation (Baytur)","Riyadh",
        "1,500 doors, 2,000&nbsp;m&sup2; of wall cladding and 700&nbsp;m&sup2; of ceiling works delivered for the MISK Foundation's school campus.",
        ["misk-1.jpg","misk-2.jpg","misk-3.jpg"]),
    "movenpick": ("Movenpick 5-Star Hotel","Movenpick","Wa'ad Al Shamal",
        "850 doors, kitchen joinery and 4,850&nbsp;m&sup2; of wall cladding delivered for a 5-star hotel development.",
        ["movenpick-1.jpg","movenpick-2.jpg","movenpick-3.jpg"]),
    "primer-steak-house": ("PRIMER Steak House Restaurant &amp; Lounge","PRIMER Steak House","Riyadh",
        "Full interior fit-out including dining furniture, bar joinery and bespoke restaurant millwork.",
        ["primer-steak-house-1.jpg","primer-steak-house-2.jpg","primer-steak-house-3.jpg"]),
    "el-eissa": ("Al Eissa Compound Project ZAC","Al Eissa Compound"," ",
        "External and internal doors, roof canopies and shade pavilions delivered for the Al Eissa Compound development.",
        ["el-eissa-1.jpg","el-eissa-2.jpg","el-eissa-3.jpg"]),
}

project_cards = []
for slug, (title, client, loc, desc, imgs) in PROJECT_GALLERIES.items():
    short_title = title.split(" ")[0].split(" &middot; ")[0]
    project_cards.append(f'''<a class="gallery-card" href="project-{slug}.html" style="background-image:url('img/projects/{imgs[0]}');">
          <div class="gc-body">
            <p class="eyebrow">{client}</p>
            <h4>{short_title}</h4>
            <p>{loc}</p>
          </div>
        </a>''')
project_cards_html = "\n        ".join(project_cards)

for slug, (title, client, loc, desc, imgs) in PROJECT_GALLERIES.items():
    gallery_html = "\n        ".join(
        f'''<div class="thumb-photo" style="background-image:url('img/projects/{img}');"></div>''' for img in imgs
    )
    detail_body = f'''<main>
  <section class="detail-hero" style="background-image:url('img/projects/{imgs[0]}');">
    <div class="hero-overlay"></div>
    <div class="wrap">
      <p class="crumb"><a href="index.html">Home</a> / <a href="projects.html">Projects</a> / {client}</p>
      <p class="eyebrow">Featured Project</p>
      <h1>{title}</h1>
    </div>
  </section>

  <section class="section">
    <div class="wrap about-grid">
      <div>
        <p class="eyebrow">Overview</p>
        <h2 style="margin-top:10px;">{client}</h2>
        <p style="margin-top:20px;font-size:1.02rem;">{desc}</p>
        <ul class="qual-list" style="margin-top:24px;">
        <li>Client: {client}</li>
        <li>Location: {loc}</li>
        </ul>
        <div class="hero-cta" style="margin-top:30px;">
          <a class="btn solid" href="contact.html">Request a Quote</a>
          <a class="btn" href="projects.html">All Projects</a>
        </div>
      </div>
      <div style="border-radius:16px;overflow:hidden;box-shadow:var(--shadow);aspect-ratio:16/11;background:url('img/projects/{imgs[0]}') center/cover;"></div>
    </div>
  </section>

  <section class="section on-alt">
    <div class="wrap">
      <div class="head">
        <p class="eyebrow">Gallery</p>
        <h2>Project photos.</h2>
      </div>
      <div class="thumb-grid">
        {gallery_html}
      </div>
    </div>
  </section>

  <section class="section cta-band">
    <div class="wrap" style="text-align:center;">
      <p class="eyebrow" style="justify-content:center;">Get in touch</p>
      <h2 style="margin-top:14px;font-size:clamp(1.9rem,4vw,2.8rem);max-width:26ch;margin-inline:auto;">Ready to start your next project?</h2>
      <div class="hero-cta" style="justify-content:center;margin-top:30px;">
        <a class="btn cta-band-btn" href="contact.html">Request a Quote</a>
        <a class="btn cta-band-btn-outline" href="mailto:info@arfad.com.sa">Email Us</a>
      </div>
    </div>
  </section>
</main>'''
    write(f"project-{slug}.html", page(
        f"{client} ARFAD Projects",
        f"{desc}",
        "projects.html", detail_body, path=f"project-{slug}.html"))

projects_body = f'''<main>
  <section class="hero-slider compact">
    <div class="slide" style="background-image:url('img/proj-rc.jpg');"></div>
    <div class="slide" style="background-image:url('img/proj-rsg.jpg');"></div>
    <div class="slide" style="background-image:url('img/svc-cladding.jpg');"></div>
    <div class="hero-overlay"></div>
    <div class="hero-dots"></div>
    <div class="wrap">
      <p class="crumb"><a href="index.html">Home</a> / Projects</p>
      <div class="hero-caption-track">
        <div class="hero-caption">
          <p class="eyebrow">01 Our Projects</p>
          <h1>Every project we deliver is a<br>physical reflection of our standards.</h1>
          <p class="hero-lede">A twenty-year portfolio spanning royal commissions, national giga-projects and the Kingdom's leading developers.</p>
        </div>
        <div class="hero-caption">
          <p class="eyebrow">Red Sea Global &amp; AMAALA</p>
          <h1>4,758+ doors across<br>staff villages and resorts.</h1>
          <p class="hero-lede">Delivered for Red Sea Global's staff villages and luxury resort developments.</p>
        </div>
        <div class="hero-caption">
          <p class="eyebrow">Cladding &amp; Ceilings</p>
          <h1>Finishing the Kingdom's<br>landmark facades.</h1>
          <p class="hero-lede">Internal and external cladding delivered across giga-projects and commercial developments.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="divider-label"><span class="eyebrow" style="margin:0;">Highlighted Projects</span></div>
      <div class="feature-grid" style="margin-top:24px;">
        <a class="feature-card" href="project-royal-commission.html" style="background:linear-gradient(180deg,rgba(10,37,64,.55),rgba(10,37,64,.93)), url('img/proj-rc.jpg') center/cover;">
          <p class="eyebrow">Royal Commission &middot; Jubail &amp; Yanbu</p>
          <h4>Registered Vendor No. 14902</h4>
          <p>7 housing &amp; school phases across Jubail 2,500+ doors, kitchens, wardrobes, vanity tops and handrails delivered.</p>
          <span class="view-link">View Project &rarr;</span>
        </a>
        <a class="feature-card" href="project-saudi-aramco.html" style="background:linear-gradient(180deg,rgba(10,37,64,.55),rgba(10,37,64,.93)), url('img/proj-aramco.jpg') center/cover;">
          <p class="eyebrow">Saudi Aramco</p>
          <h4>Registered Vendor No. 10064085</h4>
          <p>Al Mutrafiah Home Ownership Housing, SDHOP, SATORP, King Salman Maritime Complex &amp; Royal Commission mosques.</p>
          <span class="view-link">View Project &rarr;</span>
        </a>
        <a class="feature-card" href="project-redsea-amaala.html" style="background:linear-gradient(180deg,rgba(10,37,64,.55),rgba(10,37,64,.93)), url('img/proj-rsg.jpg') center/cover;">
          <p class="eyebrow">Red Sea Global &amp; AMAALA</p>
          <h4>Registered Vendor No. S10357393</h4>
          <p>4,758+ doors installed across staff villages, Six Senses Triple Bay resort and Southern Dunes Hotel.</p>
          <span class="view-link">View Project &rarr;</span>
        </a>
        <a class="feature-card" href="project-neom.html" style="background:linear-gradient(180deg,rgba(10,37,64,.55),rgba(10,37,64,.93)), url('img/proj-neom.jpg') center/cover;">
          <p class="eyebrow">NEOM</p>
          <h4>Multipurpose Hall, Auditorium &amp; VIP Lounge</h4>
          <p>100 doors, 1,700 m&sup2; cladding, bespoke joinery and premium VIP-grade finishes.</p>
          <span class="view-link">View Project &rarr;</span>
        </a>
        <a class="feature-card" href="project-ministry-of-defense.html" style="background:linear-gradient(180deg,rgba(10,37,64,.55),rgba(10,37,64,.93)), url('img/proj-mod.jpg') center/cover;">
          <p class="eyebrow">Ministry of Defense</p>
          <h4>Supporting Buildings &middot; Al Qassim</h4>
          <p>Doors for 100 flats, 1,500 m&sup2; wall cladding and 250 m&sup2; ceiling works.</p>
          <span class="view-link">View Project &rarr;</span>
        </a>
        <div class="feature-card" style="background:linear-gradient(180deg,rgba(10,37,64,.55),rgba(10,37,64,.93)), url('img/proj-hospitality.jpg') center/cover;">
          <p class="eyebrow">Hospitality &amp; Commercial</p>
          <h4>Movenpick, KARAN, MISK, KAFD</h4>
          <p>5-star hotel joinery, school campuses and premium woodworks across Riyadh's financial district.</p>
        </div>
      </div>

      <div class="divider-label" style="margin-top:52px;"><span class="eyebrow" style="margin:0;">Project Galleries</span></div>
      <div class="feature-grid" style="margin-top:24px;">
        {project_cards_html}
      </div>

      <div class="table-wrap">
        <table class="proj-table">
          <thead><tr><th>Client</th><th>Project</th><th>Location</th><th>Scope</th></tr></thead>
          <tbody>
            {row_html}
          </tbody>
        </table>
      </div>

      <div class="divider-label" style="margin-top:52px;"><span class="eyebrow" style="margin:0;">Trusted by</span></div>
      <div class="client-marquee">
        <div class="client-marquee-track">
        {chips_track_html}
        </div>
      </div>
    </div>
  </section>

  <section class="section on-alt">
    <div class="wrap" style="text-align:center;">
      <h2 style="max-width:26ch;margin-inline:auto;">Ready to start your project?</h2>
      <div class="hero-cta" style="justify-content:center;margin-top:26px;">
        <a class="btn solid" href="contact.html">Request a Quote</a>
      </div>
    </div>
  </section>
</main>'''
write("projects.html", page(
    "Projects ARFAD",
    "ARFAD's project portfolio: Royal Commission, Saudi Aramco, Red Sea Global, AMAALA, NEOM, SABIC, MA'ADEN and more.",
    "projects.html", projects_body))

# ---------- CONTACT ----------
contact_body = '''<main>
  <section class="hero-slider compact">
    <div class="slide" style="background-image:url('img/factory.jpg');"></div>
    <div class="slide" style="background-image:url('img/svc-doors.jpg');"></div>
    <div class="slide" style="background-image:url('img/proj-rsg.jpg');"></div>
    <div class="hero-overlay"></div>
    <div class="hero-dots"></div>
    <div class="wrap">
      <p class="crumb"><a href="index.html">Home</a> / Contact</p>
      <div class="hero-caption-track">
        <div class="hero-caption">
          <p class="eyebrow">Get in Touch</p>
          <h1>Let's build something<br>that lasts twenty years.</h1>
          <p class="hero-lede">Reach out for a quote, a site visit, or a conversation about your next project.</p>
        </div>
        <div class="hero-caption">
          <p class="eyebrow">Start a Project</p>
          <h1>Tell us what<br>you're building.</h1>
          <p class="hero-lede">Share your drawings and specifications our team will respond with a scoped quote.</p>
        </div>
        <div class="hero-caption">
          <p class="eyebrow">Trusted Delivery</p>
          <h1>From brief to<br>handover, on schedule.</h1>
          <p class="hero-lede">Twenty years of on-time delivery across the Kingdom's most demanding projects.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap contact-grid">
      <div class="contact-card">
        <div class="contact-row"><span class="k">Address</span><span class="v">Support Industrial<br>Jubail Industrial City, KSA</span></div>
        <div class="contact-row"><span class="k">Phone</span><span class="v"><a href="tel:+966133417773">+966 13 341 7773</a></span></div>
        <div class="contact-row"><span class="k">WhatsApp</span><span class="v"><a href="https://wa.me/966561210469">+966 56 121 0469</a></span></div>
        <div class="contact-row"><span class="k">Email</span><span class="v"><a href="mailto:info@arfad.com.sa">info@arfad.com.sa</a></span></div>
        <div class="contact-row"><span class="k">Website</span><span class="v"><a href="https://www.arfad.com.sa">www.arfad.com.sa</a></span></div>
        <div class="hero-cta" style="margin-top:28px;">
          <a class="btn solid" href="mailto:info@arfad.com.sa">Email Us</a>
          <a class="btn" href="https://wa.me/966561210469">WhatsApp Us</a>
        </div>
      </div>
      <div class="map-box" style="padding:0;overflow:hidden;position:relative;">
        <iframe src="https://www.openstreetmap.org/export/embed.html?bbox=49.5967%2C26.9846%2C49.6767%2C27.0246&layer=mapnik&marker=27.0046%2C49.6367" width="100%" height="100%" style="border:0;position:absolute;inset:0;filter:saturate(.85) brightness(.95);" loading="lazy" title="ARFAD location map Jubail Industrial City"></iframe>
        <a href="https://www.google.com/maps/search/?api=1&query=ARFAD+International+Industrial+Co%2C+Jubail+Industrial+City%2C+Saudi+Arabia" target="_blank" rel="noopener" class="btn solid" style="position:absolute;left:16px;bottom:16px;z-index:2;">Open in Google Maps</a>
      </div>
    </div>
  </section>
</main>'''
write("contact.html", page(
    "Contact ARFAD",
    "Get in touch with ARFAD International Industrial Co. in Jubail Industrial City, Saudi Arabia.",
    "contact.html", contact_body))

print("done")
