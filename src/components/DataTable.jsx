import React from 'react';
import {Table, Panel, Icon, IconButton, Pagination} from 'rsuite';
import {CSVLink} from 'react-csv';
import '../styles/Table.css';
const {Column, HeaderCell, Cell} = Table;

export default class DataTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accountData: [],
      transactionData: [],
      toggle: true,
      loading: false,
      activePage: 1,
    };

    this.setUser = this.setUser.bind(this);
  }

  componentDidMount() {
    this.setState({
      accountData: this.props.data,
      loading: true,
    });

    setTimeout(() => {
      this.setState({loading: false});
    }, 1000);
  }

  setUser(user) {
    this.props.setUser(user);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.setState({
        accountData: this.props.data,
        loading: false,
      });
    }
  }

  render() {
    const {accountData} = this.state;
    const csvDownload = this.state.toggle ? accountData : this.props.transactions;
    const filename = this.state.toggle ? 'account-data.csv' : `transaction-data-page${this.state.activePage}.csv`;

    return (
      <Panel className="panel">

        { this.state.toggle ? (<h3>Accounts</h3>) : (<h3>Transactions - Page {this.state.activePage}</h3>)}

        <div className="table-buttons">
          <CSVLink className="csv-download" data={csvDownload} filename={filename}>
            <IconButton>
              <Icon icon='download'/>
                Download as CSV
            </IconButton>
          </CSVLink>
          <IconButton onClick={() => this.setState((prev) => ({toggle: !prev.toggle}))}>
            <Icon icon='id-card'/>
            { this.state.toggle ? (<span>Show Transactions</span>) : (<span>Show Accounts</span>)}
          </IconButton>
        </div>
        { this.state.toggle ? (
            <AccountsTable data={this.state.accountData} loading={this.state.loading} setUser={this.setUser}></AccountsTable>
          ) : (
            <TransactionTable data={this.props.transactions} loading={this.state.loading}></TransactionTable>
          )}
        { !this.state.toggle && (
          <div className="pagination">
            <Pagination
              prev
              last
              next
              first
              size="lg"
              pages={639}
              maxButtons={10}
              activePage={this.state.activePage}
              onSelect={(value) => {
                this.props.newPage(value);
                this.setState({activePage: value});
              }
              }/>
          </div>)
        }
      </Panel>
    );
  }
}

const AccountsTable = function({loading, data, setUser}) {
  return (
    <Table height={970} data={data} loading={loading}
      style={{cursor: 'pointer'}}
      onRowClick={(data) => {
        setUser(data);
      }}>
      <Column width={170} align={'left'}>
        <HeaderCell>Full Name</HeaderCell>
        <Cell dataKey="name" />
      </Column>

      <Column width={120} align={'left'}>
        <HeaderCell>Currency</HeaderCell>
        <Cell dataKey="currency" />
      </Column>

      <Column width={120} align={'left'}>
        <HeaderCell>Balance</HeaderCell>
        <Cell dataKey="balance" />
      </Column>

      <Column width={220} align={'left'}>
        <HeaderCell>Type</HeaderCell>
        <Cell dataKey="accountType" />
      </Column>
    </Table>
  );
};

const TransactionTable = function({loading, data}) {
  return (
    <Table height={970} data={data} loading={loading}>
      <Column width={180} align={'left'}>
        <HeaderCell>Withdraw Account</HeaderCell>
        <Cell dataKey="withdrawAccount" />
      </Column>
      <Column width={180} align={'left'}>
        <HeaderCell>Deposit Account</HeaderCell>
        <Cell dataKey="depositAccount" />
      </Column>
      <Column width={90} align={'left'}>
        <HeaderCell>Amount</HeaderCell>
        <Cell dataKey="amount" />
      </Column>
      <Column width={90} align={'left'}>
        <HeaderCell>Currency</HeaderCell>
        <Cell dataKey="currency" />
      </Column>
      <Column width={180} align={'left'}>
        <HeaderCell>Timestamp</HeaderCell>
        <Cell>
          {(rowdata) => (<p>{timeConverter(rowdata.timestamp)}</p>)}
        </Cell>
      </Column>
      <Column width={90} align={'left'}>
        <HeaderCell>Fraud</HeaderCell>
        <Cell>
          {(rowdata) => (rowdata.fraudulent) ? (<p>True</p>) : (<p>False</p>)}
        </Cell>
      </Column>
    </Table>
  );
};

function timeConverter(timestamp) {
  const a = new Date(timestamp);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const year = a.getFullYear();
  const month = months[a.getMonth()];
  const date = a.getDate();
  const hour = a.getHours();
  const min = a.getMinutes();
  const sec = a.getSeconds();
  const time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
  return time;
}
