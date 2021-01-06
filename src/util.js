import React from 'react';
import numeral from 'numeral';
import { Circle, Popup } from 'react-leaflet';

const casesTypeColors = {
  cases: {
    hex: '#CC1034',
    multiplier: 400,
  },
  recovered: {
    hex: '#7dd71d',
    multiplier: 400,
  },
  deaths: {
    hex: '#fb4443',
    multiplier: 1500,
  },
};

export const sortData = (data) => {
  const sortedData = [...data];

  return sortedData.sort((a, b) => b.cases - a.cases);
};

export const formatStat = (stat) =>
  stat ? `+${numeral(stat).format('0,0')}` : '+0';

export const showDataOnMap = (data, casesType = 'cases') =>
  data.map((country, index) => (
    <Circle
      key={index}
      center={[country.countryInfo.lat, country.countryInfo.long]}
      color={casesTypeColors[casesType].hex}
      fillColor={casesTypeColors[casesType].hex}
      fillOpacity={0.4}
      radius={
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
      }
    >
      <Popup>
        <div className="info-container">
          <div
            className="info-flag"
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          />
          <div className="info-country-name">{country.country}</div>
          <div className="info-cases">
            Cases: {numeral(country.cases).format('0,0')}
          </div>
          <div className="info-recovered">
            Recovered: {numeral(country.recovered).format('0,0')}
          </div>
          <div className="info-deaths">
            Deaths: {numeral(country.deaths).format('0,0')}
          </div>
        </div>
      </Popup>
    </Circle>
  ));
