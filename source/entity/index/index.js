import Mentors from '@/blocks/mentors/mentors';
import PastEvent from '@/blocks/past-event/past-event';

require('./index.scss');

const mentors = document.querySelector('.mentors');

if (mentors) {
  new Mentors(mentors);
}

const pastEvent = document.querySelector('.past-event');

if (mentors) {
  new PastEvent(pastEvent);
}
// eslint-disable-next-line
window.gsap.registerPlugin(ScrollTrigger);

// const t1 = window.gsap.timeline({
//   scrollTrigger: {
//     trigger: '.main-block',
//     start: 'top top',
//     end: 'bottom top',
//     scrub: true,
//     markers: true,
//   },
// });
//
// t1.to('.main-block__container', {
//   duration: 0.5,
//   background: '#000',
// }).to('.main-block svg', {
//   opacity: 1,
// }).to('.main-block svg', {
//   scale: 100,
// }).to('.main-block svg', {
//   opacity: 0,
// });

const images = [].slice.call(document.querySelectorAll('.club-values__section img'));

images.forEach((el) => {
  const t1 = window.gsap.timeline({
    scrollTrigger: {
      trigger: el,
      start: 'top center',
      end: 'bottom 100%',
      scrub: true,
      markers: true,
    },
  });
  t1.to(el, {
    scale: 2.7,
  });
});

window.gsap.utils.toArray('.entry-terms__item').forEach((item) => {
  // eslint-disable-next-line
  ScrollTrigger.create({
    trigger: item,
    start: 'top top',
    pin: true,
    pinSpacing: false,
    markers: true,
  });
});

const events = [].slice.call(document.querySelectorAll('.events__item'));

events.forEach((item) => {
  const tl = window.gsap.timeline({
    scrollTrigger: {
      trigger: item,
      start: 'top bottom',
      end: 'bottom bottom',
      scrub: true,
    },
  });
  tl.from(item, {
    opacity: 0,
    y: 100,
  }).to(item, {
    opacity: 1,
    y: 0,
  });
});

// eslint-disable-next-line
ScrollTrigger.create({
  trigger: '.video',
  start: 'top top',
  end: '+= 1000px',
  // pinSpacing: false,
  pin: true,
});

window.gsap.to('.contacts__container', {
  scrollTrigger: {
    trigger: '.contacts',
    start: 'top top',
    end: 'bottom 50%',
    scrub: true,
    pin: true,
  },
  opacity: 1,
  y: 0,
});
