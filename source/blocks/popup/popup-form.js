const { Promise } = require('es6-promise-polyfill');

export default class Form {
  constructor() {
    Form.sendingDataForm();
    const popups = Array.from(document.querySelectorAll('.popup--common'));

    document.querySelector('.popup-success a').addEventListener('click', (e) => {
      e.preventDefault();

      popups.forEach((popup) => {
        if (popup.classList.contains('popup--open')) {
          popup.classList.remove('popup--open');
        }
      });
      document.body.style.overflow = 'visible';
    });
  }

  static ajaxSendingForm(action, method, body) {
    const promise = new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4) return;
        if (xhr.status !== 200) {
          reject(xhr);
        }
        resolve(xhr.responseText);
      };
      xhr.open(method, action);
      xhr.send(body);
    });
    return promise;
  }

  static sendingDataForm() {
    const allForms = [].slice.call(document.forms);
    const regexPhone = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/;

    allForms.forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let countError = 0;
        const elementsForm = [].slice.call(form.elements);
        elementsForm.forEach((itemForm) => {
          if (!itemForm.classList.contains('submit')) {
            if (itemForm.value === '') {
              itemForm.classList.add('error');
              countError += 1;
            } else {
              itemForm.classList.remove('error');
            }
          }
          if (itemForm.getAttribute('type') === 'tel') {
            if (regexPhone.test(itemForm.value) === false) {
              countError += 1;
              itemForm.classList.add('error');
            }
          }
        });

        if (countError === 0) {
          const action = form.getAttribute('action');
          const method = form.getAttribute('method');
          const formData = new FormData(form);

          Form.ajaxSendingForm(action, method, formData).then(() => {
            const popups = Array.from(document.querySelectorAll('.popup--common'));
            const popupSuccess = document.getElementById('popup-success');

            popups.forEach((popup) => {
              if (popup.classList.contains('popup--open')) {
                popup.classList.remove('popup--open');
              }
            });
            popupSuccess.classList.add('popup--open');
            setTimeout(() => {
              form.reset();
            }, 1000);
          }, (error) => {
            console.log(error);
          });
        }
      });
    });
  }
}
