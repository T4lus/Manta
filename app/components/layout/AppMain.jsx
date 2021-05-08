// Libraries
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Custom Components
import Dashboard from '../../containers/Dashboard';
import Form from '../../containers/Form';
import Invoices from '../../containers/Invoices';
import Contacts from '../../containers/Contacts';
import Settings from '../../containers/Settings';

// Layout
import { AppMainContent } from '../shared/Layout';

class AppMain extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.activeTab !== nextProps.activeTab;
  }

  render() {
    const { activeTab } = this.props;
    return (
      <AppMainContent>
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'form' && <Form />}
        {activeTab === 'invoices' && <Invoices />}
        {activeTab === 'contacts' && <Contacts />}
        {activeTab === 'settings' && <Settings />}
      </AppMainContent>
    );
  }
}

AppMain.propTypes = {
  activeTab: PropTypes.string.isRequired,
};

export default AppMain;
