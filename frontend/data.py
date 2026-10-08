# Site content. All wording comes from the ARFAD Final Company Profile (CP) unless marked [DRAFT].
# Typos in the CP are corrected and em-dashes are written as commas, per the site convention.
import os, re

ROOT = os.path.dirname(os.path.abspath(__file__))

PHONE_LAND = "+966 13 341 7773"
PHONE_LAND_TEL = "+966133417773"
PHONE_MOBILE = "+966 56 916 4017"          # per client comment sheet (CP still shows +966 56 121 0469)
PHONE_MOBILE_WA = "966569164017"
EMAIL = "info@arfad.com.sa"
ADDRESS_LINES = ["Support Industrial", "Jubail Industrial City, KSA"]   # [TO CONFIRM] client asked for the National Address
TAGLINE = "Luxury Wooden Works is Our Professional Identity"
AR_NAME = "شركة أرفاد الدولية للصناعة"

# ---------------------------------------------------------------- services
# slug, nav title, image, short card text, tagline, intro, scope heading, scope list, related project slugs
SERVICES = [
 dict(slug="doors", title="Wooden Doors", img="svc-doors.jpg",
  card="Fire-rated, non-fire rated, solid, flush, louver, sliding, pocket and X-ray protected doors.",
  tagline="Doors Engineered for Specification and Finished to Perfection",
  intro=["ARFAD manufactures wooden doors tailored to the technical, functional, and architectural requirements of residential, hospitality, government, and large-scale development projects.",
         "Complete wooden door solutions, including vision panel doors, decorative finishes, and customized door systems designed to meet architectural, functional, and project-specific requirements."],
  scope_title="Door types",
  scope=["Wooden Internal Doors","Wooden External Doors","Fire-Rated Doors","Flush Doors","Solid Core Doors","Pocket Doors","Sliding Doors","Plastic Laminated Doors","Louver Doors","X-Ray Protected Doors","Custom Components"],
  extra=dict(kind="fire", eyebrow="Fire-Rated Wooden Doors", title="Wooden Doors Crafted to Withstand the Unthinkable.",
             lead="Where Natural Warmth Meets Certified Fire Protection. Precision-Manufactured Fire-Rated Doors.",
             text="ARFAD manufactures certified fire-rated wooden doors engineered to contain fire, protect lives, and comply with the most demanding international project requirements, without compromising aesthetics or finishing quality.",
             badge="Intertek Certified Fire-Rated Door Manufacturer", badge2="Certified up to 120 Minutes Fire Resistance"),
  projects=["saudi-aramco","royal-commission","redsea-amaala","misk","ministry-of-defense"]),
 dict(slug="wall-cladding", title="Wooden Wall Claddings", img="svc-cladding.jpg",
  card="Internal, external, thermowood, decorative and slatted wall cladding.",
  tagline="Architectural Wood Surfaces Engineered for Precision and Performance",
  intro=["ARFAD delivers architectural wood cladding and ceiling systems tailored to each project's design intent, technical requirements, and approved specifications."],
  scope_title="Wall cladding scope",
  scope=["Internal Wooden Wall Cladding","External Wooden Cladding","Thermowood Exterior Cladding","Decorative Wooden Panels","Slatted Wood Cladding"],
  projects=["neom","misk","ministry-of-defense","movenpick","karan"]),
 dict(slug="ceilings", title="Wooden Ceilings", img="svc-interior.jpg",
  card="Wooden, decorative and slatted wooden ceilings.",
  tagline="Architectural Wood Surfaces Engineered for Precision and Performance",
  intro=["ARFAD delivers architectural wood cladding and ceiling systems tailored to each project's design intent, technical requirements, and approved specifications."],
  scope_title="Ceiling scope",
  scope=["Wooden Ceilings","Decorative Ceiling Panels","Slatted Wooden Ceilings"],
  projects=["neom","misk","ministry-of-defense","redsea-amaala"]),
 dict(slug="flooring", title="Wooden Floorings", img="svc-furniture.jpg",
  card="Wooden flooring supplied and installed as part of complete woodwork packages.",
  tagline="Wooden Floorings for Distinctive Spaces",
  intro=["Wooden flooring is part of ARFAD's scope of architectural wood works, supplied and installed alongside doors, cladding, ceilings and joinery.",
         "Flooring has been delivered on projects such as the NEOM Multipurpose Hall, and forms part of the 161,500+ m² of cladding, ceiling and flooring works delivered by ARFAD."],
  scope_title="Flooring scope",
  scope=["Wooden Floorings","Thermowood Decking","WPC Decking","Timber Decking"],
  projects=["neom","redsea-amaala"]),
 dict(slug="kitchens", title="Kitchens & Cabinets", img="svc-cabinets.jpg",
  card="Kitchen cabinets with countertops, delivered at housing-development scale.",
  tagline="Kitchen Cabinets Manufactured for Residential and Hospitality Scale",
  intro=["ARFAD manufactures kitchen cabinets, with countertops where specified, for villas, apartments, hotels and large housing developments across the Kingdom."],
  scope_title="Cabinet scope",
  scope=["Kitchen Cabinets","Kitchen Countertops","Cabinets with Countertops","Storage"],
  projects=["saudi-aramco","royal-commission","movenpick","karan"]),
 dict(slug="wardrobes", title="Wardrobes & Closets", img="svc-cabinets.jpg",
  card="Wardrobes and closets supplied and installed across villas and apartment buildings.",
  tagline="Wardrobes and Closets Built to Specification",
  intro=["ARFAD supplies and installs wardrobes and closets for villas and multi-storey apartment buildings, manufactured in-house to the approved drawings."],
  scope_title="Wardrobe scope",
  scope=["Wardrobes","Closets","Full wardrobe supply and installation","Storage"],
  projects=["royal-commission"]),
 dict(slug="vanities", title="Vanities & Storage Systems", img="svc-countertops.jpg",
  card="Vanity units, vanity tops and storage systems.",
  tagline="Vanities and Storage Systems for Residential and Hospitality Projects",
  intro=["ARFAD manufactures vanities, vanity tops and storage systems for housing developments, hotels and commercial buildings."],
  scope_title="Vanity and storage scope",
  scope=["Vanities","Vanity Tops","Vanity Shelves","Laundry Shelves","Storage"],
  projects=["saudi-aramco","royal-commission","kafd"]),
 dict(slug="reception-counters", title="Reception Counters", img="svc-joinery.jpg",
  card="Reception counters and bespoke joinery built to spec.",
  tagline="Custom Joinery. Built to Spec.",
  intro=["ARFAD delivers bespoke joinery solutions manufactured to meet each project's architectural vision, approved drawings, functional requirements, and site conditions."],
  scope_title="Joinery scope",
  scope=["Reception Counters","Feature Panels","Hotel Joinery","Restaurant Joinery","Customized Joinery","Wall Units","Built-in Elements","Office Joinery","Retail Joinery","Heritage Joinery"],
  projects=["neom","marafiq","kafd","karan"]),
 dict(slug="furniture", title="Interior Furniture & Decors", img="svc-furniture.jpg",
  card="Custom furniture and interior woodworks for hospitality, residential, commercial and public spaces.",
  tagline="Tailored Furniture for Distinctive Spaces",
  intro=["ARFAD manufactures custom furniture tailored to each project's design concept, dimensions, functional requirements, and selected finishes, with a focus on quality craftsmanship and refined execution.",
         "ARFAD also delivers interior woodwork solutions that bring warmth, functionality, and architectural character to hospitality, residential, commercial, institutional, and public spaces, including schools, auditoriums, villas, airports and mosques."],
  scope_title="Furniture scope",
  scope=["Loose Furniture","Hotel Furniture","Restaurant Furniture","Office Furniture","Custom Seating","Tables & Side Tables","Decorative Wooden Pieces","Bespoke Furniture"],
  scope2_title="Interior woodworks scope",
  scope2=["Wooden Partitions","Decorative Wood Screens","Wooden Skirting","Wooden Staircases","Wooden Handrails","Wooden Balustrades","Architectural Wood Features"],
  projects=["primer-steak-house","karan","movenpick","misk"]),
 dict(slug="exterior", title="Exterior Woodworks", img="svc-thermowood.jpg", img2="svc-wpc.jpg",
  card="Thermowood and WPC decking, cladding, pergolas, louvers, screens and canopies.",
  tagline="Thermowood Built for Exterior Performance and Natural Warmth",
  intro=["ARFAD delivers specialized Thermowood solutions for architectural applications requiring durability, dimensional stability, and refined natural finishes across demanding exterior and interior environments.",
         "ARFAD also delivers specialized WPC solutions for exterior architectural applications, combining the natural appearance of wood with durability, weather resistance, low maintenance, and long-term performance."],
  scope_title="Thermowood scope",
  scope=["Thermowood Exterior Cladding","Thermowood Decking","Pergolas and Architectural Louvers","Screens & Privacy Panels","Canopies","Outdoor Architectural Features"],
  scope2_title="WPC scope",
  scope2=["WPC Decking","Exterior Wall Cladding","Façade Applications","Pergolas","Fencing & Privacy Screens","Landscape Features","Outdoor Seating Areas","Custom WPC Architectural Elements"],
  extra=dict(kind="apps", eyebrow="Thermowood Applications", title="Natural Timber Solutions for Demanding Environments",
             text="ARFAD applies Thermowood solutions across demanding architectural environments where durability, dimensional stability, weather resistance, and natural aesthetics are essential.",
             items=["Hospitality Exteriors","Resort & Hotel Walkways","Villa Terraces","Outdoor Seating Areas","Poolside Decking","Façade Applications","Landscape Structures"],
             note="Thermowood Works by ARFAD, AMAALA Staff Village, Zone 02"),
  projects=["redsea-amaala","el-eissa"]),
 dict(slug="countertops", title="Counter Tops & Solid Surfaces", img="svc-countertops-reception.jpg",
  card="Natural stone, engineered stone, quartz and travertine tops, fabricated and finished in-house.",
  tagline="Tailored Surface Solutions for Functional and Refined Spaces",
  intro=["ARFAD delivers customized countertop and surface solutions tailored to project requirements, combining functional performance, precise fabrication, and refined finishes across kitchens, vanities, reception areas, and hospitality spaces."],
  scope_title="Countertop and surface scope",
  scope=["Natural Stone Countertops","Engineered Stone Countertops","Quartz Countertops","Kitchen Countertops","Vanity Tops","Custom Countertops","Countertop Fabrication & Finishing","Travertine, Natural & Artificial Stone Tops"],
  projects=["saudi-aramco","royal-commission","kafd"]),
 dict(slug="traditional", title="Traditional Woodworks", img="svc-traditional.jpg",
  card="Hand-carved panels, mashrabiya screens, Islamic-patterned doors and majlis furniture.",
  tagline="Craftsmanship Rooted in Cultural Detail",
  intro=["ARFAD creates traditional woodworks inspired by Arabic and Islamic craftsmanship, combining authentic heritage details with precision manufacturing and refined finishing."],
  scope_title="Traditional woodworks scope",
  scope=["Hand-Carved Decorative Panels","Geometric Mashrabiya Screens","Islamic-Patterned Wooden Doors","Traditional Wooden Screens","Decorative Wooden Arches","Window Surrounds","Majlis Furniture","Mosque Woodworks & Furniture","Customized Heritage Woodworks"],
  projects=["saudi-aramco","karan"]),
]
SERVICE_BY_SLUG = {s["slug"]: s for s in SERVICES}

# ---------------------------------------------------------------- projects
# detail pages (photos exist in img/projects)
PROJECT_PAGES = {
 "royal-commission": dict(title="Royal Commission for Jubail & Yanbu Projects", client="Royal Commission for Jubail & Yanbu", loc="Al Jubail", img="royal-commission-1.jpg", imgs=["royal-commission-1.jpg"],
   desc="Supply, installation and joinery works across apartment buildings, family apartments, housing phases and schools in Jubail.",
   items=[("Phase C71, Apartment Buildings","Supply of 7,000 wooden doors, 326 kitchen cabinets, and loose furniture."),
          ("Phase C13, Housing","Scope across 348 villas, including 2,500 wooden doors, 348 kitchen cabinets, 348 vanity tops, 348 wardrobes, handrails, mosque doors, and furniture."),
          ("Phase C08 / C09, Housing","Scope across 400 villas, including 800 wooden doors, 400 kitchen cabinets with countertops, 400 vanity tops, 400 wardrobes, and handrails."),
          ("Phase C03, Housing","Scope across 287 villas, including 287 folding doors with frames and wooden handrails."),
          ("Phase C16, Family Apartments","Full wooden wardrobe supply and installation across 8 buildings, 7 storeys each."),
          ("Phase C05, Family Apartments","Supply and installation of 640 louvre doors for A/C rooms and wooden handrails across 40 storeys."),
          ("Schools, Mutrafiah Phase 5","Full wooden door and joinery works for the entire school complex.")]),
 "saudi-aramco": dict(title="Saudi Aramco Projects", client="Saudi Aramco", loc="Jubail, Dhahran, Ras Al Khair", img="saudi-aramco-1.jpg", imgs=["saudi-aramco-1.jpg"],
   desc="Housing, maritime complex and mosque woodworks delivered for Saudi Aramco.",
   items=[("Al Mutrafiah Home Ownership Housing, Increment 1","Scope across 494 villas, including 6,653 internal wooden doors, 180 kitchen cabinets with countertops, 494 vanity tops, and 494 wooden handrails."),
          ("Al Mutrafiah Home Ownership Housing, Increment 2","Scope across 344 villas, including 4,984 internal wooden doors and 344 kitchen cabinets with countertops."),
          ("South Dhahran Housing Project, SDHOP","Supply and installation of 1,500 wooden doors with treated sub-frames across 110 villas."),
          ("SATORP Housing Project","Supply and installation of 110 vanity tops and 110 villa wooden handrails."),
          ("King Salman International Complex for Maritime, Ras Al Khair","Supply and installation of 4,500 wooden doors."),
          ("Aramco & Royal Commission Mosques, Al Jubail","Custom Islamic-design external wooden doors and mosque loose furniture for 6 mosque buildings.")]),
 "redsea-amaala": dict(title="The Red Sea Global & AMAALA Projects", client="Red Sea Global & AMAALA", loc="AMAALA, Triple Bay, NEOM", img="redsea-amaala-1.jpg",
   imgs=[f"redsea-amaala-{i}.jpg" for i in range(1,11)],
   desc="Staff villages, luxury resorts and hotel developments across AMAALA and the Red Sea, with a total of 4,758+ doors installed.",
   items=[("AMAALA Staff Village, Package 1","3,192 wooden doors."),
          ("Staff Village, Zones 1, 2 & 7","1,566 doors, hotel, villa, police & fire station joinery."),
          ("Six Senses Resort, Triple Bay","Full luxury resort joinery."),
          ("Southern Dunes Hotel","250 doors, 3,000 m² cladding, 1,000 m² ceilings."),
          ("Secondary Infrastructure","Thermowood exterior cladding.")], total="Total 4,758+ doors installed"),
 "neom": dict(title="NEOM Projects", client="NEOM (BECo)", loc="NEOM", img="neom-1.jpg", imgs=[f"neom-{i}.jpg" for i in range(1,7)],
   desc="Multipurpose hall, auditorium and VIP lounge woodworks delivered at NEOM.",
   items=[("Multipurpose Hall","100 doors, 1,700 m² cladding, 500 m² ceiling, 100 m² flooring, 10 reception counters."),
          ("Auditorium","High-end joinery and wall cladding."),
          ("VIP Lounge","Bespoke joinery, custom panelling, premium VIP finishes.")]),
 "movenpick": dict(title="Movenpick 5-Star Hotel, Wa'ad Al Shamal", client="Movenpick", loc="Wa'ad Al Shamal", img="movenpick-1.jpg", imgs=[f"movenpick-{i}.jpg" for i in range(1,4)],
   desc="Supply and installation of 850 wooden doors, kitchen cabinets, and 4,850 m² wooden wall cladding.", items=[]),
 "karan": dict(title="KARAN 5-Star Hotel, Al Jubail", client="KARAN Group", loc="Al Jubail", img="karan-1.jpg", imgs=[f"karan-{i}.jpg" for i in range(1,4)],
   desc="Interior wood cladding for restaurants and function rooms, with wooden doors throughout the hotel.", items=[]),
 "misk": dict(title="MISK School Phase 1 & 2, Riyadh", client="MISK Foundation (Baytur)", loc="Riyadh", img="misk-1.jpg", imgs=[f"misk-{i}.jpg" for i in range(1,4)],
   desc="Supply and installation of 1,500 wooden doors, 2,000 m² of wooden wall cladding, and 700 m² of wooden ceiling works.", items=[]),
 "kafd": dict(title="KAFD, King Abdullah Financial District, Riyadh", client="KAFD", loc="Riyadh", img="kafd-1.jpg", imgs=[f"kafd-{i}.jpg" for i in range(1,4)],
   desc="Premium woodworks and joinery works throughout one of Riyadh's key financial district developments.", items=[]),
 "ministry-of-defense": dict(title="Ministry of Defense Supporting Buildings, Al Qassim", client="Ministry of Defense", loc="Al Qassim", img="ministry-of-defense-1.jpg", imgs=[f"ministry-of-defense-{i}.jpg" for i in range(1,4)],
   desc="Supply and installation of wooden doors for 100 flats, 1,500 m² of wall cladding, 250 m² of ceiling works, and related woodworks.", items=[]),
 "marafiq": dict(title="MARAFIQ New Head Office, Al Jubail", client="MARAFIQ", loc="Al Jubail", img="marafiq-1.jpg", imgs=[f"marafiq-{i}.jpg" for i in range(1,4)],
   desc="Complete office joinery and woodworks for MARAFIQ headquarters.", items=[]),
 "el-eissa": dict(title="Al Eissa Compound Project, ZAC", client="Al Eissa Compound", loc="", img="el-eissa-1.jpg", imgs=[f"el-eissa-{i}.jpg" for i in range(1,4)],
   desc="Supply and installation of external doors, internal doors, roof canopies, and shade pavilions.", items=[]),
 "primer-steak-house": dict(title="PRIMER Steak House & Lounge, Riyadh", client="PRIMER Steak House", loc="Riyadh", img="primer-steak-house-1.jpg", imgs=[f"primer-steak-house-{i}.jpg" for i in range(1,4)],
   desc="Full interior fit-out, including custom dining furniture, bar joinery, and feature woodworks.", items=[]),
}

# Project summary table (CP "Our Projects"): client, project, location, scope
ROWS = [
 ("Saudi Aramco","Home Ownership, Al Mutrafiah Inc. 1","Jubail","494 Villas · 6,653 Doors · 180 Kitchens · 494 Vanities · Handrails"),
 ("Saudi Aramco","Home Ownership, Al Mutrafiah Inc. 2","Jubail","344 Villas · 4,984 Doors · 344 Kitchens"),
 ("Saudi Aramco","SDHOP, South Dhahran Housing","Dhahran","110 Villas · 1,500 Doors (treated sub-frames)"),
 ("Saudi Aramco / SATORP","SATORP Housing","Jubail","110 Villas · 110 Vanity Tops · Handrails"),
 ("Saudi Aramco / RC","6 Mosques","Al Jubail","Islamic Design Doors · Loose Furniture"),
 ("Saudi Aramco (Khonaini)","King Salman Maritime Complex","Ras Al Khair","4,500 Wooden Doors"),
 ("Royal Commission","Phase C71, Apartments (Azmeel)","Al Jubail","7,000 Doors · 326 Kitchens · Furniture"),
 ("Royal Commission","Phase C13, Housing","Al Jubail","348 Villas · 2,500 Doors · 348 Kitchens · 348 Wardrobes · 348 Vanities"),
 ("Royal Commission","Phase C08/C09, Housing","Al Jubail","400 Villas · 800 Doors · 400 Kitchens · 400 Wardrobes · 400 Vanities"),
 ("Royal Commission","Phase C03, Housing","Al Jubail","287 Villas · 287 Folding Doors · Handrails"),
 ("Royal Commission","Phase C16, Apartments","Al Jubail","8 Buildings (7 Storey) · Wardrobes throughout"),
 ("Royal Commission","Phase C05, Apartments","Al Jubail","640 Louvre Doors · 40-Storey Handrails"),
 ("Royal Commission","Schools, Mutrafiah Phase 5","Al Jubail","Full Doors & Joinery Works"),
 ("SABIC","Al Mutrafiah Housing","Al Jubail","1,248 Villas · 1,248 Kitchens · 1,248 Ext. Doors · Vanity Shelves"),
 ("MA'ADEN","Aluminium Housing","Al Jubail","794 Villas · 794 Kitchens · 794 Doors · Handrails · Vanity Tops"),
 ("YASREF (Khonaini)","Housing Phase 1","Yanbu Al Bahr","1,620 Doors · 90 Villas Handrails · 90 Villas Partitions"),
 ("ZATCA (EG&G)","Haditha Housing Project","Al Haditha","3,348 Wooden Doors"),
 ("GACA","Prince Naif Airport (Tech Dev Co.)","Al Qassim","55 Wooden Doors · Specialized Airport Joinery"),
 ("Retal Urban Dev.","South Murcia, Nesaj Town","Nesaj Town","2,466 Wooden Doors"),
 ("Saudi Railway Company","Warehouses, Al Nuairiyah","Al Nuairiyah","Wooden Doors & Joinery Works throughout"),
 ("Ministry of Defense","Supporting Buildings","Al Qassim","Doors (100 Flats) · 1,500 m² Cladding · 250 m² Ceiling"),
 ("Dareen Villas","Housing Project","Al Jubail","69 Villas · Doors · Kitchen Cabinets"),
 ("NAJD","Bachelor Apartments","Al Jubail","40 Kitchen Cabinets · Wardrobes"),
 ("East Dammam","Housing Project","Dammam","Louvre Doors · Kitchens · Vanity Tops"),
 ("NEOM (BECo)","Multipurpose Hall","NEOM","100 Doors · 1,700 m² Cladding · 500 m² Ceiling · 100 m² Flooring · 10 Reception Counters"),
 ("NEOM (BECo)","Auditorium","NEOM","High-End Joinery & Cladding"),
 ("NEOM (BECo)","VIP Lounge","NEOM","Luxury Joinery · Custom Panelling · VIP Interior Finishes"),
 ("AMAALA / Red Sea Global (BECo)","Staff Village, Package 1","AMAALA","3,192 Wooden Doors"),
 ("AMAALA / Red Sea Global (Astra)","Staff Village, Zones 1, 2 & 7","AMAALA","1,566 Doors · Hotel, Villa, Police & Fire Station Joinery"),
 ("AMAALA / Red Sea Global (Haif)","Secondary Infrastructure","AMAALA","Thermowood Exterior Cladding"),
 ("AMAALA / Red Sea Global (Al Tamimi)","Six Senses Resorts","AMAALA Triple Bay","Full Luxury Resort Joinery"),
 ("Red Sea Co. (NESMA)","Southern Dunes Hotel","NEOM","250 Doors · 3,000 m² Cladding · 1,000 m² Ceiling"),
 ("Movenpick","5-Star Hotel","Wa'ad Al Shamal","850 Doors · Kitchens · 4,850 m² Cladding"),
 ("KARAN Group","5-Star Hotel","Al Jubail","Cladding, Restaurants & Function Rooms · Doors"),
 ("KARAN Group","Bachelor Apartments","Al Jubail","744 Flats · 744 Doors · 744 Kitchens"),
 ("MISK Foundation (Baytur)","MISK School Phase 1 & 2","Riyadh","1,500 Doors · 2,000 m² Cladding · 700 m² Ceiling"),
 ("KAFD","King Abdullah Financial District","Riyadh","Premium Woodworks & Joinery"),
 ("MARAFIQ","New Head Office","Al Jubail","Complete Office Joinery"),
 ("Al Eissa Compound (ZAC)","Compound Project","","External & Internal Doors · Roof Canopies · Shade Pavilions"),
 ("PRIMER Steak House","Restaurant & Lounge","Riyadh","Full Interior Fit-Out · Dining Furniture · Bar Joinery"),
 ("AMAALA Hospital (BEC)","Hospital Project","AMAALA","Doors · Wall Cladding · Joinery · Custom Casework"),
]

# Row -> (sector slug, detail page slug or None). Edit here to move a project between sectors.
def row_sector(client, project):
    c, p = client, project
    if p.startswith("Schools"): return "education"
    if c.startswith("MISK"): return "education"
    if c.startswith("AMAALA Hospital"): return "healthcare"
    if p == "6 Mosques" or c.startswith("Al Eissa") or "Haif" in c or c == "GACA": return "specialized"
    if c.startswith(("Saudi Aramco","SABIC","MA'ADEN","YASREF","ZATCA","Retal","Saudi Railway")): return "industrial"
    if c.startswith(("NEOM","AMAALA","Red Sea","Movenpick")) or (c.startswith("KARAN") and "Hotel" in p): return "hospitality"
    if c.startswith(("Ministry","KAFD","MARAFIQ")): return "commercial"
    return "residential"

def row_detail(client):
    for key, slug in [("Royal Commission","royal-commission"),("Saudi Aramco","saudi-aramco"),("NEOM","neom"),("AMAALA","redsea-amaala"),
                      ("Red Sea","redsea-amaala"),("KAFD","kafd"),("KARAN","karan"),("MARAFIQ","marafiq"),("Ministry","ministry-of-defense"),
                      ("MISK","misk"),("Movenpick","movenpick"),("PRIMER","primer-steak-house"),("Al Eissa","el-eissa")]:
        if client.startswith(key): return slug
    return None

SECTORS = [
 dict(slug="industrial", title="Industrial & Infrastructure", img="proj-aramco.jpg",
  intro="Housing, airport, railway and industrial-city developments delivered for the Kingdom's major industrial and infrastructure clients."),
 dict(slug="hospitality", title="Hospitality & Luxury Development", img="proj-rsg.jpg",
  intro="Giga-project resorts, five-star hotels and luxury developments across NEOM, AMAALA, the Red Sea and the Kingdom."),
 dict(slug="residential", title="Residential and F&B", img="proj-rc.jpg",
  intro="Villas, apartment buildings, compounds and restaurant fit-outs, from large housing phases to bespoke dining interiors."),
 dict(slug="commercial", title="Commercial & Government", img="proj-mod.jpg",
  intro="Government supporting buildings, headquarters and financial-district developments."),
 dict(slug="healthcare", title="Healthcare", img="proj-hospitality.jpg",
  intro="Wooden doors, wall cladding, joinery and custom casework for hospital areas."),
 dict(slug="education", title="Education", img="misk-2.jpg" if False else "proj-hospitality.jpg",
  intro="School campuses and educational complexes, from doors and joinery to cladding and ceiling works."),
 dict(slug="specialized", title="Specialized Projects", img="proj-neom.jpg",
  intro="Mosques, airport joinery, thermowood infrastructure and custom architectural structures."),
]
SECTOR_BY_SLUG = {s["slug"]: s for s in SECTORS}

# ---------------------------------------------------------------- factory
MACHINE_PHOTOS = [
 ("machine-wide-belt-sanding.jpg","Wide Belt Sanding Machine"),
 ("machine-cefla-drying.jpg","CEFLA 2000D Drying Machine"),
 ("machine-spray-booth.jpg","Painting Spray Booth"),
 ("machine-cabinet-presser.jpg","Cabinet Presser Machine"),
 ("machine-sektar-panel-saw.jpg","Sektar 430 Panel Saw Machine"),
 ("machine-hot-cold-presser.jpg","Hot & Cold Presser Machine"),
 ("machine-reciprocating-spray.jpg","Reciprocating Spraying Machine"),
 ("machine-edge-banding.jpg","Single Side Edge Banding Machine"),
 ("machine-six-side-molding.jpg","Six Side Molding Machine"),
]
MACHINE_LIST = ["Circular Table Saw Machine","Surface Planer Machine","Shaper Machine","Thickness Planer Machine","Edge Bonding Machine",
 "Automatic Lathe Machine","NC Panel Sizing Machine","Automatic Guillotine Machine","Veneer Splicing Machine","Veneer Cutter Machine",
 "Wide Belt Sander Machine","Hydraulic Press Machine","Manual Press Machine","Mortising Machine","Band Saw Machine","CNC Router Machine",
 "Head Router Machine","Frame Press Machine","Table Presser Machine","Biesse Skipper 100 CNC Boring Machine","Six Side Molding Machine",
 "Sektar 430 Panel Saw Machine","Single Side Edge Banding Machine","CEFLA Hot & Cold Presser Machine"]

PROCESS = ["Client Brief & Requirements","Design & Engineering","Material Selection & Procurement","Factory Production & CNC Machining","Quality Control & Inspection","Site Installation & Handover"]

VENDORS = [
 dict(name="Saudi Aramco", no="10064085", note="Manufacturer + Service Provider, Saudi Aramco E-Reference No. 0005893", ico="AR"),
 dict(name="Royal Commission for Jubail & Yanbu", no="14902", note="Registered Vendor", ico="RC"),
 dict(name="Red Sea Global", no="S10357393", note="Registered Vendor", ico="RSG"),
 dict(name="SABIC", no="11047241", note="Registered Vendor", ico="SB"),
 dict(name="MA'ADEN", no="40665", note="Registered Vendor", ico="MD"),
]

# client names from the CP "Clients & Partners" page. Logos: drop files into img/clients/<slug>.png|svg|jpg|webp and rebuild.
CLIENTS = ["Royal Commission for Jubail & Yanbu","Saudi Aramco","SATORP","YASREF","MA'ADEN","SABIC","MARAFIQ","Red Sea Global","The Red Sea Development Company","AMAALA",
 "NEOM","Misk Schools","MISK Foundation","KAFD","Six Senses","Movenpick","Saudi Arabian Baytur","BEC Arabia","Astra","Azmeel Contracting","Khonaini International Co. Ltd",
 "Saudi Arabia Railways","Hassan Allam","Samama","Aleisa Residence","ZAC International","Marco","Haif Company","ICAD","SIAC Construction","National Blue Company Ltd",
 "Ewan","Thabat","Retal Residence","Nesma & Partners","TMG","Jabal Technical Institute","Imam Abdulrahman Bin Faisal University","Zakat, Tax and Customs Authority","GACA","Dar Al-Arkan","Technical Development for Contracting"]

# (name, file in img/accreditation, dark card for white-on-transparent logos)
ACCREDITED = [("ISO 9001:2015","iso-9001.png",True),("ISO 14001:2015","iso-14001.png",True),("ISO 45001:2018","iso-45001.png",True),
              ("FSC","fsc.png",True),("Intertek","intertek.png",True),("UAF","uaf.png",True),("Americo","americo.png",True),
              ("IAF","iaf.png",True),("Control Union","control-union.png",True)]

CERTS_FIRE = [
 ("cert-intertek-warmsprings.jpg","Fire-Rate Certificate for Warm Springs","Intertek Certificate of Compliance WHI18-28731422"),
 ("cert-intertek-halspan.jpg","Fire-Rate Certificate for Halspan","Intertek Certificate of Compliance WHI18-28731426"),
 ("cert-intertek-streboard.jpg","Fire-Rate Certificate for Streboard","Intertek Certificate of Compliance WHI22-28731442"),
]
CERTS_ISO = [
 ("cert-iso-9001.jpg","ISO 9001:2015","Quality Management System"),
 ("cert-iso-45001.jpg","ISO 45001:2018","Occupational Health & Safety Management System"),
 ("cert-iso-14001.jpg","ISO 14001:2015","Environmental Management System"),
]
CERTS_FSC = [("cert-fsc.jpg","FSC® Chain of Custody (CoC) Certification","FSC-STD-40-004 V3-1 | FSC-STD-50-001 V2-1")]
CERTS_ARAMCO = [
 ("cert-aramco-appreciation.jpg","Saudi Aramco Certificate of Appreciation","Home Ownership & Infrastructure Projects Division"),
 ("cert-cybersecurity.jpg","Cybersecurity Compliance Certificate","Saudi Aramco SACS-002, assessed by RSM Saudi Arabia"),
]

def has_file(rel):
    return os.path.exists(os.path.join(ROOT, rel))

def client_logo(name):
    slug = re.sub(r"[^a-z0-9]+","-", name.lower()).strip("-")
    for ext in ("svg","png","webp","jpg"):
        if has_file(f"img/clients/{slug}.{ext}"):
            return f"img/clients/{slug}.{ext}"
    return None
