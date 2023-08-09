import React, { useState } from "react";
import classNames from "classnames";

import "./AddCity.css";
import "./Spinner.css";
import { useNavigate } from "react-router-dom";
import calculateCitySearchResults from "./CitySearch";
import Spinner from "./Spinner";

type SearchState = { type: "loading" } | { type: "loaded"; data: string[] };

function AddCityPage() {
    // const [isLoading, setIsLoading] = useState(false);
    // const [searchResults, setSearchResults] = useState<string[]>([]);
    const [searchState, setSearchState] = useState<SearchState>({ type: "loaded", data: [] });
    const [selectedCityIndex, setSelectedCityIndex] = useState<number | null>(null);
    const navigate = useNavigate();

    function onSearchResultClick(cityIndex: number) {
        if (cityIndex !== selectedCityIndex) {
            setSelectedCityIndex(cityIndex);
        } else {
            setSelectedCityIndex(null);
        }
    }

    function getSelectedCity() {
        return selectedCityIndex !== null && searchState.type === "loaded"
            ? searchState.data[selectedCityIndex]
            : null;
    }

    function getCitySearchResults() {
        return searchState.type === "loaded" ? searchState.data : [];
    }

    async function getSearchResult(searchValue: string) {
        const res = await calculateCitySearchResults(searchValue);
        let newSelectedCityIndex = selectedCityIndex;
        const selectedCity = getSelectedCity();
        if (selectedCity && res.includes(selectedCity)) {
            const newSelectedCityIdx = res.indexOf(selectedCity);
            [res[0], res[newSelectedCityIdx]] = [res[newSelectedCityIdx], res[0]];
            newSelectedCityIndex = 0;
        } else {
            newSelectedCityIndex = null;
        }
        res.splice(8);
        return { searchResults: res, newSelectedCityIndex };
    }

    async function updateSearchResults(searchValue: string) {
        setSearchState({ type: "loading" });
        const { newSelectedCityIndex, searchResults } = await getSearchResult(searchValue);
        setSelectedCityIndex(newSelectedCityIndex);
        setSearchState({ type: "loaded", data: searchResults });
    }

    const cityList = getCitySearchResults().map((city, index) => (
        <option
            className={classNames({ selected: index === selectedCityIndex })}
            onClick={() => onSearchResultClick(index)}
            data-testid="search-result-city"
        >
            {city}
        </option>
    ));

    const loadedContent = (
        <div>
            <select>{cityList}</select>
            {selectedCityIndex !== null && (
                <button type="submit" data-testid="save-button">
                    Save
                </button>
            )}
        </div>
    );

    return (
        <>
            <header>
                <button
                    type="button"
                    aria-label="Back"
                    onClick={() => navigate(-1)}
                    data-testid="back-button"
                />
            </header>
            <input
                onChange={(e) => updateSearchResults(e.currentTarget.value)}
                data-testid="city-search-textbox"
            />
            {searchState.type === "loading" ? <Spinner /> : loadedContent}
        </>
    );
}

export default AddCityPage;
