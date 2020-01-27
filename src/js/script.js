window.onload = function() {
    let encBtn = document.querySelector('.enc-btn'),
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
        rusAlphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЬЫЪЭЮЯ'.toLowerCase(),
        engAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.toLowerCase(),
        textMask = '',
        rusRegExp = /^[а-яё0-9\/\\\-\.\,\?\!\)\(\ :\;\'\@\#\№\$\%\^\*\_\&+\n]+$/,
        engRexExp = /^[a-z0-9\/\\\-\,\.\?\!\)\(\ :\;\'\@\#\№\$\%\^\*\_\&+\n]+$/,
        maskRegExp = /^[0-9\/\\\-\.\,\?!\)\(\ :\;\'\@\#\№\$\%\^\*\_\&+\n]+$/;;

    encBtn.addEventListener('click', function() {
        if (!checkLang(initText.value.toLowerCase()) || !checkKey(key.value)) {
            error.classList.remove('hidden');
        } else {
            textMask = createMask(initText.value);
            encrypt(initText.value.toLowerCase());
            resText.removeAttribute('disabled');
            resetBtn.classList.remove('nonvisible');
        }
    });

    decBtn.addEventListener('click', function() {
        if (!checkLang(encryptedText.value.toLowerCase()) || !checkKey(decKey.value)) {
            error.classList.remove('hidden');
        } else {
            textMask = createMask(initText.value);
            decrypt(encryptedText.value.toLowerCase());
            resDecText.removeAttribute('disabled');
            resetDecBtn.classList.remove('nonvisible');
        }
    });

    toggleBtn.addEventListener('click', function() {
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

    resetBtn.addEventListener('click', function() {
        reset('enc');
    });

    resetDecBtn.addEventListener('click', function() {
        reset('dec');
    });

    [initText, key, encryptedText, decKey].forEach(item => {
        item.addEventListener('focus', function() {
            error.classList.add('hidden');
        });
    });

    [resText, resDecText].forEach(item => {
        item.addEventListener('focus', function() {
            this.select();
        });
    });

    resText.addEventListener('focus', function() {
        this.select();
    });

    function createMask(text) {
        textMask = '';
        let mask = '';
        for (let i = 0; i < text.length; i++) {
            if (text[i].toUpperCase() === text[i] &&
                !text[i].match(maskRegExp)) {
                mask += '1';
            } else if (text[i] === ' ') {
                mask += ' ';
            } else {
                mask += '0';
            }
        }
        return mask;
    }

    //creating validation
    function createFromMask(text, mask) {
        let resText = '';
        for (let i = 0; i < text.length; i++) {
            if (mask.substr(i, 1) === '1') {
                resText += text[i].toUpperCase();
            } else {
                resText += text[i];
            }
        }
        return resText;
    }

    //key validation
    function checkKey(key) {
        if (key.match(/^[0-9]+$/)) {
            return true;
        }
        return false;
    }

    //text language detection
    function checkLang(text) {
        if (text.match(rusRegExp)) {
            return 'rus';
        } else if (text.match(engRexExp)) {
            return 'eng';
        } else {
            return undefined;
        }
    }

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
            textMask = '';
        }
    }

    //shifting alphabet
    function shiftAlphabet(shift, text) {
        let alphabet = '';
        if (checkLang(text) === 'rus') {

            alphabet = rusAlphabet;
        } else if (checkLang(text) === 'eng') {

            alphabet = engAlphabet;
        } else {
            return;
        }
        let fixedShift = shift % alphabet.length;
        let shiftedAlphabet = ''; 
        for (var i = 0; i < alphabet.length; i++) {
            //Текущая буква со сдвигом, если выходим за рамки длины алфавита - берем с начала алфавита
            let currentLetter = (alphabet[i + fixedShift] === undefined) ?
                (alphabet[i + fixedShift - alphabet.length]) :
                (alphabet[i + fixedShift]);
            shiftedAlphabet = shiftedAlphabet.concat(currentLetter);
        }

        return shiftedAlphabet;
    }

    //text encryption
    function encrypt(text) {
        let shiftedAlphabet = shiftAlphabet(parseInt(key.value), text);
        let encryptedMessage = '';
        for (let i = 0; i < text.length; i++) {
            if (text[i].match(maskRegExp)) {
                encryptedMessage = encryptedMessage.concat(text[i]);
                continue
            };
            let indexOfLetter = '';
            if (checkLang(text) === 'rus') {
                indexOfLetter = rusAlphabet.indexOf(text[i].toLowerCase());

            } else if (checkLang(text) === 'eng') {
                indexOfLetter = engAlphabet.indexOf(text[i].toLowerCase());
            } else {
                return;
            }
            encryptedMessage = encryptedMessage.concat(shiftedAlphabet[indexOfLetter]);
        }
        resText.value = createFromMask(encryptedMessage, textMask);
    }

    //text decryption
    function decrypt(text) {
        let shiftedAlphabet = shiftAlphabet(parseInt(decKey.value), text);
        let decryptedMessage = '';
        for (let i = 0; i < text.length; i++) {
            if (text[i].match(maskRegExp)) {
                decryptedMessage = decryptedMessage.concat(text[i]);
                continue
            };

            let indexOfLetter = shiftedAlphabet.indexOf(text[i].toLowerCase());

            if (checkLang(text) === 'rus') {
                decryptedMessage = decryptedMessage.concat(rusAlphabet[indexOfLetter]);

            } else if (checkLang(text) === 'eng') {
                decryptedMessage = decryptedMessage.concat(engAlphabet[indexOfLetter]);
            } else {
                return;
            }
        }

        resDecText.value = createFromMask(decryptedMessage, textMask);
    }
}