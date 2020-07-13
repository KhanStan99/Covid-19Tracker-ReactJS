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
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import purple from "@material-ui/core/colors/purple";
import pink from "@material-ui/core/colors/pink";
import red from "@material-ui/core/colors/red";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Link from "@material-ui/core/Link";
import Switch from "@material-ui/core/Switch";
import Skeleton from "@material-ui/lab/Skeleton";

const useStyles = makeStyles((theme) => ({
  recovered: {
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: purple[500],
  },
  red: {
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500],
  },
  blue: {
    color: theme.palette.getContrastText(pink[500]),
    backgroundColor: pink[500],
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
  const [testedData, setTestedData] = useState(null);
  const [darkTheme, setDarkTheme] = useState(true);

  const baseTheme = createMuiTheme({
    palette: {
      type: darkTheme ? "dark" : "light",
    },
  });

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

  if (!testedData) {
    axios
      .get("https://api.covid19india.org/data.json")
      .then(function (response) {
        const list = response.data.tested;
        setTestedData(list[list.length - 1]);
      })
      .catch(function (error) {
        // reject(error);
      });
  }

  const handleChange = (event) => {
    setDarkTheme(!darkTheme);
  };

  return (
    <ThemeProvider theme={baseTheme}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <img
            alt="logo"
            className="image"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/SARS-CoV-2_without_background.png/220px-SARS-CoV-2_without_background.png"
          />
          <Typography variant="h6" className={classes.title}>
            Corona Virus Tracker | India
          </Typography>
          <Switch checked={darkTheme} onChange={handleChange} />
        </Toolbar>
      </AppBar>
      <Paper elevation={0} square>
        {globalData && cityData && testedData ? (
          <>
            <TestedData testedData={testedData} />
            <TotalCases globalData={globalData} cityData={cityData} />
          </>
        ) : (
          <div>
            <Skeleton animation="wave" height={118} />
            <Skeleton animation="wave" height={118} />
            <Skeleton animation="wave" height={118} />
            <Skeleton animation="wave" height={118} />
            <Skeleton animation="wave" height={118} />
            <Skeleton animation="wave" height={118} />
          </div>
        )}

        <Card style={{ textAlign: "center" }}>
          <Typography variant="h6" color="#FFF">
            <Link
              color="secondary"
              target="_blank"
              href="https://www.trentweet.in"
            >
              Posted by Trentweet
            </Link>
          </Typography>
          <Typography variant="caption" color="textPrimary">
            UI Developed by:{" "}
            <Link
              color="secondary"
              target="_blank"
              href="https://github.com/KhanStan99"
            >
              KhanStan
            </Link>{" "}
            &bull; API Provided by:{" "}
            <Link
              color="secondary"
              target="_blank"
              href="https://twitter.com/covid19indiaorg"
            >
              covid19indiaorg
            </Link>
          </Typography>
        </Card>
      </Paper>
    </ThemeProvider>
  );
}

function TestedData(props) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography>Tested</Typography>
        <Typography variant="h6">
          {formatNumber(props.testedData.totalsamplestested)}
        </Typography>
        <Typography variant="caption">
          Last updated: {props.testedData.testedasof}
        </Typography>
        <br></br>
        <Typography variant="caption" color="#FFF">
          <Link
            color="secondary"
            target="_blank"
            href={props.testedData.source}
          >
            SOURCE
          </Link>
        </Typography>
      </CardContent>
    </Card>
  );
}

function TotalCases(props) {
  const classes = useStyles();
  function getFormatted(actual, delta) {
    const main = formatNumber(actual);
    const dDelta = formatNumber(delta);
    let returnValue = main;
    if (dDelta > 0) {
      returnValue = `${returnValue} [+${dDelta}]`;
    }
    return returnValue;
  }
  return (
    <Card variant="outlined">
      <TableContainer>
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
                    label={getFormatted(
                      testItem.confirmed,
                      testItem.deltaconfirmed
                    )}
                    avatar={<Avatar>T</Avatar>}
                  />
                  <Chip
                    label={formatNumber(testItem.active)}
                    avatar={<Avatar className={classes.blue}>A</Avatar>}
                  />

                  <Chip
                    label={getFormatted(
                      testItem.recovered,
                      testItem.deltarecovered
                    )}
                    avatar={<Avatar className={classes.recovered}>R</Avatar>}
                  />

                  <Chip
                    avatar={<Avatar className={classes.red}>D</Avatar>}
                    label={getFormatted(testItem.deaths, testItem.deltadeaths)}
                  />
                </div>
                <LastUpdated date={testItem.lastupdatedtime} />
              </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              {testItem.state !== "Total" && props.cityData ? (
                <DetailedPanel
                  state={testItem.state}
                  cityList={props.cityData}
                />
              ) : (
                "Above numbers represents Total, Active, Recovered & Death cases"
              )}
            </ExpansionPanelDetails>
          </ExpansionPanel>
        ))}
      </TableContainer>
    </Card>
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
                {formatNumber(item.confirmed)}{" "}
                {item.delta.confirmed > 0
                  ? "[+" + formatNumber(item.delta.confirmed) + "]"
                  : null}
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

function LastUpdated(props) {
  const time = props.date.slice(11);

  var time_start = new Date();
  var time_end = new Date();
  var value_start = time.split(":");
  var value_end = (
    time_end.getHours() +
    ":" +
    time_end.getMinutes() +
    ":" +
    time_end.getSeconds()
  ).split(":");

  time_start.setHours(value_start[0], value_start[1], value_start[2], 0);
  time_end.setHours(value_end[0], value_end[1], value_end[2], 0);

  let hours = (time_end - time_start) / 1000 / 3600;
  hours = hours.toString().replace("-", "");
  hours = hours.split(".");
  hours = Number(hours[0]);
  let finalWord;
  if (hours > 0) {
    finalWord = hours + " hour(s) ago";
  } else {
    finalWord =
      Math.round(((time_end - time_start) / 1000 / 3600) * 60) + " minutes ago";
  }

  return <small>last update: {finalWord}</small>;
}

export default App;
