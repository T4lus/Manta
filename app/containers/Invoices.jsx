// Libs
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
const openDialog = require('../renderers/dialog.js');
const ipc = require('electron').ipcRenderer;
import { translate } from 'react-i18next';

// Actions
import * as Actions from '../actions/invoices';

// Selectors
import { getInvoices } from '../reducers/InvoicesReducer';
import { getDateFormat } from '../reducers/SettingsReducer';

// Components
import Invoice from '../components/invoices/Invoice';
import Message from '../components/shared/Message';
import Button, { ButtonsGroup } from '../components/shared/Button';
import _withFadeInAnimation from '../components/shared/hoc/_withFadeInAnimation';
import {
  PageWrapper,
  PageHeader,
  PageHeaderTitle,
  PageHeaderActions,
  PageContent,
} from '../components/shared/Layout';

import styled from 'styled-components';

const OrderSelect = styled.select`
  height:100%;
  display: inline-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 4px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  padding: 4px 15px;
  font-size: 12px;
  background: #ffffff;
  border: 1px solid #e0e1e1;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const OrderButton = styled.button`
  display: inline-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 4px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  margin-right: -1px;
  font-size: 12px;
  text-decoration: none;
  background: #ffffff;
  border: 1px solid #e0e1e1;
  text-transform: uppercase;
  letter-spacing: 1px;
  white-space: nowrap;
  // Block Level Button
  ${props => props.block && `width: 100%;`}
  // Color
  ${props => props.primary &&  `
    background: #469fe5;
    color: white;
  `}
  ${props => props.success && `
    background: #6bbb69;
    color: white;
  `}
  ${props => props.danger && `
    background: #EC476E;
    color: white;
  `}
  // Active state
  ${props => props.active && `
    background: #F2F3F4;
    color: #4F555C;
  `}
  // Hover
  &:hover {
    cursor: pointer;
    text-decoration: none;
    // color: white;
  }
  > i {
    margin: 0!important;
    font-size: 16px;
  }
`;

export class Invoices extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { filter: null, order:{direction:false, by:'invoiceID'} };
    this.editInvoice = this.editInvoice.bind(this);
    this.deleteInvoice = this.deleteInvoice.bind(this);
    this.duplicateInvoice = this.duplicateInvoice.bind(this);
    this.setInvoiceStatus = this.setInvoiceStatus.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.setOrder = this.setOrder.bind(this);
    this.orderInvoice = this.orderInvoice.bind(this);
  }

  // Load Invoices & add event listeners
  componentDidMount() {
    // Add Event Listener
    ipc.on('confirmed-delete-invoice', (event, index, invoiceId) => {
      if (index === 0) {
        this.confirmedDeleteInvoice(invoiceId);
      }
    });
  }

  // Remove all IPC listeners when unmounted
  componentWillUnmount() {
    ipc.removeAllListeners('confirmed-delete-invoice');
  }

  // Open Confirm Dialog
  deleteInvoice(invoiceId) {
    const { t } = this.props;
    openDialog(
      {
        type: 'warning',
        title: t('dialog:deleteInvoice:title'),
        message: t('dialog:deleteInvoice:message'),
        buttons: [
          t('common:yes'),
          t('common:noThanks')
        ],
      },
      'confirmed-delete-invoice',
      invoiceId
    );
  }

  // Confirm Delete an invoice
  confirmedDeleteInvoice(invoiceId) {
    const { dispatch } = this.props;
    dispatch(Actions.deleteInvoice(invoiceId));
  }

  // set the invoice status
  setInvoiceStatus(invoiceId, status) {
    const { dispatch } = this.props;
    dispatch(Actions.setInvoiceStatus(invoiceId, status));
  }

  editInvoice(invoice) {
    const { dispatch } = this.props;
    dispatch(Actions.editInvoice(invoice));
  }

  duplicateInvoice(invoice) {
    const { dispatch } = this.props;
    dispatch(Actions.duplicateInvoice(invoice));
  }

  setFilter(event) {
    const currentFilter = this.state.filter;
    const newFilter = event.target.dataset.filter;
    this.setState({ filter: currentFilter === newFilter ? null : newFilter });
  }

  setOrder(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    
    if (name === 'by')
      this.setState({ order: {...this.state.order, by: value }});
    else
      this.setState({ order: {...this.state.order, direction: !this.state.order.direction }});

    console.log(this.state.order);
  }

  orderInvoice(invoiceA, invoiceB) {
    let a = invoiceA[this.state.order.by];
    let b = invoiceB[this.state.order.by];



    return this.state.order.direction ? parseInt(a) - parseInt(b) : parseInt(b) - parseInt(a);
  }

  // Render
  render() {
    const { dateFormat, invoices, t } = this.props;
    const { filter, order } = this.state;
    const filteredInvoices = filter ? invoices.filter(invoice => invoice.status === filter) : invoices
    const invoicesComponent = filteredInvoices.sort(this.orderInvoice).map((invoice, index) => (
      <Invoice
        key={invoice._id}
        dateFormat={dateFormat}
        deleteInvoice={this.deleteInvoice}
        duplicateInvoice={this.duplicateInvoice}
        editInvoice={this.editInvoice}
        setInvoiceStatus={this.setInvoiceStatus}
        index={index}
        invoice={invoice}
        t={t}
      />
    ));
    // Filter Buttons
    const statuses = ['draft', 'pending', 'paid', 'refunded', 'cancelled'];
    const orders = ['invoiceID', 'created_at', 'dueDate', 'grandTotal'];

    const filterButtons = statuses.map(status => (
      <Button
        key={`${status}-button`}
        active={filter === status}
        data-filter={status}
        onClick={this.setFilter}
      >
        { t(`invoices:status:${status}`) }
      </Button>
    ));

    const ordersOptions = orders.map(order => (
      <option value={order}>
        { t(`invoices:order:${order}`) }
      </option>
    ));

    return (
      <PageWrapper>
        <PageHeader>
          <PageHeaderTitle>{t('invoices:header:name')}</PageHeaderTitle>
          <PageHeaderActions>
            <i className="ion-funnel" />
            <ButtonsGroup>{ filterButtons }</ButtonsGroup>
            <OrderButton name="direction" value={!order.direction} onClick={this.setOrder}>
              {order.direction ? <i className="ion-arrow-down-c" /> : <i className="ion-arrow-up-c" />}
            </OrderButton>
            <OrderSelect name="by" onChange={this.setOrder}>
              {ordersOptions}
            </OrderSelect>
          </PageHeaderActions>
        </PageHeader>
        <PageContent bare>
          {invoices.length === 0 ? (
            <Message info text={t('messages:noInvoice')} />
          ) : (
            <div className="row">
              {invoicesComponent}
            </div>
          )}
        </PageContent>
      </PageWrapper>
    );
  }
}

// PropTypes Validation
Invoices.propTypes = {
  dispatch: PropTypes.func.isRequired,
  invoices: PropTypes.arrayOf(PropTypes.object).isRequired,
  t: PropTypes.func.isRequired,
};

// Map state to props & Export
const mapStateToProps = state => ({
  invoices: getInvoices(state),
  dateFormat: getDateFormat(state),
});

export default compose(
  connect(mapStateToProps),
  translate(),
  _withFadeInAnimation
)(Invoices);
