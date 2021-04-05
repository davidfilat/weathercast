import axios from 'axios';
import { OPEN_WEATHER_MAP_API_KEY } from './credentials.js';
const city = process.argv[2];

async function printCurrentWeather(cityName) {
  const OPEN_WEATHER_MAP_API =
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}` +
    `&appid=${OPEN_WEATHER_MAP_API_KEY}&units=metric&lang=ro`;

  try {
    const response = await axios.get(OPEN_WEATHER_MAP_API);
    const data = response.data;

    console.log(
      `În ${data.name} este ${data.weather[0].description}.` +
        `\nTemperatura curentă este de ${data.main.temp}°C.`
    );
  } catch (error) {
    console.log(error.message);
  }
}

printCurrentWeather(city);
