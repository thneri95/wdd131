// Wind Chill (always calculated):
function calculateWindChill(tempF, speedMph) {
    if (speedMph > 3) {
        let chill = 35.74 + (0.6215 * tempF) - (35.75 * Math.pow(speedMph, 0.16)) + (0.4275 * tempF * Math.pow(speedMph, 0.16));
        return chill.toFixed(1);
    } else {
        return tempF.toFixed(1);
        // if wind speed ≤ 3 mph, just show the actual temperature
    }
}

// Get values from the DOM:
const tempElement = document.getElementById("temp");
const speedElement = document.getElementById("speed");
const chillElement = document.getElementById("chill");

if (tempElement && speedElement && chillElement) {
    const temp = parseFloat(tempElement.textContent);
    const speed = parseFloat(speedElement.textContent);
    const windChill = calculateWindChill(temp, speed);
    chillElement.textContent = `${windChill} °F`;
}

// Update year in footer:
const yearElement = document.getElementById("year");
if (yearElement) {
    const currentYear = new Date().getFullYear();
    yearElement.textContent = currentYear;
}

// Update last modified date in footer:
const lastModifiedElement = document.getElementById("lastModified");
if (lastModifiedElement) {
    lastModifiedElement.textContent = document.lastModified;
}
