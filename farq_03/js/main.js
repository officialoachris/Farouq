const SITE = window.SITE || { email: "hello@example.com" };

const navToggle = document.querySelector(".nav__toggle");
const navMenu = document.querySelector(".nav__menu");
const navLinks = document.querySelectorAll(".nav__menu a");
const revealElements = document.querySelectorAll(".reveal");
const yearEl = document.getElementById("year");
const siteHeader = document.querySelector("[data-header]");
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const themeToggle = document.getElementById("theme-toggle");
const html = document.documentElement;
const THEME_KEY = "portfolio-theme";

if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

function applyTheme(theme) {
  html.setAttribute("data-theme", theme);
  const isLight = theme === "light";
  themeToggle?.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
  if (themeToggle) {
    themeToggle.querySelector(".theme-toggle__icon").textContent = isLight ? "☾" : "☀";
  }
}

const savedTheme = localStorage.getItem(THEME_KEY);
if (savedTheme === "light" || savedTheme === "dark") {
  applyTheme(savedTheme);
} else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
  applyTheme("light");
}

themeToggle?.addEventListener("click", () => {
  const next = html.getAttribute("data-theme") === "light" ? "dark" : "light";
  applyTheme(next);
  localStorage.setItem(THEME_KEY, next);
});

function closeMenu() {
  navToggle?.setAttribute("aria-expanded", "false");
  navToggle?.setAttribute("aria-label", "Open menu");
  navMenu?.classList.remove("is-open");
  document.body.style.overflow = "";
}

function getMenuFocusables() {
  if (!navMenu) return [];
  return [...navMenu.querySelectorAll("a, button")].filter((el) => !el.disabled);
}

navToggle?.addEventListener("click", () => {
  const isOpen = navMenu?.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  document.body.style.overflow = isOpen ? "hidden" : "";
  if (isOpen) getMenuFocusables()[0]?.focus();
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape" || !navMenu?.classList.contains("is-open")) return;
  closeMenu();
  navToggle?.focus();
});

navMenu?.addEventListener("keydown", (e) => {
  if (e.key !== "Tab" || !navMenu.classList.contains("is-open")) return;
  const items = getMenuFocusables();
  if (items.length === 0) return;
  const first = items[0];
  const last = items[items.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

revealElements.forEach((el) => revealObserver.observe(el));

const sectionLinks = document.querySelectorAll(".nav__menu a[data-section]");
const sections = [...sectionLinks]
  .map((link) => document.getElementById(link.dataset.section))
  .filter(Boolean);

function setActiveSection(id) {
  sectionLinks.forEach((link) => {
    const active = link.dataset.section === id;
    link.classList.toggle("is-active", active);
    if (active) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  });
}

if (sections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      setActiveSection(visible.target.id);
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5] }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

function onScroll() {
  siteHeader?.classList.toggle("is-scrolled", window.scrollY > 16);
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

contactForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("contact-name").value.trim();
  const email = document.getElementById("contact-email").value.trim();
  const message = document.getElementById("contact-message").value.trim();

  if (!name || !email || !message) {
    formStatus.hidden = false;
    formStatus.textContent = "Please fill in all fields.";
    formStatus.classList.add("form-status--error");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    formStatus.hidden = false;
    formStatus.textContent = "Please enter a valid email address.";
    formStatus.classList.add("form-status--error");
    return;
  }

  const subject = encodeURIComponent(`Portfolio contact from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;

  formStatus.hidden = false;
  formStatus.classList.remove("form-status--error");
  formStatus.textContent = "Opening your email client…";
  contactForm.reset();
});

function initSite() {
  const { name, title, email, github, linkedin, twitter } = SITE;

  if (name) {
    document.title = `${name} · ${title || "Frontend Developer"}`;
    document.querySelectorAll("[data-site='name']").forEach((el) => {
      el.textContent = name;
    });
    const initial = document.querySelector("[data-site='initial']");
    if (initial) initial.textContent = name.charAt(0);
  }

  const heroLead = document.getElementById("hero-lead");
  if (heroLead && name) {
    heroLead.textContent = `Hi, I'm ${name} — I turn designs into responsive, production-ready web experiences with clean HTML, modern CSS, and thoughtful JavaScript.`;
  }

  document.querySelectorAll("[data-social]").forEach((link) => {
    const key = link.dataset.social;
    if (SITE[key]) link.href = SITE[key];
  });

  const emailLink = document.getElementById("contact-email-link");
  if (emailLink && email) {
    emailLink.href = `mailto:${email}`;
    emailLink.textContent = email;
  }
}

initSite();

const copyEmailBtn = document.getElementById("copy-email");
copyEmailBtn?.addEventListener("click", async () => {
  if (!SITE.email) return;
  try {
    await navigator.clipboard.writeText(SITE.email);
    copyEmailBtn.textContent = "Copied!";
    copyEmailBtn.classList.add("is-copied");
    setTimeout(() => {
      copyEmailBtn.textContent = "Copy";
      copyEmailBtn.classList.remove("is-copied");
    }, 2000);
  } catch {
    copyEmailBtn.textContent = "Failed";
  }
});
