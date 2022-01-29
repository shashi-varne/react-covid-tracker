import React, { useState, useEffect } from "react";
import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import LineGraph from "./LineGraph";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./util";
import numeral from "numeral";
import Map from "./Map";
import "leaflet/dist/leaflet.css";

const App = () => {
  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          let sortedData = sortData(data);
          setCountries(countries);
          setMapCountries(data);
          setTableData(sortedData);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(countryCode);
        setCountryInfo(data);
        if (countryCode === "worldwide") {
          setMapCenter([34.80746, -40.4796]);
          setMapZoom(2);
        } else {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setMapZoom(4);
        }
      });
  };

  return (
    <div className="main">
      <div className="app">
        <div className="app__left">
          <div className="app__header">
            <div className="title__container">
              <div style={{ display: "flex", alignItems: "center" }}>
                <p className="covid__title">COVID-19 Tracker</p>
                <img
                  src="https://img.icons8.com/external-lineal-color-zulfa-mahendra/48/000000/external-covid-the-new-normal-lineal-color-zulfa-mahendra.png"
                  width="30"
                  height="30"
                  style={{ marginLeft: "10px" }}
                />
              </div>
            </div>
            <FormControl className="app__dropdown">
              <Select
                variant="outlined"
                value={country}
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
          <div className="today__container">
            <p className="today">Today's statistics</p>
          </div>
          <div className="app__stats">
            <InfoBox
              onClick={(e) => setCasesType("cases")}
              title="Coronavirus Cases"
              isRed
              active={casesType === "cases"}
              cases={countryInfo.todayCases}
              total={countryInfo.cases}
            />
            <InfoBox
              onClick={(e) => setCasesType("recovered")}
              title="Recovered"
              active={casesType === "recovered"}
              cases={countryInfo.todayRecovered}
              total={countryInfo.recovered}
            />
            <InfoBox
              onClick={(e) => setCasesType("deaths")}
              title="Deaths"
              isRed
              active={casesType === "deaths"}
              cases={countryInfo.todayDeaths}
              total={countryInfo.deaths}
            />
          </div>
          <Map
            countries={mapCountries}
            casesType={casesType}
            center={mapCenter}
            zoom={mapZoom}
          />
        </div>
        <Card className="app__right">
          <CardContent>
            <div className="app__information">
              <h3>Live Cases by Country</h3>
              <Table countries={tableData} />
              <h3>Worldwide new {casesType}</h3>
              <LineGraph className="line_graph" casesType={casesType} />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="footer">
        <p>
          Developed by:{" "}
          <a
            href="https://www.linkedin.com/in/shashidhar-varne/"
            target="_blank"
            title="LinkedIn"
            className="my_name"
          >
            <span>SHASHIDHAR VARNE</span>
          </a>
        </p>
        <a
          href="https://www.linkedin.com/in/shashidhar-varne/"
          target="_blank"
          title="LinkedIn"
        >
          <img
            src="https://img.icons8.com/color/48/000000/linkedin.png"
            width="40"
            height="40"
          />
        </a>
        <a
          href="https://github.com/shashi-varne"
          target="_blank"
          title="Github"
        >
          <img src="https://img.icons8.com/ios-glyphs/30/000000/github.png" />
        </a>
      </div>
    </div>
  );
};

export default App;
