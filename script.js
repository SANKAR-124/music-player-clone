const translations = {
    en: {
        'current-lang': 'English',
        'modal-title': 'Choose a language',
        'modal-subtitle': 'This updates what you read on open.spotify.com'
    },
    es: {
        'current-lang': 'Español',
        'modal-title': 'Elige un idioma',
        'modal-subtitle': 'Se actualizará lo que lees en open.spotify.com.'
    },
    fr: {
        'current-lang': 'Français',
        'modal-title': 'Choisir une langue',
        'modal-subtitle': 'Cette action met à jour le texte que vous voyez sur open.spotify.com.'
    },
    de: {
        'current-lang': 'Deutsch',
        'modal-title': 'Sprache wählen',
        'modal-subtitle': 'Damit wird die Anzeigesprache auf open.spotify.com aktualisiert.'
    }
};
const languages = [
    {
        code: 'en', nativename: 'English', englishname: 'English'
    },
    {
        code: 'es', nativename: 'Español', englishname: 'Spanish'
    },
    {
        code: 'fr', nativename: 'Français', englishname: 'French'
    },
    {
        code: 'de', nativename: 'Deutsch', englishname: 'German'
    }
];
let currentlanguage = localStorage.getItem('selectedlanguage') || 'en';

const languagebtn = document.getElementById("languagebtn");
const modaloverlay = document.getElementById("modaloverlay");
const closebtn = document.getElementById("closebtn");
const languagesgrid = document.getElementById("languagesgrid");

function init() {
    createlanguageoptions();
    updatelanguage(currentlanguage);
    languagebtn.addEventListener('click', openmodal);
    closebtn.addEventListener('click', closemodal);
    modaloverlay.addEventListener('click', (e) => {
        if (e.target === modaloverlay) {
            closemodal();
        }
    });
    initHamburgerMenus();
}
function createlanguageoptions() {
    languagesgrid.innerHTML = '';

    languages.forEach(language => {
        const button = document.createElement('button');
        button.className = 'language-option';
        button.innerHTML = `
                    <div class="language-native">${language.nativename}</div>
                    <div class="language-english">${language.englishname}</div>
                `;

        button.addEventListener('click', () => {
            selectlanguage(language.code);
        });

        languagesgrid.appendChild(button);
    });
}
function openmodal(){
    modaloverlay.classList.add('show');
    document.body.style.overflow='hidden';
}
function closemodal(){
    modaloverlay.classList.remove('show');
    document.body.style.overflow='auto';
}
function selectlanguage(languagecode){
    currentlanguage=languagecode;
    localStorage.setItem('selectedlanguage',languagecode);
    updatelanguage(languagecode);
    closemodal();
}
function updatelanguage(languagecode){
    const text=translations[languagecode];
    Object.keys(text).forEach(key=>{
        const element=document.getElementById(key);
        if(element){
            element.textContent=text[key];
        }
    });
    const selectedlang=languages.find(lang=>lang.code===languagecode);
    document.getElementById("currentlang").textContent=selectedlang.nativename;
    document.documentElement.lang=languagecode;
}
document.addEventListener('keydown',(e)=>{
    if (e.key==='Escape'){
        closemodal();
    }
});

const sign=document.getElementById("sign");
sign.addEventListener('click',()=>{
    window.open("music.html","_blank");
});
const suf=document.getElementById("suf");
suf.addEventListener('click',()=>{
    window.location.href="music.html";
});

function initHamburgerMenus() {
    // Left side hamburger
    const leftHamburger = document.querySelector('.hm button');
    const leftPanel = document.querySelector('.left');
    
    leftHamburger?.addEventListener('click', () => {
        leftPanel.style.left = leftPanel.style.left === '0px' ? '-100%' : '0px';
    });

    // Nav hamburger
    const navHamburger = document.querySelector('.hm1 button');
    const navMenu = document.querySelector('.hm2');
    
    navHamburger?.addEventListener('click', (e) => {
        e.stopPropagation();
        navMenu.style.display = 'flex';
        // Toggle the active class which triggers the transition
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navMenu.style.right = '-100%';
        } else {
            navMenu.classList.add('active');
            navMenu.style.right = '0';
        }
    });

    // Close menus when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.hm') && !e.target.closest('.left')) {
            leftPanel.style.left = '-100%';
        }
        if (!e.target.closest('.hm1') && !e.target.closest('.hm2')) {
            navMenu.classList.remove('active');
            navMenu.style.right = '-100%';
        }
    });
}

init();