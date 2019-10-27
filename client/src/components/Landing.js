import React from "react";
import { connect } from "react-redux";
import * as actions from "../actions";
import Tracks from "./Tracks";
import Artists from "./Artists";
import {
  Container,
  Row,
  DropdownButton,
  Dropdown,
  Alert
} from "react-bootstrap";

class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = { time_range: "medium_term" };
  }

  handleChange = time_range => {
    this.setState({ time_range });
    this.props.fetchTracks(time_range);
    this.props.fetchArtists(time_range);
  };

  componentDidMount() {
    this.props.fetchTracks(this.state.time_range);
    this.props.fetchArtists(this.state.time_range);
  }

  render() {
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
            <Tracks timeRange={this.state.time_range} />
            <Artists timeRange={this.state.time_range} />
          </Row>
        </Container>
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
