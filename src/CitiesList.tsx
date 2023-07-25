import { useNavigate } from 'react-router';

function CitiesList(props: { cities: string[] }) {
    const navigate = useNavigate();
    function addCityOnClick(){
        navigate('/add-city');
    }

    return <div data-testid='cities-list'>
        {props.cities.map((city, index) => <p key={index}>{city}</p>)}
        <button data-testid='add-city-button' onClick={addCityOnClick}>+</button>
    </div>
}

export default CitiesList;