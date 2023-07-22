import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';
import CitiesList from './CitiesList';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CitiesList cities={['Budapest', 'Bukarest']} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
