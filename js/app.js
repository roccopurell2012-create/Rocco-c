/**
 * Rocco Creations — SPA router & views
 */

const main = () => document.getElementById("main-content");

function toast(message, type = "success") {
  const el = document.createElement("div");
  el.className = "toast " + type;
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2800);
}

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function parseRoute() {
  const hash = (location.hash || "#/").replace(/^#/, "") || "/";
  const [path, query] = hash.split("?");
  const parts = path.split("/").filter(Boolean);
  const params = {};
  if (query) {
    query.split("&").forEach((pair) => {
      const [k, v] = pair.split("=");
      params[decodeURIComponent(k)] = decodeURIComponent(v || "");
    });
  }
  return { path: "/" + (parts[0] || ""), parts, params };
}

function setActiveNav(path) {
  document.querySelectorAll(".nav-link").forEach((a) => {
    const nav = a.getAttribute("data-nav");
    a.classList.toggle("active", nav === path || (path === "/form" && nav === "/inquire"));
  });
}

/* ═══════════ HOME ═══════════ */
function renderHome() {
  return `
    <section class="hero">
      <div class="hero-badge">🚀 Full-service creative studio</div>
      <h1>We design every aspect<br/>of your business</h1>
      <p class="hero-sub">
        From websites and logos to ads, posters, apps, and 3D printing —
        <strong>Rocco Creations</strong> takes your idea from sketch to launch.
      </p>
      <div class="hero-actions">
        <button class="btn btn-primary" id="hero-inquire">Start an inquiry</button>
        <a class="btn btn-ghost" href="#/services">Explore services</a>
      </div>
    </section>

    <h2 class="section-title">Our services</h2>
    <p class="section-sub">Pick a service to open a tailored inquiry form.</p>
    <div class="services-grid" id="home-services"></div>

    <div class="features">
      <div class="feature">
        <div class="f-icon">🎯</div>
        <h4>Tailored briefs</h4>
        <p>Each service has its own questions so we get the details right.</p>
      </div>
      <div class="feature">
        <div class="f-icon">⚡</div>
        <h4>Fast response</h4>
        <p>Submit an inquiry and we’ll follow up with next steps.</p>
      </div>
      <div class="feature">
        <div class="f-icon">🛠️</div>
        <h4>End-to-end design</h4>
        <p>One studio for digital, print, and physical product design.</p>
      </div>
    </div>
  `;
}

function bindHome() {
  const grid = document.getElementById("home-services");
  if (grid) {
    grid.innerHTML = SERVICES.map(
      (s) => `
      <button type="button" class="service-card" data-service="${s.id}">
        <div class="service-icon">${s.icon}</div>
        <h3>${escapeHtml(s.name)}</h3>
        <p>${escapeHtml(s.description)}</p>
        <span class="card-cta">Start inquiry →</span>
      </button>`
    ).join("");

    grid.querySelectorAll("[data-service]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-service");
        Rocket.launch(btn, () => {
          location.hash = "#/form?service=" + encodeURIComponent(id);
        });
      });
    });
  }

  const heroBtn = document.getElementById("hero-inquire");
  if (heroBtn) {
    heroBtn.addEventListener("click", () => {
      Rocket.launch(heroBtn, () => {
        location.hash = "#/inquire";
      });
    });
  }
}

/* ═══════════ SERVICES LIST ═══════════ */
function renderServices() {
  return `
    <div class="page-header">
      <h1>Services</h1>
      <p>Everything we design and build at Rocco Creations.</p>
    </div>
    <div class="services-grid" id="services-grid"></div>
  `;
}

function bindServices() {
  const grid = document.getElementById("services-grid");
  if (!grid) return;
  grid.innerHTML = SERVICES.map(
    (s) => `
    <button type="button" class="service-card" data-service="${s.id}">
      <div class="service-icon">${s.icon}</div>
      <h3>${escapeHtml(s.name)}</h3>
      <p>${escapeHtml(s.description)}</p>
      <span class="card-cta">Inquire →</span>
    </button>`
  ).join("");

  grid.querySelectorAll("[data-service]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-service");
      Rocket.launch(btn, () => {
        location.hash = "#/form?service=" + encodeURIComponent(id);
      });
    });
  });
}

/* ═══════════ INQUIRE (picker) ═══════════ */
function renderInquire() {
  return `
    <div class="page-header">
      <h1>Start an inquiry</h1>
      <p>Choose a service. We’ll launch you into a short form tailored to that project.</p>
    </div>
    <div class="service-picker" id="service-picker"></div>
  `;
}

function bindInquire() {
  const picker = document.getElementById("service-picker");
  if (!picker) return;
  picker.innerHTML = SERVICES.map(
    (s) => `
    <button type="button" class="picker-btn" data-service="${s.id}">
      <span class="picker-icon">${s.icon}</span>
      ${escapeHtml(s.name)}
    </button>`
  ).join("");

  picker.querySelectorAll("[data-service]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-service");
      Rocket.launch(btn, () => {
        location.hash = "#/form?service=" + encodeURIComponent(id);
      });
    });
  });
}

/* ═══════════ FORM ═══════════ */
function renderForm(serviceId) {
  const service = getServiceById(serviceId);
  if (!service) {
    return `
      <div class="page-header">
        <h1>Service not found</h1>
        <p>Please pick a service from the list.</p>
      </div>
      <a class="btn btn-primary" href="#/inquire">Choose a service</a>`;
  }

  const settings = getSettings();
  const cfg = settings[serviceId] || { image: "", questions: [] };

  let imageHtml = "";
  if (cfg.image) {
    imageHtml = `<img class="form-hero-img" src="${escapeHtml(cfg.image)}" alt="" />`;
  }

  const contactFields = `
    <div class="form-group">
      <label>Your name <span class="req">*</span></label>
      <input class="form-control" name="contact_name" required placeholder="Full name" />
    </div>
    <div class="form-group">
      <label>Email <span class="req">*</span></label>
      <input class="form-control" type="email" name="contact_email" required placeholder="you@example.com" />
    </div>
    <div class="form-group">
      <label>Phone</label>
      <input class="form-control" type="tel" name="contact_phone" placeholder="Optional" />
    </div>
    <div class="form-group">
      <label>Company / brand</label>
      <input class="form-control" name="contact_company" placeholder="Optional" />
    </div>
  `;

  const questionsHtml = (cfg.questions || [])
    .map((q, idx) => {
      const req = q.required ? '<span class="req">*</span>' : "";
      if (q.type === "multiple") {
        const opts = (q.options || [])
          .map(
            (opt, oi) => `
          <label class="choice-option">
            <input type="radio" name="${escapeHtml(q.id)}" value="${escapeHtml(opt)}" ${q.required && oi === 0 ? "" : ""} ${q.required ? "required" : ""} />
            <span>${escapeHtml(opt)}</span>
          </label>`
          )
          .join("");
        return `
          <div class="form-group">
            <label>${escapeHtml(q.label)} ${req}</label>
            <div class="choice-list">${opts}</div>
          </div>`;
      }
      return `
        <div class="form-group">
          <label>${escapeHtml(q.label)} ${req}</label>
          <textarea class="form-control" name="${escapeHtml(q.id)}" ${q.required ? "required" : ""} placeholder="Your answer…"></textarea>
        </div>`;
    })
    .join("");

  return `
    <div class="page-header">
      <h1>${service.icon} ${escapeHtml(service.name)} inquiry</h1>
      <p>Fill in the form below. Fields marked * are required.</p>
    </div>
    <div class="form-card">
      ${imageHtml}
      <div class="form-service-label">${service.icon} ${escapeHtml(service.name)}</div>
      <form id="inquiry-form" novalidate>
        <h3 style="font-size:1rem;margin-bottom:1rem;color:var(--text-muted);">Contact details</h3>
        ${contactFields}
        <h3 style="font-size:1rem;margin:1.5rem 0 1rem;color:var(--text-muted);">Project details</h3>
        ${questionsHtml || '<p class="hint">No custom questions configured yet — contact details are enough.</p>'}
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Submit inquiry</button>
          <a class="btn btn-ghost" href="#/inquire">Back</a>
        </div>
      </form>
    </div>
  `;
}

function bindForm(serviceId) {
  const form = document.getElementById("inquiry-form");
  if (!form) return;
  const service = getServiceById(serviceId);
  const settings = getSettings();
  const cfg = settings[serviceId] || { questions: [] };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      toast("Please complete the required fields.", "error");
      return;
    }

    const fd = new FormData(form);
    const contact = {
      name: fd.get("contact_name"),
      email: fd.get("contact_email"),
      phone: fd.get("contact_phone") || "",
      company: fd.get("contact_company") || "",
    };

    const answers = {};
    (cfg.questions || []).forEach((q) => {
      answers[q.id] = {
        label: q.label,
        value: fd.get(q.id) || "",
      };
    });

    const inquiry = {
      id: uid(),
      serviceId,
      serviceName: service ? service.name : serviceId,
      createdAt: new Date().toISOString(),
      contact,
      answers,
    };

    saveInquiry(inquiry);
    main().innerHTML = `
      <div class="success-panel">
        <div class="check">✓</div>
        <h2>Inquiry received</h2>
        <p>Thanks, ${escapeHtml(contact.name)}! Your <strong>${escapeHtml(inquiry.serviceName)}</strong> inquiry is in our system. We’ll be in touch at ${escapeHtml(contact.email)}.</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="#/">Back to home</a>
          <a class="btn btn-ghost" href="#/inquire">Another inquiry</a>
        </div>
      </div>`;
    toast("Inquiry submitted successfully");
  });
}

/* ═══════════ MAINTENANCE ═══════════ */
function renderMaintenance() {
  return `
    <div class="maintenance-panel">
      <div class="maintenance-icon">🛠️</div>
      <h1>Under maintenance</h1>
      <p>Rocco Creations is temporarily offline while we improve things. Please check back soon.</p>
      <a class="btn btn-ghost btn-sm" href="#/admin">Admin access</a>
    </div>
  `;
}

/* ═══════════ ADMIN ═══════════ */
let adminTab = "inquiries";
let settingsServiceId = "website";
let viewingInquiryId = null;

function renderAdminLogin(errorMsg) {
  return `
    <div class="page-header">
      <h1>Admin access</h1>
      <p>Enter the passcode to open the dashboard.</p>
    </div>
    <div class="form-card admin-login-card">
      <form id="admin-login-form">
        <div class="form-group">
          <label>Passcode</label>
          <input class="form-control" type="password" name="passcode" id="admin-passcode" inputmode="numeric" autocomplete="current-password" placeholder="Enter passcode" required />
        </div>
        ${errorMsg ? `<p class="login-error">${escapeHtml(errorMsg)}</p>` : ""}
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Unlock dashboard</button>
          <a class="btn btn-ghost" href="#/">Back to site</a>
        </div>
      </form>
    </div>
  `;
}

function bindAdminLogin() {
  const form = document.getElementById("admin-login-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const code = document.getElementById("admin-passcode")?.value || "";
    if (verifyAdminPasscode(code)) {
      setAdminAuthenticated(true);
      toast("Welcome back");
      route();
    } else {
      main().innerHTML = renderAdminLogin("Incorrect passcode. Try again.");
      bindAdminLogin();
      document.getElementById("admin-passcode")?.focus();
    }
  });
}

function renderAdmin() {
  if (!isAdminAuthenticated()) {
    return renderAdminLogin();
  }

  const site = getSiteConfig();
  return `
    <div class="page-header">
      <h1>Admin dashboard</h1>
      <p>Manage inquiries, form questions, and site status.</p>
    </div>
    <div class="admin-shell">
      <nav class="admin-nav">
        <button type="button" data-admin-tab="inquiries" class="${adminTab === "inquiries" ? "active" : ""}">Inquiries</button>
        <button type="button" data-admin-tab="settings" class="${adminTab === "settings" ? "active" : ""}">Inquiry settings</button>
        <button type="button" data-admin-tab="site" class="${adminTab === "site" ? "active" : ""}">Site &amp; maintenance</button>
        <button type="button" id="admin-logout" class="admin-logout-btn">Log out</button>
      </nav>
      <div class="admin-panel" id="admin-panel"></div>
    </div>
  `;
}

function renderAdminSite() {
  const site = getSiteConfig();
  return `
    <h2>Site &amp; maintenance</h2>
    <p class="panel-sub">Control public access to the site. Admin stays available with your passcode.</p>
    <div class="maintenance-toggle-card">
      <div>
        <strong>Maintenance mode</strong>
        <p class="hint">When on, visitors see an “Under maintenance” page instead of the public site.</p>
      </div>
      <label class="switch">
        <input type="checkbox" id="maintenance-toggle" ${site.maintenanceMode ? "checked" : ""} />
        <span class="switch-slider"></span>
      </label>
    </div>
    <p class="panel-sub" style="margin-top:1rem">
      Status: <strong id="maintenance-status" style="color:${site.maintenanceMode ? "var(--orange-soft)" : "var(--success)"}">${site.maintenanceMode ? "ON — public site locked" : "OFF — site live"}</strong>
    </p>
  `;
}

function renderAdminInquiriesList() {
  const list = getInquiries();
  if (!list.length) {
    return `
      <h2>Inquiries</h2>
      <p class="panel-sub">All submitted project inquiries appear here.</p>
      <div class="empty-state">
        <div class="emoji">📭</div>
        <p>No inquiries yet. When someone submits a form, it will show up here.</p>
      </div>`;
  }

  return `
    <h2>Inquiries</h2>
    <p class="panel-sub">${list.length} total submission${list.length === 1 ? "" : "s"}</p>
    <div class="inquiry-list">
      ${list
        .map((item) => {
          const svc = getServiceById(item.serviceId);
          const badge = svc ? svc.badge : "badge-website";
          const date = new Date(item.createdAt).toLocaleString();
          return `
          <div class="inquiry-item" data-view-inquiry="${escapeHtml(item.id)}">
            <div class="inquiry-item-header">
              <strong>${escapeHtml(item.contact.name)}</strong>
              <span class="badge ${badge}">${escapeHtml(item.serviceName)}</span>
            </div>
            <div class="inquiry-meta">
              <span>${escapeHtml(item.contact.email)}</span>
              <span>${escapeHtml(date)}</span>
            </div>
          </div>`;
        })
        .join("")}
    </div>`;
}

function renderAdminInquiryDetail(id) {
  const item = getInquiries().find((i) => i.id === id);
  if (!item) {
    viewingInquiryId = null;
    return renderAdminInquiriesList();
  }

  const answerRows = Object.values(item.answers || {})
    .map(
      (a) => `
      <div class="detail-row">
        <dt>${escapeHtml(a.label)}</dt>
        <dd>${escapeHtml(a.value) || "—"}</dd>
      </div>`
    )
    .join("");

  return `
    <button type="button" class="btn btn-ghost btn-sm" id="back-to-list" style="margin-bottom:1rem">← Back to list</button>
    <h2>${escapeHtml(item.contact.name)}</h2>
    <p class="panel-sub">${escapeHtml(item.serviceName)} · ${new Date(item.createdAt).toLocaleString()}</p>
    <dl class="detail-grid">
      <div class="detail-row"><dt>Email</dt><dd>${escapeHtml(item.contact.email)}</dd></div>
      <div class="detail-row"><dt>Phone</dt><dd>${escapeHtml(item.contact.phone) || "—"}</dd></div>
      <div class="detail-row"><dt>Company</dt><dd>${escapeHtml(item.contact.company) || "—"}</dd></div>
      ${answerRows}
    </dl>
    <div class="form-actions">
      <button type="button" class="btn btn-danger btn-sm" id="delete-inquiry" data-id="${escapeHtml(item.id)}">Delete inquiry</button>
    </div>`;
}

function renderAdminSettings() {
  const settings = getSettings();
  const cfg = settings[settingsServiceId] || { image: "", questions: [] };
  const service = getServiceById(settingsServiceId);

  const tabs = SERVICES.map(
    (s) =>
      `<button type="button" class="service-tab ${s.id === settingsServiceId ? "active" : ""}" data-set-service="${s.id}">${s.icon} ${escapeHtml(s.name)}</button>`
  ).join("");

  const imgPreview = cfg.image
    ? `<img class="settings-image-preview" src="${escapeHtml(cfg.image)}" alt="Form image" />`
    : `<div class="settings-image-preview placeholder">No image</div>`;

  const questions = (cfg.questions || [])
    .map((q, idx) => {
      const optionsVal = (q.options || []).join("\n");
      return `
      <div class="question-card" data-q-index="${idx}">
        <div class="question-card-top">
          <span class="q-num">Question ${idx + 1}</span>
          <div class="q-actions">
            <button type="button" class="btn btn-ghost btn-sm" data-move-up="${idx}" ${idx === 0 ? "disabled" : ""}>↑</button>
            <button type="button" class="btn btn-ghost btn-sm" data-move-down="${idx}" ${idx === cfg.questions.length - 1 ? "disabled" : ""}>↓</button>
            <button type="button" class="btn btn-danger btn-sm" data-remove-q="${idx}">Remove</button>
          </div>
        </div>
        <div class="field-row">
          <div class="form-group" style="margin:0">
            <label>Question text</label>
            <input class="form-control" data-q-label value="${escapeHtml(q.label)}" />
          </div>
          <div class="form-group" style="margin:0">
            <label>Type</label>
            <select class="form-control" data-q-type>
              <option value="multiple" ${q.type === "multiple" ? "selected" : ""}>Multiple choice</option>
              <option value="text" ${q.type === "text" ? "selected" : ""}>Fill in (text)</option>
            </select>
          </div>
        </div>
        <div class="options-editor" style="${q.type === "multiple" ? "" : "display:none"}">
          <label style="font-size:0.85rem;font-weight:600;display:block;margin-bottom:0.35rem">Options (one per line)</label>
          <textarea class="form-control" data-q-options>${escapeHtml(optionsVal)}</textarea>
        </div>
        <label class="checkbox-row">
          <input type="checkbox" data-q-required ${q.required ? "checked" : ""} />
          Required
        </label>
      </div>`;
    })
    .join("");

  return `
    <h2>Inquiry settings</h2>
    <p class="panel-sub">Edit questions for <strong>${service ? escapeHtml(service.name) : settingsServiceId}</strong>. Changes save when you click Save.</p>
    <div class="service-tabs">${tabs}</div>

    <div class="settings-image-row">
      ${imgPreview}
      <div style="flex:1;min-width:180px">
        <label style="font-weight:600;font-size:0.9rem;display:block;margin-bottom:0.4rem">Optional image at top of form</label>
        <input class="form-control" id="settings-image-url" placeholder="Paste image URL (optional)" value="${escapeHtml(cfg.image || "")}" />
        <p class="hint" style="margin-top:0.4rem">Leave blank for no image. Use a public image URL.</p>
        <button type="button" class="btn btn-ghost btn-sm" id="clear-image" style="margin-top:0.5rem">Clear image</button>
      </div>
    </div>

    <div class="question-list" id="question-list">
      ${questions || '<p class="empty-state">No questions yet. Add one below.</p>'}
    </div>

    <div class="form-actions">
      <button type="button" class="btn btn-ghost" id="add-question">+ Add question</button>
      <button type="button" class="btn btn-primary" id="save-settings">Save settings</button>
    </div>`;
}

function bindAdmin() {
  if (!isAdminAuthenticated()) {
    bindAdminLogin();
    return;
  }

  document.querySelectorAll("[data-admin-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      adminTab = btn.getAttribute("data-admin-tab");
      viewingInquiryId = null;
      route();
    });
  });

  const logout = document.getElementById("admin-logout");
  if (logout) {
    logout.addEventListener("click", () => {
      setAdminAuthenticated(false);
      toast("Logged out");
      route();
    });
  }

  const panel = document.getElementById("admin-panel");
  if (!panel) return;

  if (adminTab === "inquiries") {
    panel.innerHTML = viewingInquiryId
      ? renderAdminInquiryDetail(viewingInquiryId)
      : renderAdminInquiriesList();

    panel.querySelectorAll("[data-view-inquiry]").forEach((el) => {
      el.addEventListener("click", () => {
        viewingInquiryId = el.getAttribute("data-view-inquiry");
        route();
      });
    });

    const back = document.getElementById("back-to-list");
    if (back) {
      back.addEventListener("click", () => {
        viewingInquiryId = null;
        route();
      });
    }

    const del = document.getElementById("delete-inquiry");
    if (del) {
      del.addEventListener("click", () => {
        if (confirm("Delete this inquiry permanently?")) {
          deleteInquiry(del.getAttribute("data-id"));
          viewingInquiryId = null;
          toast("Inquiry deleted");
          route();
        }
      });
    }
  } else if (adminTab === "site") {
    panel.innerHTML = renderAdminSite();
    const toggle = document.getElementById("maintenance-toggle");
    if (toggle) {
      toggle.addEventListener("change", () => {
        const site = getSiteConfig();
        site.maintenanceMode = toggle.checked;
        saveSiteConfig(site);
        const status = document.getElementById("maintenance-status");
        if (status) {
          status.textContent = site.maintenanceMode ? "ON — public site locked" : "OFF — site live";
          status.style.color = site.maintenanceMode ? "var(--orange-soft)" : "var(--success)";
        }
        toast(site.maintenanceMode ? "Maintenance mode ON" : "Maintenance mode OFF");
      });
    }
  } else {
    panel.innerHTML = renderAdminSettings();

    panel.querySelectorAll("[data-set-service]").forEach((btn) => {
      btn.addEventListener("click", () => {
        // Persist current edits to memory before switching tabs
        commitSettingsFromDom();
        settingsServiceId = btn.getAttribute("data-set-service");
        route();
      });
    });

    panel.querySelectorAll("[data-q-type]").forEach((sel) => {
      sel.addEventListener("change", () => {
        const card = sel.closest(".question-card");
        const optEditor = card.querySelector(".options-editor");
        if (optEditor) optEditor.style.display = sel.value === "multiple" ? "" : "none";
      });
    });

    panel.querySelectorAll("[data-remove-q]").forEach((btn) => {
      btn.addEventListener("click", () => {
        commitSettingsFromDom();
        const settings = getSettings();
        const idx = Number(btn.getAttribute("data-remove-q"));
        settings[settingsServiceId].questions.splice(idx, 1);
        saveSettings(settings);
        route();
      });
    });

    panel.querySelectorAll("[data-move-up]").forEach((btn) => {
      btn.addEventListener("click", () => {
        commitSettingsFromDom();
        const settings = getSettings();
        const idx = Number(btn.getAttribute("data-move-up"));
        const arr = settings[settingsServiceId].questions;
        if (idx > 0) {
          [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
          saveSettings(settings);
          route();
        }
      });
    });

    panel.querySelectorAll("[data-move-down]").forEach((btn) => {
      btn.addEventListener("click", () => {
        commitSettingsFromDom();
        const settings = getSettings();
        const idx = Number(btn.getAttribute("data-move-down"));
        const arr = settings[settingsServiceId].questions;
        if (idx < arr.length - 1) {
          [arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]];
          saveSettings(settings);
          route();
        }
      });
    });

    const addBtn = document.getElementById("add-question");
    if (addBtn) {
      addBtn.addEventListener("click", () => {
        commitSettingsFromDom();
        const settings = getSettings();
        if (!settings[settingsServiceId]) {
          settings[settingsServiceId] = { image: "", questions: [] };
        }
        settings[settingsServiceId].questions.push({
          id: "q_" + uid(),
          label: "New question",
          type: "multiple",
          required: false,
          options: ["Option A", "Option B"],
        });
        saveSettings(settings);
        route();
      });
    }

    const saveBtn = document.getElementById("save-settings");
    if (saveBtn) {
      saveBtn.addEventListener("click", () => {
        commitSettingsFromDom();
        toast("Settings saved");
      });
    }

    const clearImg = document.getElementById("clear-image");
    if (clearImg) {
      clearImg.addEventListener("click", () => {
        const input = document.getElementById("settings-image-url");
        if (input) input.value = "";
        commitSettingsFromDom();
        route();
      });
    }
  }
}

function commitSettingsFromDom() {
  const settings = getSettings();
  if (!settings[settingsServiceId]) {
    settings[settingsServiceId] = { image: "", questions: [] };
  }

  const imgInput = document.getElementById("settings-image-url");
  if (imgInput) {
    settings[settingsServiceId].image = imgInput.value.trim();
  }

  const cards = document.querySelectorAll("#question-list .question-card");
  const questions = [];
  cards.forEach((card, idx) => {
    const label = card.querySelector("[data-q-label]")?.value?.trim() || "Question";
    const type = card.querySelector("[data-q-type]")?.value || "text";
    const required = !!card.querySelector("[data-q-required]")?.checked;
    const optionsRaw = card.querySelector("[data-q-options]")?.value || "";
    const options =
      type === "multiple"
        ? optionsRaw
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
    const existing = settings[settingsServiceId].questions[idx];
    questions.push({
      id: existing?.id || "q_" + uid(),
      label,
      type,
      required,
      options,
    });
  });

  if (cards.length) {
    settings[settingsServiceId].questions = questions;
  }

  saveSettings(settings);
}

/* ═══════════ ROUTER ═══════════ */
function route() {
  const { path, params } = parseRoute();
  setActiveNav(path === "/form" ? "/inquire" : path);

  // Close mobile menu
  document.querySelector(".nav-links")?.classList.remove("open");

  const root = main();
  if (!root) return;

  // Maintenance: block public routes (admin always reachable)
  const site = getSiteConfig();
  const isPublic =
    path === "/" ||
    path === "" ||
    path === "/services" ||
    path === "/inquire" ||
    path === "/form";
  if (site.maintenanceMode && isPublic && !isAdminAuthenticated()) {
    root.innerHTML = renderMaintenance();
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    return;
  }

  if (path === "/" || path === "") {
    root.innerHTML = renderHome();
    bindHome();
  } else if (path === "/services") {
    root.innerHTML = renderServices();
    bindServices();
  } else if (path === "/inquire") {
    root.innerHTML = renderInquire();
    bindInquire();
  } else if (path === "/form") {
    const serviceId = params.service || "website";
    root.innerHTML = renderForm(serviceId);
    bindForm(serviceId);
  } else if (path === "/admin") {
    root.innerHTML = renderAdmin();
    bindAdmin();
  } else {
    root.innerHTML = `
      <div class="page-header">
        <h1>Page not found</h1>
        <p>That route doesn’t exist.</p>
      </div>
      <a class="btn btn-primary" href="#/">Go home</a>`;
  }

  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
}

function init() {
  document.getElementById("year").textContent = new Date().getFullYear();

  const toggle = document.getElementById("menu-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
  }

  window.addEventListener("hashchange", route);
  if (!location.hash || location.hash === "#") location.hash = "#/";
  route();
}

document.addEventListener("DOMContentLoaded", init);
