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

    // --- Contact Form Functionality ---
    const contactForm = document.getElementById('contactForm');
    const fullnameInput = document.getElementById('fullname');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone'); // Optional: store phone
    const subjectSelect = document.getElementById('subject'); // Optional: store subject
    const messageTextarea = document.getElementById('message'); // Optional: store message

    const formMessage = document.getElementById('formMessage'); // Element to display form messages

    // Helper function for displaying validation errors
    const displayError = (element, message) => {
        if (element) {
            element.textContent = message;
            element.closest('.form-group')?.classList.add('has-error');
        }
    };

    // Helper function for clearing validation errors
    const clearError = (element) => {
        if (element) {
            element.textContent = '';
            element.closest('.form-group')?.classList.remove('has-error');
        }
    };

    // Validate a single input field
    const validateField = (inputElement) => {
        const errorElement = document.getElementById(`${inputElement.id}-error`);
        let isValid = true;
        let errorMessage = '';

        // Clear previous error
        clearError(errorElement);

        if (inputElement.hasAttribute('required') && inputElement.value.trim() === '') {
            errorMessage = 'This field is required.';
            isValid = false;
        } else if (inputElement.type === 'email' && inputElement.value.trim() !== '' && !inputElement.value.includes('@')) {
            errorMessage = 'Please enter a valid email address.';
            isValid = false;
        } else if (inputElement.type === 'tel' && inputElement.value.trim() !== '' && !inputElement.value.match(/^\+?[0-9\s\-().]{7,20}$/)) {
            errorMessage = 'Please enter a valid phone number (e.g., +1 (555) 123-4567).';
            isValid = false;
        } else if (inputElement.tagName === 'TEXTAREA' && inputElement.value.trim().length < (inputElement.minLength || 0)) {
            errorMessage = `Message must be at least ${inputElement.minLength} characters.`;
            isValid = false;
        } else if (inputElement.tagName === 'SELECT' && inputElement.value === '') {
            errorMessage = 'Please select a subject.';
            isValid = false;
        }

        if (!isValid) {
            displayError(errorElement, errorMessage);
        }
        return isValid;
    };

    // --- Load saved values from localStorage on page load ---
    if (fullnameInput && emailInput) {
        const savedFullName = localStorage.getItem('t2SmartFinanceUserName'); // Key used on index.html
        const savedEmail = localStorage.getItem('t2SmartFinanceUserEmail');
        const savedPhone = localStorage.getItem('t2SmartFinanceUserPhone');
        const savedSubject = localStorage.getItem('t2SmartFinanceUserSubject');
        const savedMessage = localStorage.getItem('t2SmartFinanceUserMessage');


        if (savedFullName) {
            fullnameInput.value = savedFullName;
        }
        if (savedEmail) {
            emailInput.value = savedEmail;
        }
        if (savedPhone) {
            phoneInput.value = savedPhone;
        }
        if (savedSubject) {
            subjectSelect.value = savedSubject;
        }
        if (savedMessage) {
            messageTextarea.value = savedMessage;
        }
    }


    if (contactForm) {
        // Add real-time validation on input/change events
        ['fullname', 'email', 'phone', 'subject', 'message'].forEach(id => {
            const inputElement = document.getElementById(id);
            if (inputElement) {
                inputElement.addEventListener('input', () => {
                    validateField(inputElement);
                    formMessage.textContent = ''; // Clear general form message on input
                    formMessage.classList.remove('success-message-box', 'error-message-box'); // Use specific classes
                });
                // For select elements, 'change' is more appropriate
                if (inputElement.tagName === 'SELECT') {
                    inputElement.addEventListener('change', () => validateField(inputElement));
                }
            }
        });

        contactForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default form submission

            let allFieldsValid = true;
            // Validate all fields on submit
            ['fullname', 'email', 'phone', 'subject', 'message'].forEach(id => {
                const inputElement = document.getElementById(id);
                if (inputElement && !validateField(inputElement)) {
                    allFieldsValid = false;
                }
            });

            if (allFieldsValid) {
                // --- Save values to localStorage on successful submission ---
                localStorage.setItem('t2SmartFinanceUserName', fullnameInput.value);
                localStorage.setItem('t2SmartFinanceUserEmail', emailInput.value);
                // Only save optional fields if they have content
                if (phoneInput.value.trim() !== '') {
                    localStorage.setItem('t2SmartFinanceUserPhone', phoneInput.value);
                } else {
                    localStorage.removeItem('t2SmartFinanceUserPhone'); // Clear if empty
                }
                if (subjectSelect.value.trim() !== '') {
                    localStorage.setItem('t2SmartFinanceUserSubject', subjectSelect.value);
                } else {
                    localStorage.removeItem('t2SmartFinanceUserSubject');
                }
                if (messageTextarea.value.trim() !== '') {
                    localStorage.setItem('t2SmartFinanceUserMessage', messageTextarea.value);
                } else {
                    localStorage.removeItem('t2SmartFinanceUserMessage');
                }


                // --- SIMULATED SUCCESS MESSAGE (Remove this once you have actual backend submission) ---
                formMessage.textContent = 'Thank you for your message! We will get back to you shortly.';
                formMessage.classList.add('success-message-box');
                formMessage.classList.remove('error-message-box');
                contactForm.reset(); // Clear the form
                // Clear all individual field errors after reset
                ['fullname', 'email', 'phone', 'subject', 'message'].forEach(id => {
                    clearError(document.getElementById(`${id}-error`));
                    document.getElementById(id)?.closest('.form-group')?.classList.remove('has-error');
                });
                // --- END SIMULATED MESSAGE ---

            } else {
                formMessage.textContent = 'Please correct the errors in the form before submitting.';
                formMessage.classList.add('error-message-box');
                formMessage.classList.remove('success-message-box');
            }
        });

        // Clear button functionality
        const clearButton = contactForm.querySelector('.btn-secondary');
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                contactForm.reset(); // Resets all form fields
                // Clear all individual field errors
                ['fullname', 'email', 'phone', 'subject', 'message'].forEach(id => {
                    clearError(document.getElementById(`${id}-error`));
                    document.getElementById(id)?.closest('.form-group')?.classList.remove('has-error');
                });
                formMessage.textContent = ''; // Clear general form message
                formMessage.classList.remove('success-message-box', 'error-message-box');

                // --- Clear saved values from localStorage on clear button click ---
                localStorage.removeItem('t2SmartFinanceUserName');
                localStorage.removeItem('t2SmartFinanceUserEmail');
                localStorage.removeItem('t2SmartFinanceUserPhone');
                localStorage.removeItem('t2SmartFinanceUserSubject');
                localStorage.removeItem('t2SmartFinanceUserMessage');
            });
        }
    }
});