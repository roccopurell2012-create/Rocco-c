/**
 * Rocco Creations — data layer (localStorage)
 */

const RC_STORAGE = {
  SETTINGS: "rocco_inquiry_settings",
  INQUIRIES: "rocco_inquiries",
  SITE: "rocco_site_config",
  ADMIN_SESSION: "rocco_admin_session",
};

/** Fixed admin passcode */
const ADMIN_PASSCODE = "20120626";

function getSiteConfig() {
  try {
    const raw = localStorage.getItem(RC_STORAGE.SITE);
    if (!raw) return { maintenanceMode: false };
    const parsed = JSON.parse(raw);
    return {
      maintenanceMode: !!parsed.maintenanceMode,
    };
  } catch {
    return { maintenanceMode: false };
  }
}

function saveSiteConfig(config) {
  localStorage.setItem(RC_STORAGE.SITE, JSON.stringify(config));
}

function isAdminAuthenticated() {
  try {
    return sessionStorage.getItem(RC_STORAGE.ADMIN_SESSION) === "1";
  } catch {
    return false;
  }
}

function setAdminAuthenticated(ok) {
  try {
    if (ok) sessionStorage.setItem(RC_STORAGE.ADMIN_SESSION, "1");
    else sessionStorage.removeItem(RC_STORAGE.ADMIN_SESSION);
  } catch {
    /* ignore */
  }
}

function verifyAdminPasscode(code) {
  return String(code || "").trim() === ADMIN_PASSCODE;
}

const SERVICES = [
  {
    id: "website",
    name: "Website Design",
    icon: "🌐",
    badge: "badge-website",
    description: "Custom websites that look sharp and convert visitors into customers.",
  },
  {
    id: "logo",
    name: "Logo Design",
    icon: "✨",
    badge: "badge-logo",
    description: "Memorable brand marks that set your business apart.",
  },
  {
    id: "ads",
    name: "Advertisements",
    icon: "📢",
    badge: "badge-ads",
    description: "Campaign creatives that grab attention and drive action.",
  },
  {
    id: "poster",
    name: "Posters",
    icon: "🖼️",
    badge: "badge-poster",
    description: "Print-ready posters for events, promotions, and branding.",
  },
  {
    id: "app",
    name: "App Design",
    icon: "📱",
    badge: "badge-app",
    description: "UI/UX for mobile and web apps that people love to use.",
  },
  {
    id: "3d",
    name: "3D Printing",
    icon: "🖨️",
    badge: "badge-3d",
    description: "Prototypes and custom 3D-printed parts from idea to object.",
  },
];

const DEFAULT_SETTINGS = {
  website: {
    image: "",
    questions: [
      {
        id: "q1",
        label: "What type of website do you need?",
        type: "multiple",
        required: true,
        options: ["Business / Corporate", "E-commerce / Online store", "Portfolio", "Landing page", "Blog / Content site", "Other"],
      },
      {
        id: "q2",
        label: "Where would you like to host it?",
        type: "multiple",
        required: true,
        options: ["We recommend & set up hosting", "I already have hosting", "Not sure yet"],
      },
      {
        id: "q3",
        label: "Do you have existing branding (logo, colors)?",
        type: "multiple",
        required: false,
        options: ["Yes, fully ready", "Partially", "No — need branding too"],
      },
      {
        id: "q4",
        label: "Approximate number of pages",
        type: "multiple",
        required: false,
        options: ["1–3 pages", "4–8 pages", "9–15 pages", "15+ pages"],
      },
      {
        id: "q5",
        label: "Tell us about your project goals",
        type: "text",
        required: true,
        options: [],
      },
    ],
  },
  logo: {
    image: "",
    questions: [
      {
        id: "q1",
        label: "What style of logo are you looking for?",
        type: "multiple",
        required: true,
        options: ["Wordmark / Typography", "Icon / Symbol", "Combination mark", "Emblem / Badge", "Not sure"],
      },
      {
        id: "q2",
        label: "Industry or niche",
        type: "text",
        required: true,
        options: [],
      },
      {
        id: "q3",
        label: "Any colors you prefer or want to avoid?",
        type: "text",
        required: false,
        options: [],
      },
      {
        id: "q4",
        label: "Where will the logo be used mainly?",
        type: "multiple",
        required: false,
        options: ["Website & digital", "Print & packaging", "Both digital and print", "Merchandise"],
      },
    ],
  },
  ads: {
    image: "",
    questions: [
      {
        id: "q1",
        label: "What kind of advertisement?",
        type: "multiple",
        required: true,
        options: ["Social media ads", "Google / display ads", "Print ads", "Video / motion", "Other"],
      },
      {
        id: "q2",
        label: "Campaign goal",
        type: "multiple",
        required: true,
        options: ["Brand awareness", "Leads / inquiries", "Sales", "Event promotion"],
      },
      {
        id: "q3",
        label: "Describe the product or offer",
        type: "text",
        required: true,
        options: [],
      },
    ],
  },
  poster: {
    image: "",
    questions: [
      {
        id: "q1",
        label: "Poster purpose",
        type: "multiple",
        required: true,
        options: ["Event", "Promotion / sale", "Informational", "Brand / artistic"],
      },
      {
        id: "q2",
        label: "Preferred size",
        type: "multiple",
        required: false,
        options: ["A4", "A3", "A2", "A1", "Custom / not sure"],
      },
      {
        id: "q3",
        label: "Key message or headline",
        type: "text",
        required: true,
        options: [],
      },
    ],
  },
  app: {
    image: "",
    questions: [
      {
        id: "q1",
        label: "Platform",
        type: "multiple",
        required: true,
        options: ["iOS", "Android", "Web app", "Cross-platform"],
      },
      {
        id: "q2",
        label: "App type",
        type: "multiple",
        required: true,
        options: ["Consumer app", "Business / internal tool", "E-commerce", "Social", "Other"],
      },
      {
        id: "q3",
        label: "Describe the core features you need",
        type: "text",
        required: true,
        options: [],
      },
    ],
  },
  "3d": {
    image: "",
    questions: [
      {
        id: "q1",
        label: "What do you need printed?",
        type: "text",
        required: true,
        options: [],
      },
      {
        id: "q2",
        label: "Do you have a 3D model file?",
        type: "multiple",
        required: true,
        options: ["Yes (STL / OBJ / etc.)", "Need modeling help", "Not sure"],
      },
      {
        id: "q3",
        label: "Preferred material",
        type: "multiple",
        required: false,
        options: ["PLA", "PETG", "ABS", "Resin", "Advise me"],
      },
      {
        id: "q4",
        label: "Approximate size or scale notes",
        type: "text",
        required: false,
        options: [],
      },
    ],
  },
};

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function getSettings() {
  try {
    const raw = localStorage.getItem(RC_STORAGE.SETTINGS);
    if (!raw) return deepClone(DEFAULT_SETTINGS);
    const parsed = JSON.parse(raw);
    // Merge missing services from defaults
    const merged = deepClone(DEFAULT_SETTINGS);
    for (const key of Object.keys(merged)) {
      if (parsed[key]) merged[key] = parsed[key];
    }
    return merged;
  } catch {
    return deepClone(DEFAULT_SETTINGS);
  }
}

function saveSettings(settings) {
  localStorage.setItem(RC_STORAGE.SETTINGS, JSON.stringify(settings));
}

function getInquiries() {
  try {
    const raw = localStorage.getItem(RC_STORAGE.INQUIRIES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveInquiry(inquiry) {
  const list = getInquiries();
  list.unshift(inquiry);
  localStorage.setItem(RC_STORAGE.INQUIRIES, JSON.stringify(list));
  return inquiry;
}

function deleteInquiry(id) {
  const list = getInquiries().filter((i) => i.id !== id);
  localStorage.setItem(RC_STORAGE.INQUIRIES, JSON.stringify(list));
}

function getServiceById(id) {
  return SERVICES.find((s) => s.id === id) || null;
}

function uid() {
  return "rc_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
