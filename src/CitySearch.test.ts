import calculateCitySearchResults from "./CitySearch";

describe("calculateCitySearchResults", () => {
    it("should return an empty array if searchValue is empty", async () => {
        const result = await calculateCitySearchResults("");
        expect(result).toEqual([]);
    });

    it("should return an array of cities that match the searchValue", async () => {
        const searchValue = "Ber";
        const expectedResults = ["Berlin", "Bern"];
        const result = await calculateCitySearchResults(searchValue);
        expect(result).toEqual(expectedResults);
    });

    it("should return an empty array if no city matches the searchValue", async () => {
        const searchValue = "nonexistentcity";
        const result = await calculateCitySearchResults(searchValue);
        expect(result).toEqual([]);
    });

    it("should be case insensitive", async () => {
        const searchValue = "NEW";
        const expectedResults = ["New Delhi"];
        const result = await calculateCitySearchResults(searchValue);
        expect(result).toEqual(expectedResults);
    });
});
