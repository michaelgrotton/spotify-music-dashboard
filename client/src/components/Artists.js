import { connect } from "react-redux";
import React from "react";
import { Table, Col } from "react-bootstrap";
import * as actions from "../actions";

class Artists extends React.Component {
  renderArtists() {
    var artists;
    if (this.props.artists != null) {
      artists = this.props.artists.map((artist, i) => {
        return (
          <tr key={i}>
            <td>{i + 1}</td>
            <td>{artist}</td>
          </tr>
        );
      });
    } else {
      artists = Array(20)
        .fill()
        .map((artist, i) => {
          return (
            <tr key={i}>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
          );
        });
    }
    return (
      <Table striped bordered size="sm">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Artist</th>
          </tr>
        </thead>
        <tbody>{artists}</tbody>
      </Table>
    );
  }
  render() {
    return (
      <Col sm={6}>
        <h4 style={{ textAlign: "center" }}>Your Top Artists</h4>
        {this.renderArtists()}
      </Col>
    );
  }
}

function mapStateToProps({ artists }) {
  return { artists };
}

export default connect(
  mapStateToProps,
  actions
)(Artists);
