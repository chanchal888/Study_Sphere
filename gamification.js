// Gamification Module
class Gamification {
    constructor() {
        this.streak = 0;
        this.maxStreak = 0;
        this.lastSessionDate = null;
        this.sessionsCompleted = 0;
        this.loadData();
    }

    loadData() {
        const data = JSON.parse(localStorage.getItem('studySphereGamification')) || {};
        this.streak = data.streak || 0;
        this.maxStreak = data.maxStreak || 0;
        this.lastSessionDate = data.lastSessionDate ? new Date(data.lastSessionDate) : null;
        this.sessionsCompleted = data.sessionsCompleted || 0;
    }

    saveData() {
        const data = {
            streak: this.streak,
            maxStreak: this.maxStreak,
            lastSessionDate: this.lastSessionDate,
            sessionsCompleted: this.sessionsCompleted
        };
        localStorage.setItem('studySphereGamification', JSON.stringify(data));
    }

    updateStreak() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!this.lastSessionDate) {
            // First session
            this.streak = 1;
        } else {
            this.lastSessionDate.setHours(0, 0, 0, 0);
            const diffDays = Math.floor((today - this.lastSessionDate) / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                // Consecutive day
                this.streak++;
            } else if (diffDays > 1) {
                // Broken streak
                this.streak = 1;
            }
            // diffDays === 0 means same day, don't change streak
        }

        this.lastSessionDate = today;
        this.maxStreak = Math.max(this.maxStreak, this.streak);
        this.sessionsCompleted++;
        this.saveData();
        this.updatePlantGrowth();
    }

    updatePlantGrowth() {
        const growthStages = [1, 3, 7, 14, 21]; // Sessions needed for each stage
        let currentStage = 0;

        for (let i = 0; i < growthStages.length; i++) {
            if (this.sessionsCompleted >= growthStages[i]) {
                currentStage = i + 1;
            }
        }

        const plantElement = document.getElementById('focus-plant');
        if (plantElement) {
            plantElement.className = `plant-stage${currentStage}`;
        }

        // Update progress to next stage
        let nextStageThreshold = growthStages[currentStage] || growthStages[growthStages.length - 1];
        let progress = currentStage === growthStages.length ? 100 :
            ((this.sessionsCompleted - (growthStages[currentStage - 1] || 0)) /
            (nextStageThreshold - (growthStages[currentStage - 1] || 0)) * 100;

        const progressFill = document.getElementById('plant-progress-fill');
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }

        const sessionsToNext = document.getElementById('sessions-to-next');
        if (sessionsToNext) {
            sessionsToNext.textContent = nextStageThreshold - this.sessionsCompleted;
        }
    }

    getCurrentStreak() {
        return this.streak;
    }

    getMaxStreak() {
        return this.maxStreak;
    }

    getSessionsCompleted() {
        return this.sessionsCompleted;
    }
}

// Initialize gamification
const studySphereGamification = new Gamification();