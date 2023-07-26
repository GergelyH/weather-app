import { useEffect, useState } from 'react';
import classNames from "classnames";

import './Spinner.css';
import { selectableCities } from './selectableCities';

function AddCity() {
    const [isLoading, setIsLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState<string[]>([]);
    const [selectedCityIndex, setSelectedCityIndex] = useState<number | null>(null);
    
    useEffect(calculateSearchResults,[searchValue]);

    function onSearchResultClick(cityIndex: number) {
        if (cityIndex !== selectedCityIndex) {
            setSelectedCityIndex(cityIndex);
        }
        else {
            setSelectedCityIndex(null);
        }
    }

    function onInputChange(e: React.FormEvent<HTMLInputElement>){
        setIsLoading(true);
        setSearchValue(e.currentTarget.value);
    }

    function calculateSearchResults(){
        const res:string[] = [];
        if (searchValue) {
            for (let city of selectableCities) {
                if (city.toLocaleLowerCase().includes(searchValue.toLowerCase())) {
                    res.push(city);
                }
            }
        }
        setSearchResults(res);
        setIsLoading(false);
    }
    
    const cityList = searchResults.map((city, index) =>
        <p 
            className={classNames({ 'selected': index === selectedCityIndex })}
            onClick={() => onSearchResultClick(index)}
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
         ? <div className="spinner"></div>
            : loadedContent} 
    </>
}

export default AddCity;