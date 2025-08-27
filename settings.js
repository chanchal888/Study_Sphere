document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themePreference = document.getElementById('theme-preference');
    const gradingScale = document.getElementById('grading-scale');
    const defaultView = document.getElementById('default-view');
    const pomodoroDuration = document.getElementById('pomodoro-duration');
    const shortBreakDuration = document.getElementById('short-break-duration');
    const longBreakDuration = document.getElementById('long-break-duration');
    const autoStartBreak = document.getElementById('auto-start-break');
    const enableNotifications = document.getElementById('enable-notifications');
    const enableSounds = document.getElementById('enable-sounds');
    const defaultSound = document.getElementById('default-sound');
    const volumeLevel = document.getElementById('volume-level');
    const volumeDisplay = document.getElementById('volume-display');
    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const saveSettingsBtn = document.getElementById('save-settings');
    const exportDataBtn = document.getElementById('export-data');
    const importDataBtn = document.getElementById('import-data');
    const resetAllBtn = document.getElementById('reset-all');
    const confirmResetBtn = document.getElementById('confirm-reset');
    const resetModal = document.getElementById('reset-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const themeToggle = document.getElementById('theme-toggle');

    // Load settings from localStorage
    function loadSettings() {
        const settings = JSON.parse(localStorage.getItem('studySphereSettings')) || {};

        // General Settings
        if (settings.theme) {
            themePreference.value = settings.theme;
            applyTheme(settings.theme);
        }
        if (settings.gradingScale) gradingScale.value = settings.gradingScale;
        if (settings.defaultView) defaultView.value = settings.defaultView;

        // Focus Timer Settings
        if (settings.pomodoroDuration) pomodoroDuration.value = settings.pomodoroDuration;
        if (settings.shortBreakDuration) shortBreakDuration.value = settings.shortBreakDuration;
        if (settings.longBreakDuration) longBreakDuration.value = settings.longBreakDuration;
        if (settings.autoStartBreak !== undefined) autoStartBreak.checked = settings.autoStartBreak;
        if (settings.enableNotifications !== undefined) enableNotifications.checked = settings.enableNotifications;

        // Sound Settings
        if (settings.enableSounds !== undefined) enableSounds.checked = settings.enableSounds;
        if (settings.defaultSound) defaultSound.value = settings.defaultSound;
        if (settings.volumeLevel) {
            volumeLevel.value = settings.volumeLevel;
            volumeDisplay.textContent = `${settings.volumeLevel}%`;
        }

        // Account Settings
        if (settings.username) username.value = settings.username;
        if (settings.email) email.value = settings.email;
    }

    // Save settings to localStorage
    function saveSettings() {
        const settings = {
            // General Settings
            theme: themePreference.value,
            gradingScale: gradingScale.value,
            defaultView: defaultView.value,

            // Focus Timer Settings
            pomodoroDuration: parseInt(pomodoroDuration.value),
            shortBreakDuration: parseInt(shortBreakDuration.value),
            longBreakDuration: parseInt(longBreakDuration.value),
            autoStartBreak: autoStartBreak.checked,
            enableNotifications: enableNotifications.checked,

            // Sound Settings
            enableSounds: enableSounds.checked,
            defaultSound: defaultSound.value,
            volumeLevel: parseInt(volumeLevel.value),

            // Account Settings
            username: username.value,
            email: email.value
        };

        localStorage.setItem('studySphereSettings', JSON.stringify(settings));

        // Apply theme immediately
        applyTheme(settings.theme);

        // Show success message
        showToast('Settings saved successfully!');
    }

    // Apply theme to the page
    function applyTheme(theme) {
        let themeToApply = theme;

        if (theme === 'system') {
            themeToApply = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }

        document.body.className = `${themeToApply}-theme`;
        localStorage.setItem('theme', themeToApply);

        // Update theme toggle icon
        if (themeToggle) {
            themeToggle.innerHTML = themeToApply === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        }
    }

    // Export all data
    function exportAllData() {
        const data = {
            settings: JSON.parse(localStorage.getItem('studySphereSettings')) || {},
            gpaData: JSON.parse(localStorage.getItem('gpaData')) || {},
            focusData: JSON.parse(localStorage.getItem('focusData')) || {},
            tasks: JSON.parse(localStorage.getItem('tasks')) || []
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'studysphere-backup.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast('Data exported successfully!');
    }

    // Import data
    function importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = e => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);

                    if (data.settings) {
                        localStorage.setItem('studySphereSettings', JSON.stringify(data.settings));
                    }
                    if (data.gpaData) {
                        localStorage.setItem('gpaData', JSON.stringify(data.gpaData));
                    }
                    if (data.focusData) {
                        localStorage.setItem('focusData', JSON.stringify(data.focusData));
                    }
                    if (data.tasks) {
                        localStorage.setItem('tasks', JSON.stringify(data.tasks));
                    }

                    // Reload settings
                    loadSettings();
                    showToast('Data imported successfully!');
                } catch (error) {
                    showToast('Error importing data: Invalid file format', 'error');
                }
            };
            reader.readAsText(file);
        };

        input.click();
    }

    // Reset all data
    function resetAllData() {
        localStorage.removeItem('studySphereSettings');
        localStorage.removeItem('gpaData');
        localStorage.removeItem('focusData');
        localStorage.removeItem('tasks');

        // Reset to default settings
        const defaultSettings = {
            theme: 'light',
            gradingScale: '4.0',
            defaultView: 'dashboard',
            pomodoroDuration: 25,
            shortBreakDuration: 5,
            longBreakDuration: 15,
            autoStartBreak: true,
            enableNotifications: true,
            enableSounds: false,
            defaultSound: 'lofi',
            volumeLevel: 50,
            username: 'Student',
            email: ''
        };

        localStorage.setItem('studySphereSettings', JSON.stringify(defaultSettings));

        // Reload settings
        loadSettings();
        closeModals();
        showToast('All data has been reset to default');
    }

    // Show toast notification
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // Close all modals
    function closeModals() {
        resetModal.style.display = 'none';
    }

    // Event Listeners
    saveSettingsBtn.addEventListener('click', saveSettings);
    exportDataBtn.addEventListener('click', exportAllData);
    importDataBtn.addEventListener('click', importData);
    resetAllBtn.addEventListener('click', () => {
        resetModal.style.display = 'flex';
    });
    confirmResetBtn.addEventListener('click', resetAllData);
    closeModalBtns.forEach(btn => btn.addEventListener('click', closeModals));

    // Volume level display
    volumeLevel.addEventListener('input', () => {
        volumeDisplay.textContent = `${volumeLevel.value}%`;
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === resetModal) {
            closeModals();
        }
    });

    // Theme toggle button
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = localStorage.getItem('theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            applyTheme(newTheme);
            themePreference.value = newTheme;
        });
    }

    // System theme preference listener
    if (window.matchMedia) {
        const systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        systemThemeQuery.addEventListener('change', (e) => {
            if (themePreference.value === 'system') {
                applyTheme('system');
            }
        });
    }

    // Initialize
    loadSettings();
});