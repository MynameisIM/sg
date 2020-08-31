import PopupLoader from '@/blocks/popup/popup-loader';

export default class PopupSuccess {
  constructor() {
    this.initPopup();
  }

  initPopup() {
    PopupLoader.load({
      name: 'popup-success',
      static: true,
    }).then((resp) => {
      this.popup = resp;
    });
  }

  openPopup() {
    if (this.popup) {
      this.popup.open();
    }
  }
}
