(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window)) return;

  if (!reduced) {
    document.documentElement.classList.add('js');
    const targets = document.querySelectorAll('.section-head, .case, .row, .ledger li, .about > *, .contact > *, .fig-pipeline');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    targets.forEach(el => { el.classList.add('reveal'); io.observe(el); });
  }

  const links = new Map([...document.querySelectorAll('.masthead nav a')].map(a => [a.hash.slice(1), a]));
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const link = links.get(e.target.id);
      if (!link) return;
      if (e.isIntersecting) {
        links.forEach(a => a.removeAttribute('aria-current'));
        link.setAttribute('aria-current', 'true');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  links.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
})();
