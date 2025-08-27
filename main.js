// Main Application Script
document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle Functionality
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme') ||
                       (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    // Apply the saved theme
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        body.classList.remove('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }

    // Theme toggle button event
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-theme');
        const isDark = body.classList.contains('dark-theme');

        if (isDark) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'dark');
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'light');
        }
    });

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Start Focus Session Button
    const startFocusBtn = document.getElementById('start-focus-btn');
    if (startFocusBtn) {
        startFocusBtn.addEventListener('click', function() {
            window.location.href = 'focus-zone.html';
        });
    }

    // Task completion toggle
    const taskCheckboxes = document.querySelectorAll('.task-item input[type="checkbox"]');
    taskCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const label = this.nextElementSibling;
            if (this.checked) {
                label.style.textDecoration = 'line-through';
                label.style.color = 'var(--gray-medium)';
            } else {
                label.style.textDecoration = 'none';
                label.style.color = '';
            }
        });
    });

    // Load random quote
    loadRandomQuote();
});
// Apply saved theme on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.className = `${savedTheme}-theme`;

    // Update theme toggle icon
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
});
function loadRandomQuote() {
    const quotes = [
        {
            text: "The expert in anything was once a beginner.",
            author: "Helen Hayes"
        },
        {
            text: "Success is the sum of small efforts, repeated day in and day out.",
            author: "Robert Collier"
        },
        {
            text: "The secret of getting ahead is getting started.",
            author: "Mark Twain"
        },
        {
            text: "Don't watch the clock; do what it does. Keep going.",
            author: "Sam Levenson"
        },
        {
            text: "The only place where success comes before work is in the dictionary.",
            author: "Vidal Sassoon"
        },
        {
            text: "You don't have to be great to start, but you have to start to be great.",
            author: "Zig Ziglar"
        }
    ];

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const quoteElement = document.querySelector('.quote-content p');
    const authorElement = document.querySelector('.quote-author');

    if (quoteElement && authorElement) {
        quoteElement.textContent = `"${randomQuote.text}"`;
        authorElement.textContent = `- ${randomQuote.author}`;
    }
}