/*
 * Scroll controlado a anclas del home (#about, #proyectos...).
 *
 * Sin esto, volver desde una página de detalle con "#proyectos" en la URL
 * dispara el salto nativo del navegador ANTES de que el navbar sticky y el
 * contenido dinámico (proyectos.json, fuentes web) terminen de cargar; en
 * cuanto el layout se asienta, el navegador "corrige" con un segundo salto
 * brusco. Aquí se bloquea el scroll en 0 hasta que todo esté listo y se
 * hace un único desplazamiento suave, restando la altura real del navbar.
 */
(function () {
  function navbarHeight() {
    var nav = document.querySelector('.navbar');
    return nav ? nav.getBoundingClientRect().height : 0;
  }

  function scrollToTarget(hash) {
    var target = hash && document.querySelector(hash);
    if (!target) return;
    var top = target.getBoundingClientRect().top + window.scrollY - navbarHeight() - 16;
    window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
  }

  window.scrollToTarget = scrollToTarget;

  // Clicks en el navbar dentro de la misma página (Inicio / Acerca de mí / Mis proyectos)
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.navbar .nav-link[href*="#"]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        var hash = this.hash;
        if (!hash || !document.querySelector(hash)) return;
        event.preventDefault();
        scrollToTarget(hash);
        history.pushState(null, '', hash);
      });
    });
  });

  // Llegada desde otra página con hash en la URL (p.ej. volver desde un detalle)
  var initialHash = window.location.hash;
  if (!initialHash) return;

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  var locked = true;
  function holdAtTop() {
    if (locked) window.scrollTo(0, 0);
  }
  window.scrollTo(0, 0);
  window.addEventListener('scroll', holdAtTop, { passive: true });

  function release() {
    if (!locked) return;
    locked = false;
    window.removeEventListener('scroll', holdAtTop);
    scrollToTarget(initialHash);
  }

  // proyectos.js llama a esto cuando termina de pintar las tarjetas (y las fuentes cargaron)
  window.__releaseAnchorLock = release;

  // Red de seguridad: si nada libera el bloqueo, no dejar a el usuario atrapado arriba
  document.addEventListener('DOMContentLoaded', function () {
    setTimeout(release, 4000);
  });
})();
