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

    const accompliceToggle = document.getElementById('accomplice-toggle');
    const cluelessToggle = document.getElementById('clueless-toggle');
    const jokerToggle = document.getElementById('joker-toggle');
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
        homeScreen.classList.add('hidden');
        optionsScreen.classList.add('hidden');
        gameScreen.classList.add('hidden');
        endScreen.classList.add('hidden');
        howToPlayScreen.classList.add('hidden');
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
                checkbox.disabled = true;
                label.classList.add('opacity-50');
            } else {
                checkbox.checked = true;
            }

            wrapper.appendChild(checkbox);
            wrapper.appendChild(label);
            categoryList.appendChild(wrapper);
        });
    }

    function createRipple(event) {
        const button = event.currentTarget;
        const circle = document.createElement("span");
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
        circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
        circle.classList.add("ripple");

        const ripple = button.getElementsByClassName("ripple")[0];

        if (ripple) {
            ripple.remove();
        }

        button.appendChild(circle);
    }

    function showToast(message) {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode === toastContainer) {
                    toastContainer.removeChild(toast);
                }
            }, 500);
        }, 1000);
    }

    // --- LÓGICA DE GUARDADO Y CARGA ---

    const SETTINGS_KEYS = {
        PLAYER_COUNT: 'impostor_playerCount',
        IMPOSTOR_COUNT: 'impostor_impostorCount',
        SHOW_IMPOSTOR_CATEGORY: 'impostor_showImpostorCategory',
        ACCOMPLICE_ENABLED: 'impostor_accompliceEnabled',
        CLUELESS_ENABLED: 'impostor_cluelessEnabled',
        JOKER_ENABLED: 'impostor_jokerEnabled',
        SPECIAL_ROLE_PROB: 'impostor_specialRoleProb',
        ENABLED_CATEGORIES: 'impostor_enabledCategories'
    };

    function saveSettings() {
        localStorage.setItem(SETTINGS_KEYS.PLAYER_COUNT, playerCountInput.value);
        localStorage.setItem(SETTINGS_KEYS.IMPOSTOR_COUNT, impostorCountInput.value);
        localStorage.setItem(SETTINGS_KEYS.SHOW_IMPOSTOR_CATEGORY, showImpostorCategoryCheckbox.checked);
        localStorage.setItem(SETTINGS_KEYS.ACCOMPLICE_ENABLED, accompliceToggle.checked);
        localStorage.setItem(SETTINGS_KEYS.CLUELESS_ENABLED, cluelessToggle.checked);
        localStorage.setItem(SETTINGS_KEYS.JOKER_ENABLED, jokerToggle.checked);
        localStorage.setItem(SETTINGS_KEYS.SPECIAL_ROLE_PROB, specialRoleProbability.value);

        const enabledCategories = Array.from(categoryList.querySelectorAll('input[type="checkbox"]'))
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        localStorage.setItem(SETTINGS_KEYS.ENABLED_CATEGORIES, JSON.stringify(enabledCategories));
    }

    function loadSettings() {
        const playerCount = localStorage.getItem(SETTINGS_KEYS.PLAYER_COUNT);
        if (playerCount) playerCountInput.value = playerCount;

        const impostorCount = localStorage.getItem(SETTINGS_KEYS.IMPOSTOR_COUNT);
        if (impostorCount) impostorCountInput.value = impostorCount;

        const showImpostorCategory = localStorage.getItem(SETTINGS_KEYS.SHOW_IMPOSTOR_CATEGORY);
        if (showImpostorCategory !== null) showImpostorCategoryCheckbox.checked = (showImpostorCategory === 'true');

        const accompliceEnabled = localStorage.getItem(SETTINGS_KEYS.ACCOMPLICE_ENABLED);
        if (accompliceEnabled !== null) accompliceToggle.checked = (accompliceEnabled === 'true');

        const cluelessEnabled = localStorage.getItem(SETTINGS_KEYS.CLUELESS_ENABLED);
        if (cluelessEnabled !== null) cluelessToggle.checked = (cluelessEnabled === 'true');

        const jokerEnabled = localStorage.getItem(SETTINGS_KEYS.JOKER_ENABLED);
        if (jokerEnabled !== null) jokerToggle.checked = (jokerEnabled === 'true');

        const specialRoleProb = localStorage.getItem(SETTINGS_KEYS.SPECIAL_ROLE_PROB);
        if (specialRoleProb) {
            specialRoleProbability.value = specialRoleProb;
            specialRoleProbabilityValue.textContent = specialRoleProb;
        }

        const enabledCategoriesJSON = localStorage.getItem(SETTINGS_KEYS.ENABLED_CATEGORIES);
        if (enabledCategoriesJSON) {
            try {
                const enabledCategories = JSON.parse(enabledCategoriesJSON);
                Array.from(categoryList.querySelectorAll('input[type="checkbox"]')).forEach(cb => {
                    // No marcar 'lol' por defecto, solo si está explícitamente en las categorías guardadas
                    if (cb.value.toLowerCase() !== 'lol') {
                        cb.checked = enabledCategories.includes(cb.value);
                    }
                });
            } catch (e) {
                console.error("Error parsing enabled categories from localStorage", e);
            }
        }
    }

    // --- LÓGICA DE NAVEGACIÓN Y EVENTOS ---

    howToPlayButtonHome.addEventListener('click', () => showScreen(howToPlayScreen));
    backButtonHowToPlay.addEventListener('click', () => showScreen(homeScreen));
    backButtonOptions.addEventListener('click', () => showScreen(homeScreen));
    closeMessageButton.addEventListener('click', () => messageBox.classList.add('hidden'));

    specialRoleProbability.addEventListener('input', (e) => {
        specialRoleProbabilityValue.textContent = e.target.value;
        saveSettings();
    });

    optionsButtonHome.addEventListener('click', () => {
        showScreen(optionsScreen);
        loadSettings(); // Cargar configuraciones al abrir la pantalla de opciones
        backButtonOptions.textContent = 'Volver';
        categorySearch.value = '';
        
        const lolCheckbox = categoryList.querySelector('input[value="Lol"]');
        if (lolCheckbox && !lolCheckbox.disabled) {
            // Si el easter egg estaba activo, no lo reseteamos al entrar a opciones
        } else if (lolCheckbox) {
            lolCheckbox.disabled = true;
            // lolCheckbox.checked = false; // Dejar que loadSettings maneje el estado
            lolCheckbox.nextElementSibling.classList.add('opacity-50');
        }
        
        Array.from(categoryList.children).forEach(child => {
            child.classList.remove('hidden');
        });
    });

    categorySearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toUpperCase();
        const lolCheckbox = categoryList.querySelector('input[value="Lol"]');
        const lolLabel = lolCheckbox.nextElementSibling;

        if (searchTerm === 'CARPA') {
            lolCheckbox.disabled = false;
            lolLabel.classList.remove('opacity-50');
            backButtonOptions.textContent = 'Volver :)';
        } else if (searchTerm === '') {
             if (backButtonOptions.textContent === 'Volver :)') {
                 backButtonOptions.textContent = 'Volver';
            }
        }

        Array.from(categoryList.children).forEach(child => {
            const categoryName = child.dataset.categoryName.toUpperCase();
            child.classList.toggle('hidden', !categoryName.includes(searchTerm));
        });
    });

    startButtonHome.addEventListener('click', () => {
        const playerCount = parseInt(playerCountInput.value, 10);
        const impostorCount = parseInt(impostorCountInput.value, 10);
        const useAccomplice = accompliceToggle.checked;
        const useClueless = cluelessToggle.checked;
        const useJoker = jokerToggle.checked;
        const probability = parseInt(specialRoleProbability.value, 10);

        let specialRolesCount = (useAccomplice ? 1 : 0) + (useClueless ? 1 : 0) + (useJoker ? 1 : 0);

        if (playerCount < 3 || playerCount > 100) {
            return showToast('Jugadores: 3-100');
        }
        if (impostorCount < 1 || impostorCount > 100) {
            return showToast('Impostores: 1-100');
        }
        if (impostorCount >= playerCount) {
            return showToast('Más impostores que jugadores');
        }

        if (impostorCount + specialRolesCount >= playerCount) {
            return showToast('No hay suficientes jugadores');
        }

        const selectedCategories = Array.from(categoryList.querySelectorAll('input:checked')).map(cb => cb.value);
        if (selectedCategories.length === 0) {
            return showToast('Selecciona una categoría');
        }

        const randomCategory = selectedCategories[Math.floor(Math.random() * selectedCategories.length)];
        currentCategory = randomCategory;
        const availableWords = wordsDB[randomCategory];
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        const wordPair = availableWords[randomIndex];
        currentWord = wordPair.normal;
        distraidoWord = wordPair.distraido;

        players = Array(playerCount).fill(0).map(() => ({ role: 'normal' }));

        let availableIndices = Array.from(Array(playerCount).keys());
        
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

        if (useJoker && Math.random() * 100 < probability) {
            const randomIndex = Math.floor(Math.random() * availableIndices.length);
            const jokerIndex = availableIndices.splice(randomIndex, 1)[0];
            players[jokerIndex].role = 'joker';
        }

        players.sort(() => Math.random() - 0.5);

        const impostorPlayers = players.map((p, i) => ({...p, index: i})).filter(p => p.role === 'impostor');
        const accomplicePlayers = players.map((p, i) => ({...p, index: i})).filter(p => p.role === 'accomplice');

        if (accomplicePlayers.length > 0 && impostorPlayers.length > 0) {
            const impostorPlayerNumbers = impostorPlayers.map(p => p.index + 1);
            accomplicePlayers.forEach(accomplice => {
                players[accomplice.index].impostorNumbers = impostorPlayerNumbers;
            });

            const accomplicePlayerNumbers = accomplicePlayers.map(p => p.index + 1);
            impostorPlayers.forEach(impostor => {
                players[impostor.index].accompliceNumbers = accomplicePlayerNumbers;
            });
        }

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
            
            switch (player.role) {
                case 'impostor':
                    let impostorContent = 'Impostor';
                    if (showImpostorCategoryCheckbox.checked) {
                        impostorContent += `<br/><span class="text-sm font-light">(Categoria ${currentCategory})</span>`;
                    }
                    if (player.accompliceNumbers && player.accompliceNumbers.length > 0) {
                        const accompliceText = player.accompliceNumbers.length > 1 ? `Tus cómplices son los jugadores: ${player.accompliceNumbers.join(', ')}` : `El jugador ${player.accompliceNumbers[0]} es tu cómplice`;
                        impostorContent += `<br/><span class="text-sm font-light">${accompliceText}</span>`;
                    }
                    cardBack.innerHTML = `<p class="word">${impostorContent}</p>`;
                    cardBack.classList.add('red-border');
                    cardBack.classList.remove('green-border');
                    break;
                case 'accomplice':
                    const impostorText = player.impostorNumbers.length > 1 ? `Los jugadores ${player.impostorNumbers.join(', ')} son los impostores, ayúdalos a ganar` : `El jugador ${player.impostorNumbers[0]} es el impostor, ayúdalo a ganar`;
                    let accompliceContent;
                    if (currentCategory === 'Cine') {
                        accompliceContent = `<p class="word">${currentWord.title}</p><p class="word-translation">${currentWord.translation}</p>`;
                    } else {
                        accompliceContent = `<p class="word">${currentWord}</p><p class="text-sm font-light mt-2">(Categoria ${currentCategory})</p>`;
                    }
                    accompliceContent += `<p class="text-sm font-light mt-2">${impostorText}</p>`;
                    cardBack.innerHTML = accompliceContent;
                    cardBack.classList.add('red-border');
                    cardBack.classList.remove('green-border');
                    break;
                case 'joker':
                    cardBack.innerHTML = `<p class="word">Joker</p><p class="text-sm font-light mt-2">(Tu objetivo es ser eliminado)</p><p class="word">${currentWord}</p><p class="text-sm font-light mt-2">(Categoria ${currentCategory})</p>`;
                    cardBack.classList.add('purple-border');
                    cardBack.classList.remove('red-border', 'green-border');
                    break;
                case 'clueless':
                    let cluelessContent;
                    if (currentCategory === 'Cine') {
                        cluelessContent = `<p class="word">${player.word.title}</p><p class="word-translation">${player.word.translation}</p>`;
                    } else {
                        cluelessContent = `<p class="word">${player.word}</p><p class="text-sm font-light mt-2">(Categoria ${currentCategory})</p>`;
                    }
                    cardBack.innerHTML = cluelessContent;
                    cardBack.classList.add('green-border');
                    cardBack.classList.remove('red-border');
                    break;
                default: // normal
                    let normalContent;
                    if (currentCategory === 'Cine') {
                        normalContent = `<p class="word">${currentWord.title}</p><p class="word-translation">${currentWord.translation}</p>`;
                    } else {
                        normalContent = `<p class="word">${currentWord}</p><p class="text-sm font-light mt-2">(Categoria ${currentCategory})</p>`;
                    }
                    cardBack.innerHTML = normalContent;
                    cardBack.classList.add('green-border');
                    cardBack.classList.remove('red-border');
            }
            
            gameCard.classList.add('revealed');
        }
    });

    function updateCard() {
        gameCard.classList.remove('revealed');
        playerTurnText.innerHTML = `Jugador ${currentPlayerIndex + 1}`;
    }

    playAgainButton.addEventListener('click', () => {
        if (playAgainButton.textContent === 'Revelar Roles') {
            const finalMessageEl = document.getElementById('final-message');
            
            const wordToDisplay = currentCategory === 'Cine' ? currentWord.title : currentWord;
            let resultsHTML = `La palabra era: <strong>${wordToDisplay}</strong>`;

            const rolePlayers = (role) => players.map((p, i) => ({...p, playerNum: i + 1})).filter(p => p.role === role);

            const impostors = rolePlayers('impostor');
            if (impostors.length > 0) resultsHTML += `<br/>Impostor(es): <strong>Jugador ${impostors.map(p => p.playerNum).join(', ')}</strong>`;

            const accomplices = rolePlayers('accomplice');
            if (accomplices.length > 0) resultsHTML += `<br/>Cómplice(s): <strong>Jugador ${accomplices.map(p => p.playerNum).join(', ')}</strong>`;

            const clueless = rolePlayers('clueless');
            if (clueless.length > 0) {
                const cluelessWordToDisplay = currentCategory === 'Cine' ? clueless[0].word.title : clueless[0].word;
                resultsHTML += `<br/>Distraído(s): <strong>Jugador ${clueless.map(p => p.playerNum).join(', ')}</strong> (su palabra era: <strong>${cluelessWordToDisplay}</strong>)`;
            }

            const joker = rolePlayers('joker');
            if (joker.length > 0) {
                resultsHTML += `<br/>Joker: <strong>Jugador ${joker.map(p => p.playerNum).join(', ')}</strong>`;
            }
            
            finalMessageEl.innerHTML = resultsHTML;
            playAgainButton.textContent = 'Jugar de Nuevo';
        } else {
            showScreen(homeScreen);
            document.getElementById('final-message').innerHTML = '¡Discutan quiénes son los impostores!';
            playAgainButton.textContent = 'Revelar Roles';
            players = [];
        }
    });

    // --- INICIALIZACIÓN ---
    populateCategories();
    loadSettings();

    // Event listeners para guardar settings
    playerCountInput.addEventListener('change', saveSettings);
    impostorCountInput.addEventListener('change', saveSettings);
    showImpostorCategoryCheckbox.addEventListener('change', saveSettings);
    accompliceToggle.addEventListener('change', saveSettings);
    cluelessToggle.addEventListener('change', saveSettings);
    jokerToggle.addEventListener('change', saveSettings);
    categoryList.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            saveSettings();
        }
    });

    const buttons = document.querySelectorAll(".btn-monochrome");
    buttons.forEach(button => {
        button.addEventListener("click", createRipple);
    });
});
