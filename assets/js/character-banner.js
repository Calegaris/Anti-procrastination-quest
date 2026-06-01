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
        
        // Ensure both Spanish and English keys are normalized at retrieval boundary
        const level = clampNumber(source.nivel ?? source.level ?? 1, 1, 10);
        const experience = parseInt(source.experiencia ?? source.experience ?? source.exp ?? 0, 10);

        return {
            name: name || 'Héroe',
            class: cls || 'warrior',
            level,
            nivel: level,
            experience,
            experiencia: experience
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

    function calculateExpPercentage(user) {
        if (!user) {
            return { current: 0, required: 100, percentage: 0 };
        }
        const lvl = parseInt(user.nivel ?? user.level ?? 1, 10);
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

    function renderBanner(passedUser) {
        let user = passedUser || getUserFromStorage();

        // Normalize passedUser if it comes directly from external triggers
        if (user && (user.nivel === undefined || user.experiencia === undefined)) {
            user = normalizeUser(user);
        }

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

        // XP Bar rendering (HU-05) - supporting both ID and Class lookups
        const xpContainer = document.querySelector('.exp-bar') || document.querySelector('.xp-container') || document.getElementById('xp-container');
        const xpBarFill = document.querySelector('.exp-bar-fill') || document.getElementById('xp-bar-fill');
        const xpText = document.querySelector('.exp-bar-text') || document.getElementById('xp-text');

        if (xpContainer) {
            const xpBarTrack = document.querySelector('.xp-bar-track') || document.getElementById('xp-bar-track');
            
            // 1. Get correct current and required EXP values using user.experiencia ?? user.experience ?? 0
            const currentExp = user.experiencia ?? user.experience ?? 0;
            const requiredExp = getExpRequired(user.nivel);

            if (parseInt(user.nivel, 10) >= 10) {
                if (xpBarTrack) {
                    xpBarTrack.style.display = 'none';
                }
                if (xpText) {
                    xpText.textContent = 'MAX LEVEL';
                    xpText.className = 'xp-text exp-bar-text max-level-text';
                }
            } else {
                if (xpBarTrack) {
                    xpBarTrack.style.display = 'block';
                }
                // 2. Bar fill width matches percentage from calculateExpPercentage(user)
                const xpInfo = calculateExpPercentage(user);
                
                if (xpBarFill) {
                    xpBarFill.style.width = `${xpInfo.percentage}%`;
                }
                if (xpText) {
                    // 3. Display text: “currentExp / requiredExp EXP”
                    xpText.textContent = `${currentExp} / ${requiredExp} EXP`;
                    xpText.className = 'xp-text exp-bar-text';
                }
            }
        }
    }

    function getInitials(name) {
        return (name || '')
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map(part => part.charAt(0).toUpperCase())
            .join('');
    }

    // Expose renderExpBar globally to ensure dynamic, real-time refreshes
    window.renderExpBar = function (user) {
        renderBanner(user);
    };

    document.addEventListener('DOMContentLoaded', () => { renderBanner(); });
    window.CharacterBanner = { render: renderBanner };
})();
