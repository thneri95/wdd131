document.addEventListener('DOMContentLoaded', () => {
    // --- UTILITÁRIOS ---
    const formatDateTime = (date) => {
        const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
        const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
        return `${date.toLocaleDateString(undefined, optionsDate)} at ${date.toLocaleTimeString(undefined, optionsTime)}`;
    };

    const setTextContent = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };

    // Atualiza ano no footer
    setTextContent('year', new Date().getFullYear());

    // Atualiza data/hora da última modificação
    const lastModifiedDate = new Date(document.lastModified);
    setTextContent('lastModified', formatDateTime(lastModifiedDate));

    // --- MENU HAMBURGUER ---
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav[aria-label="Primary navigation"]');
    const navMenu = nav?.querySelector('ul');

    if (hamburger && nav && navMenu) {
        const toggleMenu = () => {
            const isOpen = navMenu.classList.contains('open');
            if (isOpen) {
                navMenu.classList.remove('open');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                nav.setAttribute('data-open', 'false');
            } else {
                navMenu.classList.add('open');
                hamburger.classList.add('active');
                hamburger.setAttribute('aria-expanded', 'true');
                nav.setAttribute('data-open', 'true');
            }
        };

        hamburger.addEventListener('click', toggleMenu);
        hamburger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
        });

        // Fecha menu ao clicar em link (UX mobile)
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                nav.setAttribute('data-open', 'false');
            });
        });
    }


    // --- DESTAQUE DA PÁGINA ATUAL NO MENU ---
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (href.includes('index') && (currentPage === '' || currentPage === 'index.html'))) {
            link.classList.add('active');
        }
    });

    // --- FORMULÁRIO ORÇAMENTO ---
    const budgetForm = document.getElementById('budgetForm');
    const budgetResultDiv = document.getElementById('result');

    const showBudgetResult = (msg, color) => {
        if (!budgetResultDiv) return;
        budgetResultDiv.textContent = msg;
        budgetResultDiv.style.color = color;
        budgetResultDiv.setAttribute('aria-live', 'polite');
    };

    if (budgetForm && budgetResultDiv) {
        budgetForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const income = parseFloat(budgetForm.income.value.trim().replace(',', '.'));
            const expenses = parseFloat(budgetForm.expenses.value.trim().replace(',', '.'));

            if (isNaN(income) || isNaN(expenses)) {
                showBudgetResult('Please enter valid numbers for both income and expenses.', '#d93025');
                return;
            }

            const balance = income - expenses;
            const percentSpent = (expenses / income) * 100;

            let message = '';

            if (balance > 0) {
                message = `Great! You have a surplus of $${balance.toFixed(2)} this month 🎉`;
            } else if (balance < 0) {
                message = `Oops! You're over budget by $${Math.abs(balance).toFixed(2)}, Consider adjusting your expenses! ⚠️`;
            } else {
                message = 'You broke even this month. Try to save a little next time! 💡';
            }

            message += ` You are spending ${percentSpent.toFixed(2)}% of your income.`;

            if (percentSpent > 40) {
                message += `  Financial health alert: A healthy budget should keep expenses under 40% of your income ⚠️ `;
            }

            const color = percentSpent > 40 ? '#d93025' : (balance >= 0 ? '#188038' : '#f29900');
            showBudgetResult(message, color);
        });
    }

    // --- FORMULÁRIO DE CONTATO ---
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm && formMessage) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Simula envio - substituir por backend real
            formMessage.textContent = 'Your message has been sent successfully!';
            formMessage.style.color = '#188038';
            formMessage.style.marginTop = '1rem';
            contactForm.reset();
        });
    }

    // --- FORMULÁRIO META DE POUPANÇA ---
    const goalForm = document.getElementById('goalForm');
    const goalResult = document.getElementById('result');

    if (goalForm && goalResult) {
        goalForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const goal = parseFloat(document.getElementById('goalAmount').value);
            const monthly = parseFloat(document.getElementById('monthlyContribution').value);
            const rate = parseFloat(document.getElementById('interestRate').value) / 100;

            if (isNaN(goal) || isNaN(monthly) || isNaN(rate)) {
                goalResult.textContent = 'Please enter valid numbers for all fields!';
                goalResult.style.color = '#d93025';
                return;
            }

            let months = 0;
            let total = 0;

            while (total < goal && months < 1000) {
                total = (total + monthly) * (1 + rate);
                months++;
            }

            if (total >= goal) {
                const years = Math.floor(months / 12);
                const remainingMonths = months % 12;
                const formatter = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2,
                });

                goalResult.textContent = `You will reach ${formatter.format(goal)} in ${years} year(s) and ${remainingMonths} month(s)`;
                goalResult.style.color = '#188038';
            } else {
                goalResult.textContent = 'Goal not reached in a reasonable time, Please adjust your inputs.';
                goalResult.style.color = '#d93025';
            }
        });
    }
});
