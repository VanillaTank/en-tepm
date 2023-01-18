import dict from './dict.js';
const DEBOUNCE_INTERVAL = 250;

window.onload = () => {
    const get_random_btn_en = $('#get_random_btn_en');
    const get_random_btn_ru = $('#get_random_btn_ru');
    const get_translate_btn_ru = $('#get_ru_btn_ru');
    const get_translate_btn_en = $('#get_ru_btn_en');
    const output_amount_word = $('#outputAmountWord');
    const sound_HP_GRIFFINDOR = $('#HP_GRIFFINDOR_SOUND')
    const btn_play = $('#btn_play');
    const word_list = $('.word-list');
    const fonter = $('#fonter');
    const img_pause = $('.img_pause');
    const img_play = $('.img_play');
    const searchInput = $('#search');
    const searchOutput = $('.search-output');
    const searchClearBtn = $('.clear-btn');

    word_list.style.fontSize = fonter;
    fonter.addEventListener('input', (evt) => {
        word_list.style.fontSize = `${evt.target.value}px`
    })


    output_amount_word.innerText = dict.length;

    btn_play.addEventListener('click', () => {
        on_click_btn_play(sound_HP_GRIFFINDOR, img_play, img_pause)
    }, false)

    sizeRenameBtn(window.innerWidth, get_translate_btn_en, get_translate_btn_ru);
    window.addEventListener(`resize`, () => {
        sizeRenameBtn(window.innerWidth, get_translate_btn_en, get_translate_btn_ru);
    }, false);

    get_random_btn_en.addEventListener('click', () => {
        getRandomWords("en", "ru");
        get_translate_btn_ru.removeAttribute("disabled");
        get_translate_btn_en.setAttribute("disabled", "disabled");
        if (window.innerWidth <= '403') {
            get_translate_btn_ru.innerText = 'ПЕРЕВОД'
        } else {
            get_translate_btn_ru.innerText = 'ПОКАЗАТЬ ПЕРЕВОД'
        }
    });

    get_translate_btn_ru.addEventListener('click', (evt) => {
        toggleLangVision('.ru');
        rewriteBntName(evt.currentTarget)
    })

    get_random_btn_ru.addEventListener('click', () => {
        getRandomWords("ru", "en");
        get_translate_btn_en.removeAttribute("disabled");
        get_translate_btn_ru.setAttribute("disabled", "disabled");
        if (window.innerWidth <= '403') {
            get_translate_btn_en.innerText = 'ПЕРЕВОД'
        } else {
            get_translate_btn_en.innerText = 'ПОКАЗАТЬ ПЕРЕВОД'
        }
    });

    get_translate_btn_en.addEventListener('click', (evt) => {
        toggleLangVision('.en');
        rewriteBntName(evt.currentTarget)
    })


    const event = new Event('click');
    get_random_btn_en.dispatchEvent(event);

    const searchInputHandler = debounce(() => { searchOnchange(searchInput.value.trim(), searchOutput) })
    searchInput.addEventListener('input', searchInputHandler);

    searchClearBtn.addEventListener('click', () => onClickClearBtn(searchInput, searchOutput))

}

// -------------------------------------
function $(el) {
    return document.querySelector(el);
}

//сам дебаунсер
function debounce(fun) {
    let lastTimeout = null;

    return function () {
        const args = arguments;
        if (lastTimeout) {
            window.clearTimeout(lastTimeout);
        }
        lastTimeout = window.setTimeout(function () {
            lastTimeout = null;
            fun.apply(null, args);
        }, DEBOUNCE_INTERVAL);
    }
}

function searchOnchange(value, output) {
    output.innerHTML = '';
    if (value === '') {
        return
    }

    let filtredDict = [];

    if (value.search(/[A-Za-z]/) !== -1) {
        const redExp = new RegExp(`\\b${value}`, 'i')
        filtredDict = dict
            .filter((el) => { return el.en.search(redExp) !== -1 })
    } else {
        const redExp = new RegExp(`^${value}`, 'i')
        dict
            .map((el) => {
                if (el.ru.indexOf(',') === -1) {
                    if (el.ru.search(redExp) !== -1) {
                        filtredDict.push(el)
                    }
                }
                else {
                    el.ru.split(', ')
                        .map(sense => {
                            if (sense.search(redExp) !== -1) {
                                filtredDict.push(el)
                            }
                        })
                }
            })
    }


    if (filtredDict.length === 0) {
        output.innerHTML += `<li> Nothing found </li>`
        return
    }

    filtredDict.map(el => output.innerHTML += `<li> ${el.en} - ${el.ru} </li>`);
}

function onClickClearBtn(searchInput, searchOutput) {
    searchInput.value = '';
    searchOutput.innerHTML = '';
    searchInput.focus();
}

function sizeRenameBtn(width, get_translate_btn_en, get_translate_btn_ru) {
    if (width <= '403') {
        if (get_translate_btn_ru.innerText === 'ПОКАЗАТЬ ПЕРЕВОД' || get_translate_btn_ru.innerText === 'ПЕРЕВОД') {
            get_translate_btn_ru.textContent = 'ПЕРЕВОД'
        } else {
            get_translate_btn_ru.textContent = 'СКРЫТЬ'
        }

        if (get_translate_btn_en.innerText === 'ПОКАЗАТЬ ПЕРЕВОД' || get_translate_btn_en.innerText === 'ПЕРЕВОД') {
            get_translate_btn_en.textContent = 'ПЕРЕВОД'
        } else {
            console.log(get_translate_btn_en.innerText);
            get_translate_btn_en.textContent = 'СКРЫТЬ'
        }
    } else {
        if (get_translate_btn_ru.innerText === 'ПОКАЗАТЬ ПЕРЕВОД' || get_translate_btn_ru.innerText === 'ПЕРЕВОД') {
            get_translate_btn_ru.textContent = 'ПОКАЗАТЬ ПЕРЕВОД'
        } else {
            get_translate_btn_ru.textContent = 'СКРЫТЬ ПЕРЕВОД'
        }

        if (get_translate_btn_en.innerText === 'ПОКАЗАТЬ ПЕРЕВОД' || get_translate_btn_en.innerText === 'ПЕРЕВОД') {
            get_translate_btn_en.textContent = 'ПОКАЗАТЬ ПЕРЕВОД'
        } else {
            console.log(get_translate_btn_en.innerText);
            get_translate_btn_en.textContent = 'СКРЫТЬ ПЕРЕВОД'
        }
    }
}

function on_click_btn_play(sound, img_play, img_pause) {
    const isSoundPlay = sound.getAttribute('data-played');
    if (isSoundPlay === 'false') {
        sound.play();
        sound.setAttribute("data-played", "true");
        img_play.classList.add('hidden');
        img_pause.classList.remove('hidden');
    } else {
        sound.pause();
        sound.setAttribute("data-played", "false");
        img_play.classList.remove('hidden');
        img_pause.classList.add('hidden');
    }

}

function getRandomWords(lang, secLang) {
    const output_random = $('#output_random');
    output_random.innerHTML = '';
    const random_indexes = crateRandomIndexes()
    for (let i = 0; i < random_indexes.length; i++) {
        output_random.innerHTML += `
            <li>
                <span class="${lang}">${dict[random_indexes[i]][lang]}</span>
                <span class="${secLang} hidden"> - ${dict[random_indexes[i]][secLang]}</span>
            </li>`;
    }

}

function crateRandomIndexes() {
    const arr = [];

    //  МЕНЯЕМ КОЛИЧЕСТВО СЛОВ ВОТ ТУТ!!!!!
    while (arr.length < 20) {
        const randomNumber = Math.floor(Math.random() * dict.length);
        if (arr.indexOf(randomNumber) > -1) continue;
        arr[arr.length] = randomNumber;
    }
    return arr;
}

function toggleLangVision(toLang) {
    const values = [...document.querySelectorAll(toLang)];
    values.forEach(el => {
        el.classList.toggle("hidden")
    })
}

function rewriteBntName(btn) {
    if (btn.innerText === 'ПОКАЗАТЬ ПЕРЕВОД') {
        btn.textContent = 'СКРЫТЬ ПЕРЕВОД'
    } else if (btn.innerText === 'СКРЫТЬ ПЕРЕВОД') {
        btn.textContent = 'ПОКАЗАТЬ ПЕРЕВОД'
    } else if (btn.innerText === 'ПЕРЕВОД') {
        btn.textContent = 'СКРЫТЬ'
    } else if (btn.innerText === 'СКРЫТЬ') {
        btn.textContent = 'ПЕРЕВОД'
    }
}
