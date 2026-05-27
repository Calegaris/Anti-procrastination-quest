/**
 * main.js
 * Controls validation, event handling, and logic flow for the Anti-Procrastination Quest welcome page.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Immediate redirect if user is already logged in
    if (window.Storage && window.Storage.hasUser()) {
        window.location.href = 'pages/dashboard.html';
        return;
    }

    // 2. Initialize UI caching
    if (window.UI) {
        window.UI.init();
    } else {
        console.error('UI module not loaded properly.');
        return;
    }

    // Local state to keep track of form selection
    let selectedClass = '';

    /**
     * Performs live validation on current input and selection state.
     * @returns {boolean} True if all inputs are valid.
     */
    function validateFormState() {
        const { name } = window.UI.getFormValues();
        const trimmedName = name.trim();
        
        // Rule: Name must be between 1 and 30 characters
        const isNameValid = trimmedName.length >= 1 && trimmedName.length <= 30;
        
        // Rule: Class must be selected and must be either 'warrior' or 'mage'
        const isClassValid = selectedClass === 'warrior' || selectedClass === 'mage';

        // Enable or disable the start adventure button
        const isFormValid = isNameValid && isClassValid;
        window.UI.setSubmitButtonState(!isFormValid);

        return isFormValid;
    }

    // 3. Setup Class selection behavior
    window.UI.setupClassSelection((chosenClass) => {
        selectedClass = chosenClass;
        validateFormState();
    });

    // 4. Setup Input fields behavior
    const nameInput = window.UI.elements.nameInput;
    if (nameInput) {
        nameInput.addEventListener('input', (e) => {
            const rawLength = e.target.value.length;
            window.UI.updateCharacterCounter(rawLength);

            // Real-time error messages
            if (rawLength > 30) {
                window.UI.showError('El nombre no debe superar los 30 caracteres.');
            } else if (rawLength === 0) {
                window.UI.showError('El nombre es obligatorio.');
            } else {
                window.UI.hideError();
            }

            validateFormState();
        });
    }

    // 5. Setup Form Submit action
    const loginForm = window.UI.elements.loginForm;
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Read exact form values
            const { name } = window.UI.getFormValues();
            const trimmedName = name.trim();

            // Final validation step
            if (trimmedName.length < 1 || trimmedName.length > 30) {
                window.UI.showError('El nombre del héroe debe tener entre 1 y 30 caracteres.');
                return;
            }

            if (selectedClass !== 'warrior' && selectedClass !== 'mage') {
                window.UI.showError('Por favor, selecciona una clase válida para comenzar.');
                return;
            }

            // Valid profile creation
            const user = {
                name: trimmedName,
                class: selectedClass,
                level: 1,
                experience: 0,
                streak: 0
            };

            // Save user in localStorage
            if (window.Storage) {
                window.Storage.saveUser(user);
            } else {
                console.error('Storage module not found.');
                return;
            }

            // Redirect immediately to dashboard
            window.location.href = 'pages/dashboard.html';
        });
    }
});
