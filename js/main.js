document.addEventListener('DOMContentLoaded', () => {
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

    function showScreen(screen) {
        homeScreen.classList.add('hidden');
        optionsScreen.classList.add('hidden');
        gameScreen.classList.add('hidden');
        endScreen.classList.add('hidden');
        screen.classList.remove('hidden');
    }

    function populateCategories() {
        categoryList.innerHTML = '';
        const categories = Object.keys(wordsDB);

        categories.forEach(category => {
            const categoryId = `category-${category.replace(/\s+/g, '-')}`;
            const wrapper = document.createElement('div');
            wrapper.classList.add('flex', 'items-center', 'p-2', 'rounded-lg', 'hover:bg-gray-700/50');
            wrapper.dataset.categoryName = category.toLowerCase();

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
                checkbox.checked = false;
                checkbox.disabled = true; // Deshabilitado por defecto
                label.classList.add('opacity-50'); // Estilo visual para deshabilitado
            } else {
                checkbox.checked = true;
            }

            wrapper.appendChild(checkbox);
            wrapper.appendChild(label);
            categoryList.appendChild(wrapper);
        });
    }

    // --- LÓGICA DE NAVEGACIÓN Y EVENTOS ---

    optionsButtonHome.addEventListener('click', () => {
        showScreen(optionsScreen);
        backButtonOptions.textContent = 'Volver';
        categorySearch.value = '';

        // Resetear estado de "lol"
        const lolCheckbox = categoryList.querySelector('input[value="Lol"]');
        if (lolCheckbox) {
            lolCheckbox.disabled = true;
            lolCheckbox.checked = false;
            lolCheckbox.nextElementSibling.classList.add('opacity-50');
        }
        
        // Resetear visibilidad del filtro
        Array.from(categoryList.children).forEach(child => {
            child.classList.remove('hidden');
        });
    });

    backButtonOptions.addEventListener('click', () => {
        showScreen(homeScreen);
    });

    closeMessageButton.addEventListener('click', () => {
        messageBox.classList.add('hidden');
    });

    categorySearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value;
        const lolCheckbox = categoryList.querySelector('input[value="Lol"]');
        const lolLabel = lolCheckbox.nextElementSibling;

        if (searchTerm === 'CARPA') {
            lolCheckbox.disabled = false;
            lolLabel.classList.remove('opacity-50');
            backButtonOptions.textContent = 'Volver :)';
        } else {
            // No lo deshabilita si ya se activó, solo resetea el botón
            if (backButtonOptions.textContent === 'Volver :)') {
                 backButtonOptions.textContent = 'Volver';
            }
        }

        const upperSearchTerm = searchTerm.toUpperCase();
        Array.from(categoryList.children).forEach(child => {
            const categoryName = child.querySelector('label').textContent.toUpperCase();
            if (categoryName.includes(upperSearchTerm)) {
                child.classList.remove('hidden');
            } else {
                child.classList.add('hidden');
            }
        });
    });

    startButtonHome.addEventListener('click', () => {
        const playerCount = parseInt(playerCountInput.value, 10);
        const impostorCount = parseInt(impostorCountInput.value, 10);

        if (playerCount < 3 || playerCount > 100) {
            errorMessage.textContent = 'El número de jugadores debe ser entre 3 y 100.';
            errorMessage.classList.remove('hidden');
            return;
        }
        if (impostorCount < 1 || impostorCount > 100) {
            errorMessage.textContent = 'El número de impostores debe ser entre 1 y 100.';
            errorMessage.classList.remove('hidden');
            return;
        }
        if (impostorCount >= playerCount) {
            errorMessage.textContent = 'El número de impostores no puede ser mayor o igual al de jugadores.';
            errorMessage.classList.remove('hidden');
            return;
        }

        const selectedCategories = Array.from(categoryList.querySelectorAll('input:checked')).map(cb => cb.value);
        if (selectedCategories.length === 0) {
            errorMessage.textContent = 'Debes seleccionar al menos una categoría.';
            errorMessage.classList.remove('hidden');
            return;
        }

        errorMessage.classList.add('hidden');

        const randomCategory = selectedCategories[Math.floor(Math.random() * selectedCategories.length)];
        currentCategory = randomCategory;
        const availableWords = wordsDB[randomCategory];
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        currentWord = availableWords[randomIndex];

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
        
        players.sort(() => Math.random() - 0.5);

        currentPlayerIndex = 0;
        showScreen(gameScreen);
        updateCard();
    });

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

    function updateCard() {
        gameCard.classList.remove('revealed');
        playerTurnText.innerHTML = `Jugador ${currentPlayerIndex + 1} <span class="text-gray-500">- ${currentCategory}</span>`;
    }

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
