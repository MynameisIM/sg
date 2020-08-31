import PopupLoader from '@/blocks/popup/popup-loader';
import PopupFilter from '@/blocks/popup/mortgage/block/popup-mortgage-block';

export default class PopupMortgage {
  constructor(images) {
    this.images = images;
    this.initPopup();
    this.count = 0;
    this.sliders = new PopupFilter();
  }

  initPopup() {
    PopupLoader.load({
      name: 'popup-mortgage',
      static: true,
    }).then((resp) => {
      this.popup = resp;
      setTimeout(() => {
        if (this.popup) {
          this.images.forEach((image) => {
            image.addEventListener('click', (e) => {
              e.preventDefault();

              this.popup.open();
              if (this.count === 0) {
                new PopupFilter();
                this.count += 1;
              }
            });
          });
        }
      }, 0);
    });
  }
}
