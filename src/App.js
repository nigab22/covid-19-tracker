import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
} from '@material-ui/core';
import InfoBox from './InfoBox';
import Table from './Table';
import Map from './Map';
import './App.css';
import { sortData } from './util';

function App() {
  const [selectedCountry, setSelectedCountry] = useState('worldwide');
  const [countries, setCountries] = useState([]);
  const [covidDataForCountry, setCovidDataForCountry] = useState({});
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then((response) => response.json())
      .then((data) => {
        setCovidDataForCountry(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
        .then((response) => response.json())
        .then((data) => {
          const countriesList = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countriesList);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (e) => {
    let countryCode = e.target.value;

    const url =
      countryCode === 'worldwide'
        ? `https://disease.sh/v3/covid-19/all`
        : `https://disease.sh/v3/covid-19/countries/${countryCode}?yesterday=1`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setSelectedCountry(countryCode);
        setCovidDataForCountry(data);
      });
  };

  return (
    <div className="app">
      <div className="app-left">
        <div className="app-header">
          <h1>COVID-19 Tracker</h1>
          <FormControl className="app-dropdown">
            <Select
              variant="outlined"
              value={selectedCountry}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country, index) => (
                <MenuItem key={index} value={country.value}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app-stats">
          <InfoBox
            title="Coronavirus Cases"
            cases={covidDataForCountry.todayCases}
            total={covidDataForCountry.cases}
          />
          <InfoBox
            title="Recovered"
            cases={covidDataForCountry.todayRecovered}
            total={covidDataForCountry.recovered}
          />
          <InfoBox
            title="Deaths"
            cases={covidDataForCountry.todayDeaths}
            total={covidDataForCountry.deaths}
          />
        </div>

        <div>
          <Map />
        </div>
      </div>

      <Card className="app-right">
        <CardContent>
          <h3>Live Cases By Country</h3>
          <Table countries={tableData} />
          <h3>Worldwide New Cases</h3>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
