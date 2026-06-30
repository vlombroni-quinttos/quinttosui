/* Desempeño Actitudinal — interactive logic */
(function () {
  'use strict';

  // ── Data ────────────────────────────────────────────────────────────────────
  var ratingOptions = [
    { value: '', label: '-' },
    { value: '1', label: '1' }, { value: '2', label: '2' },
    { value: '3', label: '3' }, { value: '4', label: '4' },
    { value: '5', label: '5' },
    { value: 'S', label: 'S' }, { value: 'MB', label: 'MB' },
    { value: 'B', label: 'B' }, { value: 'R', label: 'R' }
  ];

  var belgranoOptions = [
    { value: '', label: 'Seleccione...' },
    { value: 'S', label: 'Satisfactorio (S)' },
    { value: 'MB', label: 'Muy Bueno (MB)' },
    { value: 'B', label: 'Bueno (B)' },
    { value: 'R', label: 'Regular (R)' }
  ];

  var evalLabels = [
    'Cumple con las normas de convivencia escolar',
    'Demuestra respeto hacia compañeros y docentes',
    'Participa activamente en clase',
    'Trabaja en equipo de manera colaborativa',
    'Cuida el material y las instalaciones del colegio',
    'Demuestra responsabilidad en sus tareas y compromisos',
    'Mantiene una actitud positiva frente a los desafíos',
    'Resuelve conflictos de manera pacífica y dialogada',
    'Acepta críticas constructivas y aprende de ellas',
    'Demuestra autonomía en su trabajo',
    'Respeta los tiempos de clase y cumple horarios',
    'Contribuye a un ambiente de aprendizaje positivo',
    'Demuestra interés por el aprendizaje'
  ];

  var studentsData = [
    { id: 1, initials: 'MG', name: 'GARCÍA LÓPEZ, María Fernanda', lastMod: '20/05/2026', status: 'evaluated', count: '13/13', ratings: ['4','5','4','5','4','5','3','5','4','5','4','5','5'] },
    { id: 2, initials: 'JM', name: 'MARTÍNEZ RUIZ, Javier Antonio', lastMod: 'Sin evaluar', status: 'pending', count: '0/13', ratings: ['','','','','','','','','','','','',''] },
    { id: 3, initials: 'AP', name: 'PÉREZ SÁNCHEZ, Ana Carolina', lastMod: '22/05/2026', status: 'in-progress', count: '5/13', ratings: ['4','5','4','','4','','','','','','','',''] },
    { id: 4, initials: 'LR', name: 'RODRÍGUEZ TORRES, Lucas Martín', lastMod: 'Sin evaluar', status: 'pending', count: '0/13', ratings: ['','','','','','','','','','','','',''] },
    { id: 5, initials: 'SF', name: 'FERNÁNDEZ SILVA, Sofía Valentina', lastMod: '22/05/2026', status: 'in-progress', count: '9/13', ratings: ['5','4','5','','','3','4','5','3','','','',''] },
    { id: 6, initials: 'DG', name: 'GONZÁLEZ DÍAZ, Diego Alejandro', lastMod: '21/05/2026', status: 'evaluated', count: '13/13', ratings: ['5','4','5','4','4','5','4','3','4','5','3','4','5'] }
  ];

  var gradesData = [
    { subject: 'Presentismo', details: [{ label: 'Inasis.', value: '18' }, { label: 'Imp.', value: '17' }] },
    { subject: 'Prácticas del Lenguaje', details: [{ label: 'Nota Trim', value: 'S' }] },
    { subject: 'Matemática', details: [{ label: 'Nota Trim', value: 'MB' }] },
    { subject: 'Ciencias Naturales', details: [{ label: 'Nota Trim', value: 'S' }] },
    { subject: 'Ciencias Sociales', details: [{ label: 'Nota Trim', value: 'R' }] },
    { subject: 'Educación Musical', details: [{ label: 'Nota Trim', value: 'MB' }] },
    { subject: 'Educación Plástica', details: [{ label: 'Nota Trim', value: 'B' }] },
    { subject: 'Educación Física', details: [{ label: 'Nota Trim', value: 'R' }] },
    { subject: 'Ed. en Tecnologías Digitales', details: [{ label: 'Nota Trim', value: 'MB' }] }
  ];

  // ── State ───────────────────────────────────────────────────────────────────
  var currentFilter = 'all';
  var allExpanded = false;
  var currentView = 'accordion';
  var currentExpandedIndex = 0;
  var showGrades = false;
  var searchQuery = '';
  var individualCurrentIndex = 0;
  var autoSaveTimeout = null;

  var currentSchool = (function () {
    try { return localStorage.getItem('da_school') || 'san-martin'; } catch (e) { return 'san-martin'; }
  })();

  // ── DOM refs ─────────────────────────────────────────────────────────────────
  var studentList         = document.getElementById('daStudentList');
  var expandAllBtn        = document.getElementById('daExpandAllBtn');
  var toggleGradesBtn     = document.getElementById('daToggleGradesBtn');
  var accordionToolbar    = document.getElementById('daAccordionToolbar');
  var filterSelect        = document.getElementById('daFilterSelect');
  var filterBadge         = document.getElementById('daFilterBadge');
  var filterBadgeText     = document.getElementById('daFilterBadgeText');
  var clearFilterBtn      = document.getElementById('daClearFilterBtn');
  var autoSaveEl          = document.getElementById('daAutoSave');
  var viewAccordionBtn    = document.getElementById('daViewAccordionBtn');
  var viewIndividualBtn   = document.getElementById('daViewIndividualBtn');
  var accordionView       = document.getElementById('daAccordionView');
  var individualView      = document.getElementById('daIndividualView');
  var individualEvalItems = document.getElementById('daIndividualEvalItems');
  var individualPrevBtn   = document.getElementById('daIndividualPrevBtn');
  var individualNextBtn   = document.getElementById('daIndividualNextBtn');
  var individualNavAvatar = document.getElementById('daIndividualNavAvatar');
  var individualNavName   = document.getElementById('daIndividualNavName');
  var individualNavMeta   = document.getElementById('daIndividualNavMeta');
  var progressCircle      = document.getElementById('daProgressCircle');
  var progressCircleText  = document.getElementById('daProgressCircleText');
  var searchInput         = document.getElementById('daSearchInput');
  var progressBar         = document.getElementById('daProgressBar');
  var progressText        = document.getElementById('daProgressText');
  var btnShowProgressList = document.getElementById('daBtnShowProgressList');
  var progressModal       = document.getElementById('daProgressModal');
  var progressModalClose  = document.getElementById('daProgressModalClose');
  var progressModalBody   = document.getElementById('daProgressModalBody');
  var periodModal         = document.getElementById('daPeriodModal');
  var periodModalClose    = document.getElementById('daPeriodModalClose');
  var btnEditPeriod       = document.getElementById('daBtnEditPeriod');
  var btnSavePeriod       = document.getElementById('daBtnSavePeriod');
  var periodSelect        = document.getElementById('daPeriodSelect');
  var currentPeriodText   = document.getElementById('daCurrentPeriodText');

  if (!studentList) return; // page not loaded

  // ── Helpers ─────────────────────────────────────────────────────────────────
  function ratingOptionsHtml(selected) {
    return ratingOptions.map(function (o) {
      return '<option value="' + o.value + '"' + (o.value === selected ? ' selected' : '') + '>' + o.label + '</option>';
    }).join('');
  }

  function belgranoOptionsHtml(selected) {
    return belgranoOptions.map(function (o) {
      return '<option value="' + o.value + '"' + (o.value === selected ? ' selected' : '') + '>' + o.label + '</option>';
    }).join('');
  }

  function gradesHtml() {
    return gradesData.map(function (g) {
      var details = g.details.map(function (d) {
        return '<div class="da-sidebar-grade-label">' + d.label + '</div><div class="da-sidebar-grade-value">' + d.value + '</div>';
      }).join('');
      return '<div class="da-sidebar-grade-item"><div class="da-sidebar-subject">' + g.subject + '</div><div class="da-sidebar-grade-details">' + details + '</div></div>';
    }).join('');
  }

  // ── Badge class helper ───────────────────────────────────────────────────────
  // Mapea status del alumno a las clases del design system (tpl-table__badge)
  var badgeClass = {
    evaluated:   'tpl-table__badge tpl-table__badge--active',
    'in-progress': 'tpl-table__badge tpl-table__badge--pending',
    pending:     'tpl-table__badge da-badge--neutral'
  };

  function statusBadge(status, label) {
    return '<span class="' + (badgeClass[status] || 'tpl-table__badge da-badge--neutral') + '">' + label + '</span>';
  }

  // ── Icon button helpers — Material Symbols ───────────────────────────────────
  function clockBtn(extraClass) {
    var cls = 'tpl-table__action-btn da-meta-clock-btn da-admin-only' + (extraClass ? ' ' + extraClass : '');
    return '<button class="' + cls + '" type="button" title="Ver auditoría" onclick="event.stopPropagation()">' +
      '<span class="material-symbols-rounded">schedule</span>' +
      '</button>';
  }

  function eyeBtn(dataAttr) {
    var attrs = dataAttr ? ' ' + dataAttr : '';
    return '<button class="tpl-table__action-btn"' + attrs + ' title="Ir a este alumno">' +
      '<span class="material-symbols-rounded">open_in_new</span>' +
      '</button>';
  }

  function triggerAutoSave() {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(function () {
      autoSaveEl.classList.add('visible');
      setTimeout(function () { autoSaveEl.classList.remove('visible'); }, 1500);
    }, 800);
  }

  function getVisibleCards() {
    return Array.from(studentList.querySelectorAll('.da-student-card')).filter(function (c) {
      return c.style.display !== 'none';
    });
  }

  function updateNavButtons() {
    var visibleCards = getVisibleCards();
    var expandedCard = visibleCards.find(function (c) { return c.classList.contains('expanded'); });
    if (!expandedCard) return;
    var idx = visibleCards.indexOf(expandedCard);
    var prev = expandedCard.querySelector('[data-nav="prev"]');
    var next = expandedCard.querySelector('[data-nav="next"]');
    if (prev) prev.disabled = idx === 0;
    if (next) next.disabled = idx === visibleCards.length - 1;
  }

  // ── Split item action icon button ─────────────────────────────────────────────
  // Figma: 32×32px circular, borde primario si activo, gris si inactivo
  function splitIconBtn(icon, title, active) {
    var mod = active ? 'da-split-icon-btn--active' : 'da-split-icon-btn--inactive';
    return '<button class="da-split-icon-btn ' + mod + '" title="' + title + '" onclick="event.stopPropagation()">' +
      '<span class="material-symbols-rounded">' + icon + '</span>' +
      '</button>';
  }

  // ── Render split master-detail (Listado view) ────────────────────────────
  function renderStudents() {
    studentList.innerHTML = '';
    if (currentSchool === 'belgrano') { renderStudentsBelgrano(); return; }

    var statusLabels = { evaluated: 'EVALUADO', pending: 'PENDIENTE', 'in-progress': 'EN PROGRESO' };

    var splitView = document.createElement('div');
    splitView.className = 'da-split-view';

    // ── Left: student list (Figma node 16158:212750) ──────────────────────
    var listPanel = document.createElement('div');
    listPanel.className = 'da-split-list';
    listPanel.id = 'daSplitList';

    studentsData.forEach(function (student, index) {
      var item = document.createElement('div');
      item.className = 'da-split-student-item da-student-card' +
        (index === currentExpandedIndex ? ' active' : '');
      item.dataset.status = student.status;
      item.dataset.index = index;

      // History btn activo solo si ya tiene progreso
      var hasProgress = student.status !== 'pending';

      item.innerHTML =
        '<div class="da-split-avatar-fig">' + student.initials + '</div>' +
        '<div class="da-split-student-info">' +
          '<div class="da-split-student-name">' + student.name + '</div>' +
          '<div class="da-split-student-row2">' +
            '<div class="da-split-count-status">' +
              '<span class="da-split-count">' + student.count + '</span>' +
              statusBadge(student.status, statusLabels[student.status]) +
            '</div>' +
            '<div class="da-split-item-actions da-admin-only">' +
              splitIconBtn('person',     'Ver perfil del alumno', true) +
              splitIconBtn('fact_check', 'Ver calificaciones',    true) +
              splitIconBtn('history',    'Ver auditor\xEDa',      hasProgress) +
            '</div>' +
          '</div>' +
        '</div>';

      listPanel.appendChild(item);
    });

    // ── Right: detail panel ───────────────────────────────────────────────
    var detailPanel = document.createElement('div');
    detailPanel.className = 'da-split-detail';
    detailPanel.id = 'daSplitDetail';

    splitView.appendChild(listPanel);
    splitView.appendChild(detailPanel);
    studentList.appendChild(splitView);

    // Expandir btn no aplica en split view
    if (expandAllBtn) expandAllBtn.style.display = 'none';

    renderSplitDetail(currentExpandedIndex);
  }

  // ── Render Belgrano flat list ────────────────────────────────────────────────
  function renderStudentsBelgrano() {
    studentsData.forEach(function (student, index) {
      var card = document.createElement('div');
      card.className = 'da-student-card da-belgrano-card ' + student.status;
      card.dataset.status = student.status;
      card.dataset.index = index;

      var sidebarVisible = showGrades ? ' visible' : '';
      var toggleLabel = showGrades ? 'Ocultar calificaciones' : 'Ver calificaciones';
      var toggleActive = showGrades ? ' active' : '';

      card.innerHTML =
        '<div class="da-belgrano-inner">' +
          '<div class="da-belgrano-row">' +
            '<div class="da-belgrano-student-col">' +
              '<div class="da-student-avatar">' + student.initials + '</div>' +
              '<div class="da-student-info">' +
                '<div class="da-student-name">' + student.name + '</div>' +
                '<div class="da-student-meta"><span>' + student.lastMod + '</span>' + clockBtn() + '</div>' +
                '<button class="da-btn-toggle-grades' + toggleActive + '" data-action="toggle-grades" style="display:inline-block;margin-top:6px">' + toggleLabel + '</button>' +
              '</div>' +
            '</div>' +
            '<div class="da-belgrano-field">' +
              '<div class="da-belgrano-field-label">Conducta General del Período</div>' +
              '<select class="da-belgrano-select da-rating-select" data-item="0">' + belgranoOptionsHtml(student.ratings[0] || '') + '</select>' +
              '<div class="da-belgrano-hint">Se guarda automáticamente al seleccionar</div>' +
            '</div>' +
            '<div class="da-belgrano-field">' +
              '<div class="da-belgrano-field-label">Observaciones</div>' +
              '<textarea class="da-belgrano-textarea" data-obs rows="3" placeholder="Escriba una observación...">' + (student.observations || '') + '</textarea>' +
              '<div class="da-belgrano-hint">Se guarda al perder el foco</div>' +
            '</div>' +
          '</div>' +
          '<div class="da-student-body-sidebar' + sidebarVisible + '">' +
            '<div class="da-sidebar-title">Otras calificaciones - 1º Trim</div>' +
            gradesHtml() +
          '</div>' +
        '</div>';

      studentList.appendChild(card);
    });
  }

  // ── Render detail panel for selected student ──────────────────────────────────
  function renderSplitDetail(index) {
    var panel = document.getElementById('daSplitDetail');
    if (!panel) return;

    var student = studentsData[index];
    if (!student) {
      panel.innerHTML = '<div class="da-split-empty">Seleccioná un alumno para ver su evaluación</div>';
      return;
    }

    var statusLabels = { evaluated: 'EVALUADO', pending: 'PENDIENTE', 'in-progress': 'EN PROGRESO' };

    var header =
      '<div class="da-split-detail-header">' +
        '<div>' +
          '<div class="da-split-detail-student-name">' + student.name + '</div>' +
          '<div class="da-split-detail-student-meta">' +
            '<span>' + student.count + ' ítems evaluados</span>' +
            '<span style="margin:0 4px;color:#c9d1d8">·</span>' +
            '<span>' + student.lastMod + '</span>' +
            clockBtn() +
          '</div>' +
        '</div>' +
        statusBadge(student.status, statusLabels[student.status]) +
      '</div>';

    var evalItems = evalLabels.map(function (label, i) {
      return '<div class="da-eval-item">' +
        '<div class="da-eval-label">' + (i + 1) + '. ' + label + '</div>' +
        '<div class="da-eval-rating">' +
          '<select class="da-rating-select" data-item="' + i + '" data-student-idx="' + index + '">' +
          ratingOptionsHtml(student.ratings[i]) +
          '</select>' +
        '</div>' +
      '</div>';
    }).join('');

    var gradeRows = gradesData.map(function (g) {
      var details = g.details.map(function (d) {
        return '<div class="da-split-grade-detail">' +
          '<span class="da-split-grade-label">' + d.label + '</span>' +
          '<span class="da-split-grade-value">' + d.value + '</span>' +
        '</div>';
      }).join('');
      return '<div class="da-split-grade-item">' +
        '<div class="da-split-grade-subject">' + g.subject + '</div>' +
        '<div class="da-split-grade-details">' + details + '</div>' +
      '</div>';
    }).join('');

    var gradesSection =
      '<div class="da-split-grades' + (showGrades ? ' visible' : '') + '" id="daSplitGrades">' +
        '<div class="da-split-grades-title">' +
          '<span>OTRAS CALIFICACIONES</span>' +
          '<span style="font-size:.6875rem;font-weight:400">1º TRIM.</span>' +
        '</div>' +
        '<div class="da-split-grades-grid">' + gradeRows + '</div>' +
      '</div>';

    panel.innerHTML =
      header +
      '<div class="da-split-detail-body">' +
        '<div class="da-eval-items">' + evalItems + '</div>' +
        gradesSection +
      '</div>';
  }

  // ── Render individual view ────────────────────────────────────────────────────
  function getFilteredStudents() {
    return studentsData.filter(function (s) {
      var matchStatus = currentFilter === 'all' ||
        (currentFilter === 'pending' && s.status === 'pending') ||
        (currentFilter === 'evaluated' && s.status === 'evaluated') ||
        (currentFilter === 'in-progress' && s.status === 'in-progress');
      var matchSearch = !searchQuery || s.name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1;
      return matchStatus && matchSearch;
    });
  }

  function renderIndividualView() {
    var students = getFilteredStudents();
    if (students.length === 0) {
      individualEvalItems.innerHTML = '<p style="padding:20px;text-align:center;color:#666;">No hay alumnos que coincidan con el filtro</p>';
      individualNavAvatar.textContent = '--';
      individualNavName.textContent = '';
      return;
    }

    if (individualCurrentIndex >= students.length) individualCurrentIndex = 0;
    var student = students[individualCurrentIndex];

    individualNavAvatar.textContent = student.initials;
    individualNavName.textContent = student.name;
    individualNavMeta.innerHTML = '<span>' + student.lastMod + '</span>' + clockBtn();

    // Progress circle
    var parts = student.count.split('/');
    var completed = parseInt(parts[0], 10) || 0;
    var total = parseInt(parts[1], 10) || 13;
    var pct = Math.round((completed / total) * 100);
    var circumference = 2 * Math.PI * 18;
    var offset = circumference - (pct / 100) * circumference;
    var fill = progressCircle ? progressCircle.querySelector('.da-progress-circle__fill') : null;
    if (fill) {
      fill.setAttribute('stroke-dasharray', circumference.toFixed(2));
      fill.setAttribute('stroke-dashoffset', offset.toFixed(2));
    }
    if (progressCircleText) progressCircleText.textContent = pct + '%';

    // Eval items
    if (currentSchool === 'belgrano') {
      individualEvalItems.innerHTML =
        '<div class="da-belgrano-individual-row" style="display:flex;gap:20px;flex-wrap:wrap;">' +
          '<div class="da-belgrano-field" style="flex:1;min-width:180px;">' +
            '<div class="da-belgrano-field-label">Conducta General del Período</div>' +
            '<select class="da-belgrano-select da-individual-eval-select" data-student-id="' + student.id + '" data-item="0">' +
            belgranoOptionsHtml(student.ratings[0] || '') + '</select>' +
            '<div class="da-belgrano-hint">Se guarda automáticamente al seleccionar</div>' +
          '</div>' +
          '<div class="da-belgrano-field" style="flex:1;min-width:200px;">' +
            '<div class="da-belgrano-field-label">Observaciones</div>' +
            '<textarea class="da-belgrano-textarea" data-obs data-student-id="' + student.id + '" rows="3" placeholder="Escriba una observación...">' + (student.observations || '') + '</textarea>' +
            '<div class="da-belgrano-hint">Se guarda al perder el foco</div>' +
          '</div>' +
        '</div>';
    } else {
      individualEvalItems.innerHTML = evalLabels.map(function (label, i) {
        return '<div class="da-individual-eval-item">' +
          '<div class="da-individual-eval-label">' + (i + 1) + '. ' + label + '</div>' +
          '<select class="da-individual-eval-select" data-student-id="' + student.id + '" data-item="' + i + '">' +
          ratingOptionsHtml(student.ratings[i]) +
          '</select></div>';
      }).join('');
    }

    individualPrevBtn.disabled = individualCurrentIndex === 0;
    individualNextBtn.disabled = individualCurrentIndex === students.length - 1;
  }

  // ── Apply filter ──────────────────────────────────────────────────────────────
  function applyFilter() {
    var cards = studentList.querySelectorAll('.da-student-card');
    var visibleCount = 0;

    Array.from(cards).forEach(function (card) {
      var status = card.dataset.status;
      var idx = parseInt(card.dataset.index, 10);
      var name = studentsData[idx].name.toLowerCase();

      var matchStatus = currentFilter === 'all' ||
        (currentFilter === 'pending' && status === 'pending') ||
        (currentFilter === 'evaluated' && status === 'evaluated') ||
        (currentFilter === 'in-progress' && status === 'in-progress');
      var matchSearch = !searchQuery || name.indexOf(searchQuery.toLowerCase()) !== -1;
      var show = matchStatus && matchSearch;

      card.style.display = show ? '' : 'none';
      if (show) visibleCount++;
    });

    var hasFilter = currentFilter !== 'all' || searchQuery;
    filterBadge.style.display = hasFilter ? 'flex' : 'none';
    if (hasFilter) {
      var filterLabels = { pending: 'sin evaluar', evaluated: 'evaluados', 'in-progress': 'en progreso' };
      var text = currentFilter !== 'all'
        ? 'Mostrando ' + visibleCount + ' alumnos ' + filterLabels[currentFilter]
        : 'Mostrando ' + visibleCount + ' resultados para "' + searchQuery + '"';
      filterBadgeText.textContent = 'Filtro activo: ' + text;
    }

    // Split view: si el alumno seleccionado quedó oculto, seleccionar el primero visible
    var splitList = document.getElementById('daSplitList');
    if (splitList) {
      var activeItem = splitList.querySelector('.da-split-student-item.active');
      if (activeItem && activeItem.style.display === 'none') {
        var firstVisible = Array.from(splitList.querySelectorAll('.da-split-student-item'))
          .find(function (it) { return it.style.display !== 'none'; });
        if (firstVisible) {
          splitList.querySelectorAll('.da-split-student-item').forEach(function (it) { it.classList.remove('active'); });
          firstVisible.classList.add('active');
          currentExpandedIndex = parseInt(firstVisible.dataset.index, 10);
          renderSplitDetail(currentExpandedIndex);
        } else {
          var detailPanel = document.getElementById('daSplitDetail');
          if (detailPanel) detailPanel.innerHTML = '<div class="da-split-empty" style="padding:40px;color:#999;font-size:.8125rem;text-align:center">Sin resultados para el filtro aplicado</div>';
        }
      }
    }

    updateNavButtons();
    if (currentView === 'individual') renderIndividualView();
  }

  // ── Navigate accordion ────────────────────────────────────────────────────────
  function navigateStudent(direction) {
    var visibleCards = getVisibleCards();
    var expandedCard = visibleCards.find(function (c) { return c.classList.contains('expanded'); });
    if (!expandedCard) return;
    var idx = visibleCards.indexOf(expandedCard);
    var newIdx = direction === 'prev' ? Math.max(0, idx - 1) : Math.min(visibleCards.length - 1, idx + 1);
    if (newIdx === idx) return;

    visibleCards.forEach(function (c) { c.classList.remove('expanded'); });
    visibleCards[newIdx].classList.add('expanded');
    updateNavButtons();
    visibleCards[newIdx].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // ── Event: student list ────────────────────────────────────────────────────
  studentList.addEventListener('click', function (e) {
    // ── Split view item ───────────────────────────────────────────────────
    var splitItem = e.target.closest('.da-split-student-item');
    if (splitItem) {
      // Grades toggle button on item
      var toggleBtn = e.target.closest('[data-action="toggle-grades"]');
      if (toggleBtn) {
        e.stopPropagation();
        showGrades = !showGrades;
        var splitList = document.getElementById('daSplitList');
        if (splitList) {
          splitList.querySelectorAll('.da-btn-toggle-grades').forEach(function (b) {
            b.classList.toggle('active', showGrades);
            b.textContent = showGrades ? 'Ocultar calificaciones' : 'Ver calificaciones';
          });
        }
        var gradesPanel = document.getElementById('daSplitGrades');
        if (gradesPanel) gradesPanel.classList.toggle('visible', showGrades);
        if (toggleGradesBtn) {
          toggleGradesBtn.classList.toggle('active', showGrades);
          toggleGradesBtn.textContent = showGrades ? 'Ocultar calificaciones de materias' : 'Mostrar calificaciones de materias';
        }
        return;
      }
      // Select student
      var idx = parseInt(splitItem.dataset.index, 10);
      currentExpandedIndex = idx;
      var listPanel = document.getElementById('daSplitList');
      if (listPanel) {
        listPanel.querySelectorAll('.da-split-student-item').forEach(function (it) { it.classList.remove('active'); });
      }
      splitItem.classList.add('active');
      renderSplitDetail(idx);
      return;
    }

    // ── Belgrano card ─────────────────────────────────────────────────────
    var card = e.target.closest('.da-student-card');
    if (!card) return;

    var toggleBtnCard = e.target.closest('[data-action="toggle-grades"]');
    if (toggleBtnCard) {
      e.stopPropagation();
      var sidebar = card.querySelector('.da-student-body-sidebar');
      if (sidebar) {
        var isVisible = sidebar.classList.contains('visible');
        sidebar.classList.toggle('visible', !isVisible);
        toggleBtnCard.classList.toggle('active', !isVisible);
        toggleBtnCard.textContent = isVisible ? 'Ver calificaciones' : 'Ocultar calificaciones';
      }
      return;
    }

    var navBtn = e.target.closest('.da-nav-arrow');
    if (navBtn) { navigateStudent(navBtn.dataset.nav); return; }

    var header = e.target.closest('.da-student-header');
    if (header && !card.classList.contains('da-belgrano-card')) {
      var wasExpanded = card.classList.contains('expanded');
      document.querySelectorAll('.da-student-card').forEach(function (c) { c.classList.remove('expanded'); });
      if (!wasExpanded) { card.classList.add('expanded'); updateNavButtons(); }
    }
  });

  studentList.addEventListener('change', function (e) {
    var select = e.target.closest('.da-rating-select');
    if (!select) return;
    var itemIdx = parseInt(select.dataset.item, 10);

    // Split detail panel: data-student-idx attribute
    if (select.dataset.studentIdx !== undefined) {
      var sIdx = parseInt(select.dataset.studentIdx, 10);
      studentsData[sIdx].ratings[itemIdx] = select.value;
      triggerAutoSave();
      return;
    }

    // Belgrano card
    var card = e.target.closest('.da-student-card');
    if (card) {
      var idx = parseInt(card.dataset.index, 10);
      studentsData[idx].ratings[itemIdx] = select.value;
      triggerAutoSave();
    }
  });

  studentList.addEventListener('blur', function (e) {
    var obs = e.target.closest('[data-obs]');
    var card = e.target.closest('.da-student-card');
    if (obs && card) {
      var idx = parseInt(card.dataset.index, 10);
      studentsData[idx].observations = obs.value;
      triggerAutoSave();
    }
  }, true);

  // ── Expand / Collapse all ─────────────────────────────────────────────────────
  if (expandAllBtn) {
    expandAllBtn.addEventListener('click', function () {
      allExpanded = !allExpanded;
      var visibleCards = getVisibleCards();
      visibleCards.forEach(function (c, i) {
        c.classList.toggle('expanded', allExpanded);
        if (allExpanded) {
          var prev = c.querySelector('[data-nav="prev"]');
          var next = c.querySelector('[data-nav="next"]');
          if (prev) prev.disabled = i === 0;
          if (next) next.disabled = i === visibleCards.length - 1;
        }
      });
      expandAllBtn.textContent = allExpanded ? 'Colapsar' : 'Expandir';
    });
  }

  // ── Global toggle grades ──────────────────────────────────────────────────────
  if (toggleGradesBtn) {
    toggleGradesBtn.addEventListener('click', function () {
      showGrades = !showGrades;
      // Belgrano sidebars
      document.querySelectorAll('.da-student-body-sidebar').forEach(function (s) {
        s.classList.toggle('visible', showGrades);
      });
      document.querySelectorAll('.da-btn-toggle-grades').forEach(function (b) {
        b.classList.toggle('active', showGrades);
        b.textContent = showGrades ? 'Ocultar calificaciones' : 'Ver calificaciones';
      });
      toggleGradesBtn.classList.toggle('active', showGrades);
      toggleGradesBtn.textContent = showGrades ? 'Ocultar calificaciones de materias' : 'Mostrar calificaciones de materias';
      // Split detail grades panel
      var gradesPanel = document.getElementById('daSplitGrades');
      if (gradesPanel) gradesPanel.classList.toggle('visible', showGrades);
    });
  }

  // ── View switcher ─────────────────────────────────────────────────────────────
  if (viewAccordionBtn) {
    viewAccordionBtn.addEventListener('click', function () {
      if (currentView === 'accordion') return;
      currentView = 'accordion';
      viewAccordionBtn.classList.add('active');
      viewIndividualBtn.classList.remove('active');
      accordionView.style.display = '';
      individualView.classList.remove('active');
      if (accordionToolbar) accordionToolbar.style.display = '';
      if (expandAllBtn) expandAllBtn.style.display = 'none'; // not applicable in split view
    });
  }

  if (viewIndividualBtn) {
    viewIndividualBtn.addEventListener('click', function () {
      if (currentView === 'individual') return;
      currentView = 'individual';
      viewIndividualBtn.classList.add('active');
      viewAccordionBtn.classList.remove('active');
      accordionView.style.display = 'none';
      individualView.classList.add('active');
      if (accordionToolbar) accordionToolbar.style.display = 'none';
      renderIndividualView();
    });
  }

  // ── Individual navigation ─────────────────────────────────────────────────────
  if (individualPrevBtn) {
    individualPrevBtn.addEventListener('click', function () {
      if (individualCurrentIndex > 0) { individualCurrentIndex--; renderIndividualView(); }
    });
  }

  if (individualNextBtn) {
    individualNextBtn.addEventListener('click', function () {
      var students = getFilteredStudents();
      if (individualCurrentIndex < students.length - 1) { individualCurrentIndex++; renderIndividualView(); }
    });
  }

  // Individual eval changes
  if (individualEvalItems) {
    individualEvalItems.addEventListener('change', function (e) {
      var select = e.target.closest('.da-individual-eval-select');
      if (!select) return;
      var studentId = parseInt(select.dataset.studentId, 10);
      var itemIdx = parseInt(select.dataset.item, 10);
      var sIdx = studentsData.findIndex(function (s) { return s.id === studentId; });
      if (sIdx !== -1) { studentsData[sIdx].ratings[itemIdx] = select.value; triggerAutoSave(); }
    });

    individualEvalItems.addEventListener('blur', function (e) {
      var obs = e.target.closest('[data-obs]');
      if (!obs) return;
      var studentId = parseInt(obs.dataset.studentId, 10);
      var sIdx = studentsData.findIndex(function (s) { return s.id === studentId; });
      if (sIdx !== -1) { studentsData[sIdx].observations = obs.value; triggerAutoSave(); }
    }, true);
  }

  // ── Filter & search ───────────────────────────────────────────────────────────
  if (filterSelect) {
    filterSelect.addEventListener('change', function (e) {
      currentFilter = e.target.value;
      applyFilter();
    });
  }

  if (clearFilterBtn) {
    clearFilterBtn.addEventListener('click', function () {
      filterSelect.value = 'all';
      currentFilter = 'all';
      searchQuery = '';
      if (searchInput) searchInput.value = '';
      applyFilter();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', function (e) {
      searchQuery = e.target.value;
      applyFilter();
    });
  }

  // ── Period modal ──────────────────────────────────────────────────────────────
  if (btnEditPeriod) {
    btnEditPeriod.addEventListener('click', function () { periodModal.classList.add('visible'); });
  }
  if (periodModalClose) {
    periodModalClose.addEventListener('click', function () { periodModal.classList.remove('visible'); });
  }
  if (periodModal) {
    periodModal.addEventListener('click', function (e) {
      if (e.target === periodModal) periodModal.classList.remove('visible');
    });
  }
  if (btnSavePeriod && periodSelect && currentPeriodText) {
    btnSavePeriod.addEventListener('click', function () {
      currentPeriodText.textContent = periodSelect.options[periodSelect.selectedIndex].text;
      periodModal.classList.remove('visible');
    });
  }

  // ── Progress list modal ───────────────────────────────────────────────────────
  function renderProgressModal() {
    // Iconos del estado usando Material Symbols
    var statusIcon = {
      evaluated:    '<span class="material-symbols-rounded" style="font-size:1rem;color:#2dca72;font-variation-settings:\'FILL\' 1,\'wght\' 400,\'GRAD\' 0,\'opsz\' 20">check_circle</span>',
      'in-progress':'<span class="material-symbols-rounded" style="font-size:1rem;color:#ffc233;font-variation-settings:\'FILL\' 0,\'wght\' 300,\'GRAD\' 0,\'opsz\' 20">schedule</span>',
      pending:      '<span class="material-symbols-rounded" style="font-size:1rem;color:#a7b1bb;font-variation-settings:\'FILL\' 0,\'wght\' 300,\'GRAD\' 0,\'opsz\' 20">radio_button_unchecked</span>'
    };

    progressModalBody.innerHTML = studentsData.map(function (s, i) {
      var icon = statusIcon[s.status] || statusIcon.pending;
      return '<div class="da-modal-student-item">' +
        '<div class="da-modal-status-icon">' + icon + '</div>' +
        '<div class="da-modal-student-name">' + s.name + '</div>' +
        '<div class="da-modal-student-meta">' + s.count + '</div>' +
        eyeBtn('data-student-index="' + i + '"') +
        '</div>';
    }).join('');
  }

  if (btnShowProgressList) {
    btnShowProgressList.addEventListener('click', function () {
      renderProgressModal();
      progressModal.classList.add('visible');
    });
  }
  if (progressModalClose) {
    progressModalClose.addEventListener('click', function () { progressModal.classList.remove('visible'); });
  }
  if (progressModal) {
    progressModal.addEventListener('click', function (e) {
      if (e.target === progressModal) progressModal.classList.remove('visible');
    });
  }
  if (progressModalBody) {
    progressModalBody.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-student-index]');
      if (!btn) return;
      var idx = parseInt(btn.dataset.studentIndex, 10);
      progressModal.classList.remove('visible');
      if (currentView === 'individual') {
        individualCurrentIndex = idx;
        renderIndividualView();
      } else {
        document.querySelectorAll('.da-student-card').forEach(function (c) { c.classList.remove('expanded'); });
        var card = studentList.querySelector('.da-student-card[data-index="' + idx + '"]');
        if (card) {
          card.classList.add('expanded');
          updateNavButtons();
          card.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }

  // ── User switcher ─────────────────────────────────────────────────────────────
  (function () {
    var USERS = {
      admin:   { name: 'Laura Méndez',   initials: 'LM', badge: 'Admin' },
      docente: { name: 'Carlos Ramírez', initials: 'CR', badge: 'Docente' }
    };
    var wrap    = document.getElementById('daUserSwitcher');
    var trigger = document.getElementById('daUserSwitcherTrigger');
    var avatarEl = document.getElementById('daUserAvatar');
    var nameEl  = document.getElementById('daUserName');
    var roleEl  = document.getElementById('daUserRole');
    var items   = wrap ? wrap.querySelectorAll('.da-user-dropdown-item') : [];

    function applyUser(key) {
      var u = USERS[key]; if (!u) return;
      document.body.dataset.daRole = key;
      if (avatarEl) avatarEl.textContent = u.initials;
      if (nameEl) nameEl.textContent = u.name;
      if (roleEl) roleEl.textContent = u.badge;
      Array.from(items).forEach(function (it) { it.classList.toggle('active', it.dataset.user === key); });
      try { localStorage.setItem('da_role', key); } catch (e) {}
    }

    var initial = 'admin';
    try { var saved = localStorage.getItem('da_role'); if (saved && USERS[saved]) initial = saved; } catch (e) {}
    applyUser(initial);

    if (trigger) {
      trigger.addEventListener('click', function (e) { e.stopPropagation(); wrap.classList.toggle('open'); });
    }
    Array.from(items).forEach(function (item) {
      item.addEventListener('click', function (e) { e.stopPropagation(); applyUser(item.dataset.user); wrap.classList.remove('open'); });
    });
    document.addEventListener('click', function (e) { if (wrap && !wrap.contains(e.target)) wrap.classList.remove('open'); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && wrap) wrap.classList.remove('open'); });
  })();

  // ── School switcher ───────────────────────────────────────────────────────────
  (function () {
    var wrap    = document.getElementById('daSchoolSwitcher');
    var trigger = document.getElementById('daSchoolSwitcherTrigger');
    var nameEl  = document.getElementById('daSchoolName');
    var levelEl = document.getElementById('daSchoolLevel');
    var items   = wrap ? wrap.querySelectorAll('.da-school-dropdown-item') : [];

    function applySchool(key, name, level) {
      if (nameEl) nameEl.textContent = name;
      if (levelEl) levelEl.textContent = level;
      Array.from(items).forEach(function (it) { it.classList.toggle('active', it.dataset.school === key); });
      document.body.classList.remove('da-school-san-martin', 'da-school-belgrano', 'da-school-sarmiento');
      document.body.classList.add('da-school-' + key);
      var changed = currentSchool !== key;
      currentSchool = key;
      if (changed) { renderStudents(); applyFilter(); if (currentView === 'individual') renderIndividualView(); }
      try { localStorage.setItem('da_school', key); } catch (e) {}
    }

    var initial = { key: 'san-martin', name: 'Colegio San Martín', level: 'Primaria' };
    try {
      var saved = localStorage.getItem('da_school');
      var match = saved && Array.from(items).find(function (it) { return it.dataset.school === saved; });
      if (match) initial = { key: match.dataset.school, name: match.dataset.name, level: match.dataset.level };
    } catch (e) {}
    applySchool(initial.key, initial.name, initial.level);

    if (trigger) {
      trigger.addEventListener('click', function (e) { e.stopPropagation(); wrap.classList.toggle('open'); });
    }
    Array.from(items).forEach(function (item) {
      item.addEventListener('click', function (e) {
        e.stopPropagation();
        applySchool(item.dataset.school, item.dataset.name, item.dataset.level);
        wrap.classList.remove('open');
      });
    });
    document.addEventListener('click', function (e) { if (wrap && !wrap.contains(e.target)) wrap.classList.remove('open'); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && wrap) wrap.classList.remove('open'); });
  })();

  // ── Tab navigation (visual only for now) ─────────────────────────────────────
  // Usando el pill tab-nav del design system: ul.nav.tab-nav > li.nav-item > a.nav-link
  document.querySelectorAll('.da-tab-nav-pill .nav-link').forEach(function (tab) {
    tab.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelectorAll('.da-tab-nav-pill .nav-link').forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
    });
  });

  // ── Initial render ────────────────────────────────────────────────────────────
  renderStudents();
  renderIndividualView();
  applyFilter();

})();
