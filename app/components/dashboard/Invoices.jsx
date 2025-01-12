// Libs
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
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
import { DiscreteColorLegend, makeVisFlexible, RadialChart } from 'react-vis';
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  VerticalBarSeries,
}  from 'react-vis';
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

const FlexRadialChart = makeVisFlexible(RadialChart)
const FlexibleXYPlot = makeVisFlexible(XYPlot);

const Wrapper = styled.div`
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: white;
  margin-top: 10px;
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

    return (
      <React.Fragment>
        <Wrapper>
          <div className="row">
            <div className="col-xl-6 col-md-6">
              <FlexibleXYPlot colorType="literal" margin={{left: 60, top:50}} xType="ordinal" height={300} stackBy="y">
                <DiscreteColorLegend
                  style={{position: 'absolute', left: '50px', top: '0px'}}
                  orientation="horizontal"
                  items={this.InvoicesLegends}
                />
                <VerticalGridLines />
                <HorizontalGridLines />
                <XAxis tickFormat={v => MonthAxis[v-1]} />
                <YAxis tickFormat={tick => numeral(tick).format('0.0a')}/>
                <VerticalBarSeries label='Draft Invoices' color='#ffc107' data={draftInvoices.map((invoice, index) => ({x:parseInt(moment(invoice.created_at).format('M')), y:(invoice.subtotal - getInvoiceValue(invoice).discount)})).sort(( a , b ) => parseInt(a.x) - parseInt(b.x))} />
                <VerticalBarSeries label='Pending Invoices' color='#469FE5' data={pendingInvoices.map((invoice, index) => ({x:parseInt(this.calcDueDate(invoice).format('M')), y:(invoice.subtotal - getInvoiceValue(invoice).discount)})).sort(( a , b ) => parseInt(a.x) - parseInt(b.x))} />
                <VerticalBarSeries label='Paid Invoices' color='#6BBB69' data={paidInvoices.map((invoice, index) => ({x:parseInt(moment(invoice.paid_at).format('M')), y:(invoice.subtotal - getInvoiceValue(invoice).discount)})).sort(( a , b ) => parseInt(a.x) - parseInt(b.x))} />
                <VerticalBarSeries label='Refunded Invoices' color='#EC476E' data={refundedInvoices.map((invoice, index) => ({x:parseInt(moment(invoice.refunded_at).format('M')), y:(invoice.subtotal - getInvoiceValue(invoice).discount)})).sort(( a , b ) => parseInt(a.x) - parseInt(b.x))} />
                <VerticalBarSeries label='Cancelled Invoices' color='#4F555C' data={cancelledInvoices.map((invoice, index) => ({x:parseInt(moment(invoice.cancelled_at).format('M')), y:(invoice.subtotal - getInvoiceValue(invoice).discount)})).sort(( a , b ) => parseInt(a.x) - parseInt(b.x))} />
              </FlexibleXYPlot>
              
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
)(Invoices, {});
