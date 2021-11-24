import dict from './dict.js';

window.onload = () => {
    const get_random_btn = $('#get_random_btn');
    const get_ru_btn = $('#get_ru_btn');

    get_random_btn.addEventListener('click', () => {
        getRandomWords();
        get_ru_btn.removeAttribute("disabled");
        get_ru_btn.innerText = 'Показать перевод'
    });

    get_ru_btn.addEventListener('click', (evt) => { 
        toggleRuVision();
        rewriteBntName(evt)
    })

}

// -------------------------------------
function $(el) {
    return document.querySelector(el);
}

function getRandomWords() {
    const output_random = $('#output_random');
    output_random.innerHTML = '';
    const random_indexes = crateRandomIndexes()
    for (let i = 0; i < random_indexes.length; i++) {
        output_random.innerHTML += `
            <li>
                <span class="en">${dict[random_indexes[i]].en}</span>
                <span class="ru hidden"> - ${dict[random_indexes[i]].ru}</span>
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

function toggleRuVision() {
    const ru_words = [...document.querySelectorAll('.ru')];
    ru_words.forEach(  el => {
        el.classList.toggle("hidden")
    } )
}

function rewriteBntName(evt) {
    if(evt.target.innerText === 'Показать перевод' ) {
        evt.target.innerText = 'Скрыть перевод'
    } else {
        evt.target.innerText = 'Показать перевод'
    }
}