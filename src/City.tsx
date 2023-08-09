import React from "react";
import { Link } from "react-router-dom";

export interface CityProps {
    name: string;
}

function City(props: CityProps) {
    const { name } = props;
    return <Link to={`/city/${name}`}>{name}</Link>;
}

export default City;
