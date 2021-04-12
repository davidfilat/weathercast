import axios from 'axios';
import { OPEN_WEATHER_MAP_API_KEY } from './credentials.js';
import Table from 'cli-table3';
import { DateTime } from 'luxon';

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
