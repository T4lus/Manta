// Libs
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import styled from 'styled-components';
const ipc = require('electron').ipcRenderer;
const moment = require('moment');
import { translate } from 'react-i18next';

// Selectors
import { getContacts } from '../../reducers/ContactsReducer';
import { getInvoices } from '../../reducers/InvoicesReducer';
import { getDateFormat } from '../../reducers/SettingsReducer';

// Helper
import { formatNumber } from '../../../helpers/formatNumber';
import { calTermDate } from '../../../helpers/date';

// Components
import { DiscreteColorLegend, RadialChart } from 'react-vis';
import { Row, Field } from '../shared/Part';
import { Table, THead, TBody, TH, TR } from '../shared/Table';
import { Section } from '../shared/Section';
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
    margin-bottom: 30px;
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

// Component
class Invoices extends PureComponent {
    constructor(props) {
        super(props);  
    }

    InvoicesLegends = [
        {title: 'Draft', color: "#ffc107", strokeWidth: 6},
        {title: 'Pending', color: '#469FE5', strokeWidth: 6},
        {title: 'Paid', color: '#6BBB69', strokeWidth: 6},
        {title: 'Refunded', color: '#4F555C', strokeWidth: 6},
        {title: 'Cancelled', color: '#EC476E', strokeWidth: 6}
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

    const draftInvoices = invoices.filter(invoice => invoice.status === 'draft');
    const pendingInvoices = invoices.filter(invoice => invoice.status === 'pending');
    const paidInvoices = invoices.filter(invoice => invoice.status === 'paid');
    const refundedInvoices = invoices.filter(invoice => invoice.status === 'refunded');
    const cancelledInvoices = invoices.filter(invoice => invoice.status === 'cancelled');

    const myData = [ 
        {
            label: 'Draft Invoices',
            color: '#ffc107',
            radius: draftInvoices.length, 
            angle: draftInvoices.reduce((n, {subtotal}) => n + subtotal, 0)
        }, 
        {
            label: 'Pending Invoices',
            color: '#469FE5',
            radius: pendingInvoices.length, 
            angle: pendingInvoices.reduce((n, {subtotal}) => n + subtotal, 0)
        }, 
        {
            label: 'Paid Invoices',
            color: '#6BBB69',
            radius: paidInvoices.length, 
            angle: paidInvoices.reduce((n, {subtotal}) => n + subtotal, 0)
        }, 
        {
            label: 'Refunded Invoices',
            color: '#4F555C',
            radius: refundedInvoices.length, 
            angle: refundedInvoices.reduce((n, {subtotal}) => n + subtotal, 0)
        },
        {
            label: 'Cancelled Invoices',
            color: '#EC476E',
            radius: cancelledInvoices.length, 
            angle: cancelledInvoices.reduce((n, {subtotal}) => n + subtotal, 0)
        } 
    ];

    const invoicesOverDue = invoices.filter(invoice => invoice.status === 'pending' && moment(Date.now()) > this.calcDueDate(invoice)).map((invoice, index) => (
        <div className="alert alert-danger" role="alert">
            Invoice <a href="#" onClick={() => this.viewInvoice(invoice)} className="alert-link">#{invoice.invoiceID}</a> is overdue ({this.calcDueDate(invoice).format('DD/MM/YYYY')}).
        </div>
    ));

    const invoicesNearOverDue = invoices.filter(invoice => invoice.status === 'pending' && moment(Date.now() + ( 3600 * 1000 * 24 * 3)) > this.calcDueDate(invoice)).map((invoice, index) => (
        <div className="alert alert-warning" role="alert">
            Invoice <a href="#" onClick={() => this.viewInvoice(invoice)} className="alert-link">#{invoice.invoiceID}</a> is near due date ({this.calcDueDate(invoice).format('DD/MM/YYYY')}).
        </div>
    ));

    return (
        <React.Fragment>
            {invoicesOverDue}
            {invoicesNearOverDue}

            <Wrapper>
                <div className="row">
                    <div className="col-xl-3 col-md-6">
                        <RadialChart
                        colorType="literal"
                        data={myData}
                        width={300}
                        height={300} 
                        />
                    </div>
                    <div className="col-xl-3 col-md-6">
                        <RadialChart
                        colorType="literal"
                        data={myData}
                        width={300}
                        height={300} 
                        />
                    </div>
                    <div className="col-xl-3 col-md-6">
                        <RadialChart
                        colorType="literal"
                        data={myData}
                        width={300}
                        height={300} 
                        />
                    </div>
                    <div className="col-xl-3 col-md-6">
                        <RadialChart
                        colorType="literal"
                        data={myData}
                        width={300}
                        height={300} 
                        />
                    </div>
                </div>
            </Wrapper>
            
        </React.Fragment>
    );
  }
}

// PropTypes
Invoices.propTypes = {
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
)(Invoices);
