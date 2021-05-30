// Libs
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
const openDialog = require('../renderers/dialog.js');
import styled from 'styled-components';
const ipc = require('electron').ipcRenderer;
import { translate } from 'react-i18next';


// Components
import Alerts from '../components/dashboard/Alerts'
import General from '../components/dashboard/General'
import Invoices from '../components/dashboard/Invoices'
import Quotes from '../components/dashboard/Quotes'

import _withFadeInAnimation from '../components/shared/hoc/_withFadeInAnimation';
import {
  PageWrapper,
  PageHeader,
  PageHeaderTitle,
  PageContent,
} from '../components/shared/Layout';

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
        <PageContent bare>
          <Alerts />
          <General />
          <Invoices />
          <Quotes />
        </PageContent>
      </PageWrapper>
    );
  }
}

// PropTypes
Dashboard.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

// Map state to props & Export
const mapStateToProps = state => ({

});

export default compose(
  connect(mapStateToProps),
  translate(),
  _withFadeInAnimation
)(Dashboard);
