import MaskInput from 'vanilla-text-mask';

export default class PopupInputs {
  constructor() {
    const inputs = Array.from(document.querySelectorAll('.input-wrp input'));

    inputs.forEach((elem) => {
      elem.addEventListener('focus', () => {
        if (!elem.closest('.input-wrp').classList.contains('input-wrp--focus')) {
          elem.closest('.input-wrp').classList.add('input-wrp--focus');
        }
      });

      elem.addEventListener('blur', () => {
        if (elem.closest('.input-wrp').classList.contains('input-wrp--focus') &&
          (elem.value === '')) {
          elem.closest('.input-wrp').classList.remove('input-wrp--focus');
        }
      });
    });

    PopupInputs.initMask();
  }

  static initMask() {
    const telInputs = Array.from(document.querySelectorAll('popup input[type="tel"]'));

    if (telInputs > 0) {
      telInputs.forEach((input) => {
        new MaskInput({
          inputElement: input,
          mask: ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
        });
      });
    }
  }
}
