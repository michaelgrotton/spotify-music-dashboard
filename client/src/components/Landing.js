import React from "react";
import { connect } from "react-redux";
import * as actions from "../actions";
import Tracks from "./Tracks";
import Artists from "./Artists";
import RadarChart from "./RadarChart";
import * as d3 from "d3";
import {
  Container,
  Row,
  Col,
  DropdownButton,
  Dropdown,
  Alert,
  ListGroup
} from "react-bootstrap";

const audio_features = [
  "danceability",
  "valence",
  "liveness",
  "speechiness",
  "energy",
  "instrumentalness",
  "acousticness"
];

class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time_range: "medium_term",
      screenWidth: 0,
      screenHeight: 0,
      tracks: { first: null, second: null },
      data: []
    };
  }

  clickTrack = i => {
    var first = this.state.tracks.first;
    var second = this.state.tracks.second;

    if (this.state.tracks.first === i && this.state.tracks.second != null) {
      first = second;
      second = null;
    } else if (this.state.tracks.first === i) {
      first = null;
    } else if (this.state.tracks.second === i) {
      second = null;
    } else if (this.state.tracks.first != null) {
      second = i;
    } else if (this.state.tracks.first === null) {
      first = i;
    }

    this.setState({ tracks: { first, second } });
    this.getData(first, second);
  };

  handleChange = time_range => {
    this.setState({ time_range, tracks: { first: null, second: null } });
    this.getData(null, null);
    this.props.fetchTracks(time_range);
    this.props.fetchArtists(time_range);
  };

  getData = (first, second) => {
    var allData = [];
    var data = [];

    this.props.tracks.map(track => {
      track.analysis.map(features => {
        var analysis = Object.keys(features).map(function(feature) {
          if (audio_features.includes(feature)) {
            var obj = {};
            obj["value"] = features[feature];
            obj["axis"] = feature;
            return obj;
          }
        });
        allData.push(analysis.filter(feature => feature != undefined));
      });
    });

    if (first != null) data.push(allData[first]);
    if (second != null) data.push(allData[second]);
    if (first == null && second == null) data = [];

    this.setState({ data });
  };

  componentDidMount() {
    this.props.fetchTracks(this.state.time_range);
    this.props.fetchArtists(this.state.time_range);
    window.addEventListener("resize", this.onResize, false);
    this.onResize();
  }

  onResize = () => {
    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;

    if (screenWidth > 768) {
      screenWidth = screenWidth * 0.33;
      screenHeight = screenWidth;
    } else {
      screenWidth = screenWidth * 0.8;
      screenHeight = screenWidth;
    }

    this.setState({ screenWidth, screenHeight });
  };

  render() {
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    return (
      <div>
        <Container>
          <div
            style={{
              maxWidth: "600px",
              margin: " 40px auto"
            }}
          >
            <p>
              Using the Spotify API, we can view your favorite artists and
              tracks in the short term (approximately the last 4 weeks), medium
              term (approximately the last 6 months), and long term (using all
              the data Spotify has, going back several years). Use the drop down
              menu below to adjust the time period and view your history.
            </p>
          </div>
          <Row style={{ margin: " 30px auto", maxWidth: "565px" }}>
            <h4 style={{ lineHeight: "35px", marginRight: "10px" }}>
              Show me my listening history in the
            </h4>
            <DropdownButton
              id="dropdown-basic-button"
              variant="success"
              title={this.state.time_range.split("_").join(" ")}
            >
              <Dropdown.Item onSelect={() => this.handleChange("short_term")}>
                short term
              </Dropdown.Item>
              <Dropdown.Item onSelect={() => this.handleChange("medium_term")}>
                medium term
              </Dropdown.Item>
              <Dropdown.Item onSelect={() => this.handleChange("long_term")}>
                long term
              </Dropdown.Item>
            </DropdownButton>
            <h4 style={{ lineHeight: "35px", marginLeft: "5px" }}>.</h4>
          </Row>
          {!this.props.tracks && !this.props.artists && (
            <Alert variant={"primary"}>
              We are loading your listening history, hang tight!
            </Alert>
          )}
          <Row>
            <Tracks
              timeRange={this.state.time_range}
              clickTrack={this.clickTrack}
            />
            <Artists timeRange={this.state.time_range} />
          </Row>
        </Container>
        <div
          style={{
            maxWidth: "600px",
            margin: "60px auto"
          }}
        >
          <p>
            We can also view audio features on your favorite tracks. Select a
            track from the list on the right to visualize it using the radar
            chart on the left. Select another track to compare it to the first
            track you selected. You can read more about the audio features
            spotify provides{" "}
            <a href="https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-features/">
              here
            </a>
            .
          </p>
        </div>
        <Container
          style={{
            border: "2px solid whitesmoke",
            borderRadius: "5px",
            paddingTop: "10px"
          }}
        >
          <Row>
            <Col md={5}>
              {this.props.tracks != null && (
                <RadarChart
                  width={this.state.screenWidth}
                  height={this.state.screenHeight}
                  tracks={this.state.tracks}
                  data={this.state.data}
                />
              )}
            </Col>
            <Col>
              <h5
                style={{
                  lineHeight: "35px",
                  marginLeft: "20px"
                }}
              >
                Now showing:{" "}
                {this.state.tracks.first != null && (
                  <span
                    style={{
                      color: "white",
                      backgroundColor: color(0),
                      paddingLeft: "3px",
                      paddingRight: "3px",
                      borderRadius: "3px",
                      opacity: ".6"
                    }}
                  >
                    {this.props.tracks[this.state.tracks.first].name}
                  </span>
                )}
                {this.state.tracks.second != null && " and "}
                {this.state.tracks.second != null && (
                  <span
                    style={{
                      color: "white",
                      backgroundColor: color(1),
                      paddingLeft: "3px",
                      paddingRight: "3px",
                      borderRadius: "3px",
                      opacity: ".6"
                    }}
                  >
                    {this.props.tracks[this.state.tracks.second].name}
                  </span>
                )}
              </h5>
              <Container>
                <Row>
                  <Col>
                    <ListGroup variant="flush">
                      {this.props.tracks &&
                        this.props.tracks.map((track, i) => {
                          if (i < 10)
                            return (
                              <ListGroup.Item
                                action
                                key={i}
                                onClick={() => this.clickTrack(i)}
                                style={{
                                  margin: 0,
                                  padding: "5px",
                                  fontSize: "14px"
                                }}
                              >
                                {track.name}
                              </ListGroup.Item>
                            );
                        })}
                    </ListGroup>
                  </Col>
                  <Col>
                    <ListGroup variant="flush">
                      {this.props.tracks &&
                        this.props.tracks.map((track, i) => {
                          if (i > 9)
                            return (
                              <ListGroup.Item
                                action
                                key={i}
                                onClick={() => this.clickTrack(i)}
                                style={{
                                  margin: 0,
                                  padding: "5px",
                                  fontSize: "14px"
                                }}
                              >
                                {track.name}
                              </ListGroup.Item>
                            );
                        })}
                    </ListGroup>
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>
        </Container>
        <div style={{ height: "100px", width: "100%" }}></div>
      </div>
    );
  }
}

function mapStateToProps({ auth, tracks, artists }) {
  return { auth, tracks, artists };
}

export default connect(
  mapStateToProps,
  actions
)(Landing);
