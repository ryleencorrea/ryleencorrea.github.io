/* RIPPLE CANVAS */
function initLandingTiles() {
  const landing = document.querySelector('.landing');
  if (!landing) return;

  const COLORS = {
    A: ['#F15A29','#F9C12F','#FF9846','#F9C12F','#FFF5EE'],
    B: ['#FF5DD4','#F15A29','#F9C12F','#F15A29','#FFF5EE'],
    C: ['#F9C12F','#FF5DD4','#F15A29','#FF9846','#FFF5EE'],
    D: ['#FF9846','#F9C12F','#FF5DD4','#F9C12F','#FFF5EE'],
  };
  const GRID = [['A','B'],['C','D']];

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:0;border-radius:20px;';
  landing.prepend(canvas);
  landing.style.backgroundImage = 'none';
  const ctx = canvas.getContext('2d');

  let cells = [], W = 0, H = 0, TILE = 300, CELL = 150;

  function setup() {
    W = landing.offsetWidth;

    const ncols = Math.round(W / 300);
    TILE = W / ncols;
    CELL = TILE / 2;

    const nrows = Math.ceil(window.innerHeight / CELL);
    H = nrows * CELL;

    landing.style.minHeight = H + 'px';
    canvas.width = W;
    canvas.height = H;

    cells = [];
    for (let tr = 0; tr < nrows; tr++) {
      for (let tc = 0; tc < ncols; tc++) {
        for (let cr = 0; cr < 2; cr++) {
          for (let cc = 0; cc < 2; cc++) {
            const x  = Math.round(tc * TILE + cc * CELL);
            const y  = Math.round(tr * TILE + cr * CELL);
            const nx = Math.round(tc * TILE + (cc + 1) * CELL);
            const ny = Math.round(tr * TILE + (cr + 1) * CELL);
            cells.push({
              x, y,
              cw: nx - x,
              ch: ny - y,
              colors: COLORS[GRID[cr][cc]],
              rippleT: -Infinity,
            });
          }
        }
      }
    }
  }

  function scaledRR(rx, ry, rw, rh, radius, ccx, ccy, scale, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(ccx + (rx - ccx) * scale, ccy + (ry - ccy) * scale, rw * scale, rh * scale, radius * scale);
    ctx.fill();
  }

  function pulse(age, delay, maxScale) {
    const a = age - delay;
    if (a <= 0 || a > 2) return 1;
    return 1 + maxScale * Math.sin(Math.PI * a / 0.26) * Math.exp(-8 * a);
  }

  function drawCell(cell) {
    const { x, y, cw, ch, colors } = cell;
    const ccx = x + cw / 2, ccy = y + ch / 2;
    const age = (performance.now() - cell.rippleT) / 1000;

    const C = cw;
    const m1 = C * 0.07, s1 = C * 0.86, r1 = C * 0.22;
    const m2 = C * 0.18, s2 = C * 0.64, r2 = C * 0.15;
    const m3 = C * 0.31, s3 = C * 0.38, r3 = C * 0.09;
    const rc = C * 0.13;

    ctx.fillStyle = colors[0];
    ctx.fillRect(x, y, cw, ch);

    scaledRR(x + m1, y + m1, s1, s1, r1, ccx, ccy, pulse(age, 0.15, 0.07), colors[1]);
    scaledRR(x + m2, y + m2, s2, s2, r2, ccx, ccy, pulse(age, 0.08, 0.13), colors[2]);
    scaledRR(x + m3, y + m3, s3, s3, r3, ccx, ccy, pulse(age, 0.03, 0.22), colors[3]);
    const sc = pulse(age, 0, 0.32);
    ctx.fillStyle = colors[4];
    ctx.beginPath();
    ctx.arc(ccx, ccy, rc * sc, 0, Math.PI * 2);
    ctx.fill();
  }

  const COOLDOWN = 480;
  landing.addEventListener('mousemove', (e) => {
    const rect = landing.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const now = performance.now();
    cells.forEach(cell => {
      if (mx >= cell.x && mx < cell.x + cell.cw && my >= cell.y && my < cell.y + cell.ch) {
        if (now - cell.rippleT > COOLDOWN) cell.rippleT = now;
      }
    });
  });

  (function animate() {
    ctx.clearRect(0, 0, W, H);
    cells.forEach(drawCell);
    requestAnimationFrame(animate);
  })();

  setup();
  window.addEventListener('resize', setup);
}

document.addEventListener("DOMContentLoaded", () => {

  initLandingTiles();

  /* EXP PROJECT THUMBNAIL IMAGES */
  document.querySelectorAll('.exp-project-card').forEach(card => {
    const raw = (card.dataset.images || '').split(',')[0].trim().replace(/\\/g, '/');
    if (!raw) return;
    const thumb = card.querySelector('.exp-project-img');
    if (!thumb) return;
    const img = document.createElement('img');
    img.src = raw;
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:14px;display:block;';
    img.onerror = () => img.remove();
    thumb.appendChild(img);
  });

  /* NAV SCROLL */
  const nav = document.querySelector("nav");

  if (nav) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > window.innerHeight * 0.6) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }
    });
  }

  /* MOBILE MENU */
  const toggle = document.querySelector(".menu-toggle");
  const links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.onclick = () => {
      links.classList.toggle("active");
    };
  }

  /* SCROLL REVEAL */
  const reveals = document.querySelectorAll(".reveal");

  function revealOnScroll() {
    const trigger = window.innerHeight * 0.85;

    reveals.forEach(el => {
      if (el.getBoundingClientRect().top < trigger) {
        el.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll();

  /* BLOBS */
  const shape1 = document.querySelector(".floating-shape");
  const shape2 = document.querySelector(".floating-shape2");

  if (shape1 && shape2) {
    document.addEventListener("mousemove", (e) => {
      let x = e.clientX / window.innerWidth;
      let y = e.clientY / window.innerHeight;

      shape1.style.transform = `translate(${x * 50}px, ${y * 50}px)`;
      shape2.style.transform = `translate(${x * -50}px, ${y * -50}px)`;
    });
  }

/* DOTS */
const canvas = document.getElementById("dots");

if (canvas) {
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let dots = [];

  for (let i = 0; i < 180; i++) {
    dots.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      size: Math.random() * 4 + 2
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    dots.forEach(dot => {
      dot.x += dot.vx;
      dot.y += dot.vy;

      if (dot.x < 0 || dot.x > canvas.width) dot.vx *= -1;
      if (dot.y < 0 || dot.y > canvas.height) dot.vy *= -1;

      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* UNIFIED PROJECT MODAL */
const projModal = document.getElementById("proj-modal");
const projModalOrg = projModal.querySelector(".proj-modal-org");
const projModalTitle = projModal.querySelector(".proj-modal-title");
const projModalTabs = projModal.querySelector(".proj-modal-tabs");
const projModalImgWrap = projModal.querySelector(".proj-modal-img-wrap");
const projModalDesc = projModal.querySelector(".proj-modal-desc");
const projMetaRows = projModal.querySelector(".proj-meta-rows");
const projModalClose = projModal.querySelector(".proj-modal-close");

let pScale = 1, pPanX = 0, pPanY = 0, pDragging = false, pStartX = 0, pStartY = 0;

function applyTransform() {
  const el = projModalImgWrap.firstElementChild;
  if (el) el.style.transform = `translate(${pPanX}px,${pPanY}px) scale(${pScale})`;
}

function resetTransform() {
  pScale = 1; pPanX = 0; pPanY = 0;
  applyTransform();
}

projModalImgWrap.addEventListener("wheel", (e) => {
  e.preventDefault();
  pScale = Math.max(0.5, Math.min(6, pScale * (1 - e.deltaY * 0.001)));
  applyTransform();
}, { passive: false });

projModalImgWrap.addEventListener("mousedown", (e) => {
  pDragging = true;
  pStartX = e.clientX - pPanX;
  pStartY = e.clientY - pPanY;
});

window.addEventListener("mousemove", (e) => {
  if (!pDragging) return;
  pPanX = e.clientX - pStartX;
  pPanY = e.clientY - pStartY;
  applyTransform();
});

window.addEventListener("mouseup", () => pDragging = false);
projModalImgWrap.addEventListener("dblclick", resetTransform);

function openProjModal(opts) {
  projModalOrg.textContent = opts.org || "";
  projModalTitle.textContent = opts.title || "";
  projModalDesc.textContent = opts.caption || "";

  projMetaRows.innerHTML = "";
  (opts.meta || "").split("|").forEach(pair => {
    const [k, v] = pair.split(":");
    if (!k || !v) return;
    const row = document.createElement("div");
    row.className = "proj-meta-row";
    row.innerHTML = `<span class="proj-meta-key">${k.trim()}</span><span class="proj-meta-val">${v.trim()}</span>`;
    projMetaRows.appendChild(row);
  });

  const images = (opts.images || []).filter(Boolean);
  const labels = opts.imageLabels && opts.imageLabels.length === images.length
    ? opts.imageLabels
    : images.map((_, i) => `View ${i + 1}`);

  projModalTabs.innerHTML = "";

  function showSlide(i) {
    projModalImgWrap.innerHTML = "";
    resetTransform();
    if (images[i]) {
      const img = document.createElement("img");
      img.src = images[i];
      projModalImgWrap.appendChild(img);
    } else if (opts.color) {
      const block = document.createElement("div");
      block.className = "proj-color-block";
      block.style.background = opts.color;
      projModalImgWrap.appendChild(block);
    }
    projModalTabs.querySelectorAll(".proj-tab").forEach((t, ti) => t.classList.toggle("active", ti === i));
  }

  if (images.length > 1) {
    labels.forEach((label, i) => {
      const tab = document.createElement("button");
      tab.className = "proj-tab" + (i === 0 ? " active" : "");
      tab.textContent = label;
      tab.onclick = () => showSlide(i);
      projModalTabs.appendChild(tab);
    });
  }

  showSlide(0);
  projModal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeProjModal() {
  projModal.classList.remove("open");
  document.body.style.overflow = "";
}

projModalClose.onclick = closeProjModal;
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeProjModal(); });

document.querySelectorAll(".project-card").forEach(card => {
  card.addEventListener("click", () => {
    const images = card.dataset.images ? card.dataset.images.split(",").map(s => s.trim()).filter(Boolean) : [];
    const labels = card.dataset.imageLabels ? card.dataset.imageLabels.split(",").map(s => s.trim()) : [];
    openProjModal({
      title: card.dataset.title || card.querySelector(".overlay h3")?.textContent || "",
      org: card.dataset.org || "",
      images,
      imageLabels: labels,
      caption: card.dataset.caption || "",
      meta: card.dataset.meta || "",
    });
  });
});

document.querySelectorAll(".exp-project-card").forEach(card => {
  card.addEventListener("click", () => {
    const thumb = card.querySelector(".exp-project-img");
    const color = thumb ? getComputedStyle(thumb).backgroundColor : "";
    const images = card.dataset.images ? card.dataset.images.split(",").map(s => s.trim()).filter(Boolean) : [];
    const labels = card.dataset.imageLabels ? card.dataset.imageLabels.split(",").map(s => s.trim()) : [];
    openProjModal({
      title: card.querySelector(".exp-project-title")?.textContent || "",
      org: card.dataset.org || "",
      images,
      imageLabels: labels,
      caption: card.dataset.caption || "",
      meta: card.dataset.meta || "",
      color,
    });
  });
});
/* FLOATING BLOCKS */

const blocks = document.querySelectorAll(".bg-block");

let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 30;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 30;
});

blocks.forEach((block, index) => {

  const speed = (index % 5 + 1) * 0.18;

  const randomOffset = Math.random() * 1000;

  const isLetter = block.classList.contains('letter-block');

  function animate() {

    const time = Date.now() * 0.001;

    const amp = isLetter ? 8 : 20;

    /* ORGANIC FLOATING */
    const floatX =
      Math.sin(time * speed + randomOffset) * amp;

    const floatY =
      Math.cos(time * speed + randomOffset) * amp;

    const parallax = isLetter ? 0.06 : 0.15;

    /* MOUSE PARALLAX */
    const moveX = mouseX * (speed * parallax);
    const moveY = mouseY * (speed * parallax);

    block.style.transform = `
      translate(
        ${floatX + moveX}px,
        ${floatY + moveY}px
      )
    `;

    requestAnimationFrame(animate);
  }

  animate();

});
})