import axios from 'axios';

const city = process.argv[2];

async function printCurrentWeather(cityName) {
  const OPEN_WEATHER_MAP_API =
    'https://api.openweathermap.org/data/2.5/weather?q=' +
    cityName +
    '&appid=***REMOVED***&units=metric&lang=ro';

  try {
    const response = await axios.get(OPEN_WEATHER_MAP_API);
    const data = response.data;
    console.log(data.weather[0].description);
  } catch (error) {
    console.log(error.message);
  }
}

printCurrentWeather(city);
