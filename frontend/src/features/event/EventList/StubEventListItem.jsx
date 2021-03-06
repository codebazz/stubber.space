import React, { Component } from "react";
import {
  Button,
  Card,
  Icon,
  Image,
  Label,
  Grid,
  Popup
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import format from "date-fns/format";
import compareAsc from "date-fns/compare_asc";

const eventLabelStyle = {
  as: "a",
  color: "orange",
  content: "Event has Ended",
  icon: "ticket",
  ribbon: true
};

class StubEventListItem extends Component {
  render() {
    const { stubEvent, events } = this.props;
    let photo;
    events.forEach(event => {
      if (event.id === stubEvent.id) {
        photo = event.photoURL;
      }
    });

    let eventDate = new Date(Number(stubEvent.time));
    let eventOver = compareAsc(eventDate, Date.now());
    return (
      <Grid.Column>
        <Card fluid>
          <Image
            label={eventOver === -1 && eventLabelStyle}
            src={photo || `/assets/loading.jpg`}
          />
          <Card.Content>
            <Card.Header as={Link} to={`/event/${stubEvent.id}`}>
              {stubEvent.name}
            </Card.Header>
            <Card.Meta>
              Hosted by{" "}
              <Popup
                trigger={
                  <Label
                    href={`https://ropsten.etherscan.io/address/${
                      stubEvent.artist
                    }`}
                  >
                    {stubEvent.artist.substring(0, 12)}
                    {"..."}
                  </Label>
                }
                content={stubEvent.artist}
                position="top center"
                size="tiny"
              />
            </Card.Meta>
            <Card.Description>
              <Icon name="clock" /> {format(eventDate, "ddd Do MMM")} at{" "}
              {format(eventDate, "h:mm A")}
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <Icon name="ticket" /> {stubEvent.sales}
            {" / "}
            {stubEvent.salesCap}
            <Button
              as={Link}
              to={`/event/${stubEvent.id}`}
              color="violet"
              floated="right"
              content="View"
            />
          </Card.Content>
        </Card>
      </Grid.Column>
    );
  }
}

export default StubEventListItem;
