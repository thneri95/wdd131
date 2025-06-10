document.addEventListener('DOMContentLoaded', () => {
    // --- Hamburger Menu Functionality (consistent across pages) ---
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

    // --- Footer Information (Current Year and Last Modified Date - consistent across pages) ---
    const yearSpan = document.getElementById('year');
    const lastModifiedSpan = document.getElementById('lastModified');

    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    if (lastModifiedSpan) {
        lastModifiedSpan.textContent = document.lastModified;
    }

    // --- Saving Goal Calculator Functionality ---
    const goalForm = document.getElementById('goalForm');
    const goalAmountInput = document.getElementById('goalAmount');
    const monthlyContributionInput = document.getElementById('monthlyContribution');
    const interestRateInput = document.getElementById('interestRate');
    const resultDiv = document.getElementById('result');

    // Function to format currency to USD
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    // Helper function to display validation errors
    const displayError = (inputElement, message) => {
        let errorElement = document.getElementById(`${inputElement.id}-error`);
        if (!errorElement) { // Create error span if it doesn't exist
            errorElement = document.createElement('span');
            errorElement.id = `${inputElement.id}-error`;
            errorElement.className = 'error-message';
            errorElement.setAttribute('aria-live', 'polite');
            inputElement.parentNode.insertBefore(errorElement, inputElement.nextSibling);
        }
        errorElement.textContent = message;
        inputElement.classList.add('invalid');
        inputElement.closest('.form-group')?.classList.add('has-error');
    };

    // Helper function to clear validation errors
    const clearError = (inputElement) => {
        const errorElement = document.getElementById(`${inputElement.id}-error`);
        if (errorElement) {
            errorElement.textContent = '';
        }
        inputElement.classList.remove('invalid');
        inputElement.closest('.form-group')?.classList.remove('has-error');
    };

    // Validate a single numeric input field
    const validateNumericInput = (inputElement) => {
        const value = inputElement.value.trim();
        if (value === '') {
            displayError(inputElement, 'This field is required.');
            return false;
        }
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
            displayError(inputElement, 'Please enter a valid number.');
            return false;
        }
        if (numValue < 0) {
            displayError(inputElement, 'Please enter a non-negative number.');
            return false;
        }
        clearError(inputElement);
        return true;
    };

    if (goalForm) {
        // Add real-time validation to all input fields
        [goalAmountInput, monthlyContributionInput, interestRateInput].forEach(input => {
            input.addEventListener('input', () => validateNumericInput(input));
        });

        goalForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default form submission

            let allValid = true;
            if (!validateNumericInput(goalAmountInput)) allValid = false;
            if (!validateNumericInput(monthlyContributionInput)) allValid = false;
            if (!validateNumericInput(interestRateInput)) allValid = false;

            if (!allValid) {
                resultDiv.innerHTML = '<p class="error-message">Please correct the errors in the form before calculating.</p>';
                resultDiv.classList.remove('success'); // Ensure previous success state is cleared
                return;
            }

            const goalAmount = parseFloat(goalAmountInput.value);
            const monthlyContribution = parseFloat(monthlyContributionInput.value);
            // Convert annual percentage rate to monthly decimal rate
            const monthlyInterestRate = parseFloat(interestRateInput.value) / 100; // Assuming input is %

            let months = 0;
            let currentSavings = 0;
            const maxMonths = 1200; // Cap at 100 years to prevent infinite loops

            if (monthlyContribution <= 0 && goalAmount > 0) {
                resultDiv.innerHTML = '<p class="error-message">To reach your goal, you must make a positive monthly contribution.</p>';
                resultDiv.classList.remove('success');
                return;
            }

            if (goalAmount <= 0) {
                resultDiv.innerHTML = '<p class="success">Your goal is already met or set to zero. Excellent!</p>';
                resultDiv.classList.add('success');
                return;
            }

            if (monthlyContribution === 0 && monthlyInterestRate === 0 && goalAmount > 0) {
                resultDiv.innerHTML = '<p class="error-message">With no contributions and no interest, your goal will never be reached.</p>';
                resultDiv.classList.remove('success');
                return;
            }

            while (currentSavings < goalAmount && months < maxMonths) {
                if (monthlyInterestRate > 0) {
                    currentSavings *= (1 + monthlyInterestRate); // Apply interest
                }
                currentSavings += monthlyContribution; // Add monthly contribution
                months++;
            }

            let message = '';
            let className = '';

            if (currentSavings >= goalAmount) {
                const years = Math.floor(months / 12);
                const remainingMonths = months % 12;
                message = `<p>Based on your goal and saves:</p>
                           <p>You will reach your goal of ${formatCurrency(goalAmount)} in about <strong>${years} years and ${remainingMonths} months</strong>.`;
                if (months > 0) { // Only show total contributed if there's actual contribution
                    message += ` You will have contributed a total of ${formatCurrency(monthlyContribution * months)} to reach this goal.`;
                }
                message += ` Keep saving diligently!</p>`;
                className = 'success';
            } else {
                message = `<p>It will take more than ${Math.floor(maxMonths / 12)} years to reach your goal with these contributions. Consider increasing your monthly savings or re-evaluating your goal.</p>`;
                className = 'warning'; // Or an 'error' class if you prefer a strong warning
            }

            resultDiv.innerHTML = message;
            resultDiv.className = `calculator-result ${className}`; // Set class for styling
        });
    }
});