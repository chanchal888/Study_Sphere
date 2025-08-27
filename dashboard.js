document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const totalHoursEl = document.getElementById('total-hours');
    const currentStreakEl = document.getElementById('current-streak');
    const tasksCompletedEl = document.getElementById('tasks-completed');
    const productivityScoreEl = document.getElementById('productivity-score');
    const timeFilterButtons = document.querySelectorAll('.time-filter button');
    const exportReportBtn = document.getElementById('export-report');
    const viewAllSessionsBtn = document.getElementById('view-all-sessions');
    const sessionsTableBody = document.getElementById('sessions-table-body');
    const bestTimeEl = document.getElementById('best-time');
    const bestDayEl = document.getElementById('best-day');
    const completionRateEl = document.getElementById('completion-rate');
    const gpaTrendEl = document.getElementById('gpa-trend');
    const targetGpaDisplay = document.getElementById('target-gpa-display');

    // Chart instances
    let focusTimeChart;
    let gpaProgressChart;
    let sessionDistributionChart;

    // Current filter period
    let currentPeriod = 'week';

    // Initialize dashboard
    function initDashboard() {
        loadData();
        setupEventListeners();
        updateTimeFilter();
        renderAllCharts();
        updateInsights();
    }

    // Load data from localStorage
    function loadData() {
        // Load target GPA from settings
        const settings = JSON.parse(localStorage.getItem('studySphereSettings')) || {};
        if (settings.gradingScale) {
            targetGpaDisplay.textContent = settings.targetGPA ? settings.targetGPA.toFixed(2) : '4.00';
        }
    }

    // Setup event listeners
    function setupEventListeners() {
        // Time filter buttons
        timeFilterButtons.forEach(button => {
            button.addEventListener('click', () => {
                currentPeriod = button.dataset.period;
                updateTimeFilter();
                renderAllCharts();
                updateStats();
                updateInsights();
            });
        });

        // Export report button
        exportReportBtn.addEventListener('click', exportReport);

        // View all sessions button
        viewAllSessionsBtn.addEventListener('click', () => {
            // In a full implementation, this would navigate to a sessions history page
            alert('This would navigate to a full sessions history page in a complete implementation');
        });
    }

    // Update active time filter button
    function updateTimeFilter() {
        timeFilterButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.period === currentPeriod);
        });
    }

    // Update statistics cards
    function updateStats() {
        // Get data for the current period
        const data = getDataForPeriod(currentPeriod);

        // Update stats
        totalHoursEl.textContent = (data.totalFocusMinutes / 60).toFixed(1);
        currentStreakEl.textContent = data.currentStreak;
        tasksCompletedEl.textContent = data.tasksCompleted;
        productivityScoreEl.textContent = `${data.productivityScore}%`;
    }

    // Update insights
    function updateInsights() {
        const data = getDataForPeriod(currentPeriod);

        bestTimeEl.textContent = data.bestTime || 'Not enough data';
        bestDayEl.textContent = data.bestDay || 'Not enough data';

        if (data.totalTasks > 0) {
            const completionRate = Math.round((data.tasksCompleted / data.totalTasks) * 100);
            completionRateEl.textContent = `${completionRate}% (${data.tasksCompleted} of ${data.totalTasks} tasks)`;
        } else {
            completionRateEl.textContent = 'No tasks recorded';
        }

        if (data.gpaTrend) {
            gpaTrendEl.textContent = data.gpaTrend > 0
                ? `Up by ${data.gpaTrend.toFixed(2)} from last period`
                : data.gpaTrend < 0
                    ? `Down by ${Math.abs(data.gpaTrend).toFixed(2)} from last period`
                    : 'No change from last period';
        } else {
            gpaTrendEl.textContent = 'Not enough data';
        }
    }

    // Render all charts
    function renderAllCharts() {
        renderFocusTimeChart();
        renderGpaProgressChart();
        renderSessionDistributionChart();
        updateRecentSessionsTable();
    }

    // Focus Time Chart
    function renderFocusTimeChart() {
        const ctx = document.getElementById('focusTimeChart').getContext('2d');
        const data = getChartDataForPeriod(currentPeriod);

        // Destroy previous chart if exists
        if (focusTimeChart) {
            focusTimeChart.destroy();
        }

        focusTimeChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Focus Sessions',
                        data: data.focusData,
                        backgroundColor: '#4361ee',
                        borderRadius: 4
                    },
                    {
                        label: 'Breaks',
                        data: data.breakData,
                        backgroundColor: '#4cc9f0',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        stacked: true,
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Minutes'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += `${context.parsed.y} min`;
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }

    // GPA Progress Chart
    function renderGpaProgressChart() {
        const ctx = document.getElementById('gpaProgressChart').getContext('2d');
        const data = getGpaDataForPeriod(currentPeriod);
        const targetGpa = parseFloat(targetGpaDisplay.textContent) || 4.0;

        // Destroy previous chart if exists
        if (gpaProgressChart) {
            gpaProgressChart.destroy();
        }

        gpaProgressChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Your GPA',
                        data: data.gpaValues,
                        borderColor: '#7209b7',
                        backgroundColor: 'rgba(114, 9, 183, 0.1)',
                        borderWidth: 2,
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: 'Target GPA',
                        data: Array(data.labels.length).fill(targetGpa),
                        borderColor: '#4cc9f0',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        min: Math.max(0, Math.min(...data.gpaValues) - 0.5),
                        max: Math.min(4.0, Math.max(...data.gpaValues, targetGpa) + 0.5),
                        ticks: {
                            stepSize: 0.5
                        },
                        title: {
                            display: true,
                            text: 'GPA'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += context.parsed.y.toFixed(2);
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }

    // Session Distribution Chart
    function renderSessionDistributionChart() {
        const ctx = document.getElementById('sessionDistributionChart').getContext('2d');
        const data = getSessionDistributionData(currentPeriod);

        // Destroy previous chart if exists
        if (sessionDistributionChart) {
            sessionDistributionChart.destroy();
        }

        sessionDistributionChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    backgroundColor: [
                        '#4361ee',
                        '#3a0ca3',
                        '#7209b7',
                        '#f72585',
                        '#4cc9f0'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            boxWidth: 12,
                            padding: 16,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} sessions (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Update recent sessions table
    function updateRecentSessionsTable() {
        const sessions = getRecentSessions(5); // Get 5 most recent sessions
        sessionsTableBody.innerHTML = '';

        if (sessions.length === 0) {
            sessionsTableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="empty-state">No sessions recorded yet</td>
                </tr>
            `;
            return;
        }

        sessions.forEach(session => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${formatDate(session.date)}</td>
                <td>${session.type}</td>
                <td>${formatDuration(session.duration)}</td>
                <td>${session.tasksCompleted}</td>
            `;
            sessionsTableBody.appendChild(row);
        });
    }

    // Export report
    function exportReport() {
        // Get all data needed for the report
        const data = {
            period: currentPeriod,
            stats: {
                totalHours: totalHoursEl.textContent,
                currentStreak: currentStreakEl.textContent,
                tasksCompleted: tasksCompletedEl.textContent,
                productivityScore: productivityScoreEl.textContent
            },
            insights: {
                bestTime: bestTimeEl.textContent,
                bestDay: bestDayEl.textContent,
                completionRate: completionRateEl.textContent,
                gpaTrend: gpaTrendEl.textContent
            },
            charts: {
                // We would include chart data here in a real implementation
                focusTime: 'Focus time chart data',
                gpaProgress: 'GPA progress chart data',
                sessionDistribution: 'Session distribution data'
            },
            recentSessions: getRecentSessions(10),
            generatedAt: new Date().toISOString()
        };

        // Create and download JSON file
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `studysphere-report-${currentPeriod}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast('Report exported successfully!');
    }

    // Helper function to format date
    function formatDate(dateString) {
        return dayjs(dateString).format('MMM D, YYYY');
    }

    // Helper function to format duration (minutes to HH:MM)
    function formatDuration(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
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

    // Data functions (mock data - replace with real data from localStorage)
    function getDataForPeriod(period) {
        // In a real implementation, this would come from localStorage
        // This is mock data for demonstration

        const now = dayjs();
        let daysInPeriod = 7;
        let weeksInPeriod = 1;

        if (period === 'month') {
            daysInPeriod = 30;
            weeksInPeriod = 4;
        } else if (period === 'semester') {
            daysInPeriod = 120;
            weeksInPeriod = 16;
        }

        // Generate random data for demonstration
        const focusData = [];
        const breakData = [];
        const labels = [];

        for (let i = daysInPeriod - 1; i >= 0; i--) {
            const date = now.subtract(i, 'day');
            labels.push(date.format('MMM D'));
            focusData.push(Math.floor(Math.random() * 120) + 30); // 30-150 minutes
            breakData.push(Math.floor(Math.random() * 30) + 10); // 10-40 minutes
        }

        // Get GPA data from localStorage if available
        let gpaData = [];
        const savedGpaData = JSON.parse(localStorage.getItem('gpaData'));
        if (savedGpaData && savedGpaData.subjects) {
            gpaData = savedGpaData.subjects;
        }

        // Calculate GPA trend (simple mock calculation)
        let gpaTrend = 0;
        if (gpaData.length > 1) {
            const firstGPA = calculateGPA(gpaData.slice(0, Math.floor(gpaData.length / 2));
            const lastGPA = calculateGPA(gpaData.slice(Math.floor(gpaData.length / 2)));
            gpaTrend = lastGPA - firstGPA;
        }

        return {
            labels,
            focusData,
            breakData,
            totalFocusMinutes: focusData.reduce((a, b) => a + b, 0),
            totalBreakMinutes: breakData.reduce((a, b) => a + b, 0),
            currentStreak: Math.floor(Math.random() * 10) + 1,
            tasksCompleted: Math.floor(Math.random() * 20) + 5,
            totalTasks: Math.floor(Math.random() * 10) + 10,
            productivityScore: Math.floor(Math.random() * 40) + 60,
            bestTime: ['Morning (8-11 AM)', 'Afternoon (1-4 PM)', 'Evening (6-9 PM)'][Math.floor(Math.random() * 3)],
            bestDay: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][Math.floor(Math.random() * 7)],
            gpaTrend
        };
    }

    function getChartDataForPeriod(period) {
        const data = getDataForPeriod(period);
        return {
            labels: data.labels,
            focusData: data.focusData,
            breakData: data.breakData
        };
    }

    function getGpaDataForPeriod(period) {
        // In a real implementation, this would come from localStorage
        // This is mock data for demonstration

        const now = dayjs();
        let weeksInPeriod = 4;

        if (period === 'week') {
            weeksInPeriod = 1;
        } else if (period === 'semester') {
            weeksInPeriod = 16;
        }

        const labels = [];
        const gpaValues = [];

        // Start with a random GPA between 2.5 and 3.5
        let currentGPA = 2.5 + Math.random();

        for (let i = weeksInPeriod - 1; i >= 0; i--) {
            const week = now.subtract(i, 'week');
            labels.push(week.format('MMM D'));

            // Add some variation to the GPA
            currentGPA += (Math.random() - 0.5) * 0.2;
            currentGPA = Math.max(0, Math.min(4.0, currentGPA));
            gpaValues.push(currentGPA);
        }

        return { labels, gpaValues };
    }

    function getSessionDistributionData(period) {
        // In a real implementation, this would come from localStorage
        return {
            labels: ['Pomodoro', 'Short Break', 'Long Break', 'Custom Focus', 'Other'],
            values: [
                Math.floor(Math.random() * 20) + 10,
                Math.floor(Math.random() * 15) + 5,
                Math.floor(Math.random() * 10) + 3,
                Math.floor(Math.random() * 8) + 2,
                Math.floor(Math.random() * 5) + 1
            ]
        };
    }

    // Study Time Distribution Chart (Pie Chart)
function renderStudyTimeChart() {
    const ctx = document.getElementById('studyTimeChart').getContext('2d');
    const studyTimeChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Math', 'Science', 'History', 'Literature', 'Other'],
            datasets: [{
                data: [15, 20, 10, 12, 8],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF'
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
                    text: 'Study Time Distribution'
                }
            }
        }
    });
}

// Productivity Trend Chart (Line Chart)
function renderProductivityChart() {
    const ctx = document.getElementById('productivityChart').getContext('2d');
    const productivityChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Productivity Score',
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Weekly Productivity Trend'
                }
            }
        }
    });
}

// Initialize all charts when page loads
document.addEventListener('DOMContentLoaded', function() {
    renderStudyTimeChart();
    renderProductivityChart();
});

    function getRecentSessions(limit) {
        // In a real implementation, this would come from localStorage
        const sessions = [];
        const types = ['Pomodoro', 'Short Break', 'Long Break', 'Custom Focus'];
        const now = dayjs();

        for (let i = 0; i < limit; i++) {
            const date = now.subtract(i, 'day').format('YYYY-MM-DD');
            sessions.push({
                date,
                type: types[Math.floor(Math.random() * types.length)],
                duration: Math.floor(Math.random() * 60) + 25,
                tasksCompleted: Math.floor(Math.random() * 3)
            });
        }

        return sessions;
    }

    function calculateGPA(subjects) {
        if (!subjects || subjects.length === 0) return 0;

        let totalPoints = 0;
        let totalCredits = 0;

        subjects.forEach(subject => {
            totalPoints += subject.grade * subject.credits;
            totalCredits += subject.credits;
        });

        return totalCredits > 0 ? totalPoints / totalCredits : 0;
    }

    // Initialize the dashboard
    initDashboard();

});