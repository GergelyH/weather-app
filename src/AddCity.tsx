import { useEffect, useState } from 'react';
import classNames from "classnames";

import './Spinner.css';
import { selectableCities } from './selectableCities';
import { calculateCitySearchResults } from './CitySearch';
import Spinner from './Spinner';

function AddCity() {
    const [isLoading, setIsLoading] = useState(false);
    const [searchResults, setSearchResults] = useState<string[]>([]);
    const [selectedCityIndex, setSelectedCityIndex] = useState<number | null>(null);
    
    function onSearchResultClick(cityIndex: number) {
        if (cityIndex !== selectedCityIndex) {
            setSelectedCityIndex(cityIndex);
        }
        else {
            setSelectedCityIndex(null);
        }
    }

    async function onInputChange(e: React.FormEvent<HTMLInputElement>){
        const searchValue = e.currentTarget.value;
        setIsLoading(true);
        await calculateSearchResults(searchValue);
        setIsLoading(false);
    }
    
    function getSelectedCity(){
        return selectedCityIndex === null ? null : searchResults[selectedCityIndex];
    }

    async function calculateSearchResults(searchValue:string){
        let res = await calculateCitySearchResults(searchValue);
        const selectedCity = getSelectedCity();
        if (selectedCity && res.includes(selectedCity)){
            const newSelectedCityIdx = res.indexOf(selectedCity);
            if (newSelectedCityIdx < 8){
                [res[0],res[newSelectedCityIdx]] = [res[newSelectedCityIdx],res[0]];
            }
            setSelectedCityIndex(0);
        } else {
            setSelectedCityIndex(null);
        }
        res.splice(8);
        setSearchResults(res);
    }
    
    const cityList = searchResults.map((city, index) =>
        <p 
            className={classNames({ 'selected': index === selectedCityIndex })}
            onClick={() => onSearchResultClick(index)}
            data-testid='search-result-city'
            key={index}
        >
            {city}
        </p>
    );
    const loadedContent = <div>
        {cityList}
        {selectedCityIndex !== null && <button data-testid='save-button'></button>}
    </div>

    return <>
        <input onChange={onInputChange} data-testid='city-search-textbox'></input>
        {isLoading
            ? <Spinner />
            : loadedContent} 
    </>
}

export default AddCity;