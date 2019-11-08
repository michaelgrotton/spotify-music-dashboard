import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Accordion, Card, Button } from "react-bootstrap";

class Login extends React.Component {
  render() {
    return (
      <div>
        <a
          href="/auth/spotify"
          style={{ textAlign: "center", margin: "100px" }}
        >
          <h3>Login With Spotify</h3>
        </a>
        <Accordion style={{ maxWidth: "600px", margin: "0 auto" }}>
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="0">
                What is this application doing with my Spotify profile?
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                By clicking the link above, you will be forwarded to a Spotify
                portal where you can give this application permission to request
                your Spotify username and listening history, which consists of
                your most listened to tracks on Spotify. This application will
                not have access to any other data including your password, and
                does not store any records between sessions except for your
                Spotify username.
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="1">
                Do I have to login?
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="1">
              <Card.Body>Right now yes, but please check back soon!</Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </div>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth: auth };
}

export default connect(mapStateToProps)(Login);
