
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

let mx = -9999, my = -9999, lastMove = -1e9;
const ring = $('#ring');

/* ---------- Pointer ---------- */
addEventListener('pointermove', e => {
  mx = e.clientX; my = e.clientY; lastMove = performance.now();
  if (fine && !ring.classList.contains('on')) ring.classList.add('on');
}, { passive: true });
document.documentElement.addEventListener('mouseleave', () => { mx = my = -9999; ring.classList.remove('on'); });
if (fine) {
  document.addEventListener('pointerover', e => {
    ring.classList.toggle('big', !!e.target.closest('a,button,input:not([type=range]),.svc-btn'));
  });
}

/* ---------- Nav ---------- */
const nav = $('#nav');
const menu = $('#menu'), menuBtn = $('#menuBtn');
function setMenu(open) {
  menu.classList.toggle('open', open);
  document.body.classList.toggle('lock', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.textContent = open ? 'Close' : 'Menu';
  menu.inert = !open;
}
setMenu(false);
menuBtn.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
$$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
addEventListener('keydown', e => {
  if (e.key === 'Escape') { if (typeof closeCase === 'function' && $('#case').classList.contains('open')) closeCase(); else setMenu(false); }
  if (e.key === 'Tab' && $('#case').classList.contains('open')) {
    const f = $$('button,a[href],input', $('#case')).filter(x => x.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});
addEventListener('resize', () => { if (innerWidth > 820) setMenu(false); });

/* ---------- Variable-weight type field ---------- */
const MIN = 300, MAX = 800;
const fields = [];
function splitChars(el) {
  const text = el.textContent;
  el.textContent = '';
  const out = [];
  for (const ch of text) {
    if (ch === ' ') { el.appendChild(document.createTextNode(' ')); continue; }
    const s = document.createElement('span');
    s.className = 'ch'; s.textContent = ch; s.style.fontWeight = MIN;
    el.appendChild(s); out.push(s);
  }
  return out;
}
function createField(els, box) {
  const letters = els.flatMap(splitChars);
  const f = { box, letters, cur: letters.map(() => MIN), w: letters.map(() => MIN),
    centers: [], visible: true, t0: performance.now() + 700, bx: 0, by: 0, bw: 1, bh: 1, r: 200 };
  fields.push(f);
  new IntersectionObserver(es => es.forEach(e => { f.visible = e.isIntersecting; if (e.isIntersecting) measure(f); })).observe(box);
  return f;
}
function measure(f) {
  const b = f.box.getBoundingClientRect();
  f.bx = b.left + scrollX; f.by = b.top + scrollY; f.bw = b.width || 1; f.bh = b.height || 1;
  f.centers = f.letters.map(l => {
    const r = l.getBoundingClientRect();
    return { x: r.left + r.width / 2 + scrollX, y: r.top + r.height / 2 + scrollY };
  });
  f.r = clamp(innerWidth * 0.16, 120, 300);
}
if (!reduce) {
  createField($$('.hero [data-split]'), $('.hero h1'));
  createField([$('#wordmark')], $('#wordmark'));
  const remeasure = () => fields.forEach(measure);
  document.fonts.ready.then(() => { remeasure(); fields.forEach(f => f.t0 = performance.now() + 500); });
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(remeasure, 150); });
}
function tickFields(now) {
  const idle = now - lastMove > 2200;
  const px = mx + scrollX, py = my + scrollY;
  for (const f of fields) {
    if (!f.visible) continue;
    const ph = ((now - f.t0) % 5200 + 5200) % 5200 / 5200;
    const pos = -0.3 + ph * 2.2;
    for (let i = 0; i < f.letters.length; i++) {
      const c = f.centers[i]; if (!c) continue;
      let t = 0;
      if (!idle) {
        const d = Math.hypot(c.x - px, c.y - py);
        t = clamp(1 - d / f.r, 0, 1);
      } else {
        const n = (c.x - f.bx) / f.bw + ((c.y - f.by) / f.bh) * 0.25;
        t = clamp(1 - Math.abs(n - pos) / 0.2, 0, 1);
      }
      t = t * t * (3 - 2 * t);
      f.cur[i] += (MIN + (MAX - MIN) * t - f.cur[i]) * 0.14;
      const w = Math.round(f.cur[i]);
      if (w !== f.w[i]) { f.w[i] = w; f.letters[i].style.fontWeight = w; }
    }
  }
}

/* ---------- Statement reveal ---------- */
const st = $('.statement p');
const words = [];
st.textContent.trim().split(/\s+/).forEach((w, i, a) => {
  const s = document.createElement('span'); s.className = 'w'; s.textContent = w;
  if (i === 0) st.textContent = '';
  st.appendChild(s); words.push(s);
  if (i < a.length - 1) st.appendChild(document.createTextNode(' '));
});
let stCount = -1;
function updateStatement() {
  if (reduce) { words.forEach(w => w.classList.add('on')); return; }
  const r = st.getBoundingClientRect(), vh = innerHeight;
  const p = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.25), 0, 1);
  const count = Math.round(p * words.length);
  if (count === stCount) return;
  stCount = count;
  words.forEach((w, i) => w.classList.toggle('on', i < count));
}

/* ---------- Services accordion ---------- */
const svcs = $$('.svc');
function setSvc(svc, open) {
  svc.classList.toggle('open', open);
  $('.svc-btn', svc).setAttribute('aria-expanded', String(open));
  $('.panel > div', svc).inert = !open;
}
svcs.forEach(svc => {
  setSvc(svc, svc.classList.contains('open'));
  $('.svc-btn', svc).addEventListener('click', () => {
    const open = !svc.classList.contains('open');
    svcs.forEach(s => setSvc(s, false));
    setSvc(svc, open);
  });
});

/* ---------- Marquee (speed and direction follow scroll) ---------- */
const track = $('.track'), group = $('.group');
const clone = group.cloneNode(true); clone.setAttribute('aria-hidden', 'true'); track.appendChild(clone);
let half = 0, mpos = 0, dir = -1, marqueeVisible = true;
const calcHalf = () => { half = track.scrollWidth / 2; };
document.fonts.ready.then(calcHalf); addEventListener('resize', calcHalf); calcHalf();
new IntersectionObserver(es => es.forEach(e => marqueeVisible = e.isIntersecting)).observe($('.marquee'));
let vel = 0, lastSY = scrollY;
function tickMarquee() {
  if (!marqueeVisible || !half) return;
  if (Math.abs(vel) > 0.4) dir = vel > 0 ? -1 : 1;
  mpos += dir * (0.7 + Math.min(Math.abs(vel), 60) * 0.35);
  if (mpos <= -half) mpos += half;
  if (mpos > 0) mpos -= half;
  track.style.transform = `translate3d(${mpos}px,0,0)`;
}

/* ---------- Project data ----------
   cover: optional image for each project (a data: URI, or a path if you host the file).
   Leave it empty to use the generated artwork. */
   
const PROJECTS = [
  { title: 'Moonbeam', client: 'Moonbeam Bulawayo', year: '2026', kind: 'Website, Enquiries Intake', services: 'Web Design & Development', timeline: '1-2 weeks', need: 'creative website', cover: './images/moonbeam.png', url: 'https://moonbeam.co.zw',
    brief: 'Client needed a way to keep people updated on activities and events, and away to recieve enquiries.',
    results: [[ '','A clean custom website'], ['Content update', 'Setup Sanity CMS for headless updates']],
    tags: ['Astro.js', 'CSS', 'Sanity'] },

  { title: 'NPFF', client: 'NPFF STUDIO', year: '2026', kind: 'Website', services: 'Web Design & Development', timeline: '1-2 weeks', need: 'creative website', cover: './images/npff.png', url: 'https://npff.dk',
    brief: 'Client wanted a website that expresses creative freedom and brand independecy',
    results: [['', 'Creative Website'], ['', 'Content Management'], ['', 'Artist Profile Pages']],
    tags: ['Astro.js', 'CSS', 'Sanity'] },


  { title: 'Peridot', client: 'The Peridot Collective', year: '2026', kind: 'SAAS, Marketplace', services: 'Fullstack development, CI/CD pipeline, custom development', timeline: '2 months', need: 'custom development', cover: './images/peridot.png', url: 'https://peridotcollective.co.zw',
    brief: 'A platform connectin events industy businesses to customers',
    results: [['', 'dashboard'], ['', 'business listing'], ['', 'built in planning tools'],['', 'B2B exchange board']],
    tags: ['Node.js', 'Next.js', 'Docker', 'TypeScript', 'BackBlaze'] },

];

/* ---------- Work preview ---------- */
let uid = 0;
const C = { a: '#2338ff', k: '#000', s: '#e9ecff', w: '#fff' };
const wrap = inner => `<svg viewBox="0 0 300 380" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;
const arts = [
  () => {
    const h = [90, 140, 110, 200, 160, 250, 190, 300, 230];
    const bars = h.map((v, i) => `<rect x="${22 + i * 29}" y="${350 - v}" width="19" height="${v}" fill="${i === 7 ? C.a : C.k}"/>`).join('');
    const pts = h.map((v, i) => `${31 + i * 29},${338 - v}`).join(' ');
    return wrap(`<rect width="300" height="380" fill="${C.s}"/>${bars}<polyline points="${pts}" fill="none" stroke="${C.a}" stroke-width="3"/>`);
  },
  () => wrap(`<rect width="300" height="380" fill="${C.a}"/>` +
    [150, 118, 86, 54, 22].map((r, i) => `<circle cx="150" cy="190" r="${r}" fill="${i % 2 ? C.a : C.k}"/>`).join('') +
    `<circle cx="150" cy="190" r="8" fill="#fff"/>`),
  () => {
    const R = [[20,20,120,160,C.a],[150,20,130,70,C.w],[150,100,60,80,C.s],[220,100,60,80,C.a],[20,190,260,50,C.w],[20,250,80,110,C.s],[110,250,170,110,C.a]];
    return wrap(`<rect width="300" height="380" fill="${C.k}"/>` + R.map(r => `<rect x="${r[0]}" y="${r[1]}" width="${r[2]}" height="${r[3]}" fill="${r[4]}"/>`).join(''));
  },
  () => {
    const id = 'st' + (uid++);
    return wrap(`<defs><pattern id="${id}" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="11" height="22" fill="${C.a}"/></pattern></defs>` +
      `<rect width="300" height="380" fill="#fff"/><rect width="300" height="380" fill="url(#${id})"/><circle cx="150" cy="190" r="86" fill="${C.k}"/>`);
  },
  () => {
    let d = '';
    for (let j = 0; j < 12; j++) for (let i = 0; i < 10; i++) {
      const hl = (i * 3 + j * 5) % 11 === 0;
      d += `<circle cx="${25 + i * 28.9}" cy="${28 + j * 29}" r="${hl ? 7 : 4.5}" fill="${hl ? C.a : '#fff'}"${hl ? '' : ' opacity=".3"'}/>`;
    }
    return wrap(`<rect width="300" height="380" fill="${C.k}"/>${d}`);
  }
];
const coverHTML = i => (PROJECTS[i] && PROJECTS[i].cover)
  ? `<img src="${PROJECTS[i].cover}" alt="" style="width:100%;height:100%;object-fit:cover;display:block">`
  : arts[i]();

const coverPlate = i => (PROJECTS[i] && PROJECTS[i].cover)
  ? `<image href="${PROJECTS[i].cover}" x="0" y="0" width="140" height="140" preserveAspectRatio="xMidYMid slice"/>`
  : arts[i]().replace('<svg ', '<svg x="0" y="0" width="140" height="140" ');
const peek = $('#peek'), list = $('#workList'), rows = $$('.row', list);
const layers = arts.map((fn, i) => { const d = document.createElement('div'); d.className = 'art'; d.innerHTML = coverHTML(i); peek.appendChild(d); return d; });
rows.forEach((row, i) => {
  $('.thumb', row).innerHTML = coverHTML(i);
  row.addEventListener('pointerenter', () => layers.forEach((l, j) => l.classList.toggle('on', j === i)));
  row.addEventListener('click', e => { e.preventDefault(); openCase(i, row); });
});
let peekOn = false, qx = 0, qy = 0, rot = 0, sc = 0.6;
if (fine) {
  list.addEventListener('pointerenter', () => { peekOn = true; qx = mx; qy = my; peek.classList.add('show'); ring.classList.add('off'); });
  list.addEventListener('pointerleave', () => { peekOn = false; peek.classList.remove('show'); ring.classList.remove('off'); });
}
function tickPeek() {
  if (!fine) return;
  qx += (mx - qx) * 0.14; qy += (my - qy) * 0.14;
  rot += (clamp((mx - qx) * 0.06, -10, 10) - rot) * 0.2;
  sc += ((peekOn ? 1 : 0.6) - sc) * 0.18;
  peek.style.transform = `translate3d(${qx}px,${qy}px,0) translate(-50%,-50%) rotate(${rot}deg) scale(${sc})`;
}

/* ---------- Decomposition engine ---------- */
const INK = '#000', ACC = '#2338ff';
const PAT = {
  rows: () => [100, 72, 90, 56, 80].map((w, i) => `<rect x="20" y="${20 + i * 22}" width="${w}" height="8" rx="2" fill="${i === 0 ? ACC : INK}"/>`).join(''),
  grid: () => { let o = ''; for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { const on = [1, 6, 11, 12].includes(r * 4 + c); o += `<rect x="${17 + c * 28}" y="${17 + r * 28}" width="22" height="22" rx="3" fill="${on ? ACC : 'none'}" stroke="${INK}" stroke-width="1.5"/>`; } return o; },
  nodes: () => { const P = [[30,35],[75,25],[112,62],[55,82],[98,112],[28,108]], E = [[0,1],[1,2],[0,3],[3,2],[3,4],[3,5]];
    return E.map(([a, b]) => `<line x1="${P[a][0]}" y1="${P[a][1]}" x2="${P[b][0]}" y2="${P[b][1]}" stroke="${INK}" stroke-width="1.5"/>`).join('') +
      P.map((q, i) => `<circle cx="${q[0]}" cy="${q[1]}" r="8" fill="${i % 3 === 1 ? ACC : '#fff'}" stroke="${INK}" stroke-width="1.5"/>`).join(''); },
  bars: () => [30, 55, 40, 80, 60, 95].map((h, i) => `<rect x="${18 + i * 19}" y="${122 - h}" width="12" height="${h}" fill="${i === 5 ? ACC : INK}"/>`).join('') + `<line x1="12" y1="124" x2="130" y2="124" stroke="${INK}" stroke-width="1.5"/>`,
  circles: () => `<circle cx="70" cy="70" r="52" fill="none" stroke="${INK}" stroke-width="1.5"/><circle cx="70" cy="70" r="36" fill="none" stroke="${INK}" stroke-width="1.5"/><circle cx="70" cy="70" r="20" fill="none" stroke="${INK}" stroke-width="1.5"/><circle cx="70" cy="70" r="8" fill="${ACC}"/><circle cx="106" cy="34" r="5" fill="${INK}"/>`,
  blocks: () => `<rect x="16" y="16" width="108" height="20" rx="3" fill="none" stroke="${INK}" stroke-width="1.5"/><rect x="16" y="44" width="50" height="80" rx="3" fill="#dfe3ff" stroke="${INK}" stroke-width="1.5"/><rect x="74" y="44" width="50" height="36" rx="3" fill="none" stroke="${INK}" stroke-width="1.5"/><rect x="74" y="88" width="50" height="36" rx="3" fill="${ACC}"/>`,
  records: () => [0, 1, 2, 3, 4].map(i => `<rect x="18" y="${16 + i * 24}" width="104" height="16" rx="4" fill="${i === 1 ? '#dfe3ff' : 'none'}" stroke="${INK}" stroke-width="1.5"/><circle cx="30" cy="${24 + i * 24}" r="3.5" fill="${i === 1 ? ACC : INK}"/><line x1="42" y1="${24 + i * 24}" x2="${70 + ((i * 23) % 40)}" y2="${24 + i * 24}" stroke="${INK}" stroke-width="1.5"/>`).join(''),
  pulse: () => `<line x1="12" y1="70" x2="128" y2="70" stroke="${INK}" stroke-width="1" stroke-dasharray="2 4"/><polyline points="12,70 40,70 52,34 66,106 80,70 128,70" fill="none" stroke="${ACC}" stroke-width="3" stroke-linejoin="round"/>`,
  shield: () => `<path d="M70 14 L118 32 V72 C118 100 96 120 70 128 C44 120 22 100 22 72 V32 Z" fill="none" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round"/><polyline points="46,70 64,88 96,52" fill="none" stroke="${ACC}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`,
  chat: () => `<rect x="16" y="20" width="84" height="30" rx="8" fill="none" stroke="${INK}" stroke-width="1.5"/><rect x="40" y="62" width="84" height="30" rx="8" fill="${ACC}"/><rect x="16" y="104" width="58" height="22" rx="8" fill="none" stroke="${INK}" stroke-width="1.5"/>`,
  servers: () => [0, 1, 2].map(i => `<rect x="18" y="${18 + i * 38}" width="104" height="28" rx="5" fill="none" stroke="${INK}" stroke-width="1.5"/><circle cx="34" cy="${32 + i * 38}" r="4" fill="${i === 0 ? ACC : INK}"/><line x1="50" y1="${32 + i * 38}" x2="108" y2="${32 + i * 38}" stroke="${INK}" stroke-width="1.5"${i === 1 ? '' : ' stroke-dasharray="2 5"'}/>`).join(''),
  code: () => [[20,18,60],[36,36,80],[36,54,50],[20,72,40],[36,90,70],[20,108,30]].map((r, i) => `<rect x="${r[0]}" y="${r[1]}" width="${r[2]}" height="8" rx="2" fill="${i === 1 || i === 4 ? ACC : INK}"/>`).join(''),
  link: () => `<rect x="14" y="22" width="112" height="96" rx="6" fill="none" stroke="${INK}" stroke-width="1.5"/><line x1="14" y1="42" x2="126" y2="42" stroke="${INK}" stroke-width="1.5"/><circle cx="26" cy="32" r="3" fill="${ACC}"/><circle cx="37" cy="32" r="3" fill="${INK}"/><circle cx="48" cy="32" r="3" fill="${INK}"/><line x1="50" y1="100" x2="92" y2="58" stroke="${ACC}" stroke-width="4" stroke-linecap="round"/><polyline points="70,58 92,58 92,80" fill="none" stroke="${ACC}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`,
  map: () => `<line x1="14" y1="46" x2="126" y2="46" stroke="${INK}" stroke-width="1" stroke-dasharray="2 4"/><line x1="14" y1="96" x2="126" y2="96" stroke="${INK}" stroke-width="1" stroke-dasharray="2 4"/><polyline points="20,112 50,72 85,86 120,28" fill="none" stroke="${ACC}" stroke-width="3" stroke-linejoin="round"/><circle cx="20" cy="112" r="8" fill="#fff" stroke="${INK}" stroke-width="1.5"/><circle cx="120" cy="28" r="8" fill="${INK}"/><circle cx="85" cy="86" r="4" fill="${INK}"/>`
};

const T = 10, S = 140, HW = S * 0.866025, PIV = 75;
const decomps = [];

function buildDecomp(cfg) {
  const el = document.createElement('article');
  el.className = 'decomp';
  el.innerHTML = `
    <div class="d-info">
      ${cfg.num ? `<b class="d-num">${cfg.num}</b>` : ''}
      <h3>${cfg.title}</h3>
      <p class="d-sum">${cfg.summary}</p>
      <div class="d-ctl">
        <input class="slider" type="range" min="0" max="100" value="0" step="1" aria-label="${cfg.aria}">
        <span class="readout" aria-hidden="true">Drag to Expand</span>
      </div>
      ${cfg.out ? `<p class="d-out"><strong>You get</strong> ${cfg.out}</p>` : ''}
    </div>
    <div class="stage"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true"></svg><div class="labs"></div></div>`;
  const n = cfg.layers.length;
  const stage = $('.stage', el), svg = $('svg', stage), labsWrap = $('.labs', stage);
  let inner = '<line class="axis"/>';
  for (let k = n - 1; k >= 0; k--) {
    inner += `<g class="plate" data-k="${k}"><polygon class="sl" points="${-HW},${S / 2} 0,${S} 0,${S + T} ${-HW},${S / 2 + T}"/><polygon class="sr" points="0,${S} ${HW},${S / 2} ${HW},${S / 2 + T} 0,${S + T}"/><polygon class="top" points="0,0 ${HW},${S / 2} 0,${S} ${-HW},${S / 2}"/><g class="pat" transform="matrix(.866025 .5 -.866025 .5 0 0)">${cfg.layers[k].html || PAT[cfg.layers[k].p]()}</g></g>`;
  }
  for (let k = 0; k < n; k++) inner += `<line class="lead" data-k="${k}"/><circle class="dot" data-k="${k}" r="3.5"/>`;
  svg.innerHTML = inner;
  labsWrap.innerHTML = cfg.layers.map((l, k) => `<div class="lab" data-k="${k}"><b>${l.t}</b><div class="ld">${l.d}</div></div>`).join('');

  const d = {
    el, stage, svg, n, sp: cfg.sp || {}, down: !!cfg.down, cur: 0, target: 0, dirty: true, touched: false, mode: null, geo: null, len: 0, shown: -1,
    slider: $('.slider', el), readout: $('.readout', el), axis: $('.axis', svg),
    plates: [], leads: [], dots: [], labEls: []
  };
  for (let k = 0; k < n; k++) {
    d.plates[k] = $(`.plate[data-k="${k}"]`, svg);
    d.leads[k] = $(`.lead[data-k="${k}"]`, svg);
    d.dots[k] = $(`.dot[data-k="${k}"]`, svg);
    d.labEls[k] = $(`.lab[data-k="${k}"]`, labsWrap);
    const on = v => { d.plates[k].classList.toggle('hl', v); d.labEls[k].classList.toggle('hl', v); };
    d.plates[k].addEventListener('pointerenter', () => on(true));
    d.plates[k].addEventListener('pointerleave', () => on(false));
    d.labEls[k].addEventListener('pointerenter', () => on(true));
    d.labEls[k].addEventListener('pointerleave', () => on(false));
  }
  d.slider.addEventListener('input', () => { d.touched = true; setD(d, +d.slider.value); });
  stage.addEventListener('click', e => {
    if (e.target.closest('.lab')) return;
    d.touched = true; setD(d, d.target > 0.5 ? 0 : 100);
  });
  layoutD(d, 'wide');
  d.lastW = 0; d.raf = 0;
  d.ro = new ResizeObserver(es => {
    const w = es[0].contentRect.width;
    if (!w || w === d.lastW) return; /* height changes (from aspect-ratio) are ignored */
    d.lastW = w;
    const m = w >= 600 ? 'wide' : 'narrow';
    if (m === d.mode) return;
    cancelAnimationFrame(d.raf);
    d.raf = requestAnimationFrame(() => layoutD(d, m)); /* apply outside the observer callback */
  });
  d.ro.observe(stage);
  decomps.push(d);
  return d;
}
function setD(d, v) {
  d.slider.value = v;
  d.slider.style.setProperty('--p', v + '%');
  d.target = v / 100;
  if (reduce) { d.cur = d.target; }
  d.dirty = true;
}
function destroyD(d) {
  d.ro.disconnect();
  cancelAnimationFrame(d.raf);
  const i = decomps.indexOf(d); if (i > -1) decomps.splice(i, 1);
}
function layoutD(d, mode) {
  d.mode = mode;
  const n = d.n;
  const g = mode === 'wide' ? { W: 700, cx: 190, lx: 380, sp: d.sp.wide || 80 } : { W: 600, cx: 140, lx: 310, sp: d.sp.narrow || 170 };
  g.H = 230 + (n - 1) * g.sp; g.y0 = g.H - 190;
  d.geo = g;
  d.svg.setAttribute('viewBox', `0 0 ${g.W} ${g.H}`);
  d.stage.style.aspectRatio = `${g.W} / ${g.H}`;
  d.labEls.forEach(l => { l.style.left = (g.lx / g.W * 100) + '%'; l.style.width = ((g.W - g.lx) / g.W * 100) + '%'; });
  const x1 = g.cx + HW + 7, x2 = g.lx - 8;
  d.len = x2 - x1;
  d.leads.forEach(ln => { ln.setAttribute('x1', x1); ln.setAttribute('x2', x2); ln.setAttribute('stroke-dasharray', d.len); });
  d.dots.forEach(c => c.setAttribute('cx', g.cx + HW));
  d.axis.setAttribute('x1', g.cx); d.axis.setAttribute('x2', g.cx);
  d.dirty = true;
}
function renderD(d) {
  const g = d.geo, n = d.n, t = d.cur;
  const sp = T + t * (g.sp - T);
  const top = g.H - 190 - (n - 1) * g.sp; /* y of the top plate when fully spread (upward mode) */
  let count = 0;
  for (let k = 0; k < n; k++) {
    /* upward: bottom plate fixed, others lift off. downward: top plate fixed, others drop away. */
    const yt = d.down ? top + k * sp : g.y0 - (n - 1 - k) * sp, yc = yt + PIV;
    d.plates[k].setAttribute('transform', `translate(${g.cx} ${yt})`);
    const r = clamp((t - (0.08 + k * 0.72 / n)) / 0.2, 0, 1);
    if (r >= 0.5) count++;
    const lab = d.labEls[k];
    lab.style.top = (yc / g.H * 100) + '%';
    lab.style.opacity = r;
    lab.style.transform = `translate(${(r - 1) * 14}px,-50%)`;
    const off = r <= 0.6;
    if (lab.inert !== off) lab.inert = off;
    d.leads[k].setAttribute('y1', yc); d.leads[k].setAttribute('y2', yc);
    d.leads[k].setAttribute('stroke-dashoffset', d.len * (1 - r));
    d.dots[k].setAttribute('cy', yc); d.dots[k].style.opacity = r;
  }
  if (d.down) {
    d.axis.setAttribute('y1', top + S / 2 - 18);
    d.axis.setAttribute('y2', top + (n - 1) * sp + S / 2);
  } else {
    d.axis.setAttribute('y1', g.y0 - (n - 1) * sp + S / 2 - 18);
    d.axis.setAttribute('y2', g.y0 + S / 2);
  }
  d.axis.style.opacity = t * 0.7;
  if (count !== d.shown) {
    d.shown = count;
    const txt = t < 0.02 ? 'Drag to Expand' : count >= n ? `All ${n} layers` : `${count} of ${n} layers`;
    d.readout.textContent = txt;
    d.slider.setAttribute('aria-valuetext', count === 0 ? 'Assembled' : count >= n ? `Fully expand, ${n} layers` : `${count} of ${n} layers shown`);
  }
}
function tickDecomps() {
  for (const d of decomps) {
    const diff = d.target - d.cur;
    if (Math.abs(diff) > 0.0004) { d.cur += reduce ? diff : diff * 0.12; d.dirty = true; }
    else if (d.cur !== d.target) { d.cur = d.target; d.dirty = true; }
    if (d.dirty) { d.dirty = false; renderD(d); }
  }
}

/* ---------- Process steps ---------- */
const STEPS = [
  { title: 'Discovery', summary: 'We learn how your business works and agree what success looks like.', out: 'A one-page brief with goals, scope, risks and a plan.',
    layers: [
      { t: 'Stakeholder interviews', d: 'We talk to your team to learn how the business really works.', p: 'chat' },
      { t: 'User research', d: 'Short sessions with the people who will use the product.', p: 'circles' },
      { t: 'System audit', d: 'A review of existing code, tools and data to decide what stays.', p: 'grid' },
      { t: 'Goals and scope', d: 'Success measures and a plan you can sign off.', p: 'bars' }] },
  { title: 'Design', summary: 'We shape the product on screen and test it before we build it.', out: 'Tested prototypes and a design system ready for development.',
    layers: [
      { t: 'Flows', d: 'Journeys and screens mapped before anything is drawn.', p: 'nodes' },
      { t: 'Prototype', d: 'Clickable screens you can test with real users.', p: 'blocks' },
      { t: 'Design system', d: 'Reusable components that keep the build consistent.', p: 'grid' },
      { t: 'Usability tests', d: 'Findings from real sessions go straight back into the design.', p: 'rows' }] },
  { title: 'Build', summary: 'We build in two-week sprints and show working software each time.', out: 'Working software every two weeks, with tests and documentation.',
    layers: [
      { t: 'Interface', d: 'Fast, accessible screens built from the design system.', p: 'blocks' },
      { t: 'API and logic', d: 'Business rules behind a documented, versioned API.', p: 'code' },
      { t: 'Data', d: 'A database designed around the questions you will ask.', p: 'records' },
      { t: 'Infrastructure', d: 'Cloud setup with automated deploys and backups.', p: 'servers' }] },
  { title: 'Run', summary: 'We launch, monitor and keep improving, with a named engineer.', out: 'A monthly report and a roadmap that keeps moving.',
    layers: [
      { t: 'Monitoring', d: 'Alerts on speed, errors and uptime before users notice.', p: 'pulse' },
      { t: 'Security patches', d: 'Servers and dependencies kept up to date.', p: 'shield' },
      { t: 'Support', d: 'A named engineer who replies within an agreed time.', p: 'chat' },
      { t: 'Improvements', d: 'A monthly review of data to decide what to build next.', p: 'bars' }] }
];
STEPS.forEach((st, i) => {
  const d = buildDecomp({ num: i + 1, title: st.title, summary: st.summary, out: st.out, aria: `Decompose the ${st.title} stage`, layers: st.layers });
  $('#decomps').appendChild(d.el);
});
/* One-time hint on the first row */
if (!reduce) {
  const first = decomps[0];
  const hintIO = new IntersectionObserver(es => {
    if (!es[0].isIntersecting) return;
    hintIO.disconnect();
    setTimeout(() => { if (!first.touched) setD(first, 32); }, 500);
    setTimeout(() => { if (!first.touched) setD(first, 0); }, 1900);
  }, { threshold: 0.6 });
  hintIO.observe(first.el);
}

/* ---------- Case studies ---------- */
const caseEl = $('#case'), caseBody = $('#caseBody'), caseCount = $('#caseCount'), caseClose = $('#caseClose');
const pageParts = [$('#nav'), $('main'), $('footer.foot')];
let caseD = null, caseTrigger = null;
function preselect(need) {
  $$('.chip[data-need]').forEach(c => c.setAttribute('aria-pressed', String(c.dataset.need === need)));
}
function renderCase(i) {
  const p = PROJECTS[i], next = PROJECTS[(i + 1) % PROJECTS.length];
  if (caseD) { destroyD(caseD); caseD = null; }
  caseBody.innerHTML = `
    <header class="case-head">
      <h2 id="caseTitle">${p.title}</h2>
      <dl class="meta">
        <div><dt>Client</dt><dd>${p.client}</dd></div>
        <div><dt>Year</dt><dd>${p.year}</dd></div>
        <div><dt>Services</dt><dd>${p.services}</dd></div>
        <div><dt>Timeline</dt><dd>${p.timeline}</dd></div>
      </dl>
    </header>
    <div class="case-decomp"></div>
    <div class="built"><h3>Built with</h3><ul class="tags">${p.tags.map(t => `<li>${t}</li>`).join('')}</ul></div>
    <footer class="case-foot">
      <button type="button" class="next"><small>Next project</small><strong>${next.title}</strong></button>
      <a class="btn" href="#contact" id="caseCta">Start something similar</a>
    </footer>`;
  caseD = buildDecomp({
    title: 'Take it apart',
    summary: 'Slide to open the project layer by layer: the cover, the case study, the results and a link to the live project.',
    aria: `Decompose the ${p.title} cover`,
    down: true,
    sp: { wide: 118, narrow: 210 },
    layers: [
      { t: 'The project', d: `${p.client}. ${p.kind}, ${p.year}.`, html: coverPlate(i) },
      { t: 'Case study', d: p.brief, p: 'rows' },
      { t: 'What we achieved', d: `<ul class="ach">${p.results.map(r => `<li><b>${r[0]}</b> ${r[1]}</li>`).join('')}</ul>`, p: 'bars' },
      { t: 'Live project', d: `<a href="${p.url}" target="_blank" rel="noopener">Visit the project</a>`, p: 'link' }
    ]
  });
  $('.case-decomp', caseBody).appendChild(caseD.el);
  caseCount.textContent = `${i + 1} of ${PROJECTS.length}`;
  caseEl.scrollTop = 0;
  $('.next', caseBody).addEventListener('click', () => renderCase((i + 1) % PROJECTS.length));
  $('#caseCta', caseBody).addEventListener('click', e => {
    e.preventDefault(); preselect(p.need); closeCase(false);
    $('#contact').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  });
}
function openCase(i, trigger) {
  caseTrigger = trigger;
  renderCase(i);
  pageParts.forEach(x => x.inert = true);
  caseEl.classList.add('open'); caseEl.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lock');
  peekOn = false; peek.classList.remove('show'); ring.classList.remove('off');
  caseClose.focus({ preventScroll: true });
}
function closeCase(restore = true) {
  if (!caseEl.classList.contains('open')) return;
  caseEl.classList.remove('open'); caseEl.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lock');
  pageParts.forEach(x => x.inert = false);
  if (restore && caseTrigger) caseTrigger.focus({ preventScroll: true });
  const dead = caseD; caseD = null;
  setTimeout(() => { if (dead) destroyD(dead); if (!caseD) caseBody.innerHTML = ''; }, 750);
}
caseClose.addEventListener('click', () => closeCase());

/* ---------- Cursor ring ---------- */
let rx = -100, ry = -100;
function tickRing() {
  if (!fine) return;
  rx += (mx - rx) * 0.2; ry += (my - ry) * 0.2;
  ring.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%)`;
}

/* ---------- Magnetic buttons ---------- */
if (fine && !reduce) {
  $$('.magnetic').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px,${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}

/* ---------- Brief form ---------- */
const form = $('#brief'), statusEl = $('#status');
const needs = $$('.chip[data-need]', form), whens = $$('.chip[data-when]', form);
needs.forEach(c => c.addEventListener('click', () => c.setAttribute('aria-pressed', String(c.getAttribute('aria-pressed') !== 'true'))));
whens.forEach(c => c.addEventListener('click', () => {
  const was = c.getAttribute('aria-pressed') === 'true';
  whens.forEach(x => x.setAttribute('aria-pressed', 'false'));
  c.setAttribute('aria-pressed', String(!was));
}));
const say = (msg, err, focusEl) => { statusEl.textContent = msg; statusEl.classList.toggle('err', !!err); if (focusEl) focusEl.focus(); };
const joinList = a => a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1];

const ACCESS_KEY = '0c05b545-2e62-4372-8215-30d004b848e8';

form.addEventListener('submit', async e => {
  e.preventDefault();
  const name = $('#name').value.trim(), email = $('#email').value.trim();
  const n = needs.filter(c => c.getAttribute('aria-pressed') === 'true').map(c => c.dataset.need);
  const w = (whens.find(c => c.getAttribute('aria-pressed') === 'true') || {}).dataset;
  if (!n.length) return say('Pick at least one thing you need help with.', true, needs[0]);
  if (!/^\S+@\S+\.\S+$/.test(email)) return say('Add an email address so we can reply.', true, $('#email'));

  const btn = form.querySelector('button[type=submit]');
  btn.disabled = true;
  say('Sending your brief');
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: ACCESS_KEY,
        subject: `New project: ${joinList(n)}`,
        from_name: name || 'Website visitor',
        name,
        email,
        needs: joinList(n),
        start: w ? w.when : 'Not specified',
        botcheck: $('#botcheck').checked
      })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    say('Thanks, your brief is sent. We will reply within a few hours.');
    form.reset();
    $$('.chip').forEach(c => c.setAttribute('aria-pressed', 'false'));
  } catch (err) {
    say('Something went wrong. Please email info@kiaat.cloud instead.', true);
  } finally {
    btn.disabled = false;
  }
});

$('#toTop').addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));

/* ---------- Main loop ---------- */
let lastStY = -1;
function frame(now) {
  const sy = scrollY;
  vel += ((sy - lastSY) - vel) * 0.2; lastSY = sy;
  nav.classList.toggle('scrolled', sy > 10);
  if (sy !== lastStY) { lastStY = sy; updateStatement(); }
  if (!reduce) { tickFields(now); tickMarquee(); }
  tickDecomps();
  tickRing(); tickPeek();
  requestAnimationFrame(frame);
}
updateStatement();
requestAnimationFrame(frame);
addEventListener('resize', () => { stCount = -1; updateStatement(); });
})();
