// Animación simple: los eventos aparecen al hacer scroll
document.addEventListener("DOMContentLoaded", () => {
  const eventos = document.querySelectorAll(".evento");

  function revelar() {
    const trigger = window.innerHeight * 0.85;

    eventos.forEach(ev => {
      const top = ev.getBoundingClientRect().top;
      if (top < trigger) ev.classList.add("visible");
    });
  }

  window.addEventListener("scroll", revelar, { passive: true });
  revelar(); // ejecutar al cargar para mostrar lo que ya esté visible
});