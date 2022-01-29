import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./InfoBox.css";
import AnimatedNumber from "animated-number-react";
import { formatTotal, prettyPrintStat } from "./util";

function InfoBox({ title, cases, total, active, isRed, ...props }) {
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && "infoBox--selected"} ${
        isRed && "infoBox--red"
      }`}
    >
      <CardContent>
        <Typography className="infoBox__title">{title}</Typography>
        <AnimatedNumber
          className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}
          value={cases}
          formatValue={prettyPrintStat}
        />
        <div style={{ marginTop: "5px" }}>
          <AnimatedNumber
            className="infoBox__total"
            value={total}
            formatValue={formatTotal}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
