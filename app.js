import { printCurrentWeather, printWeatherFor8Days } from './weatherAPI.js';
const city = process.argv[2];

const coords = await printCurrentWeather(city);
printWeatherFor8Days(coords);
