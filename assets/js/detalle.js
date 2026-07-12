/*
 * Plantilla de detalle de proyecto compartida por proyectos/<slug>.html.
 * Lee document.body.dataset.slug, busca el proyecto en proyectos.json
 * y rellena el DOM de la página.
 */
(function () {
  var DATA_URL = '/assets/data/proyectos.json';

  var ESTADO_LABELS = {
    produccion: 'En producción',
    prototipo: 'Prototipo',
    'en-desarrollo': 'En desarrollo',
  };

  function el(id) {
    return document.getElementById(id);
  }

  function renderEstado(p) {
    var badge = el('detalle-estado');
    if (!badge) return;

    var label = ESTADO_LABELS[p.estado];
    if (label) {
      badge.textContent = label;
      badge.hidden = false;
    } else {
      badge.hidden = true;
    }
  }

  function renderActions(p) {
    var actions = el('detalle-actions');
    var html = '';

    if (p.demoUrl) {
      var isExternal = /^https?:\/\//.test(p.demoUrl);
      html +=
        '<a class="btn-go" href="' + p.demoUrl + '"' +
        (isExternal ? ' target="_blank" rel="noopener"' : '') +
        '>Ver demo en vivo</a>';
    }

    if (p.githubUrl) {
      html += '<a class="btn-secondary" href="' + p.githubUrl + '" target="_blank" rel="noopener"><i class="ti-github"></i> GitHub</a>';
    } else {
      html += '<span class="btn-secondary btn-disabled" title="Próximamente"><i class="ti-github"></i> GitHub</span>';
    }

    actions.innerHTML = html;
  }

  function initCarousel() {
    var slides = document.querySelectorAll('.slide');
    if (!slides.length) return;

    var slideIndex = 0;
    var prevBtn = document.querySelector('.carousel-btn.prev');
    var nextBtn = document.querySelector('.carousel-btn.next');
    var dotsWrap = el('detalle-dots');
    var dots = [];

    if (dotsWrap && slides.length > 1) {
      dotsWrap.innerHTML = Array.prototype.map
        .call(slides, function (_, i) {
          return '<button class="carousel-dot" data-index="' + i + '" aria-label="Ir a la imagen ' + (i + 1) + '"></button>';
        })
        .join('');
      dots = Array.prototype.slice.call(dotsWrap.querySelectorAll('.carousel-dot'));
    }

    function showSlide(index) {
      slides.forEach(function (s) { s.classList.remove('is-active'); });
      slides[index].classList.add('is-active');
      dots.forEach(function (d, i) { d.classList.toggle('is-active', i === index); });
    }

    if (slides.length <= 1) {
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
    } else {
      if (nextBtn) {
        nextBtn.onclick = function () {
          slideIndex = (slideIndex + 1) % slides.length;
          showSlide(slideIndex);
        };
      }
      if (prevBtn) {
        prevBtn.onclick = function () {
          slideIndex = (slideIndex - 1 + slides.length) % slides.length;
          showSlide(slideIndex);
        };
      }
      dots.forEach(function (d, i) {
        d.onclick = function () {
          slideIndex = i;
          showSlide(slideIndex);
        };
      });
    }

    showSlide(slideIndex);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var slug = document.body.dataset.slug;
    if (!slug) return;

    fetch(DATA_URL)
      .then(function (res) { return res.json(); })
      .then(function (proyectos) {
        var p = proyectos.find(function (item) { return item.slug === slug; });
        if (!p) {
          el('detalle-nombre').textContent = 'Proyecto no encontrado';
          return;
        }

        document.title = p.nombre + ' | Deyvi Zelada';
        var metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', p.tagline);

        document.documentElement.style.setProperty('--card-color', p.color);
        el('detalle-logo').src = p.logo;
        el('detalle-logo').alt = 'Logo de ' + p.nombre;
        el('detalle-nombre').textContent = p.nombre;
        el('detalle-tagline').textContent = p.tagline;
        el('detalle-descripcion').textContent = p.descripcion;

        renderEstado(p);

        el('detalle-modulos').innerHTML = p.modulos
          .map(function (m) { return '<li>' + m + '</li>'; })
          .join('');

        el('detalle-tech').innerHTML = p.tecnologias
          .map(function (t) { return '<span class="tech-tag">' + t + '</span>'; })
          .join('');

        var slides = p.imagenes && p.imagenes.length ? p.imagenes : [p.logo];
        el('detalle-slides').innerHTML = slides
          .map(function (src) { return '<img src="' + src + '" class="slide" alt="Captura de ' + p.nombre + '" />'; })
          .join('');

        renderActions(p);
        initCarousel();
      })
      .catch(function (err) {
        console.error('Error cargando proyectos.json', err);
      });
  });
})();
