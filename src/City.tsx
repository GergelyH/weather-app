import React from "react";

function City(props: { name: string }) {
    const { name } = props;
    return <div>{name}</div>;
}

export default City;
