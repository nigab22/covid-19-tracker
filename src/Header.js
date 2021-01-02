import React from 'react';
import './Header.css';
import { FormControl, MenuItem, Select } from '@material-ui/core';

function Header({ countries, selectedCountry, setSelectedCountry }) {
  const onCountryChange = (e) => {
    let countryCode = e.target.value;
    setSelectedCountry(countryCode);
  };

  return (
    <div className="app-header">
      <h1>COVID-19 Tracker</h1>
      <FormControl className="app-dropdown">
        <Select
          variant="outlined"
          value={selectedCountry}
          onChange={onCountryChange}
        >
          <MenuItem value="worldwide">Worldwide</MenuItem>
          {countries.map((country) => (
            <MenuItem value={country.value}>{country.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default Header;
