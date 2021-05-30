// Libs
import React, { PureComponent, useState } from 'react';
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
import { getDateFormat } from '../../reducers/SettingsReducer';

// Helper
import { formatNumber } from '../../../helpers/formatNumber';
import { calTermDate } from '../../../helpers/date';

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
import { Number } from 'globalthis/implementation';

const FlexRadialChart = makeVisFlexible(RadialChart)
const FlexibleXYPlot = makeVisFlexible(XYPlot);

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
class Invoices extends PureComponent {
  constructor(props) {
    super(props);  
  }

  InvoicesLegends = [
    {title: 'Draft', color: "#ffc107", strokeWidth: 6},
    {title: 'Pending', color: '#469FE5', strokeWidth: 6},
    {title: 'Paid', color: '#6BBB69', strokeWidth: 6},
    {title: 'Refunded', color: '#EC476E', strokeWidth: 6},
    {title: 'Cancelled', color: '#4F555C', strokeWidth: 6}
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

    console.log(pendingInvoices.map((invoice, index) => ({x:parseInt(this.calcDueDate(invoice).format('M')), y:invoice.subtotal})).sort(( a , b ) => parseInt(a.x) - parseInt(b.x)));

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
      <span>
        Invoice <a href="#" onClick={() => this.viewInvoice(invoice)} className="alert-link">#{invoice.invoiceID}</a> is overdue ({this.calcDueDate(invoice).format('DD/MM/YYYY')}).
      </span>  
    ));

    const invoicesNearOverDue = invoices.filter(invoice => invoice.status === 'pending' && moment(Date.now() + ( 3600 * 1000 * 24 * 3)) > this.calcDueDate(invoice)).map((invoice, index) => (
      <span>
        Invoice <a href="#" onClick={() => this.viewInvoice(invoice)} className="alert-link">#{invoice.invoiceID}</a> is near due date ({this.calcDueDate(invoice).format('DD/MM/YYYY')}).
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

          <div className="row">
            <div className="col-xl-3 col-md-6 d-flex">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    {paidInvoices.filter(invoice => moment(invoice.paid_at) >= moment(firstDayOfYear) && moment(invoice.paid_at) <= moment(lastDayOfYear)).reduce((n, {subtotal}) => n + subtotal, 0)}
                  </h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                  {paidInvoices.filter(invoice => moment(invoice.paid_at) >= moment(firstDayOfLastYear) && moment(invoice.paid_at) <= moment(lastDayOfLastYear)).reduce((n, {subtotal}) => n + subtotal, 0)}
                  </h6>
                  <p className="card-text">
                    
                  </p>
                </div>
              </div>

            </div>
            <div className="col-xl-3 col-md-6 d-flex">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    {paidInvoices.filter(invoice => moment(invoice.paid_at) >= moment(firstDayOfMonth) && moment(invoice.paid_at) <= moment(lastDayOfMonth)).reduce((n, {subtotal}) => n + subtotal, 0)}
                  </h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                  {paidInvoices.filter(invoice => moment(invoice.paid_at) >= moment(firstDayOfLastMonth) && moment(invoice.paid_at) <= moment(lastDayOfLastMonth)).reduce((n, {subtotal}) => n + subtotal, 0)}
                  </h6>
                  <p className="card-text">
                    
                  </p>
                </div>
              </div>

            </div>
          </div>

        <Wrapper>
          <div className="row">
            <div className="col-xl-3 col-md-6 d-flex">
              <FlexRadialChart
                colorType="literal"
                data={myData}
                height={300}
              />
            </div>
            <div className="col-xl-6 col-md-6 d-flex">
            <FlexibleXYPlot colorType="literal" margin={{left: 50}} xType="ordinal" height={300} stackBy="y">
              <DiscreteColorLegend
                style={{position: 'absolute', left: '50px', top: '10px'}}
                orientation="horizontal"
                items={this.InvoicesLegends}
              />
              <VerticalGridLines />
              <HorizontalGridLines />
              <XAxis tickFormat={v => MonthAxis[v-1]} />
              <YAxis tickFormat={tick => numeral(tick).format('0.0a')}/>
              <VerticalBarSeries label='Draft Invoices' color='#ffc107' data={draftInvoices.map((invoice, index) => ({x:parseInt(moment(invoice.created_at).format('M')), y:invoice.subtotal})).sort(( a , b ) => parseInt(a.x) - parseInt(b.x))} />
              <VerticalBarSeries label='Pending Invoices' color='#469FE5' data={pendingInvoices.map((invoice, index) => ({x:parseInt(this.calcDueDate(invoice).format('M')), y:invoice.subtotal})).sort(( a , b ) => parseInt(a.x) - parseInt(b.x))} />
              <VerticalBarSeries label='Paid Invoices' color='#6BBB69' data={paidInvoices.map((invoice, index) => ({x:parseInt(moment(invoice.paid_at).format('M')), y:invoice.subtotal})).sort(( a , b ) => parseInt(a.x) - parseInt(b.x))} />
              <VerticalBarSeries label='Refunded Invoices' color='#EC476E' data={refundedInvoices.map((invoice, index) => ({x:parseInt(moment(invoice.refunded_at).format('M')), y:invoice.subtotal})).sort(( a , b ) => parseInt(a.x) - parseInt(b.x))} />
              <VerticalBarSeries label='Cancelled Invoices' color='#4F555C' data={cancelledInvoices.map((invoice, index) => ({x:parseInt(moment(invoice.cancelled_at).format('M')), y:invoice.subtotal})).sort(( a , b ) => parseInt(a.x) - parseInt(b.x))} />
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
)(Invoices);
