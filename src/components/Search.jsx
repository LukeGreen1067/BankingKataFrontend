import React from 'react';
import {Panel, InputGroup, Icon, AutoComplete, Button} from 'rsuite';
import '../styles/Search.css';
import TransactionsModal from './TransactionsModal';

export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accountData: [],
      transactionData: [],
      currentAccount: {},
      autoComplete: [],
      loading: false,
      show: false,
    };

    this.close = this.close.bind(this);
  }

  componentDidMount() {
    const data = this.props.data.map((account) => account.name);
    this.setState({
      accountData: this.props.data,
      transactionData: this.props.transactions,
      autoComplete: data,
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      const data = this.props.data.map((account) => account.name);
      this.setState({
        accountData: this.props.data,
        autoComplete: data,
        loading: false,
        currentAccount: this.props.focused,
      });
    }
  }


  search(value) {
    const account = this.state.accountData.find((account) => account.name.toLowerCase() === value.toLowerCase());
    this.setState({
      currentAccount: account === undefined ? {} : account,
    });
  }

  close() {
    this.setState({show: false});
  }

  render() {
    const {autoComplete} = this.state;

    return (
      <Panel className="panel">
        <div className="search">
          <h3>Account Search</h3>
          <InputGroup>
            <AutoComplete onChange={(value) => this.search(value)} data={autoComplete} placeholder="Search a Full Name"/>
            <InputGroup.Addon>
              <Icon icon="search"/>
            </InputGroup.Addon>
          </InputGroup>
          <Panel bordered style={{marginBottom: 10}}>
            <p>ID: {this.state.currentAccount.id}</p>
            <p>Name: {this.state.currentAccount.name}</p>
            <p>Balance: {this.state.currentAccount.currency} {this.state.currentAccount.balance}</p>
            <p>Type: {this.state.currentAccount.accountType}</p>
          </Panel>
          <Button disabled={!Object.keys(this.state.currentAccount).length > 0} appearance='default' onClick={() => this.setState((old) => ({show: !old.show}))}>View transactions</Button>
          <TransactionsModal
            show={this.state.show}
            user={this.state.currentAccount}
            close={this.close}
          />
        </div>
      </Panel>
    );
  }
}
