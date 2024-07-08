import { saveGameResults } from './database.js';

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let attempts = 0;
let startTime;
let timerInterval;
let isGameStarted = false;

const images = ['img01.png', 'img02.png', 'img03.png', 'img04.png', 'img05.png'];

function createCard(image) {
    const card = document.createElement('div');
    card.className = 'card bg-green-200 rounded-lg aspect-square cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105';
    card.innerHTML = `
        <div class="card-inner w-full h-full">
            <div class="card-front bg-green-200 w-full h-full rounded-lg flex items-center justify-center">
                <!-- Puedes añadir un ícono o texto aquí si lo deseas -->
            </div>
            <div class="card-back bg-white w-full h-full rounded-lg flex items-center justify-center bg-cover bg-center" style="background-image: url('img/${image}')"></div>
        </div>
    `;
    card.addEventListener('click', () => flipCard(card, image));
    return card;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function initGame() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = ''; // Limpia el tablero
    cards = [...images, ...images];
    shuffleArray(cards);
    cards.forEach(image => {
        gameBoard.appendChild(createCard(image));
    });
    resetGameState();
}

function resetGameState() {
    flippedCards = [];
    matchedPairs = 0;
    attempts = 0;
    isGameStarted = false;
    if (timerInterval) clearInterval(timerInterval);
    document.getElementById('time').textContent = 'Tiempo: 0s';
    document.getElementById('attempts').textContent = 'Intentos: 0';
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(updateTime, 1000);
}

function updateTime() {
    const currentTime = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById('time').textContent = `Tiempo: ${currentTime}s`;
}

function flipCard(card) {
    if (!isGameStarted) {
        isGameStarted = true;
        startTimer();
    }

    if (flippedCards.length < 2 && !flippedCards.includes(card) && !card.classList.contains('matched')) {
        card.classList.add('flipped');
        flippedCards.push(card);
        
        if (flippedCards.length === 2) {
            attempts++;
            document.getElementById('attempts').textContent = `Intentos: ${attempts}`;
            setTimeout(checkMatch, 1000);
        }
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const isMatch = card1.querySelector('.card-back').style.backgroundImage === 
                    card2.querySelector('.card-back').style.backgroundImage;
    
    if (isMatch) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        if (matchedPairs === images.length) {
            endGame();
        }
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
    }
    
    flippedCards = [];
}

async function endGame() {
    clearInterval(timerInterval);
    const finalTime = Math.floor((Date.now() - startTime) / 1000);
    try {
        await saveGameResults(finalTime, attempts);
        document.getElementById('modal').classList.remove('hidden');
        document.getElementById('modal').classList.add('flex');
    } catch (error) {
        console.error('Error al guardar los resultados:', error);
        alert('Hubo un error al guardar tus resultados. Por favor, inténtalo de nuevo.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initGame();
    document.getElementById('reveal-btn').addEventListener('click', () => {
        window.location.href = 'reveal.html';
    });
});