import selectableCities from "./selectableCities";

export default async function calculateCitySearchResults(searchValue: string): Promise<string[]> {
    const res: string[] = [];
    if (searchValue !== "") {
        for (const city of selectableCities) {
            if (city.toLocaleLowerCase().includes(searchValue.toLowerCase())) {
                res.push(city);
            }
        }
    }
    return res;
}
