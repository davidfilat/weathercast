import { printCurrentWeather, printWeatherFor7Days } from './weatherAPI.js';
const city = encodeURI(process.argv[2]);

async function main() {
  const coords = await printCurrentWeather(city);
  printWeatherFor7Days(coords);
}

main();
