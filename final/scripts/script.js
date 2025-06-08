document.addEventListener('DOMContentLoaded', () => {
    const formatDateTime = (date) => {
        const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
        const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
        return `${date.toLocaleDateString(undefined, optionsDate)} at ${date.toLocaleTimeString(undefined, optionsTime)}`;
    };

    const setTextContent = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };

    setTextContent('year', new Date().getFullYear());
    setTextContent('lastModified', formatDateTime(new Date(document.lastModified)));

    function greetUser() {
        const hour = new Date().getHours();
        let name = localStorage.getItem("userName");

        // Se não houver nome salvo, pegar do input (se preenchido)
        if (!name) {
            const nameInput = document.getElementById("name");
            if (nameInput && nameInput.value.trim() !== "") {
                name = nameInput.value.trim();
                localStorage.setItem("userName", name);
            } else {
                name = "Guest";
            }
        }

        let greeting = "Hello";
        if (hour < 12) greeting = "Good morning";
        else if (hour < 18) greeting = "Good afternoon";
        else greeting = "Good evening";

        const welcomeEl = document.getElementById("welcomeMessage");
        if (welcomeEl) {
            welcomeEl.textContent = `${greeting}, ${name}! Welcome back to Smart Finance.`;
            greetUser();

        }
    }



    // Menu hamburger
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav[aria-label="Primary navigation"]');
    const navMenu = nav?.querySelector('ul');

    if (hamburger && nav && navMenu) {
        const toggleMenu = () => {
            navMenu.classList.toggle('open');
            hamburger.classList.toggle('active');
            const isOpen = navMenu.classList.contains('open');
            hamburger.setAttribute('aria-expanded', isOpen.toString());
            nav.setAttribute('data-open', isOpen.toString());
        };

        hamburger.addEventListener('click', toggleMenu);
        hamburger.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
        });

        navMenu.querySelectorAll('a').forEach(link =>
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                nav.setAttribute('data-open', 'false');
            })
        );
    }

    // Página ativa no menu
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (href.includes('index') && currentPage === 'index.html')) {
            link.classList.add('active');
        }
    });

    // Formulário de orçamento
    const budgetForm = document.getElementById('budgetForm');
    const budgetResultDiv = document.getElementById('result');

    const showBudgetResult = (msg, color) => {
        if (!budgetResultDiv) return;
        budgetResultDiv.textContent = msg;
        budgetResultDiv.style.color = color;
        budgetResultDiv.setAttribute('aria-live', 'polite');
    };

    const loadBudget = () => {
        const saved = JSON.parse(localStorage.getItem('budgetData'));
        if (saved) {
            budgetForm.income.value = saved.income || '';
            budgetForm.expenses.value = saved.expenses || '';
        }
    };

    const saveBudget = () => {
        const data = {
            income: budgetForm.income.value,
            expenses: budgetForm.expenses.value
        };
        localStorage.setItem('budgetData', JSON.stringify(data));
    };

    if (budgetForm && budgetResultDiv) {
        loadBudget();

        budgetForm.addEventListener('input', saveBudget);

        budgetForm.addEventListener('submit', e => {
            e.preventDefault();
            const income = parseFloat(budgetForm.income.value.trim().replace(',', '.'));
            const expenses = parseFloat(budgetForm.expenses.value.trim().replace(',', '.'));

            if (isNaN(income) || isNaN(expenses)) {
                showBudgetResult('Please enter valid numbers.', '#d93025');
                return;
            }

            const balance = income - expenses;
            const percentSpent = (expenses / income) * 100;
            let message = '';

            if (balance > 0) {
                message = `Great! You have a surplus of $${balance.toFixed(2)} 🎉`;
            } else if (balance < 0) {
                message = `You're over budget by $${Math.abs(balance).toFixed(2)} ⚠️`;
            } else {
                message = 'You broke even this month 💡';
            }

            message += ` Spending ${percentSpent.toFixed(2)}% of your income.`;

            if (percentSpent > 40) {
                message += ` Try to keep expenses under 40% ⚠️`;
            }

            const color = percentSpent > 40 ? '#d93025' : (balance >= 0 ? '#188038' : '#f29900');
            showBudgetResult(message, color);
        });
    }

    // Formulário de meta de poupança
    const goalForm = document.getElementById('goalForm');
    const goalResult = document.getElementById('result');

    const loadGoalData = () => {
        const data = JSON.parse(localStorage.getItem('goalData'));
        if (data) {
            document.getElementById('goalAmount').value = data.goal || '';
            document.getElementById('monthlyContribution').value = data.monthly || '';
            document.getElementById('interestRate').value = data.rate || '';
        }
    };

    const saveGoalData = () => {
        const data = {
            goal: document.getElementById('goalAmount').value,
            monthly: document.getElementById('monthlyContribution').value,
            rate: document.getElementById('interestRate').value
        };
        localStorage.setItem('goalData', JSON.stringify(data));
    };

    if (goalForm && goalResult) {
        loadGoalData();

        goalForm.addEventListener('input', saveGoalData);

        goalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const goal = parseFloat(document.getElementById('goalAmount').value);
            const monthly = parseFloat(document.getElementById('monthlyContribution').value);
            const rate = parseFloat(document.getElementById('interestRate').value) / 100;

            if (isNaN(goal) || isNaN(monthly) || isNaN(rate)) {
                goalResult.textContent = 'Please enter valid numbers!';
                goalResult.style.color = '#d93025';
                return;
            }

            let months = 0, total = 0;
            while (total < goal && months < 1000) {
                total = (total + monthly) * (1 + rate);
                months++;
            }

            if (total >= goal) {
                const years = Math.floor(months / 12);
                const remainingMonths = months % 12;
                const formatter = new Intl.NumberFormat('en-US', {
                    style: 'currency', currency: 'USD', minimumFractionDigits: 2,
                });

                goalResult.textContent = `Goal of ${formatter.format(goal)} reached in ${years} year(s) and ${remainingMonths} month(s).`;
                goalResult.style.color = '#188038';
            } else {
                goalResult.textContent = 'Goal not reachable, adjust your inputs.';
                goalResult.style.color = '#d93025';
            }
        });
    }

    // Formulário de contato
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm && formMessage) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = contactForm.querySelector('input[name="name"]').value;
            localStorage.setItem("userName", name);

            const email = contactForm.querySelector('input[name="email"]').value;
            const message = contactForm.querySelector('textarea[name="message"]').value;

            const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
            messages.push({ name, email, message, date: new Date().toISOString() });
            localStorage.setItem('contactMessages', JSON.stringify(messages));

            formMessage.textContent = 'Your message has been sent!';
            formMessage.style.color = '#188038';
            contactForm.reset();
        });
    }
});
