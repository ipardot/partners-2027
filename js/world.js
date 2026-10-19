'use strict';
/* Mundo isométrico generado en SVG. Coordenadas de cuadrícula (i, j); altura z en píxeles. */

const WT = 32, WH = 16, SH = 22;          // medio ancho de baldosa, media altura, altura de las mesetas
const OX = 2100, OY = 150;
const WORLD_W = 4180, WORLD_H = 1900;
const R2 = Math.SQRT2;

const COL = {
  navy: '#16213a', conf: '#4e689b', insp: '#90aed1', salmon: '#fd7c5e', rojo: '#cf6b5b', mauve: '#8a6f8a',
  land: 'var(--w-land)', grass: 'var(--w-grass)', stone: 'var(--w-stone)', plank: '#e9dcc6', water: 'var(--w-water)',
  wall: '#fbf8f3', glass: '#d7e5f4', gold: '#f6c35b', trunk: '#8a6a52',
};
const SKIN = ['#f1c7a5', '#d9a27c', '#b77b56', '#8d5a3c', '#e8b796', '#c68e6b'];
const HAIR = ['#2b2320', '#4a3426', '#16213a', '#7a4b2a', '#1d1d1d', '#a0663b'];
const SHIRT = ['#4e689b', '#8a6f8a', '#fd7c5e', '#16213a', '#90aed1', '#cf6b5b', '#f6c35b', '#5f9a76'];

let seed = 7;
function rnd() { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }
const pick = a => a[Math.floor(rnd() * a.length)];

function P(i, j, z) { return [OX + (i - j) * WT, OY + (i + j) * WH - (z || 0)]; }
function UV(u, v) { return { i: (v + u) / 2, j: (v - u) / 2 }; }
const f = n => Math.round(n * 10) / 10;
const pts = a => a.map(p => f(p[0]) + ',' + f(p[1])).join(' ');
const paint = c => String(c).startsWith('var(') ? `style="fill:${c}"` : `fill="${c}"`;
const EDGE = 'stroke="rgba(22,33,58,.16)" stroke-width=".7" stroke-linejoin="round"';
function poly(a, fill, extra) { return `<polygon points="${pts(a)}" ${paint(fill)}${extra ? ' ' + extra : ''}/>`; }
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = n >> 8 & 255, b = n & 255;
  const t = amt < 0 ? 0 : 255, p = Math.abs(amt);
  r = Math.round((t - r) * p + r); g = Math.round((t - g) * p + g); b = Math.round((t - b) * p + b);
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/* ---------- Primitivas ---------- */
function box(i, j, w, d, h, c, z = SH, o = {}) {
  const zt = z + h;
  return poly([P(i, j + d, zt), P(i + w, j + d, zt), P(i + w, j + d, z), P(i, j + d, z)], o.l || shade(c, -0.08), EDGE)
    + poly([P(i + w, j, zt), P(i + w, j + d, zt), P(i + w, j + d, z), P(i + w, j, z)], o.r || shade(c, -0.24), EDGE)
    + poly([P(i, j, zt), P(i + w, j, zt), P(i + w, j + d, zt), P(i, j + d, zt)], o.t || shade(c, 0.14), EDGE);
}
function flat(i, j, w, d, c, z = SH, extra = '') { return poly([P(i, j, z), P(i + w, j, z), P(i + w, j + d, z), P(i, j + d, z)], c, extra); }
function ell(i, j, r, c, z = SH, extra = '') {
  const [x, y] = P(i, j, z);
  return `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(r * WT * R2)}" ry="${f(r * WH * R2)}" ${paint(c)} ${extra}/>`;
}
function cyl(i, j, r, h, c, z = SH, o = {}) {
  const [x, yb] = P(i, j, z), yt = yb - h, rx = r * WT * R2, ry = r * WH * R2;
  return `<path d="M${f(x - rx)},${f(yt)}V${f(yb)}A${f(rx)},${f(ry)} 0 0 0 ${f(x + rx)},${f(yb)}V${f(yt)}Z" fill="${o.side || shade(c, -0.06)}"/>`
    + `<path d="M${f(x)},${f(yt + ry)}V${f(yb + ry)}A${f(rx)},${f(ry)} 0 0 0 ${f(x + rx)},${f(yb)}V${f(yt)}A${f(rx)},${f(ry)} 0 0 1 ${f(x)},${f(yt + ry)}Z" fill="rgba(22,33,58,.13)"/>`
    + `<ellipse cx="${f(x)}" cy="${f(yt)}" rx="${f(rx)}" ry="${f(ry)}" fill="${o.top || shade(c, 0.16)}" ${EDGE}/>`;
}
function gable(i, j, w, d, h, c, roof, rh = 14, z = SH) {
  const zt = z + h, m = j + d / 2;
  return box(i, j, w, d, h, c, z)
    + poly([P(i, j, zt), P(i + w, j, zt), P(i + w, m, zt + rh), P(i, m, zt + rh)], shade(roof, -0.2), EDGE)
    + poly([P(i + w, j, zt), P(i + w, j + d, zt), P(i + w, m, zt + rh)], shade(c, -0.24), EDGE)
    + poly([P(i, j + d, zt), P(i + w, j + d, zt), P(i + w, m, zt + rh), P(i, m, zt + rh)], roof, EDGE);
}
function pyr(i, j, w, d, rh, c, z) {
  const a = P(i + w / 2, j + d / 2, z + rh);
  return poly([P(i, j, z), P(i + w, j, z), a], shade(c, -0.1)) + poly([P(i, j, z), P(i, j + d, z), a], shade(c, 0.05))
    + poly([P(i, j + d, z), P(i + w, j + d, z), a], shade(c, -0.04), EDGE) + poly([P(i + w, j, z), P(i + w, j + d, z), a], shade(c, -0.22), EDGE);
}
/* ventanas sobre la cara derecha (plano i fijo) y la cara izquierda (plano j fijo) */
function winR(i, j, d, z, h, cols, rows, c = COL.glass) {
  let s = ''; const gw = d / cols, gh = h / rows;
  for (let a = 0; a < cols; a++) for (let b = 0; b < rows; b++) {
    const j0 = j + a * gw + gw * .22, j1 = j + a * gw + gw * .78, z0 = z + b * gh + gh * .28, z1 = z + b * gh + gh * .78;
    s += poly([P(i, j0, z1), P(i, j1, z1), P(i, j1, z0), P(i, j0, z0)], shade(c, -0.12));
  }
  return s;
}
function winL(i, j, w, z, h, cols, rows, c = COL.glass) {
  let s = ''; const gw = w / cols, gh = h / rows;
  for (let a = 0; a < cols; a++) for (let b = 0; b < rows; b++) {
    const i0 = i + a * gw + gw * .22, i1 = i + a * gw + gw * .78, z0 = z + b * gh + gh * .28, z1 = z + b * gh + gh * .78;
    s += poly([P(i0, j, z1), P(i1, j, z1), P(i1, j, z0), P(i0, j, z0)], c);
  }
  return s;
}
function doorL(i, j, w, z, h, c = '#6b5547') { return poly([P(i, j, z + h), P(i + w, j, z + h), P(i + w, j, z), P(i, j, z)], c); }
function building(i, j, w, d, h, c, o = {}) {
  const z = o.z ?? SH;
  let s = o.roof === 'gable' ? gable(i, j, w, d, h, c, o.roofC || COL.rojo, o.rh || 14, z) : box(i, j, w, d, h, c, z);
  const rows = o.rows || Math.max(1, Math.round(h / 16));
  s += winL(i, j + d, w, z + 2, h - 4, Math.max(1, Math.round(w * 1.2)), rows, o.win);
  s += winR(i + w, j, d, z + 2, h - 4, Math.max(1, Math.round(d * 1.2)), rows, o.win);
  if (o.door) s += doorL(i + w / 2 - .25, j + d, .5, z, 11, o.door === true ? '#6b5547' : o.door);
  if (o.roof === 'pyr') s += pyr(i, j, w, d, o.rh || 16, o.roofC || COL.rojo, z + h);
  return s;
}
function tree(i, j, s = 1, kind = 0, z = SH) {
  const [x, y] = P(i, j, z);
  let o = `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(12 * s)}" ry="${f(5.5 * s)}" fill="rgba(22,33,58,.12)"/>`
    + `<rect x="${f(x - 2 * s)}" y="${f(y - 15 * s)}" width="${f(4 * s)}" height="${f(15 * s)}" rx="1.5" fill="${COL.trunk}"/>`;
  if (kind === 1) {
    o += `<polygon points="${f(x)},${f(y - 50 * s)} ${f(x + 13 * s)},${f(y - 14 * s)} ${f(x - 13 * s)},${f(y - 14 * s)}" fill="#6aa680"/>`
      + `<polygon points="${f(x)},${f(y - 50 * s)} ${f(x + 13 * s)},${f(y - 14 * s)} ${f(x)},${f(y - 14 * s)}" fill="#558e6c"/>`;
  } else {
    const g = kind === 2 ? ['#9cc79c', '#b9dbb0', '#86b689'] : ['#7fb58f', '#a6d1aa', '#6aa07c'];
    o += `<circle cx="${f(x)}" cy="${f(y - 26 * s)}" r="${f(14 * s)}" fill="${g[0]}"/>`
      + `<path d="M${f(x)},${f(y - 40 * s)}a${f(14 * s)},${f(14 * s)} 0 0 1 0,${f(28 * s)}z" fill="${g[2]}"/>`
      + `<circle cx="${f(x - 5 * s)}" cy="${f(y - 31 * s)}" r="${f(6 * s)}" fill="${g[1]}"/>`;
  }
  return o;
}
function person(i, j, shirt, z = SH, s = 1, extra = '') {
  const [x, y] = P(i, j, z);
  const skin = pick(SKIN), hair = pick(HAIR);
  return `<g class="pp" style="--dl:${(rnd() * 2.4).toFixed(2)}s"${extra}>`
    + `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(5.5 * s)}" ry="${f(2.6 * s)}" fill="rgba(22,33,58,.2)"/>`
    + `<rect x="${f(x - 3.4 * s)}" y="${f(y - 7 * s)}" width="${f(6.8 * s)}" height="${f(7 * s)}" rx="${f(1.6 * s)}" fill="#33405c"/>`
    + `<rect x="${f(x - 4.8 * s)}" y="${f(y - 18 * s)}" width="${f(9.6 * s)}" height="${f(13 * s)}" rx="${f(4.6 * s)}" fill="${shirt || pick(SHIRT)}"/>`
    + `<circle cx="${f(x)}" cy="${f(y - 22.5 * s)}" r="${f(4.4 * s)}" fill="${skin}"/>`
    + `<path d="M${f(x - 4.5 * s)},${f(y - 22.5 * s)}a${f(4.5 * s)},${f(4.5 * s)} 0 0 1 ${f(9 * s)},0q-4.5,-2 -9,0z" fill="${hair}"/></g>`;
}
function crowd(list, z = SH) { return list.map(([i, j, c]) => person(i, j, c, z)).join(''); }
function bench(i, j, z = SH) { return box(i, j, 1, .32, 4, '#b98a63', z) + box(i, j + .25, 1, .08, 8, '#a87a55', z); }
function flagPole(i, j, h, c, z = SH) {
  const [x, y] = P(i, j, z);
  return `<line x1="${f(x)}" y1="${f(y)}" x2="${f(x)}" y2="${f(y - h)}" stroke="#6b7488" stroke-width="2.2" stroke-linecap="round"/>`
    + `<path class="flag" d="M${f(x)},${f(y - h)}q8,-4 16,0t16,0v15q-8,-4 -16,0t-16,0z" fill="${c}"/>`;
}
function lamp(i, j, z = SH) {
  const [x, y] = P(i, j, z);
  return `<line x1="${f(x)}" y1="${f(y)}" x2="${f(x)}" y2="${f(y - 30)}" stroke="#5a6478" stroke-width="2"/><circle cx="${f(x)}" cy="${f(y - 32)}" r="3.6" fill="${COL.gold}"/>`;
}
function bubble(x, y, c, icon) {
  return `<g class="bub"><rect x="${f(x - 22)}" y="${f(y - 34)}" width="44" height="30" rx="10" fill="#fff" stroke="${c}" stroke-width="2.4"/>`
    + `<path d="M${f(x - 6)},${f(y - 4.5)}l2,9l9,-9" fill="#fff" stroke="${c}" stroke-width="2.4" stroke-linejoin="round"/>`
    + `<rect x="${f(x - 4)}" y="${f(y - 7)}" width="10" height="4" fill="#fff"/>`
    + (icon === 'eye'
      ? `<path d="M${f(x - 12)},${f(y - 19)}q12,-11 24,0q-12,11 -24,0z" fill="none" stroke="${c}" stroke-width="2.2"/><circle cx="${f(x)}" cy="${f(y - 19)}" r="3.6" fill="${c}"/>`
      : `<circle cx="${f(x - 9)}" cy="${f(y - 19)}" r="2.8" fill="${c}"/><circle cx="${f(x)}" cy="${f(y - 19)}" r="2.8" fill="${c}"/><circle cx="${f(x + 9)}" cy="${f(y - 19)}" r="2.8" fill="${c}"/>`)
    + '</g>';
}
function boat(i, j, c, z = 0) {
  const [x, y] = P(i, j, z);
  return `<g class="boat"><path d="M${f(x - 26)},${f(y - 8)}h52l-9,13h-34z" fill="${c}"/><path d="M${f(x - 26)},${f(y - 8)}h52l-2,3h-48z" fill="#fff" opacity=".5"/>`
    + `<line x1="${f(x)}" y1="${f(y - 8)}" x2="${f(x)}" y2="${f(y - 48)}" stroke="#5a6478" stroke-width="2"/>`
    + `<path d="M${f(x + 2)},${f(y - 46)}l20,33h-20z" fill="#fff"/><path d="M${f(x - 2)},${f(y - 40)}l-15,27h15z" fill="${COL.insp}"/></g>`;
}
function crate(i, j, c, s = .5, z = SH) { return box(i, j, s, s, s * 18, c, z); }

/* ---------- Escena con orden de pintado ---------- */
class Scene {
  constructor() { this.items = []; }
  add(d, s) { this.items.push([d, s]); return this; }
  out() { return this.items.sort((a, b) => a[0] - b[0]).map(x => x[1]).join(''); }
}

/* ---------- Geografía ---------- */
const ZONES = {
  vision: { ...UV(0, 40), n: 12, side: COL.navy },
  con: { ...UV(-34, 77), n: 15, side: PILLARS.con.c },
  sir: { ...UV(0, 77), n: 15, side: PILLARS.sir.c },
  cam: { ...UV(34, 77), n: 15, side: PILLARS.cam.c },
};
const SITES = {
  '1.1': UV(-27, 80), '1.2': UV(-34, 70), '1.3': UV(-41, 80),
  '2.1': UV(-5, 73), '2.2': UV(5, 81),
  '3.1': UV(30, 72), '3.2': UV(41, 79),
};
const CHAPTER_ISLES = [UV(-60, 70), UV(-58, 92), UV(-44, 104)];
const DECOR_ISLES = [UV(58, 66), UV(54, 100), UV(-40, 34), UV(40, 30)];
const ISLE_N = 4, ISLE_H = 14;

const SLABS = [
  ...Object.values(ZONES).map(z => ({ i0: z.i - z.n / 2, j0: z.j - z.n / 2, n: z.n })),
  ...[...CHAPTER_ISLES, ...DECOR_ISLES].map(c => ({ i0: c.i - ISLE_N / 2, j0: c.j - ISLE_N / 2, n: ISLE_N })),
];
function onLand(i, j, m = 0) { return SLABS.some(s => i >= s.i0 - m && i <= s.i0 + s.n + m && j >= s.j0 - m && j <= s.j0 + s.n + m); }

const DECKS = [
  [[21.5, 25], [21.5, 50]],
  [[25, 21.5], [50, 21.5]],
  [[24, 24], [30, 24], [30, 30], [36, 30], [36, 33]],
  [[27.5, 58], [38.5, 58], [38.5, 44]],
  [[58, 27.5], [58, 42], [45, 42]],
];

function terrain() {
  const sc = new Scene();
  const slab = (i0, j0, n, side, h, top) => {
    const c = i0 + j0 + n;
    sc.add(c, box(i0, j0, n, n, h, side, 0, { t: top, l: shade(side, 0.08), r: shade(side, -0.12) })
      + flat(i0 + .35, j0 + .35, n - .7, n - .7, COL.grass, h));
  };
  Object.values(ZONES).forEach(z => slab(z.i - z.n / 2, z.j - z.n / 2, z.n, z.side, SH, COL.land));
  [...CHAPTER_ISLES, ...DECOR_ISLES].forEach(c => slab(c.i - ISLE_N / 2, c.j - ISLE_N / 2, ISLE_N, COL.insp, ISLE_H, COL.land));
  return sc.out();
}

function decks() {
  const sc = new Scene(), wd = 1.3;
  let k = 0;
  DECKS.forEach(route => {
    for (let s = 0; s < route.length - 1; s++) {
      const [a, b] = [route[s], route[s + 1]];
      const alongI = a[1] === b[1];
      const len = Math.abs(alongI ? b[0] - a[0] : b[1] - a[1]);
      const dir = Math.sign(alongI ? b[0] - a[0] : b[1] - a[1]);
      const steps = Math.ceil(len);
      for (let t = 0; t < steps; t++) {
        const p0 = t * dir, p1 = Math.min(t + 1, len) * dir;
        let i0, j0, w, d;
        if (alongI) { i0 = a[0] + Math.min(p0, p1) - (t === 0 ? wd / 2 : 0); w = Math.abs(p1 - p0) + (t === 0 ? wd / 2 : 0) + (t === steps - 1 ? wd / 2 : 0); j0 = a[1] - wd / 2; d = wd; }
        else { j0 = a[1] + Math.min(p0, p1) - (t === 0 ? wd / 2 : 0); d = Math.abs(p1 - p0) + (t === 0 ? wd / 2 : 0) + (t === steps - 1 ? wd / 2 : 0); i0 = a[0] - wd / 2; w = wd; }
        const ci = i0 + w / 2, cj = j0 + d / 2;
        if (onLand(ci, cj, -.2)) {
          sc.add(-1000 + k++, flat(i0, j0, w, d, COL.stone, SH, 'stroke="#e2d8c6" stroke-width="1"'));
        } else {
          if (k % 3 === 0 && !onLand(ci, cj, 1.6)) sc.add(ci + cj - .01, box(ci - .22, cj - .22, .44, .44, SH - 3, '#c9bfae', 0));
          sc.add(ci + cj, box(i0, j0, w, d, 3, COL.plank, SH - 3, { t: COL.stone, l: 'var(--w-plank-l)', r: 'var(--w-plank-r)' }));
          k++;
        }
      }
    }
  });
  return sc.out();
}

/* ---------- Escenas ---------- */
function visionScene(c) {
  const sc = new Scene(), { i, j } = c;
  sc.add(-50, ell(i, j, 3.4, COL.stone) + ell(i, j, 2.6, '#ece4d6') + ell(i, j, 1.9, COL.stone));
  [[i - 3.6, j - 3.6, 1], [i + 3.8, j - 3.4, 0], [i - 3.4, j + 3.8, 2], [i + 3.6, j + 3.6, 0], [i - 4.2, j + .2, 1], [i + .3, j - 4.3, 1]]
    .forEach(([a, b, k]) => sc.add(a + b, tree(a, b, 1.05, k)));
  // faro de la visión
  let faro = '';
  const zs = [0, 16, 32, 48, 64];
  zs.forEach((z, k) => { faro += cyl(i, j, 1.05 - k * .07, 16, k % 2 ? COL.salmon : '#ffffff', SH + z); });
  faro += box(i - .95, j - .95, 1.9, 1.9, 3, COL.navy, SH + 80);
  faro += `<g class="glow">${cyl(i, j, .62, 15, COL.gold, SH + 83, { side: '#ffe3a1', top: '#fff2cc' })}</g>`;
  faro += pyr(i - .7, j - .7, 1.4, 1.4, 16, COL.navy, SH + 98);
  const [gx, gy] = P(i, j, SH + 92);
  faro = `<circle class="halo" cx="${f(gx)}" cy="${f(gy)}" r="46" fill="url(#halo)"/>` + faro;
  sc.add(i + j, faro);
  [[i - 2.4, j + 1.2, PILLARS.con.c], [i + 1.2, j + 2.4, PILLARS.sir.c], [i + 2.4, j - 1.2, PILLARS.cam.c]].forEach(([a, b, col]) => sc.add(a + b, flagPole(a, b, 44, col)));
  [[i - 1.8, j + 2.8], [i + 2.9, j + 1.6], [i - 2.9, j - 1.4], [i + 1.5, j - 2.9], [i + 3.1, j - 3.0]].forEach(([a, b]) => sc.add(a + b, person(a, b)));
  return sc.out();
}

function s11(c) { // Next Chapter: puente de relevo entre equipo saliente y entrante
  const sc = new Scene(), { i, j } = c;
  sc.add(-90, flat(i - .6, j - 2.6, 1.2, 5.2, COL.water) + flat(i - .6, j - 2.6, .12, 5.2, '#8db6dd'));
  sc.add(-89, flat(i - 2.6, j - .5, 1.9, 1, COL.stone) + flat(i + .7, j - .5, 1.9, 1, COL.stone));
  sc.add(i + j - 2, building(i - 2.7, j - 2.3, 1.8, 1.8, 24, COL.wall, { roof: 'gable', roofC: COL.conf, rows: 1, door: true }));
  sc.add(i + j + 2.2, building(i + 1, j + .6, 1.8, 1.8, 24, COL.wall, { roof: 'gable', roofC: COL.salmon, rows: 1, door: true }));
  sc.add(i + j, box(i - .95, j - .6, 1.9, 1.2, 3, COL.plank, SH + 1, { t: COL.stone }));
  const cols = ['#f6c35b', '#90aed1', '#fd7c5e', '#8a6f8a', '#5f9a76'];
  cols.forEach((col, k) => { const a = i - .85 + k * .34; sc.add(i + j + .01 * k, crate(a, j - .17, col, .3, SH + 4)); });
  sc.add(i + j + .2, person(i - 1.25, j + .2, COL.conf, SH + 1) + person(i + 1.3, j + .2, COL.salmon, SH + 1));
  sc.add(i + 2.2 + j - 2, box(i + 1.3, j - 2.3, 1.1, .8, 12, '#f6c35b', SH, { t: '#ffd98a' }));
  [[i - 2.4, j + 2.2, 0], [i + 2.4, j - 2.6, 2]].forEach(([a, b, k]) => sc.add(a + b, tree(a, b, .95, k)));
  return sc.out();
}

function s12(c) { // Presi Presente: banca de conversación y acompañamiento a comités
  const sc = new Scene(), { i, j } = c;
  sc.add(-90, ell(i, j, 2.3, COL.stone) + ell(i, j, 2.3, 'none', SH, `stroke="${PILLARS.con.c}" stroke-width="2.5" stroke-dasharray="6 6"`));
  sc.add(i + j - 1, bench(i - 1.4, j - .1) + person(i - 1.2, j + .1, COL.salmon, SH + 1) + person(i - .6, j + .1, COL.insp, SH + 1));
  const [bx, by] = P(i - .9, j + .1, SH + 34);
  sc.add(i + j + 9, bubble(bx, by, COL.salmon, 'chat'));
  // mesa de comité observada
  sc.add(i + 1.4 + j - 1.6, box(i + .8, j - 2.2, 1.4, .9, 6, '#b98a63'));
  sc.add(i + j - 3, person(i + 1, j - 2.6, COL.mauve) + person(i + 1.7, j - 2.6, COL.conf));
  sc.add(i + j - .6, person(i + 1.1, j - .9, COL.gold) + person(i + 2.6, j - 1.6, COL.salmon));
  const [ex, ey] = P(i + 2.6, j - 1.6, SH + 32);
  sc.add(i + j + 9.1, bubble(ex, ey, PILLARS.con.c, 'eye'));
  [[i + 2.2, j + 2, 0], [i - 2.4, j - 2.3, 2], [i - 2.6, j + 2.5, 1]].forEach(([a, b, k]) => sc.add(a + b, tree(a, b, .95, k)));
  sc.add(i + 1.5 + j + 1.4, lamp(i + 1.5, j + 1.4));
  return sc.out();
}

function s13(c) { // Partners Global: globo, muelle y rutas a otros capítulos
  const sc = new Scene(), { i, j } = c;
  const edge = ZONES.con.j + ZONES.con.n / 2;
  sc.add(-90, flat(i - .5, j + .8, 1, edge - (j + .8), COL.stone));
  for (let q = edge; q < edge + 4; q++) {
    sc.add(i + q, box(i - .2, q + .3, .4, .4, SH - 3, '#c9bfae', 0) + box(i - .6, q, 1.2, 1.05, 3, COL.plank, SH - 3, { t: COL.stone }));
  }
  sc.add(i + edge + 5.5, boat(i, edge + 5.2, COL.conf));
  sc.add(i + j, box(i - .9, j - .9, 1.8, 1.8, 9, '#dfe5ee'));
  const [gx, gy] = P(i, j, SH + 36);
  sc.add(i + j + .1, `<g class="globe"><circle cx="${f(gx)}" cy="${f(gy)}" r="27" fill="#d7e5f4" stroke="${COL.conf}" stroke-width="3"/>`
    + `<ellipse cx="${f(gx)}" cy="${f(gy)}" rx="11" ry="27" fill="none" stroke="${COL.conf}" stroke-width="2"/>`
    + `<path d="M${f(gx - 27)},${f(gy)}h54M${f(gx - 23)},${f(gy - 13)}h46M${f(gx - 23)},${f(gy + 13)}h46" stroke="${COL.conf}" stroke-width="2"/>`
    + `<path d="M${f(gx - 10)},${f(gy - 18)}q8,-3 12,4q-2,8 4,12q-6,9 -12,2q-6,-8 -4,-18z" fill="#8fc09a"/></g>`);
  [[i - 2, j - 1.6, COL.salmon], [i + 1.8, j - 2, COL.mauve], [i - 2.2, j + 1.9, COL.gold], [i + 2, j + 1.4, COL.insp]].forEach(([a, b, col]) => sc.add(a + b, flagPole(a, b, 36, col)));
  [[i - .4, j + 2.1], [i + 1.2, j - .1]].forEach(([a, b]) => sc.add(a + b, person(a, b)));
  [[i - 2.5, j - 2.6, 1]].forEach(([a, b, k]) => sc.add(a + b, tree(a, b, .95, k)));
  return sc.out();
}
function chapterIsles() { // casas y banderas en las islas de otros capítulos + rutas
  const sc = new Scene(), g = SITES['1.3'];
  const [ox, oy] = P(g.i, g.j, SH + 36);
  CHAPTER_ISLES.forEach((c, k) => {
    sc.add(c.i + c.j, building(c.i - .8, c.j - .7, 1.4, 1.4, 16, COL.wall, { roof: 'gable', roofC: [COL.salmon, COL.mauve, COL.rojo][k], rows: 1, z: ISLE_H, door: true })
      + flagPole(c.i + .9, c.j - .9, 30, [COL.gold, COL.salmon, COL.conf][k], ISLE_H) + tree(c.i - 1.1, c.j + 1.2, .8, k % 3, ISLE_H));
    const [x, y] = P(c.i, c.j, ISLE_H + 26);
    sc.add(-200, `<path class="route" d="M${f(ox)},${f(oy)}Q${f((ox + x) / 2)},${f(Math.min(oy, y) - 90)} ${f(x)},${f(y)}" fill="none"/>`);
  });
  return sc.out();
}

function s21(c) { // GEL: torre de coordinación, calendario y rutas a eventos
  const sc = new Scene(), { i, j } = c;
  const tents = [[i - 2, j + 1.6], [i + 1.6, j - 2.1], [i + 1.9, j + 1.7]];
  tents.forEach(([a, b]) => { const [x1, y1] = P(i, j, SH), [x2, y2] = P(a, b, SH); sc.add(-90, `<path d="M${f(x1)},${f(y1)}L${f(x2)},${f(y2)}" stroke="${COL.mauve}" stroke-width="3" stroke-dasharray="2 7" stroke-linecap="round"/>`); });
  sc.add(i + j, cyl(i - .3, j - .3, .75, 50, '#e8e1ea') + box(i - 1.1, j - 1.1, 1.6, 1.6, 14, COL.navy, SH + 50, { l: '#8fb2d8', r: '#6e8fb5', t: COL.navy })
    + box(i - 1.25, j - 1.25, 1.9, 1.9, 3, COL.mauve, SH + 64) + flagPole(i - .3, j - .3, 22, COL.salmon, SH + 67));
  tents.forEach(([a, b], k) => sc.add(a + b, box(a - .6, b - .6, 1.2, 1.2, 9, COL.wall) + pyr(a - .75, b - .75, 1.5, 1.5, 15, [COL.salmon, COL.mauve, COL.conf][k], SH + 9)));
  // tablero de calendario anual
  const ci = i - 2.6, cj = j - 1.3, z0 = SH + 10;
  let cal = box(ci + .2, cj - .1, .2, .2, 10, '#7a5b45') + box(ci + 2.2, cj - .1, .2, .2, 10, '#7a5b45') + box(ci, cj, 2.6, .18, 26, '#ffffff', z0);
  for (let r = 0; r < 3; r++) for (let q = 0; q < 4; q++) {
    const col = (r * 4 + q) % 5 === 1 ? COL.salmon : (r * 4 + q) % 3 === 0 ? COL.insp : '#e6e9ef';
    const a = ci + .15 + q * .6, z = z0 + 3 + r * 7;
    cal += poly([P(a, cj + .18, z + 5.5), P(a + .48, cj + .18, z + 5.5), P(a + .48, cj + .18, z), P(a, cj + .18, z)], col);
  }
  sc.add(ci + cj + 1, cal);
  sc.add(i + j + 3, crate(i + .7, j + .6, COL.plank) + crate(i + 1.25, j + .6, COL.plank) + crate(i + .95, j + .6, COL.salmon, .5, SH + 9));
  [[i - .8, j + .9], [i + .9, j - .9], [i - 1.8, j + 2.7], [i + 2.9, j - 1.4]].forEach(([a, b]) => sc.add(a + b, person(a, b)));
  return sc.out();
}

function s22(c) { // Junta Alineada, Equipo Informado: mesa redonda, antena y agente de consulta
  const sc = new Scene(), { i, j } = c;
  const ti = i - .6, tj = j - .4;
  sc.add(-90, ell(ti, tj, 2.2, COL.stone));
  const seats = 7;
  for (let k = 0; k < seats; k++) {
    const a = k / seats * Math.PI * 2 - .4, pi = ti + Math.cos(a) * 1.55, pj = tj + Math.sin(a) * 1.55;
    sc.add(pi + pj + (Math.sin(a) + Math.cos(a) > 0 ? 1 : -1), person(pi, pj, SHIRT[k % 6]));
  }
  sc.add(ti + tj, cyl(ti, tj, 1.05, 7, '#b98a63') + box(ti - .3, tj - .3, .5, .38, 1.5, '#ffffff', SH + 7));
  // antena de canales oficiales
  const ai = i + 2, aj = j - 2;
  const [ax, ay] = P(ai, aj, SH + 70);
  sc.add(ai + aj, box(ai - .45, aj - .45, .9, .9, 6, '#dfe5ee') + box(ai - .12, aj - .12, .24, .24, 64, COL.mauve, SH + 6)
    + `<g class="signal"><path d="M${f(ax - 14)},${f(ay - 10)}a18,18 0 0 1 28,0M${f(ax - 24)},${f(ay - 18)}a30,30 0 0 1 48,0M${f(ax - 34)},${f(ay - 26)}a42,42 0 0 1 68,0" stroke="${COL.salmon}" stroke-width="3" fill="none" stroke-linecap="round"/></g>`);
  // kiosco del agente de IA
  const ki = i + 1.6, kj = j + 1.5;
  const [kx, ky] = P(ki + .45, kj + .9, SH + 34);
  sc.add(ki + kj, box(ki, kj, .9, .9, 24, COL.navy) + poly([P(ki + .1, kj + .9, SH + 21), P(ki + .8, kj + .9, SH + 21), P(ki + .8, kj + .9, SH + 9), P(ki + .1, kj + .9, SH + 9)], '#8fd1c9')
    + `<path class="spark" d="M${f(kx)},${f(ky - 12)}l3,8l8,3l-8,3l-3,8l-3,-8l-8,-3l8,-3z" fill="${COL.gold}"/>`);
  [[ki + 1.5, kj + .4], [ki + .4, kj + 1.8]].forEach(([a, b]) => sc.add(a + b, person(a, b)));
  [[i - 2.5, j + 2.4, 0], [i - 2.6, j - 2.6, 1]].forEach(([a, b, k]) => sc.add(a + b, tree(a, b, .95, k)));
  return sc.out();
}

function s31(c) { // Escuela de Liderazgo: escuela, graderías y podio
  const sc = new Scene(), { i, j } = c;
  sc.add(i + j - 3, building(i - 2.5, j - 2.6, 3, 2, 30, COL.wall, { roof: 'gable', roofC: COL.salmon, rows: 2, door: true, rh: 18 }));
  const [bx, by] = P(i - 1, j - 1.6, SH + 50);
  sc.add(i + j - 2.9, `<path d="M${f(bx - 8)},${f(by)}h16v-14h-16z" fill="${COL.navy}"/><path d="M${f(bx - 11)},${f(by - 14)}l11,-9l11,9z" fill="${COL.rojo}"/>`);
  // graderías frente al podio
  for (let r = 0; r < 3; r++) {
    sc.add(i + j + 1 + r, box(i - 2.2 + r * .1, j + .2 + r * .7, 2.4, .7, 4 + r * 4, '#efe7d8', SH, { t: COL.stone }));
    [0, 1, 2].forEach(q => sc.add(i + j + 1.05 + r, person(i - 1.9 + q * .8 + r * .1, j + .55 + r * .7, SHIRT[(q + r * 3) % 8], SH + 4 + r * 4)));
  }
  sc.add(i + 1.6 + j - .8, box(i + 1.2, j - 1, .8, .6, 8, COL.navy) + person(i + 1.6, j - 1.4, COL.salmon, SH));
  sc.add(i + 2.3 + j + 1.6, flagPole(i + 2.3, j + 1.6, 40, COL.conf) + flagPole(i + 2.6, j + .4, 40, COL.mauve));
  [[i + 2.5, j - 2.5, 0], [i - 2.6, j + 2.6, 2]].forEach(([a, b, k]) => sc.add(a + b, tree(a, b, .95, k)));
  return sc.out();
}

function s32(c) { // On-boarding: muelle de llegada, arco de bienvenida, hitos y plataforma
  const sc = new Scene(), { i, j } = c;
  const edge = ZONES.cam.i + ZONES.cam.n / 2;
  sc.add(-90, flat(i - 2.4, j - .5, edge - (i - 2.4), 1, COL.stone));
  for (let q = edge; q < edge + 4; q++) sc.add(q + j, box(q + .3, j - .2, .4, .4, SH - 3, '#c9bfae', 0) + box(q, j - .6, 1.05, 1.2, 3, COL.plank, SH - 3, { t: COL.stone }));
  sc.add(edge + 5.5 + j, boat(edge + 5.2, j, COL.salmon));
  sc.add(edge + 2.5 + j, person(edge + 1.5, j, COL.insp, SH) + person(edge + 2.6, j + .1, COL.gold, SH));
  // arco de bienvenida
  const gi = i + 1.2;
  sc.add(gi + j - 1, box(gi, j - 1.2, .45, .45, 34, COL.salmon));
  sc.add(gi + j + 1.2, box(gi, j + .75, .45, .45, 34, COL.salmon));
  sc.add(gi + j + 1.3, box(gi - .1, j - 1.3, .65, 2.6, 7, COL.navy, SH + 34));
  // hitos: semana 1 y semana 2
  [[i - .3, '1'], [i - 1.8, '2']].forEach(([a, n]) => {
    const [x, y] = P(a, j + .9, SH);
    sc.add(a + j + .9, `<line x1="${f(x)}" y1="${f(y)}" x2="${f(x)}" y2="${f(y - 26)}" stroke="#7a5b45" stroke-width="2.5"/><circle cx="${f(x)}" cy="${f(y - 32)}" r="10" fill="${COL.gold}" stroke="#fff" stroke-width="2"/><text x="${f(x)}" y="${f(y - 28)}" font-size="12" font-weight="700" text-anchor="middle" fill="${COL.navy}">${n}</text>`);
  });
  sc.add(i + j - .2, person(i + .4, j - .1, COL.salmon) + person(i - 1, j + .1, COL.conf));
  // plataforma de conocimiento
  const pi = i - 2.2, pj = j - 2.4;
  let pl = box(pi + .9, pj + .2, .2, .2, 10, '#6b7488') + box(pi, pj, 2.2, .2, 20, COL.navy, SH + 10);
  pl += poly([P(pi + .12, pj + .2, SH + 28), P(pi + 2.08, pj + .2, SH + 28), P(pi + 2.08, pj + .2, SH + 12), P(pi + .12, pj + .2, SH + 12)], '#e9f0f8');
  [0, 1, 2].forEach(r => { pl += poly([P(pi + .3, pj + .21, SH + 24 - r * 4.5), P(pi + 1.2 + (r % 2) * .5, pj + .21, SH + 24 - r * 4.5), P(pi + 1.2 + (r % 2) * .5, pj + .21, SH + 22 - r * 4.5), P(pi + .3, pj + .21, SH + 22 - r * 4.5)], r ? COL.insp : COL.salmon); });
  sc.add(pi + pj + 1, pl);
  [[i - 2.5, j + 2.4, 1], [i + 2.4, j + 2.6, 0], [i + 2.5, j - 2.6, 2]].forEach(([a, b, k]) => sc.add(a + b, tree(a, b, .95, k)));
  return sc.out();
}

/* decoración aleatoria (árboles y personas) en cada territorio */
function territoryDecor(key) {
  const z = ZONES[key], sc = new Scene();
  const sites = Object.entries(SITES).filter(([id]) => ({ 1: 'con', 2: 'sir', 3: 'cam' })[id[0]] === key).map(([, s]) => s);
  const nearDeck = (i, j) => DECKS.some(r => r.some((p, k) => {
    if (k === 0) return false; const a = r[k - 1];
    const minI = Math.min(a[0], p[0]) - 1.3, maxI = Math.max(a[0], p[0]) + 1.3, minJ = Math.min(a[1], p[1]) - 1.3, maxJ = Math.max(a[1], p[1]) + 1.3;
    return i > minI && i < maxI && j > minJ && j < maxJ;
  }));
  let placed = 0, tries = 0;
  const pts2 = [];
  while (placed < 22 && tries++ < 900) {
    const i = z.i + (rnd() - .5) * (z.n - 1.4), j = z.j + (rnd() - .5) * (z.n - 1.4);
    if (sites.some(s => Math.abs(s.i - i) < 3.6 && Math.abs(s.j - j) < 3.6)) continue;
    if (nearDeck(i, j) || pts2.some(p => Math.hypot(p[0] - i, p[1] - j) < 1.1)) continue;
    if (key === 'con' && i > 18 && i < 21 && j > 62) continue;
    pts2.push([i, j]);
    sc.add(i + j, placed % 4 === 3 ? person(i, j) : tree(i, j, .8 + rnd() * .35, Math.floor(rnd() * 3)));
    placed++;
  }
  return sc.out();
}
function decorIsles() {
  const sc = new Scene();
  DECOR_ISLES.forEach((c, k) => {
    sc.add(c.i + c.j, tree(c.i - .6, c.j - .4, .9, k % 3, ISLE_H) + tree(c.i + .7, c.j + .5, 1, (k + 1) % 3, ISLE_H) + (k % 2 ? tree(c.i - .9, c.j + 1, .75, 1, ISLE_H) : ''));
  });
  return sc.out();
}
function seaDecor() {
  let s = '';
  for (let k = 0; k < 70; k++) {
    const x = 80 + rnd() * (WORLD_W - 160), y = 120 + rnd() * (WORLD_H - 200);
    const [i, j] = [((x - OX) / WT + (y - OY) / WH) / 2, ((y - OY) / WH - (x - OX) / WT) / 2];
    if (onLand(i, j, 3)) continue;
    s += `<path class="wave" style="--dl:${(rnd() * 6).toFixed(1)}s" d="M${f(x)},${f(y)}q8,-5 16,0t16,0" stroke="#ffffff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".7"/>`;
  }
  s += boat(-2, 50, COL.mauve) + boat(70, 6, COL.conf);
  return s;
}

/* ---------- Ensamblaje ---------- */
const SITE_FN = { '1.1': s11, '1.2': s12, '1.3': s13, '2.1': s21, '2.2': s22, '3.1': s31, '3.2': s32 };
const ZONE_FN = { vision: visionScene };


function buildWorld() {
  const groups = [];
  Object.entries(ZONE_FN).forEach(([k, fn]) => groups.push({ g: k, d: ZONES[k].i + ZONES[k].j, svg: fn(ZONES[k]) }));
  ['con', 'sir', 'cam'].forEach(k => groups.push({ g: k, d: ZONES[k].i + ZONES[k].j - 20, svg: territoryDecor(k) }));
  Object.entries(SITE_FN).forEach(([id, fn]) => groups.push({ g: id, d: SITES[id].i + SITES[id].j, svg: fn(SITES[id]) + (id === '1.3' ? chapterIsles() : '') }));
  groups.sort((a, b) => a.d - b.d);

  // marcadores
  let pins = '';
  PROPOSALS.forEach(p => {
    const s = SITES[p.id], [x, y] = P(s.i, s.j, SH + 118), [, yb] = P(s.i, s.j, SH + 50);
    pins += `<g class="pin g" data-g="${p.id}" data-pin="${p.id}"><line x1="${f(x)}" y1="${f(y)}" x2="${f(x)}" y2="${f(yb)}" stroke="${PILLARS[p.pillar].c}" stroke-width="3" stroke-dasharray="3 5"/>`
      + `<circle class="pulse" cx="${f(x)}" cy="${f(y)}" r="27" fill="${PILLARS[p.pillar].c}"/><circle cx="${f(x)}" cy="${f(y)}" r="27" fill="${PILLARS[p.pillar].c}" stroke="#fff" stroke-width="4"/>`
      + `<text x="${f(x)}" y="${f(y + 7)}" text-anchor="middle" font-size="20" font-weight="800" fill="#fff">${p.id}</text></g>`;
  });
  // rótulos en el agua
  let labels = '';
  ['con', 'sir', 'cam'].forEach(k => {
    const z = ZONES[k], [x, y] = P(z.i + z.n / 2, z.j + z.n / 2, 0);
    labels += `<text class="tlabel g" data-g="${k}" x="${f(x)}" y="${f(y + 62)}" text-anchor="middle">${PILLARS[k].name.toUpperCase()}</text>`;
  });

  const svg = `<svg id="world" xmlns="http://www.w3.org/2000/svg" width="${WORLD_W}" height="${WORLD_H}" viewBox="0 0 ${WORLD_W} ${WORLD_H}" aria-hidden="true">
<defs>
  <radialGradient id="halo"><stop offset="0" stop-color="#ffe7a8" stop-opacity=".95"/><stop offset="1" stop-color="#ffe7a8" stop-opacity="0"/></radialGradient>
</defs>

<g class="sea">${seaDecor()}</g>
<g class="terrain">${terrain()}${decks()}</g>
<g class="labels">${labels}</g>
<g class="decor">${decorIsles()}</g>
<g class="objects">${groups.map(o => `<g class="g" data-g="${o.g}">${o.svg}</g>`).join('')}</g>
<g class="pins">${pins}</g>
</svg>`;
  return svg;
}

/* rectángulos de cámara (coordenadas del mundo) */
function worldRect(key) {
  const fromCenter = (c, r, top = 110) => { const [x, y] = P(c.i, c.j, SH); return { x: x - r * WT, y: y - r * WH - top, w: 2 * r * WT, h: 2 * r * WH + top + SH }; };
  if (key === 'all') { const top = fromCenter(ZONES.vision, ZONES.vision.n, 0).y - 260; return { x: 40, y: top, w: WORLD_W - 80, h: WORLD_H - 20 - top }; }
  if (key === 'core') { const a = fromCenter(ZONES.con, 15.5, 0), b = fromCenter(ZONES.cam, 15.5, 0), v = fromCenter(ZONES.vision, 12, 170); return { x: a.x, y: v.y, w: b.x + b.w - a.x, h: a.y + a.h + 90 - v.y }; }
  if (ZONES[key]) return fromCenter(ZONES[key], ZONES[key].n + .8, 170);
  if (key === '1.3') { // incluye las islas de otros capítulos y sus rutas
    const r = fromCenter(SITES[key], 6.6, 150), xs = CHAPTER_ISLES.map(c => P(c.i, c.j, 0));
    const x0 = Math.min(r.x, ...xs.map(p => p[0] - 100)), y1 = Math.max(r.y + r.h, ...xs.map(p => p[1] + 60));
    return { x: x0, y: r.y, w: r.x + r.w - x0, h: y1 - r.y };
  }
  if (SITES[key]) return fromCenter(SITES[key], 6.6, 150);
  return worldRect('all');
}
