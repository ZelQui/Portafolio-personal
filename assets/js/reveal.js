/*
 * Animación de aparición al hacer scroll (.reveal).
 * Expone window.initReveal(root) para que otros scripts (p.ej. proyectos.js)
 * puedan observar elementos insertados dinámicamente después de la carga inicial.
 */
(function (global) {
  function initReveal(root) {
    root = root || document;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    root.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initReveal(document);
  });

  global.initReveal = initReveal;
})(window);
