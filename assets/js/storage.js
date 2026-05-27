/**
 * storage.js
 * Manages localStorage operations for the Anti-Procrastination Quest application.
 */

const STORAGE_KEYS = {
    USER: 'apq_user'
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
    }
};

// Export as global so other scripts can access it easily in vanilla JS
window.Storage = Storage;
