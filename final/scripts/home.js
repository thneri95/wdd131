document.addEventListener('DOMContentLoaded', () => {
    // --- Hamburger Menu Functionality ---
    const hamburgerButton = document.querySelector('.hamburger');
    const navMenu = document.getElementById('primary-menu');

    if (hamburgerButton && navMenu) {
        hamburgerButton.addEventListener('click', () => {
            const expanded = hamburgerButton.getAttribute('aria-expanded') === 'true' || false;
            hamburgerButton.setAttribute('aria-expanded', !expanded);
            navMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll'); // Optional: prevent scrolling when menu is open
        });

        // Close menu when a navigation link is clicked (for single-page feel or smooth navigation)
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburgerButton.setAttribute('aria-expanded', false);
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // --- Footer Information (Current Year and Last Modified Date) ---
    const yearSpan = document.getElementById('year');
    const lastModifiedSpan = document.getElementById('lastModified');

    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    if (lastModifiedSpan) {
        lastModifiedSpan.textContent = document.lastModified;
    }

    // --- Dynamic Welcome Message with localStorage ---
    const welcomeMessageElement = document.getElementById('welcomeMessage');
    if (welcomeMessageElement) {
        const date = new Date();
        const hour = date.getHours();
        let greeting;

        if (hour < 12) {
            greeting = "Good morning";
        } else if (hour < 18) {
            greeting = "Good afternoon";
        } else {
            greeting = "Good evening";
        }

        // Retrieve user's name from localStorage
        const userName = localStorage.getItem('t2SmartFinanceUserName');

        if (userName) {
            // If name exists in localStorage, personalize the greeting
            welcomeMessageElement.textContent = `${greeting}, ${userName}! Welcome back to T2 Smart Finance!`;
        } else {
            // If no name, use the general greeting
            welcomeMessageElement.textContent = `${greeting}! Welcome to T2 Smart Finance!`;
        }
    }
});