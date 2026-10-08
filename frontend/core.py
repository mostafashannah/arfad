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
    chips = "".join(f'<span class="acc-chip">{esc(a)}</span>' for a in ACCREDITED)
    return chips * 4

_foot_services = "".join(f'<a href="service-{s["slug"]}.html">{esc(s["title"])}</a>' for s in SERVICES[:6])
_foot_services2 = "".join(f'<a href="service-{s["slug"]}.html">{esc(s["title"])}</a>' for s in SERVICES[6:])

FOOTER = f'''<footer id="contact" class="site-foot">
  <div class="foot-glow" aria-hidden="true"></div>
  <div class="wrap foot-accredited">
    <p class="foot-label">Accredited By</p>
    <div class="acc-marquee"><div class="acc-track">{_accredited_track()}</div></div>
  </div>
  <div class="wrap foot-grid">
    <div class="foot-brand">
      <img class="brand-mark lg" src="img/logo.png" alt="ARFAD logo" style="margin-bottom:14px;">
      <img src="img/wordmark.png" alt="ARFAD" style="height:22px;width:auto;display:block;margin-bottom:14px;">
      <h4 style="text-transform:none;letter-spacing:0;font-size:.95rem;color:var(--paper-on-navy);">ARFAD International Industrial Co.</h4>
      <p class="ar-name" lang="ar" dir="rtl">{AR_NAME}</p>
      <p style="margin-top:8px;max-width:34ch;">Crafting Excellence in Woodwork Since 2004. {TAGLINE}.</p>
      <a class="btn flash dl-btn" href="files/ARFAD-Company-Profile.pdf" download>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v3h16v-3"/></svg>
        Download Profile</a>
      <div class="foot-badges">
        <span class="foot-badge">Saudi Made</span>
        <span class="foot-badge">Local Content Certified</span>
      </div>
    </div>
    <div>
      <h4>Quick Links</h4>
      <a href="index.html">Home</a>
      <a href="about.html">Who We Are</a>
      <a href="services.html">Services</a>
      <a href="projects.html">Projects</a>
      <a href="factory.html">Factory</a>
      <a href="sustainability.html">Sustainability</a>
      <a href="careers.html">Careers</a>
      <a href="media.html">Media</a>
      <a href="contact.html">Contact</a>
    </div>
    <div>
      <h4>Services</h4>
      {_foot_services}{_foot_services2}
    </div>
    <div>
      <h4>Contact</h4>
      <p>{"<br>".join(ADDRESS_LINES)}</p>
      <a href="tel:{PHONE_LAND_TEL}">{PHONE_LAND}</a>
      <a href="https://wa.me/{PHONE_MOBILE_WA}">WhatsApp {PHONE_MOBILE}</a>
      <a href="mailto:{EMAIL}">{EMAIL}</a>
      <h4 style="margin-top:18px;">Credentials</h4>
      <p>ISO 9001:2015 &middot; ISO 14001:2015<br>ISO 45001:2018 &middot; FSC&reg; CoC Certified</p>
    </div>
  </div>
  <div class="wrap foot-bottom">
    <span class="doc-tag">&copy; 2026 ARFAD International Industrial Co. &middot; Est. 2004</span>
    <span class="doc-tag">ARFAD, 20+ Years of Excellence in Woodwork</span>
  </div>
</footer>'''

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
  nav.querySelectorAll(".sub-toggle").forEach(function(b){
    b.addEventListener("click", function(e){
      e.preventDefault();
      var item = b.parentNode;
      var open = item.classList.toggle("open");
      b.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });
  nav.querySelectorAll("a").forEach(function(a){ a.addEventListener("click", closeAll); });
  document.addEventListener("keydown", function(e){ if(e.key === "Escape") closeAll(); });
})();

/* enquiry / careers forms: post to the site backend */
(function(){
  document.querySelectorAll("form[data-enquiry]").forEach(function(form){
    var started = Date.now();
    var status = form.querySelector(".form-status");
    var btn = form.querySelector("button[type=submit]");
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var fd = new FormData(form);
      var body = {
        name: fd.get("name"), email: fd.get("email"), phone: fd.get("phone") || "",
        subject: fd.get("subject") || "", enquiryType: fd.get("enquiryType") || "",
        message: fd.get("message"), page: location.pathname, website: fd.get("website") || "", t: started
      };
      status.className = "form-status";
      status.textContent = "Sending...";
      btn.disabled = true;
      fetch("/api/enquiry", {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(body)})
        .then(function(r){ return r.json().catch(function(){ return {ok:false}; }); })
        .then(function(j){
          if(j && j.ok){
            status.className = "form-status ok";
            status.textContent = "Thank you. Your message has been sent and our team will reply shortly.";
            form.reset(); started = Date.now();
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
