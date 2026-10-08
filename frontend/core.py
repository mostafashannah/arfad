#!/usr/bin/env python3
import os, html
from data import *

SITE_URL = "https://www.arfad.com.sa"

NAV = [
    ("Home", "index.html", []),
    ("Who We Are", "about.html", [("About Us","about.html"),("Vision","vision.html"),("Mission","mission.html"),("Our Values","values.html"),("Why ARFAD","why-arfad.html")]),
    ("Services", "services.html", [(s["title"], f"service-{s['slug']}.html") for s in SERVICES]),
    ("Projects", "projects.html", [(s["title"], f"projects-{s['slug']}.html") for s in SECTORS]),
    ("Factory", "factory.html", [("Machineries","machinery.html"),("Service Workflow","service-workflow.html"),("Quality Policy","quality-policy.html"),
                                  ("HSE Policy","hse-policy.html"),("Registered Vendors","registered-vendors.html"),("Our Clients","our-clients.html"),
                                  ("Certificates & Awards","certificates.html")]),
    ("Sustainability", "sustainability.html", []),
    ("Careers", "careers.html", []),
    ("Media", "media.html", []),
    ("Contact", "contact.html", []),
]

NAV_DEFAULT = [{"label": l, "href": h, "children": [{"label": cl, "href": ch} for cl, ch in kids]} for l, h, kids in NAV]

FOOTER_DEFAULT = {
    "brand": {
        "title": "ARFAD International Industrial Co.",
        "arabicName": AR_NAME,
        "tagline": f"Crafting Excellence in Woodwork Since 2004. {TAGLINE}.",
        "downloadLabel": "Download Profile",
        "badges": ["Saudi Made", "Local Content Certified"],
    },
    "columns": [
        {"title": "Quick Links", "links": [{"label": l, "href": h} for l, h in
            [("Home","index.html"),("Who We Are","about.html"),("Services","services.html"),("Projects","projects.html"),("Factory","factory.html"),
             ("Sustainability","sustainability.html"),("Careers","careers.html"),("Media","media.html"),("Contact","contact.html")]]},
        {"title": "Services", "links": [{"label": s["title"], "href": f"service-{s['slug']}.html"} for s in SERVICES]},
    ],
    "contact": {
        "title": "Contact",
        "addressLines": ADDRESS_LINES,
        "phone": PHONE_LAND, "mobile": PHONE_MOBILE, "mobileWhatsApp": PHONE_MOBILE_WA, "email": EMAIL,
        "credentialsTitle": "Credentials",
        "credentials": ["ISO 9001:2015 \u00b7 ISO 14001:2015", "ISO 45001:2018 \u00b7 FSC\u00ae CoC Certified"],
    },
    "accreditedLabel": "Accredited By",
    "bottom": {"left": "\u00a9 2026 ARFAD International Industrial Co. \u00b7 Est. 2004", "right": "ARFAD, 20+ Years of Excellence in Woodwork"},
}

def esc(s):
    return html.escape(s, quote=True)

def nav(active):
    items = []
    for label, href, kids in NAV:
        is_cur = (active == href) or any(active == k for _, k in kids)
        cur = ' aria-current="page"' if is_cur else ""
        if kids:
            CUR = ' aria-current="page"'
            sub = "".join(f'<a href="{k}"{CUR if k == active else ""}>{esc(t)}</a>' for t, k in kids)
            cols = " cols-2" if len(kids) > 8 else ""
            items.append(
                f'<div class="nav-item has-sub{" is-current" if is_cur else ""}"><a class="nav-link" href="{href}"{cur}>{esc(label)}</a>'
                f'<button type="button" class="sub-toggle" aria-label="Toggle {esc(label)} menu" aria-expanded="false"></button>'
                f'<div class="submenu{cols}">{sub}</div></div>')
        else:
            items.append(f'<div class="nav-item{" is-current" if is_cur else ""}"><a class="nav-link" href="{href}"{cur}>{esc(label)}</a></div>')
    links_html = "\n      ".join(items)
    cta = "Request a Quote" if active != "contact.html" else "Email Us"
    cta_href = "contact.html" if active != "contact.html" else f"mailto:{EMAIL}"
    return f'''<header class="nav">
  <div class="nav-inner">
    <a class="brand" href="index.html">
      <img class="brand-mark" src="img/logo.png" alt="ARFAD logo">
      <span class="brand-name"><img src="img/wordmark.png" alt="ARFAD" style="height:15px;width:auto;display:block;"></span>
    </a>
    <nav class="links" id="primary-nav" aria-label="Main">
      {links_html}
    </nav>
    <a class="btn solid cta-desktop" href="{cta_href}">{cta}</a>
    <button type="button" class="nav-toggle" aria-expanded="false" aria-controls="primary-nav" aria-label="Open menu">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>'''

def _accredited_track():
    chips = "".join(
        '<span class="acc-chip acc-logo%s" title="%s"><img src="img/accreditation/%s" alt="%s" loading="lazy"></span>' % (" dark" if dark else "", esc(n), f, esc(n))
        for n, f, dark in ACCREDITED)
    return chips * 3

def render_footer(f):
    b, ct = f["brand"], f["contact"]
    cols = "".join('<div data-foot-col><h4>%s</h4>%s</div>' % (esc(col["title"]), "".join('<a href="%s">%s</a>' % (esc(l["href"]), esc(l["label"])) for l in col["links"])) for col in f["columns"])
    badges = "".join('<span class="foot-badge">%s</span>' % esc(x) for x in b["badges"])
    creds = "<br>".join(esc(x) for x in ct["credentials"])
    return (f'''<footer id="contact" class="site-foot">
  <div class="foot-glow" aria-hidden="true"></div>
  <div class="wrap foot-accredited">
    <p class="foot-label" data-foot="accreditedLabel">{esc(f["accreditedLabel"])}</p>
    <div class="acc-marquee"><div class="acc-track">{_accredited_track()}</div></div>
  </div>
  <div class="wrap foot-grid">
    <div class="foot-brand">
      <img class="brand-mark lg" src="img/logo.png" alt="ARFAD logo" style="margin-bottom:14px;">
      <img src="img/wordmark.png" alt="ARFAD" style="height:22px;width:auto;display:block;margin-bottom:14px;">
      <h4 data-foot="brandTitle" style="text-transform:none;letter-spacing:0;font-size:.95rem;color:var(--paper-on-navy);">{esc(b["title"])}</h4>
      <p class="ar-name" data-foot="arabicName" lang="ar" dir="rtl">{esc(b["arabicName"])}</p>
      <p data-foot="tagline" style="margin-top:8px;max-width:34ch;">{esc(b["tagline"])}</p>
      <a class="btn flash dl-btn" href="/download/company-profile" download="ARFAD-Company-Profile.pdf">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v3h16v-3"/></svg>
        <span data-foot="downloadLabel">{esc(b["downloadLabel"])}</span></a>
      <div class="foot-badges" data-foot="badges">{badges}</div>
    </div>
    <div class="foot-cols" data-foot="cols">{cols}</div>
    <div class="foot-contact" data-foot="contact">
      <h4>{esc(ct["title"])}</h4>
      <p>{"<br>".join(esc(x) for x in ct["addressLines"])}</p>
      <a href="tel:{esc(ct["phone"].replace(" ", ""))}">{esc(ct["phone"])}</a>
      <a href="https://wa.me/{esc(ct["mobileWhatsApp"])}">WhatsApp {esc(ct["mobile"])}</a>
      <a href="mailto:{esc(ct["email"])}">{esc(ct["email"])}</a>
      <h4 style="margin-top:18px;">{esc(ct["credentialsTitle"])}</h4>
      <p>{creds}</p>
    </div>
  </div>
  <div class="wrap foot-bottom">
    <span class="doc-tag" data-foot="bottomLeft">{esc(f["bottom"]["left"])}</span>
    <span class="doc-tag" data-foot="bottomRight">{esc(f["bottom"]["right"])}</span>
  </div>
</footer>''')

FOOTER = render_footer(FOOTER_DEFAULT)

WHATSAPP_FAB = '''<a class="whatsapp-fab" href="https://wa.me/966569164017" target="_blank" rel="noopener" aria-label="Chat with ARFAD on WhatsApp">
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
  var sel = ".head,.svc-card,.cert-card,.cert-photo-card,.feature-card,.stat-cell,.contact-card,.vm-item,.process-step,.table-wrap,.about-grid>div,.qual-cols>*,.detail-hero .wrap>*,.img-divider,.thumb-grid>*,.why-item,.client-band,.client-marquee,.foot-grid>*,.rv";
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
  var nums = document.querySelectorAll(".hf-item .num, .stat-cell .num, .fx-num");
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

/* client logos: pick up changes made in the admin Clients section (static markup stays as the fallback) */
(function(){
  var grid = document.querySelector('[data-clients="grid"]');
  var tracks = document.querySelectorAll('[data-clients="marquee"]');
  var vend = document.querySelectorAll('[data-client-logo]');
  if(!grid && !tracks.length && !vend.length) return;
  fetch("/api/clients", {headers:{Accept:"application/json"}})
    .then(function(r){ return r.ok ? r.json() : null; })
    .then(function(j){
      if(!j || !j.clients || !j.clients.length) return;
      var list = j.clients;
      function mono(n){ return n.replace(/&/g," ").split(/\\s+/).filter(Boolean).slice(0,2).map(function(w){return w[0];}).join("").toUpperCase(); }
      function el(tag, cls, text){ var e = document.createElement(tag); if(cls) e.className = cls; if(text) e.textContent = text; return e; }
      function logo(c, h){ var i = el("img"); i.src = c.logo; i.alt = c.name; i.loading = "lazy"; return i; }
      if(grid){
        grid.textContent = "";
        list.forEach(function(c, k){
          var t = el("div", "logo-tile flash on-light rv reveal-in");
          t.appendChild(c.logo ? logo(c) : el("span", "logo-mono", mono(c.name)));
          t.appendChild(el("span", "logo-name", c.name));
          grid.appendChild(t);
        });
      }
      tracks.forEach(function(track){
        track.textContent = "";
        for(var pass = 0; pass < 2; pass++){
          list.forEach(function(c){
            var s = el("span", "chip logo-chip flash on-light" + (c.logo ? " has-logo" : ""));
            if(c.logo){ s.title = c.name; s.appendChild(logo(c)); } else { s.textContent = c.name; }
            track.appendChild(s);
          });
        }
      });
      var byName = {};
      list.forEach(function(c){ byName[c.name.toLowerCase()] = c; });
      vend.forEach(function(v){
        var c = byName[(v.getAttribute("data-client-logo") || "").toLowerCase()];
        if(c && c.logo){ var i = v.querySelector("img"); if(i) i.src = c.logo; }
      });
    })
    .catch(function(){});
})();

/* photo lightbox: click any gallery photo to view it larger */
(function(){
  var links = Array.prototype.slice.call(document.querySelectorAll("a[data-lightbox]"));
  if(!links.length) return;
  var box = document.createElement("div");
  box.className = "lb"; box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true"); box.setAttribute("aria-label", "Photo viewer"); box.hidden = true;
  box.innerHTML = '<button type="button" class="lb-close" aria-label="Close">&times;</button>' +
    '<button type="button" class="lb-nav lb-prev" aria-label="Previous photo">&#8249;</button>' +
    '<figure class="lb-fig"><img alt=""><figcaption></figcaption></figure>' +
    '<button type="button" class="lb-nav lb-next" aria-label="Next photo">&#8250;</button>';
  document.body.appendChild(box);
  var img = box.querySelector("img"), cap = box.querySelector("figcaption");
  var group = [], idx = 0, last = null;
  function show(i){
    idx = (i + group.length) % group.length;
    var a = group[idx];
    img.classList.remove("in");
    img.src = a.getAttribute("href");
    img.alt = a.getAttribute("data-caption") || "Project photo";
    cap.textContent = (a.getAttribute("data-caption") || "") + (group.length > 1 ? "  \u00b7  " + (idx + 1) + " / " + group.length : "");
    box.classList.toggle("single", group.length < 2);
  }
  img.addEventListener("load", function(){ img.classList.add("in"); });
  function open(a){
    var grid = a.closest(".thumb-grid") || document;
    group = Array.prototype.slice.call(grid.querySelectorAll("a[data-lightbox]"));
    last = a; show(group.indexOf(a));
    box.hidden = false; document.body.classList.add("lb-open"); box.querySelector(".lb-close").focus();
  }
  function close(){ box.hidden = true; document.body.classList.remove("lb-open"); img.removeAttribute("src"); if(last) last.focus(); }
  links.forEach(function(a){ a.addEventListener("click", function(e){ e.preventDefault(); open(a); }); });
  box.addEventListener("click", function(e){
    if(e.target === box || e.target.classList.contains("lb-fig")) close();
    else if(e.target.closest(".lb-close")) close();
    else if(e.target.closest(".lb-prev")) show(idx - 1);
    else if(e.target.closest(".lb-next")) show(idx + 1);
  });
  document.addEventListener("keydown", function(e){
    if(box.hidden) return;
    if(e.key === "Escape") close();
    else if(e.key === "ArrowLeft") show(idx - 1);
    else if(e.key === "ArrowRight") show(idx + 1);
  });
  var x0 = null;
  box.addEventListener("touchstart", function(e){ x0 = e.touches[0].clientX; }, {passive:true});
  box.addEventListener("touchend", function(e){
    if(x0 === null) return; var dx = e.changedTouches[0].clientX - x0; x0 = null;
    if(Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
  }, {passive:true});
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

/* mobile nav toggle + dropdown sub-menus */
(function(){
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");
  if(!toggle || !nav) return;
  function closeAll(){
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }
  toggle.addEventListener("click", function(){
    var open = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  function bind(){
    nav.querySelectorAll(".sub-toggle").forEach(function(b){
      b.addEventListener("click", function(e){
        e.preventDefault();
        var item = b.parentNode;
        var open = item.classList.toggle("open");
        b.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
    nav.querySelectorAll("a").forEach(function(a){ a.addEventListener("click", closeAll); });
  }
  bind();
  window.__arfadNavBind = bind;
  document.addEventListener("keydown", function(e){ if(e.key === "Escape") closeAll(); });
})();

/* header menu + footer: pick up changes made in the admin (the baked-in markup is the fallback) */
(function(){
  var tag = document.getElementById("site-defaults");
  var nav = document.getElementById("primary-nav");
  if(!tag) return;
  var baked; try{ baked = JSON.parse(tag.textContent); }catch(e){ return; }
  function norm(o){
    return JSON.stringify(o, function(k, v){
      if(v && typeof v === "object" && !Array.isArray(v)){ return Object.keys(v).sort().reduce(function(a, key){ a[key] = v[key]; return a; }, {}); }
      return v;
    });
  }
  function el(tag, cls, text){ var e = document.createElement(tag); if(cls) e.className = cls; if(text != null) e.textContent = text; return e; }
  function safe(h){ h = String(h || "").trim(); return /^(javascript|data|vbscript):/i.test(h) ? "#" : h; }
  function link(href, text, cls){ var a = el("a", cls, text); a.setAttribute("href", safe(href)); return a; }
  function currentFile(){
    var f = location.pathname.split("/").pop() || "index.html";
    return f.indexOf("project-") === 0 ? "projects.html" : f;
  }
  function renderNav(items){
    if(!nav) return;
    var cur = currentFile();
    nav.textContent = "";
    items.forEach(function(it){
      var kids = it.children || [];
      var isCur = it.href === cur || kids.some(function(k){ return k.href === cur; });
      var wrap = el("div", "nav-item" + (kids.length ? " has-sub" : "") + (isCur ? " is-current" : ""));
      var a = link(it.href, it.label, "nav-link"); if(isCur) a.setAttribute("aria-current", "page");
      wrap.appendChild(a);
      if(kids.length){
        var b = el("button", "sub-toggle"); b.type = "button"; b.setAttribute("aria-label", "Toggle " + it.label + " menu"); b.setAttribute("aria-expanded", "false");
        wrap.appendChild(b);
        var sub = el("div", "submenu" + (kids.length > 8 ? " cols-2" : ""));
        kids.forEach(function(k){ var ka = link(k.href, k.label); if(k.href === cur) ka.setAttribute("aria-current", "page"); sub.appendChild(ka); });
        wrap.appendChild(sub);
      }
      nav.appendChild(wrap);
    });
    if(window.__arfadNavBind) window.__arfadNavBind();
  }
  function setText(key, val){ var n = document.querySelector('[data-foot="' + key + '"]'); if(n && val != null) n.textContent = val; }
  function renderFooter(f){
    var b = f.brand || {}, ct = f.contact || {};
    setText("accreditedLabel", f.accreditedLabel); setText("brandTitle", b.title); setText("arabicName", b.arabicName);
    setText("tagline", b.tagline); setText("downloadLabel", b.downloadLabel);
    setText("bottomLeft", (f.bottom || {}).left); setText("bottomRight", (f.bottom || {}).right);
    var badges = document.querySelector('[data-foot="badges"]');
    if(badges){ badges.textContent = ""; (b.badges || []).forEach(function(x){ badges.appendChild(el("span", "foot-badge", x)); }); }
    var cols = document.querySelector('[data-foot="cols"]');
    if(cols){
      cols.textContent = "";
      (f.columns || []).forEach(function(col){
        var d = el("div"); d.setAttribute("data-foot-col", "");
        d.appendChild(el("h4", null, col.title));
        (col.links || []).forEach(function(l){ d.appendChild(link(l.href, l.label)); });
        cols.appendChild(d);
      });
    }
    var box = document.querySelector('[data-foot="contact"]');
    if(box){
      box.textContent = "";
      box.appendChild(el("h4", null, ct.title));
      var p = el("p"); (ct.addressLines || []).forEach(function(line, i){ if(i) p.appendChild(document.createElement("br")); p.appendChild(document.createTextNode(line)); }); box.appendChild(p);
      if(ct.phone) box.appendChild(link("tel:" + String(ct.phone).replace(/\\s+/g, ""), ct.phone));
      if(ct.mobile) box.appendChild(link("https://wa.me/" + String(ct.mobileWhatsApp || "").replace(/\\D/g, ""), "WhatsApp " + ct.mobile));
      if(ct.email) box.appendChild(link("mailto:" + ct.email, ct.email));
      var h = el("h4", null, ct.credentialsTitle); h.style.marginTop = "18px"; box.appendChild(h);
      var cp = el("p"); (ct.credentials || []).forEach(function(line, i){ if(i) cp.appendChild(document.createElement("br")); cp.appendChild(document.createTextNode(line)); }); box.appendChild(cp);
    }
  }
  function get(u){ return fetch(u, {headers:{Accept:"application/json"}}).then(function(r){ return r.ok ? r.json() : null; }).catch(function(){ return null; }); }
  get("/api/navigation").then(function(j){ if(j && j.items && j.items.length && norm(j.items) !== norm(baked.nav)) renderNav(j.items); });
  get("/api/footer").then(function(j){ if(j && j.footer && norm(j.footer) !== norm(baked.footer)) renderFooter(j.footer); });
})();

/* enquiry / careers forms: post to the site backend */
(function(){
  document.querySelectorAll("form[data-enquiry]").forEach(function(form){
    var started = Date.now();
    var picker = form.querySelector('input[type=file]');
    if(picker){ picker.addEventListener("change", function(){ var n = form.querySelector(".file-name"); if(n) n.textContent = picker.files && picker.files[0] ? picker.files[0].name : "No file chosen"; }); }
    var status = form.querySelector(".form-status");
    var btn = form.querySelector("button[type=submit]");
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var fd = new FormData(form);
      var fileInput = form.querySelector('input[type=file]');
      var file = fileInput && fileInput.files && fileInput.files[0];
      status.className = "form-status";
      if(file){
        var okType = /\\.(pdf|docx?)$/i.test(file.name);
        if(!okType){ status.className = "form-status err"; status.textContent = "Please attach your CV as a PDF or Word document (.pdf, .doc, .docx)."; return; }
        if(file.size > 5 * 1024 * 1024){ status.className = "form-status err"; status.textContent = "Your CV is larger than 5 MB. Please attach a smaller file."; return; }
      }
      var req;
      if(file){
        fd.append("page", location.pathname);
        fd.append("t", String(started));
        req = {method:"POST", body: fd};
      } else {
        fd.delete("cv");
        var body = {
          name: fd.get("name"), email: fd.get("email"), phone: fd.get("phone") || "",
          subject: fd.get("subject") || "", enquiryType: fd.get("enquiryType") || "",
          message: fd.get("message"), page: location.pathname, website: fd.get("website") || "", t: started
        };
        req = {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(body)};
      }
      status.textContent = file ? "Uploading your CV..." : "Sending...";
      btn.disabled = true;
      fetch("/api/enquiry", req)
        .then(function(r){ return r.json().catch(function(){ return {ok:false}; }); })
        .then(function(j){
          if(j && j.ok){
            status.className = "form-status ok";
            status.textContent = "Thank you. Your message has been sent and our team will reply shortly.";
            form.reset(); started = Date.now();
            var fn = form.querySelector(".file-name"); if(fn) fn.textContent = "No file chosen";
          } else {
            status.className = "form-status err";
            status.textContent = (j && j.error) || "We could not send your message. Please email info@arfad.com.sa or call us.";
          }
        })
        .catch(function(){
          status.className = "form-status err";
          status.textContent = "We could not send your message. Please email info@arfad.com.sa or call us.";
        })
        .then(function(){ btn.disabled = false; });
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

import json as _json
SITE_DEFAULTS = {"nav": NAV_DEFAULT, "footer": FOOTER_DEFAULT}
SITE_DEFAULTS_TAG = '<script type="application/json" id="site-defaults">' + _json.dumps(SITE_DEFAULTS, ensure_ascii=False).replace("</", "<\\/") + '</script>'

def page(title, desc, active, body, extra_head="", wrap=True, path=None):
    canonical_path = path or active
    canonical = f"{SITE_URL}/{canonical_path}"
    og_title = _strip_tags(title)
    head = THEME_INIT + "\n" + HEAD.format(title=title, desc=desc, canonical=canonical, og_title=og_title, site_url=SITE_URL)
    head += "\n" + ORG_SCHEMA
    if extra_head:
        head += "\n" + extra_head
    content = JS_REVEAL_INIT + "\n" + nav(active) + "\n" + body + "\n" + FOOTER + "\n" + SITE_DEFAULTS_TAG + "\n" + WHATSAPP_FAB + "\n" + THEME_SWITCH + "\n" + JS_REVEAL_OBSERVER + "\n" + TRACK_SCRIPT
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
