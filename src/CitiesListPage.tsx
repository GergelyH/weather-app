import React from "react";
import { useNavigate } from "react-router";

import City from "./City";

function CitiesList(props: { cities: string[] }) {
    const navigate = useNavigate();
    function addCityOnClick() {
        navigate("/add-city");
    }

    const { cities } = props;
    return (
        <div data-testid="cities-list">
            {cities.map((city) => (
                <City name={city} />
            ))}
            <button type="submit" data-testid="add-city-button" onClick={addCityOnClick}>
                +
            </button>
        </div>
    );
}

export default CitiesList;
