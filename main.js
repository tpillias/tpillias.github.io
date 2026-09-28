// ---------- University colour themes ----------
const UNI = {
  saclay: { bg: "#63003c", fg: "#f3ecdc" }, // Université Paris-Saclay plum
  uppa:   { bg: "#b1ba00", fg: "#0e1a2b" }, // UPPA lime green
  angers: { bg: "#111111", fg: "#f3ecdc" }, // Université d'Angers black
};
const root = document.documentElement;

// ---------- Header ----------
const nav = document.querySelector(".nav");
const onScroll = () => nav.classList.toggle("scrolled", scrollY > 30);
addEventListener("scroll", onScroll, { passive: true });
onScroll();

const menuBtn = document.querySelector(".menu-btn");
const links = document.querySelector(".nav-links");
menuBtn.addEventListener("click", () => {
  links.classList.toggle("open");
  menuBtn.classList.toggle("open");
});
links.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => { links.classList.remove("open"); menuBtn.classList.remove("open"); })
);

// Highlight the current section in the header
const navLinks = [...document.querySelectorAll('.nav-links > a[href^="#"]')];
const spy = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting)
      navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
  }),
  { rootMargin: "-45% 0px -50% 0px" }
);
document.querySelectorAll("section[id], footer[id]").forEach((s) => spy.observe(s));

// ---------- Education: switch band colour + logo while scrolling ----------
const steps = [...document.querySelectorAll(".edu-step")];
const tiles = [...document.querySelectorAll(".logo-tile")];
const dots = [...document.querySelectorAll(".edu-progress span")];

function setUni(key) {
  const t = UNI[key];
  root.style.setProperty("--uni-bg", t.bg);
  root.style.setProperty("--uni-fg", t.fg);
  steps.forEach((s) => s.classList.toggle("active", s.dataset.uni === key));
  tiles.forEach((t) => t.classList.toggle("active", t.dataset.for === key));
  const i = steps.findIndex((s) => s.dataset.uni === key);
  dots.forEach((d, j) => d.classList.toggle("on", j === i));
}

const eduObs = new IntersectionObserver(
  (entries) => entries.forEach((e) => e.isIntersecting && setUni(e.target.dataset.uni)),
  { rootMargin: "-48% 0px -48% 0px" } // fires when a step crosses the middle of the screen
);
steps.forEach((s) => eduObs.observe(s));
setUni("saclay");

// ---------- Fin banner parallax ----------
const banner = document.querySelector(".banner");
const bannerImg = banner && banner.querySelector("img");
if (bannerImg && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  let ticking = false;
  const move = () => {
    const r = banner.getBoundingClientRect();
    const progress = (r.top + r.height) / (innerHeight + r.height); // 1 → 0 while crossing
    bannerImg.style.transform = `translateY(${(progress - 0.5) * 18}%)`;
    ticking = false;
  };
  addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(move); ticking = true; } }, { passive: true });
  move();
}

// ---------- Project side panel ----------
const panel = document.querySelector(".panel");
const overlay = document.querySelector(".panel-overlay");
const panelContent = document.querySelector(".panel-content");
let lastCard = null;

function openPanel(id, card) {
  const tpl = document.getElementById(id);
  if (!tpl) return;
  lastCard = card;
  panelContent.replaceChildren(tpl.content.cloneNode(true));
  panel.scrollTop = 0;
  overlay.hidden = false;
  requestAnimationFrame(() => { overlay.classList.add("show"); panel.classList.add("open"); });
  panel.setAttribute("aria-hidden", "false");
  document.body.classList.add("locked");
  panel.querySelector(".panel-close").focus();
}
function closePanel() {
  panel.classList.remove("open");
  overlay.classList.remove("show");
  panel.setAttribute("aria-hidden", "true");
  document.body.classList.remove("locked");
  setTimeout(() => (overlay.hidden = true), 400);
  if (lastCard) lastCard.focus();
}
document.querySelectorAll(".p-card").forEach((c) =>
  c.addEventListener("click", () => openPanel(c.dataset.project, c))
);
panel.querySelector(".panel-close").addEventListener("click", closePanel);
overlay.addEventListener("click", closePanel);
addEventListener("keydown", (e) => { if (e.key === "Escape" && panel.classList.contains("open")) closePanel(); });

// ---------- Footer year ----------
document.querySelectorAll(".year").forEach((el) => (el.textContent = new Date().getFullYear()));
