import { useNavigate } from 'react-router';
import City from './City';

function CitiesList(props: { cities: string[] }) {
    const navigate = useNavigate();
    function addCityOnClick(){
        navigate('/add-city');
    }

    return <div data-testid='cities-list'>
        {props.cities.map((city, index) => <City name={city} key={index}/>)}
        <button data-testid='add-city-button' onClick={addCityOnClick}>+</button>
    </div>
}

export default CitiesList;