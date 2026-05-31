/**
 * dashboard.js
 * Renders active missions on the dashboard and handles mission completion flow.
 */

document.addEventListener('DOMContentLoaded', () => {
    if (!window.Storage || !window.Storage.hasUser || !window.Storage.hasUser()) {
        window.location.href = '../index.html';
        return;
    }

    if (window.UI && typeof window.UI.initDashboard === 'function') {
        window.UI.initDashboard();
        window.UI.updateStreakDisplay(window.Storage.getUser());
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

    const completeMission = (missionId) => {
        if (!missionId || !window.Storage || !window.Progression || !window.UI) return;

        const user = window.Storage.getUser();
        const missions = window.Storage.getMissions() || [];
        const mission = missions.find((item) => item.id === missionId);
        if (!user || !mission || mission.status !== 'active') return;

        const reward = window.Progression.calculateMissionReward(mission.exp, user.class);
        const result = window.Progression.addExperience(reward.finalExp);
        const streakResult = window.Progression.updateDailyStreak(user);

        mission.status = 'completed';
        mission.completedAt = new Date().toISOString();
        window.Storage.saveMissions(missions);

        const updatedUser = window.Storage.getUser();
        if (typeof window.renderExpBar === 'function') {
            window.renderExpBar(updatedUser);
        }
        if (window.UI && typeof window.UI.updateStreakDisplay === 'function') {
            window.UI.updateStreakDisplay(updatedUser);
        }

        const bonusLine = reward.bonusText || 'Sin bonificación de clase.';
        const streakLine = streakResult.updated
            ? `Tu racha diaria ahora es de <strong>${streakResult.streak} día${streakResult.streak === 1 ? '' : 's'}</strong>.`
            : `Ya completaste una misión hoy. Tu racha se mantiene en <strong>${streakResult.streak} día${streakResult.streak === 1 ? '' : 's'}</strong>.`;

        window.UI.showRewardModal({
            title: '¡Misión completada!',
            subtitle: `Has ganado +${reward.finalExp} XP`,
            message: `La misión "${mission.name}" se completó con éxito.`,
            details: `
                <ul class="reward-list">
                    <li><strong>XP base:</strong> +${mission.exp} XP</li>
                    <li><strong>XP final:</strong> +${reward.finalExp} XP</li>
                    <li>${bonusLine}</li>
                </ul>
            `,
            streakText: streakLine
        }).then(() => {
            if (result && result.leveledUp) {
                window.UI.showToast(`🎉 ¡SUBISTE DE NIVEL! Ahora eres Nivel ${result.newLevel} (${result.newTitle})`);
            }
        });

        renderActiveMissions();
    };

    if (activeMissionsList) {
        activeMissionsList.addEventListener('click', (event) => {
            const button = event.target.closest('.btn-complete-mission');
            if (!button) return;

            event.stopPropagation();
            const missionId = button.dataset.id;
            completeMission(missionId);
        });
    }

    renderActiveMissions();
});
