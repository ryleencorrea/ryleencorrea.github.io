document.addEventListener("DOMContentLoaded", () => {

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

/* CAROUSEL */
const cards = document.querySelectorAll(".project-card");
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const modalCaption = document.getElementById("modal-caption");

const closeBtn = document.getElementById("close");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

let images = [];
let index = 0;
let currentCaption = "";

cards.forEach(card => {
  card.addEventListener("click", () => {

    images = card.dataset.images.split(",").map(img => img.trim());

    currentCaption = card.dataset.caption || "";

    index = 0;

    modal.style.display = "flex";

    modalImg.src = images[index];
    modalCaption.textContent = currentCaption;
  });
});

nextBtn.onclick = () => {
  index = (index + 1) % images.length;
  modalImg.src = images[index];
};

prevBtn.onclick = () => {
  index = (index - 1 + images.length) % images.length;
  modalImg.src = images[index];
};

closeBtn.onclick = () => {
  modal.style.display = "none";
};

modal.onclick = (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
};
/* FLOATING BLOCKS */

const blocks = document.querySelectorAll(".bg-block");

let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5);
  mouseY = (e.clientY / window.innerHeight - 0.5);
});

blocks.forEach((block, index) => {

  const speed = (index % 6 + 1) * 6;

  let offsetX = 0;
  let offsetY = 0;

  function animateBlock() {

    offsetX += (mouseX * speed - offsetX) * 0.05;
    offsetY += (mouseY * speed - offsetY) * 0.05;

    block.style.transform = `
      translate(${offsetX}px, ${offsetY}px)
    `;

    requestAnimationFrame(animateBlock);
  }

  animateBlock();

});
})