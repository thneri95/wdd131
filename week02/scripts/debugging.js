const radiusOutput = document.getElementById('radius');
const areaOutput = document.getElementById('area'); // Corrigido: deve ser um ID ou classe válida

const PI = 3.14159;

let radius = 10;
let area = PI * radius * radius;

radiusOutput.textContent = `Radius: ${radius}`;
areaOutput.textContent = `Area: ${area}`;

radius = 20;
area = PI * radius * radius;

radiusOutput.textContent = `Radius: ${radius}`;
areaOutput.textContent = `Area: ${area}`;
