import JSR from 'mm-jsr';

export default class PopupFilter {
  constructor() {
    this.rangeSliders = [];
    this.rangeSlidersWrp = Array.from(document.querySelectorAll('.popup-mortgage-block__item--range'));
    this.stateDeal = false;
    this.counter = 0;
    this.minBuyMonth = 0;
    this.textHouseinPrice = [];
    this.input = '';
    this.value = '';
    this.tooltips = [];
    this.textPrice = '';

    if (this.rangeSliders.length === 0) {
      this.rangeSlidersWrp.forEach((sliderWrp, i) => {
        this.init(sliderWrp, i);
      });
    }

    this.tooltips.forEach((tooltipItem, i) => {
      this.textHouseinPrice[i] = +tooltipItem.getAttribute('data-condition');
    });

    this.rangeSliders.forEach((slider) => {
      slider.addEventListener('update', (input, value) => {
        if (input !== this.rangeSlidersWrp[1].querySelector('.popup-mortgage-block__slider')) {
          this.renderPercent();
        }

        console.log('this.textPrice', this.tooltips[0].querySelector('.popup-mortgage-block__tooltip-name'));
        if ((this.textPrice !== '') && (this.tooltips.length > 0)) {
          this.textHouseinPrice.forEach((item, i) => {
            if (value < this.textHouseinPrice[0]) {
              this.textPrice.innerText = this.tooltips[0].querySelector('.popup-mortgage-block__tooltip-name').innerHTML;
            } else if (value > this.textHouseinPrice[this.textHouseinPrice.length - 1]) {
              console.log('this.textPrice', this.tooltips.length);
              this.textPrice.innerText = this.tooltips[this.tooltips.length - 1].querySelector('.popup-mortgage-block__tooltip-name').innerHTML;
            } else if ((value < item) && (value > this.textHouseinPrice[i - 1])) {
              this.textPrice.innerText = this.tooltips[i - 1].querySelector('.popup-mortgage-block__tooltip-name').innerHTML;
            }
          });
        }
      });
    });
  }

  init(slider, i) {
    const rangeFrom = slider.querySelector('.popup-mortgage-block__slider');
    console.log(rangeFrom);
    this.rangeSliders[i] = new JSR([rangeFrom], {
      min: +rangeFrom.getAttribute('data-min'),
      max: +rangeFrom.getAttribute('data-max'),
      sliders: 1,
      values: [+rangeFrom.getAttribute('value')],
      labels: {
        minMax: false,
      },
      step: +rangeFrom.getAttribute('data-max') < 100 ? 1 : 100,
      grid: false,
    }).addEventListener('update', (input, value) => {
      const title = slider.querySelector('.popup-mortgage-block__value');
      title.innerText = value;

      this.value = value;
      this.input = input;
    });

    this.tooltips = Array.from(document.querySelectorAll('.popup-mortgage-block__text--price .popup-mortgage-block__tooltip-item'));
    this.textPrice = document.querySelector('.popup-mortgage-block__text--price > span');
    this.renderPercent();
  }

  refresh() {
    window.addEventListener('popupClosed', () => {
      this.rangeSliders.forEach((slider) => {
        slider.refresh();
      });
    });
  }

  renderPercent() {
    let percent = (+this.rangeSlidersWrp[2].querySelector('.popup-mortgage-block__value').innerText * 100)
      / +this.rangeSlidersWrp[0].querySelector('.popup-mortgage-block__value').innerText;
    percent = Math.round(percent);

    this.rangeSlidersWrp[2].querySelector('.popup-mortgage-block__text').innerText = `${percent} %`;
  }
}
