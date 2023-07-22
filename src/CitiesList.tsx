function CitiesList(props: { cities: string[] }) {
    return <div data-testid='cities-list'>
        {props.cities.map((city, index) => <p key={index}>{city}</p>)}
    </div>
}

export default CitiesList;