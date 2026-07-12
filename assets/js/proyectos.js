/*
 * Renderiza el grid de proyectos del home a partir de assets/data/proyectos.json.
 * Agregar o editar un proyecto solo requiere tocar el JSON, no este archivo.
 */
(function () {
  var DATA_URL = '/assets/data/proyectos.json';

  function techTag(tech) {
    return '<span class="tech-tag">' + tech + '</span>';
  }

  function projectCard(p) {
    return (
      '<div class="project-card reveal" id="card-' + p.slug + '" style="--card-color: ' + p.color + ';">' +
        '<div class="content">' +
          '<div class="project-logo"><img src="' + p.logo + '" alt="Logo de ' + p.nombre + '" /></div>' +
          '<h3 class="project-name">' + p.nombre + '</h3>' +
          '<p class="project-description">' + p.tagline + '</p>' +
          '<div class="project-tech">' + p.tecnologias.map(techTag).join('') + '</div>' +
        '</div>' +
        '<div class="project-actions">' +
          '<a class="btn-action btn-detail" href="/proyectos/' + p.slug + '.html">' +
            '<i class="ti-info-alt"></i> Ver detalle' +
          '</a>' +
        '</div>' +
      '</div>'
    );
  }

  function upcomingCard(p) {
    return (
      '<div class="project-card upcoming-card reveal" id="card-upcoming">' +
        '<div class="content">' +
          '<div class="upcoming-icon-wrapper"><div class="plus-icon">+</div></div>' +
          '<h3 class="project-name">' + p.nombre + '</h3>' +
          '<p class="project-description">' + p.descripcion + '</p>' +
          '<div class="status-badge">En desarrollo</div>' +
        '</div>' +
      '</div>'
    );
  }

  function releaseAnchorLock() {
    if (!window.__releaseAnchorLock) return;
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(window.__releaseAnchorLock);
    } else {
      window.__releaseAnchorLock();
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var grid = document.getElementById('projects-grid');
    if (!grid) return;

    fetch(DATA_URL)
      .then(function (res) { return res.json(); })
      .then(function (proyectos) {
        grid.innerHTML = proyectos
          .map(function (p) { return p.proximamente ? upcomingCard(p) : projectCard(p); })
          .join('');
        window.initReveal(grid);
        releaseAnchorLock();
      })
      .catch(function (err) {
        grid.innerHTML = '<p class="text-center text-danger w-100">No se pudieron cargar los proyectos.</p>';
        console.error('Error cargando proyectos.json', err);
        releaseAnchorLock();
      });
  });
})();
