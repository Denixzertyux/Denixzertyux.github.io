(() => {
  const query = document.querySelector('.query');
  const select = document.getElementById('stack');
  const items = [...document.querySelectorAll('.projects .item')];
  if (query && select) {
    const counts = new Map();
    items.forEach(it => it.dataset.stack.split(',').forEach(t => counts.set(t, (counts.get(t) || 0) + 1)));
    const options = [['any', items.length], ...[...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))];
    options.forEach(([name, n]) => select.add(new Option(name, name)));
    const rows = query.querySelector('.rows');
    const apply = () => {
      const v = select.value;
      let shown = 0;
      items.forEach(it => {
        const match = v === 'any' || it.dataset.stack.split(',').includes(v);
        it.hidden = !match;
        if (match) shown++;
      });
      document.querySelectorAll('.projects .group').forEach(g => {
        let el = g.nextElementSibling, any = false;
        while (el && el.classList.contains('item')) { if (!el.hidden) any = true; el = el.nextElementSibling; }
        g.hidden = !any;
      });
      const panel = document.querySelector('.projects');
      panel.querySelectorAll('.first-visible').forEach(el => el.classList.remove('first-visible'));
      const first = [...panel.children].find(el => !el.hidden);
      if (first) first.classList.add('first-visible');
      rows.textContent = `${shown} ${shown === 1 ? 'row' : 'rows'}`;
    };
    select.addEventListener('change', apply);
    apply();
    query.hidden = false;
  }

  if (!('IntersectionObserver' in window)) return;

  const activity = document.getElementById('activity');
  const cal = activity && activity.querySelector('.cal');
  if (cal && window.fetch) {
    fetch('https://github-contributions-api.jogruber.de/v4/Denixzertyux?y=last')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        const days = (data.contributions || []).filter(d => d.date);
        if (!days.length) return;
        const total = days.reduce((n, d) => n + d.count, 0);
        const fmt = new Intl.DateTimeFormat('en', { month: 'short' });
        const long = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' });
        const first = new Date(days[0].date + 'T00:00:00');
        const offset = first.getDay();
        const frag = document.createDocumentFragment();
        const weeks = Math.ceil((days.length + offset) / 7);
        let lastMonth = -1;
        for (let w = 0; w < weeks; w++) {
          const i = w * 7 - offset;
          const day = days[Math.max(i, 0)];
          const month = new Date(day.date + 'T00:00:00').getMonth();
          if (month !== lastMonth && w < weeks - 2) {
            const m = document.createElement('span');
            m.className = 'm';
            m.style.gridColumn = `${w + 1} / span 3`;
            m.textContent = fmt.format(new Date(day.date + 'T00:00:00'));
            frag.append(m);
            lastMonth = month;
          }
        }
        days.forEach((d, i) => {
          const cell = document.createElement('span');
          const pos = i + offset;
          cell.className = `d l${d.level}`;
          cell.style.gridColumn = Math.floor(pos / 7) + 1;
          cell.style.gridRow = (pos % 7) + 2;
          cell.title = `${d.count} ${d.count === 1 ? 'contribution' : 'contributions'} on ${long.format(new Date(d.date + 'T00:00:00'))}`;
          frag.append(cell);
        });
        cal.append(frag);
        const label = `${total} contributions on GitHub in the last year`;
        cal.setAttribute('aria-label', label);
        activity.querySelector('.cal-total').textContent = label + '.';
        activity.hidden = false;
        const scroller = activity.querySelector('.cal-scroll');
        scroller.scrollLeft = scroller.scrollWidth;
      })
      .catch(() => {});
  }

  const links = new Map([...document.querySelectorAll('.top nav a')].map(a => [a.hash.slice(1), a]));
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.removeAttribute('aria-current'));
      links.get(e.target.id)?.setAttribute('aria-current', 'true');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  links.forEach((_, id) => {
    const s = document.getElementById(id);
    if (s) spy.observe(s);
  });
})();
