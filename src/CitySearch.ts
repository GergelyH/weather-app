import { selectableCities } from './selectableCities';

export async function calculateCitySearchResults(searchValue: string): Promise<string[]> {
    const res: string[] = [];
    if (searchValue) {
        for (let city of selectableCities) {
            if (city.toLocaleLowerCase().includes(searchValue.toLowerCase())) {
                res.push(city);
            }
        }
    }
    return res;
}