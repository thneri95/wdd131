// scripts/place.js

document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = document.lastModified;

function calculateWindChill(tempF, speed) {
    if (tempF <= 50 && speed > 3) {
        return (
            35.74 +
            0.6215 * tempF -
            35.75 * Math.pow(speed, 0.16) +
            0.4275 * tempF * Math.pow(speed, 0.16)
        ).toFixed(1);
    } else {
        return "N/A";
    }
}

const temp = parseFloat(document.getElementById("temp").textContent);
const speed = parseFloat(document.getElementById("speed").textContent);
document.getElementById("chill").textContent = calculateWindChill(temp, speed) + " °F";
