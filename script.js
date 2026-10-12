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
