import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import "./App.css";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  title: {
    flexGrow: 1
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

  if (!globalData) {
    axios
      .get("https://api.covid19india.org/data.json")
      .then(function(response) {
        setGlobalData(response.data.statewise);
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
            Corona Virus Tracker | India
          </Typography>
        </Toolbar>
      </AppBar>
      {globalData ? <TotalCases globalData={globalData} /> : <p>Loading....</p>}
      {/* {testedData ? (
        <DailyUpdates testedData={testedData} />
      ) : (
        <p>Loading....</p>
      )} */}
      <footer style={{ textAlign: "center" }}>
        <a href="https://www.trentweet.in">Posted by Trentweet</a>
        <p>
          UI Developed by:
          <a href="https://github.com/KhanStan99"> KhanStan</a> | API Provided
          by:
          <a href="https://twitter.com/covid19indiaorg"> covid19indiaorg</a>.
        </p>
      </footer>
    </div>
  );
}

function TotalCases(props) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>State</TableCell>
            <TableCell>Confirmed Cases</TableCell>
            <TableCell>Active Cases</TableCell>
            <TableCell>Recovered Cases</TableCell>
            <TableCell>Deaths Cases</TableCell>
            <TableCell>Date Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.globalData.map(testItem => (
            <TableRow>
              <TableCell component="th" scope="testItem.confirmed">
                {testItem.state}
              </TableCell>
              <TableCell component="th" scope="testItem.confirmed">
                <span className="cases">
                  {formatNumber(testItem.confirmed)} [+
                  {formatNumber(testItem.delta.confirmed)}]
                </span>
              </TableCell>
              <TableCell component="th" scope="testItem.active">
                <span className="deaths">
                  {formatNumber(testItem.deaths)} [+
                  {formatNumber(testItem.delta.deaths)}]
                </span>
              </TableCell>
              <TableCell
                className="recovered"
                component="th"
                scope="testItem.recovered"
              >
                <span className="recovered">
                  {formatNumber(testItem.recovered)} [+
                  {formatNumber(testItem.delta.recovered)}]
                </span>
              </TableCell>
              <TableCell component="th" scope="testItem.deaths">
                <span className="deaths">
                  {formatNumber(testItem.deaths)} [+
                  {formatNumber(testItem.delta.deaths)}]
                </span>
              </TableCell>
              <TableCell component="th" scope="testItem.lastupdatedtime">
                {testItem.lastupdatedtime}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

export default App;
