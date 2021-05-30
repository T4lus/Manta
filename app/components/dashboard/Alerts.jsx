// Libs
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
const ipc = require('electron').ipcRenderer;
const moment = require('moment');
import { translate } from 'react-i18next';

// Selectors
import { getContacts } from '../../reducers/ContactsReducer';
import { getInvoices } from '../../reducers/InvoicesReducer';
import { getCurrentSettings } from '../../reducers/SettingsReducer';

// Helper
import { formatNumber } from '../../../helpers/formatNumber';
import { calTermDate } from '../../../helpers/date';

// Components
import AlertAccordion from '../shared/Accordion';
import _withFadeInAnimation from '../shared/hoc/_withFadeInAnimation';

// Component
class Alerts extends PureComponent {
  constructor(props) {
    super(props);  
  }

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

    const draftInvoices = invoices.filter(invoice => invoice.status === 'draft');
    const pendingInvoices = invoices.filter(invoice => invoice.status === 'pending');
    const paidInvoices = invoices.filter(invoice => invoice.status === 'paid');
    const refundedInvoices = invoices.filter(invoice => invoice.status === 'refunded');
    const cancelledInvoices = invoices.filter(invoice => invoice.status === 'cancelled');

    const invoicesOverDue = pendingInvoices.filter(invoice => moment(Date.now()) > this.calcDueDate(invoice)).map((invoice, index) => (
      <span>
        Invoice <a href="#" onClick={() => this.viewInvoice(invoice)} className="alert-link">#{invoice.invoiceID}</a> is overdue ({this.calcDueDate(invoice).format('DD/MM/YYYY')}).<br />
      </span>  
    ));

    const invoicesNearOverDue = pendingInvoices.filter(invoice => moment(Date.now() + ( 3600 * 1000 * 24 * 3)) > this.calcDueDate(invoice)).map((invoice, index) => (
      <span>
        Invoice <a href="#" onClick={() => this.viewInvoice(invoice)} className="alert-link">#{invoice.invoiceID}</a> is near due date ({this.calcDueDate(invoice).format('DD/MM/YYYY')}).<br />
      </span>
    ));

    return (
      <React.Fragment>
        {invoicesOverDue.length > 0 &&
          <AlertAccordion 
            className="alert alert-danger" 
            title="Some Invoice is overdue" 
            content={invoicesOverDue}
          />
        }
        {invoicesNearOverDue.length > 0 &&
          <AlertAccordion 
            className="alert alert-warning" 
            title="Some Invoice is near due date" 
            content={invoicesNearOverDue}
          />
        }
      </React.Fragment>
    );
  }
}

// PropTypes
Alerts.propTypes = {
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
)(Alerts, {});
