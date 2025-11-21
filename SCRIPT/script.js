// app.js — Script único e integrado (pegar entero, cargar con defer)

// Activar iconos Lucide (si lo usas)
if (typeof lucide !== "undefined" && lucide.createIcons) {
  lucide.createIcons();
}

document.addEventListener("DOMContentLoaded", () => {

  // -----------------------------
  // MENÚ RESPONSIVE (si existe)
  // -----------------------------
  try {
    const toggle = document.querySelector('.mi-nav-menu-toggle');
    const navMenu = document.querySelector('.mi-nav-menu');
    const icon = toggle ? toggle.querySelector('i') : null;

    if (toggle && navMenu) {
      toggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        toggle.classList.toggle('rotate');

        if (icon) {
          const isOpen = navMenu.classList.contains('active');
          icon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
          if (typeof lucide !== "undefined" && lucide.createIcons) lucide.createIcons();
        }
      });
    }
  } catch (err) {
    console.error("Error inicializando menú:", err);
  }

  // -----------------------------
  // SLIDER DE TURISMO - TODOS LOS SLIDERS
  // -----------------------------
  try {
    const sliders = document.querySelectorAll('.slider');
    sliders.forEach((slider, idx) => {
      const sliderList = slider.querySelector('.list');
      const thumbnail = slider.querySelector('.thumbnail');
      // Preferir botones dentro del slider; si no, buscar globalmente
      let nextBtn = slider.querySelector('.next') || document.querySelector('.next');
      let prevBtn = slider.querySelector('.prev') || document.querySelector('.prev');

      if (!sliderList) {
        console.warn(`Slider #${idx}: falta .list — se omite este slider.`);
        return;
      }
      if (!nextBtn || !prevBtn) {
        console.warn(`Slider #${idx}: faltan botones .next/.prev — se omite este slider.`);
        return;
      }

      // Evitar multiples bindings: clonamos si hay listeners previos potenciales
      nextBtn = nextBtn.cloneNode(true);
      prevBtn = prevBtn.cloneNode(true);

      // Si los botones estaban fuera del slider y ya existían clones, reemplaza en el DOM
      // (esto solo reemplaza la instancia encontrada dentro del slider o en el documento)
      const parentNext = slider.querySelector('.next') ? slider.querySelector('.next').parentNode : document.querySelector('.next')?.parentNode;
      const parentPrev = slider.querySelector('.prev') ? slider.querySelector('.prev').parentNode : document.querySelector('.prev')?.parentNode;
      if (parentNext && parentNext.contains(slider.querySelector('.next'))) {
        parentNext.replaceChild(nextBtn, slider.querySelector('.next'));
      } else if (document.querySelector('.next') && parentNext) {
        parentNext.replaceChild(nextBtn, document.querySelector('.next'));
      }
      if (parentPrev && parentPrev.contains(slider.querySelector('.prev'))) {
        parentPrev.replaceChild(prevBtn, slider.querySelector('.prev'));
      } else if (document.querySelector('.prev') && parentPrev) {
        parentPrev.replaceChild(prevBtn, document.querySelector('.prev'));
      }

      // Reasignar referencias (ya que clonamos/reemplazamos)
      nextBtn = slider.querySelector('.next') || document.querySelector('.next');
      prevBtn = slider.querySelector('.prev') || document.querySelector('.prev');

      // Inicial sync thumbnails (si existen)
      if (thumbnail && thumbnail.children.length > 0) {
        // opcional: mover primer thumbnail al final para sincronizar
        // thumbnail.appendChild(thumbnail.children[0]);
      }

      function moveSlider(direction) {
        const sliderItems = sliderList.querySelectorAll('.item');
        const thumbItems = thumbnail ? thumbnail.querySelectorAll('.item') : [];

        if (sliderItems.length === 0) return;

        if (direction === "next") {
          sliderList.appendChild(sliderItems[0]);
          if (thumbnail && thumbItems.length) thumbnail.appendChild(thumbItems[0]);
          slider.classList.add('next');
        } else {
          sliderList.prepend(sliderItems[sliderItems.length - 1]);
          if (thumbnail && thumbItems.length) thumbnail.prepend(thumbItems[thumbItems.length - 1]);
          slider.classList.add('prev');
        }

        // Quitar clases tras la animación o con fallback
        const onAnim = () => {
          slider.classList.remove('next', 'prev');
          slider.removeEventListener('animationend', onAnim);
        };
        slider.addEventListener('animationend', onAnim, { once: true });
        setTimeout(() => slider.classList.remove('next', 'prev'), 700);
      }

      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // importante: que no burbujee a handlers globales
        moveSlider('next');
      });

      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        moveSlider('prev');
      });

    }); // end sliders.forEach
  } catch (err) {
    console.error("Error inicializando sliders:", err);
  }

  // -----------------------------
  // MODALES "VER MÁS" (MODAL-CUSTOM)
  // -----------------------------
  try {
    const verMasBtns = document.querySelectorAll('[data-modal]');
    const modales = document.querySelectorAll('.modal-custom');

    verMasBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // evita colisiones con handlers globales
        const id = btn.dataset.modal;
        const modal = document.getElementById(id);
        if (modal) {
          modal.classList.add('show');
        } else {
          console.warn('No se encontró modal con id:', id);
        }
      });
    });

    modales.forEach(modal => {
      // Cerrar con botón X (si existe)
      const closeBtn = modal.querySelector('.close-modal');
      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          modal.classList.remove('show');
        });
      }

      // Cerrar cuando se haga click en el fondo del modal (target === modal)
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('show');
        }
      });
    });

  } catch (err) {
    console.error("Error inicializando modales 'ver más':", err);
  }

  // -----------------------------
  // TARJETAS HABLANTES (SPEECH)
  // -----------------------------
  try {
    let selectedVoice = null;
    function loadVoices() {
      const voices = speechSynthesis.getVoices();
      selectedVoice = voices.find(v =>
        v.name.toLowerCase().includes("google") &&
        v.lang.toLowerCase().startsWith("es")
      ) || voices.find(v => v.lang && v.lang.startsWith('es')) || null;
    }
    // Cargar voces
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;

    const tarjetas = document.querySelectorAll(".card[data-text]");
    tarjetas.forEach(card => {
      let hablando = false;
      let utterance = null;

      card.addEventListener('click', (e) => {
        e.stopPropagation();
        const texto = card.dataset.text;
        if (!texto) return;

        if (hablando) {
          speechSynthesis.cancel();
          hablando = false;
          return;
        }

        speechSynthesis.cancel();
        utterance = new SpeechSynthesisUtterance(texto);
        if (selectedVoice) utterance.voice = selectedVoice;
        utterance.lang = "es-ES";
        utterance.onend = () => { hablando = false; };
        hablando = true;
        setTimeout(() => speechSynthesis.speak(utterance), 60);
      });
    });

  } catch (err) {
    console.error("Error inicializando tarjetas hablantes:", err);
  }

}); // end DOMContentLoaded
