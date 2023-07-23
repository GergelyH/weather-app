import React from 'react';
import { createBrowserRouter, RouterProvider, } from "react-router-dom";

import './App.css';
import CitiesList from './CitiesList';

const router = createBrowserRouter([
  {
    path: "/",
    element: <CitiesList cities={['Budapest', 'Bukarest']} />
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
