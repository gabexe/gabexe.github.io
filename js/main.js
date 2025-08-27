document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos del DOM
    const homeScreen = document.getElementById('home-screen');
    const optionsScreen = document.getElementById('options-screen');
    const gameScreen = document.getElementById('game-screen');
    const endScreen = document.getElementById('end-screen');

    const startButtonHome = document.getElementById('start-button-home');
    const optionsButtonHome = document.getElementById('options-button-home');
    const backButtonOptions = document.getElementById('back-button-options');

    const playerCountInput = document.getElementById('player-count');
    const impostorCountInput = document.getElementById('impostor-count');
    const showImpostorCategoryCheckbox = document.getElementById('show-impostor-category');
    const errorMessage = document.getElementById('error-message');

    const gameCard = document.getElementById('game-card');
    const playerTurnText = document.getElementById('player-turn-text');
    const cardBack = gameCard.querySelector('.card-back');

    const playAgainButton = document.getElementById('play-again-button');

    const messageBox = document.getElementById('message-box');
    const messageText = document.getElementById('message-text');
    const closeMessageButton = document = document.getElementById('close-message');

    let players = [];
    let currentPlayerIndex = 0;
    let currentWord = '';
    let currentCategory = '';

    // Función para cambiar de pantalla
    function showScreen(screen) {
        homeScreen.classList.add('hidden');
        optionsScreen.classList.add('hidden');
        gameScreen.classList.add('hidden');
        endScreen.classList.add('hidden');
        screen.classList.remove('hidden');
    }

    // Lógica de navegación
    optionsButtonHome.addEventListener('click', () => {
        showScreen(optionsScreen);
    });

    backButtonOptions.addEventListener('click', () => {
        showScreen(homeScreen);
    });

    closeMessageButton.addEventListener('click', () => {
        messageBox.classList.add('hidden');
    });

    // Lógica para iniciar el juego desde la pantalla de inicio
    startButtonHome.addEventListener('click', () => {
        const playerCount = parseInt(playerCountInput.value, 10);
        const impostorCount = parseInt(impostorCountInput.value, 10);

        // Validaciones
        if (playerCount < 4 || playerCount > 10) {
            errorMessage.textContent = 'El número de jugadores debe ser entre 4 y 10.';
            errorMessage.classList.remove('hidden');
            return;
        }
        if (impostorCount < 1 || impostorCount > 3) {
            errorMessage.textContent = 'El número de impostores debe ser entre 1 y 3.';
            errorMessage.classList.remove('hidden');
            return;
        }
        if (impostorCount >= playerCount) {
            errorMessage.textContent = 'El número de impostores no puede ser mayor o igual al de jugadores.';
            errorMessage.classList.remove('hidden');
            return;
        }
        errorMessage.classList.add('hidden');

        // Seleccionar una palabra y categoría al azar
        const categories = Object.keys(wordsDB);
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        currentCategory = randomCategory;
        const availableWords = wordsDB[randomCategory];
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        currentWord = availableWords[randomIndex];

        // Asignar roles a los jugadores
        players = [];
        for (let i = 0; i < playerCount; i++) {
            players.push({ role: 'normal' });
        }
        
        const impostorIndices = [];
        while (impostorIndices.length < impostorCount) {
            const randomPlayerIndex = Math.floor(Math.random() * playerCount);
            if (!impostorIndices.includes(randomPlayerIndex)) {
                impostorIndices.push(randomPlayerIndex);
            }
        }
        impostorIndices.forEach(index => {
            players[index].role = 'impostor';
        });
        
        // Mezcla los jugadores para que la posición del impostor sea aleatoria
        players.sort(() => Math.random() - 0.5);

        // Iniciar el juego
        currentPlayerIndex = 0;
        showScreen(gameScreen);
        updateCard();
    });

    // Lógica de la tarjeta
    gameCard.addEventListener('click', () => {
        // Si la tarjeta ya ha sido revelada, avanza al siguiente jugador
        if (gameCard.classList.contains('revealed')) {
            currentPlayerIndex++;
            if (currentPlayerIndex < players.length) {
                updateCard();
            } else {
                playAgainButton.textContent = 'Revelar Palabra';
                showScreen(endScreen);
            }
        } else {
            // Revela el rol del jugador
            const player = players[currentPlayerIndex];
            cardBack.innerHTML = ''; // Limpiar contenido anterior
            
            if (player.role === 'impostor') {
                let content = 'Impostor';
                if (showImpostorCategoryCheckbox.checked) {
                    content += `<br/><span class="text-sm font-light">(${currentCategory})</span>`;
                }
                cardBack.innerHTML = `<p class="word">${content}</p>`;
                cardBack.classList.remove('green-border');
                cardBack.classList.add('red-border');
            } else {
                cardBack.innerHTML = `<p class="word">${currentWord}</p>`;
                cardBack.classList.remove('red-border');
                cardBack.classList.add('green-border');
            }
            
            gameCard.classList.add('revealed');
        }
    });

    // Función para actualizar la tarjeta para el siguiente jugador
    function updateCard() {
        gameCard.classList.remove('revealed');
        playerTurnText.innerHTML = `Jugador ${currentPlayerIndex + 1} <span class="text-gray-500">- ${currentCategory}</span>`;
    }

    // Lógica para volver a jugar
    playAgainButton.addEventListener('click', () => {
        if (playAgainButton.textContent === 'Revelar Palabra') {
            playAgainButton.textContent = `Palabra: ${currentWord}`;
        } else {
            showScreen(homeScreen);
            playerCountInput.value = 4;
            impostorCountInput.value = 1;
            players = [];
        }
    });
});
