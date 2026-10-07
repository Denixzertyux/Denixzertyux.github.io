/* Progressive enhancement: all content remains readable without JavaScript. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const light = document.querySelector('.cursor-light');
  let frame;
  window.addEventListener('pointermove', e => {
    if (!fine.matches || reduced.matches) return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      light.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      light.classList.add('visible');
    });
  }, {passive:true});
  document.addEventListener('pointerleave', () => light.classList.remove('visible'));

  const flows = [
    ['Scraping', 'MySQL', 'EfficientNet', 'PCA', 'Faiss'],
    ['CSV / Excel', 'pandas', 'Clean dataset'],
    ['X-ray', 'TensorFlow', 'Grad-CAM', 'Web interface'],
    ['Symptoms', 'Classifiers', 'Majority vote'],
    ['Housing data', 'Encoding', 'Regression', 'Evaluation'],
    ['Catalog', 'PostgreSQL', 'SQL insights'],
    ['Transactions', 'MySQL', 'Sales analysis'],
    ['Angular', 'REST API', 'Spring Boot'],
    ['Web / PDF', 'Parsing', 'PostgreSQL', 'Angular'],
    ['REST API', 'Spring Boot', 'MongoDB']
  ];
  document.querySelectorAll('.project-card').forEach((card,i) => {
    const flow = document.createElement('ol');
    flow.className = 'project-flow';
    flow.setAttribute('aria-label', 'Project workflow');
    (flows[i] || []).forEach(label => {
      const node = document.createElement('li');node.textContent = label;flow.append(node);
    });
    card.querySelector('.project-links').before(flow);
  });

  const stats = document.querySelectorAll('[data-count]');
  const animateCount = el => {
    const target = Number(el.dataset.count);
    if (reduced.matches) return;
    const start = performance.now();
    const tick = now => {
      const p = Math.min((now-start)/850,1);
      el.textContent = Math.round(target*(1-Math.pow(1-p,3)));
      if(p<1 && !reduced.matches) requestAnimationFrame(tick);
      else el.textContent = target;
    };requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if(entry.isIntersecting){animateCount(entry.target);observer.unobserve(entry.target);}
    }),{threshold:0.6});stats.forEach(el=>observer.observe(el));
  }

  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    // Individual cards reveal when they enter view, even far down the page.
    gsap.utils.toArray('.section-heading, .timeline article, .education-card, .featured, .project-card, .skills-expanded article, .certification-grid article, .language-grid article, .about-copy, .contact-panel').forEach(el => {
      gsap.from(el,{y:24,opacity:0,duration:0.65,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 93%',once:true}});
    });
    gsap.to('.timeline',{ '--timeline-progress':'100%', ease:'none',scrollTrigger:{trigger:'.timeline',start:'top 75%',end:'bottom 60%',scrub:0.4}});
    const pipeline = document.querySelector('.data-pipeline');
    const pulses = gsap.to('.data-pipeline .connector b',{scaleX:1,transformOrigin:'left',stagger:0.35,duration:0.5,repeat:-1,repeatDelay:1.2,ease:'power1.inOut'});
    ScrollTrigger.create({trigger:pipeline,start:'top bottom',end:'bottom top',onToggle:self=>self.isActive?pulses.play():pulses.pause()});
    return () => light.classList.remove('visible');
  });
})();
