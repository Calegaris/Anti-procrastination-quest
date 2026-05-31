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
        this.elements.classGrid = document.getElementById('class-grid');
        this.elements.submitButton = document.getElementById('btn-submit');
        this.elements.errorMessage = document.getElementById('error-message');

        // Evolution details modal cache
        this.elements.classModal = document.getElementById('class-details-modal');
        this.elements.modalCloseBtn = document.getElementById('modal-close-btn');
        this.elements.modalClassIcon = document.getElementById('modal-class-icon');
        this.elements.modalClassTitle = document.getElementById('modal-class-title');
        this.elements.modalEvolutionChain = document.getElementById('modal-evolution-chain');
        this.elements.modalBonusDesc = document.getElementById('modal-bonus-description');
        this.elements.modalConfirmBtn = document.getElementById('btn-select-class');

        // Dashboard reward modal cache
        this.elements.rewardModal = document.getElementById('mission-reward-modal');
        this.elements.rewardModalCloseBtn = document.getElementById('reward-modal-close');
        this.elements.rewardModalActionBtn = document.getElementById('reward-modal-action');
        this.elements.rewardModalTitle = document.getElementById('reward-modal-title');
        this.elements.rewardModalSubtitle = document.querySelector('[data-reward-subtitle]');
        this.elements.rewardModalMessage = document.querySelector('[data-reward-message]');
        this.elements.rewardModalDetails = document.querySelector('[data-reward-details]');
        this.elements.rewardModalStreak = document.querySelector('[data-reward-streak]');
        this.elements.streakDisplay = document.getElementById('character-streak');
    },

    /**
     * Renders the dynamic class selection cards inside the grid.
     * @param {Array} classesData - Array of class configuration objects.
     * @param {string} selectedClassId - The currently selected class ID.
     */
    renderClassCards(classesData, selectedClassId) {
        const grid = this.elements.classGrid;
        if (!grid) return;

        grid.innerHTML = classesData.map(cls => {
            const isSelected = cls.id === selectedClassId ? 'selected' : '';
            if (cls.locked) {
                return `
                    <div class="class-card locked" title="Próximamente">
                        <span class="class-icon">${cls.icon}</span>
                        <span class="class-name">${cls.name}</span>
                        <span class="coming-soon-badge">Soon</span>
                    </div>
                `;
            } else {
                return `
                    <div class="class-card ${isSelected}" data-class="${cls.id}">
                        <div class="class-card-sprite-wrapper">
                            <img class="class-card-sprite" src="${cls.sprite}" alt="${cls.name} sprite">
                        </div>
                        <span class="class-name">${cls.name}</span>
                        <span class="class-card-bonus">${cls.shortBonus}</span>
                    </div>
                `;
            }
        }).join('');
    },

    /**
     * Set up dynamic class card selection behavior using event delegation.
     * @param {Function} onClassClick - Callback executed when an active class card is clicked.
     */
    setupClassSelection(onClassClick) {
        const grid = this.elements.classGrid;
        if (!grid) return;

        grid.addEventListener('click', (e) => {
            // Check if clicking class sprite specifically to trigger lightbox zoom
            const sprite = e.target.closest('.class-card-sprite');
            if (sprite) {
                e.stopPropagation();
                const card = sprite.closest('.class-card');
                const className = card.querySelector('.class-name').textContent;
                this.showImageLightbox(sprite.src, `${className} - Nivel 1`);
                return;
            }

            const card = e.target.closest('.class-card:not(.locked)');
            if (!card) return;

            const chosenClass = card.dataset.class;
            if (typeof onClassClick === 'function') {
                onClassClick(chosenClass);
            }
        });
    },

    /**
     * Highlights the selected class card visually in the grid.
     * @param {string} selectedClassId - The class ID to highlight.
     */
    highlightClassCard(selectedClassId) {
        const grid = this.elements.classGrid;
        if (!grid) return;

        const cards = grid.querySelectorAll('.class-card:not(.locked)');
        cards.forEach(card => {
            if (card.dataset.class === selectedClassId) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });
    },

    /**
     * Opens the class details & evolution showcase modal.
     * @param {Object} classData - The active class metadata to present.
     * @param {Function} onConfirm - Callback executed when confirming selection inside modal.
     */
    openClassModal(classData, onConfirm) {
        const modal = this.elements.classModal;
        if (!modal) return;

        // Apply theme/context class for glowing color variations
        modal.dataset.class = classData.id;

        // Header info
        if (this.elements.modalClassIcon) this.elements.modalClassIcon.textContent = classData.icon;
        if (this.elements.modalClassTitle) this.elements.modalClassTitle.textContent = classData.name;

        // Evolution chain HTML builder
        if (this.elements.modalEvolutionChain) {
            const levelTitles = ['Novato', 'Veterano', 'Campeón', 'Maestro'];
            this.elements.modalEvolutionChain.innerHTML = classData.sprites.map((spritePath, idx) => {
                const isLast = idx === classData.sprites.length - 1;
                const arrowHtml = isLast ? '' : `<div class="evolution-arrow">➜</div>`;
                
                return `
                    <div class="evolution-item">
                        <div class="evolution-sprite-frame">
                            <img class="evolution-sprite" src="${spritePath}" alt="${classData.name} Nivel ${idx + 1}">
                        </div>
                        <span class="evolution-label">Nivel ${idx + 1}</span>
                        <span class="evolution-level-name">${levelTitles[idx]}</span>
                    </div>
                    ${arrowHtml}
                `;
            }).join('');

            // Click listener for lightbox image zoom on evolution sprites
            this.elements.modalEvolutionChain.onclick = (e) => {
                const sprite = e.target.closest('.evolution-sprite');
                if (sprite) {
                    const evoItem = sprite.closest('.evolution-item');
                    const label = evoItem.querySelector('.evolution-label').textContent;
                    const levelName = evoItem.querySelector('.evolution-level-name').textContent;
                    this.showImageLightbox(sprite.src, `${classData.name} - ${label} (${levelName})`);
                }
            };
        }

        // Extended bonus text description
        if (this.elements.modalBonusDesc) {
            this.elements.modalBonusDesc.textContent = classData.longBonus;
        }

        // Action button binding with clean event-listener refresh
        const confirmBtn = this.elements.modalConfirmBtn;
        if (confirmBtn) {
            const newConfirmBtn = confirmBtn.cloneNode(true);
            confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
            this.elements.modalConfirmBtn = newConfirmBtn;

            newConfirmBtn.addEventListener('click', () => {
                if (typeof onConfirm === 'function') {
                    onConfirm(classData.id);
                }
                this.closeClassModal();
            });
        }

        // Open animation trigger
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');

        // Setup closing hooks
        const closeBtn = this.elements.modalCloseBtn;
        if (closeBtn) {
            closeBtn.onclick = () => this.closeClassModal();
        }

        // Overlay backdrop click dismiss hook
        modal.onclick = (e) => {
            if (e.target === modal) {
                this.closeClassModal();
            }
        };
    },

    /**
     * Closes the evolution showcase modal.
     */
    closeClassModal() {
        const modal = this.elements.classModal;
        if (!modal) return;

        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
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
     * Initializes dashboard-specific UI elements.
     */
    initDashboard() {
        this.elements.rewardModal = document.getElementById('mission-reward-modal');
        this.elements.rewardModalCloseBtn = document.getElementById('reward-modal-close');
        this.elements.rewardModalActionBtn = document.getElementById('reward-modal-action');
        this.elements.rewardModalTitle = document.getElementById('reward-modal-title');
        this.elements.rewardModalSubtitle = document.querySelector('[data-reward-subtitle]');
        this.elements.rewardModalMessage = document.querySelector('[data-reward-message]');
        this.elements.rewardModalDetails = document.querySelector('[data-reward-details]');
        this.elements.rewardModalStreak = document.querySelector('[data-reward-streak]');
        this.elements.streakDisplay = document.getElementById('character-streak');

        const closeModal = () => this.closeRewardModal();

        if (this.elements.rewardModalCloseBtn) {
            this.elements.rewardModalCloseBtn.addEventListener('click', closeModal);
        }
        if (this.elements.rewardModalActionBtn) {
            this.elements.rewardModalActionBtn.addEventListener('click', closeModal);
        }
        if (this.elements.rewardModal) {
            this.elements.rewardModal.addEventListener('click', (event) => {
                if (event.target === this.elements.rewardModal) {
                    closeModal();
                }
            });
        }
    },

    /**
     * Shows the reward confirmation modal with mission completion details.
     * @param {Object} payload
     * @param {string} payload.title
     * @param {string} payload.message
     * @param {string} payload.subtitle
     * @param {string} payload.details
     * @param {string} payload.streakText
     * @returns {Promise<void>}
     */
    showRewardModal({ title, message, subtitle, details, streakText }) {
        if (!this.elements.rewardModal) {
            return Promise.resolve();
        }

        if (this.elements.rewardModalTitle) {
            this.elements.rewardModalTitle.textContent = title;
        }
        if (this.elements.rewardModalSubtitle) {
            this.elements.rewardModalSubtitle.textContent = subtitle || '';
        }
        if (this.elements.rewardModalMessage) {
            this.elements.rewardModalMessage.textContent = message;
        }
        if (this.elements.rewardModalDetails) {
            this.elements.rewardModalDetails.innerHTML = details || '';
        }
        if (this.elements.rewardModalStreak) {
            this.elements.rewardModalStreak.innerHTML = streakText || '';
        }

        this.elements.rewardModal.classList.add('active');
        this.elements.rewardModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');

        return new Promise((resolve) => {
            const cleanup = () => {
                resolve();
            };
            this._rewardModalResolve = cleanup;
        });
    },

    /**
     * Closes the reward modal.
     */
    closeRewardModal() {
        if (!this.elements.rewardModal) return;
        this.elements.rewardModal.classList.remove('active');
        this.elements.rewardModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        if (typeof this._rewardModalResolve === 'function') {
            this._rewardModalResolve();
            this._rewardModalResolve = null;
        }
    },

    /**
     * Updates the streak counter display in the dashboard header.
     * @param {Object} user
     */
    updateStreakDisplay(user) {
        if (!this.elements.streakDisplay) return;
        const streak = parseInt(user?.streak ?? 0, 10) || 0;
        this.elements.streakDisplay.textContent = `${streak} día${streak === 1 ? '' : 's'}`;
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
     * @returns {Promise} Resolves when the toast has completed its entire exit transition.
     */
    showToast(message) {
        return new Promise((resolve) => {
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
                setTimeout(() => {
                    toast.remove();
                    resolve();
                }, 400);
            }, 3000);
        });
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
                        <div class="mission-card-actions">
                            <button type="button" class="btn-complete-mission" data-id="${mission.id}">
                                ⚔️ Completar
                            </button>
                            <div class="mission-card-reward">
                                <span class="exp-icon">💎</span>
                                <span class="exp-value">+${mission.exp} XP</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    /**
     * Creates and displays a reusable, retro-themed Lightbox modal for image zooming.
     * @param {string} imageSrc - The source path of the image to display.
     * @param {string} captionText - The text title/caption for the zoomed image.
     */
    showImageLightbox(imageSrc, captionText) {
        // Prevent duplicate overlays
        const existingOverlay = document.querySelector('.lightbox-overlay');
        if (existingOverlay) existingOverlay.remove();

        // 1. Create overlay wrapper
        const overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-label', `Zoom de imagen: ${captionText}`);

        // 2. Create card content
        overlay.innerHTML = `
            <div class="lightbox-card">
                <button type="button" class="lightbox-close" aria-label="Cerrar">&times;</button>
                <div class="lightbox-img-wrapper">
                    <img class="lightbox-img" src="${imageSrc}" alt="${captionText}">
                </div>
                <div class="lightbox-caption">${captionText}</div>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.classList.add('lightbox-lock');

        // Trigger active class for entrance transition
        setTimeout(() => overlay.classList.add('active'), 50);

        // Helper to close modal
        const closeLightbox = () => {
            overlay.classList.remove('active');
            document.body.classList.remove('lightbox-lock');
            setTimeout(() => overlay.remove(), 300);
            document.removeEventListener('keydown', handleEsc);
        };

        // Close on escape key
        const handleEsc = (e) => {
            if (e.key === 'Escape') closeLightbox();
        };
        document.addEventListener('keydown', handleEsc);

        // Close on X click
        overlay.querySelector('.lightbox-close').addEventListener('click', closeLightbox);

        // Close on background overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeLightbox();
        });
    }
};

// Export UI module globally
window.UI = UI;
