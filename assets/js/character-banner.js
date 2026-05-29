/* character-banner.js
   Renders the dashboard Character Banner using localStorage and the Storage utility.
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

    const CLASS_FOLDERS = {
        warrior: 'guerrero',
        mage: 'mago',
        guerrero: 'guerrero',
        mago: 'mago'
    };

    const STORAGE_KEYS = ['apq_user', 'user', 'usuario'];

    function safeParse(value) {
        if (typeof value !== 'string') return null;
        try {
            return JSON.parse(value);
        } catch (error) {
            return null;
        }
    }

    function normalizeUser(raw) {
        if (!raw || typeof raw !== 'object') return null;

        const source = raw.usuario && typeof raw.usuario === 'object' ? raw.usuario : raw;
        const name = extractString(source.name || source.nombre || source.displayName || source.nombreUsuario || 'Héroe');
        const cls = extractString(source.class || source.clase || '').toLowerCase();
        const level = clampNumber(source.level || source.nivel || 1, 1, 10);

        return {
            name: name || 'Héroe',
            class: cls || 'warrior',
            level
        };
    }

    function extractString(value) {
        if (typeof value === 'string') return value.trim();
        if (typeof value === 'number') return String(value);
        return '';
    }

    function clampNumber(value, min, max) {
        const number = parseInt(value, 10);
        if (Number.isNaN(number)) return min;
        return Math.min(Math.max(number, min), max);
    }

    function getUserFromStorage() {
        if (window.Storage && typeof window.Storage.getUser === 'function') {
            const stored = window.Storage.getUser();
            const normalized = normalizeUser(stored);
            if (normalized) return normalized;
        }

        for (const key of STORAGE_KEYS) {
            const raw = localStorage.getItem(key);
            if (!raw) continue;
            const parsed = safeParse(raw);
            const normalized = normalizeUser(parsed);
            if (normalized) return normalized;
        }

        return null;
    }

    function getClassFolder(cls) {
        return CLASS_FOLDERS[cls] || CLASS_FOLDERS[cls.toLowerCase()] || 'guerrero';
    }

    function getSpriteLevel(level) {
        const lvl = parseInt(level, 10) || 1;
        if (lvl >= 1 && lvl <= 2) return 1;
        if (lvl >= 3 && lvl <= 6) return 2;
        if (lvl >= 7 && lvl <= 9) return 3;
        if (lvl >= 10) return 4;
        return 1;
    }

    function buildSpriteSrc(folder, level) {
        const spriteLevel = getSpriteLevel(level);
        return `../assets/avatares/${folder}/nivel_${spriteLevel}.png`;
    }

    function getLevelTitle(level) {
        return LEVEL_TITLES[level] || LEVEL_TITLES[1];
    }

    function escapeSvgText(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function makeFallbackImage(label) {
        const background = '#222630';
        const foreground = '#D4AF37';
        const text = escapeSvgText(label);
        const svg = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="24" fill="${background}"/><text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="48" fill="${foreground}">${text}</text></svg>`;
        return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
    }

    function renderBanner() {
        const user = getUserFromStorage();
        const banner = document.getElementById('character-banner');
        const avatar = document.getElementById('avatar-img');
        const nameEl = document.getElementById('character-name');
        const levelEl = document.getElementById('character-level');
        const titleEl = document.getElementById('character-title');

        if (!banner || !avatar || !nameEl || !levelEl || !titleEl) return;

        // Bind click trigger for lightbox image zoom
        avatar.onclick = function () {
            if (window.UI) {
                const charName = nameEl.textContent;
                const charLvl = levelEl.textContent;
                const charTitle = titleEl.textContent;
                window.UI.showImageLightbox(avatar.src, `${charName} - ${charLvl} (${charTitle})`);
            }
        };

        if (!user) {
            nameEl.textContent = 'Invitado';
            levelEl.textContent = 'Nivel 1';
            titleEl.textContent = getLevelTitle(1);
            avatar.alt = 'Avatar de invitado';
            avatar.src = makeFallbackImage('?');
            return;
        }

        const folder = getClassFolder(user.class);
        const sprite = buildSpriteSrc(folder, user.level);

        nameEl.textContent = user.name;
        levelEl.textContent = `Nivel ${user.level}`;
        titleEl.textContent = getLevelTitle(user.level);
        avatar.alt = `Avatar de ${user.name}`;
        avatar.dataset.fallback = 'false';
        avatar.src = sprite;
        avatar.onerror = function () {
            if (avatar.dataset.fallback === 'true') return;
            avatar.dataset.fallback = 'true';
            const initials = getInitials(user.name);
            avatar.src = makeFallbackImage(initials || '?');
        };
    }

    function getInitials(name) {
        return (name || '')
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map(part => part.charAt(0).toUpperCase())
            .join('');
    }

    document.addEventListener('DOMContentLoaded', renderBanner);
    window.CharacterBanner = { render: renderBanner };
})();
