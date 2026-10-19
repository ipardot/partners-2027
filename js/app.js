'use strict';

const ICONS = {
  users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 19c.6-3.3 3-5 6-5s5.4 1.7 6 5"/><circle cx="17" cy="9" r="2.5"/><path d="M16.5 14c2.4.2 4 1.6 4.5 4"/>',
  pen: '<path d="M4 20l1-4L16 5l3 3L8 19z"/><path d="M14 7l3 3"/>',
  folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  chat: '<path d="M4 5h16v10H9l-5 4z"/><path d="M8.5 10h.01M12 10h.01M15.5 10h.01"/>',
  eye: '<path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  table: '<ellipse cx="12" cy="12" rx="5.5" ry="3"/><circle cx="12" cy="4.5" r="1.6"/><circle cx="3.8" cy="12" r="1.6"/><circle cx="20.2" cy="12" r="1.6"/><circle cx="12" cy="19.5" r="1.6"/>',
  swap: '<path d="M4 8h14l-3-3M20 16H6l3 3"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/>',
  plane: '<path d="M3 12l18-8-7 17-3-7z"/><path d="M11 14l10-10"/>',
  heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.4a4.2 4.2 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20z"/>',
  spark: '<path d="M12 3l2.2 6.3L20.5 12l-6.3 2.2L12 20.5l-2.2-6.3L3.5 12l6.3-2.7z"/>',
  truck: '<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  map: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
  door: '<path d="M5 21V4h10v17M15 7h4v14M3 21h18"/><path d="M12 12.5h.01"/>',
  screen: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
  megaphone: '<path d="M3 10v4h3l9 5V5L6 10z"/><path d="M18.5 9a4 4 0 0 1 0 6"/>',
  route: '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h7a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  left: '<path d="M15 5l-7 7 7 7"/>', right: '<path d="M9 5l7 7-7 7"/>',
  grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>',
  pano: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/><circle cx="12" cy="12" r="2.5"/>',
  motion: '<path d="M3 12h3l2-5 4 10 2-5h7"/>',
  full: '<path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
};
const icon = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ''}</svg>`;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

const $ = s => document.querySelector(s);
const stage = $('#stage'), cam = $('#camera'), panel = $('#panel');
cam.innerHTML = buildWorld();
const world = $('#world');

/* qué se "construye" en cada paso */
const REVEAL_AT = {};
STEPS.forEach((s, k) => (s.reveal || []).forEach(g => { if (!(g in REVEAL_AT)) REVEAL_AT[g] = k; }));

let cur = -1, pano = false, moveT;
const LAST = STEPS.length - 1;

/* ---------- Cámara ---------- */
const REGIONS = {
  left: [0.015, 0.1, 0.5, 0.88],
  full: [0.02, 0.1, 0.98, 0.88],
  hero: [0.33, 0.06, 1.0, 0.94],
  objectives: [0.47, 0.06, 1.0, 0.94],
  closing: [0.03, 0.065, 0.97, 0.6],
};
const isNarrow = () => stage.clientWidth < 900 || stage.clientWidth / stage.clientHeight < 1.15;
function camFor(step) {
  if (pano) return { rect: worldRect('all'), region: REGIONS.full };
  const k = step.kind;
  let region = k === 'hero' ? REGIONS.hero : k === 'objectives' ? REGIONS.objectives : k === 'closing' ? REGIONS.closing : REGIONS.left;
  if (isNarrow()) region = k === 'closing' ? [0.02, 0.08, 0.98, 0.45] : [0.02, 0.07, 0.98, 0.36];
  const key = k === 'relation' || k === 'closing' ? 'core' : step.cam;
  return { rect: worldRect(key), region, max: k === 'proposal' ? 1.9 : 1.5 };
}
function applyCamera() {
  const { rect, region, max } = camFor(STEPS[cur]);
  const vw = stage.clientWidth, vh = stage.clientHeight;
  const rx = region[0] * vw, ry = region[1] * vh, rw = (region[2] - region[0]) * vw, rh = (region[3] - region[1]) * vh;
  let s = Math.min(rw / rect.w, rh / rect.h);
  if (max) s = Math.min(s, max * Math.min(vw / 1920, vh / 1080) * 1.0 + 0.0001);
  const tx = rx + rw / 2 - (rect.x + rect.w / 2) * s, ty = ry + rh / 2 - (rect.y + rect.h / 2) * s;
  const t = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${s.toFixed(4)})`;
  if (t === cam.style.transform) return;
  cam.style.transform = t;
  // pausa las animaciones decorativas mientras la cámara se mueve
  document.body.classList.add('moving');
  clearTimeout(moveT);
  moveT = setTimeout(() => document.body.classList.remove('moving'), document.body.classList.contains('calm') ? 550 : 1200);
}

/* ---------- Estado del mundo ---------- */
function applyWorldState() {
  const step = STEPS[cur];
  const focus = pano ? null : step.kind === 'proposal' ? step.id : step.kind === 'pillar' ? step.p : null;
  const all = step.kind === 'closing';
  world.querySelectorAll('.g').forEach(el => {
    const g = el.dataset.g, at = REVEAL_AT[g];
    el.classList.toggle('built', all || at === undefined || cur >= at);
    el.classList.toggle('focus', g === focus || (step.kind === 'pillar' && el.dataset.pin && PROP[el.dataset.pin]?.pillar === step.p));
  });
  world.classList.toggle('pano', pano);
  world.classList.toggle('closeup', !pano && step.kind === 'proposal');
}

/* ---------- Paneles ---------- */
const chip = (pid) => `<span class="chip" data-p="${pid}">${PILLARS[pid].name}</span>`;
const objChip = (n, also) => `<span class="ochip${also ? ' also' : ''}"><b>${n}</b>${OBJECTIVES[n].title}</span>`;

function heroHTML() {
  return `<section class="card hero">
    <div class="hero-head">
      <div class="photo"><img src="assets/alejandro.jpg" alt="Alejandro Galeano Mejía" onerror="this.remove()"><span>AG</span></div>
      <div>
        <p class="eyebrow">Presidencia 2027 · Partners Campus EAFIT</p>
        <h1>Alejandro Galeano Mejía</h1>
        <p class="role">Candidato a la Presidencia de Partners Campus EAFIT 2027</p>
      </div>
    </div>
    <blockquote class="vision">${VISION}</blockquote>
    <p class="values">Pasión · Empatía · Transparencia · Autenticidad · Responsabilidad</p>
  </section>`;
}
function objectivesHTML() {
  return `<section class="card hero objs">
    <p class="eyebrow">Presidencia 2027 · Partners Campus EAFIT</p>
    <h1>Objetivos</h1>
    <ol class="olist">${[1, 2, 3].map(n => `<li><span class="onum">${n}</span><p>${OBJECTIVES[n].text}</p></li>`).join('')}</ol>
  </section>`;
}
function relationHTML() {
  const rows = ['con', 'sir', 'cam'].map(pk => {
    const ps = PROPOSALS.filter(p => p.pillar === pk);
    return ps.map((p, k) => `<tr data-p="${pk}">
      ${k === 0 ? `<th rowspan="${ps.length}" class="pcell"><span>${PILLARS[pk].name}</span></th>` : ''}
      <td class="ncell"><b>${p.id}</b> ${p.name}</td>
      ${[1, 2, 3].map(n => `<td class="dot">${p.main.includes(n) ? '<i class="m"></i>' : p.also.includes(n) ? '<i class="a"></i>' : ''}</td>`).join('')}
    </tr>`).join('');
  }).join('');
  return `<section class="card side rel">
    <p class="eyebrow">Objetivos y pilares</p>
    <h2>Todo se conecta</h2>
    <p class="lead">Los pilares organizan las propuestas; cada propuesta aporta a uno o varios objetivos.</p>
    <table class="matrix"><thead><tr><th></th><th></th>${[1, 2, 3].map(n => `<th class="oh"><span class="onum sm">${n}</span><small>${OBJECTIVES[n].title}</small></th>`).join('')}</tr></thead><tbody>${rows}</tbody></table>
    <p class="legend"><i class="m"></i> aporte principal <i class="a"></i> también aporta</p>
  </section>`;
}
function pillarHTML(pk) {
  const pl = PILLARS[pk];
  return `<section class="card side pillar" data-p="${pk}">
    <p class="eyebrow">Pilar ${pl.n} de Partners</p>
    <h2 class="pt">${pl.name}</h2>
    <p class="lead">${pl.sub}</p>
    <ul class="pcards">${PROPOSALS.filter(p => p.pillar === pk).map(p => `<li><span class="pid">${p.id}</span><div><h3>${p.name}</h3><p>${p.tagline}</p>
      <div class="ochips">${p.main.map(n => objChip(n)).join('')}${p.also.map(n => objChip(n, true)).join('')}</div></div></li>`).join('')}</ul>
  </section>`;
}
function proposalHTML(id) {
  const p = PROP[id], pl = PILLARS[p.pillar];
  let body = '';
  if (p.acciones) {
    body += `<div class="block"><p class="label">Acciones principales</p><div class="acts n${p.acciones.length}">${p.acciones.map(a => `<div class="act">${icon(a.i)}<div><h4>${a.t}</h4><p>${a.d}${a.link ? ` <span class="link">${a.link}</span>` : ''}</p></div></div>`).join('')}</div></div>`;
  }
  if (p.split) {
    body += `<div class="block"><p class="label">Cómo funciona</p><div class="split">${p.split.map((s, k) => `${k ? `<div class="sarrow">${icon('arrow')}</div>` : ''}<div class="scol">${icon(s.i)}<h4>${s.t}</h4><ul>${s.items.map(x => `<li>${x}</li>`).join('')}</ul></div>`).join('')}</div></div>`;
  }
  if (p.route) {
    body += `<div class="block"><p class="label">Ruta de liderazgo</p><ol class="route">${p.route.map((r, k) => `<li><span class="rn">${k + 1}</span><h4>${r.t}</h4><p>${r.d}</p></li>`).join('')}</ol></div>`;
  }
  if (p.flow) {
    body += `<div class="block"><p class="label">${p.flow.title}</p><div class="flow"><span class="fend">Sale</span>${p.flow.items.map(x => `<span class="fitem">${x}</span>`).join('')}<span class="fend in">Entra</span></div></div>`;
  }
  const foot = [];
  if (p.impacto) foot.push(`<div class="impact"><p class="label">Impacto esperado</p><p>${p.impacto}</p></div>`);
  return `<section class="card side prop" data-p="${p.pillar}">
    <header class="ph"><span class="pid big">${p.id}</span><div><p class="eyebrow">${chip(p.pillar)} ${esc(p.tagline)}</p><h2>${p.name}</h2></div></header>
    <div class="qo"><div><p class="label">¿Qué es?</p><p>${p.que}</p></div><div><p class="label">Objetivo</p><p>${p.objetivo}</p></div></div>
    ${body}
    ${foot.join('')}
    <footer class="pf"><span class="label">Aporta a</span>${p.main.map(n => objChip(n)).join('')}${p.also.map(n => objChip(n, true)).join('')}${p.nota ? `<p class="nota">${p.nota}</p>` : ''}</footer>
  </section>`;
}
function closingHTML() {
  return `<section class="card closing">
    <p class="eyebrow">Todo conecta</p>
    <blockquote class="vision">${VISION}</blockquote>
    <div class="cl-row">
      <div class="ochips">${[1, 2, 3].map(n => objChip(n)).join('')}</div>
      <p class="sig"><b>Alejandro Galeano Mejía</b> · Presidencia Partners Campus EAFIT 2027</p>
    </div>
  </section>`;
}
function panelHTML(step) {
  switch (step.kind) {
    case 'hero': return heroHTML();
    case 'objectives': return objectivesHTML();
    case 'relation': return relationHTML();
    case 'pillar': return pillarHTML(step.p);
    case 'proposal': return proposalHTML(step.id);
    case 'closing': return closingHTML();
  }
  return '';
}

let swapTimer;
function renderPanel() {
  const step = STEPS[cur];
  clearTimeout(swapTimer);
  panel.classList.remove('in');
  swapTimer = setTimeout(() => {
    panel.className = 'panel k-' + step.kind;
    panel.innerHTML = panelHTML(step);
    fitPanel();
    requestAnimationFrame(() => panel.classList.add('in'));
  }, document.body.classList.contains('calm') ? 60 : 220);
}
/* reduce el tamaño del texto si un panel no cabe en pantalla */
function fitPanel() {
  const card = panel.querySelector('.card');
  if (!card) return;
  card.style.fontSize = '';
  let fs = 1;
  const limit = panel.clientHeight;
  while (card.scrollHeight > limit && fs > 0.66) { fs -= 0.04; card.style.fontSize = fs + 'em'; }
}

/* ---------- Navegación ---------- */
function go(n, opts = {}) {
  n = Math.max(0, Math.min(LAST, n));
  if (n === cur && !opts.force) return;
  cur = n;
  if (pano && !opts.keepPano) { pano = false; stage.classList.remove('is-pano'); }
  applyCamera();
  applyWorldState();
  renderPanel();
  updateChrome();
  try { history.replaceState(null, '', '#' + (cur + 1)); } catch (e) { }
}
const next = () => go(cur + 1), prev = () => go(cur - 1);

function togglePano(force) {
  pano = force ?? !pano;
  stage.classList.toggle('is-pano', pano);
  applyCamera(); applyWorldState();
  $('#btn-pano').classList.toggle('active', pano);
}

/* ---------- Interfaz ---------- */
const GROUPS = [...new Set(STEPS.map(s => s.group))];
function buildChrome() {
  $('#btn-prev').innerHTML = icon('left');
  $('#btn-next').innerHTML = icon('right');
  $('#btn-index').innerHTML = icon('grid') + '<span>Índice</span>';
  $('#btn-pano').innerHTML = icon('pano') + '<span>Panorámica</span>';
  $('#btn-motion').innerHTML = icon('motion') + '<span>Animaciones</span>';
  $('#btn-full').innerHTML = icon('full') + '<span>Pantalla completa</span>';
  updateThemeBtn();
  $('#index-close').innerHTML = icon('close');
  $('#progress').innerHTML = GROUPS.map(g => `<div class="pg" data-group="${g}"><div class="pg-dots">${STEPS.map((s, k) => s.group === g ? `<button class="pdot" data-k="${k}" title="${esc(s.label)}" aria-label="${esc(s.label)}"></button>` : '').join('')}</div><span class="pg-l">${g}</span></div>`).join('');
  $('#index-list').innerHTML = GROUPS.map(g => `<div class="ix-g"><h3>${g}</h3>${STEPS.map((s, k) => s.group === g ? `<button class="ix" data-k="${k}"><span class="ix-n">${k + 1}</span>${s.kind === 'proposal' ? `<b>${s.id}</b> ` : ''}${esc(s.label)}</button>` : '').join('')}</div>`).join('');
}
function updateChrome() {
  const s = STEPS[cur];
  $('#crumb').innerHTML = `<span class="cg">${s.group}</span><span class="cs">${s.kind === 'proposal' ? s.id + ' · ' : ''}${esc(s.label)}</span>`;
  $('#count').textContent = `${cur + 1} / ${STEPS.length}`;
  document.querySelectorAll('.pdot').forEach(d => { const k = +d.dataset.k; d.classList.toggle('done', k < cur); d.classList.toggle('cur', k === cur); });
  document.querySelectorAll('.pg').forEach(g => g.classList.toggle('cur', g.dataset.group === s.group));
  document.querySelectorAll('.ix').forEach(b => b.classList.toggle('cur', +b.dataset.k === cur));
  $('#btn-prev').disabled = cur === 0;
  $('#btn-next').disabled = cur === LAST;
}
function openIndex(open) {
  const el = $('#index');
  const want = open ?? el.hidden;
  el.hidden = !want;
  $('#btn-index').classList.toggle('active', want);
  if (want) el.querySelector('.ix.cur')?.focus();
}
function setCalm(on) {
  document.body.classList.toggle('calm', on);
  $('#btn-motion').classList.toggle('active', on);
  $('#btn-motion').setAttribute('aria-pressed', on);
  $('#btn-motion').title = on ? 'Animaciones reducidas (A)' : 'Reducir animaciones (A)';
  try { localStorage.setItem('p27-calm', on ? '1' : '0'); } catch (e) { }
}
function updateThemeBtn() {
  const dark = document.documentElement.dataset.theme === 'dark';
  const b = $('#btn-theme');
  b.innerHTML = icon(dark ? 'sun' : 'moon') + `<span>${dark ? 'Modo claro' : 'Modo oscuro'}</span>`;
  b.setAttribute('aria-pressed', dark);
  b.title = (dark ? 'Modo claro' : 'Modo oscuro') + ' (D)';
}
function toggleTheme() {
  const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem('p27-theme', t); } catch (e) { }
  updateThemeBtn();
}
function toggleFull() {
  if (document.fullscreenElement) document.exitFullscreen?.();
  else document.documentElement.requestFullscreen?.().catch(() => { });
}

buildChrome();
if (/netlify\.app$/.test(location.hostname)) document.body.classList.add('netlify');
document.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.id === 'btn-next') next();
  else if (b.id === 'btn-prev') prev();
  else if (b.id === 'btn-index') openIndex();
  else if (b.id === 'index-close') openIndex(false);
  else if (b.id === 'btn-pano') togglePano();
  else if (b.id === 'btn-motion') setCalm(!document.body.classList.contains('calm'));
  else if (b.id === 'btn-full') toggleFull();
  else if (b.id === 'btn-theme') toggleTheme();
  else if (b.dataset.k !== undefined) { openIndex(false); go(+b.dataset.k); }
  b.blur?.();
});
$('#index').addEventListener('click', e => { if (e.target.id === 'index') openIndex(false); });

document.addEventListener('keydown', e => {
  if (e.altKey || e.ctrlKey || e.metaKey) return;
  const idx = !$('#index').hidden;
  const k = e.key;
  if (idx && !['Escape', 'i', 'I', 'm', 'M'].includes(k)) return;
  if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(k)) { e.preventDefault(); if (pano) togglePano(false); else next(); }
  else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); if (pano) togglePano(false); else prev(); }
  else if (k === 'Home') { e.preventDefault(); go(0); }
  else if (k === 'End') { e.preventDefault(); go(LAST); }
  else if (k === 'p' || k === 'P' || k === 'v' || k === 'V') togglePano();
  else if (k === 'i' || k === 'I' || k === 'm' || k === 'M') openIndex();
  else if (k === 'f' || k === 'F') toggleFull();
  else if (k === 'd' || k === 'D') toggleTheme();
  else if (k === 'a' || k === 'A') setCalm(!document.body.classList.contains('calm'));
  else if (k === 'Escape') { if (idx) openIndex(false); else if (pano) togglePano(false); }
});

/* controles discretos: se atenúan cuando el ratón no se mueve */
let idleT;
const wake = () => { document.body.classList.remove('idle'); clearTimeout(idleT); idleT = setTimeout(() => document.body.classList.add('idle'), 2600); };
document.addEventListener('mousemove', wake); wake();

let rT;
window.addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(() => { applyCamera(); fitPanel(); }, 120); });
window.addEventListener('hashchange', () => { const n = parseInt(location.hash.slice(1), 10); if (Number.isFinite(n) && n - 1 !== cur) go(n - 1); });
document.addEventListener('fullscreenchange', () => $('#btn-full').classList.toggle('active', !!document.fullscreenElement));

/* arranque */
let calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
try { const v = localStorage.getItem('p27-calm'); if (v !== null) calm = v === '1'; } catch (e) { }
setCalm(calm);
document.body.classList.add('no-anim');
const start = parseInt((location.hash || '').slice(1), 10);
go(Number.isFinite(start) ? start - 1 : 0, { force: true });
requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.remove('no-anim')));
