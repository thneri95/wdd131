// my main.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Products  ---
    const products = [
        { id: "fc-1888", name: "Flux capacitor", averagerating: 4.5 },
        { id: "fc-2050", name: "Power laces", averagerating: 4.7 },
        { id: "fs-1987", name: "Time circuits", averagerating: 3.5 },
        { id: "ac-2000", name: "Low voltage reactor", averagerating: 3.9 },
        { id: "jj-1969", name: "Warp equalizer", averagerating: 5.0 }
    ];

    // --- DOM  ---
    const productSelect = document.getElementById('productName');
    const reviewCounterSpan = document.getElementById('reviewCounter');
    const reviewForm = document.querySelector('form');
    const installDateInput = document.getElementById('installDate');
    const reviewText = document.getElementById('reviewText');

    // Error message elements
    const productNameError = document.getElementById('productNameError');
    const overallRatingError = document.getElementById('overallRatingError');
    const installDateError = document.getElementById('installDateError');
    const reviewTextError = document.getElementById('reviewTextError');

    // --- Helper: Show error message and style ---
    function showError(errorElem, message) {
        if (!errorElem) return;

        errorElem.textContent = message;
        errorElem.style.display = 'block';

        // Add invalid style to related input or fieldset
        const relatedInput = errorElem.previousElementSibling;
        if (relatedInput?.classList) {
            relatedInput.classList.add('is-invalid');
            relatedInput.classList.remove('is-valid');
        } else {
            const fieldset = errorElem.parentElement.querySelector('fieldset');
            if (fieldset) {
                fieldset.classList.add('is-invalid');
                fieldset.classList.remove('is-valid');
            }
        }
    }

    // --- Helper: Clear error message and styles ---
    function clearError(errorElem) {
        if (!errorElem) return;

        errorElem.textContent = '';
        errorElem.style.display = 'none';

        const relatedInput = errorElem.previousElementSibling;
        if (relatedInput?.classList) {
            relatedInput.classList.remove('is-invalid');
            relatedInput.classList.add('is-valid');
        } else {
            const fieldset = errorElem.parentElement.querySelector('fieldset');
            if (fieldset) {
                fieldset.classList.remove('is-invalid');
                fieldset.classList.add('is-valid');
            }
        }
    }

    // --- Populate product select options ---
    function populateProducts() {
        if (!productSelect) return;
        products.forEach(({ id, name }) => {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = name;
            productSelect.appendChild(option);
        });
    }

    // --- localStorage review count helpers ---
    function getReviewCount() {
        const count = localStorage.getItem('reviewCount');
        return count ? parseInt(count, 10) : 0;
    }

    function setReviewCount(count) {
        localStorage.setItem('reviewCount', count.toString());
    }

    function updateDisplayedReviewCount() {
        if (reviewCounterSpan) reviewCounterSpan.textContent = getReviewCount();
    }

    // --- Validate form fields ---
    function validateForm() {
        let isValid = true;

        // Validate product selection
        if (!productSelect || productSelect.value.trim() === '') {
            showError(productNameError, 'Please select a product.');
            isValid = false;
        } else {
            clearError(productNameError);
        }

        // Validate rating
        const selectedRating = document.querySelector('input[name="overallRating"]:checked');
        if (!selectedRating) {
            showError(overallRatingError, 'Please select a rating.');
            isValid = false;
        } else {
            clearError(overallRatingError);
        }

        // Validate installation date (not future)
        if (!installDateInput || !installDateInput.value) {
            showError(installDateError, 'Please enter an installation date.');
            isValid = false;
        } else {
            const installDate = new Date(installDateInput.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (isNaN(installDate.getTime()) || installDate > today) {
                showError(installDateError, 'Please enter a valid installation date (not in the future).');
                isValid = false;
            } else {
                clearError(installDateError);
            }
        }

        // Validate review text (non-empty)
        if (!reviewText || reviewText.value.trim() === '') {
            showError(reviewTextError, 'Please enter your review.');
            isValid = false;
        } else {
            clearError(reviewTextError);
        }

        return isValid;
    }

    // --- Focus first invalid input for better UX ---
    function focusFirstInvalid() {
        const firstInvalid = document.querySelector('.is-invalid');
        if (firstInvalid && typeof firstInvalid.focus === 'function') {
            firstInvalid.focus();
        }
    }

    // --- Form submission handler ---
    if (reviewForm) {
        reviewForm.addEventListener('submit', (event) => {
            if (!validateForm()) {
                event.preventDefault();
                focusFirstInvalid();
            } else {
                // Increment and save review count
                const currentCount = getReviewCount();
                setReviewCount(currentCount + 1);
                updateDisplayedReviewCount();
            }
        });
    }

    // --- Initialize ---
    populateProducts();
    updateDisplayedReviewCount();

    // --- Footer date info (optional, just in case) ---
    const yearSpan = document.getElementById("year");
    const lastModifiedSpan = document.getElementById("lastModified");
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    if (lastModifiedSpan) lastModifiedSpan.textContent = `Last Modified: ${document.lastModified}`;
});
