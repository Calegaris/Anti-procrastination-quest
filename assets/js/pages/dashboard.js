/**
 * dashboard.js
 * Renders active missions on the dashboard and handles mission completion flow.
 */

document.addEventListener('DOMContentLoaded', () => {
    if (!window.Storage || !window.Storage.hasUser || !window.Storage.hasUser()) {
        window.location.href = '../index.html';
        return;
    }

    const activeMissionsList = document.getElementById('active-missions-list');

    const escapeHTML = (str) => {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    };

    const renderActiveMissions = () => {
        if (!activeMissionsList || !window.Storage || !window.UI) return;

        const missions = window.Storage.getMissions() || [];
        const activeMissions = missions.filter((mission) => mission.status === 'active');

        if (activeMissions.length === 0) {
            activeMissionsList.innerHTML = `
                <li class="empty-state-item">
                    <p class="empty-icon" aria-hidden="true">🛡️</p>
                    <p class="empty-title">¡No hay misiones activas!</p>
                    <p class="empty-desc">Ve al <a href="missions.html">Gremio de Misiones</a> para crear nuevas aventuras.</p>
                </li>
            `;
            return;
        }

        activeMissionsList.innerHTML = activeMissions.map((mission) => {
            const rarityInfo = window.UI.calculateRarity(mission.difficulty, mission.cooldown);
            const categoryIcon = window.UI.getCategoryIcon(mission.category);

            return `
                <li>
                    <article class="dashboard-mission-card ${rarityInfo.rarityClass}" data-id="${mission.id}">
                        <header class="dashboard-mission-header">
                            <span class="mission-card-icon" aria-hidden="true">${categoryIcon}</span>
                            <h3 class="dashboard-mission-name">${escapeHTML(mission.name)}</h3>
                            <span class="mission-card-badge ${rarityInfo.rarityClass}">${rarityInfo.text}</span>
                        </header>
                        <p class="dashboard-mission-desc">${escapeHTML(mission.description)}</p>
                        <footer class="dashboard-mission-footer">
                            <p class="mission-reward">
                                <span aria-hidden="true">💎</span>
                                <strong>+${mission.exp} XP</strong>
                            </p>
                            <button type="button" class="btn-complete-mission" data-id="${mission.id}">
                                COMPLETAR
                            </button>
                        </footer>
                    </article>
                </li>
            `;
        }).join('');
    };

    if (activeMissionsList) {
        activeMissionsList.addEventListener('click', (event) => {
            const button = event.target.closest('.btn-complete-mission');
            if (!button) return;

            event.stopPropagation();
            const missionId = button.dataset.id;
            if (!missionId || !window.Storage || !window.Progression || !window.UI) return;

            const user = window.Storage.getUser();
            const missions = window.Storage.getMissions() || [];
            const mission = missions.find((item) => item.id === missionId);
            if (!user || !mission) return;

            const finalExp = window.Progression.applyClassBonus(mission.exp, user.class);
            const result = window.Progression.addExperience(finalExp);
            const updatedMissions = missions.filter((item) => item.id !== missionId);
            window.Storage.saveMissions(updatedMissions);

            const updatedUser = window.Storage.getUser();
            if (typeof window.renderExpBar === 'function') {
                window.renderExpBar(updatedUser);
            }

            window.UI.showToast(`¡Misión completada! Has ganado +${finalExp} EXP.`).then(() => {
                if (result && result.leveledUp) {
                    window.UI.showToast(`🎉 ¡SUBISTE DE NIVEL! Ahora eres Nivel ${result.newLevel} (${result.newTitle})`);
                }
            });

            renderActiveMissions();
        });
    }

    renderActiveMissions();
});
