'use strict';

///////////////////////////////////////
// Selector
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const header = document.querySelector('.header');
const nav = document.querySelector('.nav');

const sections = document.querySelectorAll('.section');

const imgTarget = document.querySelectorAll('img[data-src]');

// Modal
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(el =>
  el.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Smooth Scroll
btnScrollTo.addEventListener('click', function (e) {
  e.preventDefault();
  section1.scrollIntoView({ behavior: 'smooth' });
});

// Smooth Scrolling
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault()
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth', });
  }
});

// Tabs
tabsContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('operations__tab')) {
    tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
    e.target.classList.add('operations__tab--active');

    tabsContent.forEach(tab => tab.classList.remove('operations__content--active'));
    document.querySelector(`.operations__content--${e.target.dataset.tab}`).classList.add('operations__content--active');
  }
});

// Mouse Hover
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const sibling = link.closest('.nav').querySelectorAll('.nav__link');
    sibling.forEach(el => {
      if (el !== link)
        el.style.opacity = this;
    });
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky Nav
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting)
    nav.classList.add('sticky');
  else
    nav.classList.remove('sticky');
}

const headerOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight + 5}px`
}

const observer = new IntersectionObserver(stickyNav, headerOptions)
observer.observe(header);


// Reveal Section
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const revealOptions = {
  root: null,
  threshold: 0.15,
}

const sectionObserver = new IntersectionObserver(revealSection, revealOptions);
sections.forEach(el => {
  el.classList.add('section--hidden');
  sectionObserver.observe(el);
});

// Lazy Load Images
const loadImg = function (entries, observe) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  else {
    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', function () {
      entry.target.classList.remove('lazy-img');
    })
  }
  observe.unobserve(entry.target);
}

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0.75,
});

imgTarget.forEach(lazyImg => imgObserver.observe(lazyImg));

// Slider
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left')
const btnRight = document.querySelector('.slider__btn--right');
let currSlide = 0;
const maxSlide = slides.length - 1;
const dotContainer = document.querySelector('.dots');

const createDot = function () {
  slides.forEach((_, i) => {
    dotContainer.innerHTML += `<button class="dots__dot" data-slide="${i}"></button>`
  });
}
createDot();

const goToSlide = function (slide) {
  slides.forEach((el, i) => {
    el.style.transform = `translateX(${100 * (i - slide)}%)`
  });
}
goToSlide(0);

const activeDots = function (slide) {
  document.querySelectorAll('.dots__dot').forEach(dot => {
    dot.classList.remove('dots__dot--active');
    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
  });
}

activeDots(currSlide)

const nextSlide = function () {
  if (currSlide === maxSlide) {
    currSlide = 0
  } else {
    currSlide++
  }
  goToSlide(currSlide);
  activeDots(currSlide);
}

const prevSlide = function () {
  if (currSlide === 0) {
    currSlide = maxSlide // curr = 4
  } else {
    currSlide--
  }
  goToSlide(currSlide);
  activeDots(currSlide);
}

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function (e) {
  e.key === 'ArrowLeft' && prevSlide();
  e.key === 'ArrowRight' && nextSlide();
});

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const slide = e.target.dataset.slide
    goToSlide(slide);
    activeDots(slide);
  }
});