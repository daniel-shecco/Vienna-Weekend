  const chips = document.querySelectorAll('.chip');
  const events = document.querySelectorAll('.event');
  chips.forEach(chip => chip.addEventListener('click', () => {
    const f = chip.dataset.filter;
    chips.forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
    events.forEach(ev => { ev.hidden = f !== 'all' && !ev.dataset.cats.split(' ').includes(f); });
    document.querySelectorAll('section.day').forEach(sec => {
      const n = sec.querySelectorAll('.event:not([hidden])').length;
      sec.querySelector('.count').textContent = n + (n === 1 ? ' event' : ' events');
      sec.hidden = n === 0;
    });
  }));
