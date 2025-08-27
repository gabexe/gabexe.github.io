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
    const closeMessageButton = document.getElementById('close-message');

    const categorySearch = document.getElementById('category-search');
    const categoryList = document.getElementById('category-list');

    let players = [];
    let currentPlayerIndex = 0;
    let currentWord = '';
    let currentCategory = '';

    // --- FUNCIONES ---

    // Función para cambiar de pantalla
    function showScreen(screen) {
        homeScreen.classList.add('hidden');
        optionsScreen.classList.add('hidden');
        gameScreen.classList.add('hidden');
        endScreen.classList.add('hidden');
        screen.classList.remove('hidden');
    }

    // Función para poblar la lista de categorías
    function populateCategories() {
        categoryList.innerHTML = '';
        const categories = Object.keys(wordsDB);

        categories.forEach(category => {
            const categoryId = `category-${category.replace(/\s+/g, '-')}`;

            const wrapper = document.createElement('div');
            wrapper.classList.add('flex', 'items-center', 'p-2', 'rounded-lg', 'hover:bg-gray-700');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = categoryId;
            checkbox.value = category;
            checkbox.classList.add('form-checkbox', 'h-5', 'w-5', 'text-gray-600', 'bg-gray-800', 'border-gray-600');

            const label = document.createElement('label');
            label.htmlFor = categoryId;
            label.textContent = category;
            label.classList.add('ml-3', 'text-gray-300', 'w-full', 'cursor-pointer');

            if (category.toLowerCase() === 'lol') {
                wrapper.classList.add('hidden'); // Oculto por defecto
                checkbox.checked = false;
            } else {
                checkbox.checked = true; // Marcado por defecto
            }

            wrapper.appendChild(checkbox);
            wrapper.appendChild(label);
            categoryList.appendChild(wrapper);
        });
    }

    // --- LÓGICA DE NAVEGACIÓN Y EVENTOS ---

    optionsButtonHome.addEventListener('click', () => {
        showScreen(optionsScreen);
        // Resetear el easter egg y el filtro al abrir opciones
        backButtonOptions.textContent = 'Volver';
        categorySearch.value = '';
        Array.from(categoryList.children).forEach(child => {
            child.style.display = 'flex';
        });
    });

    backButtonOptions.addEventListener('click', () => {
        showScreen(homeScreen);
    });

    closeMessageButton.addEventListener('click', () => {
        messageBox.classList.add('hidden');
    });

    // Evento para el buscador de categorías
    categorySearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toUpperCase();

        if (searchTerm === 'CARPA') {
            const lolCategory = categoryList.querySelector('input[value="Lol"]');
            if (lolCategory) {
                lolCategory.parentElement.classList.remove('hidden');
                lolCategory.checked = true;
            }
            backButtonOptions.textContent = 'Volver :)';
        } else {
            backButtonOptions.textContent = 'Volver';
        }

        Array.from(categoryList.children).forEach(child => {
            const label = child.querySelector('label');
            if (label) {
                const categoryName = label.textContent.toUpperCase();
                const lolWrapper = categoryList.querySelector('input[value="Lol"]').parentElement;

                if (categoryName.includes(searchTerm)) {
                    child.style.display = 'flex';
                } else {
                    child.style.display = 'none';
                }
                
                // Asegurarse que la categoría 'lol' se mantenga visible si se activó
                if (!lolWrapper.classList.contains('hidden')) {
                    lolWrapper.style.display = 'flex';
                }
            }
        });
    });


    // Lógica para iniciar el juego
    startButtonHome.addEventListener('click', () => {
        const playerCount = parseInt(playerCountInput.value, 10);
        const impostorCount = parseInt(impostorCountInput.value, 10);

        // Validaciones de jugadores
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

        // Validación de categorías
        const selectedCategories = Array.from(categoryList.querySelectorAll('input:checked')).map(cb => cb.value);
        if (selectedCategories.length === 0) {
            errorMessage.textContent = 'Debes seleccionar al menos una categoría.';
            errorMessage.classList.remove('hidden');
            return;
        }

        errorMessage.classList.add('hidden');

        // Seleccionar una palabra y categoría al azar de las seleccionadas
        const randomCategory = selectedCategories[Math.floor(Math.random() * selectedCategories.length)];
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
        
        // Mezcla los jugadores
        players.sort(() => Math.random() - 0.5);

        // Iniciar el juego
        currentPlayerIndex = 0;
        showScreen(gameScreen);
        updateCard();
    });

    // Lógica de la tarjeta
    gameCard.addEventListener('click', () => {
        if (gameCard.classList.contains('revealed')) {
            currentPlayerIndex++;
            if (currentPlayerIndex < players.length) {
                updateCard();
            } else {
                playAgainButton.textContent = 'Revelar Palabra';
                showScreen(endScreen);
            }
        } else {
            const player = players[currentPlayerIndex];
            cardBack.innerHTML = '';
            
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

    // Función para actualizar la tarjeta
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

    // --- INICIALIZACIÓN ---
    populateCategories();
});
