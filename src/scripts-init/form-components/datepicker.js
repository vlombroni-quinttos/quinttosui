// Forms Datepicker

import "@chenfengyuan/datepicker";
import "daterangepicker";
import moment from "moment";

$(document).ready(() => {
  // Datepicker

  $('[data-toggle="datepicker"]').datepicker();
  $('[data-toggle="datepicker-year"]').datepicker({
    startView: 2,
  });

  $('[data-toggle="datepicker-month"]').datepicker({
    startView: 1,
  });

  $('[data-toggle="datepicker-inline"]').datepicker({
    inline: true,
  });

  $('[data-toggle="datepicker-icon"]').datepicker({
    trigger: ".datepicker-trigger",
  });

  $('[data-toggle="datepicker-button"]').datepicker({
    trigger: ".datepicker-trigger-btn",
  });

  // Daterangepicker

  $('input[name="daterange"]').daterangepicker();

  $('input[name="datetimes"]').daterangepicker({
    timePicker: true,
    startDate: moment().startOf("hour"),
    endDate: moment().startOf("hour").add(32, "hour"),
    locale: {
      format: "M/DD hh:mm A",
    },
  });

  $('input[name="birthday"]').daterangepicker(
    {
      singleDatePicker: true,
      showDropdowns: true,
      minYear: 1901,
      maxYear: parseInt(moment().format("YYYY"), 10),
    },
    function (start, end, label) {
      var years = moment().diff(start, "years");
      alert("You are " + years + " years old!");
    }
  );

  var start = moment().subtract(29, "days");
  var end = moment();

  function cb(start, end) {
    $("#reportrange span").html(
      start.format("MMMM D, YYYY") + " - " + end.format("MMMM D, YYYY")
    );
  }

  $("#reportrange").daterangepicker(
    {
      startDate: start,
      endDate: end,
      opens: "right",
      ranges: {
        Today: [moment(), moment()],
        Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
        "Last 7 Days": [moment().subtract(6, "days"), moment()],
        "Last 30 Days": [moment().subtract(29, "days"), moment()],
        "This Month": [moment().startOf("month"), moment().endOf("month")],
        "Last Month": [
          moment().subtract(1, "month").startOf("month"),
          moment().subtract(1, "month").endOf("month"),
        ],
      },
    },
    cb
  );

  cb(start, end);

  $('input[name="daterange-centered"]').daterangepicker({
    timePicker: true,
    buttonClasses: "btn btn-success",
    cancelClass: "btn-link bg-transparent rm-border text-danger",
    opens: "center",
    drops: "up",
    startDate: "12/12/2018",
    endDate: "12/18/2018",
  });
});

// ── QDP: Date Picker Controller ─────────────────────────────────────────────
// Vanilla JS. Este bundle se carga al final del <body>, DOM ya disponible.
(function () {
    'use strict';

    var MONTHS_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                     'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    var MONTHS_ES_SHORT = ['Ene','Feb','Mar','Abr','May','Jun',
                           'Jul','Ago','Sep','Oct','Nov','Dic'];
    var DAYS_ES = ['D','L','M','M','J','V','S'];

    function pad(n) { return n < 10 ? '0' + n : '' + n; }
    function fmt(d) { return pad(d.getDate()) + '/' + pad(d.getMonth()+1) + '/' + d.getFullYear(); }

    function buildPanel(inst) {
        var p = inst.panel;
        p.innerHTML = '';

        var calView = document.createElement('div');
        calView.className = 'qdp__view qdp__view--active';
        calView.setAttribute('data-qdp-view', 'cal');
        calView.innerHTML =
            '<div class="qdp__header qdp__header--nav">' +
                '<button type="button" class="qdp__nav-btn" data-qdp-action="prev-month" aria-label="Mes anterior"><span class="material-symbols-rounded">chevron_left</span></button>' +
                '<div style="display:flex;gap:0;align-items:center;">' +
                    '<button type="button" class="qdp__menu-btn" data-qdp-action="show-months"><span class="qdp__title qdp__title--month"></span><span class="material-symbols-rounded">expand_more</span></button>' +
                    '<button type="button" class="qdp__menu-btn" data-qdp-action="show-years"><span class="qdp__title qdp__title--year"></span><span class="material-symbols-rounded">expand_more</span></button>' +
                '</div>' +
                '<button type="button" class="qdp__nav-btn" data-qdp-action="next-month" aria-label="Mes siguiente"><span class="material-symbols-rounded">chevron_right</span></button>' +
            '</div>' +
            '<div class="qdp__calendar">' +
                '<div class="qdp__weekdays">' + DAYS_ES.map(function(d){ return '<div class="qdp__weekday">'+d+'</div>'; }).join('') + '</div>' +
                '<div class="qdp__weeks"></div>' +
            '</div>';
        p.appendChild(calView);

        var monView = document.createElement('div');
        monView.className = 'qdp__view';
        monView.setAttribute('data-qdp-view', 'months');
        monView.innerHTML =
            '<div class="qdp__header qdp__header--nav">' +
                '<button type="button" class="qdp__nav-btn" data-qdp-action="prev-year-m"><span class="material-symbols-rounded">chevron_left</span></button>' +
                '<button type="button" class="qdp__menu-btn" data-qdp-action="show-years"><span class="qdp__title qdp__title--year-m"></span><span class="material-symbols-rounded">expand_more</span></button>' +
                '<button type="button" class="qdp__nav-btn" data-qdp-action="next-year-m"><span class="material-symbols-rounded">chevron_right</span></button>' +
            '</div>' +
            '<div class="qdp__grid"><div class="qdp__months-grid"></div></div>';
        p.appendChild(monView);

        var yrView = document.createElement('div');
        yrView.className = 'qdp__view';
        yrView.setAttribute('data-qdp-view', 'years');
        yrView.innerHTML =
            '<div class="qdp__header qdp__header--nav">' +
                '<button type="button" class="qdp__nav-btn" data-qdp-action="prev-decade"><span class="material-symbols-rounded">chevron_left</span></button>' +
                '<span class="qdp__title qdp__title--decade" style="font-size:1rem;font-weight:500;color:#2e353d;"></span>' +
                '<button type="button" class="qdp__nav-btn" data-qdp-action="next-decade"><span class="material-symbols-rounded">chevron_right</span></button>' +
            '</div>' +
            '<div class="qdp__grid"><div class="qdp__years-grid"></div></div>';
        p.appendChild(yrView);
    }

    function renderCalendar(inst) {
        var c = inst.cursor, panel = inst.panel;
        panel.querySelector('.qdp__title--month').textContent = MONTHS_ES[c.month];
        panel.querySelector('.qdp__title--year').textContent  = c.year;
        var weeksEl = panel.querySelector('.qdp__weeks');
        weeksEl.innerHTML = '';
        var today = new Date();
        var firstDay = new Date(c.year, c.month, 1).getDay();
        var daysInMonth = new Date(c.year, c.month + 1, 0).getDate();
        var daysInPrev  = new Date(c.year, c.month, 0).getDate();
        var cells = [];
        for (var i = firstDay - 1; i >= 0; i--) { cells.push({ day: daysInPrev - i, adjacent: true }); }
        for (var d = 1; d <= daysInMonth; d++) { cells.push({ day: d, adjacent: false }); }
        var remaining = (7 - (cells.length % 7)) % 7;
        for (var j = 1; j <= remaining; j++) { cells.push({ day: j, adjacent: true }); }
        for (var row = 0; row < cells.length / 7; row++) {
            var week = document.createElement('div');
            week.className = 'qdp__week';
            for (var col = 0; col < 7; col++) {
                var cell = cells[row * 7 + col];
                var cellEl = document.createElement('div');
                cellEl.className = 'qdp__day-cell';
                var btn = document.createElement('div');
                btn.className = 'qdp__day';
                btn.textContent = cell.day;
                if (cell.adjacent) {
                    btn.classList.add('qdp__day--adjacent');
                } else {
                    if (c.year === today.getFullYear() && c.month === today.getMonth() && cell.day === today.getDate()) btn.classList.add('qdp__day--today');
                    if (inst.selected && inst.selected.getFullYear() === c.year && inst.selected.getMonth() === c.month && inst.selected.getDate() === cell.day) btn.classList.add('qdp__day--selected');
                    (function(day) {
                        btn.addEventListener('click', function () {
                            inst.selected = new Date(c.year, c.month, day);
                            var valueEl = inst.trigger.querySelector('.qdp-field__value');
                            valueEl.textContent = fmt(inst.selected);
                            valueEl.classList.add('qdp-field__value--has-value');
                            closePicker(inst);
                        });
                    })(cell.day);
                }
                cellEl.appendChild(btn);
                week.appendChild(cellEl);
            }
            weeksEl.appendChild(week);
        }
    }

    function renderMonths(inst) {
        var c = inst.cursor, panel = inst.panel;
        panel.querySelector('.qdp__title--year-m').textContent = c.year;
        var grid = panel.querySelector('.qdp__months-grid');
        grid.innerHTML = '';
        for (var row = 0; row < 3; row++) {
            var rowEl = document.createElement('div');
            rowEl.className = 'qdp__grid-row';
            for (var col = 0; col < 4; col++) {
                var mIdx = row * 4 + col;
                var cell = document.createElement('div');
                cell.className = 'qdp__grid-cell';
                var btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'qdp__grid-item';
                btn.textContent = MONTHS_ES_SHORT[mIdx];
                if (inst.selected && inst.selected.getFullYear() === c.year && inst.selected.getMonth() === mIdx) btn.classList.add('qdp__grid-item--selected');
                (function(m) { btn.addEventListener('click', function () { inst.cursor.month = m; showView(inst, 'cal'); }); })(mIdx);
                cell.appendChild(btn);
                rowEl.appendChild(cell);
            }
            grid.appendChild(rowEl);
        }
    }

    function renderYears(inst) {
        var c = inst.cursor, panel = inst.panel;
        var rangeStart = Math.floor(c.year / 12) * 12;
        panel.querySelector('.qdp__title--decade').textContent = rangeStart + ' – ' + (rangeStart + 11);
        var grid = panel.querySelector('.qdp__years-grid');
        grid.innerHTML = '';
        var years = [];
        for (var y = rangeStart; y <= rangeStart + 11; y++) { years.push(y); }
        for (var row = 0; row < 4; row++) {
            var rowEl = document.createElement('div');
            rowEl.className = 'qdp__grid-row';
            for (var col = 0; col < 3; col++) {
                var idx = row * 3 + col;
                if (idx >= years.length) break;
                var yr = years[idx];
                var cell = document.createElement('div');
                cell.className = 'qdp__grid-cell';
                var btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'qdp__grid-item';
                btn.textContent = yr;
                if (inst.selected && inst.selected.getFullYear() === yr) btn.classList.add('qdp__grid-item--selected');
                (function(yy) { btn.addEventListener('click', function () { inst.cursor.year = yy; showView(inst, 'months'); }); })(yr);
                cell.appendChild(btn);
                rowEl.appendChild(cell);
            }
            if (rowEl.children.length) grid.appendChild(rowEl);
        }
    }

    function showView(inst, viewName) {
        inst.panel.querySelectorAll('.qdp__view').forEach(function (v) { v.classList.remove('qdp__view--active'); });
        var target = inst.panel.querySelector('[data-qdp-view="' + viewName + '"]');
        if (target) target.classList.add('qdp__view--active');
        if (viewName === 'cal')    renderCalendar(inst);
        if (viewName === 'months') renderMonths(inst);
        if (viewName === 'years')  renderYears(inst);
    }

    function openPicker(inst) {
        var fieldRect = inst.field.getBoundingClientRect();
        var spaceBelow = window.innerHeight - fieldRect.bottom - 8;
        if (spaceBelow < 420 && fieldRect.top > spaceBelow) inst.panel.classList.add('is-up');
        else inst.panel.classList.remove('is-up');
        var ref = inst.selected || new Date();
        inst.cursor = { year: ref.getFullYear(), month: ref.getMonth() };
        buildPanel(inst);
        showView(inst, 'cal');
        inst.panel.classList.add('is-open');
        inst.trigger.setAttribute('aria-expanded', 'true');
    }

    function closePicker(inst) {
        inst.panel.classList.remove('is-open');
        inst.trigger.setAttribute('aria-expanded', 'false');
    }

    document.querySelectorAll('.qdp-field').forEach(function (field) {
        var trigger = field.querySelector('.qdp-field__input');
        var panel   = field.querySelector('.qdp');
        if (!trigger || !panel) return;
        var inst = { field: field, trigger: trigger, panel: panel,
                     cursor: { year: new Date().getFullYear(), month: new Date().getMonth() },
                     selected: null };
        trigger.addEventListener('click', function () {
            var isOpen = panel.classList.contains('is-open');
            document.querySelectorAll('.qdp.is-open').forEach(function (op) {
                if (op !== panel) { op.classList.remove('is-open'); op.closest('.qdp-field').querySelector('.qdp-field__input').setAttribute('aria-expanded', 'false'); }
            });
            if (isOpen) { closePicker(inst); } else { openPicker(inst); }
        });
        trigger.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPicker(inst); }
            if (e.key === 'Escape') closePicker(inst);
        });
        panel.addEventListener('click', function (e) {
            e.stopPropagation();
            var action = e.target.closest('[data-qdp-action]');
            if (!action) return;
            var act = action.getAttribute('data-qdp-action');
            if (act === 'prev-month') { inst.cursor.month--; if (inst.cursor.month < 0) { inst.cursor.month = 11; inst.cursor.year--; } renderCalendar(inst); }
            else if (act === 'next-month') { inst.cursor.month++; if (inst.cursor.month > 11) { inst.cursor.month = 0; inst.cursor.year++; } renderCalendar(inst); }
            else if (act === 'show-months') { showView(inst, 'months'); }
            else if (act === 'show-years')  { showView(inst, 'years');  }
            else if (act === 'prev-year-m') { inst.cursor.year--; renderMonths(inst); }
            else if (act === 'next-year-m') { inst.cursor.year++; renderMonths(inst); }
            else if (act === 'prev-decade') { inst.cursor.year -= 12; renderYears(inst); }
            else if (act === 'next-decade') { inst.cursor.year += 12; renderYears(inst); }
        });
    });

    document.addEventListener('click', function (e) {
        if (!e.target.closest('.qdp-field')) {
            document.querySelectorAll('.qdp.is-open').forEach(function (op) {
                op.classList.remove('is-open');
                var t = op.closest('.qdp-field');
                if (t) t.querySelector('.qdp-field__input').setAttribute('aria-expanded', 'false');
            });
        }
    });
}());

// ── QDPR: Date Range Picker Controller ─────────────────────────────────────
(function () {
    'use strict';

    var MONTHS_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                     'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    var DAYS_ES   = ['D','L','M','M','J','V','S'];

    var PRESETS = [
        { label: 'Esta semana', fn: function () {
            var n = new Date(), d = n.getDay();
            var mon = new Date(n); mon.setDate(n.getDate() - ((d + 6) % 7));
            var sun = new Date(mon); sun.setDate(mon.getDate() + 6);
            mon.setHours(0,0,0,0); sun.setHours(0,0,0,0);
            return { start: mon, end: sun };
        }},
        { label: 'Este mes', fn: function () {
            var n = new Date();
            var s = new Date(n.getFullYear(), n.getMonth(), 1);
            var e = new Date(n.getFullYear(), n.getMonth() + 1, 0);
            return { start: s, end: e };
        }},
        { label: 'Este trimestre', fn: function () {
            var n = new Date(), q = Math.floor(n.getMonth() / 3);
            var s = new Date(n.getFullYear(), q * 3, 1);
            var e = new Date(n.getFullYear(), q * 3 + 3, 0);
            return { start: s, end: e };
        }},
        { label: 'Este año', fn: function () {
            var y = new Date().getFullYear();
            return { start: new Date(y, 0, 1), end: new Date(y, 11, 31) };
        }}
    ];

    function pad(n) { return n < 10 ? '0' + n : '' + n; }
    function fmt(d) { return pad(d.getDate()) + '/' + pad(d.getMonth()+1) + '/' + d.getFullYear(); }
    function sameDay(a, b) {
        return a && b &&
            a.getFullYear() === b.getFullYear() &&
            a.getMonth()    === b.getMonth()    &&
            a.getDate()     === b.getDate();
    }
    function daysBetween(a, b) {
        return Math.round(Math.abs(b - a) / 86400000) + 1;
    }

    function getRightCursor(inst) {
        var m = inst.cursor.month, y = inst.cursor.year;
        return m === 11 ? { year: y + 1, month: 0 } : { year: y, month: m + 1 };
    }

    function getEffectiveEnd(inst) {
        if (inst.end) return inst.end;
        if (inst.picking && inst.hover) return inst.hover;
        return null;
    }

    function buildPanel(inst) {
        var p = inst.panel;
        p.innerHTML = '';

        var body = document.createElement('div');
        body.className = 'qdpr__body';

        var sidebar = document.createElement('div');
        sidebar.className = 'qdpr__sidebar';
        PRESETS.forEach(function (preset, i) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'qdpr__preset';
            btn.textContent = preset.label;
            btn.setAttribute('data-qdpr-preset', i);
            sidebar.appendChild(btn);
        });
        body.appendChild(sidebar);

        var cals = document.createElement('div');
        cals.className = 'qdpr__calendars';

        var leftCal = document.createElement('div');
        leftCal.className = 'qdpr__cal';
        leftCal.setAttribute('data-qdpr-side', 'left');
        leftCal.innerHTML =
            '<div class="qdpr__header">' +
                '<button type="button" class="qdpr__nav-btn" data-qdpr-action="prev-month" aria-label="Mes anterior">' +
                    '<span class="material-symbols-rounded">chevron_left</span>' +
                '</button>' +
                '<span class="qdpr__cal-title qdpr__cal-title--left"></span>' +
                '<button type="button" class="qdpr__nav-btn qdpr__nav-btn--hidden" aria-hidden="true">' +
                    '<span class="material-symbols-rounded">chevron_right</span>' +
                '</button>' +
            '</div>' +
            '<div class="qdpr__calendar">' +
                '<div class="qdpr__weekdays">' +
                    DAYS_ES.map(function (d) { return '<div class="qdpr__weekday">' + d + '</div>'; }).join('') +
                '</div>' +
                '<div class="qdpr__weeks qdpr__weeks--left"></div>' +
            '</div>';

        var rightCal = document.createElement('div');
        rightCal.className = 'qdpr__cal';
        rightCal.setAttribute('data-qdpr-side', 'right');
        rightCal.innerHTML =
            '<div class="qdpr__header">' +
                '<button type="button" class="qdpr__nav-btn qdpr__nav-btn--hidden" aria-hidden="true">' +
                    '<span class="material-symbols-rounded">chevron_left</span>' +
                '</button>' +
                '<span class="qdpr__cal-title qdpr__cal-title--right"></span>' +
                '<button type="button" class="qdpr__nav-btn" data-qdpr-action="next-month" aria-label="Mes siguiente">' +
                    '<span class="material-symbols-rounded">chevron_right</span>' +
                '</button>' +
            '</div>' +
            '<div class="qdpr__calendar">' +
                '<div class="qdpr__weekdays">' +
                    DAYS_ES.map(function (d) { return '<div class="qdpr__weekday">' + d + '</div>'; }).join('') +
                '</div>' +
                '<div class="qdpr__weeks qdpr__weeks--right"></div>' +
            '</div>';

        var divider = document.createElement('div');
        divider.className = 'qdpr__divider';

        cals.appendChild(leftCal);
        cals.appendChild(divider);
        cals.appendChild(rightCal);
        body.appendChild(cals);
        p.appendChild(body);

        var footer = document.createElement('div');
        footer.className = 'qdpr__footer';
        footer.innerHTML =
            '<span class="qdpr__count">0 días seleccionados</span>' +
            '<div class="qdpr__footer-actions">' +
                '<button type="button" class="btn btn-sm btn-outline-secondary" data-qdpr-action="cancel">Cancelar</button>' +
                '<button type="button" class="btn btn-sm btn-primary" data-qdpr-action="ok">OK</button>' +
            '</div>';
        p.appendChild(footer);
    }

    function renderCalendar(inst, side) {
        var c = side === 'left' ? inst.cursor : getRightCursor(inst);
        var panel = inst.panel;

        var titleEl = panel.querySelector('.qdpr__cal-title--' + side);
        if (titleEl) titleEl.textContent = MONTHS_ES[c.month] + ' ' + c.year;

        var weeksEl = panel.querySelector('.qdpr__weeks--' + side);
        if (!weeksEl) return;
        weeksEl.innerHTML = '';

        var today   = new Date();
        var firstDay     = new Date(c.year, c.month, 1).getDay();
        var daysInMonth  = new Date(c.year, c.month + 1, 0).getDate();
        var daysInPrev   = new Date(c.year, c.month, 0).getDate();

        var cells = [];
        for (var i = firstDay - 1; i >= 0; i--) { cells.push({ day: daysInPrev - i, adjacent: true }); }
        for (var d = 1; d <= daysInMonth; d++)   { cells.push({ day: d, adjacent: false }); }
        var remaining = (7 - (cells.length % 7)) % 7;
        for (var j = 1; j <= remaining; j++)     { cells.push({ day: j, adjacent: true }); }

        var rangeA = inst.start, rangeB = getEffectiveEnd(inst);
        if (rangeA && rangeB && rangeB < rangeA) { var tmp = rangeA; rangeA = rangeB; rangeB = tmp; }

        for (var row = 0; row < cells.length / 7; row++) {
            var week = document.createElement('div');
            week.className = 'qdpr__week';

            for (var col = 0; col < 7; col++) {
                var cell   = cells[row * 7 + col];
                var cellEl = document.createElement('div');
                cellEl.className = 'qdpr__day-cell';

                var dayEl = document.createElement('div');
                dayEl.className = 'qdpr__day';
                dayEl.textContent = cell.day;

                if (cell.adjacent) {
                    dayEl.classList.add('qdpr__day--adjacent');
                } else {
                    var cellDate = new Date(c.year, c.month, cell.day);

                    if (sameDay(cellDate, today)) dayEl.classList.add('qdpr__day--today');

                    if (rangeA && rangeB && !sameDay(rangeA, rangeB)) {
                        var isStart = sameDay(cellDate, rangeA);
                        var isEnd   = sameDay(cellDate, rangeB);
                        if (isStart) {
                            dayEl.classList.add('qdpr__day--selected');
                            cellEl.classList.add('is-range-start');
                        } else if (isEnd) {
                            dayEl.classList.add('qdpr__day--selected');
                            cellEl.classList.add('is-range-end');
                        } else if (cellDate > rangeA && cellDate < rangeB) {
                            cellEl.classList.add('is-range-middle');
                        }
                    } else if (rangeA && sameDay(cellDate, rangeA)) {
                        dayEl.classList.add('qdpr__day--selected');
                    }

                    (function (day) {
                        dayEl.addEventListener('click', function () {
                            var clicked = new Date(c.year, c.month, day);
                            if (!inst.picking) {
                                inst.start   = clicked;
                                inst.end     = null;
                                inst.hover   = null;
                                inst.picking = true;
                            } else {
                                if (clicked >= inst.start) {
                                    inst.end = clicked;
                                } else {
                                    inst.end   = inst.start;
                                    inst.start = clicked;
                                }
                                inst.picking = false;
                                inst.hover   = null;
                            }
                            renderBoth(inst);
                            updateCount(inst);
                        });

                        dayEl.addEventListener('mouseenter', function () {
                            if (inst.picking) {
                                var newHover = new Date(c.year, c.month, day);
                                if (!inst.hover || !sameDay(inst.hover, newHover)) {
                                    inst.hover = newHover;
                                    renderBoth(inst);
                                }
                            }
                        });
                    })(cell.day);
                }

                cellEl.appendChild(dayEl);
                week.appendChild(cellEl);
            }
            weeksEl.appendChild(week);
        }
    }

    function renderBoth(inst) {
        renderCalendar(inst, 'left');
        renderCalendar(inst, 'right');
    }

    function updateCount(inst) {
        var countEl = inst.panel.querySelector('.qdpr__count');
        if (!countEl) return;
        if (inst.start && inst.end) {
            var n = daysBetween(inst.start, inst.end);
            countEl.textContent = n + (n === 1 ? ' día seleccionado' : ' días seleccionados');
        } else if (inst.start) {
            countEl.textContent = '1 día seleccionado';
        } else {
            countEl.textContent = '0 días seleccionados';
        }
    }

    function updateTrigger(inst) {
        var valueEl = inst.trigger.querySelector('.qdpr-field__value');
        if (inst.start && inst.end) {
            valueEl.textContent = fmt(inst.start) + ' – ' + fmt(inst.end);
            valueEl.classList.add('qdpr-field__value--has-value');
        } else if (inst.start) {
            valueEl.textContent = fmt(inst.start) + ' – dd/mm/aaaa';
            valueEl.classList.add('qdpr-field__value--has-value');
        } else {
            valueEl.textContent = 'dd/mm/aaaa – dd/mm/aaaa';
            valueEl.classList.remove('qdpr-field__value--has-value');
        }
    }

    function openPicker(inst) {
        inst._prevStart = inst.start ? new Date(inst.start) : null;
        inst._prevEnd   = inst.end   ? new Date(inst.end)   : null;

        var rect = inst.field.getBoundingClientRect();
        if (window.innerHeight - rect.bottom < 450 && rect.top > window.innerHeight - rect.bottom) {
            inst.panel.classList.add('is-up');
        } else {
            inst.panel.classList.remove('is-up');
        }

        var ref = inst.start || new Date();
        inst.cursor = { year: ref.getFullYear(), month: ref.getMonth() };

        buildPanel(inst);
        renderBoth(inst);
        updateCount(inst);

        inst.panel.classList.add('is-open');
        inst.trigger.setAttribute('aria-expanded', 'true');
    }

    function closePicker(inst) {
        inst.panel.classList.remove('is-open');
        inst.trigger.setAttribute('aria-expanded', 'false');
        inst.hover   = null;
        inst.picking = false;
    }

    document.querySelectorAll('.qdpr-field').forEach(function (field) {
        var trigger = field.querySelector('.qdpr-field__input');
        var panel   = field.querySelector('.qdpr');
        if (!trigger || !panel) return;

        var now  = new Date();
        var inst = {
            field:   field,
            trigger: trigger,
            panel:   panel,
            cursor:  { year: now.getFullYear(), month: now.getMonth() },
            start:   null,
            end:     null,
            hover:   null,
            picking: false
        };

        trigger.addEventListener('click', function () {
            var isOpen = panel.classList.contains('is-open');
            document.querySelectorAll('.qdp.is-open').forEach(function (op) {
                op.classList.remove('is-open');
                var t = op.closest('.qdp-field');
                if (t) t.querySelector('.qdp-field__input').setAttribute('aria-expanded', 'false');
            });
            document.querySelectorAll('.qdpr.is-open').forEach(function (op) {
                if (op !== panel) {
                    op.classList.remove('is-open');
                    var t = op.closest('.qdpr-field');
                    if (t) t.querySelector('.qdpr-field__input').setAttribute('aria-expanded', 'false');
                }
            });
            if (isOpen) { closePicker(inst); } else { openPicker(inst); }
        });

        trigger.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPicker(inst); }
            if (e.key === 'Escape') closePicker(inst);
        });

        panel.addEventListener('click', function (e) {
            e.stopPropagation();

            var presetEl = e.target.closest('[data-qdpr-preset]');
            if (presetEl) {
                var idx   = parseInt(presetEl.getAttribute('data-qdpr-preset'), 10);
                var range = PRESETS[idx].fn();
                inst.start   = range.start;
                inst.end     = range.end;
                inst.picking = false;
                inst.hover   = null;
                inst.cursor  = { year: range.start.getFullYear(), month: range.start.getMonth() };
                renderBoth(inst);
                updateCount(inst);
                return;
            }

            var actionEl = e.target.closest('[data-qdpr-action]');
            if (!actionEl) return;
            var act = actionEl.getAttribute('data-qdpr-action');

            if (act === 'prev-month') {
                inst.cursor.month--;
                if (inst.cursor.month < 0) { inst.cursor.month = 11; inst.cursor.year--; }
                renderBoth(inst);
            } else if (act === 'next-month') {
                inst.cursor.month++;
                if (inst.cursor.month > 11) { inst.cursor.month = 0; inst.cursor.year++; }
                renderBoth(inst);
            } else if (act === 'cancel') {
                inst.start = inst._prevStart;
                inst.end   = inst._prevEnd;
                closePicker(inst);
            } else if (act === 'ok') {
                if (inst.start) updateTrigger(inst);
                closePicker(inst);
            }
        });

        panel.addEventListener('mouseleave', function () {
            if (inst.picking && inst.hover) {
                inst.hover = null;
                renderBoth(inst);
            }
        });
    });

    document.addEventListener('click', function (e) {
        if (!e.target.closest('.qdpr-field')) {
            document.querySelectorAll('.qdpr.is-open').forEach(function (op) {
                op.classList.remove('is-open');
                var t = op.closest('.qdpr-field');
                if (t) t.querySelector('.qdpr-field__input').setAttribute('aria-expanded', 'false');
            });
        }
    });

}());
