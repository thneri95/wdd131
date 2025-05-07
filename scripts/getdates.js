// Set the current year:
const yearSpan = document.getElementById('currentyear');
yearSpan.textContent = new Date().getFullYear();

// Set last modified:
const lastMod = document.getElementById('lastModified');
lastMod.textContent = `Last modified: ${document.lastModified}`;
