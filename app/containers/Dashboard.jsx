// Libs
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
const openDialog = require('../renderers/dialog.js');
const ipc = require('electron').ipcRenderer;
import { translate } from 'react-i18next';

// Actions
import * as ContactsActions from '../actions/contacts';
import * as InvoicesActions from '../actions/invoices';

// Components
import Contact from '../components/contacts/Contact';
import Message from '../components/shared/Message';
import { Table, THead, TBody, TH, TR } from '../components/shared/Table';
import _withFadeInAnimation from '../components/shared/hoc/_withFadeInAnimation';
import {
  PageWrapper,
  PageHeader,
  PageHeaderTitle,
  PageContent,
} from '../components/shared/Layout';

// Selectors
import { getContacts } from '../reducers/ContactsReducer';

// Component
class Dashboard extends PureComponent {
  constructor(props) {
    super(props);
    
  }


  render() {
    const { t } = this.props;

    return (
      <PageWrapper>
        <PageHeader>
          <PageHeaderTitle>{t('dashboard:header')}</PageHeaderTitle>
        </PageHeader>
        <PageContent>
          
        </PageContent>
      </PageWrapper>
    );
  }
}

// PropTypes
Dashboard.propTypes = {
  contacts: PropTypes.arrayOf(PropTypes.object).isRequired,
  dispatch: PropTypes.func.isRequired,
};

// Map state to props & Export
const mapStateToProps = state => ({
  contacts: getContacts(state),
});

export default compose(
  connect(mapStateToProps),
  translate(),
  _withFadeInAnimation
)(Dashboard);
