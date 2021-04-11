import axios from 'axios';
import { OPEN_WEATHER_MAP_API_KEY } from './credentials.js';
import Table from 'cli-table3';
import { DateTime } from 'luxon';

const units = {
  temperature: ' °C',
  wind_speed: ' m/s',
};
async function getData(url) {
  try {
    const response = await axios.get(url);
    const data = response.data;
    return data;
  } catch (error) {
    console.log(error.message);
  }
}

/**
 * @typedef {Object} Coords
 * @property {number} lat - geo latitute
 * @property {number} lon - geo longitude
 */

/**
 * Prints current weather condition for a city and returns its coordinates
 * @param {string} cityName
 *                  Name of the city
 * @returns {Coords}
 *          The geographical coordinates
 */
export async function printCurrentWeather(cityName) {
  const OPEN_WEATHER_MAP_API =
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}` +
    `&appid=${OPEN_WEATHER_MAP_API_KEY}&units=metric&lang=ro`;

  const data = await getData(OPEN_WEATHER_MAP_API);

  console.log(
    `În ${data.name} este ${data.weather[0].description}.` +
      `\nTemperatura curentă este de ${data.main.temp}${units.temperature}.` +
      `\nLong: ${data.coord.lon} Lat: ${data.coord.lat}`
  );
  return data.coord;
}

/**
 * Print 8 days weather forecast for a geographical location
 * @param {Coords} coords - geographical coordinates of the locatoin
 */
export async function printWeatherFor7Days({ lat, lon }) {
  const OPEN_WEATHER_MAP_API =
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}` +
    `&appid=${OPEN_WEATHER_MAP_API_KEY}&units=metric&lang=ro`;

  const data = await getData(OPEN_WEATHER_MAP_API);
  printForecastTable(data);
}

function printForecastTable(data) {
  const table = new Table({
    head: ['Data', 'Temp max.', 'Temp min.', 'Vinteza vântului'],
  });

  const dailyData = data.daily;
  dailyData.forEach((dayData) => {
    const date = DateTime.fromSeconds(dayData.dt)
      .setLocale('ro')
      .toLocaleString(DateTime.DATE_MED);

    const arr = [
      date,
      dayData.temp.max + units.temperature,
      dayData.temp.min + units.temperature,
      dayData.wind_speed + units.wind_speed,
    ];

    table.push(arr);
  });

  console.log(table.toString());
}
