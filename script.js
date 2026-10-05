const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    navToggle.querySelector('.sr-only').textContent = isOpen ? '開啟導覽選單' : '關閉導覽選單';
    siteNav.classList.toggle('open', !isOpen);
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.querySelector('.sr-only').textContent = '開啟導覽選單';
      siteNav.classList.remove('open');
    });
  });
}

const animatedElements = document.querySelectorAll('.fade-in');

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  animatedElements.forEach((element) => observer.observe(element));
} else {
  animatedElements.forEach((element) => element.classList.add('visible'));
}

const characterCarousel = document.querySelector('[data-character-carousel]');

if (characterCarousel) {
  const slides = [...characterCarousel.querySelectorAll('[data-showcase-slide]')];
  const dots = [...characterCarousel.querySelectorAll('[data-showcase-dot]')];
  const previousButton = characterCarousel.querySelector('[data-showcase-prev]');
  const nextButton = characterCarousel.querySelector('[data-showcase-next]');
  let activeIndex = 0;

  const showSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.hidden = slideIndex !== activeIndex;
    });
    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activeIndex;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
  };

  previousButton.addEventListener('click', () => showSlide(activeIndex - 1));
  nextButton.addEventListener('click', () => showSlide(activeIndex + 1));
  dots.forEach((dot) => dot.addEventListener('click', () => showSlide(Number(dot.dataset.showcaseDot))));
  characterCarousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') showSlide(activeIndex - 1);
    if (event.key === 'ArrowRight') showSlide(activeIndex + 1);
  });
}
