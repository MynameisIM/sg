import PopupLoader from '@/blocks/popup/popup-loader';

export default class PopupRequest {
  constructor(images) {
    this.images = images;
    this.initPopup();
  }

  initPopup() {
    PopupLoader.load({
      name: 'popup-request',
      static: true,
    }).then((resp) => {
      this.popup = resp;
      setTimeout(() => {
        if (this.popup) {
          this.images.forEach((image) => {
            image.addEventListener('click', (e) => {
              e.preventDefault();

              this.popup.open();
            });
          });
        }
      }, 0);
    });
  }
}
