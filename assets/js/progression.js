/**
 * progression.js
 * Manages experience progression, level calculation, class bonuses, and level-up logic.
 */

(function () {
    'use strict';

    const LEVEL_TITLES = {
        1: 'Novato Persistente',
        2: 'Guerrero de Tareas',
        3: 'Campeón del Tiempo',
        4: 'Maestro Productivo',
        5: 'Leyenda Emergente',
        6: 'Titán de Hábitos',
        7: 'Deidad del Progreso',
        8: 'Soberano del Tiempo',
        9: 'Señor Absoluto',
        10: 'Señor Absoluto'
    };

    /**
     * Experience required to level up from the given level.
     * @param {number} level - Current player level (1-10).
     * @returns {number} Required EXP. Returns 0 for level 10 (MAX LEVEL).
     */
    function getExpRequired(level) {
        const table = {
            1: 100,
            2: 250,
            3: 400,
            4: 600,
            5: 900,
            6: 1200,
            7: 1600,
            8: 2000,
            9: 2500
        };
        const lvl = parseInt(level, 10) || 1;
        return table[lvl] || 0;
    }

    /**
     * Calculates current experience percentage towards next level.
     * @param {Object} user - User object.
     * @returns {Object} { current, required, percentage }
     */
    function calculateExpPercentage(user) {
        if (!user) {
            return { current: 0, required: 100, percentage: 0 };
        }
        const lvl = parseInt(user.level, 10) || 1;
        const current = parseInt(user.experiencia ?? user.experience ?? 0, 10);

        if (lvl >= 10) {
            return { current: 0, required: 0, percentage: 100 };
        }

        const required = getExpRequired(lvl);
        const percentage = required > 0 ? (current / required) * 100 : 0;

        return {
            current,
            required,
            percentage: Math.min(percentage, 100)
        };
    }

    /**
     * Applies character class bonuses based on the current day.
     * Warrior: 1.25x EXP (Monday to Friday).
     * Mage: 1.75x EXP (Saturday to Sunday).
     * @param {number} expBase - Base experience of the mission.
     * @param {string} userClass - Player character class identifier.
     * @returns {number} Final experience value.
     */
    function applyClassBonus(expBase, userClass) {
        const base = parseInt(expBase, 10) || 0;
        const cls = (userClass || '').toLowerCase().trim();
        const day = new Date().getDay(); // 0 is Sunday, 6 is Saturday
        const isWeekend = (day === 0 || day === 6);
        const isWeekday = !isWeekend;

        let multiplier = 1.0;

        if (cls === 'warrior' || cls === 'guerrero') {
            if (isWeekday) {
                multiplier = 1.25;
            }
        } else if (cls === 'mage' || cls === 'mago') {
            if (isWeekend) {
                multiplier = 1.75;
            }
        }

        return Math.round(base * multiplier);
    }

    /**
     * Adds experience to the current user, applying level-up detection.
     * @param {number} amount - Amount of final experience to add.
     * @returns {Object} { leveledUp, newLevel, newTitle }
     */
    function addExperience(amount) {
        if (!window.Storage) {
            console.error('Storage module not found.');
            return { leveledUp: false, newLevel: 1 };
        }

        const user = window.Storage.getUser();
        if (!user) {
            console.error('No active user found in storage.');
            return { leveledUp: false, newLevel: 1 };
        }

        let level = parseInt(user.level, 10) || 1;
        let experience = parseInt(user.experiencia ?? user.experience ?? 0, 10);

        if (level >= 10) {
            // Already at MAX LEVEL
            user.level = 10;
            user.experiencia = 0;
            user.experience = 0;
            window.Storage.saveUser(user);
            return { leveledUp: false, newLevel: 10, newTitle: LEVEL_TITLES[10] };
        }

        experience += amount;
        let leveledUp = false;

        while (level < 10 && experience >= getExpRequired(level)) {
            experience -= getExpRequired(level);
            level += 1;
            leveledUp = true;
        }

        if (level >= 10) {
            level = 10;
            experience = 0;
        }

        user.level = level;
        user.experiencia = experience;
        user.experience = experience; // Keep both synchronized
        
        // Save the updated statistics
        window.Storage.saveUser(user);

        // Instant rendering if CharacterBanner is defined in the current context
        if (window.CharacterBanner && typeof window.CharacterBanner.render === 'function') {
            window.CharacterBanner.render();
        }

        return {
            leveledUp,
            newLevel: level,
            newTitle: LEVEL_TITLES[level]
        };
    }

    // Expose global renderExpBar helper for external synchronization
    window.renderExpBar = function (user) {
        if (window.CharacterBanner && typeof window.CharacterBanner.render === 'function') {
            window.CharacterBanner.render();
        }
    };

    // Export to global context
    window.Progression = {
        LEVEL_TITLES,
        getExpRequired,
        calculateExpPercentage,
        applyClassBonus,
        addExperience
    };
})();
