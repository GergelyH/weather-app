import React from 'react';
import logo from './logo.svg';
import './App.css';
import CitiesList from './CitiesList';

function App() {
  return (
    <div className="App">
      <CitiesList cities={['Budapest', 'Bukarest']}/>
    </div>
  );
}

export default App;
