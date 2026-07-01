// Select Múltiple — toggle dropdown + checkboxes + label dinámica

(function () {
  document.addEventListener('click', function (e) {
    // Cerrar si se clickea fuera (skip si es trigger o item)
    if (e.target.closest('.select-multiple__trigger') || e.target.closest('.select-multiple__item')) return;
    document.querySelectorAll('.select-multiple__dropdown.is-open').forEach(function (dropdown) {
      var wrapper = dropdown.closest('.select-multiple');
      dropdown.classList.remove('is-open');
      wrapper.querySelector('.select-multiple__trigger').classList.remove('is-open');
    });
  });

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('.select-multiple__trigger');
    if (!trigger) return;

    e.stopPropagation();
    var wrapper = trigger.closest('.select-multiple');
    var dropdown = wrapper.querySelector('.select-multiple__dropdown');

    trigger.classList.toggle('is-open');
    dropdown.classList.toggle('is-open');
  });

  document.addEventListener('click', function (e) {
    var item = e.target.closest('.select-multiple__item');
    if (!item) return;

    var checkbox = item.querySelector('.select-multiple__checkbox');
    checkbox.classList.toggle('is-checked');

    // Actualizar placeholder con las opciones seleccionadas
    var wrapper = item.closest('.select-multiple');
    var placeholder = wrapper.querySelector('.select-multiple__placeholder');
    var checked = wrapper.querySelectorAll('.select-multiple__checkbox.is-checked');

    if (checked.length === 0) {
      placeholder.textContent = placeholder.dataset.placeholder || 'Seleccioná una opción';
      placeholder.classList.remove('has-value');
    } else {
      var labels = Array.from(checked).map(function (cb) {
        return cb.closest('.select-multiple__item').querySelector('.select-multiple__item-label').textContent;
      });
      placeholder.textContent = labels.join(', ');
      placeholder.classList.add('has-value');
    }
  });
})();
