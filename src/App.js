import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import "./App.css";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  green: {
    color: "#6eff9e",
    backgroundColor: "#6eff9e",
  },
  red: {
    color: "#ff4567",
    backgroundColor: "#ff4567",
  },
  blue: {
    color: "#91b6ff",
    backgroundColor: "#91b6ff",
  },
  title: {
    flexGrow: 1,
  },
  rootCard: {
    width: "100%",
  },
  inline: {
    display: "inline",
  },
  chips: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
}));

function App() {
  const classes = useStyles();
  const [globalData, setGlobalData] = useState(null);
  const [cityData, setCityData] = useState(null);

  if (!globalData) {
    axios
      .get("https://api.covid19india.org/data.json")
      .then(function (response) {
        setGlobalData(response.data.statewise);
      })
      .catch(function (error) {
        // reject(error);
      });
  }

  if (!cityData) {
    axios
      .get("https://api.covid19india.org/v2/state_district_wise.json")
      .then(function (response) {
        setCityData(response.data);
      })
      .catch(function (error) {
        // reject(error);
      });
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <img
            alt="logo"
            className="image"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/SARS-CoV-2_without_background.png/220px-SARS-CoV-2_without_background.png"
          />
          <Typography variant="h6" className={classes.title}>
            Corona Virus Tracker | India
          </Typography>
        </Toolbar>
      </AppBar>

      {globalData ? (
        <TotalCases globalData={globalData} cityData={cityData} />
      ) : (
        <p>Loading....</p>
      )}

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
  const classes = useStyles();
  return (
    <TableContainer component={Paper}>
      {props.globalData.map((testItem) => (
        <ExpansionPanel key={testItem.state}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <div>
              <b>{testItem.state}</b>
              <br />
              <div className={classes.chips}>
                <Chip
                  label={formatNumber(testItem.confirmed)}
                  avatar={<Avatar>T</Avatar>}
                />
                <Chip
                  label={formatNumber(testItem.active)}
                  avatar={<Avatar className={classes.blue}>A</Avatar>}
                />

                <Chip
                  label={formatNumber(testItem.recovered)}
                  avatar={<Avatar className={classes.green}>R</Avatar>}
                />

                <Chip
                  avatar={<Avatar className={classes.red}>D</Avatar>}
                  label={formatNumber(testItem.deaths)}
                />
              </div>
              <small>last update: {testItem.lastupdatedtime}</small>
            </div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            {testItem.state !== "Total" && props.cityData ? (
              <DetailedPanel state={testItem.state} cityList={props.cityData} />
            ) : (
              "Nothing to show"
            )}
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </TableContainer>
  );
}

function DetailedPanel(props) {
  let districts = [];
  props.cityList.forEach((element) => {
    if (props.state === element.state) {
      districts = element.districtData;
    }
  });
  districts.sort(function (a, b) {
    return b.confirmed - a.confirmed;
  });

  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>District</TableCell>
            <TableCell align="right">Confirmed</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {districts.map((item) => (
            <TableRow key={item.district}>
              <TableCell component="th" scope="row">
                {item.district}
              </TableCell>
              <TableCell align="right">
                {formatNumber(item.confirmed)}
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
