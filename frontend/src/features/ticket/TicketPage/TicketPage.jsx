import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Grid, Loader } from "semantic-ui-react";
import { drizzleConnect } from "drizzle-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import TicketList from "./TicketList";

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
  }

  render() {
    const { loading, StubToken, accounts, drizzleStatus } = this.props;
    if (!drizzleStatus.initialized) return <LoadingComponent inverted={true} />;
    var storedData = this.contracts["StubToken"].methods["ticketsOf"].cacheCall(
      accounts[0]
    );
    var tickets =
      StubToken.synced && StubToken["ticketsOf"][storedData]
        ? StubToken["ticketsOf"][storedData].value
        : "Loading...";
    return (
      <Grid stackable>
        <Grid.Column width={8}>
          {tickets &&
            tickets !== "Loading..." && <TicketList tickets={tickets} />}
        </Grid.Column>
        <Grid.Column width={16}>
          <Loader active={loading} />
        </Grid.Column>
      </Grid>
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