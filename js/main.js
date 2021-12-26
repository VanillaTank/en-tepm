import dict from './dict.js';

window.onload = () => {
    const get_random_btn_en = $('#get_random_btn_en');
    const get_random_btn_ru = $('#get_random_btn_ru');
    const get_translate_btn_ru = $('#get_ru_btn_ru');
    const get_translate_btn_en = $('#get_ru_btn_en');

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
        get_translate_btn_en.innerText = 'Показать перевод'

        
    });
    
    get_translate_btn_en.addEventListener('click', (evt) => {
            toggleLangVision('.en');
            rewriteBntName(evt)
        })


}

// -------------------------------------
function $(el) {
    return document.querySelector(el);
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
