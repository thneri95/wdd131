// Set the current year dynamically
const yearSpan = document.getElementById('currentyear');
yearSpan.textContent = new Date().getFullYear();

// Set last modified date dynamically
const lastMod = document.getElementById('lastModified');
lastMod.textContent = `Last modified: ${document.lastModified}`;
