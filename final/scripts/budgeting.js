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

    // --- Simple Budget Calculator Functionality ---
    const budgetForm = document.getElementById('budgetForm');
    const incomeInput = document.getElementById('income');
    const expensesInput = document.getElementById('expenses');
    const incomeError = document.getElementById('incomeError');
    const expensesError = document.getElementById('expensesError');
    const resultDiv = document.getElementById('result');

    // Function to parse input value, handling both comma and period as decimal separators
    const parseNumber = (value) => {
        // Replace comma with period for consistent parsing, then parse as float
        return parseFloat(value.replace(',', '.'));
    };

    // Function to format currency to USD
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    // Function to validate input fields
    const validateInput = (inputElement, errorElement) => {
        const value = inputElement.value.trim();
        if (value === '') {
            errorElement.textContent = 'This field cannot be empty.';
            inputElement.classList.add('invalid');
            return false;
        }
        const parsedValue = parseNumber(value);
        if (isNaN(parsedValue)) {
            errorElement.textContent = 'Please enter a valid number (e.g., 1234.56 or 1234,56).';
            inputElement.classList.add('invalid');
            return false;
        }
        if (parsedValue < 0) {
            errorElement.textContent = 'Please enter a non-negative number.';
            inputElement.classList.add('invalid');
            return false;
        }
        errorElement.textContent = ''; // Clear error if valid
        inputElement.classList.remove('invalid');
        return true;
    };

    // --- Load saved values from localStorage on page load ---
    if (incomeInput && expensesInput) {
        const savedIncome = localStorage.getItem('budgetIncome');
        const savedExpenses = localStorage.getItem('budgetExpenses');

        if (savedIncome) {
            incomeInput.value = savedIncome;
        }
        if (savedExpenses) {
            expensesInput.value = savedExpenses;
        }
    }

    if (budgetForm) {
        // Real-time validation as user types
        incomeInput.addEventListener('input', () => validateInput(incomeInput, incomeError));
        expensesInput.addEventListener('input', () => validateInput(expensesInput, expensesError));

        budgetForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default form submission

            const isIncomeValid = validateInput(incomeInput, incomeError);
            const isExpensesValid = validateInput(expensesInput, expensesError);

            if (!isIncomeValid || !isExpensesValid) {
                resultDiv.innerHTML = '<p class="error-message">Please correct the errors in the form.</p>';
                return; // Stop if validation fails
            }

            const income = parseNumber(incomeInput.value);
            const expenses = parseNumber(expensesInput.value);

            // Check for NaN after parsing
            if (isNaN(income) || isNaN(expenses)) {
                resultDiv.innerHTML = '<p class="error-message">A numerical error occurred. Please try again.</p>';
                return;
            }

            // --- Save current values to localStorage on successful calculation ---
            localStorage.setItem('budgetIncome', incomeInput.value);
            localStorage.setItem('budgetExpenses', expensesInput.value);


            // --- Balance Calculation & Message ---
            const balance = income - expenses;
            let balanceMessage = '';
            let balanceClassName = '';

            if (balance > 0) {
                balanceMessage = `Great! You have a surplus of ${formatCurrency(balance)} this month.`;
                balanceClassName = 'positive-balance';
            } else if (balance < 0) {
                balanceMessage = `Caution! You have a deficit of ${formatCurrency(Math.abs(balance))} this month. Consider adjusting your spending or increasing income.`;
                balanceClassName = 'negative-balance';
            } else {
                balanceMessage = `Your income perfectly matches your expenses: ${formatCurrency(balance)}. This is a balanced month!`;
                balanceClassName = 'neutral-balance';
            }

            // --- Expense Percentage Calculation & Message ---
            let percentageMessage = '';
            let percentageClassName = '';

            if (income > 0) { // Avoid division by zero when calculating percentage
                const expensePercentage = (expenses / income) * 100;
                if (expensePercentage < 40) {
                    percentageMessage = `Excellent! Your expenses are ${expensePercentage.toFixed(2)}% of your income. This is a very healthy spending level. Keep it up!`;
                    percentageClassName = 'green-message';
                } else {
                    percentageMessage = `Alert! Your expenses are ${expensePercentage.toFixed(2)}% of your income. It's recommended to keep expenses below 40% for better financial health. Review your budget.`;
                    percentageClassName = 'red-message';
                }
            } else {
                // Special case: Income is zero
                if (expenses > 0) {
                    percentageMessage = `Alert! You have expenses (${formatCurrency(expenses)}) but no reported income. This indicates a critical financial situation.`;
                    percentageClassName = 'red-message';
                } else {
                    // Both income and expenses are 0
                    percentageMessage = `With no income and no expenses, your budget is currently balanced.`;
                    percentageClassName = 'neutral-message'; // Or a more specific class if desired
                }
            }

            // Combine messages in the result div
            resultDiv.innerHTML = `
                <p class="${balanceClassName}">${balanceMessage}</p>
                <p class="${percentageClassName}">${percentageMessage}</p>
            `;
        });

        // Clear button functionality
        const clearButton = budgetForm.querySelector('.btn-secondary');
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                incomeInput.value = '';
                expensesInput.value = '';
                incomeError.textContent = '';
                expensesError.textContent = '';
                incomeInput.classList.remove('invalid');
                expensesInput.classList.remove('invalid');
                resultDiv.innerHTML = ''; // Clear the result message

                // --- Clear saved values from localStorage on clear button click ---
                localStorage.removeItem('budgetIncome');
                localStorage.removeItem('budgetExpenses');
            });
        }
    }
});