// Imports

import $ from "jquery";
import "bootstrap";
import "metismenu";

// Expose jQuery globally so legacy scripts (toastr, sweetalert, etc.) can find it
window.$ = window.jQuery = $;

// ── Smart positioning global de dropdowns ────────────────────────────────────
// Posiciona cualquier .dropdown-menu usando position:fixed contra el viewport.
// Funciona para ch__actions, tpl-select, y cualquier dropdown de la app.
// Anula inset + transform que Popper.js inyecta, usando setProperty !important.
// El menú abre abajo si hay espacio; si no, flipa hacia arriba automáticamente.
(function () {
  var GAP = 4;

  function applyDropdownPosition(toggle) {
    var dropdown = toggle.closest('.dropdown');
    if (!dropdown) return;
    var menu = dropdown.querySelector('.dropdown-menu');
    if (!menu || !menu.classList.contains('show')) return;

    var rect = toggle.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      setTimeout(function () { applyDropdownPosition(toggle); }, 50);
      return;
    }

    var menuH      = menu.scrollHeight;
    var spaceBelow = window.innerHeight - rect.bottom - GAP;
    var spaceAbove = rect.top - GAP;
    var goUp       = spaceBelow < Math.min(menuH, 260) && spaceAbove > spaceBelow;

    // Ancho del menú:
    // - tpl-select → mismo ancho que el trigger (campo de formulario)
    // - otros (icon btn, etc.) → ancho intrínseco del contenido
    var isSelectTrigger = !!toggle.closest('.tpl-select');
    if (!isSelectTrigger) {
      // Forzar max-content antes de medir para evitar que el menú herede
      // el ancho del contenedor (e.g. tabla, toolbar) en vez del contenido real
      menu.style.setProperty('width', 'max-content', 'important');
    }
    var menuW = isSelectTrigger
      ? rect.width
      : Math.max(menu.scrollWidth || 0, menu.offsetWidth || 0, 160);

    // Alineación horizontal: derecha si tiene .dropdown-menu-right o si está en ch__actions
    var alignRight = menu.classList.contains('dropdown-menu-right')
                  || !!toggle.closest('.ch__actions');
    var left = alignRight
      ? Math.max(8, Math.min(rect.right - menuW, window.innerWidth - menuW - 8))
      : Math.max(8, Math.min(rect.left,          window.innerWidth - menuW - 8));

    var sp = function (p, v) { menu.style.setProperty(p, v, 'important'); };
    sp('position',  'fixed');
    sp('z-index',   '9999');
    sp('width',     menuW + 'px');   // fuerza el ancho correcto (evita width:100% del viewport)
    sp('min-width', '160px');
    sp('left',      left + 'px');
    sp('right',     'auto');
    sp('transform', 'none');
    sp('inset',     'unset');

    if (goUp) {
      sp('top',    'auto');
      sp('bottom', (window.innerHeight - rect.top + GAP) + 'px');
      menu.setAttribute('x-placement', 'top-start');
    } else {
      sp('top',    (rect.bottom + GAP) + 'px');
      sp('bottom', 'auto');
      menu.setAttribute('x-placement', 'bottom-start');
    }
  }

  // Ejecutar después de que Bootstrap + Popper terminen su propio render
  $(document).on('shown.bs.dropdown', function (e) {
    var toggle = e.relatedTarget;
    if (!toggle) return;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        applyDropdownPosition(toggle);
        setTimeout(function () { applyDropdownPosition(toggle); }, 100);
      });
    });
  });

  // Limpiar estilos inline al cerrar para que el próximo open parta limpio
  $(document).on('hidden.bs.dropdown', function (e) {
    var menu = e.target.querySelector('.dropdown-menu');
    if (menu) {
      menu.removeAttribute('style');
      menu.removeAttribute('x-placement');
    }
  });

  // Reposicionar si scrollea o redimensiona con el menú abierto
  $(window).on('scroll.smartDropdown resize.smartDropdown', function () {
    var open = document.querySelector('[data-toggle="dropdown"][aria-expanded="true"]');
    if (open) applyDropdownPosition(open);
  });
}());

// Stylesheets

import "./assets/base.scss";

$(document).ready(() => {
  // Sidebar Menu

  setTimeout(function () {
    $(".vertical-nav-menu").metisMenu();
  }, 100);

  // Search wrapper trigger

  $(".search-icon").click(function () {
    $(this).parent().parent().addClass("active");
  });

  $(".search-wrapper .close").click(function () {
    $(this).parent().removeClass("active");
  });

  // BS4 Popover

  $('[data-toggle="popover-custom-content"]').each(function (i, obj) {
    $(this).popover({
      html: true,
      placement: "auto",
      template:
        '<div class="popover popover-custom" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',
      content: function () {
        var id = $(this).attr("popover-id");
        return $("#popover-content-" + id).html();
      },
    });
  });

  // Stop Bootstrap 4 Dropdown for closing on click inside

  $(".dropdown-menu").on("click", function (event) {
    var events = $._data(document, "events") || {};
    events = events.click || [];
    for (var i = 0; i < events.length; i++) {
      if (events[i].selector) {
        if ($(event.target).is(events[i].selector)) {
          events[i].handler.call(event.target, event);
        }

        $(event.target)
          .parents(events[i].selector)
          .each(function () {
            events[i].handler.call(this, event);
          });
      }
    }
    event.stopPropagation(); //Always stop propagation
  });

  $('[data-toggle="popover-custom-bg"]').each(function (i, obj) {
    var popClass = $(this).attr("data-bg-class");

    $(this).popover({
      trigger: "focus",
      placement: "top",
      template:
        '<div class="popover popover-bg ' +
        popClass +
        '" role="tooltip"><h3 class="popover-header"></h3><div class="popover-body"></div></div>',
    });
  });

  $(function () {
    $('[data-toggle="popover"]').popover();
  });

  $('[data-toggle="popover-custom"]').each(function (i, obj) {
    $(this).popover({
      html: true,
      container: $(this).parent().find(".rm-max-width"),
      content: function () {
        return $(this)
          .next(".rm-max-width")
          .find(".popover-custom-content")
          .html();
      },
    });
  });

  $("body").on("click", function (e) {
    $('[rel="popover-focus"]').each(function () {
      if (
        !$(this).is(e.target) &&
        $(this).has(e.target).length === 0 &&
        $(".popover").has(e.target).length === 0
      ) {
        $(this).popover("hide");
      }
    });
  });

  $(".header-megamenu.nav > li > .nav-link").on("click", function (e) {
    $('[data-toggle="popover-custom"]').each(function () {
      if (
        !$(this).is(e.target) &&
        $(this).has(e.target).length === 0 &&
        $(".popover").has(e.target).length === 0
      ) {
        $(this).popover("hide");
      }
    });
  });

  // BS4 Tooltips

  $(function () {
    $('[data-toggle="tooltip"]').tooltip();
  });

  $(function () {
    $('[data-toggle="tooltip-light"]').tooltip({
      template:
        '<div class="tooltip tooltip-light"><div class="tooltip-inner"></div></div>',
    });
  });

  // Drawer

  $(".open-right-drawer").click(function () {
    $(this).addClass("is-active");
    $(".app-drawer-wrapper").addClass("drawer-open");
    $(".app-drawer-overlay").removeClass("d-none");
  });

  $(".drawer-nav-btn").click(function () {
    $(".app-drawer-wrapper").removeClass("drawer-open");
    $(".app-drawer-overlay").addClass("d-none");
    $(".open-right-drawer").removeClass("is-active");
  });

  $(".app-drawer-overlay").click(function () {
    $(this).addClass("d-none");
    $(".app-drawer-wrapper").removeClass("drawer-open");
    $(".open-right-drawer").removeClass("is-active");
  });

  $(".mobile-toggle-nav").click(function () {
    $(this).toggleClass("is-active");
    $(".app-container").toggleClass("sidebar-mobile-open");
  });

  $(".mobile-toggle-header-nav").click(function () {
    $(this).toggleClass("active");
    $(".app-header__content").toggleClass("header-mobile-open");
  });

  $(".mobile-app-menu-btn").click(function () {
    $(".hamburger", this).toggleClass("is-active");
    $(".app-inner-layout").toggleClass("open-mobile-menu");
  });

  // ── Sticky-col: overflow + scroll state ──────────────────────────────────────
  // --scrollable: el contenido es más ancho que el wrapper (sticky activo)
  // --scrolled:   el wrapper tiene scrollLeft > 0 (sombra visible)
  var checkTableOverflow = function () {
    document.querySelectorAll('.tpl-table__wrapper').forEach(function (wrapper) {
      var table = wrapper.closest('.tpl-table');
      if (!table) return;
      var hasOverflow = wrapper.scrollWidth > wrapper.clientWidth + 1;
      var hasScrolled = wrapper.scrollLeft > 0;
      table.classList.toggle('tpl-table--scrollable', hasOverflow);
      table.classList.toggle('tpl-table--scrolled', hasScrolled);
    });
  };

  // Escuchar scroll en cada wrapper para actualizar la sombra en tiempo real
  document.querySelectorAll('.tpl-table__wrapper').forEach(function (wrapper) {
    wrapper.addEventListener('scroll', checkTableOverflow, { passive: true });
  });

  checkTableOverflow();
  $(window).on('resize.tableOverflow', checkTableOverflow);

  // ── Bootstrap Table — Sort ────────────────────────────────────────────────
  // Clic en .tpl-table__sort-btn → ordena las filas del <tbody> más cercano.
  // Ciclo: neutral → asc → desc → asc…
  $(document).on('click', '.tpl-table__sort-btn', function () {
    var $btn   = $(this);
    var $th    = $btn.closest('th');
    var $thead = $th.closest('thead');
    var $tbody = $thead.closest('table').find('tbody');
    var colIndex = $th.index();

    var wasAsc = $btn.hasClass('tpl-table__sort-btn--asc');

    // Resetear todos los botones del thead
    $thead.find('.tpl-table__sort-btn').each(function () {
      $(this).removeClass('tpl-table__sort-btn--asc tpl-table__sort-btn--desc');
      $(this).find('.material-symbols-rounded').text('swap_vert');
    });

    if (wasAsc) {
      $btn.addClass('tpl-table__sort-btn--desc');
      $btn.find('.material-symbols-rounded').text('arrow_downward');
    } else {
      $btn.addClass('tpl-table__sort-btn--asc');
      $btn.find('.material-symbols-rounded').text('arrow_upward');
    }

    var dir = wasAsc ? -1 : 1;

    var sorted = $tbody.find('tr').toArray().sort(function (a, b) {
      var aText = $(a).children('td').eq(colIndex).text().trim().toLowerCase();
      var bText = $(b).children('td').eq(colIndex).text().trim().toLowerCase();
      var aNum  = parseFloat(aText);
      var bNum  = parseFloat(bText);
      if (!isNaN(aNum) && !isNaN(bNum)) return (aNum - bNum) * dir;
      return aText.localeCompare(bText, 'es') * dir;
    });
    $tbody.append(sorted);
  });

  // ── Bootstrap Table — Select-all checkbox ─────────────────────────────────
  // Soporta cualquier id que empiece con "bs-select-all" (una por tabla)
  $(document).on('change', '[id^="bs-select-all"]', function () {
    var checked = this.checked;
    $(this).closest('table').find('tbody input[type="checkbox"]').prop('checked', checked);
  });

  $(document).on('change', 'tbody input[type="checkbox"]', function () {
    var $table  = $(this).closest('table');
    var $all    = $table.find('tbody input[type="checkbox"]');
    var total   = $all.length;
    var checked = $all.filter(':checked').length;
    var $master = $table.find('[id^="bs-select-all"]')[0];
    if ($master) {
      $master.checked       = checked === total;
      $master.indeterminate = checked > 0 && checked < total;
    }
  });

  // ── Flex Table — Sort ─────────────────────────────────────────────────────
  // Clic en .te-hcell__sort → ordena las filas de datos del .tpl-table__wrapper.
  // Ciclo de estados: neutral (swap_vert) → asc (arrow_upward) → desc (arrow_downward) → asc…
  $(document).on('click', '.te-hcell__sort', function () {
    var $btn    = $(this);
    var $hcell  = $btn.closest('.te-hcell');
    var $header = $hcell.closest('.tpl-flex-table__row');
    var $wrapper = $header.closest('.tpl-table__wrapper');
    var colIndex = $header.children('.te-hcell').index($hcell);

    var wasAsc  = $btn.hasClass('te-hcell__sort--asc');

    // Resetear todos los botones de este header
    $header.find('.te-hcell__sort').each(function () {
      $(this).removeClass('te-hcell__sort--asc te-hcell__sort--desc');
      $(this).find('.material-symbols-rounded').text('swap_vert');
    });

    // Aplicar nuevo estado
    if (wasAsc) {
      $btn.addClass('te-hcell__sort--desc');
      $btn.find('.material-symbols-rounded').text('arrow_downward');
    } else {
      $btn.addClass('te-hcell__sort--asc');
      $btn.find('.material-symbols-rounded').text('arrow_upward');
    }

    var dir = wasAsc ? -1 : 1;

    // Ordenar filas de datos (todas menos el header)
    var $rows = $wrapper.find('.tpl-flex-table__row').not(':first-child');
    var sorted = $rows.toArray().sort(function (a, b) {
      var aText = $(a).children().eq(colIndex).text().trim().toLowerCase();
      var bText = $(b).children().eq(colIndex).text().trim().toLowerCase();
      // Intentar orden numérico si ambos son números
      var aNum = parseFloat(aText);
      var bNum = parseFloat(bText);
      if (!isNaN(aNum) && !isNaN(bNum)) return (aNum - bNum) * dir;
      return aText.localeCompare(bText, 'es') * dir;
    });
    $wrapper.append(sorted);
  });

  // ── Flex Table — Select-all checkbox ─────────────────────────────────────
  // El checkbox #flex-select-all marca/desmarca todos los .te-cell__checkbox
  // de las filas de datos. Actualiza su estado indeterminate cuando hay selección parcial.
  $(document).on('change', '#flex-select-all', function () {
    var checked  = this.checked;
    var $wrapper = $(this).closest('.tpl-table__wrapper');
    $wrapper.find('.tpl-flex-table__row').not(':first-child')
      .find('.te-cell__checkbox').prop('checked', checked);
  });

  $(document).on('change', '.tpl-flex-table__row:not(:first-child) .te-cell__checkbox', function () {
    var $wrapper  = $(this).closest('.tpl-table__wrapper');
    var $all      = $wrapper.find('.tpl-flex-table__row').not(':first-child').find('.te-cell__checkbox');
    var total     = $all.length;
    var checked   = $all.filter(':checked').length;
    var $master   = $wrapper.find('#flex-select-all')[0];
    if ($master) {
      $master.checked       = checked === total;
      $master.indeterminate = checked > 0 && checked < total;
    }
  });

  // ── Rol activo en el top nav ──────────────────────────────────────────────
  // Detecta la página actual y actualiza .app-header__user-role para que
  // refleje el rol seleccionado al navegar entre vistas.
  (function () {
    var roleMap = {
      'index.html':                      'Administrador',
      'dashboards-home-docente.html':    'Docente',
      'dashboards-home-preceptor.html':  'Preceptor',
    };
    var page = window.location.pathname.split('/').pop() || 'index.html';
    var role = roleMap[page] || 'Responsable';
    var el = document.querySelector('.app-header__user-role');
    if (el) el.textContent = role;
  })();

  // Responsive

  var resizeClass = function () {
    var win = document.body.clientWidth;
    if (win < 1250) {
      $(".app-container").addClass("closed-sidebar-mobile closed-sidebar");
      // Sidebar colapsada → hamburger muestra ≡ (no is-active = "click para abrir")
      $(".close-sidebar-btn").removeClass("is-active");
    } else {
      $(".app-container").removeClass("closed-sidebar-mobile closed-sidebar");
      // Sidebar visible → hamburger muestra X (is-active = "click para cerrar")
      $(".close-sidebar-btn").addClass("is-active");
    }
  };

  $(window).on("resize", function () {
    resizeClass();
  });

  resizeClass();
});
