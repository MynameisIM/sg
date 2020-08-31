import PopupLoader from '@/blocks/popup/popup-loader';

export default class PopupImage {
  constructor(images) {
    this.images = images;
    this.initPopup();
  }

  initPopup() {
    PopupLoader.load({
      name: 'popup-image',
      static: true,
    }).then((resp) => {
      this.popup = resp;
      setTimeout(() => {
        if (this.popup) {
          this.popupImg = this.popup.popup.querySelector('.popup-image__img');

          this.images.forEach((image) => {
            image.addEventListener('click', (e) => {
              e.preventDefault();

              this.popupImg.src = image.getAttribute('data-img-popup');
              this.popup.open();
            });
          });
        }
      }, 0);
    });
  }
}
