document.addEventListener('DOMContentLoaded', () => {
    const homeScreen = document.getElementById('home-screen');
    const optionsScreen = document.getElementById('options-screen');
    const gameScreen = document.getElementById('game-screen');
    const endScreen = document.getElementById('end-screen');
    const howToPlayScreen = document.getElementById('how-to-play-screen');

    const startButtonHome = document.getElementById('start-button-home');
    const optionsButtonHome = document.getElementById('options-button-home');
    const backButtonOptions = document.getElementById('back-button-options');
    const howToPlayButtonHome = document.getElementById('how-to-play-button-home');
    const backButtonHowToPlay = document.getElementById('back-button-how-to-play');

    const playerCountInput = document.getElementById('player-count');
    const impostorCountInput = document.getElementById('impostor-count');
    const showImpostorCategoryCheckbox = document.getElementById('show-impostor-category');
    const errorMessage = document.getElementById('error-message');

    const accompliceToggle = document.getElementById('accomplice-toggle');
    const cluelessToggle = document.getElementById('clueless-toggle');
    const specialRoleProbability = document.getElementById('special-role-probability');
    const specialRoleProbabilityValue = document.getElementById('special-role-probability-value');

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
    let distraidoWord = '';
    let currentCategory = '';

    // --- FUNCIONES ---

    function showScreen(screen) {
        const gameContainer = document.getElementById('game-container');
        homeScreen.classList.add('hidden');
        optionsScreen.classList.add('hidden');
        gameScreen.classList.add('hidden');
        endScreen.classList.add('hidden');
        howToPlayScreen.classList.add('hidden');
        
/*         if (screen === optionsScreen || screen === howToPlayScreen) {
            gameContainer.classList.add('fullscreen-container');
        } else {
            gameContainer.classList.remove('fullscreen-container');
        } */

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

    howToPlayButtonHome.addEventListener('click', () => {
        showScreen(howToPlayScreen);
    });

    backButtonHowToPlay.addEventListener('click', () => {
        showScreen(homeScreen);
    });

    specialRoleProbability.addEventListener('input', (e) => {
        specialRoleProbabilityValue.textContent = e.target.value;
    });

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
        const useAccomplice = accompliceToggle.checked;
        const useClueless = cluelessToggle.checked;
        const probability = parseInt(specialRoleProbability.value, 10);

        let specialRolesCount = 0;
        if (useAccomplice) specialRolesCount++;
        if (useClueless) specialRolesCount++;

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
        if (impostorCount + specialRolesCount >= playerCount) {
            errorMessage.textContent = 'No hay suficientes jugadores para tantos roles.';
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
        const availableWordsDistraido = wordsDB_distraido[randomCategory];
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        currentWord = availableWords[randomIndex];
        distraidoWord = availableWordsDistraido[randomIndex];

        players = [];
        for (let i = 0; i < playerCount; i++) {
            players.push({ role: 'normal' });
        }

        let availableIndices = Array.from(Array(playerCount).keys());
        
        const impostorIndices = [];
        for (let i = 0; i < impostorCount; i++) {
            const randomIndex = Math.floor(Math.random() * availableIndices.length);
            const impostorIndex = availableIndices.splice(randomIndex, 1)[0];
            players[impostorIndex].role = 'impostor';
        }

        if (useAccomplice && Math.random() * 100 < probability) {
            const randomIndex = Math.floor(Math.random() * availableIndices.length);
            const accompliceIndex = availableIndices.splice(randomIndex, 1)[0];
            players[accompliceIndex].role = 'accomplice';
        }

        if (useClueless && Math.random() * 100 < probability) {
            const randomIndex = Math.floor(Math.random() * availableIndices.length);
            const cluelessIndex = availableIndices.splice(randomIndex, 1)[0];
            players[cluelessIndex].role = 'clueless';
            players[cluelessIndex].word = distraidoWord;
        }

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
                playAgainButton.textContent = 'Revelar Roles';
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
            } else if (player.role === 'accomplice') {
                cardBack.innerHTML = `<p class="word">${currentWord}</p><p class="text-sm font-light mt-2">(Ayuda al impostor)</p>`;
                cardBack.classList.remove('red-border');
                cardBack.classList.add('green-border');
            } else if (player.role === 'clueless') {
                cardBack.innerHTML = `<p class="word">${player.word}</p>`;
                cardBack.classList.remove('red-border');
                cardBack.classList.add('green-border');
            } else { // normal
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
        if (playAgainButton.textContent === 'Revelar Roles') {
            const finalMessageEl = document.getElementById('final-message');
            
            let resultsHTML = `La palabra era: <strong>${currentWord}</strong>`;

            const impostors = players.map((p, i) => ({...p, playerNum: i + 1})).filter(p => p.role === 'impostor');
            if (impostors.length > 0) {
                resultsHTML += `<br/>Impostor(es): <strong>Jugador ${impostors.map(p => p.playerNum).join(', ')}</strong>`;
            }

            const accomplices = players.map((p, i) => ({...p, playerNum: i + 1})).filter(p => p.role === 'accomplice');
            if (accomplices.length > 0) {
                resultsHTML += `<br/>Cómplice(s): <strong>Jugador ${accomplices.map(p => p.playerNum).join(', ')}</strong>`;
            }

            const clueless = players.map((p, i) => ({...p, playerNum: i + 1})).filter(p => p.role === 'clueless');
            if (clueless.length > 0) {
                resultsHTML += `<br/>Distraído(s): <strong>Jugador ${clueless.map(p => p.playerNum).join(', ')}</strong> (su palabra era: <strong>${clueless[0].word}</strong>)`;
            }
            
            finalMessageEl.innerHTML = resultsHTML;
            playAgainButton.textContent = 'Jugar de Nuevo';
        } else {
            showScreen(homeScreen);
            document.getElementById('final-message').innerHTML = '¡Discutan quiénes son los impostores!';
            playAgainButton.textContent = 'Revelar Roles';
            playerCountInput.value = 4;
            impostorCountInput.value = 1;
            players = [];
        }
    });

    // --- INICIALIZACIÓN ---
    populateCategories();
});
