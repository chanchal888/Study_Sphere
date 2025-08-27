//document.addEventListener('DOMContentLoaded', function() {
//    // Timer elements
//    const timerDisplay = document.getElementById('timer-display');
//    const startBtn = document.getElementById('start-timer');
//    const pauseBtn = document.getElementById('pause-timer');
//    const resetBtn = document.getElementById('reset-timer');
//    const timerTypeSelect = document.getElementById('timer-type');
//    const timerLabel = document.getElementById('timer-label');
//
//    // Task elements
//    const taskInput = document.getElementById('task-input');
//    const addTaskBtn = document.getElementById('add-task');
//    const taskList = document.getElementById('task-list');
//
//    // Timer variables
//    let timer;
//    let timeLeft = 25 * 60; // 25 minutes in seconds
//    let isRunning = false;
//    let currentTimerType = 'pomodoro';
//    let sessionsCompleted = 0;
//    let preventNavigation = false;
//
//    // Load tasks
//    let tasks = JSON.parse(localStorage.getItem('focusTasks')) || [];
//    renderTasks();
//
//    // Timer functions
//    function startTimer() {
//        if (isRunning) return;
//
//        isRunning = true;
//        startBtn.disabled = true;
//        pauseBtn.disabled = false;
//        preventNavigation = true; // Enable navigation prevention when timer starts
//
//        timer = setInterval(() => {
//            timeLeft--;
//            updateTimerDisplay();
//
//            if (timeLeft <= 0) {
//                timerComplete();
//            }
//        }, 1000);
//    }
//
//    function pauseTimer() {
//        if (!isRunning) return;
//
//        clearInterval(timer);
//        isRunning = false;
//        startBtn.disabled = false;
//        pauseBtn.disabled = true;
//        preventNavigation = false; // Disable navigation prevention when timer is paused
//    }
//
//    function resetTimer() {
//        pauseTimer();
//        setTimerDuration();
//        updateTimerDisplay();
//    }
//
//    function timerComplete() {
//        clearInterval(timer);
//        isRunning = false;
//        startBtn.disabled = false;
//        pauseBtn.disabled = true;
//        preventNavigation = false; // Disable navigation prevention when timer completes
//
//        // Play completion sound
//        const audio = new Audio('assets/audio/complete.mp3');
//        audio.play().catch(e => console.log('Audio play failed:', e));
//
//        // Save completed session
//        sessionsCompleted++;
//        saveSession();
//        updatePlantGrowth();
//
//        // Show notification
//        if (Notification.permission === 'granted') {
//            new Notification('Focus Session Complete!', {
//                body: 'Great job! Take a short break.',
//                icon: 'assets/images/logo.png'
//            });
//        }
//    }
//
//    function updateTimerDisplay() {
//        const minutes = Math.floor(timeLeft / 60);
//        const seconds = timeLeft % 60;
//        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
//    }
//
//    function setTimerDuration() {
//        switch (currentTimerType) {
//            case 'pomodoro':
//                timeLeft = 25 * 60;
//                break;
//            case 'shortBreak':
//                timeLeft = 5 * 60;
//                break;
//            case 'longBreak':
//                timeLeft = 15 * 60;
//                break;
//            case 'custom':
//                timeLeft = 30 * 60; // Default custom duration
//                break;
//        }
//    }
//
//    function changeTimerType() {
//        currentTimerType = timerTypeSelect.value;
//        resetTimer();
//        updateTimerLabel();
//    }
//
//    function updateTimerLabel() {
//        switch (currentTimerType) {
//            case 'pomodoro':
//                timerLabel.textContent = 'Focus Session';
//                break;
//            case 'shortBreak':
//                timerLabel.textContent = 'Short Break';
//                break;
//            case 'longBreak':
//                timerLabel.textContent = 'Long Break';
//                break;
//            case 'custom':
//                timerLabel.textContent = 'Custom Session';
//                break;
//        }
//    }
//
//    // Task functions
//    function addTask() {
//        const taskText = taskInput.value.trim();
//        if (!taskText) return;
//
//        const newTask = {
//            id: Date.now().toString(),
//            text: taskText,
//            completed: false,
//            createdAt: new Date().toISOString()
//        };
//
//        tasks.push(newTask);
//        saveTasks();
//        renderTask(newTask);
//        taskInput.value = '';
//    }
//
//    function renderTasks() {
//        taskList.innerHTML = '';
//        tasks.forEach(task => renderTask(task));
//    }
//
//    function renderTask(task) {
//        const taskItem = document.createElement('li');
//        taskItem.className = 'task-item';
//        taskItem.dataset.id = task.id;
//
//        taskItem.innerHTML = `
//            <input type="checkbox" id="task-${task.id}" ${task.completed ? 'checked' : ''}>
//            <label for="task-${task.id}" class="${task.completed ? 'completed' : ''}">${task.text}</label>
//            <button class="delete-task" data-id="${task.id}">
//                <i class="fas fa-trash"></i>
//            </button>
//        `;
//
//        taskList.appendChild(taskItem);
//
//        // Add event listeners
//        const checkbox = taskItem.querySelector('input[type="checkbox"]');
//        checkbox.addEventListener('change', () => toggleTaskComplete(task.id, checkbox.checked));
//
//        const deleteBtn = taskItem.querySelector('.delete-task');
//        deleteBtn.addEventListener('click', () => deleteTask(task.id));
//    }
//
//    function toggleTaskComplete(taskId, isCompleted) {
//        const task = tasks.find(t => t.id === taskId);
//        if (task) {
//            task.completed = isCompleted;
//            saveTasks();
//        }
//    }
//
//    function deleteTask(taskId) {
//        tasks = tasks.filter(t => t.id !== taskId);
//        saveTasks();
//        renderTasks();
//    }
//
//    function saveTasks() {
//        localStorage.setItem('focusTasks', JSON.stringify(tasks));
//    }
//
//    // Session tracking
//    function saveSession() {
//        let sessions = JSON.parse(localStorage.getItem('focusSessions')) || [];
//        const duration = getTimerDuration() - timeLeft;
//
//        sessions.push({
//            id: Date.now().toString(),
//            type: currentTimerType,
//            duration: duration,
//            completedAt: new Date().toISOString(),
//            tasksCompleted: tasks.filter(t => t.completed).length
//        });
//
//        localStorage.setItem('focusSessions', JSON.stringify(sessions));
//    }
//
//    function getTimerDuration() {
//        switch (currentTimerType) {
//            case 'pomodoro': return 25 * 60;
//            case 'shortBreak': return 5 * 60;
//            case 'longBreak': return 15 * 60;
//            default: return 25 * 60;
//        }
//    }
//
//    // Plant growth (gamification)
//    function updatePlantGrowth() {
//        const plantStages = ['stage1', 'stage2', 'stage3', 'stage4', 'full'];
//        const stageIndex = Math.min(Math.floor(sessionsCompleted / 3), plantStages.length - 1);
//
//        const plant = document.getElementById('focus-plant');
//        if (plant) {
//            plant.className = plantStages[stageIndex];
//        }
//
//        // Update progress display
//        const progress = (sessionsCompleted % 3) / 3 * 100;
//        const progressFill = document.getElementById('plant-progress-fill');
//        if (progressFill) {
//            progressFill.style.width = `${progress}%`;
//        }
//
//        const sessionsToNext = document.getElementById('sessions-to-next');
//        if (sessionsToNext) {
//            sessionsToNext.textContent = 3 - (sessionsCompleted % 3);
//        }
//    }
//
//    // Navigation prevention
//    window.addEventListener('beforeunload', function(e) {
//        if (preventNavigation) {
//            e.preventDefault();
//            e.returnValue = 'You have an active focus session. Are you sure you want to leave?';
//            return e.returnValue;
//        }
//    });
//
//    document.addEventListener('visibilitychange', function() {
//        if (preventNavigation && document.hidden) {
//            alert('Please stay on the Focus Zone tab to complete your session!');
//            // Bring focus back to the tab
//            window.focus();
//
//            // Optional: Play an alert sound
//            const audio = new Audio('assets/audio/alert.mp3');
//            audio.play().catch(e => console.log('Audio play failed:', e));
//        }
//    });
//
//    // Event listeners
//    startBtn.addEventListener('click', startTimer);
//    pauseBtn.addEventListener('click', pauseTimer);
//    resetBtn.addEventListener('click', resetTimer);
//    timerTypeSelect.addEventListener('change', changeTimerType);
//    addTaskBtn.addEventListener('click', addTask);
//    taskInput.addEventListener('keypress', function(e) {
//        if (e.key === 'Enter') addTask();
//    });
//
//    // Request notification permission
//    if ('Notification' in window && Notification.permission !== 'granted') {
//        Notification.requestPermission();
//    }
//
//    // Initialize
//    updateTimerLabel();
//    updateTimerDisplay();
//});
// focus.js - Main functionality for Focus Zone

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const timerDisplay = document.getElementById('timer-display');
    const timerLabel = document.getElementById('timer-label');
    const startBtn = document.getElementById('start-timer');
    const pauseBtn = document.getElementById('pause-timer');
    const resetBtn = document.getElementById('reset-timer');
    const timerType = document.getElementById('timer-type');
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');
    const blockDistractionsBtn = document.getElementById('block-distractions');
    const enableSoundsBtn = document.getElementById('enable-sounds');
    const soundSelector = document.getElementById('sound-selector');
    const currentStreak = document.getElementById('current-streak');
    const sessionsToNext = document.getElementById('sessions-to-next');
    const plantProgressFill = document.getElementById('plant-progress-fill');
    const sessionHistory = document.getElementById('session-history');
    const viewStatsBtn = document.getElementById('view-stats-btn');

    // Timer variables
    let timer;
    let timeLeft = 25 * 60; // 25 minutes in seconds
    let isRunning = false;
    let isPaused = false;
    let sessionsCompleted = 0;
    let currentStage = 0;
    let streak = 0;

    // Audio variables
    let audioEnabled = false;
    let currentAudio = null;
    const audioFiles = {
        lofi: 'assets/audio/lofi.mp3',
        rain: 'assets/audio/rain.mp3',
        forest: 'assets/audio/forest.mp3'
    };

    // Plant growth stages (image paths)
    const plantStages = [
        'assets/images/IMG-20250504-WA0001.jpg', // Stage 1 (seedling)
        'assets/images/IMG-20250504-WA0002.jpg', // Stage 2
        'assets/images/IMG-20250504-WA0003.jpg', // Stage 3
        'assets/images/IMG-20250504-WA0004.jpg', // Stage 4
        'assets/images/IMG-20250504-WA0005.jpg'  // Stage 5 (fully grown)
    ];

    // Sessions required for each plant growth stage
    const sessionsRequired = [1, 3, 5, 8, 10];

    // Initialize the app
    init();

    function init() {
        // Load saved data from localStorage
        loadData();

        // Set up event listeners
        setupEventListeners();

        // Update UI based on loaded data
        updateTimerDisplay();
        updatePlant();
        updateSessionHistory();
        updatePlantProgressUI();
    }

    function loadData() {
        // Load from localStorage or set defaults
        sessionsCompleted = localStorage.getItem('sessionsCompleted') ? parseInt(localStorage.getItem('sessionsCompleted')) : 0;
        streak = localStorage.getItem('streak') ? parseInt(localStorage.getItem('streak')) : 0;
        currentStage = localStorage.getItem('currentStage') ? parseInt(localStorage.getItem('currentStage')) : 0;

        // Load tasks if any
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            taskList.innerHTML = savedTasks;
            // Reattach event listeners to loaded tasks
            document.querySelectorAll('.task-item').forEach(task => {
                const checkbox = task.querySelector('.task-checkbox');
                const deleteBtn = task.querySelector('.delete-task');

                checkbox.addEventListener('change', function() {
                    task.classList.toggle('completed', this.checked);
                    saveData();
                });

                deleteBtn.addEventListener('click', function() {
                    task.remove();
                    saveData();
                });
            });
        }

        // Update streak display
        currentStreak.textContent = streak;
    }

    function saveData() {
        localStorage.setItem('sessionsCompleted', sessionsCompleted);
        localStorage.setItem('streak', streak);
        localStorage.setItem('currentStage', currentStage);
        localStorage.setItem('tasks', taskList.innerHTML);
        localStorage.setItem('lastSessionDate', new Date().toDateString());
    }

    function setupEventListeners() {
        // Timer controls
        startBtn.addEventListener('click', startTimer);
        pauseBtn.addEventListener('click', pauseTimer);
        resetBtn.addEventListener('click', resetTimer);

        // Timer type selection
        timerType.addEventListener('change', function() {
            switch(this.value) {
                case 'pomodoro':
                    timeLeft = 25 * 60;
                    timerLabel.textContent = 'Focus Session';
                    break;
                case 'shortBreak':
                    timeLeft = 5 * 60;
                    timerLabel.textContent = 'Short Break';
                    break;
                case 'longBreak':
                    timeLeft = 15 * 60;
                    timerLabel.textContent = 'Long Break';
                    break;
                case 'custom':
                    // You can implement custom time input here
                    break;
            }
            updateTimerDisplay();
        });

        // Task management
        addTaskBtn.addEventListener('click', addTask);
        taskInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addTask();
            }
        });

        // Focus tools
        blockDistractionsBtn.addEventListener('click', toggleDistractionBlocking);
        enableSoundsBtn.addEventListener('click', toggleSounds);
        soundSelector.addEventListener('change', changeBackgroundSound);

        // View stats button
        viewStatsBtn.addEventListener('click', function() {
            window.location.href = 'dashboard.html';
        });
    }

    // Timer functions
    function startTimer() {
        if (!isRunning) {
            isRunning = true;
            isPaused = false;
            startBtn.disabled = true;
            pauseBtn.disabled = false;

            // Play sound if enabled
            if (audioEnabled && currentAudio) {
                currentAudio.play().catch(e => console.log("Audio play failed:", e));
            }

            timer = setInterval(updateTimer, 1000);
        } else if (isPaused) {
            // Resume timer
            isPaused = false;
            pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';

            // Play sound if enabled
            if (audioEnabled && currentAudio) {
                currentAudio.play().catch(e => console.log("Audio play failed:", e));
            }

            timer = setInterval(updateTimer, 1000);
        }
    }

    function updateTimer() {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 0) {
            timerComplete();
        }
    }

    function pauseTimer() {
        if (isRunning && !isPaused) {
            isPaused = true;
            clearInterval(timer);
            pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';

            // Pause sound if playing
            if (currentAudio) {
                currentAudio.pause();
            }
        }
    }

    function resetTimer() {
        clearInterval(timer);
        isRunning = false;
        isPaused = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';

        // Reset to selected timer type
        switch(timerType.value) {
            case 'pomodoro':
                timeLeft = 25 * 60;
                timerLabel.textContent = 'Focus Session';
                break;
            case 'shortBreak':
                timeLeft = 5 * 60;
                timerLabel.textContent = 'Short Break';
                break;
            case 'longBreak':
                timeLeft = 15 * 60;
                timerLabel.textContent = 'Long Break';
                break;
        }

        // Stop any playing audio
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }

        updateTimerDisplay();
    }

    function timerComplete() {
        clearInterval(timer);
        isRunning = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;

        // Play completion sound
        playCompletionSound();

        // Update session count and plant growth if it was a focus session
        if (timerType.value === 'pomodoro') {
            sessionsCompleted++;
            updatePlantGrowth();
            updateStreak();
            saveData();
            addSessionToHistory();
        }

        // Show completion notification
        showNotification('Timer completed! Great job!');
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Task management functions
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText) {
            const taskItem = document.createElement('li');
            taskItem.className = 'task-item';
            taskItem.innerHTML = `
                <input type="checkbox" class="task-checkbox">
                <span class="task-text">${taskText}</span>
                <button class="delete-task"><i class="fas fa-trash"></i></button>
            `;

            taskList.appendChild(taskItem);
            taskInput.value = '';

            // Add event listeners to new task
            const checkbox = taskItem.querySelector('.task-checkbox');
            const deleteBtn = taskItem.querySelector('.delete-task');

            checkbox.addEventListener('change', function() {
                taskItem.classList.toggle('completed', this.checked);
                saveData();
            });

            deleteBtn.addEventListener('click', function() {
                taskItem.remove();
                saveData();
            });

            saveData();
        }
    }

    // Focus tools functions
    function toggleDistractionBlocking() {
        const isBlocked = blockDistractionsBtn.classList.toggle('active');
        blockDistractionsBtn.innerHTML = `<i class="fas fa-${isBlocked ? 'lock' : 'lock-open'}"></i> ${isBlocked ? 'Unblock' : 'Block'} Distractions`;

        showNotification(isBlocked ? 'Distractions blocked! Stay focused!' : 'Distractions unblocked. Be careful!');
    }

    function toggleSounds() {
        audioEnabled = !audioEnabled;
        enableSoundsBtn.classList.toggle('active');

        if (audioEnabled) {
            enableSoundsBtn.innerHTML = '<i class="fas fa-volume-mute"></i> Disable Sounds';
            if (!currentAudio) {
                changeBackgroundSound();
            } else if (isRunning && !isPaused) {
                currentAudio.play().catch(e => console.log("Audio play failed:", e));
            }
        } else {
            enableSoundsBtn.innerHTML = '<i class="fas fa-volume-up"></i> Enable Sounds';
            if (currentAudio) {
                currentAudio.pause();
            }
        }
    }

    function changeBackgroundSound() {
        if (currentAudio) {
            currentAudio.pause();
        }

        const selectedSound = soundSelector.value;
        if (audioFiles[selectedSound]) {
            currentAudio = new Audio(audioFiles[selectedSound]);
            currentAudio.loop = true;

            if (audioEnabled && isRunning && !isPaused) {
                currentAudio.play().catch(e => console.log("Audio play failed:", e));
            }
        }
    }

    function playCompletionSound() {
        const completionSound = new Audio('assets/audio/complete.mp3');
        completionSound.play().catch(e => console.log("Completion sound play failed:", e));
    }

    // Plant growth functions
    function updatePlantGrowth() {
        // Determine current stage based on sessions completed
        let newStage = 0;
        for (let i = 0; i < sessionsRequired.length; i++) {
            if (sessionsCompleted >= sessionsRequired[i]) {
                newStage = i;
            } else {
                break;
            }
        }

        // If we've reached a new stage, show notification
        if (newStage > currentStage) {
            currentStage = newStage;
            showNotification(`Your plant has grown to stage ${currentStage + 1}! Keep going!`);
        }

        // Cap at maximum stage
        currentStage = Math.min(currentStage, plantStages.length - 1);

        updatePlant();
        updatePlantProgressUI();
    }

    function updatePlant() {
        // Update all plant images to show current stage
        const plantImages = document.querySelectorAll('.plant img');
        plantImages.forEach(img => {
            img.src = plantStages[currentStage];
            img.alt = `Focus Plant - Stage ${currentStage + 1}`;
        });
    }

    function updatePlantProgressUI() {
        let nextStageThreshold = sessionsRequired[Math.min(currentStage + 1, sessionsRequired.length - 1)] ||
                               sessionsRequired[sessionsRequired.length - 1] + 5;
        let currentStageThreshold = sessionsRequired[currentStage] || 0;

        let progress = 0;
        if (currentStage < sessionsRequired.length - 1) {
            progress = ((sessionsCompleted - currentStageThreshold) /
                       (nextStageThreshold - currentStageThreshold)) * 100;
        } else {
            progress = 100;
        }

        sessionsToNext.textContent = Math.max(0, nextStageThreshold - sessionsCompleted);
        plantProgressFill.style.width = `${progress}%`;
    }

    function updateStreak() {
        const today = new Date().toDateString();
        const lastSessionDate = localStorage.getItem('lastSessionDate');

        if (lastSessionDate === today) return;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastSessionDate === yesterday.toDateString() || !lastSessionDate) {
            streak++;
        } else {
            streak = 1;
        }

        currentStreak.textContent = streak;
    }

    // Session history functions
    function addSessionToHistory() {
        const now = new Date();
        const sessionItem = document.createElement('li');
        sessionItem.className = 'session-item';
        sessionItem.innerHTML = `
            <div class="session-type">Pomodoro</div>
            <div class="session-date">${now.toLocaleDateString()}</div>
            <div class="session-time">${now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
            <div class="session-duration">25:00</div>
        `;

        if (sessionHistory.firstChild) {
            sessionHistory.insertBefore(sessionItem, sessionHistory.firstChild);
        } else {
            sessionHistory.appendChild(sessionItem);
        }

        if (sessionHistory.children.length > 5) {
            sessionHistory.removeChild(sessionHistory.lastChild);
        }
    }

    function updateSessionHistory() {
        // Load actual session history from localStorage if available
        sessionHistory.innerHTML = `
            <li class="session-item">
                <div class="session-type">Pomodoro</div>
                <div class="session-date">${new Date().toLocaleDateString()}</div>
                <div class="session-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                <div class="session-duration">25:00</div>
            </li>
        `;
    }

     function renderFocusSessionsChart() {
    const ctx = document.getElementById('focusSessionsChart').getContext('2d');
    const focusSessionsChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'Interrupted', 'Skipped'],
            datasets: [{
                data: [12, 3, 2],
                backgroundColor: [
                    '#4BC0C0',
                    '#FF6384',
                    '#FFCE56'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Focus Session Completion Rate'
                }
            }
        }
    });
}

function renderDailyFocusChart() {
    const ctx = document.getElementById('dailyFocusChart').getContext('2d');
    const dailyFocusChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Minutes Focused',
                data: [120, 90, 150, 180, 60, 30, 0],
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Daily Focus Time'
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    renderFocusSessionsChart();
    renderDailyFocusChart();
});

    // Utility functions
    function showNotification(message) {
        // Create a notification element instead of using alert
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
});