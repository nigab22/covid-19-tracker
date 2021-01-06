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
import Linegraph from './Linegraph';
import Map from './Map';
import './App.css';
import { sortData, formatStat } from './util';
import 'leaflet/dist/leaflet.css';

function App() {
  const [selectedCountry, setSelectedCountry] = useState('worldwide');
  const [countries, setCountries] = useState([]);
  const [covidDataForCountry, setCovidDataForCountry] = useState({});
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState('cases');
  const [mapCountries, setMapCountries] = useState([]);
  const [mapCenter, setMapCenter] = useState([30, -18]);
  const [mapZoom, setMapZoom] = useState(2);

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
          setMapCountries(data);
          setCountries(countriesList);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === 'worldwide'
        ? `https://disease.sh/v3/covid-19/all`
        : `https://disease.sh/v3/covid-19/countries/${countryCode}?yesterday=1`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setSelectedCountry(countryCode);
        setCovidDataForCountry(data);

        if (countryCode !== 'worldwide') {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setMapZoom(5);
        } else {
          setMapCenter([30, -18]);
          setMapZoom(2);
        }
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
            active={casesType === 'cases'}
            isRed={true}
            onClick={(e) => setCasesType('cases')}
            title="Coronavirus Cases"
            cases={formatStat(covidDataForCountry.todayCases)}
            total={formatStat(covidDataForCountry.cases)}
          />
          <InfoBox
            active={casesType === 'recovered'}
            isRed={false}
            onClick={(e) => setCasesType('recovered')}
            title="Recovered"
            cases={formatStat(covidDataForCountry.todayRecovered)}
            total={formatStat(covidDataForCountry.recovered)}
          />
          <InfoBox
            active={casesType === 'deaths'}
            isRed={true}
            onClick={(e) => setCasesType('deaths')}
            title="Deaths"
            cases={formatStat(covidDataForCountry.todayDeaths)}
            total={formatStat(covidDataForCountry.deaths)}
          />
        </div>

        <div>
          <Map
            countries={mapCountries}
            casesType={casesType}
            center={mapCenter}
            zoom={mapZoom}
          />
        </div>
      </div>
      <Card className="app-right">
        <CardContent>
          <h3 className="app-table-title">Live Cases By Country</h3>
          <Table countries={tableData} />
          <h3 className="app-graph-title">Worldwide new {casesType}</h3>
          <Linegraph casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
