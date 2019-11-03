import { connect } from "react-redux";
import React from "react";
import { Table, Col, Alert } from "react-bootstrap";

class Tracks extends React.Component {
  renderTracks() {
    var tracks;
    if (this.props.tracks != null) {
      tracks = this.props.tracks.map((track, i) => {
        return (
          <tr key={i} onClick={() => this.props.clickTrack(i)}>
            <td>{i + 1}</td>
            <td>{track.name}</td>
            <td>{track.artists}</td>
          </tr>
        );
      });
    } else {
      tracks = Array(20)
        .fill()
        .map((track, i) => {
          return (
            <tr key={i}>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
          );
        });
    }

    return (
      <Table striped hover bordered size="sm">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Title</th>
            <th>Artist</th>
          </tr>
        </thead>
        <tbody>{tracks}</tbody>
      </Table>
    );
  }

  render() {
    return (
      <Col sm={6}>
        <h4 style={{ textAlign: "center" }}>Your Top Tracks</h4>
        {this.renderTracks()}
      </Col>
    );
  }
}

function mapStateToProps({ tracks }) {
  return { tracks };
}

export default connect(mapStateToProps)(Tracks);
