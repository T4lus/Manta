// Libs
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { truncate } from 'lodash';
import styled from 'styled-components';
const ipc = require('electron').ipcRenderer;
const moment = require('moment');
const numeral = require('numeral');
import { translate } from 'react-i18next';

// Selectors
import { getContacts } from '../../reducers/ContactsReducer';
import { getInvoices } from '../../reducers/InvoicesReducer';
import { getCurrentSettings } from '../../reducers/SettingsReducer';

// Helper
import { formatNumber } from '../../../helpers/formatNumber';
import { calTermDate } from '../../../helpers/date';
import { getInvoiceValue } from '../../helpers/invoice';

// Components
import { Row, Field } from '../shared/Part';
import { Table, THead, TBody, TH, TR } from '../shared/Table';
import { Section } from '../shared/Section';
import AlertAccordion from '../shared/Accordion';
import _withFadeInAnimation from '../shared/hoc/_withFadeInAnimation';
import {
  PageWrapper,
  PageHeader,
  PageHeaderTitle,
  PageContent,
} from '../shared/Layout';

const Wrapper = styled.div`
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: white;
  margin-top: 30px;
  margin-bottom: 30px;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

// Component
class Quotes extends PureComponent {
  constructor(props) {
    super(props);  
  }

  InvoicesLegends = [
    {title: 'Draft', color: "#ffc107", strokeWidth: 10},
    {title: 'Pending', color: '#469FE5', strokeWidth: 10},
    {title: 'Paid', color: '#6BBB69', strokeWidth: 10},
    {title: 'Refunded', color: '#EC476E', strokeWidth: 10},
    {title: 'Cancelled', color: '#4F555C', strokeWidth: 10}
  ];

  calcDueDate(invoice) {
    const { dueDate, configs } = invoice;
    const { useCustom, paymentTerm, selectedDate } = dueDate;
    const dateFormat = configs ? configs.dateFormat : this.props.dateFormat;
    // If it's a custom date then return selectedDate
    if (useCustom === true) {
        return  moment(selectedDate);
    }
    // If it's a payment term, calculate the term date and print out
    const paymentTermDate = calTermDate(invoice.created_at, paymentTerm);
    return moment(paymentTermDate);
  }

  viewInvoice(invoice) {
    ipc.send('preview-invoice', invoice);
  }

  render() {
    const { t, invoices, contacts} = this.props;

    const firstDayOfYear = new Date(new Date().getFullYear(), 0, 1);
    const lastDayOfYear = new Date(new Date().getFullYear(), 11, 31);
    const firstDayOfLastYear = new Date(new Date().getFullYear()-1, 0, 1);
    const lastDayOfLastYear = new Date(new Date().getFullYear()-1, 11, 31);

    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const lastDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth()+1, 0);
    const firstDayOfLastMonth = new Date(new Date().getFullYear(), new Date().getMonth()-1, 1);
    const lastDayOfLastMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 0);

    const MonthAxis = [
      t('common:months:january'), t('common:months:february'), t('common:months:march'), 
      t('common:months:april'), t('common:months:may'), t('common:months:june'), 
      t('common:months:july'), t('common:months:august'), t('common:months:september'), 
      t('common:months:october'), t('common:months:november'), t('common:months:december')
    ]

    const draftInvoices = invoices.filter(invoice => invoice.status === 'draft');
    const pendingInvoices = invoices.filter(invoice => invoice.status === 'pending');
    const paidInvoices = invoices.filter(invoice => invoice.status === 'paid');
    const refundedInvoices = invoices.filter(invoice => invoice.status === 'refunded');
    const cancelledInvoices = invoices.filter(invoice => invoice.status === 'cancelled');

    const quotes = draftInvoices.map((invoice, index) => (
        <tr>
          <th scope="row"><a href="#" onClick={() => this.viewInvoice(invoice)} className="alert-link">#{truncate(invoice._id, {length: 8, omission: ''})}</a></th>
          <td>{invoice.recipient.company}</td>
          <td>{invoice.subtotal}</td>
        </tr>
    ));

    return (
      <React.Fragment>
        <Wrapper>
          <div className="row">
            <div className="col-xl-6 col-md-6">
              <table className="table">
                <thead>
                  <tr>
                  <th scope="col">#</th>
                  <th scope="col">Clients</th>
                  <th scope="col">Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {quotes}
                </tbody>
              </table>
            </div>
            <div className="col-xl-6 col-md-6">

            </div>
          </div>
        </Wrapper>
          
      </React.Fragment>
    );
  }
}

// PropTypes
Quotes.propTypes = {
    contacts: PropTypes.arrayOf(PropTypes.object).isRequired,
    invoices: PropTypes.arrayOf(PropTypes.object).isRequired,
    dispatch: PropTypes.func.isRequired,
};

// Map state to props & Export
const mapStateToProps = state => ({
    contacts: getContacts(state),
    invoices: getInvoices(state),
});

export default compose(
    connect(mapStateToProps),
    translate(),
    _withFadeInAnimation
)(Quotes, {});
