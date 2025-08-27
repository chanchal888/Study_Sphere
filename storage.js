// Data Storage and Management
class StudySphereStorage {
    static saveSubjects(subjects) {
        localStorage.setItem('studySphereSubjects', JSON.stringify(subjects));
    }

    static getSubjects() {
        const data = localStorage.getItem('studySphereSubjects');
        return data ? JSON.parse(data) : [];
    }

    static saveFocusSessions(sessions) {
        localStorage.setItem('studySphereFocusSessions', JSON.stringify(sessions));
    }

    static getFocusSessions() {
        const data = localStorage.getItem('studySphereFocusSessions');
        return data ? JSON.parse(data) : [];
    }

    static saveSettings(settings) {
        localStorage.setItem('studySphereSettings', JSON.stringify(settings));
    }

    static getSettings() {
        const defaultSettings = {
            theme: 'light',
            pomodoroDuration: 25,
            shortBreakDuration: 5,
            longBreakDuration: 15,
            notificationsEnabled: true,
            soundEnabled: false,
            soundType: 'lofi'
        };

        const data = localStorage.getItem('studySphereSettings');
        return data ? JSON.parse(data) : defaultSettings;
    }

    static saveStreakData(streakData) {
        localStorage.setItem('studySphereStreak', JSON.stringify(streakData));
    }

    static getStreakData() {
        const defaultStreak = {
            currentStreak: 0,
            longestStreak: 0,
            lastSessionDate: null
        };

        const data = localStorage.getItem('studySphereStreak');
        return data ? JSON.parse(data) : defaultStreak;
    }

    static saveGpaData(gpaData) {
        localStorage.setItem('studySphereGpa', JSON.stringify(gpaData));
    }

    static getGpaData() {
        const defaultGpaData = {
            subjects: [],
            targetGpa: 4.0,
            currentGpa: 0.0
        };

        const data = localStorage.getItem('studySphereGpa');
        return data ? JSON.parse(data) : defaultGpaData;
    }

    static exportAllData() {
        return {
            subjects: this.getSubjects(),
            focusSessions: this.getFocusSessions(),
            settings: this.getSettings(),
            streakData: this.getStreakData(),
            gpaData: this.getGpaData(),
            exportedAt: new Date().toISOString()
        };
    }

    static importAllData(data) {
        try {
            if (data.subjects) this.saveSubjects(data.subjects);
            if (data.focusSessions) this.saveFocusSessions(data.focusSessions);
            if (data.settings) this.saveSettings(data.settings);
            if (data.streakData) this.saveStreakData(data.streakData);
            if (data.gpaData) this.saveGpaData(data.gpaData);
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }

    static clearAllData() {
        localStorage.removeItem('studySphereSubjects');
        localStorage.removeItem('studySphereFocusSessions');
        localStorage.removeItem('studySphereSettings');
        localStorage.removeItem('studySphereStreak');
        localStorage.removeItem('studySphereGpa');
    }
}

// Export for use in other modules
export default StudySphereStorage;