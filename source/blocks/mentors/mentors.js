import Flickity from 'flickity';

export default class Mentors {
  constructor(parent) {
    const wrapper = parent.querySelector('.mentors__wrapper');
    const slides = [].slice.call(parent.querySelectorAll('.mentors__slide'));
    if (wrapper) {
      this.fl = new Flickity(wrapper, {
        pageDots: false,
      });
    }

    this.fl.on('change', () => {
      this.constructor.setClasses(this.fl.selectedIndex, slides);
    });

    this.constructor.setClasses(this.fl.selectedIndex, slides);
  }


  static setClasses(index, slides) {
    slides.forEach((item) => {
      item.classList.remove('is-next');
      item.classList.remove('is-previous');
    });

    if (index + 1 < slides.length) {
      slides[index + 1].classList.add('is-next');
    } else {
      slides[0].classList.add('is-next');
    }

    if (index === 0) {
      slides[slides.length - 1].classList.add('is-previous');
    } else {
      slides[index - 1].classList.add('is-previous');
    }
  }
}
