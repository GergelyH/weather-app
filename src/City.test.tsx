import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";

import City, { CityProps } from "./City";

function setup(city: React.ReactElement<CityProps>) {
    return render(<BrowserRouter>{city}</BrowserRouter>);
}

test("Renders and check if the city name can be found", () => {
    setup(<City name="Paris" />);
    const element = screen.getByText(/Paris/i);
    expect(element).toBeInTheDocument();
});
