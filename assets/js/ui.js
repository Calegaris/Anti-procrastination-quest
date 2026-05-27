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
        errorMessage: null
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
    }
};

// Export UI module globally
window.UI = UI;
