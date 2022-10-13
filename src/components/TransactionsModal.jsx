import React from 'react';
import {Panel, Icon, Alert, Button, Message, IconButton, Modal, Loader} from 'rsuite';
export default class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: this.props.show,
      user: this.props.user,
      loading: true,
      transactionLoading: false,
      rows: 0,
      transactions: [],
      transactionsData: [],
    };
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
  }
  close() {
    this.setState({
      show: false,
      transactionsData: [],
    });
  }
  open() {
    this.setState({show: true});
  }

  componentDidUpdate(prevProps) {
    if (prevProps.show !== this.props.show) {
      this.setState({
        show: this.props.show,
        user: this.props.user,
        loading: true,
      });
      if (this.props.show) this._fetchTransactionData(this.props.user.id);
      // Check if it's being opened
    }
  }

  handleRepeat(transactionID) {
    this.setState({transactionLoading: true});
    fetch('/bank/transaction_repeat', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/text',
        'Access-Control-Allow-Credentials': true,
      },
      body: transactionID,
    }).then((response) => {
      if (response.status === 200) {
        Alert.success('Transaction repeat succeeded');
        this._fetchTransactionData(this.props.user.id, false);
      } else {
        Alert.error('Failed to repeat tranaction');
      }
      this.setState({transactionLoading: false});
    })
        .catch((error) => {
          this.setState({
            success: false,
            transactionLoading: false,
          });
          console.log(error);
          Alert.error('Failed to fetch from API');
        });
  }


  handleReverse(transactionID) {
    this.setState({transactionLoading: true});
    fetch('/bank/transaction_reverse', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/text',
        'Access-Control-Allow-Credentials': true,
      },
      body: transactionID,
    }).then((response) => {
      if (response.status === 200) {
        Alert.success('Transaction repeat succeeded');
        this._fetchTransactionData(this.props.user.id, false);
      } else {
        Alert.error('Failed to reverse tranaction');
      }
      this.setState({transactionLoading: false});
    })
        .catch((error) => {
          this.setState({
            success: false,
            transactionLoading: false,
          });
          console.log(error);
          Alert.error('Failed to fetch from API');
        });
  }

  _fetchTransactionData(id, loadingState) {
    console.log(this.state.user);
    this.setState({loading: loadingState});
    fetch('/bank/transactions_search?accountId=' + id, {
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
            transactionsData: responseJSON,
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
    const {show} = this.state;

    const transactions = this.state.transactionsData.map((w, i) => {
      w.revoked = false;
      return (<li index={i} key={i}>
        <Panel bordered>
          { (w.fraudulent) && (
            <Message
              showIcon
              style={{marginBottom: 10}}
              type="warning"
              description="Fraudulent Transaction"
            />
          )}
          <p className="deposited">Deposited into</p> <p>{w.depositAccount}</p>
          <p className="withdrawn">Withdrawn from</p> <p>{w.withdrawAccount}</p>
          <p>Amount: {w.currency} {w.amount}</p>
          <p>On {timeConverter(w.timestamp)}</p>
          <p>Transaction ID:</p> <p>{w.id}</p>
          <div className="transaction-btns">
            <IconButton className="revoke-button" onClick={() => this.handleReverse(w.id)}>
              <Icon icon='ban'></Icon>
                Revoke Transaction
            </IconButton>
            <IconButton className="revoke-button" onClick={() => this.handleRepeat(w.id)}>
              <Icon icon='undo'></Icon>
                Repeat Transaction
            </IconButton>
          </div>
        </Panel>
      </li>
      );
    });

    return (
      <div className="modal-container">
        <Modal size="md" show={show} onHide={this.props.close} onExited={this.props.close}>
          <Modal.Header>
            <Modal.Title>{this.state.user.name}{'\'s Transactions'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {!this.state.loading ? (
                <ul className="transaction-list">{transactions}</ul>
              ) : (
                <div style={{textAlign: 'center'}}>
                  <Loader size="md" />
                </div>
              )}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.close} appearance="primary">
                Ok
            </Button>
            <Button onClick={this.props.close} appearance="subtle">
                Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

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
