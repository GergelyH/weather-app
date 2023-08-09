import React from "react";

function CityDetails(props: { city: string }) {
    const { city } = props;
    return <p>{city}</p>;
}

export default CityDetails;
