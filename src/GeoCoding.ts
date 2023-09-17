import { z } from "zod";

import apiKey from "./openWeatherApiKey";

// Define the structure for local names
const LocalNames = z.record(z.string());

// Define the structure for a single data point in the response array
const cityGeoCodeDef = z.object({
    name: z.string(),
    local_names: LocalNames.optional(),
    lat: z.number(),
    lon: z.number(),
    country: z.string(),
    state: z.string().optional(), // Some entries in the sample don't have a state
});

export type CityGeoCode = z.infer<typeof cityGeoCodeDef>;

// Define the schema for the entire API response
const geoCodesDef = z.array(cityGeoCodeDef);

export type GeoCode = z.infer<typeof geoCodesDef>;

const ApiCoord = z.object({
    lon: z.number(),
    lat: z.number(),
});

export const coordDef = ApiCoord.transform((apiCoord) => ({
    longitude: apiCoord.lon,
    latitude: apiCoord.lat,
}));

export type Coord = z.infer<typeof coordDef>;

export const mockJsonResponse = `
[
    {
       "name": "London",
       "local_names": {
          "ms": "London",
          "gu": "લંડન",
          // ... (other local names)
          "ur": "علاقہ لندن"
       },
       "lat": 51.5073219,
       "lon": -0.1276474,
       "country": "GB",
       "state": "England"
    },
    {
       "name": "City of London",
       "local_names": {
          "es": "City de Londres",
          "ru": "Сити",
          "ur": "لندن شہر",
          "zh": "倫敦市",
          // ... (other local names)
          "lt": "Londono Sitis"
       },
       "lat": 51.5156177,
       "lon": -0.0919983,
       "country": "GB",
       "state": "England"
    },
    {
       "name": "London",
       "local_names": {
          "el": "Λόντον",
          "fr": "London",
          "oj": "Baketigweyaang",
          "en": "London",
          "bn": "লন্ডন",
          // ... (other local names)
          "ka": "ლონდონი"
       },
       "lat": 42.9832406,
       "lon": -81.243372,
       "country": "CA",
       "state": "Ontario"
    },
    {
       "name": "Chelsea",
       "local_names": {
          "id": "Chelsea, London",
          "uk": "Челсі",
          "hi": "चेल्सी, लंदन",
          // ... (other local names)
          "et": "Chelsea"
       },
       "lat": 51.4875167,
       "lon": -0.1687007,
       "country": "GB",
       "state": "England"
    },
    {
       "name": "Londnameon",
       "lat": 37.1289771,
       "lon": -84.0832646,
       "country": "US",
       "state": "Kentucky"
    }
]`;

function coordFromGeoCode(cityGeoCode: CityGeoCode): Coord {
    const coord: Coord = {
        longitude: cityGeoCode.lon,
        latitude: cityGeoCode.lat,
    };
    return coord;
}

async function getGeoCodeResponse(cityName: string): Promise<string> {
    const resp = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit={1}&appid=${apiKey}`,
    );
    return resp.text();
}

export async function getCoord(cityName: string): Promise<Coord> {
    const geoCodeData = await getGeoCodeResponse(cityName);
    const geoCodes = geoCodesDef.parse(geoCodeData);
    const geoCode = geoCodes[0];
    const coord: Coord = coordFromGeoCode(geoCode);
    return coord;
}
