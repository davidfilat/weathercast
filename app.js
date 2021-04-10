import { printCurrentWeather, printWeatherFor7Days } from './weatherAPI.js';
const city = process.argv[2];

const coords = await printCurrentWeather(city);
printWeatherFor7Days(coords);
