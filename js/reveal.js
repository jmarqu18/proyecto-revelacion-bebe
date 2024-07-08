import { getAllData } from './database.js';

function createConfetti() {
    const confetti = document.createElement('div');
    confetti.className = 'absolute w-3 h-3 rounded-full';
    
    // Posición inicial aleatoria en la parte superior
    const startX = Math.random() * 100;
    confetti.style.left = `${startX}%`;
    confetti.style.top = '-10px';
    
    // Colores variados (tonos de azul y blanco)
    const colors = [
        '#89CFF0', // Azul claro
        '#4682B4', // Azul acero
        '#1E90FF', // Azul dodger
        '#6495ED', // Azul cadete
        '#FFFFFF', // Blanco
        '#F0F8FF', // Azul alicia
        '#B0E0E6', // Azul polvo
    ];
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Ángulo de caída aleatorio (entre -30 y 30 grados)
    const angle = (Math.random() * 60 - 30) * (Math.PI / 180);
    
    // Velocidad aleatoria
    const speed = 0.5 + Math.random() * 0.5;
    
    // Tamaño del contenedor
    const containerHeight = document.getElementById('animation-container').offsetHeight;
    
    // Animación
    const animation = confetti.animate([
        { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
        { transform: `translate(${Math.sin(angle) * containerHeight * 0.5}px, ${containerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0.7 }
    ], {
        duration: 3000 / speed,
        easing: 'linear',
        iterations: 1
    });

    animation.onfinish = () => confetti.remove();

    return confetti;
}

function showConfetti() {
    const animationContainer = document.getElementById('animation-container');
    for (let i = 0; i < 200; i++) {
        setTimeout(() => {
            const confetti = createConfetti();
            animationContainer.appendChild(confetti);
        }, i * 20);  // Lanzar confeti gradualmente
    }
}

function addBabyImage() {
    const animationContainer = document.getElementById('animation-container');
    const babyImage = document.createElement('img');
    babyImage.src = 'img/baby_boy.png';
    babyImage.alt = 'Baby Boy';
    babyImage.className = 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 object-contain';
    animationContainer.appendChild(babyImage);
}

async function showStats() {
    try {
        const data = await getAllData();
        const totalParticipants = data.length;
        const correctGuesses = data.filter(user => user.guess === 'niño').length;
        const averageTime = data.reduce((sum, user) => sum + (user.time || 0), 0) / totalParticipants;
        const averageAttempts = data.reduce((sum, user) => sum + (user.attempts || 0), 0) / totalParticipants;

        document.getElementById('stats-content').innerHTML = `
            <p>Total de participantes: ${totalParticipants}</p>
            <p>Adivinaron correctamente: ${correctGuesses}</p>
            <p>Tiempo promedio: ${averageTime.toFixed(2)} segundos</p>
            <p>Intentos promedio: ${averageAttempts.toFixed(2)}</p>
        `;

        document.getElementById('stats-modal').classList.remove('hidden');
        document.getElementById('stats-modal').classList.add('flex');
    } catch (error) {
        console.error('Error al cargar las estadísticas:', error);
        alert('Hubo un error al cargar las estadísticas. Por favor, inténtalo de nuevo.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    showConfetti();
    addBabyImage();
    
    document.getElementById('stats-btn').addEventListener('click', showStats);
    
    document.getElementById('close-stats-btn').addEventListener('click', () => {
        document.getElementById('stats-modal').classList.add('hidden');
        document.getElementById('stats-modal').classList.remove('flex');
    });
});