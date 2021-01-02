import React from 'react';
import './InfoBox.css';
import { Card, CardContent, Typography } from '@material-ui/core';

function InfoBox({ title, cases, total }) {
  return (
    <Card className="info-box">
      <CardContent>
        <Typography className="info-box-title" color="textSecondary">
          {title}
        </Typography>
        <h2 className="info-box-cases">{cases} total</h2>
        <Typography className="info-box-total" color="textSecondary">
          {total} total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
