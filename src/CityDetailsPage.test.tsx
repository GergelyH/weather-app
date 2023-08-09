import React from "react";
import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";

import CityDetailsPage from "./CityDetailsPage";

it("renders the city name", () => {
    render(<CityDetailsPage city="Budapest" />);
    const cityElement = screen.getByText("Budapest");
    expect(cityElement).toBeInTheDocument();
});
