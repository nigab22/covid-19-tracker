import React from 'react';
import './InfoBox.css';
import { Card, CardContent, Typography } from '@material-ui/core';

function InfoBox({ title, cases, total, active, isRed, onClick }) {
  return (
    <Card
      onClick={onClick}
      className={`info-box ${active && 'info-box-selected'} ${
        isRed && 'info-box-red'
      }`}
    >
      <CardContent>
        <Typography className="info-box-title" color="textSecondary">
          {title}
        </Typography>
        <h2 className={`info-box-cases ${!isRed && 'info-box-recovered'}`}>
          {cases}
        </h2>
        <Typography className="info-box-total" color="textSecondary">
          {total} total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
