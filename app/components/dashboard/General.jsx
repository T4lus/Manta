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
import { getInvoiceValue } from '../../helpers/invoice';

// Components
import Card from './_partials/Card';
import styled from 'styled-components';
import _withFadeInAnimation from '../shared/hoc/_withFadeInAnimation';


const Status = styled.div`
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  ${props => props.status === 'increase' && `color: #6BBB69;`} 
  ${props => props.status === 'decrease' && `color: #EC476E;`} 
  ${props => props.status === 'none' && `color: #4F555C;`} 
  
  span {
    font-size: 11px;
    i {
      margin-right: 5px;
    }
  }
  i.ion-minus {
    font-size: 30px;
    line-height: 30px;
  }
  i.ion-arrow-graph-up-right {
    font-size: 30px;
    line-height: 30px;
  }
  i.ion-arrow-graph-down-right {
    font-size: 30px;
    line-height: 30px;
  }
`;


// Component
class General extends PureComponent {
  constructor(props) {
    super(props);  
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

    const InvoicesStats = {
      year:{
        current:{
          period:moment(firstDayOfYear).format('YYYY'),
          total:paidInvoices.filter(invoice => moment(invoice.paid_at) >= moment(firstDayOfYear) && moment(invoice.paid_at) <= moment(lastDayOfYear)).reduce((n, invoice) => n + (invoice.subtotal - getInvoiceValue(invoice).discount), 0)
        },
        last:{
          period:moment(firstDayOfLastYear).format('YYYY'),
          total:paidInvoices.filter(invoice => moment(invoice.paid_at) >= moment(firstDayOfLastYear) && moment(invoice.paid_at) <= moment(lastDayOfLastYear)).reduce((n, invoice) => n + (invoice.subtotal - getInvoiceValue(invoice).discount), 0)
        }
      },
      month:{
        current:{
          period:MonthAxis[parseInt(moment(firstDayOfMonth).format('M'))-1],
          total:paidInvoices.filter(invoice => moment(invoice.paid_at) >= moment(firstDayOfMonth) && moment(invoice.paid_at) <= moment(lastDayOfMonth)).reduce((n, invoice) => n + (invoice.subtotal - getInvoiceValue(invoice).discount), 0)
        },
        last:{
          period:MonthAxis[parseInt(moment(firstDayOfLastMonth).format('M'))-1],
          total:paidInvoices.filter(invoice => moment(invoice.paid_at) >= moment(firstDayOfLastMonth) && moment(invoice.paid_at) <= moment(lastDayOfLastMonth)).reduce((n, invoice) => n + (invoice.subtotal - getInvoiceValue(invoice).discount), 0)
        }
      }
    };

    const ClientsStats = {
      year:{
        current:{
          period:moment(firstDayOfYear).format('YYYY'),
          total:contacts.filter(contact => moment(contact.created_at) >= moment(firstDayOfYear) && moment(contact.created_at) <= moment(lastDayOfYear)).reduce((n, contact) => n + 1, 0)
        },
        last:{
          period:moment(firstDayOfLastYear).format('YYYY'),
          total:contacts.filter(contact => moment(contact.created_at) >= moment(firstDayOfLastYear) && moment(contact.created_at) <= moment(lastDayOfLastYear)).reduce((n, contact) => n + 1, 0)
        }
      },
      month:{
        current:{
          period:MonthAxis[parseInt(moment(firstDayOfMonth).format('M'))-1],
          total:contacts.filter(contact => moment(contact.created_at) >= moment(firstDayOfMonth) && moment(contact.created_at) <= moment(lastDayOfMonth)).reduce((n, contact) => n + 1, 0)
        },
        last:{
          period:MonthAxis[parseInt(moment(firstDayOfLastMonth).format('M'))-1],
          total:contacts.filter(contact => moment(contact.created_at) >= moment(firstDayOfLastMonth) && moment(contact.created_at) <= moment(lastDayOfLastMonth)).reduce((n, contact) => n + 1, 0)
        }
      }
    };

    return (
      <React.Fragment>
        <div className="row">
          <div className="col-xl-3 col-md-6">
            <Card 
              header="CA Annuel" 
              data={InvoicesStats.year}  
            />
          </div>
          <div className="col-xl-3 col-md-6">
            <Card 
              header="CA Mensuel" 
              data={InvoicesStats.month}  
            />
          </div>
          <div className="col-xl-3 col-md-6">
            <Card 
              header="Nouveau Clients" 
              data={ClientsStats.year}  
            />
          </div>
          <div className="col-xl-3 col-md-6">
            <Card 
              header="Nouveau Clients" 
              data={ClientsStats.month}  
            />
          </div>
        </div>
        <div className="row mt-4">
          
        </div>
      </React.Fragment>
    );
  }
}

// PropTypes
General.propTypes = {
    contacts: PropTypes.arrayOf(PropTypes.object).isRequired,
    invoices: PropTypes.arrayOf(PropTypes.object).isRequired,
    dispatch: PropTypes.func.isRequired,
};

// Map state to props & Export
const mapStateToProps = state => ({
    contacts: getContacts(state),
    invoices: getInvoices(state)
});

export default compose(
    connect(mapStateToProps),
    translate(),
    _withFadeInAnimation
)(General, {});
