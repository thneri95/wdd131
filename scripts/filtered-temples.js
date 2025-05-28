// Hamburger menu:
const menuButton = document.getElementById('menu-button');
const navMenu = document.getElementById('nav-menu');

// Toggle the 'show' class on the navigation menu when the button is clicked:
menuButton.addEventListener('click', () => {
    navMenu.classList.toggle('show');
});

// Footer date information>>>> 
// Set the current year for the copyright:
document.getElementById("year").textContent = new Date().getFullYear();
// Set the last modified date of the document: 
document.getElementById("lastModified").textContent = `Last Modified: ${document.lastModified}`;

// Array of temple objects: Part 1
const temples = [
    {
        templeName: "Aba Nigeria",
        location: "Aba, Nigeria",
        dedicated: "2005, August, 7",
        area: 11500,
        imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/aba-nigeria/400x250/aba-nigeria-temple-lds-273999-wallpaper.jpg"
    },
    {
        templeName: "Manti Utah",
        location: "Manti, Utah, United States",
        dedicated: "1888, May, 21",
        area: 74792,
        imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/manti-utah/400x250/manti-temple-768192-wallpaper.jpg"
    },
    {
        templeName: "Payson Utah",
        location: "Payson, Utah, United States",
        dedicated: "2015, June, 7",
        area: 96630,
        imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/payson-utah/400x225/payson-utah-temple-exterior-1416671-wallpaper.jpg"
    },
    {
        templeName: "Yigo Guam",
        location: "Yigo, Guam",
        dedicated: "2020, May, 2",
        area: 6861,
        imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/yigo-guam/400x250/yigo_guam_temple_2.jpg"
    },
    {
        templeName: "Washington D.C.",
        location: "Kensington, Maryland, United States",
        dedicated: "1974, November, 19",
        area: 156558,
        imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/washington-dc/400x250/washington_dc_temple-exterior-2.jpeg"
    },
    {
        templeName: "Lima Perú",
        location: "Lima, Perú",
        dedicated: "1986, January, 10",
        area: 9600,
        imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/lima-peru/400x250/lima-peru-temple-evening-1075606-wallpaper.jpg"
    },
    {
        templeName: "Mexico City Mexico",
        location: "Mexico City, Mexico",
        dedicated: "1983, December, 2",
        area: 116642,
        imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/mexico-city-mexico/400x250/mexico-city-temple-exterior-1518361-wallpaper.jpg"
    },
    // Additional temple objects as required by the assignment:
    {
        templeName: "Salt Lake Temple",
        location: "Salt Lake City, Utah, United States",
        dedicated: "1893, April, 6",
        area: 253015,
        imageUrl: "https://churchofjesuschristtemples.org/assets/img/temples/salt-lake-temple/salt-lake-temple-8454.jpg"
    },
    {
        templeName: "Rome Italy",
        location: "Rome, Italy",
        dedicated: "2019, March, 10",
        area: 40000,
        imageUrl: "https://churchofjesuschristtemples.org/assets/img/temples/rome-italy-temple/rome-italy-temple-2642-main.jpg"
    },
    {
        templeName: "Kinshasa Democratic Republic of Congo",
        location: "Kinshasa, Democratic Republic of the Congo",
        dedicated: "2019, April, 14",
        area: 12000,
        imageUrl: "https://churchofjesuschristtemples.org/assets/img/temples/kinshasa-democratic-republic-of-the-congo-temple/kinshasa-democratic-republic-of-the-congo-temple-3533-main.jpg"
    },

    {
        templeName: "Tokyo Japan",
        location: "Tokyo, Japan",
        dedicated: "1980, October, 27",
        area: 53995,
        imageUrl: "https://churchofjesuschristtemples.org/assets/img/temples/tokyo-japan-temple/tokyo-japan-temple-26340-main.jpg"
    },
    {
        templeName: "Sydney Australia",
        location: "Sydney, New South Wales, Australia",
        dedicated: "1984, September, 20",
        area: 30000,
        imageUrl: "https://churchofjesuschristtemples.org/assets/img/temples/sydney-australia-temple/sydney-australia-temple-58751.jpg"

    },
]

//  container where temple cards will be displayed:
const albumSection = document.querySelector('.album');

/**
 * Creates an HTML element for a single temple card:
 * @param {object} temple - The temple object containing its data!
 * @returns {HTMLElement} The created temple card div element!
 */
function createTempleCard(temple) {
    const templeCard = document.createElement('div');
    templeCard.classList.add('temple-card');

    const name = document.createElement('h2');
    name.textContent = temple.templeName;

    const location = document.createElement('p');
    location.textContent = `Location: ${temple.location}`;

    const dedicated = document.createElement('p');
    dedicated.textContent = `Dedicated: ${temple.dedicated}`;

    const area = document.createElement('p');
    // Format the area with local-specific thousands separator for better readability:
    area.textContent = `Area: ${temple.area.toLocaleString()} sq ft`;

    const img = document.createElement('img');
    img.src = temple.imageUrl;
    img.alt = `${temple.templeName} Temple`; // More descriptive alt text for accessibility:
    img.loading = 'lazy'; // Enable native lazy loading for the image
    img.width = "400"; // Set intrinsic width for better layout stability
    img.height = "250"; // Set intrinsic height for better layout stability

    // Add an error handler for images that fail to load: 
    img.onerror = () => {
        console.error(`Failed to load image: ${temple.imageUrl}. Displaying fallback.`);
        img.src = `https://placehold.co/${img.width}x${img.height}/003366/FFFFFF?text=Image+Not+Found`;
        img.alt = `Image not found for ${temple.templeName} Temple`;
    };

    // Append all created elements to the temple card : 
    templeCard.appendChild(name);
    templeCard.appendChild(location);
    templeCard.appendChild(dedicated);
    templeCard.appendChild(area);
    templeCard.appendChild(img);

    return templeCard;
}

/**
 * Displays a given array of temples in the album section, clearing previous content...
 * Also manages the active class on navigation links:
 * @param {Array<object>} templesToDisplay - The array of temple objects to display
 * @param {string} activeFilterId - The ID of the currently active filter link
 */
function displayTemples(templesToDisplay, activeFilterId) {
    // Clear any existing temple cards in the album section:
    albumSection.innerHTML = '';

    // Loop through the array and create a card for each temple:
    templesToDisplay.forEach(temple => {
        const card = createTempleCard(temple);
        albumSection.appendChild(card);
    });

    // Update active class on navigation links
    // Cache the nav links query for efficiency
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        if (link.id === activeFilterId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Event delegation for navigation links to filter temples
// Instead of attaching a listener to each link, we listen on the parent nav menu
navMenu.addEventListener('click', (event) => {
    // Check if the clicked element is a navigation link (an 'a' tag)
    if (event.target.tagName === 'A') {
        event.preventDefault(); // it´s Prevent default link behavior (page reload)
        const filterId = event.target.id; // Get the ID of the clicked link xD

        let filteredTemples = [];

        // Apply filtering logic based on the clicked link's ID
        if (filterId === 'home') {
            filteredTemples = temples; // Display all temples
        } else if (filterId === 'old') {
            filteredTemples = temples.filter(temple => {
                // Extract the year from the dedicated string (e.g., "1888, May, 21")
                const dedicatedYear = parseInt(temple.dedicated.split(',')[0]);
                return dedicatedYear < 1900;
            });
        } else if (filterId === 'new') {
            filteredTemples = temples.filter(temple => {
                const dedicatedYear = parseInt(temple.dedicated.split(',')[0]);
                return dedicatedYear > 2000;
            });
        } else if (filterId === 'large') {
            filteredTemples = temples.filter(temple => temple.area > 90000);
        } else if (filterId === 'small') {
            filteredTemples = temples.filter(temple => temple.area < 10000);
        }

        // Display the filtered temples and set the active navigation link
        displayTemples(filteredTemples, filterId);

        // Close the mobile menu after selection if it's open
        // This ensures the menu collapses on mobile after a filter is chosen
        if (navMenu.classList.contains('show')) {
            navMenu.classList.remove('show');
        }
    }
});

// Initial display of all temples when the page loads:
// This ensures the 'Home' filter is active and all temples are shown initially
document.addEventListener('DOMContentLoaded', () => {
    displayTemples(temples, 'home');
});
