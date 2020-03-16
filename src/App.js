import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import axios from "axios";
import "./App.css";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  title: {
    flexGrow: 1
  },
  heading: {
    paddingLeft: "10px",
    paddingTop: "10px",
    color: "#FFFFFF"
  },
  rootCard: {
    width: "100%"
  },
  inline: {
    display: "inline"
  }
}));

function App() {
  const classes = useStyles();
  const [globalData, setGlobalData] = useState(null);
  const [countryData, setCountryData] = useState(null);

  if (!globalData) {
    axios
      .get("https://coronavirus-19-api.herokuapp.com/all")
      .then(function(response) {
        setGlobalData(response.data);
      })
      .catch(function(error) {
        // reject(error);
      });
  }

  if (!countryData) {
    axios
      .get("https://coronavirus-19-api.herokuapp.com/countries")
      .then(function(response) {
        setCountryData(response.data);
      })
      .catch(function(error) {
        // reject(error);
      });
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Corona Virus Tracker
          </Typography>
        </Toolbar>
      </AppBar>
      {globalData ? <TotalCases globalData={globalData} /> : <p>Loading....</p>}
      {countryData ? (
        <CountryCases countryData={countryData} />
      ) : (
        <p>Loading....</p>
      )}
      <footer style={{ textAlign: "center" }}>
        <a href="https://www.trentweet.in">Posted by Trentweet</a>
        <p>
          UI Developed by:
          <a href="https://github.com/KhanStan99"> KhanStan</a> | API Provided
          by:
          <a href="https://github.com/javieraviles"> javieraviles</a>.
        </p>
      </footer>
    </div>
  );
}

function TotalCases(props) {
  const classes = useStyles();
  return (
    <div style={{ backgroundColor: "#2196f3" }}>
      <Typography variant="h6" className={classes.heading}>
        World Wide Cases
      </Typography>
      <div className="grid-container">
        <div className="cases">{formatNumber(props.globalData.cases)}</div>
        <div className="deaths">{formatNumber(props.globalData.deaths)}</div>
        <div className="recovered">
          {formatNumber(props.globalData.recovered)}
        </div>
      </div>
    </div>
  );
}

function CountryCases(props) {
  const classes = useStyles();
  const countryData = props.countryData;
  const listItems = countryData.map(number => (
    <List className={classes.root} key={number.country}>
      <ListItem alignItems="flex-start">
        <ListItemText
          primary={number.country}
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                className={classes.inline}
                color="textPrimary"
              >
                Cases: {number.cases} — Deaths: {number.deaths} — Recovered:{" "}
                {number.recovered} — Critical: {number.critical} — Active:{" "}
                {number.active}
              </Typography>
              <br />
              <Typography
                component="span"
                variant="body2"
                className={classes.inline}
                color="textPrimary"
              >
                Today Deaths: {number.todayDeaths} — Cases Today:{" "}
                {number.todayCases}
              </Typography>
            </React.Fragment>
          }
        />
      </ListItem>
      <Divider variant="middle" />
    </List>
  ));
  return listItems;
}

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

export default App;
