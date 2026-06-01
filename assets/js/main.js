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

    // Class selection data containing icons, titles, bonuses, and evolution levels
    const CLASSES_DATA = [
        {
            id: 'warrior',
            name: 'Guerrero',
            icon: '⚔️',
            shortBonus: 'x1.25 XP (Lunes a Viernes)',
            longBonus: 'Los Guerreros destacan por su consistencia y disciplina en la rutina semanal. Obtienen un multiplicador de 1.25x en toda la experiencia (XP) obtenida al completar misiones de Lunes a Viernes, ideal para impulsar tu productividad y progreso durante los días laborables.',
            sprite: 'assets/avatares/guerrero/nivel_1.png',
            sprites: [
                'assets/avatares/guerrero/nivel_1.png',
                'assets/avatares/guerrero/nivel_2.png',
                'assets/avatares/guerrero/nivel_3.png',
                'assets/avatares/guerrero/nivel_4.png'
            ],
            locked: false
        },
        {
            id: 'mage',
            name: 'Mago',
            icon: '🔮',
            shortBonus: 'x1.75 XP (Sábados y Domingos)',
            longBonus: 'Los Magos canalizan sus flujos de energía y concentración en los fines de semana. Obtienen un espectacular multiplicador de 1.75x en toda la experiencia (XP) obtenida al completar misiones los Sábados y Domingos, ideal para dar grandes saltos de nivel en tus días de descanso.',
            sprite: 'assets/avatares/mago/nivel_1.png',
            sprites: [
                'assets/avatares/mago/nivel_1.png',
                'assets/avatares/mago/nivel_2.png',
                'assets/avatares/mago/nivel_3.png',
                'assets/avatares/mago/nivel_4.png'
            ],
            locked: false
        },
        {
            id: 'rogue',
            name: 'Pícaro',
            icon: '🗡️',
            shortBonus: 'Próximamente - Bonus de Velocidad',
            longBonus: 'Los Pícaros se mueven con sigilo entre las sombras del tiempo. En futuras actualizaciones, su bonus de agilidad les permitirá evadir o reducir penalizaciones de experiencia por tareas que se venzan o queden pendientes.',
            sprite: '',
            sprites: [],
            locked: true
        }
    ];

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

    // 3. Setup Class selection behavior with Evolution Modal trigger
    window.UI.renderClassCards(CLASSES_DATA, selectedClass);
    window.UI.setupClassSelection((chosenClassId) => {
        const classData = CLASSES_DATA.find(cls => cls.id === chosenClassId);
        if (classData && !classData.locked) {
            window.UI.openClassModal(classData, (confirmedClassId) => {
                selectedClass = confirmedClassId;
                window.UI.highlightClassCard(confirmedClassId);
                validateFormState();
            });
        }
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
