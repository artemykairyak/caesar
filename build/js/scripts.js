"use strict";

window.onload = function () {
  var encBtn = document.querySelector('.enc-btn'),
      decBtn = document.querySelector('.dec-btn'),
      resetBtn = document.querySelector('.reset-btn'),
      resetDecBtn = document.querySelector('.reset-dec-btn'),
      initText = document.querySelector('.initial-text'),
      encryptedText = document.querySelector('.encrypted-text'),
      key = document.querySelector('.key'),
      decKey = document.querySelector('.dec-key'),
      resText = document.querySelector('.result-text'),
      resDecText = document.querySelector('.result-dec-text'),
      toggleBtn = document.querySelector('.toggle-btn'),
      encryptedForm = document.querySelector('.encrypt'),
      decryptedForm = document.querySelector('.decrypt'),
      error = document.querySelector('.error'),
      rusAlphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЬЫЭЮЯ'.toLowerCase(),
      engAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.toLowerCase();
  encBtn.addEventListener('click', function () {
    if (!checkLang(initText.value) || !checkKey(key.value)) {
      error.classList.remove('hidden');
    } else {
      encrypt(initText.value);
      resText.removeAttribute('disabled');
      resetBtn.classList.remove('nonvisible');
    }
  });

  function checkKey(key) {
    if (key.match(/^[0-9]+$/)) {
      return true;
    }

    return false;
  }

  function checkLang(text) {
    if (text.match(/^[а-яё\-\.\?\!\)\(\ :]+$/)) {
      return 'rus';
    } else if (text.match(/^[a-z\-\.\?\!\)\(\ :]+$/)) {
      return 'eng';
    } else {
      return undefined;
    }
  }

  decBtn.addEventListener('click', function () {
    if (!checkLang(encryptedText.value) || !checkKey(decKey.value)) {
      error.classList.remove('hidden');
    } else {
      decrypt(encryptedText.value);
      resDecText.removeAttribute('disabled');
      resetDecBtn.classList.remove('nonvisible');
    }
  });
  toggleBtn.addEventListener('click', function () {
    error.classList.add('hidden');

    if (this.getAttribute('data-state') === 'enc') {
      document.querySelector('.rotate').classList.add('rotated');
      encryptedForm.classList.add('hidden');
      decryptedForm.classList.remove('hidden');
      this.setAttribute('data-state', 'dec');
      this.innerHTML = 'Зашифровать';
    } else {
      document.querySelector('.rotate').classList.remove('rotated');
      encryptedForm.classList.remove('hidden');
      decryptedForm.classList.add('hidden');
      this.setAttribute('data-state', 'enc');
      this.innerHTML = 'Расшифровать';
    }
  });
  resetBtn.addEventListener('click', function () {
    reset('enc');
  });
  resetDecBtn.addEventListener('click', function () {
    reset('dec');
  });
  [initText, key, encryptedText, decKey].forEach(function (item) {
    item.addEventListener('focus', function () {
      error.classList.add('hidden');
    });
  });

  function reset(type) {
    if (type === 'enc') {
      initText.value = '';
      resText.value = '';
      key.value = '';
      resText.setAttribute('disabled', true);
      resetBtn.classList.add('nonvisible');
    } else {
      encryptedText.value = '';
      resDecText.value = '';
      decKey.value = '';
      resDecText.setAttribute('disabled', true);
      resetDecBtn.classList.add('nonvisible');
    }
  } //функция, сдвигающая алфавит на количество букв shift


  function shiftAlphabet(shift, text) {
    var alphabet = '';

    if (checkLang(text) === 'rus') {
      alphabet = rusAlphabet;
    } else if (checkLang(text) === 'eng') {
      alphabet = engAlphabet;
    } else {
      return;
    }

    var shiftedAlphabet = ''; //новый алфавит 

    for (var i = 0; i < alphabet.length; i++) {
      //Текущая буква со сдвигом, если выходим за рамки длины алфавита - берем с начала алфавита
      var currentLetter = alphabet[i + shift] === undefined ? alphabet[i + shift - alphabet.length] : alphabet[i + shift];
      shiftedAlphabet = shiftedAlphabet.concat(currentLetter);
    }

    return shiftedAlphabet;
  }

  function encrypt(text) {
    var shiftedAlphabet = shiftAlphabet(parseInt(key.value), text);
    var encryptedMessage = '';

    for (var i = 0; i < text.length; i++) {
      if (text[i] == ' ') {
        encryptedMessage = encryptedMessage.concat(' ');
        continue;
      }

      ;
      var indexOfLetter = '';

      if (checkLang(text) === 'rus') {
        indexOfLetter = rusAlphabet.indexOf(text[i].toLowerCase());
      } else if (checkLang(text) === 'eng') {
        indexOfLetter = engAlphabet.indexOf(text[i].toLowerCase());
      } else {
        return;
      }

      encryptedMessage = encryptedMessage.concat(shiftedAlphabet[indexOfLetter]);
    }

    resText.value = encryptedMessage.toLowerCase();
  }

  function decrypt(text) {
    var shiftedAlphabet = shiftAlphabet(parseInt(decKey.value), text);
    var decryptedMessage = '';

    for (var i = 0; i < text.length; i++) {
      if (text[i] == ' ') {
        decryptedMessage = decryptedMessage.concat(' ');
        continue;
      }

      ;
      var indexOfLetter = shiftedAlphabet.indexOf(text[i].toLowerCase());

      if (checkLang(text) === 'rus') {
        decryptedMessage = decryptedMessage.concat(rusAlphabet[indexOfLetter]);
      } else if (checkLang(text) === 'eng') {
        decryptedMessage = decryptedMessage.concat(engAlphabet[indexOfLetter]);
      } else {
        return;
      }
    }

    resDecText.value = decryptedMessage.toLowerCase();
  }
};