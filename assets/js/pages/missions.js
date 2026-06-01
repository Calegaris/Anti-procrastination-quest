/**
 * missions.js
 * Controls form validation, event handling, dynamic RPG calculations, and lifecycle flow for the Missions page.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Guard clause: redirect to welcome/login if user profile is missing
    if (window.Storage && !window.Storage.hasUser()) {
        window.location.href = '../index.html';
        return;
    }

    // 2. Initialize DOM caching
    if (window.UI) {
        window.UI.initMissions();
    } else {
        console.error('UI module not loaded properly.');
        return;
    }

    // Local reactive state for form entries to feed the live preview card
    const formState = {
        name: '',
        description: '',
        category: '',
        difficulty: '',
        cooldown: 0
    };

    // Cache local references from UI elements
    const elements = window.UI.elements;
    const nameInput = elements.missionName;
    const descInput = elements.missionDesc;
    const categorySelect = elements.missionCategory;
    const difficultySelect = elements.missionDifficulty;
    const cooldownSelect = elements.missionCooldown;
    const missionForm = elements.missionForm;
    const nameCounter = document.getElementById('mission-name-counter');
    const nameError = document.getElementById('mission-name-error');
    const descError = document.getElementById('mission-desc-error');

    /**
     * Performs comprehensive validation of current form state.
     * @returns {boolean} True if all inputs are fully valid.
     */
    function validateFormState() {
        const trimmedName = formState.name.trim();
        const trimmedDesc = formState.description.trim();

        // 1. Verify Name (required, 1-40 chars, must be unique)
        const isNameFilled = trimmedName.length >= 1;
        const isNameLengthValid = trimmedName.length <= 40;
        
        let isNameUnique = true;
        if (isNameFilled && window.Storage) {
            isNameUnique = window.Storage.isMissionNameUnique(trimmedName);
        }

        // Show/hide specific name error messages
        if (trimmedName.length > 40) {
            showInputError(nameInput, nameError, 'El nombre no debe superar los 40 caracteres.');
        } else if (isNameFilled && !isNameUnique) {
            showInputError(nameInput, nameError, 'Ya existe una misión registrada con este nombre.');
        } else {
            clearInputError(nameInput, nameError);
        }

        // 2. Verify Description (required, 1-150 chars)
        const isDescFilled = trimmedDesc.length >= 1;
        const isDescLengthValid = trimmedDesc.length <= 150;
        
        if (trimmedDesc.length > 150) {
            showInputError(descInput, descError, 'La descripción no debe superar los 150 caracteres.');
        } else {
            clearInputError(descInput, descError);
        }

        // 3. Verify dropdown fields are chosen
        const isCategoryChosen = formState.category !== '';
        const isDifficultyChosen = formState.difficulty !== '';
        const isCooldownChosen = cooldownSelect.value !== ''; // raw check

        // Final aggregate validation
        const isFormValid = isNameFilled && isNameLengthValid && isNameUnique && 
                            isDescFilled && isDescLengthValid && 
                            isCategoryChosen && isDifficultyChosen && isCooldownChosen;

        // Toggle submit button state
        window.UI.setMissionSubmitButtonState(!isFormValid);

        return isFormValid;
    }

    /**
     * Helper to show input specific errors.
     */
    function showInputError(inputEl, errorEl, message) {
        if (inputEl) inputEl.style.borderColor = '#f87171';
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.add('visible');
        }
    }

    /**
     * Helper to clear input specific errors.
     */
    function clearInputError(inputEl, errorEl) {
        if (inputEl) inputEl.style.borderColor = '';
        if (errorEl) {
            errorEl.textContent = '';
            errorEl.classList.remove('visible');
        }
    }

    // 3. Bind Live Inputs Behavior
    if (nameInput) {
        nameInput.addEventListener('input', (e) => {
            const val = e.target.value;
            formState.name = val;

            // Character counter styling
            if (nameCounter) {
                nameCounter.textContent = `${val.length}/40`;
                if (val.length > 40 || val.length === 0) {
                    nameCounter.classList.add('invalid');
                } else {
                    nameCounter.classList.remove('invalid');
                }
            }

            // Sync live preview & validate
            window.UI.updatePreviewCard(formState);
            validateFormState();
        });
    }

    if (descInput) {
        descInput.addEventListener('input', (e) => {
            const val = e.target.value;
            formState.description = val;

            // Sync live preview & validate
            window.UI.updatePreviewCard(formState);
            validateFormState();
        });
    }

    if (categorySelect) {
        categorySelect.addEventListener('change', (e) => {
            formState.category = e.target.value;
            
            // Sync live preview & validate
            window.UI.updatePreviewCard(formState);
            validateFormState();
        });
    }

    if (difficultySelect) {
        difficultySelect.addEventListener('change', (e) => {
            formState.difficulty = e.target.value;
            
            // Sync live preview & validate
            window.UI.updatePreviewCard(formState);
            validateFormState();
        });
    }

    if (cooldownSelect) {
        cooldownSelect.addEventListener('change', (e) => {
            formState.cooldown = Number(e.target.value);
            
            // Sync live preview & validate
            window.UI.updatePreviewCard(formState);
            validateFormState();
        });
    }

    // 4. Bind Form Submit Action
    if (missionForm) {
        missionForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Run final security check
            if (!validateFormState()) {
                window.UI.showMissionError('Por favor, completa todos los campos correctamente.');
                return;
            }

            window.UI.hideMissionError();

            // Generate RPG variables based on internal logic
            const rarityInfo = window.UI.calculateRarity(formState.difficulty, formState.cooldown);
            const calculatedExp = window.UI.calculateExp(formState.difficulty, rarityInfo.text);

            // Construct new mission record
            const newMission = {
                id: 'm_' + Date.now(),
                name: formState.name.trim(),
                description: formState.description.trim(),
                category: formState.category,
                difficulty: formState.difficulty,
                cooldown: formState.cooldown,
                rarity: rarityInfo.text,
                exp: calculatedExp,
                estado: 'activa',
                status: 'active'
            };

            // Save to localStorage via Storage module
            const saved = window.Storage.addMission(newMission);
            if (!saved) {
                window.UI.showMissionError('Hubo un error guardando la misión. Reintenta.');
                return;
            }

            // Reset local reactive state
            formState.name = '';
            formState.description = '';
            formState.category = '';
            formState.difficulty = '';
            formState.cooldown = 0;

            // Reset HTML Form and clear elements style borders
            missionForm.reset();
            clearInputError(nameInput, nameError);
            clearInputError(descInput, descError);
            if (nameCounter) {
                nameCounter.textContent = '0/40';
                nameCounter.classList.remove('invalid');
            }

            // Provide visual premium success alert
            window.UI.showToast(`¡Misión "${newMission.name}" inscrita en el Tablero!`);

            // Instantly sync preview card and re-render board list
            window.UI.updatePreviewCard(formState);
            syncMissionsList();
            
            // Force validate state (will disable submit button)
            validateFormState();
        });
    }

    // 4.5 Bind click listener to missions list for mission completion, reactivation, and deletion
    const missionsListContainer = elements.missionsListContainer;
    if (missionsListContainer) {
        missionsListContainer.addEventListener('click', (e) => {
            const completeBtn = e.target.closest('.btn-complete-mission');
            const reactivateBtn = e.target.closest('.btn-reactivate-mission');
            const deleteBtn = e.target.closest('.btn-delete-mission');

            if (completeBtn) {
                e.stopPropagation();
                const missionId = completeBtn.dataset.id;
                
                if (window.Storage && window.Progression && window.UI) {
                    const user = window.Storage.getUser();
                    const missions = window.Storage.getMissions();
                    const mission = missions.find(m => m.id === missionId);

                    if (!user || !mission) return;

                    // 1. Calculate and apply class bonus EXP
                    const baseExp = mission.exp || 0;
                    const finalExp = window.Progression.applyClassBonus(baseExp, user.class);

                    // 2. Perform the experience addition and level up check
                    const result = window.Progression.addExperience(finalExp);

                    // 3. Mark the mission as completed (completada)
                    mission.estado = 'completada';
                    mission.status = 'completed';
                    window.Storage.saveMissions(missions);

                    // 3.5. Trigger the bar update immediately after saving the user object to localStorage (HU-05)
                    const updatedUser = window.Storage.getUser();
                    if (typeof window.renderExpBar === 'function') {
                        window.renderExpBar(updatedUser);
                    }

                    // 4. Show success toast notifications sequentially (HU-05)
                    window.UI.showToast(`¡Misión completada! Has ganado +${finalExp} EXP.`).then(() => {
                        if (result && result.leveledUp) {
                            window.UI.showToast(`🎉 ¡SUBISTE DE NIVEL! Ahora eres Nivel ${result.newLevel} (${result.newTitle})`);
                        }
                    });

                    // 5. Instantly sync the list view
                    syncMissionsList();
                }
            }

            if (reactivateBtn) {
                e.stopPropagation();
                const missionId = reactivateBtn.dataset.id;

                if (window.Storage && window.UI) {
                    const missions = window.Storage.getMissions();
                    const mission = missions.find(m => m.id === missionId);

                    if (!mission) return;

                    // Reactivate the mission
                    mission.estado = 'activa';
                    mission.status = 'active';
                    window.Storage.saveMissions(missions);

                    // Show visual feedback toast
                    window.UI.showToast(`¡Misión "${mission.name}" reactivada con éxito!`);

                    // Instantly sync list view
                    syncMissionsList();
                }
            }

            if (deleteBtn) {
                e.stopPropagation();
                const missionId = deleteBtn.dataset.id;

                if (window.Storage && window.UI) {
                    const missions = window.Storage.getMissions();
                    const mission = missions.find(m => m.id === missionId);

                    if (!mission) return;

                    // Open delete confirmation modal
                    window.UI.openDeleteModal(() => {
                        const updatedMissions = missions.filter(m => m.id !== missionId);
                        window.Storage.saveMissions(updatedMissions);
                        window.UI.showToast(`Misión "${mission.name}" eliminada.`);
                        syncMissionsList();
                    });
                }
            }
        });
    }

    /**
     * Filters the missions by state first, then category, and renders.
     * @param {string} category - 'all' | category code
     */
    function filterByCategory(category) {
        if (!window.Storage || !window.UI) return;

        const missions = window.Storage.getMissions() || [];
        const statusEl = document.getElementById('mission-filter-status');
        const status = statusEl ? statusEl.value : 'all';

        // 1. First filter by state (activa, inactiva, completada, all)
        let filtered = missions;
        if (status && status !== 'all') {
            filtered = filtered.filter(m => {
                const s = (m.estado || m.status || 'activa').toLowerCase().trim();
                if (status === 'activa') {
                    return s === 'activa' || s === 'active';
                } else if (status === 'inactiva') {
                    return s === 'inactiva' || s === 'inactive' || s === 'vencida';
                } else if (status === 'completada') {
                    return s === 'completada' || s === 'completed';
                }
                return false;
            });
        }

        // 2. Then filter by category
        if (category && category !== 'all') {
            filtered = filtered.filter(m => {
                const cat = (m.category || m.categoria || '').toLowerCase().trim();
                return cat === category.toLowerCase().trim();
            });
        }

        // 3. Render results
        if (missions.length === 0) {
            // Default empty state when no missions are saved at all
            window.UI.renderMissionsList([]);
        } else if (filtered.length === 0) {
            // Filtered empty state when no missions match current criteria
            window.UI.renderMissionsList([], 'No se encontraron misiones', 'Prueba cambiando los filtros de estado o categoría.');
        } else {
            window.UI.renderMissionsList(filtered);
        }
    }

    /**
     * Instantly grabs saved missions from Storage and renders them on the board.
     */
    function syncMissionsList() {
        const categoryEl = document.getElementById('mission-filter-category');
        const category = categoryEl ? categoryEl.value : 'all';
        filterByCategory(category);
    }

    // 5. Initial paint on DOM content loaded
    const filterStatusEl = document.getElementById('mission-filter-status');
    const filterCategoryEl = document.getElementById('mission-filter-category');

    if (filterStatusEl) {
        filterStatusEl.addEventListener('change', () => {
            syncMissionsList();
        });
    }

    if (filterCategoryEl) {
        filterCategoryEl.addEventListener('change', () => {
            syncMissionsList();
        });
    }

    syncMissionsList();
    validateFormState(); // Set initial disabled state for button
});
