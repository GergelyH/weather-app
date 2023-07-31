import React from 'react';
import { createBrowserRouter, RouterProvider, } from "react-router-dom";

import './App.css';
import CitiesList from './CitiesListPage';
import AddCity from './AddCityPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <CitiesList cities={['Budapest', 'Bukarest']} />
  },
  {
    path: "/add-city",
    element: <AddCity />
  }
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
