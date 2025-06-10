document.addEventListener('DOMContentLoaded', () => {

    const formatDateTime = (date) => {
        const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
        const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: true };
        return `${date.toLocaleDateString('en-US', optionsDate)} at ${date.toLocaleTimeString('en-US', optionsTime)}`;
    };

    const setTextContent = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };

    const normalizeNumber = (value) => value.replace(',', '.');

    const formatUSD = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const showError = (errorElement, inputElement, message) => {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        inputElement.classList.add('invalid');
        inputElement.setAttribute('aria-invalid', 'true');
    };

    const hideError = (errorElement, inputElement) => {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
        inputElement.classList.remove('invalid');
        inputElement.removeAttribute('aria-invalid');
    };

    const validateAndParseNumericInput = (inputElement, errorElement, allowZero = false) => {
        const rawValue = inputElement.value.trim();
        if (!rawValue) {
            showError(errorElement, inputElement, 'This field cannot be empty.');
            return null;
        }

        const isValidFormat = /^\d+(?:[.,]\d{1,2})?$/.test(rawValue);
        if (!isValidFormat) {
            showError(errorElement, inputElement, 'Please enter a valid number (e.g., 1234.56).');
            return null;
        }

        const numberValue = parseFloat(normalizeNumber(rawValue));

        if (isNaN(numberValue) || (!allowZero && numberValue <= 0) || (allowZero && numberValue < 0)) {
            showError(errorElement, inputElement, 'Please enter a valid positive number.');
            return null;
        }

        hideError(errorElement, inputElement);
        return numberValue;
    };

    (() => {
        setTextContent('year', new Date().getFullYear());
        const lastModifiedDate = new Date(document.lastModified);
        setTextContent('lastModified', formatDateTime(lastModifiedDate));
        const lastModifiedElement = document.getElementById('lastModified');
        if (lastModifiedElement) {
            lastModifiedElement.setAttribute('datetime', lastModifiedDate.toISOString());
        }
    })();

    function greetUser() {
        const welcomeEl = document.getElementById("welcomeMessage");
        if (!welcomeEl) return;

        const hour = new Date().getHours();
        let greeting;

        if (hour < 12) {
            greeting = "Good morning";
        } else if (hour < 18) {
            greeting = "Good afternoon";
        } else {
            greeting = "Good evening";
        }

        let userName = localStorage.getItem("userName");
        const nameInput = document.getElementById("name");

        if (!userName && nameInput && nameInput.value.trim() !== "") {
            userName = nameInput.value.trim();
            localStorage.setItem("userName", userName);
        } else if (!userName) {
            userName = "Guest";
        }

        welcomeEl.textContent = `${greeting}, ${userName}! Welcome to T2 Smart Finance!`;
    }
    greetUser();

    (() => {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger && navMenu) {
            const toggleMenu = () => {
                const isOpen = navMenu.classList.toggle('active');
                hamburger.classList.toggle('active');
                hamburger.setAttribute('aria-expanded', isOpen.toString());
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
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                })
            );
        }
    })();

    (() => {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-menu a').forEach(link => {
            const linkPath = link.getAttribute('href').split('/').pop();
            if (linkPath === currentPath) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    })();

    (() => {
        const budgetForm = document.getElementById('budgetForm');
        if (!budgetForm) return;

        const incomeInput = document.getElementById('income');
        const expensesInput = document.getElementById('expenses');
        const incomeError = document.getElementById('incomeError');
        const expensesError = document.getElementById('expensesError');
        const budgetResultDiv = document.getElementById('result');

        const loadBudget = () => {
            const saved = JSON.parse(localStorage.getItem('budgetData'));
            if (saved) {
                incomeInput.value = saved.income || '';
                expensesInput.value = saved.expenses || '';
            }
        };

        const saveBudget = () => {
            const data = {
                income: incomeInput.value,
                expenses: expensesInput.value
            };
            localStorage.setItem('budgetData', JSON.stringify(data));
        };

        loadBudget();

        incomeInput.addEventListener('input', saveBudget);
        expensesInput.addEventListener('input', saveBudget);

        budgetForm.addEventListener('submit', e => {
            e.preventDefault();

            const income = validateAndParseNumericInput(incomeInput, incomeError, true);
            const expenses = validateAndParseNumericInput(expensesInput, expensesError, true);

            if (income === null || expenses === null) {
                budgetResultDiv.innerHTML = '<p class="error-message">Please fix the errors in the form before calculating.</p>';
                budgetResultDiv.className = 'budget-result';
                return;
            }

            const balance = income - expenses;
            const percentSpent = (income > 0) ? (expenses / income) * 100 : 0;

            let messageHtml = '';
            let resultClass = '';
            let recommendation = '';

            if (balance > 0) {
                messageHtml = `Your monthly financial balance is: <strong>${formatUSD(balance)}</strong>. 🎉`;
                recommendation = `Excellent! You have a surplus this month. Consider directing the excess towards your savings goals or investments.`;
                resultClass = 'positive';
            } else if (balance < 0) {
                messageHtml = `Your monthly financial balance is: <strong>${formatUSD(balance)}</strong>. ⚠️`;
                recommendation = `Heads up! You're currently spending more than you earn. It's crucial to review your expenses and look for ways to cut back.`;
                resultClass = 'negative';
            } else {
                messageHtml = `Your monthly financial balance is: <strong>${formatUSD(balance)}</strong>. 💡`;
                recommendation = `You're breaking even this month. While not losing money, there's no surplus for savings. Explore opportunities to increase income or reduce expenses.`;
                resultClass = 'neutral';
            }

            messageHtml += `<p class="message">You are spending <strong>${percentSpent.toFixed(2)}%</strong> of your income.</p>`;

            if (percentSpent > 80 && balance < 0) {
                recommendation += ` This is a high spending percentage. Focus on critical cuts.`;
            } else if (percentSpent > 50 && balance < 0) {
                recommendation += ` Reviewing non-essential expenses will be beneficial.`;
            } else if (percentSpent <= 50 && balance >= 0) {
                recommendation += ` Great spending control! Aim to keep it below 50% for optimal financial health.`;
            } else if (percentSpent > 50 && balance >= 0) {
                recommendation += ` You're doing well, but optimizing spending further could boost savings.`;
            }

            budgetResultDiv.innerHTML = `<p>${messageHtml}</p><p class="message">${recommendation}</p>`;
            budgetResultDiv.className = `budget-result ${resultClass}`;
        });

        budgetForm.addEventListener('reset', () => {
            hideError(incomeError, incomeInput);
            hideError(expensesError, expensesInput);
            budgetResultDiv.innerHTML = '';
            budgetResultDiv.className = 'budget-result';
            localStorage.removeItem('budgetData');
        });

        incomeInput.addEventListener('input', () => validateAndParseNumericInput(incomeInput, incomeError, true));
        expensesInput.addEventListener('input', () => validateAndParseNumericInput(expensesInput, expensesError, true));
    })();

    (() => {
        const goalForm = document.getElementById('goalForm');
        if (!goalForm) return;

        const goalAmountInput = document.getElementById('goalAmount');
        const monthlyContributionInput = document.getElementById('monthlyContribution');
        const interestRateInput = document.getElementById('interestRate');
        const resultDiv = document.getElementById('result');

        const goalAmountError = document.getElementById('goalAmount-error');
        const monthlyContributionError = document.getElementById('monthlyContribution-error');
        const interestRateError = document.getElementById('interestRate-error');

        goalForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const goalAmount = validateAndParseNumericInput(goalAmountInput, goalAmountError, false);
            const monthlyContribution = validateAndParseNumericInput(monthlyContributionInput, monthlyContributionError, false);
            const monthlyInterestRatePercent = validateAndParseNumericInput(interestRateInput, interestRateError, true);
            const monthlyInterestRate = monthlyInterestRatePercent !== null ? monthlyInterestRatePercent / 100 : null;

            if (goalAmount === null || monthlyContribution === null || monthlyInterestRate === null) {
                resultDiv.innerHTML = '<p class="error-message">Please fix the errors in the form before calculating.</p>';
                resultDiv.className = '';
                return;
            }

            let months = 0;
            let currentSavings = 0;

            if (monthlyInterestRate === 0) {
                if (monthlyContribution >= goalAmount) {
                    months = 1;
                } else {
                    months = Math.ceil(goalAmount / monthlyContribution);
                }
                resultDiv.innerHTML = `<p>You will reach your goal of <strong>${formatUSD(goalAmount)}</strong> in approximately <strong>${months} months</strong>.</p>`;
            } else {
                const maxMonths = 1200;
                while (currentSavings < goalAmount && months < maxMonths) {
                    currentSavings = (currentSavings + monthlyContribution) * (1 + monthlyInterestRate);
                    months++;
                }

                if (currentSavings < goalAmount) {
                    resultDiv.innerHTML = `<p class="error-message">It might take a very long time to reach your goal with these contributions and interest rate (over ${maxMonths} months). Consider increasing your contributions or finding higher returns.</p>`;
                } else {
                    resultDiv.innerHTML = `<p>You will reach your goal of <strong>${formatUSD(goalAmount)}</strong> in approximately <strong>${months} months</strong>.</p>`;
                }
            }
            resultDiv.className = 'budget-result';
        });

        goalForm.addEventListener('reset', () => {
            hideError(goalAmountError, goalAmountInput);
            hideError(monthlyContributionError, monthlyContributionInput);
            hideError(interestRateError, interestRateInput);
            resultDiv.innerHTML = '';
            resultDiv.className = '';
        });

        goalAmountInput.addEventListener('input', () => validateAndParseNumericInput(goalAmountInput, goalAmountError, false));
        monthlyContributionInput.addEventListener('input', () => validateAndParseNumericInput(monthlyContributionInput, monthlyContributionError, false));
        interestRateInput.addEventListener('input', () => validateAndParseNumericInput(interestRateInput, interestRateError, true));
    })();

    (() => {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        const fullnameInput = document.getElementById('fullname');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const subjectSelect = document.getElementById('subject');
        const messageTextarea = document.getElementById('message');

        const fullnameError = document.getElementById('fullname-error');
        const emailError = document.getElementById('email-error');
        const phoneError = document.getElementById('phone-error');
        const subjectError = document.getElementById('subject-error');
        const messageError = document.getElementById('message-error');
        const formMessage = document.getElementById('formMessage');

        const validateTextField = (inputElement, errorElement, validationFn) => {
            if (!validationFn(inputElement.value.trim())) {
                showError(errorElement, inputElement, validationFn.message);
                return false;
            } else {
                hideError(errorElement, inputElement);
                return true;
            }
        };

        const validateFullname = (value) => {
            const isValid = value.length >= 3 && /^[a-zA-Z\s.'-]+$/.test(value);
            validateFullname.message = isValid ? '' : 'Please enter a full name (at least 3 characters, letters, spaces, apostrophes, hyphens, periods only).';
            return isValid;
        };

        const validateEmail = (value) => {
            const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            validateEmail.message = isValid ? '' : 'Please enter a valid email address.';
            return isValid;
        };

        const validatePhone = (value) => {
            if (!value) return true;
            const isValid = /^\+?[0-9\s\-().]{7,20}$/.test(value);
            validatePhone.message = isValid ? '' : 'Please enter a valid phone number (7-20 digits, optional country code and special characters).';
            return isValid;
        };

        const validateSubject = (value) => {
            const isValid = !!value;
            validateSubject.message = isValid ? '' : 'Please select a subject.';
            return isValid;
        };

        const validateMessage = (value) => {
            const isValid = value.length >= 10;
            validateMessage.message = isValid ? '' : 'Message must be at least 10 characters long.';
            return isValid;
        };

        fullnameInput.addEventListener('input', () => validateTextField(fullnameInput, fullnameError, validateFullname));
        emailInput.addEventListener('input', () => validateTextField(emailInput, emailError, validateEmail));
        phoneInput.addEventListener('input', () => validateTextField(phoneInput, phoneError, validatePhone));
        subjectSelect.addEventListener('change', () => validateTextField(subjectSelect, subjectError, validateSubject));
        messageTextarea.addEventListener('input', () => validateTextField(messageTextarea, messageError, validateMessage));

        contactForm.addEventListener('submit', async event => {
            event.preventDefault();

            const isFullnameValid = validateTextField(fullnameInput, fullnameError, validateFullname);
            const isEmailValid = validateTextField(emailInput, emailError, validateEmail);
            const isPhoneValid = validateTextField(phoneInput, phoneError, validatePhone);
            const isSubjectValid = validateTextField(subjectSelect, subjectError, validateSubject);
            const isMessageValid = validateTextField(messageTextarea, messageError, validateMessage);

            const isFormValid = isFullnameValid && isEmailValid && isPhoneValid && isSubjectValid && isMessageValid;

            if (!isFormValid) {
                formMessage.textContent = 'Please correct the errors in the form before submitting.';
                formMessage.style.color = 'red';
                formMessage.classList.add('error-message-box');
                formMessage.classList.remove('success-message-box', 'sending-message-box');
                return;
            }

            formMessage.textContent = 'Sending your message...';
            formMessage.style.color = 'blue';
            formMessage.classList.add('sending-message-box');
            formMessage.classList.remove('error-message-box', 'success-message-box');

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const resetButton = contactForm.querySelector('button[type="reset"]');
            submitButton.disabled = true;
            resetButton.disabled = true;

            try {
                // const response = await fetch('YOUR_BACKEND_API_ENDPOINT', {
                //   method: 'POST',
                //   headers: {
                //     'Content-Type': 'application/json',
                //     'Accept': 'application/json'
                //   },
                //   body: JSON.stringify({
                //     fullname: fullnameInput.value,
                //     email: emailInput.value,
                //     phone: phoneInput.value,
                //     subject: subjectSelect.value,
                //     message: messageTextarea.value,
                //   }),
                // });

                // if (!response.ok) {
                //   const errorData = await response.json().catch(() => ({ message: 'Server error occurred.' }));
                //   throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorData.message || 'Unknown error.'}`);
                // }

                // const resultData = await response.json();

                await new Promise(resolve => setTimeout(resolve, 2000));

                formMessage.textContent = 'Message sent successfully! We will get back to you shortly.';
                formMessage.style.color = 'green';
                formMessage.classList.add('success-message-box');
                formMessage.classList.remove('sending-message-box', 'error-message-box');

                contactForm.reset();

                setTimeout(() => {
                    formMessage.textContent = '';
                    formMessage.classList.remove('success-message-box');
                    formMessage.style.color = '';
                }, 5000);

            } catch (error) {
                console.error('Error submitting form:', error);
                formMessage.textContent = 'Failed to send message. Please try again later.';
                formMessage.style.color = 'red';
                formMessage.classList.add('error-message-box');
                formMessage.classList.remove('sending-message-box', 'success-message-box');
            } finally {
                submitButton.disabled = false;
                resetButton.disabled = false;
            }
        });

        contactForm.addEventListener('reset', () => {
            hideError(fullnameError, fullnameInput);
            hideError(emailError, emailInput);
            hideError(phoneError, phoneInput);
            hideError(subjectError, subjectSelect);
            hideError(messageError, messageTextarea);

            formMessage.textContent = '';
            formMessage.style.color = '';
            formMessage.classList.remove('error-message-box', 'success-message-box', 'sending-message-box');

            fullnameInput.removeAttribute('aria-invalid');
            emailInput.removeAttribute('aria-invalid');
            phoneInput.removeAttribute('aria-invalid');
            subjectSelect.removeAttribute('aria-invalid');
            messageTextarea.removeAttribute('aria-invalid');

            contactForm.querySelector('button[type="submit"]').disabled = false;
            contactForm.querySelector('button[type="reset"]').disabled = false;
        });
    })();
});