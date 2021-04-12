import { DateTime } from 'luxon';
import { OPEN_WEATHER_MAP_API_KEY } from './credentials.js';
import axios from 'axios';
import Table from 'cli-table3';
import chalk from 'chalk';

async function getData(url) {
  try {
    const response = await axios.get(url);
    const data = response.data;
    console.log(data);
    return data;
  } catch (error) {
    const errorMessages = {
      404:
        'Denumirea orașului nu este validă. ' +
        'Vă rugăm verificați dacă ați introdus corect numele orașului.',
      401: 'API key este incorectă. Vă rugăm verificați fișierul credentials.js.',
      429: 'Ați depășit limita de cererei către OpenWeatherMap API.',
      500: 'Ne pare rău, a apărut o eroare internă a serverului.',
      ENOTFOUND:
        'Nu există o conexiune cu internetul.' +
        'Verificați setările și aparatajul pentru interent.',
      get EAI_AGAIN() {
        return this.ENOTFOUND;
      },
    };

    const errorCode = error.code || Number(error.response.data.cod);
    console.log(chalk.red.bgYellow.bold(errorMessages[errorCode]));
    process.exit();
  }
}

/**
 * @typedef {Object} Coords
 * @property {number} lat - geographical latitude
 * @property {number} lon - geographical longitude
 */

/**
 * Prints current weather conditions
 * @param {string} cityName
 *                 name of city. optional "City,(State,),Country". (Use ISO country code)
 * @returns {Coords} geographical coordinates of the city
 */
export async function printCurrentWeather(cityName) {
  const OPEN_WEATHER_MAP_API =
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}` +
    `&appid=${OPEN_WEATHER_MAP_API_KEY}&units=metric&lang=ro`;

  const data = await getData(OPEN_WEATHER_MAP_API);

  console.log(
    `În ${data.name} este ${data.weather[0].description}.` +
      `\nTemperatura curentă este de ${data.main.temp}°C.` +
      `\nLong: ${data.coord.lon} Lat: ${data.coord.lat}`
  );
  return data.coord;
}

/**
 * Prints weather forecast for 8 days
 * @param {Coords} coords - geographical coordinates of a location
 */
export async function printWeatherFor8Days({ lat, lon }) {
  const OPEN_WEATHER_MAP_API =
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}` +
    `&appid=${OPEN_WEATHER_MAP_API_KEY}&units=metric&lang=ro`;

  const data = await getData(OPEN_WEATHER_MAP_API);
  let table = new Table({
    head: ['Data', 'Temp max.', 'Temp min.', 'Vinteza vântului'],
  });

  const dailyData = data.daily;
  dailyData.forEach((dayData) => {
    const date = DateTime.fromSeconds(dayData.dt)
      .setLocale('ro')
      .toLocaleString(DateTime.DATE_MED);

    const arr = [date, dayData.temp.max, dayData.temp.min, dayData.wind_speed];

    table.push(arr);
  });

  console.log(table.toString());
}
