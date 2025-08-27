// Utility Functions
// Utility Functions
const Utils = {
    // Format time in seconds to HH:MM:SS
    formatTime: function(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return [
            hrs.toString().padStart(2, '0'),
            mins.toString().padStart(2, '0'),
            secs.toString().padStart(2, '0')
        ].join(':');
    },

    // Save data to localStorage with timestamp
    saveData: function(key, value) {
        const data = {
            value: value,
            timestamp: new Date().getTime()
        };
        localStorage.setItem(key, JSON.stringify(data));
    },

    // Get data from localStorage and check if it's expired
    getData: function(key, expiryHours = 24) {
        const item = localStorage.getItem(key);
        if (!item) return null;

        const data = JSON.parse(item);
        const now = new Date().getTime();
        const expiryTime = expiryHours * 60 * 60 * 1000; // Convert hours to milliseconds

        if (now - data.timestamp > expiryTime) {
            localStorage.removeItem(key);
            return null;
        }

        return data.value;
    },

    // Calculate GPA from grades and credits
    calculateGPA: function(subjects) {
        if (!subjects || subjects.length === 0) return 0;

        let totalPoints = 0;
        let totalCredits = 0;

        subjects.forEach(subject => {
            const gradePoints = this.convertGradeToPoints(subject.grade);
            totalPoints += gradePoints * subject.credits;
            totalCredits += subject.credits;
        });

        return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
    },

    // Convert letter grade to grade points (4.0 scale)
    convertGradeToPoints: function(grade) {
        const gradeMap = {
            'A+': 4.0, 'A': 4.0, 'A-': 3.7,
            'B+': 3.3, 'B': 3.0, 'B-': 2.7,
            'C+': 2.3, 'C': 2.0, 'C-': 1.7,
            'D+': 1.3, 'D': 1.0, 'F': 0.0
        };

        return gradeMap[grade.toUpperCase()] || 0;
    },

    // Debounce function to limit how often a function can be called
    debounce: function(func, wait) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    },

    // Throttle function to limit how often a function can be called over time
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Generate a unique ID
    generateId: function() {
        return Math.random().toString(36).substr(2, 9);
    },

    // Validate email address
    validateEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    },

    // Format date to readable string
    formatDate: function(date) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    },

    // Show a toast notification
    showToast: function(message, type = 'success') {
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
};

// Add to global scope if needed
window.StudySphereUtils = Utils;
// Format time in seconds to HH:MM:SS
function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [
        hrs.toString().padStart(2, '0'),
        mins.toString().padStart(2, '0'),
        secs.toString().padStart(2, '0')
    ].join(':');
}

// Save data to localStorage with timestamp
function saveData(key, value) {
    const data = {
        value: value,
        timestamp: new Date().getTime()
    };
    localStorage.setItem(key, JSON.stringify(data));
}

// Get data from localStorage and check if it's expired
function getData(key, expiryHours = 24) {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const data = JSON.parse(item);
    const now = new Date().getTime();
    const expiryTime = expiryHours * 60 * 60 * 1000; // Convert hours to milliseconds

    if (now - data.timestamp > expiryTime) {
        localStorage.removeItem(key);
        return null;
    }

    return data.value;
}

// Calculate GPA from grades and credits
function calculateGPA(subjects) {
    if (!subjects || subjects.length === 0) return 0;

    let totalPoints = 0;
    let totalCredits = 0;

    subjects.forEach(subject => {
        const gradePoints = convertGradeToPoints(subject.grade);
        totalPoints += gradePoints * subject.credits;
        totalCredits += subject.credits;
    });

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
}

// Convert letter grade to grade points (4.0 scale)
function convertGradeToPoints(grade) {
    const gradeMap = {
        'A+': 4.0, 'A': 4.0, 'A-': 3.7,
        'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7,
        'D+': 1.3, 'D': 1.0, 'F': 0.0
    };

    return gradeMap[grade.toUpperCase()] || 0;
}

// Debounce function to limit how often a function can be called
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

// Throttle function to limit how often a function can be called over time
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Generate a unique ID
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

// Validate email address
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// Format date to readable string
function formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
}

// Export utility functions
export {
    formatTime,
    saveData,
    getData,
    calculateGPA,
    convertGradeToPoints,
    debounce,
    throttle,
    generateId,
    validateEmail,
    formatDate
};