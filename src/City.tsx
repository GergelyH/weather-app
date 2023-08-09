import React from "react";
import { Link } from "react-router-dom";

function City(props: { name: string }) {
    const { name } = props;
    return <Link to={`/city/${name}`}>{name}</Link>;
}

export default City;
