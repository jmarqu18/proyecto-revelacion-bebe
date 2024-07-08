import { saveUserData } from './database.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('userForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const wish = document.querySelector('input[name="wish"]:checked').value;
        const guess = document.querySelector('input[name="guess"]:checked').value;
        
        try {
            await saveUserData(name, wish, guess);
            window.location.href = 'game.html';
        } catch (error) {
            console.error('Error al guardar los datos:', error);
            alert('Hubo un error al guardar tus datos. Por favor, intenta de nuevo.');
        }
    });
});