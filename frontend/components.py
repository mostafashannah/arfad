import re
from core import *

ICONS = {
 "doc":'<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>',
 "shield":'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5L16 9.5"/>',
 "leaf":'<path d="M5 19c0-9 5-14 15-14 0 10-5 15-14 15"/><path d="M5 19c3-5 6-8 10-10"/>',
 "gear":'<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>',
 "factory":'<path d="M3 21V10l6 4v-4l6 4V6h3v15z"/><path d="M7 21v-3M12 21v-3"/>',
 "users":'<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.5 3-6 6-6s6 2.5 6 6"/><circle cx="17" cy="9" r="2.4"/><path d="M16 14c3 0 5 2 5 5"/>',
 "truck":'<path d="M2 7h11v9H2zM13 10h4l3 3v3h-7z"/><circle cx="6" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/>',
 "ruler":'<path d="M3 17L17 3l4 4L7 21z"/><path d="M7 13l2 2M10 10l2 2M13 7l2 2"/>',
 "check":'<circle cx="12" cy="12" r="9"/><path d="M8 12.5l3 3 5-6"/>',
 "flame":'<path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3 0-6 1-9z"/>',
 "wood":'<path d="M4 8l8-4 8 4-8 4z"/><path d="M4 8v8l8 4 8-4V8M12 12v8"/>',
 "star":'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
 "spray":'<rect x="8" y="9" width="8" height="12" rx="2"/><path d="M10 9V6h4v3M16 4h3M16 7h4M16 10h3"/>',
 "pen":'<path d="M4 20l1-4L17 4l3 3L8 19z"/><path d="M14 7l3 3"/>',
 "target":'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
 "pin":'<path d="M12 21s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>',
 "mail":'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
 "phone":'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
 "camera":'<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
 "news":'<path d="M5 4h12v16H5zM17 8h3v10a2 2 0 0 1-2 2"/><path d="M8 8h6M8 12h6M8 16h4"/>',
 "flag":'<path d="M5 21V4M5 4h12l-2 4 2 4H5"/>',
}

def icon(name, cls="ico"):
    return f'<svg class="{cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{ICONS[name]}</svg>'

def cta_btns(primary=("Request a Quote","contact.html"), secondary=None, center=False, light=False):
    cls = "hero-cta" + ("" if not center else "")
    style = ' style="justify-content:center;margin-top:30px;"' if center else ""
    if light:
        b = f'<a class="btn cta-band-btn flash" href="{primary[1]}">{primary[0]}</a>'
        if secondary: b += f'<a class="btn cta-band-btn-outline" href="{secondary[1]}">{secondary[0]}</a>'
    else:
        b = f'<a class="btn solid flash" href="{primary[1]}">{primary[0]}</a>'
        if secondary: b += f'<a class="btn" href="{secondary[1]}">{secondary[0]}</a>'
    return f'<div class="{cls}"{style}>{b}</div>'

def crumbs(parts):
    out = ['<a href="index.html">Home</a>']
    for t, href in parts:
        out.append(f'<a href="{href}">{t}</a>' if href else t)
    return '<p class="crumb">' + " / ".join(out) + "</p>"

def subhero(parts, eyebrow, title, lede="", img="factory.jpg", btns=""):
    lede_html = f'<p class="hero-lede">{lede}</p>' if lede else ""
    return f'''<section class="detail-hero">
    <div class="hero-bg" style="background-image:url('img/{img}');"></div>
    <div class="hero-overlay"></div>
    <div class="wrap">
      {crumbs(parts)}
      <p class="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {lede_html}
      {btns}
    </div>
  </section>'''

def head(eyebrow, title, lede="", center=False):
    cls = "head center" if center else "head"
    lede_html = f'<p class="ink-soft">{lede}</p>' if lede else ""
    return f'<div class="{cls}"><p class="eyebrow">{eyebrow}</p><h2>{title}</h2>{lede_html}</div>'

def section(inner, cls="", style=""):
    st = f' style="{style}"' if style else ""
    return f'<section class="section {cls}"{st}>\n    <div class="wrap">\n{inner}\n    </div>\n  </section>'

def photo_band(img, inner, cls="on-navy", overlay=.9):
    return (f'<section class="section photo-band {cls}" style="background-image:linear-gradient(180deg,rgba(7,19,32,{overlay}),rgba(10,37,64,{min(overlay+.05,.98)})),url(\'img/{img}\');">\n'
            f'    <div class="wrap">\n{inner}\n    </div>\n  </section>')

def bullets(items, cls="qual-list"):
    return f'<ul class="{cls}">' + "".join(f"<li>{i}</li>" for i in items) + "</ul>"

def scope_grid(items, ico="check"):
    cells = "".join(f'<div class="scope-item rv flash on-light" style="--d:{(i%4)*.06:.2f}s">{icon(ico)}<span>{t}</span></div>' for i, t in enumerate(items))
    return f'<div class="scope-grid">{cells}</div>'

def split(eyebrow, title, paras, img, reverse=False, extra="", ratio="16/11"):
    ptxt = "".join(f'<p style="margin-top:{20 if i==0 else 16}px;font-size:1.02rem;">{p}</p>' for i, p in enumerate(paras))
    text = f'<div><p class="eyebrow">{eyebrow}</p><h2 style="margin-top:10px;">{title}</h2>{ptxt}{extra}</div>'
    pic = f'<div class="split-img" style="aspect-ratio:{ratio};background-image:url(\'img/{img}\');"></div>'
    body = (pic + text) if reverse else (text + pic)
    return f'<div class="about-grid">{body}</div>'

def subnav(items, current):
    links = "".join(('<a href="%s" aria-current="page">%s</a>' if h == current else '<a href="%s">%s</a>') % (h, t) for t, h in items)
    return f'<div class="subnav"><div class="wrap">{links}</div></div>'

def logo_tile(name, delay=0.0):
    src = client_logo(name)
    inner = f'<img src="{src}" alt="{esc(name)}" loading="lazy">' if src else f'<span class="logo-mono">{esc("".join(w[0] for w in name.replace("&"," ").split()[:2]).upper())}</span>'
    return f'<div class="logo-tile rv flash on-light" style="--d:{delay:.2f}s">{inner}<span class="logo-name">{esc(name)}</span></div>'

def _chip(n):
    src = client_logo(n)
    if src:
        return '<span class="chip logo-chip has-logo flash on-light" title="%s"><img src="%s" alt="%s" loading="lazy"></span>' % (esc(n), src, esc(n))
    return '<span class="chip logo-chip flash on-light">%s</span>' % esc(n)

def clients_marquee(names=None, label="Trusted By"):
    names = names or CLIENTS
    chips = "".join(_chip(n) for n in names)
    return (f'<div class="divider-label"><span class="eyebrow" style="margin:0;">{label}</span></div>'
            f'<div class="client-marquee"><div class="client-marquee-track" data-clients="marquee">{chips}{chips}</div></div>')

def other_services(exclude=None, n=4):
    pool = [s for s in SERVICES if s["slug"] != exclude]
    cards = "".join(svc_card(s, i) for i, s in enumerate(pool[:n]))
    return f'<div class="svc-grid">{cards}</div>'

def svc_card(s, i=0):
    return (f'<a class="svc-card flash on-light" href="service-{s["slug"]}.html">'
            f'<div class="thumb" style="background-image:url(\'img/{s["img"]}\');"></div>'
            f'<div class="body"><span class="idx">{i+1:02d}</span><h3>{esc(s["title"])}</h3><p>{s["card"]}</p></div></a>')

def cta_band(title="Let's build something that lasts twenty years.", eyebrow="Get in touch"):
    return f'''<section class="section cta-band">
    <div class="wrap" style="text-align:center;">
      <p class="eyebrow" style="justify-content:center;">{eyebrow}</p>
      <h2 style="margin-top:14px;font-size:clamp(1.9rem,4vw,2.8rem);max-width:26ch;margin-inline:auto;">{title}</h2>
      {cta_btns(("Request a Quote","contact.html"),("Email Us",f"mailto:{EMAIL}"),center=True,light=True)}
    </div>
  </section>'''

def project_card(slug, i=0):
    p = PROJECT_PAGES[slug]
    loc = f"<p>{esc(p['loc'])}</p>" if p["loc"].strip() else ""
    return (f'<a class="gallery-card flash" href="project-{slug}.html" style="background-image:url(\'img/projects/{p["img"]}\');">'
            f'<div class="gc-body"><p class="eyebrow">{esc(p["client"])}</p><h4>{esc(p["title"])}</h4>{loc}</div></a>')

def _photo_caption(im):
    slug = re.sub(r"-\d+\.\w+$", "", im)
    p = PROJECT_PAGES.get(slug)
    return p["client"] if p else ""

def gallery(images, base="img/projects/"):
    out = []
    for i, im in enumerate(images):
        cap = esc(_photo_caption(im))
        out.append('<a class="thumb-photo rv" href="%s%s" data-lightbox data-caption="%s" style="--d:%.2fs"><img src="%s%s" alt="%s" loading="lazy"></a>' % (base, im, cap, (i % 3) * .08, base, im, cap or "Project photo"))
    return '<div class="thumb-grid">' + "".join(out) + "</div>"

def enquiry_form(types, submit="Send Message", kind="Enquiry", cv=False):
    opts = "".join(f"<option>{t}</option>" for t in types)
    cv_field = ('<label class="file-field">Attach Your CV (PDF or Word, max 5 MB)<span class="file-drop"><input name="cv" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"></span></label>' if cv else "")
    return f'''<form class="enq-form" data-enquiry novalidate>
        <div class="enq-row"><label>Your Name<input name="name" required maxlength="120" autocomplete="name"></label>
          <label>Your Email<input name="email" type="email" required maxlength="200" autocomplete="email"></label></div>
        <div class="enq-row"><label>Phone Number<input name="phone" maxlength="60" autocomplete="tel"></label>
          <label>Subject<input name="subject" maxlength="200"></label></div>
        <label>{kind} Type<select name="enquiryType"><option value="">Select...</option>{opts}</select></label>
        <label>Your Message<textarea name="message" rows="6" required maxlength="5000"></textarea></label>
        {cv_field}
        <input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
        <p class="form-status" role="status" aria-live="polite"></p>
        <button class="btn solid flash" type="submit">{submit}</button>
      </form>'''
