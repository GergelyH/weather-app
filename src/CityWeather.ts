import { z } from "zod";

import apiKey from "./openWeatherApiKey";
import { coordDef, Coord, getCoord } from "./GeoCoding";

const WeatherCondition = z.object({
    id: z.number(),
    main: z.string(),
    description: z.string(),
    icon: z.string(),
});

const ApiMain = z.object({
    temp: z.number(),
    feels_like: z.number(),
    temp_min: z.number(),
    temp_max: z.number(),
    pressure: z.number(),
    humidity: z.number(),
    sea_level: z.number(),
    grnd_level: z.number(),
});

const Main = ApiMain.transform((apiMain) => ({
    feelsLike: apiMain.feels_like,
    tempMin: apiMain.temp_min,
    tempMax: apiMain.temp_max,
    seaLevelPressure: apiMain.sea_level,
    groundLevelPressure: apiMain.grnd_level,
    ...apiMain,
}));

const Wind = z.object({
    speed: z.number(),
    deg: z.number(),
    gust: z.number(),
});

const ApiRain = z.object({
    "1h": z.number(),
});

const Rain = ApiRain.transform((apiRain) => ({
    lastHour: apiRain["1h"],
    ...apiRain,
}));

const Clouds = z.object({
    all: z.number(),
});

const ApiInternal = z.object({
    type: z.number(),
    id: z.number(),
    country: z.string(),
    sunrise: z.number(),
    sunset: z.number(),
});

const ApiWeather = z.object({
    coord: coordDef,
    weather: z.array(WeatherCondition),
    main: Main,
    visibility: z.number(),
    wind: Wind,
    rain: Rain,
    clouds: Clouds,
    dt: z.number(),
    sys: ApiInternal,
    timezone: z.number(),
});

const weatherDef = ApiWeather.transform((apiWeatherResponse) => ({
    weatherCondition: apiWeatherResponse.weather,
    dataCalculationTime: apiWeatherResponse.dt,
    apiInternal: apiWeatherResponse.sys,
    ...apiWeatherResponse,
}));

export type Weather = z.infer<typeof weatherDef>;

export const mockResponse = `
{
    "coord": {
      "lon": 10.99,
      "lat": 44.34
    },
    "weather": [
      {
        "id": 501,
        "main": "Rain",
        "description": "moderate rain",
        "icon": "10d"
      }
    ],
    "base": "stations",
    "main": {
      "temp": 298.48,
      "feels_like": 298.74,
      "temp_min": 297.56,
      "temp_max": 300.05,
      "pressure": 1015,
      "humidity": 64,
      "sea_level": 1015,
      "grnd_level": 933
    },
    "visibility": 10000,
    "wind": {
      "speed": 0.62,
      "deg": 349,
      "gust": 1.18
    },
    "rain": {
      "1h": 3.16
    },
    "clouds": {
      "all": 100
    },
    "dt": 1661870592,
    "sys": {
      "type": 2,
      "id": 2075663,
      "country": "IT",
      "sunrise": 1661834187,
      "sunset": 1661882248
    },
    "timezone": 7200,
    "id": 3163858,
    "name": "Zocca",
    "cod": 200
}`;

async function getWeatherFromCoordResponse(coord: Coord): Promise<string> {
    const resp = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${coord.latitude}&lon=${coord.longitude}&appid=${apiKey}`,
    );
    return resp.text();
}

export async function getWeatherFromCoord(coord: Coord): Promise<Weather> {
    const resp = await getWeatherFromCoordResponse(coord);
    return weatherDef.parse(resp);
}

export async function getWeather(cityName: string): Promise<Weather> {
    const coord = await getCoord(cityName);
    const weather = getWeatherFromCoord(coord);
    return weather;
}

export default getWeather;
