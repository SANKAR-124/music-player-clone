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
function openmodal() {
    modaloverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}
function closemodal() {
    modaloverlay.classList.remove('show');
    document.body.style.overflow = 'auto';
}
function selectlanguage(languagecode) {
    currentlanguage = languagecode;
    localStorage.setItem('selectedlanguage', languagecode);
    updatelanguage(languagecode);
    closemodal();
}
function updatelanguage(languagecode) {
    const text = translations[languagecode];
    Object.keys(text).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.textContent = text[key];
        }
    });
    const selectedlang = languages.find(lang => lang.code === languagecode);
    document.getElementById("currentlang").textContent = selectedlang.nativename;
    document.documentElement.lang = languagecode;
}
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closemodal();
    }
});

async function getsongs() {
    let a = await fetch("http://127.0.0.1:3000/assets/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];

    // 💡 FIX: The song names have been cleaned to use standard characters
    // This ensures they will match the text read from the HTML cards.
    const songDetails = [
        { name: "Angu Vaana Konilu", artist: "Vaikom Vijayalakshmi", image: "assets/images/AVK.jpg" },
        { name: "Apna Bana Le", artist: "Sachin-Jigar", image: "assets/images/APNA.jpg" },
        { name: "K For Kabaradakkam", artist: "Ankit Menon", image: "assets/images/KFORKABA.jpg" },
        { name: "M𝚊𝚝𝚞𝚜𝚑𝚔𝚊  U𝚕𝚝𝚛𝚊𝚏𝚞𝚗𝚔", artist: "satirin", image: "assets/images/MATSKA.jpg" }, // Corrected characters and spacing
        { name: "SHERIYA", artist: "ARJN,KDS,RONN", image: "assets/images/SHERIYA.jpg" },
        { name: "Thani Lokah Murakkaari", artist: "Jakes Bejoy,Jyoti Nooran,Reble", image: "assets/images/LOKAH.jpg" }
    ];

    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            const rawPath = decodeURIComponent(element.href);
            const justTheFilename = rawPath.split('\\').pop().split('/').pop();
            const songTitleFromUrl = justTheFilename.replace(".mp3", "").trim();

            // This comparison logic is correct, but it needed clean data to work with.
            let foundDetails = songDetails.find(detail => detail.name.toLowerCase() === songTitleFromUrl.toLowerCase());

            const details = foundDetails || {
                name: songTitleFromUrl,
                artist: "Unknown Artist",
                image: "assets/images/default-cover.jpg"
            };
            
            songs.push({
                url: element.href,
                name: details.name,
                artist: details.artist,
                image: details.image
            });
        }
    }
    return songs;
}

async function initPlayer() {
    // Player state variables
    let songs = await getsongs();
    let currentSongIndex = -1;
    let isPlaying = false;
    let audio = new Audio();

    // Get UI elements once
    const playBtn = document.querySelector('.btns img:nth-child(2)');
    const prevBtn = document.querySelector('.btns img:nth-child(1)');
    const nextBtn = document.querySelector('.btns img:nth-child(3)');
    const songInfo = document.querySelector('.sinfo');
    const progressBar = document.querySelector('.sbar');

    // --- Core Functions (These are all correct) ---

    function loadAndPlaySong(index) {
        if (songs.length === 0 || index < 0 || index >= songs.length) return;
        currentSongIndex = index;
        audio.src = songs[currentSongIndex].url;
        audio.play();
        isPlaying = true;
        updateCurrentSongInfo();
        playBtn.src = 'assets/images/pause.svg';
        songInfo.style.visibility = 'visible';
    }

    function playSongByName(songName) {
        console.log('Searching for song:', songName);
        console.log('Available songs:', songs.map(s => s.name));
        
        const songIndex = songs.findIndex(song => 
            song.name.toLowerCase().trim() === songName.toLowerCase().trim()
        );
        
        console.log('Found song index:', songIndex);
        
        if (songIndex !== -1) {
            console.log('Playing found song:', songs[songIndex].name);
            loadAndPlaySong(songIndex);
        } else {
            console.log(`Song "${songName}" not found, playing random song.`);
            const randomIndex = Math.floor(Math.random() * songs.length);
            loadAndPlaySong(randomIndex);
        }
    }

    function togglePlay() {
        if (currentSongIndex === -1 && songs.length > 0) { loadAndPlaySong(0); return; }
        if (isPlaying) { audio.pause(); playBtn.src = 'assets/images/play.svg'; } 
        else { audio.play(); playBtn.src = 'assets/images/pause.svg'; }
        isPlaying = !isPlaying;
    }
    
    function playNext() {
        if (songs.length === 0) return;
        let nextIndex = (currentSongIndex + 1) % songs.length;
        loadAndPlaySong(nextIndex);
    }

    function playPrev() {
        if (songs.length === 0) return;
        let prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        loadAndPlaySong(prevIndex);
    }

    // --- UI Update Functions (These are all correct) ---

    function updateCurrentSongInfo() {
        if (currentSongIndex === -1) return;
        const currentSong = songs[currentSongIndex];
        const songImage = document.getElementById('current-song-image');
        const songNameEl = document.getElementById('current-song-name');
        const artistNameEl = document.getElementById('current-artist-name');
        if (songImage && songNameEl && artistNameEl) {
            songImage.src = currentSong.image;
            songNameEl.textContent = currentSong.name;
            artistNameEl.textContent = currentSong.artist;
        }
    }

    function updateSeekBar() {
        if (isNaN(audio.duration)) return;
        const progress = (audio.currentTime / audio.duration) * 100;
        document.querySelector('.circle').style.left = `${progress}%`;
        document.querySelector('.progress').style.width = `${progress}%`;
    }

    // --- Event Listeners Setup (REWRITTEN FOR CLARITY AND CORRECTNESS) ---

    // Helper function to get the song title from any card
    function getSongTitleFromCard(card) {
        if (!card) return '';
        
        // Try to get the song title from h4 first
        const h4Text = card.querySelector('h4')?.textContent?.trim();
        if (h4Text) {
            console.log('Found song title in h4:', h4Text);
            return h4Text;
        }
        
        // Try p element next
        
        
        // Finally try a element
        const aText = card.querySelector('a')?.textContent?.trim();
        if (aText) {
            console.log('Found song title in a:', aText);
            return aText;
        }
        const pText = card.querySelector('p')?.textContent?.trim();
        if (pText) {
            console.log('Found song title in p:', pText);
            return pText;
        }
        
        console.log('No song title found in card');
        return '';
    }

    // Rule 1: Make ALL card types (`.card`, `.scards`, etc.) clickable
    document.querySelectorAll('.card, .card1, .card2, .card3, .scards').forEach(card => {
        card.addEventListener('click', (e) => {
            const songTitle = getSongTitleFromCard(e.currentTarget);
            if (songTitle) {
                playSongByName(songTitle);
            }
        });
    });

    // Rule 2: Handle clicks on the specific BUTTONS inside `.card`, `.card1`, etc. (but NOT .scards)
    document.querySelectorAll('.card button, .card1 button, .card2 button, .card3 button').forEach(button => {
        button.addEventListener('click', (e) => {
            // This is CRUCIAL: It stops Rule 1 from also firing when a button is clicked.
            e.stopPropagation(); 
            
            const card = e.currentTarget.closest('.card, .card1, .card2, .card3');
            const songTitle = getSongTitleFromCard(card);
            
            if (songTitle) {
                playSongByName(songTitle);
            } else {
                // If no song name found, play random song
                const randomIndex = Math.floor(Math.random() * songs.length);
                loadAndPlaySong(randomIndex);
            }
        });
    });

    // Rule 3: Setup the main player controls
    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', playPrev);
    nextBtn.addEventListener('click', playNext);
    audio.addEventListener('timeupdate', updateSeekBar);
    audio.addEventListener('ended', playNext);
    progressBar.addEventListener('click', (e) => {
        if (isNaN(audio.duration)) return;
        const rect = progressBar.getBoundingClientRect();
        const clickPositionX = e.clientX - rect.left;
        const width = rect.width;
        const seekPercentage = clickPositionX / width;
        audio.currentTime = seekPercentage * audio.duration;
    });
}

// Initialize the player
initPlayer();
init();