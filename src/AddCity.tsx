import { useEffect, useState } from 'react';
import './Spinner.css';
import { selectableCities } from './selectableCities';

function AddCity() {
    const [isLoading, setIsLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState<string[]>([]);
    
    useEffect(calculateSearchResults,[searchValue]);

    function onInputChange(e: React.FormEvent<HTMLInputElement>){
        setIsLoading(true);
        setSearchValue(e.currentTarget.value);
    }

    function calculateSearchResults(){
        const res:string[] = [];
        for(let city of selectableCities){
            if(city.includes(searchValue)){
                res.push(city);
            }
        }
        setSearchResults(res);
        setIsLoading(false);
    }
    
    return <>
        <input onChange={onInputChange} data-testid='city-search-textbox'></input>
        {isLoading
         ? <div className="spinner"></div>
         : searchResults.map((city, index) => <p key={index}>{city}</p>)}
    </>
}

export default AddCity;