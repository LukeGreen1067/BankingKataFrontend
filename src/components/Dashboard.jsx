import React from 'react';
import {Alert} from 'rsuite';

import DataTable from './DataTable';
import Search from './Search';
import '../styles/Grid.css';

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accountData: [],
      transactionData: [],
      loading: false,
      focusedUser: {},
    };

    this.setFocusedUser = this.setFocusedUser.bind(this);
    this._fetchTransactionData = this._fetchTransactionData.bind(this);
  }

  setFocusedUser(user) {
    this.setState({focusedUser: user});
  }

  componentDidMount() {
    this._fetchAccountData();
    this._fetchTransactionData();
  }

  _fetchAccountData() {
    this.setState({loading: true});
    fetch('/bank/accounts_db', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true,
      },
    }).then((response) => {
      if (response.status === 200) return response.json();
      throw new Error(response.json());
    })
        .then((responseJSON) => {
          this.setState({
            success: true,
            accountData: responseJSON,
            loading: false,
          });
        })
        .catch((error) => {
          this.setState({
            success: false,
            loading: false,
          });
          console.log(error);
          console.log(JSON.stringify(error));
          Alert.error('Failed to fetch from API');
        });
  }

  _fetchTransactionData(pageNumber = 1) {
    this.setState({loading: true});
    fetch('/bank/transactions_db?pageNumber=' + pageNumber, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true,
      },
    }).then((response) => {
      if (response.status === 200) return response.json();
      throw new Error(response.json());
    })
        .then((responseJSON) => {
          this.setState({
            success: true,
            transactionData: responseJSON,
            loading: false,
          });
        })
        .catch((error) => {
          this.setState({
            success: false,
            loading: false,
          });
          console.log(error);
          Alert.error('Failed to fetch from API');
        });
  }

  render() {
    const {accountData, transactionData} = this.state;
    return (
      <div className="panels">
        <DataTable className="data-table"
          data={accountData}
          transactions={transactionData}
          setUser={this.setFocusedUser}
          newPage={this._fetchTransactionData}
        />
        <Search className="search-bar" data={accountData} focused={this.state.focusedUser}/>
      </div>
    );
  }
}
