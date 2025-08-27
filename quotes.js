class QuoteManager {
    constructor() {
        this.quotes = [
            {
                text: "The secret of getting ahead is getting started.",
                author: "Mark Twain"
            },
            {
                text: "You don't have to be great to start, but you have to start to be great.",
                author: "Zig Ziglar"
            },
            {
                text: "The expert in anything was once a beginner.",
                author: "Helen Hayes"
            },
            {
                text: "Success is the sum of small efforts, repeated day in and day out.",
                author: "Robert Collier"
            },
            {
                text: "The future depends on what you do today.",
                author: "Mahatma Gandhi"
            },
            {
                text: "Don't watch the clock; do what it does. Keep going.",
                author: "Sam Levenson"
            },
            {
                text: "The only way to do great work is to love what you do.",
                author: "Steve Jobs"
            },
            {
                text: "Believe you can and you're halfway there.",
                author: "Theodore Roosevelt"
            }
        ];

        this.tips = [
            "Take short breaks every 25-50 minutes to maintain focus.",
            "Organize your study space to minimize distractions.",
            "Set specific goals for each study session.",
            "Teach what you've learned to someone else to reinforce your understanding.",
            "Use active recall techniques instead of passive rereading.",
            "Mix different subjects or topics in a single study session for better retention.",
            "Get enough sleep - it's crucial for memory consolidation.",
            "Stay hydrated and take care of your physical health for optimal brain function."
        ];

        this.currentDate = new Date().toDateString();
        this.lastQuoteDate = localStorage.getItem('lastQuoteDate');
        this.currentQuoteIndex = parseInt(localStorage.getItem('currentQuoteIndex')) || 0;
        this.currentTipIndex = parseInt(localStorage.getItem('currentTipIndex')) || 0;

        this.init();
    }

    init() {
        // Rotate quote and tip if it's a new day
        if (this.lastQuoteDate !== this.currentDate) {
            this.rotateQuote();
            this.rotateTip();
            localStorage.setItem('lastQuoteDate', this.currentDate);
        }

        this.displayCurrentQuote();
    }

    rotateQuote() {
        this.currentQuoteIndex = (this.currentQuoteIndex + 1) % this.quotes.length;
        localStorage.setItem('currentQuoteIndex', this.currentQuoteIndex);
    }

    rotateTip() {
        this.currentTipIndex = (this.currentTipIndex + 1) % this.tips.length;
        localStorage.setItem('currentTipIndex', this.currentTipIndex);
    }

    displayCurrentQuote() {
        const quoteElement = document.getElementById('daily-quote');
        const authorElement = document.getElementById('quote-author');
        const blockerQuoteElement = document.getElementById('blocker-quote');

        if (quoteElement && authorElement) {
            const quote = this.quotes[this.currentQuoteIndex];
            quoteElement.textContent = `"${quote.text}"`;
            authorElement.textContent = `- ${quote.author}`;
        }

        if (blockerQuoteElement) {
            const randomIndex = Math.floor(Math.random() * this.quotes.length);
            const randomQuote = this.quotes[randomIndex];
            blockerQuoteElement.textContent = `"${randomQuote.text}" - ${randomQuote.author}`;
        }
    }

    getDailyTip() {
        return this.tips[this.currentTipIndex];
    }
    // Motivational Quotes Module
const motivationalQuotes = [
    {
        text: "Education is the most powerful weapon which you can use to change the world.",
        author: "Nelson Mandela"
    },
    {
        text: "The expert in anything was once a beginner.",
        author: "Helen Hayes"
    },
    {
        text: "Success is the sum of small efforts, repeated day in and day out.",
        author: "Robert Collier"
    },
    {
        text: "Don't watch the clock; do what it does. Keep going.",
        author: "Sam Levenson"
    },
    {
        text: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt"
    },
    {
        text: "You don't have to be great to start, but you have to start to be great.",
        author: "Zig Ziglar"
    },
    {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs"
    },
    {
        text: "Believe you can and you're halfway there.",
        author: "Theodore Roosevelt"
    },
    {
        text: "It always seems impossible until it's done.",
        author: "Nelson Mandela"
    },
    {
        text: "Your education is a dress rehearsal for a life that is yours to lead.",
        author: "Nora Ephron"
    },
    {
        text: "The beautiful thing about learning is that no one can take it away from you.",
        author: "B.B. King"
    },
    {
        text: "You are never too old to set another goal or to dream a new dream.",
        author: "C.S. Lewis"
    },
    {
        text: "Success is no accident. It is hard work, perseverance, learning, studying, sacrifice and most of all, love of what you are doing.",
        author: "Pelé"
    },
    {
        text: "The only limit to our realization of tomorrow is our doubts of today.",
        author: "Franklin D. Roosevelt"
    },
    {
        text: "Learning is a treasure that will follow its owner everywhere.",
        author: "Chinese Proverb"
    }
];

// Academic Tips
const academicTips = [
    "Break your study sessions into 25-minute chunks with 5-minute breaks (Pomodoro Technique).",
    "Teach what you've learned to someone else to reinforce your understanding.",
    "Create a study schedule and stick to it consistently.",
    "Prioritize sleep - it's essential for memory consolidation.",
    "Use active recall by testing yourself instead of just re-reading notes.",
    "Make connections between new information and what you already know.",
    "Start assignments early to avoid last-minute stress.",
    "Find a dedicated study space free from distractions.",
    "Stay hydrated and eat brain-boosting foods like nuts and berries.",
    "Review material regularly instead of cramming before exams."
];

// Initialize quotes display
function initQuotes() {
    displayRandomQuote();
    setInterval(displayRandomQuote, 60000); // Change quote every minute
}

// Display a random motivational quote
function displayRandomQuote() {
    const quoteContainer = document.getElementById('motivational-quote');
    if (!quoteContainer) return;

    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    const quote = motivationalQuotes[randomIndex];

    quoteContainer.innerHTML = `
        <p>"${quote.text}"</p>
        <small>- ${quote.author}</small>
    `;
}

// Get a random academic tip
function getRandomAcademicTip() {
    const randomIndex = Math.floor(Math.random() * academicTips.length);
    return academicTips[randomIndex];
}

// Display a tip in the specified element
function displayAcademicTip(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = getRandomAcademicTip();
    }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', initQuotes);
}

// Quotes Manager
class QuotesManager {
    constructor() {
        this.quotes = [];
        this.loadQuotes();
    }

    async loadQuotes() {
        try {
            const response = await fetch('assets/quotes.json');
            this.quotes = await response.json();
        } catch (error) {
            console.error('Failed to load quotes:', error);
            this.quotes = this.getDefaultQuotes();
        }
    }

    getDefaultQuotes() {
        return [
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
    }

    getRandomQuote() {
        if (this.quotes.length === 0) {
            return this.getDefaultQuotes()[0];
        }
        return this.quotes[Math.floor(Math.random() * this.quotes.length)];
    }

    displayRandomQuote(elementId) {
        const quote = this.getRandomQuote();
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = `
                <p>"${quote.text}"</p>
                <span>- ${quote.author}</span>
            `;
        }
    }
}

// Initialize quotes manager
const quotesManager = new QuotesManager();
// Initialize Quote Manager if on pages that use quotes
if (window.location.pathname.includes('focus-zone.html') ||
    window.location.pathname.includes('index.html')) {
    const quoteManager = new QuoteManager();
}