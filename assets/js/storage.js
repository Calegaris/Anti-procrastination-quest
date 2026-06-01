/**
 * storage.js
 * Manages localStorage operations for the Anti-Procrastination Quest application.
 */

const STORAGE_KEYS = {
    USER: 'apq_user',
    MISSIONS: 'apq_missions'
};

const Storage = {
    /**
     * Saves the user object in localStorage.
     * @param {Object} user - The user object to save.
     * @param {string} user.name - Player name.
     * @param {string} user.class - Character class (Warrior or Mage).
     * @param {number} user.level - Current level (default 1).
     * @param {number} user.experience - Current XP (default 0).
     * @param {number} user.streak - Daily login/task streak (default 0).
     */
    saveUser(user) {
        try {
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        } catch (error) {
            console.error('Error saving user data to localStorage:', error);
        }
    },

    /**
     * Retrieves the user object from localStorage.
     * @returns {Object|null} The parsed user object, or null if not found.
     */
    getUser() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.USER);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error reading user data from localStorage:', error);
            return null;
        }
    },

    /**
     * Checks if a user is already registered/saved.
     * @returns {boolean} True if the user exists, false otherwise.
     */
    hasUser() {
        return this.getUser() !== null;
    },

    /**
     * Clears user data from localStorage.
     */
    clearUser() {
        try {
            localStorage.removeItem(STORAGE_KEYS.USER);
        } catch (error) {
            console.error('Error clearing user data from localStorage:', error);
        }
    },

    /**
     * Retrieves the missions list from localStorage.
     * @returns {Array} An array of mission objects.
     */
    getMissions() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.MISSIONS);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error reading missions from localStorage:', error);
            return [];
        }
    },

    /**
     * Saves the missions array to localStorage.
     * @param {Array} missions - The list of missions to save.
     */
    saveMissions(missions) {
        try {
            localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(missions));
        } catch (error) {
            console.error('Error saving missions to localStorage:', error);
        }
    },

    /**
     * Adds a single mission to the localStorage collection.
     * @param {Object} mission - The mission object to add.
     */
    addMission(mission) {
        try {
            const missions = this.getMissions();
            missions.push(mission);
            this.saveMissions(missions);
            return true;
        } catch (error) {
            console.error('Error adding mission to localStorage:', error);
            return false;
        }
    },

    /**
     * Checks if a mission name is unique in the saved list (case-insensitive).
     * @param {string} name - The mission name to check.
     * @returns {boolean} True if the name is unique, false otherwise.
     */
    isMissionNameUnique(name) {
        if (!name) return false;
        const missions = this.getMissions();
        const normalizedInput = name.trim().toLowerCase();
        return !missions.some(m => m.name && m.name.trim().toLowerCase() === normalizedInput);
    }
};

// Export as global so other scripts can access it easily in vanilla JS
window.Storage = Storage;
