import React from "react";
import { act, cleanup, render, waitFor } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import { BrowserRouter } from "react-router-dom";

import userEvent from "@testing-library/user-event";
import AddCityPage from "./AddCityPage";
import * as citySearch from "./CitySearch";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

describe("AddCityPage", () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    afterEach(cleanup);

    function setup() {
        return {
            user: userEvent.setup(),
            ...render(
                <BrowserRouter>
                    <AddCityPage />
                </BrowserRouter>,
            ),
        };
    }

    test("exact searched city appears", async () => {
        const { user } = setup();
        const textField = screen.getByRole("textbox");
        await user.type(textField, "Vienna");

        const cityElement = await screen.findByText("Vienna");
        expect(cityElement).toBeInTheDocument();
    });

    test("search result is correct", async () => {
        const { user } = setup();
        const textField = screen.getByRole("textbox");
        await user.type(textField, "ku");

        const capitalsToCheck = ["Kuwait City", "Kuala Lumpur", "Nukuʻalofa", "Baku"];
        const cityElementPromises = capitalsToCheck.map((capital) => screen.findByText(capital));

        const cityElements = await Promise.all(cityElementPromises);

        cityElements.forEach((cityElement) => {
            expect(cityElement).toBeInTheDocument();
        });
    });

    test("maximum 8 search results are rendered", async () => {
        const { user } = setup();
        const textField = screen.getByRole("textbox");
        user.type(textField, "e");

        const searchResults = await screen.findAllByTestId("search-result-city");
        expect(searchResults.length).toBeLessThanOrEqual(8);
    });

    test("loading state is only rendered while waiting for search results", async () => {
        const { user } = setup();
        let resolveFunction!: (value?: string[]) => void;
        const promise = new Promise((resolve) => {
            resolveFunction = resolve;
        });
        const calculateCitySearchResults = jest.spyOn(citySearch, "default");
        (calculateCitySearchResults as jest.Mock).mockImplementation(() => promise);

        const textField = screen.getByRole("textbox");
        await user.type(textField, "1");

        const spinnerElement = screen.getByTestId("spinner");
        expect(spinnerElement).toBeInTheDocument();
        const searchResultCity = screen.queryByTestId("search-result-city");
        expect(searchResultCity).toBeNull();

        await act(() => {
            resolveFunction([]);
        });
        expect(spinnerElement).not.toBeInTheDocument();
    });

    test("expanding the search unselects the currently selected item", async () => {
        const { user } = setup();
        expect(screen.queryByTestId("save-button")).toBeNull();
        const textField = screen.getByRole("textbox");
        await user.type(textField, "London");

        await waitFor(() => expect(screen.queryByTestId("spinner")).not.toBeInTheDocument());
        let cityElement = await screen.getByText("London");
        await user.click(cityElement);
        expect(cityElement).toHaveClass("selected");

        await user.type(textField, "k");
        expect(cityElement).not.toBeInTheDocument();

        await user.type(textField, "{backspace}");
        cityElement = await screen.findByText("London");
        expect(cityElement).not.toHaveClass("selected");
    });

    test("save button appears only after city selection", async () => {
        const { user, getByText } = setup();

        expect(screen.queryByTestId("save-button")).toBeNull();

        const textField = screen.getByRole("textbox");
        // await fireEvent.change(textField, {target: {value: 'ndo'}});
        await user.type(textField, "London");
        await waitFor(() => expect(screen.queryByTestId("spinner")).not.toBeInTheDocument());

        const cityElement = await getByText("London");
        expect(screen.queryByTestId("save-button")).toBeNull();

        await user.click(cityElement);
        expect(cityElement).toHaveClass("selected");
    });

    test("deleting from the search term keeps item selection", async () => {
        const { user } = setup();

        const textField = screen.getByRole("textbox");
        await user.type(textField, "ndo");
        let cityElement = await screen.findByText("London");
        await user.click(cityElement);
        expect(cityElement).toHaveClass("selected");

        await user.type(textField, "{backspace}");
        cityElement = await screen.findByText("London");
        expect(cityElement).toHaveClass("selected");
    });

    test("clicking back button calls navigate", async () => {
        const { user } = setup();

        const backArrow = screen.getByTestId("back-button");
        await user.click(backArrow);

        expect(mockNavigate).toBeCalledWith(-1);
    });
});
