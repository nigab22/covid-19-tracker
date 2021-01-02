import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@material-ui/core';
import Header from './Header';
import InfoBox from './InfoBox';
import Map from './Map';
import './App.css';

function App() {
  const [selectedCountry, setSelectedCountry] = useState('worldwide');
  const [countries, setCountries] = useState([]);
  const [covidDataWorldwide, setCovidDataWorldwide] = useState({
    cases: 0,
    deaths: 0,
    recovered: 0,
  });
  const [covidDataForCountry, setCovidDataForCountry] = useState({
    cases: 0,
    deaths: 0,
    recovered: 0,
  });

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
        .then((response) => response.json())
        .then((data) => {
          const countriesList = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          setCountries(countriesList);
        });
    };

    const getCovidData = async () => {
      await fetch('https://disease.sh/v3/covid-19/all')
        .then((response) => response.json())
        .then((data) => {
          const covidData = {
            cases: data.cases,
            deaths: data.deaths,
            recovered: data.recovered,
          };

          setCovidDataWorldwide(covidData);
        });
    };

    getCountriesData();
    getCovidData();
  }, []);

  useEffect(() => {
    const getCovidDataForCountry = async () => {
      await fetch(`https://disease.sh/v3/covid-19/countries/${selectedCountry}`)
        .then((response) => response.json())
        .then((data) => {
          const covidData = {
            cases: data.cases,
            deaths: data.deaths,
            recovered: data.recovered,
          };
          setCovidDataForCountry(covidData);
        });
    };
    if (selectedCountry === 'worldwide') {
      /*****FIX-ME*****/
      /*setCovidDataForCountry({
        cases: covidDataWorldwide.cases,
        deaths: covidDataWorldwide.deaths,
        recovered: covidDataWorldwide.recovered,
      });*/
    } else {
      getCovidDataForCountry();
    }
  }, [selectedCountry]);

  return (
    <div className="app">
      <div className="app-left">
        <Header
          countries={countries}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
        />
        <div className="app-stats">
          <InfoBox
            title="Coronavirus Cases"
            cases={covidDataForCountry.cases}
            total={covidDataWorldwide.cases}
          />
          <InfoBox
            title="Recovered"
            cases={covidDataForCountry.recovered}
            total={covidDataWorldwide.recovered}
          />
          <InfoBox
            title="Deaths"
            cases={covidDataForCountry.deaths}
            total={covidDataWorldwide.deaths}
          />
        </div>

        <div>
          <Map />
        </div>
      </div>

      <Card className="app-right">
        <CardContent>
          <h2>Live Cases By Country</h2>
          <h2>Worldwide New Cases</h2>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
