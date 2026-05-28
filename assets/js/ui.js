/**
 * ui.js
 * Manages DOM manipulation and visual updates for the Anti-Procrastination Quest application.
 */

const UI = {
    // DOM Elements Cache
    elements: {
        loginForm: null,
        nameInput: null,
        charCounter: null,
        classCards: null,
        submitButton: null,
        errorMessage: null,

        // Missions Page DOM Elements
        missionForm: null,
        missionName: null,
        missionDesc: null,
        missionCategory: null,
        missionDifficulty: null,
        missionCooldown: null,
        missionSubmitBtn: null,
        missionError: null,
        missionsListContainer: null,

        // Live Preview elements
        previewCard: null,
        previewName: null,
        previewDesc: null,
        previewCategoryIcon: null,
        previewCategoryText: null,
        previewRarity: null,
        previewExp: null,
        previewCooldown: null
    },

    /**
     * Initializes the UI module by caching common DOM elements.
     */
    init() {
        this.elements.loginForm = document.getElementById('login-form');
        this.elements.nameInput = document.getElementById('player-name');
        this.elements.charCounter = document.getElementById('char-counter');
        this.elements.classCards = document.querySelectorAll('.class-card:not(.locked)');
        this.elements.submitButton = document.getElementById('btn-submit');
        this.elements.errorMessage = document.getElementById('error-message');
    },

    /**
     * Set up class card visual selection behavior.
     * @param {Function} onClassChange - Callback when a class card is chosen.
     */
    setupClassSelection(onClassChange) {
        this.elements.classCards.forEach(card => {
            card.addEventListener('click', () => {
                // Clear selection on other cards
                this.elements.classCards.forEach(c => c.classList.remove('selected'));
                
                // Mark current card as selected
                card.classList.add('selected');
                
                // Execute callback if provided
                if (typeof onClassChange === 'function') {
                    onClassChange(card.dataset.class);
                }
            });
        });
    },

    /**
     * Updates the character counter element's text.
     * @param {number} currentLength - The current length of the text.
     */
    updateCharacterCounter(currentLength) {
        if (this.elements.charCounter) {
            this.elements.charCounter.textContent = `${currentLength}/30`;
            
            // Add warning classes based on limits
            if (currentLength > 30 || currentLength === 0) {
                this.elements.charCounter.classList.add('invalid');
            } else {
                this.elements.charCounter.classList.remove('invalid');
            }
        }
    },

    /**
     * Enables or disables the submit button.
     * @param {boolean} isDisabled - True to disable, false to enable.
     */
    setSubmitButtonState(isDisabled) {
        if (this.elements.submitButton) {
            this.elements.submitButton.disabled = isDisabled;
            if (isDisabled) {
                this.elements.submitButton.classList.add('disabled');
            } else {
                this.elements.submitButton.classList.remove('disabled');
            }
        }
    },

    /**
     * Shows a message below the input field if needed.
     * @param {string} message - Message text.
     */
    showError(message) {
        if (this.elements.errorMessage) {
            this.elements.errorMessage.textContent = message;
            this.elements.errorMessage.classList.add('visible');
        }
    },

    /**
     * Hides the error message.
     */
    hideError() {
        if (this.elements.errorMessage) {
            this.elements.errorMessage.textContent = '';
            this.elements.errorMessage.classList.remove('visible');
        }
    },

    /**
     * Retrieves the input values from DOM.
     * @returns {Object} { name, selectedClass }
     */
    getFormValues() {
        const name = this.elements.nameInput ? this.elements.nameInput.value.trim() : '';
        const selectedCard = document.querySelector('.class-card.selected');
        const selectedClass = selectedCard ? selectedCard.dataset.class : '';
        return { name, selectedClass };
    },

    /**
     * Initializes the UI module elements for the missions page.
     */
    initMissions() {
        this.elements.missionForm = document.getElementById('mission-form');
        this.elements.missionName = document.getElementById('mission-name');
        this.elements.missionDesc = document.getElementById('mission-desc');
        this.elements.missionCategory = document.getElementById('mission-category');
        this.elements.missionDifficulty = document.getElementById('mission-difficulty');
        this.elements.missionCooldown = document.getElementById('mission-cooldown');
        this.elements.missionSubmitBtn = document.getElementById('btn-mission-submit');
        this.elements.missionError = document.getElementById('mission-error-message');
        this.elements.missionsListContainer = document.getElementById('missions-list');

        // Live Preview
        this.elements.previewCard = document.getElementById('preview-card');
        this.elements.previewName = document.getElementById('preview-name');
        this.elements.previewDesc = document.getElementById('preview-desc');
        this.elements.previewCategoryIcon = document.getElementById('preview-category-icon');
        this.elements.previewCategoryText = document.getElementById('preview-category-text');
        this.elements.previewRarity = document.getElementById('preview-rarity');
        this.elements.previewExp = document.getElementById('preview-exp');
        this.elements.previewCooldown = document.getElementById('preview-cooldown');
    },

    /**
     * Maps difficulty and cooldown values to corresponding rarity string and class.
     * @param {string} difficulty - e.g. 'facil', 'medio', 'dificil', 'epico'
     * @param {number} cooldown - cooldown in hours
     * @returns {Object} { text, rarityClass }
     */
    calculateRarity(difficulty, cooldown) {
        let text = 'Común';
        let rarityClass = 'rarity-common';

        if (difficulty === 'medio') {
            text = 'Poco Común';
            rarityClass = 'rarity-uncommon';
        } else if (difficulty === 'dificil') {
            text = 'Raro';
            rarityClass = 'rarity-rare';
        } else if (difficulty === 'epico') {
            if (cooldown >= 24) {
                text = 'Legendario';
                rarityClass = 'rarity-legendary';
            } else {
                text = 'Épico';
                rarityClass = 'rarity-epic';
            }
        }

        return { text, rarityClass };
    },

    /**
     * Maps category string to an emoji.
     * @param {string} category - Category identifier.
     * @returns {string} Emoji representing the category.
     */
    getCategoryIcon(category) {
        const icons = {
            estudio: '📚',
            trabajo: '💻',
            limpieza: '🧹',
            bienestar: '🧘',
            creatividad: '🎨'
        };
        return icons[category] || '⚔️';
    },

    /**
     * Map category code to display label.
     * @param {string} category
     */
    getCategoryLabel(category) {
        const labels = {
            estudio: 'Estudio',
            trabajo: 'Trabajo',
            limpieza: 'Limpieza',
            bienestar: 'Bienestar',
            creatividad: 'Creatividad'
        };
        return labels[category] || 'Misión';
    },

    /**
     * Updates the live preview card in the DOM.
     * @param {Object} data - Current input values.
     */
    updatePreviewCard(data) {
        if (!this.elements.previewCard) return;

        const { name, description, category, difficulty, cooldown } = data;

        // Fallbacks
        const displayName = name.trim() || 'Nombre de la Misión';
        const displayDesc = description.trim() || 'Aquí aparecerá la descripción de tu misión...';
        const displayCategoryIcon = this.getCategoryIcon(category);
        const displayCategoryLabel = this.getCategoryLabel(category);
        
        // Dynamic calculations
        const rarity = this.calculateRarity(difficulty, cooldown);
        const exp = this.calculateExp(difficulty, rarity.text);

        // Update elements
        if (this.elements.previewName) this.elements.previewName.textContent = displayName;
        if (this.elements.previewDesc) this.elements.previewDesc.textContent = displayDesc;
        if (this.elements.previewCategoryIcon) this.elements.previewCategoryIcon.textContent = displayCategoryIcon;
        if (this.elements.previewCategoryText) this.elements.previewCategoryText.textContent = displayCategoryLabel;
        if (this.elements.previewExp) this.elements.previewExp.textContent = `${exp} XP`;
        
        // Cooldown formatting
        let cooldownText = 'Sin Cooldown';
        if (cooldown > 0) {
            if (cooldown === 1) cooldownText = '1 hora';
            else if (cooldown === 24) cooldownText = 'Diaria';
            else if (cooldown === 168) cooldownText = 'Semanal';
            else cooldownText = `${cooldown} horas`;
        }
        if (this.elements.previewCooldown) this.elements.previewCooldown.textContent = `⏱️ ${cooldownText}`;

        // Update rarity text and wrapper border/shadow class
        if (this.elements.previewRarity) {
            this.elements.previewRarity.textContent = rarity.text;
            this.elements.previewRarity.className = `rarity-badge ${rarity.rarityClass}`;
        }

        // Apply rarity class to the whole card container for styling/glow
        this.elements.previewCard.className = `mission-preview-card ${rarity.rarityClass}`;
    },

    /**
     * Dynamically calculates EXP reward.
     */
    calculateExp(difficulty, rarityText) {
        let baseExp = 50;
        if (difficulty === 'medio') baseExp = 100;
        else if (difficulty === 'dificil') baseExp = 200;
        else if (difficulty === 'epico') baseExp = 400;

        let multiplier = 1.0;
        if (rarityText === 'Poco Común') multiplier = 1.2;
        else if (rarityText === 'Raro') multiplier = 1.5;
        else if (rarityText === 'Épico') multiplier = 2.0;
        else if (rarityText === 'Legendario') multiplier = 2.5;

        return Math.round(baseExp * multiplier);
    },

    /**
     * Enables or disables the mission submit button.
     */
    setMissionSubmitButtonState(isDisabled) {
        if (this.elements.missionSubmitBtn) {
            this.elements.missionSubmitBtn.disabled = isDisabled;
            if (isDisabled) {
                this.elements.missionSubmitBtn.classList.add('disabled');
            } else {
                this.elements.missionSubmitBtn.classList.remove('disabled');
            }
        }
    },

    /**
     * Displays validation error messages.
     */
    showMissionError(message) {
        if (this.elements.missionError) {
            this.elements.missionError.textContent = message;
            this.elements.missionError.classList.add('visible');
        }
    },

    /**
     * Hides the validation error messages.
     */
    hideMissionError() {
        if (this.elements.missionError) {
            this.elements.missionError.textContent = '';
            this.elements.missionError.classList.remove('visible');
        }
    },

    /**
     * Shows a beautiful temporary visual success notification when a mission is created.
     * @param {string} message - The message to show.
     */
    showToast(message) {
        // Remove existing toast if any
        const existingToast = document.querySelector('.quest-toast');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = 'quest-toast';
        toast.innerHTML = `<span class="toast-icon">✨</span> <span class="toast-message">${message}</span>`;
        document.body.appendChild(toast);

        // Animate in and out
        setTimeout(() => toast.classList.add('visible'), 50);
        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    },

    /**
     * Renders the custom missions list in the container.
     * @param {Array} missions - The array of mission objects to render.
     */
    renderMissionsList(missions) {
        if (!this.elements.missionsListContainer) return;

        if (missions.length === 0) {
            this.elements.missionsListContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🛡️</div>
                    <p class="empty-title">Aún no tienes misiones customizadas</p>
                    <p class="empty-desc">Crea tu primera misión para empezar a ganar experiencia y vencer a la procrastinación.</p>
                </div>
            `;
            return;
        }

        // Helper function for escaping HTML safely
        const escapeHTML = (str) => {
            if (!str) return '';
            return str
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        };

        // Build list HTML
        this.elements.missionsListContainer.innerHTML = missions.map(mission => {
            const rarityInfo = this.calculateRarity(mission.difficulty, mission.cooldown);
            const categoryIcon = this.getCategoryIcon(mission.category);
            const categoryLabel = this.getCategoryLabel(mission.category);
            
            // Format cooldown
            let cooldownText = 'Sin Cooldown';
            if (mission.cooldown > 0) {
                if (mission.cooldown === 1) cooldownText = '1 hora';
                else if (mission.cooldown === 24) cooldownText = 'Diaria';
                else if (mission.cooldown === 168) cooldownText = 'Semanal';
                else cooldownText = `${mission.cooldown} horas`;
            }

            return `
                <div class="mission-card ${rarityInfo.rarityClass}" data-id="${mission.id}">
                    <div class="mission-card-header">
                        <div class="mission-card-title-group">
                            <span class="mission-card-icon" title="${categoryLabel}">${categoryIcon}</span>
                            <h3 class="mission-card-name">${escapeHTML(mission.name)}</h3>
                        </div>
                        <span class="mission-card-badge ${rarityInfo.rarityClass}">${rarityInfo.text}</span>
                    </div>
                    <p class="mission-card-desc">${escapeHTML(mission.description)}</p>
                    <div class="mission-card-footer">
                        <span class="mission-card-meta">⏱️ ${cooldownText}</span>
                        <div class="mission-card-reward">
                            <span class="exp-icon">💎</span>
                            <span class="exp-value">+${mission.exp} XP</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
};

// Export UI module globally
window.UI = UI;
