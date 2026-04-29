/* NAV SCROLL EFFECT */
const nav = document.querySelector("nav");

window.addEventListener("scroll", () => {
  if (window.scrollY > window.innerHeight * 0.6) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
});

/* FLOATING BLOBS FOLLOW MOUSE */
const shape1 = document.querySelector(".floating-shape");
const shape2 = document.querySelector(".floating-shape2");

document.addEventListener("mousemove", (e) => {
  let x = e.clientX / window.innerWidth;
  let y = e.clientY / window.innerHeight;

  shape1.style.transform = `translate(${x * 50}px, ${y * 50}px)`;
  shape2.style.transform = `translate(${x * -50}px, ${y * -50}px)`;
});

/* DOTS BACKGROUND */
const canvas = document.getElementById("dots");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let dots = [];

for (let i = 0; i < 60; i++) {
  dots.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: Math.random() - 0.5,
    vy: Math.random() - 0.5
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  dots.forEach(dot => {
    dot.x += dot.vx;
    dot.y += dot.vy;

    ctx.beginPath();
    ctx.arc(dot.x, dot.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fill();
  });

  requestAnimationFrame(animate);
}

animate();

/* MODAL IMAGE */
const cards = document.querySelectorAll(".project-card");
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const closeBtn = document.getElementById("close");

cards.forEach(card => {
  card.addEventListener("click", () => {
    const img = card.querySelector("img");
    modal.style.display = "flex";
    modalImg.src = img.src;
  });
});

closeBtn.onclick = () => modal.style.display = "none";