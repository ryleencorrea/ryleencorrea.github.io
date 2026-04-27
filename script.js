const shape1 = document.querySelector(".floating-shape");
const shape2 = document.querySelector(".floating-shape2");

document.addEventListener("mousemove", (e) => {
  let x = e.clientX / window.innerWidth;
  let y = e.clientY / window.innerHeight;

  shape1.style.transform = `translate(${x * 50}px, ${y * 50}px)`;
  shape2.style.transform = `translate(${x * -50}px, ${y * -50}px)`;
});