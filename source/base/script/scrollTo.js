export default class ScrollTo {
  constructor(options) {
    this.block = typeof options.anchor === 'string' ? document.querySelector(`${options.anchor}`) : false;
    this.header = options.header ? options.header : false;
    this.duration = typeof options.speed === 'number' ? options.speed : 1000;
    this.offset = typeof options.offset === 'number' ? options.offset : false;
    this.button = options.button ? options.button : false;

    Math.animScroll = (t, b, c, d) => {
      t /= d / 2;
      if (t < 1) return ((c / 2) * t * t) + b;
      t -= 1;
      return ((-c / 2) * ((t * (t - 2)) - 1)) + b;
    };

    if (this.button) {
      this.button.addEventListener('click', (e) => {
        e.preventDefault();

        this.scrollTo();
      });
    }
  }

  scrollTo() {
    if (this.block) {
      this.blockPos = this.calcBlockPosition();
      this.startScroll();
    }
  }

  calcBlockPosition() {
    const blockBox = this.block.getBoundingClientRect();
    let position = blockBox.top + window.pageYOffset;
    if (this.header && window.getComputedStyle(this.header).position === 'fixed') {
      position -= this.header.offsetHeight;
    }
    if (this.offset) {
      position -= this.offset;
    }
    return position;
  }

  startScroll() {
    this.element = document.documentElement;
    this.start = this.element.scrollTop;
    this.change = this.blockPos - this.start;
    this.increment = 20;
    this.currTime = 0;

    this.animateScroll();
  }

  animateScroll() {
    this.currTime += this.increment;
    this.element.scrollTop = Math.animScroll(this.currTime, this.start, this.change, this.duration);

    if (this.currTime < this.duration) {
      setTimeout(this.animateScroll.bind(this), this.increment);
    }
  }
}
