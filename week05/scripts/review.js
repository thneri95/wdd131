// review
document.addEventListener('DOMContentLoaded', () => {
    // --- DOM  ---
    const totalReviewsCountSpan = document.getElementById('totalReviewsCount');
    const submittedDetailsDiv = document.getElementById('submittedDetails');

    // --- Products Array for converting IDs to names ---
    const products = [
        { id: 'byui-hoodie', name: 'BYU-Idaho Hoodie' },
        { id: 'byui-mug', name: 'BYU-Idaho Coffee Mug' },
        { id: 'byui-pen', name: 'BYU-Idaho Branded Pen' },
        { id: 'byui-notebook', name: 'BYU-Idaho Notebook' },
        { id: 'byui-hat', name: 'BYU-Idaho Football Cap' },
        { id: 'byui-keychain', name: 'BYU-Idaho Keychain' }
    ];

    // --- Function to get review count from localStorage ---
    function getReviewCount() {
        return parseInt(localStorage.getItem('reviewCount')) || 0;
    }

    // Display the total reviews count
    if (totalReviewsCountSpan) {
        totalReviewsCountSpan.textContent = getReviewCount();
    }

    // --- Display Submitted Review Data from URL Parameters ---
    const params = new URLSearchParams(window.location.search);
    if (params.toString() && submittedDetailsDiv) {
        let detailsHtml = '<h2>Your Submitted Review:</h2>';

        let usefulFeaturesList = [];

        params.forEach((value, key) => {
            let displayKey = key
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase());

            let displayValue = decodeURIComponent(value);

            if (key === 'productName') {
                const product = products.find(p => p.id === value);
                displayValue = product ? product.name : value;
            } else if (key === 'overallRating') {
                const ratingNumber = parseInt(value);
                displayValue = isNaN(ratingNumber) ? value : '⭐'.repeat(ratingNumber);
            } else if (key === 'usefulFeatures') {
                usefulFeaturesList.push(displayValue.charAt(0).toUpperCase() + displayValue.slice(1));
                return;
            } else if (key === 'installDate') {
                try {
                    const date = new Date(value);
                    displayValue = date.toLocaleDateString('en-US'); // English date format
                } catch { }
            }

            if (displayKey === 'User Name' && !displayValue) return;

            detailsHtml += `<p><strong>${displayKey}:</strong> ${displayValue}</p>`;
        });

        if (usefulFeaturesList.length > 0) {
            detailsHtml += `<p><strong>Useful Features:</strong> ${usefulFeaturesList.join(', ')}</p>`;
        }

        submittedDetailsDiv.innerHTML = detailsHtml;
    }

    // --- Footer Date  and more...  ---
    const yearSpan = document.getElementById('year');
    const lastModifiedSpan = document.getElementById('lastModified');

    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    if (lastModifiedSpan) lastModifiedSpan.textContent = `Last Modified: ${document.lastModified}`;
});
