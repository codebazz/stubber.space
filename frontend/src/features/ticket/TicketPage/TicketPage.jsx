import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Grid, Loader, Card, Image, Icon } from "semantic-ui-react";
import { drizzleConnect } from "drizzle-react";
import { Connect, SimpleSigner } from "uport-connect";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import MetaMaskConnect from "../../../app/layout/MetaMaskConnect";
import TicketList from "./TicketList";

// Example Codes
const mnidAddress = "2p1ZYLx62fx2bRcbiheMZ1wsF7p6A32e3AJ";
const signingKey =
  "421d7707b215a83b2808c6884aa8ec3353737772bf51b05d056098ff0eafd108";
const appName = "Stubber";

const mapStateToProps = state => {
  return {
    drizzleStatus: state.drizzleStatus,
    StubToken: state.contracts.StubToken,
    accounts: state.accounts
  };
};

const mapState = state => ({
  tickets: state.tickets,
  loading: state.async.loading
});

class TicketPage extends Component {
  constructor(props, context) {
    super(props);
    this.contracts = context.drizzle.contracts;
    this.web3 = context.drizzle.web3;
    this.uri = undefined;
    this.getCredentials();
  }

  state = {
    uportName: undefined,
    uportImage: undefined,
    uportPhone: undefined,
    uportLocation: undefined
  };

  uriHandler = uri => {
    this.uri = uri;
  };

  async getCredentials() {
    const uport = new Connect(appName, {
      uriHandler: this.uriHandler,
      clientId: mnidAddress,
      network: "ropsten",
      signer: SimpleSigner(signingKey)
    });

    // Request userProfile
    await uport
      .requestCredentials({
        requested: ["name", "avatar", "phone", "country"]
      })
      .then(userProfile => {
        console.log(userProfile);
        this.setState({
          uportName: userProfile.name,
          uportImage: userProfile.avatar.uri,
          uportPhone: userProfile.phone,
          uportLocation: userProfile.country
        });
        return userProfile;
      });
  }

  render() {
    const { loading, StubToken, accounts, drizzleStatus } = this.props;
    const { uportName, uportImage, uportPhone, uportLocation } = this.state;
    if (!drizzleStatus.initialized || !this.uri)
      return <LoadingComponent inverted={true} />;
    if (!accounts[0]) return <MetaMaskConnect inverted={true} />;
    var storedData = this.contracts["StubToken"].methods["ticketsOf"].cacheCall(
      accounts[0]
    );
    var tickets =
      StubToken.synced && StubToken["ticketsOf"][storedData]
        ? StubToken["ticketsOf"][storedData].value
        : "Loading...";
    return (
      <div>
        <Grid stackable>
          <Grid.Column width={12}>
            <p>
              <i>
                <strong>{accounts[0]}</strong>
                {"'s Tickets"}
              </i>
            </p>
            {tickets &&
              tickets !== "Loading..." && (
                <TicketList
                  tickets={tickets}
                  accounts={accounts}
                  uri={this.uri}
                />
              )}
          </Grid.Column>
          <Grid.Column width={4}>
            <p>
              <i>
                <strong>uPort</strong>
                {" Validation example"}
              </i>
            </p>
            <Card>
              <Image src={uportImage || "/assets/user.png"} />
              <Card.Content>
                <Card.Header>{uportName}</Card.Header>
                <Card.Meta>
                  <Icon name="location arrow" />
                  <span>{uportLocation}</span>
                </Card.Meta>
                <Card.Description>{uportPhone}</Card.Description>
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column width={16}>
            <Loader active={loading} />
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

TicketPage.contextTypes = {
  drizzle: PropTypes.object,
  drizzleStore: PropTypes.object
};

export default connect(
  mapState,
  null
)(drizzleConnect(TicketPage, mapStateToProps));
