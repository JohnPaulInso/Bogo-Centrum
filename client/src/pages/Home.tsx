// (2026-07-13) Grounded human-crafted design with real brand logos and logo carousel, was AI-styled hero/badges
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Asterisk,
  Building2,
  Car,
  Check,
  ChevronDown,
  Clock,
  Footprints,
  Landmark,
  Mail,
  MapPin,
  Menu,
  MousePointer2,
  Navigation,
  PanelRightOpen,
  Pencil,
  Phone,
  Plus,
  Send,
  ShieldCheck,
  Store,
  Users,
  X,
} from "lucide-react";

type Status = "occupied" | "available" | "reserved";
type Floor = "Ground Floor" | "Second Floor";
type Building = "Building A" | "Building B";

type Lot = {
  id: string;
  building: Building;
  floor: Floor;
  brand: string;
  category: string;
  area: number;
  status: Status;
  badge: string;
  tone: string;
  logo?: string;
};

type Filter =
  | "All Brands"
  | "Building A"
  | "Building B"
  | "Banking & Pawn"
  | "Convenience & Pharmacy"
  | "Retail & Wellness"
  | "Available Slots";

const brandLogos: Record<string, string> = {
  "7-Eleven": "./images/logos/7-eleven.png",
  "Rose Pharmacy": "./images/logos/rose-pharmacy.webp",
  "MR.DIY": "./images/logos/mr-diy.png",
  LandBank: "./images/logos/landbank.svg",
  "Palawan Pawnshop": "./images/logos/palawan-pawnshop.png",
  "Sun Savings": "./images/logos/sun-savings.png",
  "Nuat Thai": "./images/logos/nuat-thai.png",
  AFPSLAI: "./images/logos/afpslai.png",
  "LCTC Foundation, Inc.": "./images/logos/lctc-foundation.png",
};

const carouselBrands = [
  { name: "7-Eleven", logo: "./images/logos/7-eleven.png", lotId: "A-101" },
  { name: "Rose Pharmacy", logo: "./images/logos/rose-pharmacy.webp", lotId: "A-102" },
  { name: "MR.DIY", logo: "./images/logos/mr-diy.png", lotId: "A-103" },
  { name: "LandBank", logo: "./images/logos/landbank.svg", lotId: "B-101" },
  { name: "Palawan Pawnshop", logo: "./images/logos/palawan-pawnshop.png", lotId: "B-102" },
  { name: "Sun Savings", logo: "./images/logos/sun-savings.png", lotId: "B-103" },
  { name: "AFPSLAI", logo: "./images/logos/afpslai.png", lotId: "B-104" },
  { name: "Nuat Thai", logo: "./images/logos/nuat-thai.png", lotId: "B-201" },
  { name: "LCTC Foundation, Inc.", logo: "./images/logos/lctc-foundation.png", lotId: "A-201" },
];

const seedLots: Lot[] = [
  { id: "A-101", building: "Building A", floor: "Ground Floor", brand: "7-Eleven", category: "Convenience Store", area: 86, status: "occupied", badge: "7", tone: "red", logo: brandLogos["7-Eleven"] },
  { id: "A-102", building: "Building A", floor: "Ground Floor", brand: "Rose Pharmacy", category: "Pharmacy & Health", area: 64, status: "occupied", badge: "R", tone: "rose", logo: brandLogos["Rose Pharmacy"] },
  { id: "A-103", building: "Building A", floor: "Ground Floor", brand: "MR.DIY", category: "Home Improvement & Variety", area: 212, status: "occupied", badge: "MR", tone: "yellow", logo: brandLogos["MR.DIY"] },
  { id: "A-104", building: "Building A", floor: "Ground Floor", brand: "Available Unit", category: "Retail / F&B", area: 52, status: "available", badge: "+", tone: "green" },
  { id: "A-105", building: "Building A", floor: "Ground Floor", brand: "Reserved Unit", category: "Retail", area: 74, status: "reserved", badge: "R", tone: "amber" },
  { id: "A-106", building: "Building A", floor: "Ground Floor", brand: "Available Unit", category: "Retail / Services", area: 48, status: "available", badge: "+", tone: "green" },
  { id: "A-201", building: "Building A", floor: "Second Floor", brand: "LCTC Foundation, Inc.", category: "Community & Education", area: 84, status: "occupied", badge: "LC", tone: "blue", logo: brandLogos["LCTC Foundation, Inc."] },
  { id: "A-202", building: "Building A", floor: "Second Floor", brand: "Available Unit", category: "Retail / Wellness", area: 60, status: "available", badge: "+", tone: "green" },
  { id: "A-203", building: "Building A", floor: "Second Floor", brand: "Reserved Unit", category: "Office / Services", area: 55, status: "reserved", badge: "R", tone: "amber" },
  { id: "A-204", building: "Building A", floor: "Second Floor", brand: "Available Unit", category: "Retail / Wellness", area: 78, status: "available", badge: "+", tone: "green" },
  { id: "A-205", building: "Building A", floor: "Second Floor", brand: "Available Unit", category: "Retail / Wellness", area: 92, status: "available", badge: "+", tone: "green" },
  { id: "A-206", building: "Building A", floor: "Second Floor", brand: "Available Unit", category: "Retail / Wellness", area: 49, status: "available", badge: "+", tone: "green" },
  { id: "B-101", building: "Building B", floor: "Ground Floor", brand: "LandBank", category: "Banking & Financial Services", area: 118, status: "occupied", badge: "LB", tone: "blue", logo: brandLogos["LandBank"] },
  { id: "B-102", building: "Building B", floor: "Ground Floor", brand: "Palawan Pawnshop", category: "Remittance, Pawn & Money Transfer", area: 73, status: "occupied", badge: "P", tone: "yellow", logo: brandLogos["Palawan Pawnshop"] },
  { id: "B-103", building: "Building B", floor: "Ground Floor", brand: "Sun Savings", category: "Bank & Consumer Finance", area: 96, status: "occupied", badge: "SUN", tone: "sun", logo: brandLogos["Sun Savings"] },
  { id: "B-104", building: "Building B", floor: "Ground Floor", brand: "AFPSLAI", category: "Financial & Savings Association", area: 68, status: "occupied", badge: "AF", tone: "teal", logo: brandLogos["AFPSLAI"] },
  { id: "B-105", building: "Building B", floor: "Ground Floor", brand: "Reserved Unit", category: "Retail", area: 64, status: "reserved", badge: "R", tone: "amber" },
  { id: "B-106", building: "Building B", floor: "Ground Floor", brand: "Available Unit", category: "Retail / F&B", area: 44, status: "available", badge: "+", tone: "green" },
  { id: "B-201", building: "Building B", floor: "Second Floor", brand: "Nuat Thai", category: "Foot & Body Massage Wellness", area: 102, status: "occupied", badge: "NT", tone: "teal", logo: brandLogos["Nuat Thai"] },
  { id: "B-202", building: "Building B", floor: "Second Floor", brand: "Available Unit", category: "Wellness / Services", area: 70, status: "available", badge: "+", tone: "green" },
  { id: "B-203", building: "Building B", floor: "Second Floor", brand: "Available Unit", category: "Retail / Wellness", area: 76, status: "available", badge: "+", tone: "green" },
  { id: "B-204", building: "Building B", floor: "Second Floor", brand: "Reserved Unit", category: "Office / Services", area: 61, status: "reserved", badge: "R", tone: "amber" },
  { id: "B-205", building: "Building B", floor: "Second Floor", brand: "Available Unit", category: "Retail / Wellness", area: 84, status: "available", badge: "+", tone: "green" },
  { id: "B-206", building: "Building B", floor: "Second Floor", brand: "Available Unit", category: "Retail / Wellness", area: 51, status: "available", badge: "+", tone: "green" },
];

const presetBrands = [
  "7-Eleven",
  "Rose Pharmacy",
  "Palawan Pawnshop",
  "Nuat Thai",
  "Sun Savings",
  "MR.DIY",
  "LandBank",
  "AFPSLAI",
  "LCTC Foundation, Inc.",
  "Available",
  "Reserved",
];

const brandDetails: Record<string, { category: string; area: number; badge: string; tone: string; logo?: string }> = {
  "7-Eleven": { category: "Convenience Store", area: 86, badge: "7", tone: "red", logo: brandLogos["7-Eleven"] },
  "Rose Pharmacy": { category: "Pharmacy & Health", area: 64, badge: "R", tone: "rose", logo: brandLogos["Rose Pharmacy"] },
  "Palawan Pawnshop": { category: "Remittance, Pawn & Money Transfer", area: 73, badge: "P", tone: "yellow", logo: brandLogos["Palawan Pawnshop"] },
  "Nuat Thai": { category: "Foot & Body Massage Wellness", area: 102, badge: "NT", tone: "teal", logo: brandLogos["Nuat Thai"] },
  "Sun Savings": { category: "Bank & Consumer Finance", area: 96, badge: "SUN", tone: "sun", logo: brandLogos["Sun Savings"] },
  "MR.DIY": { category: "Home Improvement & Variety", area: 212, badge: "MR", tone: "yellow", logo: brandLogos["MR.DIY"] },
  LandBank: { category: "Banking & Financial Services", area: 118, badge: "LB", tone: "blue", logo: brandLogos["LandBank"] },
  AFPSLAI: { category: "Financial & Savings Association", area: 68, badge: "AF", tone: "teal", logo: brandLogos["AFPSLAI"] },
  "LCTC Foundation, Inc.": { category: "Community & Education", area: 84, badge: "LC", tone: "blue", logo: brandLogos["LCTC Foundation, Inc."] },
};

const spaceCategories: { title: string; subtitle: string; tag: string; image: string; filter: Filter }[] = [
  {
    title: "Convenience & Pharmacy",
    subtitle: "High-frequency daily essentials",
    tag: "Ground Floor",
    image: "./images/centrum-corner-7eleven.jpg",
    filter: "Convenience & Pharmacy",
  },
  {
    title: "Banking & Financial",
    subtitle: "Trusted institutions & remittance",
    tag: "Building B",
    image: "./images/centrum-day-facade.jpg",
    filter: "Banking & Pawn",
  },
  {
    title: "Retail & Lifestyle",
    subtitle: "Home variety, dining & wellness",
    tag: "Anchor Mix",
    image: "./images/centrum-night.jpg",
    filter: "Retail & Wellness",
  },
  {
    title: "Available Leasing Lots",
    subtitle: "Ready ground & 2nd-floor units",
    tag: "Open Now",
    image: "./images/promo-lifestyle.jpg",
    filter: "Available Slots",
  },
];

const newsUpdates = [
  {
    tag: "New Arrival",
    title: "LCTC Foundation, Inc. Has Arrived at Bogo City Centrum",
    date: "Jan 15, 2026",
    image: "./images/news-lctc.jpg",
  },
  {
    tag: "Financial Services",
    title: "AFPSLAI Brings Member Services Closer to Northern Cebu",
    date: "Feb 8, 2026",
    image: "./images/news-afpslai.jpg",
  },
  {
    tag: "Business Growth",
    title: "Sun Savings Bank Expands Reach at Taytayan Commercial Hub",
    date: "Mar 3, 2026",
    image: "./images/news-sunsavings.jpg",
  },
];

function BrandMark({ lot, large = false }: { lot: Lot; large?: boolean }) {
  const logoSrc = lot.logo ?? brandLogos[lot.brand];
  if (logoSrc && lot.status === "occupied") {
    return (
      <div className={`real-logo-box ${large ? "real-logo-box-lg" : "real-logo-box-sm"}`}>
        <img src={logoSrc} alt={`${lot.brand} logo`} loading="lazy" />
      </div>
    );
  }
  if (lot.status === "available") {
    return (
      <div className={`slot-icon-box slot-available ${large ? "slot-icon-lg" : "slot-icon-sm"}`} aria-label="Available commercial unit">
        <Plus size={large ? 18 : 14} strokeWidth={2.5} />
      </div>
    );
  }
  if (lot.status === "reserved") {
    return (
      <div className={`slot-icon-box slot-reserved ${large ? "slot-icon-lg" : "slot-icon-sm"}`} aria-label="Reserved commercial unit">
        <Clock size={large ? 16 : 13} strokeWidth={2.2} />
      </div>
    );
  }
  return (
    <div className={`brand-mark tone-${lot.tone} ${large ? "brand-mark-large" : ""}`} aria-label={`${lot.brand} badge`}>
      <span className="brand-mark-symbol">{lot.badge}</span>
    </div>
  );
}

// (2026-07-13) Use official LOGO_HEADER.png directly, was square jpg + HTML text
function CentrumLogo({ light = false }: { light?: boolean }) {
  return (
    <div className={`centrum-logo ${light ? "centrum-logo-light" : ""}`}>
      <img className="centrum-header-logo-img" src="./images/LOGO_HEADER.png" alt="Bogo City Centrum" />
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`status-badge status-${status}`}>
      <i />
      {status === "occupied" ? "Occupied" : status === "available" ? "Available" : "Reserved"}
    </span>
  );
}

export default function Home() {
  const [lots, setLots] = useState<Lot[]>(seedLots);
  const [activeFilter, setActiveFilter] = useState<Filter>("All Brands");
  const [floor, setFloor] = useState<Floor>("Ground Floor");
  // (2026-07-13) Hide Brand Studio from public; unlock via ?admin=1 or Ctrl+Shift+A
  const [isAdminMode, setIsAdminMode] = useState(
    () => typeof window !== "undefined" && new URLSearchParams(window.location.search).get("admin") === "1"
  );
  const [adminOpen, setAdminOpen] = useState(
    () => typeof window !== "undefined" && new URLSearchParams(window.location.search).get("admin") === "1"
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "a") {
        event.preventDefault();
        setIsAdminMode(true);
        setAdminOpen(value => !value);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
  const [selectedLotId, setSelectedLotId] = useState("A-101");
  const [menuOpen, setMenuOpen] = useState(false);
  const [lotDropdownOpen, setLotDropdownOpen] = useState(false);
  const [draft, setDraft] = useState<Lot>(seedLots[0]);
  const [inquirySent, setInquirySent] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // (2026-07-13) Added drag/swipe marquee refs & state, was CSS-only animation
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeDragRef = useRef({ active: false, startX: 0, startScroll: 0, moved: 0, paused: false, resumeTimer: 0 });
  const [marqueeDragging, setMarqueeDragging] = useState(false);

  const selectedLot = lots.find(lot => lot.id === selectedLotId) ?? lots[0];

  useEffect(() => {
    const el = marqueeRef.current;
    if (!el) return;
    const initTimer = window.setTimeout(() => {
      if (el.scrollWidth > 0) el.scrollLeft = el.scrollWidth / 3;
    }, 60);

    let rafId = 0;
    const step = () => {
      const state = marqueeDragRef.current;
      if (!state.active && !state.paused && el.scrollWidth > 0) {
        el.scrollLeft += 0.6;
        const segment = el.scrollWidth / 3;
        if (el.scrollLeft >= segment * 2) el.scrollLeft -= segment;
      }
      rafId = window.requestAnimationFrame(step);
    };
    rafId = window.requestAnimationFrame(step);
    return () => {
      window.clearTimeout(initTimer);
      window.clearTimeout(marqueeDragRef.current.resumeTimer);
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  const handleMarqueeScroll = () => {
    const el = marqueeRef.current;
    if (!el || el.scrollWidth === 0) return;
    const segment = el.scrollWidth / 3;
    if (el.scrollLeft >= segment * 2) {
      el.scrollLeft -= segment;
    } else if (el.scrollLeft <= 2) {
      el.scrollLeft += segment;
    }
  };

  const handleMarqueePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const el = marqueeRef.current;
    if (!el) return;
    marqueeDragRef.current.active = true;
    marqueeDragRef.current.startX = event.clientX;
    marqueeDragRef.current.startScroll = el.scrollLeft;
    marqueeDragRef.current.moved = 0;
    setMarqueeDragging(true);
    el.setPointerCapture(event.pointerId);
  };

  const handleMarqueePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = marqueeDragRef.current;
    if (!state.active || event.pointerType !== "mouse") return;
    const el = marqueeRef.current;
    if (!el) return;
    const delta = event.clientX - state.startX;
    state.moved = Math.max(state.moved, Math.abs(delta));
    el.scrollLeft = state.startScroll - delta;
    handleMarqueeScroll();
  };

  const endMarqueeDrag = (event?: React.PointerEvent<HTMLDivElement>) => {
    const state = marqueeDragRef.current;
    if (!state.active) return;
    state.active = false;
    setMarqueeDragging(false);
    if (event && marqueeRef.current?.hasPointerCapture(event.pointerId)) {
      marqueeRef.current.releasePointerCapture(event.pointerId);
    }
  };

  useEffect(() => {
    if (adminOpen) setDraft({ ...selectedLot });
  }, [adminOpen, selectedLotId]);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLotDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const directoryLots = useMemo(() => {
    const cards = lots.filter(lot => lot.status === "occupied" || lot.status === "available");
    return cards
      .filter(lot => {
        if (activeFilter === "All Brands") return true;
        if (activeFilter === "Building A" || activeFilter === "Building B") return lot.building === activeFilter;
        if (activeFilter === "Available Slots") return lot.status === "available";
        if (activeFilter === "Banking & Pawn") return /bank|pawn|remittance|finance|savings/i.test(lot.category);
        if (activeFilter === "Convenience & Pharmacy") return /convenience|pharmacy|health/i.test(lot.category);
        return /retail|wellness|massage|improvement|community|education/i.test(lot.category);
      })
      .slice(0, 12);
  }, [activeFilter, lots]);

  const occupiedCount = useMemo(() => lots.filter(lot => lot.status === "occupied").length, [lots]);
  const availableCount = useMemo(() => lots.filter(lot => lot.status === "available").length, [lots]);

  const floorLots = lots.filter(lot => lot.floor === floor);
  const mapLot = (id: string) => floorLots.find(lot => lot.id === id);

  const updateDraftFromPreset = (preset: string) => {
    if (preset === "Available") {
      setDraft({ ...draft, brand: "Available Unit", category: "Retail / F&B", status: "available", badge: "+", tone: "green", logo: undefined });
    } else if (preset === "Reserved") {
      setDraft({ ...draft, brand: "Reserved Unit", category: "Retail / Services", status: "reserved", badge: "R", tone: "amber", logo: undefined });
    } else {
      const details = brandDetails[preset];
      setDraft({
        ...draft,
        brand: preset,
        category: details.category,
        status: "occupied",
        area: details.area,
        badge: details.badge,
        tone: details.tone,
        logo: details.logo,
      });
    }
  };

  const saveDraft = () => {
    setLots(current => current.map(lot => (lot.id === draft.id ? { ...draft } : lot)));
    setSelectedLotId(draft.id);
  };

  const chooseLot = (lot: Lot) => {
    setSelectedLotId(lot.id);
    setFloor(lot.floor);
    if (adminOpen) setDraft({ ...lot });
  };

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const inquire = () => {
    setInquirySent(true);
    window.setTimeout(() => setInquirySent(false), 3600);
  };

  return (
    <div className="site-shell">
      {/* Clean White Top Navigation Bar */}
      <header className="topbar">
        <div className="brand-ribbon" aria-hidden="true" />
        <div className="topbar-inner">
          <a href="#home" className="brand-link" onClick={() => setMenuOpen(false)}>
            <CentrumLogo />
          </a>
          <nav className={`main-nav ${menuOpen ? "nav-open" : ""}`}>
            <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
            <a href="#spaces" onClick={() => setMenuOpen(false)}>Spaces</a>
            <a href="#brands" onClick={() => setMenuOpen(false)}>Directory</a>
            <a href="#map" onClick={() => setMenuOpen(false)}>Site Map</a>
            <a href="#leasing" onClick={() => setMenuOpen(false)}>Leasing</a>
            <a href="#updates" onClick={() => setMenuOpen(false)}>Updates</a>
          </nav>
          <div className="top-actions">
            {/* (2026-07-13) Hide Brand Studio button from public navbar, was always visible */}
            {isAdminMode && (
              <button
                className={`studio-nav-btn ${adminOpen ? "active" : ""}`}
                onClick={() => {
                  setAdminOpen(value => !value);
                  scrollTo("map");
                }}
              >
                <Pencil size={14} /> Brand Studio
              </button>
            )}
            <button className="accent-button top-cta" onClick={inquire}>
              Inquire to Lease <ArrowRight size={15} />
            </button>
            <button className="menu-button" aria-label="Toggle navigation" onClick={() => setMenuOpen(value => !value)}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Full-Bleed Architectural Hero */}
        <section id="home" className="hero-banner">
          <div className="hero-bg-media" aria-hidden="true">
            <img src="./images/centrum-night.jpg" alt="Bogo City Centrum illuminated exterior" />
            <div className="hero-scrim" />
          </div>
          <div className="container hero-content">
            <div className="hero-copy-block">
              <p className="hero-location-label">
                <MapPin size={14} /> TAYTAYAN, BOGO CITY, CEBU · THE LIFESTYLE MALL OF THE NORTH
              </p>
              <h1>
                Northern Cebu&apos;s <span className="hero-accent">Commercial Hub</span> for Everyday Brands
              </h1>
              <p className="hero-subtitle">
                Bringing convenience, healthcare, banking, retail, and wellness together across two parallel commercial
                wings surrounding a spacious central parking plaza.
              </p>
              <div className="hero-cta-row">
                <button className="accent-button" onClick={() => scrollTo("brands")}>
                  Explore Available Lots <ArrowRight size={16} />
                </button>
                <button className="ghost-light-button" onClick={() => scrollTo("map")}>
                  <MapPin size={16} /> View 2D Site Map
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Overlapping 4-Pillar Strip */}
        <section className="pillars-strip-wrap">
          <div className="container">
            <div className="pillars-card">
              <div className="pillar-item">
                <div className="pillar-icon icon-blue"><ShieldCheck size={21} /></div>
                <div>
                  <h3>Prime Highway Visibility</h3>
                  <p>High-exposure frontage along the Taytayan commercial corridor</p>
                </div>
              </div>
              <div className="pillar-item">
                <div className="pillar-icon icon-sky"><Car size={21} /></div>
                <div>
                  <h3>Central Parking Plaza</h3>
                  <p>Wide customer parking bays directly between Building A &amp; B</p>
                </div>
              </div>
              <div className="pillar-item">
                <div className="pillar-icon icon-green"><Store size={21} /></div>
                <div>
                  <h3>Proven National Anchors</h3>
                  <p>7-Eleven, Rose Pharmacy, MR.DIY, LandBank, AFPSLAI &amp; more</p>
                </div>
              </div>
              <div className="pillar-item">
                <div className="pillar-icon icon-blue"><Building2 size={21} /></div>
                <div>
                  <h3>Flexible Lot Footprints</h3>
                  <p>44 sqm to 212 sqm ground and second-floor commercial spaces</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Famous Anchor Tenants Logo Carousel */}
        <section className="logo-carousel-section" aria-label="Anchor tenants at Bogo City Centrum">
          <div className="container">
            <p className="carousel-label">ESTABLISHED BRANDS &amp; ANCHOR TENANTS AT CENTRUM</p>
          </div>
          {/* (2026-07-13) Draggable desktop/tablet/mobile marquee, was CSS animation */}
          <div
            ref={marqueeRef}
            className={`logo-marquee-viewport ${marqueeDragging ? "is-dragging" : ""}`}
            onScroll={handleMarqueeScroll}
            onPointerDown={handleMarqueePointerDown}
            onPointerMove={handleMarqueePointerMove}
            onPointerUp={endMarqueeDrag}
            onPointerCancel={endMarqueeDrag}
            onMouseEnter={() => {
              marqueeDragRef.current.paused = true;
            }}
            onMouseLeave={() => {
              marqueeDragRef.current.paused = false;
            }}
            onTouchStart={() => {
              window.clearTimeout(marqueeDragRef.current.resumeTimer);
              marqueeDragRef.current.paused = true;
            }}
            onTouchEnd={() => {
              marqueeDragRef.current.resumeTimer = window.setTimeout(() => {
                marqueeDragRef.current.paused = false;
              }, 700);
            }}
          >
            <div className="logo-marquee-track">
              {[...carouselBrands, ...carouselBrands, ...carouselBrands].map((item, idx) => (
                <button
                  key={`${item.name}-${idx}`}
                  type="button"
                  className="carousel-logo-tile"
                  onClick={() => {
                    if (marqueeDragRef.current.moved > 6) {
                      marqueeDragRef.current.moved = 0;
                      return;
                    }
                    const found = lots.find(l => l.id === item.lotId);
                    if (found) chooseLot(found);
                    scrollTo("brands");
                  }}
                >
                  <img src={item.logo} alt={item.name} draggable={false} />
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Commercial Spaces Split Section */}
        <section id="spaces" className="spaces-section section-space">
          <div className="container spaces-grid">
            <div className="spaces-copy">
              <div className="kicker-bar"><span /> COMMERCIAL OFFERINGS</div>
              <h2>Spaces Built for Everyday Foot Traffic</h2>
              <p className="section-lede">
                Whether you are opening a flagship retail branch, a financial service center, or a modern wellness
                studio, Bogo City Centrum offers clean tropical architecture, shaded walkways, and steady daily
                community visits.
              </p>
              <div className="spaces-highlight-list">
                <span><Check size={15} /> Ground &amp; second-floor commercial units</span>
                <span><Check size={15} /> Illuminated architectural signage frontage</span>
              </div>
              <button className="accent-button" onClick={() => scrollTo("brands")}>
                Explore All Spaces <ArrowRight size={16} />
              </button>
            </div>
            <div className="spaces-photo-grid">
              {spaceCategories.map(item => (
                <button
                  key={item.title}
                  className="space-photo-card"
                  onClick={() => {
                    setActiveFilter(item.filter);
                    scrollTo("brands");
                  }}
                >
                  <div className="space-photo-thumb">
                    <img src={item.image} alt={item.title} />
                    <span className="space-photo-tag">{item.tag}</span>
                  </div>
                  <div className="space-photo-meta">
                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.subtitle}</span>
                    </div>
                    <span className="space-arrow-circle"><ArrowRight size={15} /></span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Deep Brand Navy Directory Showcase */}
        <section id="brands" className="dark-directory-section section-space">
          <div className="container">
            <div className="directory-hero-split">
              <div className="directory-feature-photo">
                <img src="./images/centrum-day-facade.jpg" alt="Bogo City Centrum daytime facade" />
                <div className="directory-photo-badge">
                  <MapPin size={14} /> Building A &amp; B · Taytayan, Bogo City
                </div>
              </div>
              <div className="directory-feature-copy">
                <div className="kicker-bar kicker-light"><span /> THE CENTRUM DIRECTORY</div>
                <h2>Trusted Brands Serving Northern Cebu</h2>
                <p>
                  Browse established national chains and local institutions across both wings, or filter available
                  commercial lots ready for your next branch.
                </p>
                <div className="directory-cta-row">
                  <button className="accent-button" onClick={() => setActiveFilter("Available Slots")}>
                    View {availableCount} Open Lots <ArrowRight size={15} />
                  </button>
                  <button className="ghost-light-button" onClick={() => setActiveFilter("All Brands")}>
                    Show All Brands
                  </button>
                </div>
              </div>
            </div>

            <div className="filter-row">
              {(
                [
                  "All Brands",
                  "Building A",
                  "Building B",
                  "Banking & Pawn",
                  "Convenience & Pharmacy",
                  "Retail & Wellness",
                  "Available Slots",
                ] as Filter[]
              ).map(filter => (
                <button
                  key={filter}
                  className={`filter-pill ${activeFilter === filter ? "active" : ""}`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                  {filter === "Available Slots" && <span className="filter-count">{availableCount}</span>}
                </button>
              ))}
            </div>

            <div className="brand-grid">
              {directoryLots.map(lot => (
                <article
                  key={lot.id}
                  className={`brand-card ${lot.status === "available" ? "available-card" : ""}`}
                  onClick={() => chooseLot(lot)}
                >
                  <div className="brand-card-top">
                    <BrandMark lot={lot} large />
                    <div className="brand-card-badges">
                      <span className="lot-code-chip">{lot.id}</span>
                      <StatusBadge status={lot.status} />
                    </div>
                  </div>
                  <div className="brand-card-content">
                    <div>
                      <h3>{lot.brand}</h3>
                      <p>{lot.category}</p>
                    </div>
                    <div className="card-meta">
                      <span>
                        {lot.building.replace("Building ", "Bldg ")} ·{" "}
                        {lot.floor === "Ground Floor" ? "Ground Floor" : "2nd Floor"}
                      </span>
                      <strong>
                        {lot.area} <small>sqm</small>
                      </strong>
                    </div>
                  </div>
                  {lot.status === "available" ? (
                    <button
                      className="text-action green-text"
                      onClick={event => {
                        event.stopPropagation();
                        inquire();
                      }}
                    >
                      Inquire For This Space <ArrowRight size={15} />
                    </button>
                  ) : (
                    <button
                      className="text-action"
                      onClick={event => {
                        event.stopPropagation();
                        chooseLot(lot);
                        scrollTo("map");
                      }}
                    >
                      Locate On Map <MapPin size={14} />
                    </button>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Clean 4-Column Metrics Strip */}
        <section className="metrics-band">
          <div className="container metrics-grid">
            <div className="metric-cell">
              <div className="metric-icon icon-blue"><Building2 size={23} /></div>
              <div>
                <strong>2</strong>
                <span>Parallel Wings</span>
              </div>
            </div>
            <div className="metric-cell">
              <div className="metric-icon icon-green"><Store size={23} /></div>
              <div>
                <strong>{occupiedCount}+</strong>
                <span>Active Anchor Brands</span>
              </div>
            </div>
            <div className="metric-cell">
              <div className="metric-icon icon-sky"><Landmark size={23} /></div>
              <div>
                <strong>{lots.length}</strong>
                <span>Commercial Units</span>
              </div>
            </div>
            <div className="metric-cell">
              <div className="metric-icon icon-blue"><Users size={23} /></div>
              <div>
                <strong>100%</strong>
                <span>Central Plaza Access</span>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Centrum Split Showcase */}
        <section className="why-section section-space">
          <div className="container why-grid">
            <div className="why-copy">
              <div className="kicker-bar"><span /> WHY CHOOSE CENTRUM</div>
              <h2>Commercial Presence in Every Detail</h2>
              <p className="section-lede">
                Crafted with clean modern architecture, warm timber louver accents, covered walkways, and effortless
                customer parking directly off the Taytayan corridor.
              </p>
              <ul className="why-checklist">
                {[
                  "High-visibility landmark destination in Taytayan, Bogo City",
                  "Dedicated central parking plaza directly between both wings",
                  "Balanced tenant mix across banking, health, retail & wellness",
                  "Illuminated architectural frontage built for day and evening traffic",
                ].map(point => (
                  <li key={point}>
                    <span className="check-badge"><Check size={13} /></span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <button className="accent-button" onClick={inquire}>
                Schedule a Site Visit <ArrowRight size={16} />
              </button>
            </div>
            <div className="why-visual">
              <div className="why-photo-frame">
                <img src="./images/centrum-corner-7eleven.jpg" alt="Bogo City Centrum corner architecture" />
              </div>
              <div className="why-caption-card">
                <strong>Modern · Accessible · Thriving</strong>
                <span>Taytayan, Bogo City, Cebu</span>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive 2D Architectural Satellite Map */}
        <section id="map" className="map-section section-space">
          <div className="container">
            <div className="map-header-row">
              <div>
                <div className="kicker-bar"><span /> PLAN YOUR PRESENCE</div>
                <h2>Interactive 2D Architectural Site Map</h2>
                <p className="section-lede">
                  {/* (2026-07-13) Removed public Brand Studio mention, was shown to visitors */}
                  Explore Building A and Building B across the central parking plaza. Click any unit to inspect its
                  tenant details, floor level, and commercial footprint.
                </p>
              </div>
              <div className="map-selected-pill">
                <span>Selected Unit</span>
                <strong>{selectedLot.id} · {selectedLot.brand}</strong>
              </div>
            </div>

            <div className="map-toolbar">
              <div className="floor-switcher">
                <span>Floor</span>
                <button className={floor === "Ground Floor" ? "active" : ""} onClick={() => setFloor("Ground Floor")}>
                  Ground Floor
                </button>
                <button className={floor === "Second Floor" ? "active" : ""} onClick={() => setFloor("Second Floor")}>
                  Second Floor
                </button>
              </div>
              <div className="map-legend">
                <span><i className="legend-dot legend-available" /> Available</span>
                <span><i className="legend-dot legend-occupied" /> Occupied</span>
                <span><i className="legend-dot legend-reserved" /> Reserved</span>
              </div>
              {isAdminMode && (
                <button className={`studio-button ${adminOpen ? "active" : ""}`} onClick={() => setAdminOpen(v => !v)}>
                  <PanelRightOpen size={16} /> {adminOpen ? "Close Brand Studio" : "Open Brand Studio"}
                </button>
              )}
            </div>

            <div className={`map-workspace ${isAdminMode && adminOpen ? "with-drawer" : ""}`}>
              <div className="site-map-card">
                <div className="site-map-canvas">
                  <div className="map-road map-road-top" />
                  <div className="map-road map-road-bottom" />
                  <div className="map-compass"><Navigation size={15} /><span>N</span></div>
                  <div className="map-entry entry-left"><ArrowRight size={13} /> Main Entry</div>
                  <div className="map-entry entry-right">Exit <ArrowRight size={13} /></div>

                  <div className="map-building map-building-a">
                    <div className="building-label">
                      <strong>BUILDING A</strong>
                      <span>{floor === "Ground Floor" ? "Ground floor · 6 lots" : "Second floor · 6 lots"}</span>
                    </div>
                    <div className="stalls">
                      {Array.from({ length: 6 }).map((_, index) => {
                        const lot = mapLot(`A-${floor === "Ground Floor" ? 101 + index : 201 + index}`)!;
                        return (
                          <button
                            key={lot.id}
                            className={`map-stall ${lot.status} ${selectedLotId === lot.id ? "selected" : ""}`}
                            onClick={() => chooseLot(lot)}
                          >
                            <span className="stall-id">{lot.id}</span>
                            <BrandMark lot={lot} />
                            <span className="stall-area">{lot.area} sqm</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="parking-plaza">
                    <div className="parking-label">
                      <span>Central Parking Plaza</span>
                      <small>Pedestrian walkways between wings</small>
                    </div>
                    <div className="parking-lanes">
                      <div className="parking-bays">{Array.from({ length: 14 }).map((_, i) => <i key={i} />)}</div>
                      <div className="walkway">
                        <Footprints size={14} />
                        <span>Covered pedestrian way</span>
                        <Footprints size={14} />
                      </div>
                      <div className="parking-bays reverse">{Array.from({ length: 14 }).map((_, i) => <i key={i} />)}</div>
                    </div>
                    <div className="green-islands"><i /><i /><i /></div>
                  </div>

                  <div className="map-building map-building-b">
                    <div className="building-label">
                      <strong>BUILDING B</strong>
                      <span>{floor === "Ground Floor" ? "Ground floor · 6 lots" : "Second floor · 6 lots"}</span>
                    </div>
                    <div className="stalls">
                      {Array.from({ length: 6 }).map((_, index) => {
                        const lot = mapLot(`B-${floor === "Ground Floor" ? 101 + index : 201 + index}`)!;
                        return (
                          <button
                            key={lot.id}
                            className={`map-stall ${lot.status} ${selectedLotId === lot.id ? "selected" : ""}`}
                            onClick={() => chooseLot(lot)}
                          >
                            <span className="stall-id">{lot.id}</span>
                            <BrandMark lot={lot} />
                            <span className="stall-area">{lot.area} sqm</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="map-scale"><span /> 25m <span /> 50m</div>
                </div>
                <div className="map-footnote">
                  <span><Asterisk size={13} /> Lots are illustrative for leasing planning.</span>
                  <span>Click any unit on the floor plan to view its details.</span>
                </div>
              </div>

              {isAdminMode && adminOpen && (
                <aside className="admin-drawer">
                  <div className="drawer-head">
                    <div>
                      <p className="section-kicker">ADMIN STUDIO</p>
                      <h3>Brand Studio</h3>
                    </div>
                    <button className="drawer-close" aria-label="Close admin studio" onClick={() => setAdminOpen(false)}>
                      <X size={18} />
                    </button>
                  </div>
                  <p className="drawer-note">
                    Select any lot to swap its tenant, area, or occupancy status live on the map and directory.
                  </p>

                  <div className="drawer-field" ref={dropdownRef}>
                    <label>Selected lot</label>
                    <button
                      type="button"
                      className={`custom-dropdown-trigger ${lotDropdownOpen ? "open" : ""}`}
                      onClick={() => setLotDropdownOpen(v => !v)}
                    >
                      <span>{draft.id} · {draft.building} · {draft.floor}</span>
                      <ChevronDown size={15} />
                    </button>
                    {lotDropdownOpen && (
                      <div className="custom-dropdown-menu" role="listbox">
                        {lots.map(lot => (
                          <button
                            type="button"
                            key={lot.id}
                            className={`custom-dropdown-item ${draft.id === lot.id ? "active" : ""}`}
                            onClick={() => {
                              setSelectedLotId(lot.id);
                              setDraft({ ...lot });
                              setFloor(lot.floor);
                              setLotDropdownOpen(false);
                            }}
                          >
                            <strong>{lot.id}</strong>
                            <span>{lot.brand} ({lot.floor === "Ground Floor" ? "GF" : "2F"})</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="drawer-field">
                    <label>One-click presets</label>
                    <div className="preset-grid">
                      {presetBrands.map(preset => (
                        <button
                          key={preset}
                          type="button"
                          className={
                            draft.brand === (preset === "Available" ? "Available Unit" : preset === "Reserved" ? "Reserved Unit" : preset)
                              ? "selected"
                              : ""
                          }
                          onClick={() => updateDraftFromPreset(preset)}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="drawer-field">
                    <label htmlFor="brand-name">Brand / business name</label>
                    <input
                      id="brand-name"
                      value={draft.brand}
                      onChange={event => setDraft({ ...draft, brand: event.target.value })}
                    />
                  </div>

                  <div className="drawer-two-col">
                    <div className="drawer-field">
                      <label htmlFor="brand-category">Category</label>
                      <input
                        id="brand-category"
                        value={draft.category}
                        onChange={event => setDraft({ ...draft, category: event.target.value })}
                      />
                    </div>
                    <div className="drawer-field">
                      <label htmlFor="brand-area">Area (sqm)</label>
                      <input
                        id="brand-area"
                        type="number"
                        value={draft.area}
                        onChange={event => setDraft({ ...draft, area: Number(event.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="drawer-field">
                    <label>Occupancy status</label>
                    <div className="status-segment">
                      {(["occupied", "available", "reserved"] as Status[]).map(status => (
                        <button
                          type="button"
                          key={status}
                          className={draft.status === status ? `active ${status}` : ""}
                          onClick={() => setDraft({ ...draft, status })}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button type="button" className="accent-button save-full-btn" onClick={saveDraft}>
                    <Check size={16} /> Save Lot Changes
                  </button>
                </aside>
              )}
            </div>
          </div>
        </section>

        {/* 4-Step Leasing Process Section */}
        <section id="leasing" className="process-section section-space">
          <div className="container">
            <div className="process-top">
              <div className="process-heading">
                <div className="kicker-bar"><span /> OUR LEASING PROCESS</div>
                <h2>Simple Steps to Your Next Location</h2>
                <p className="section-lede">
                  We keep commercial leasing clear and straightforward — from selecting your ideal lot on our site map
                  to welcoming your first customers in Bogo City.
                </p>
              </div>
              <div className="process-accent-photo">
                <img src="./images/promo-community.jpg" alt="Bogo City Centrum exterior" />
              </div>
            </div>

            <div className="process-timeline">
              {[
                { num: "01", icon: MousePointer2, title: "Pick a Lot", text: "Review available footprints and neighboring anchor brands." },
                { num: "02", icon: MapPin, title: "Visit Taytayan Site", text: "Walk the central plaza, frontage, and customer access." },
                { num: "03", icon: Send, title: "Confirm Terms", text: "Align on unit handover, fit-out schedule, and lease terms." },
                { num: "04", icon: Store, title: "Open Your Doors", text: "Launch your brand at the Lifestyle Mall of the North." },
              ].map(step => (
                <div key={step.num} className="process-step">
                  <div className="step-circle">{step.num}</div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Split Brand Navy CTA & Contact Details Band */}
        <section className="cta-split-section">
          <div className="cta-split-grid">
            <div className="cta-split-left">
              <img src="./images/centrum-night.jpg" alt="Bogo City Centrum at night" />
              <div className="cta-split-scrim" />
              <div className="cta-split-copy">
                <div className="kicker-bar kicker-light"><span /> GET STARTED</div>
                <h2>Let&apos;s Grow Your Brand in Northern Cebu</h2>
                <p>
                  Have a commercial space in mind? Connect with our leasing desk for floor plans, unit availability, and
                  private site tours.
                </p>
                <button className="accent-button" onClick={inquire}>
                  Request Leasing Kit <ArrowRight size={16} />
                </button>
              </div>
            </div>
            <div className="cta-split-right">
              <div className="contact-detail-item">
                <div className="contact-icon"><Phone size={18} /></div>
                <div>
                  <strong>+63 32 255 0880</strong>
                  <span>Mon – Sat, 9:00 AM – 6:00 PM</span>
                </div>
              </div>
              <div className="contact-detail-item">
                <div className="contact-icon"><Mail size={18} /></div>
                <div>
                  <strong>leasing@bogocitycentrum.ph</strong>
                  <span>We respond within 24 business hours</span>
                </div>
              </div>
              <div className="contact-detail-item">
                <div className="contact-icon"><MapPin size={18} /></div>
                <div>
                  <strong>Taytayan, Bogo City</strong>
                  <span>Cebu 6010, Philippines</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Updates & Tenant Announcements */}
        <section id="updates" className="updates-section section-space">
          <div className="container">
            <div className="updates-header">
              <div>
                <div className="kicker-bar"><span /> LATEST UPDATES &amp; ANNOUNCEMENTS</div>
                <h2>Growing With the Northern Cebu Community</h2>
              </div>
              <button className="plain-text-link" onClick={() => scrollTo("brands")}>
                View All Tenants <ArrowRight size={15} />
              </button>
            </div>
            <div className="updates-grid">
              {newsUpdates.map(item => (
                <article key={item.title} className="update-card">
                  <div className="update-thumb">
                    <img src={item.image} alt={item.title} />
                  </div>
                  <div className="update-body">
                    <span className="update-tag">{item.tag}</span>
                    <h3>{item.title}</h3>
                    <time>{item.date}</time>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Dark Royal Navy Structured Footer */}
      <footer id="location" className="footer">
        <div className="brand-ribbon" aria-hidden="true" />
        <div className="container footer-main">
          <div className="footer-brand">
            <CentrumLogo light />
            <p>
              The Lifestyle Mall of the North — bringing shopping, banking, healthcare, and everyday convenience closer
              to Bogo City and Northern Cebu.
            </p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <a href="#home">Home</a>
            <a href="#spaces">Commercial Spaces</a>
            <a href="#brands">Brand Directory</a>
            <a href="#map">2D Site Map</a>
            <a href="#leasing">Leasing Process</a>
          </div>
          <div>
            <h4>Commercial Mix</h4>
            <a href="#brands" onClick={() => setActiveFilter("Convenience & Pharmacy")}>Convenience &amp; Pharmacy</a>
            <a href="#brands" onClick={() => setActiveFilter("Banking & Pawn")}>Banking &amp; Remittance</a>
            <a href="#brands" onClick={() => setActiveFilter("Retail & Wellness")}>Retail &amp; Wellness</a>
            <a href="#brands" onClick={() => setActiveFilter("Available Slots")}>Available Leasing Lots</a>
          </div>
          <div>
            <h4>Contact Us</h4>
            <p className="footer-contact-line"><Phone size={14} /> +63 32 255 0880</p>
            <p className="footer-contact-line"><Mail size={14} /> leasing@bogocitycentrum.ph</p>
            <p className="footer-contact-line"><MapPin size={14} /> Taytayan, Bogo City, Cebu</p>
            {/* (2026-07-13) Hide footer Brand Studio button from public, was visible */}
            {isAdminMode && (
              <button
                className="footer-studio-btn"
                onClick={() => {
                  setAdminOpen(true);
                  scrollTo("map");
                }}
              >
                <Pencil size={13} /> Open Admin Brand Studio
              </button>
            )}
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container footer-bottom-inner">
            <span>© 2026 Bogo City Centrum. All rights reserved.</span>
            {/* (2026-07-13) Added creator credit in footer bottom, was location tagline */}
            <span>Made by John Paul Inso @bainest &amp; John Errol Duazo</span>
          </div>
        </div>
      </footer>

      {inquirySent && (
        <div className="toast" role="status">
          <Check size={16} /> Thanks — our leasing team will be in touch shortly.
        </div>
      )}
    </div>
  );
}
