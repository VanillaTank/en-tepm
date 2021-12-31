import dict from './dict.js';

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

    word_list.style.fontSize = fonter;
    fonter.addEventListener('input', (evt) => { word_list.style.fontSize = `${evt.target.value}px` })


    output_amount_word.innerText = dict.length;

    btn_play.addEventListener('click', () => { on_click_btn_play(sound_HP_GRIFFINDOR, img_play, img_pause) }, false)


    get_random_btn_en.addEventListener('click', () => {
        getRandomWords("en", "ru");
        get_translate_btn_ru.removeAttribute("disabled");
        get_translate_btn_en.setAttribute("disabled", "disabled");
        get_translate_btn_ru.innerText = 'Показать перевод'


    });

    get_translate_btn_ru.addEventListener('click', (evt) => {
        toggleLangVision('.ru');
        rewriteBntName(evt)
    })

    get_random_btn_ru.addEventListener('click', () => {
        getRandomWords("ru", "en");
        get_translate_btn_en.removeAttribute("disabled");
        get_translate_btn_ru.setAttribute("disabled", "disabled");
        get_translate_btn_en.innerText = 'Показать перевод';
    });

    get_translate_btn_en.addEventListener('click', (evt) => {
        toggleLangVision('.en');
        rewriteBntName(evt)
    })


    const event = new Event('click');
    btn_play.dispatchEvent(event);
    get_random_btn_en.dispatchEvent(event);

}

// -------------------------------------
function $(el) {
    return document.querySelector(el);
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

function rewriteBntName(evt) {
    if (evt.target.innerText === 'Показать перевод') {
        evt.target.innerText = 'Скрыть перевод'
    } else {
        evt.target.innerText = 'Показать перевод'
    }
}
