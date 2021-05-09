// Libs
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
const openDialog = require('../../renderers/dialog.js');
const ipc = require('electron').ipcRenderer;
import { translate } from 'react-i18next';

// Actions
import * as ContactsActions from '../../actions/contacts';

// Components
import Button from '../shared/Button';
import _withFadeInAnimation from '../shared/hoc/_withFadeInAnimation';
import {
  PageWrapper,
  PageHeader,
  PageHeaderTitle,
  PageHeaderActions,
  PageContent,
} from '../shared/Layout';

// Selectors
import { getContact } from '../../reducers/ContactReducer';

// Component
class ContactEdit extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  saveFormData() {

  }

  render() {
    // Form Value
    const { settings } = this.props.currentContact;
    const { editMode } = settings;
    // Translation
    const { t } = this.props;
    
    console.log(this.props.currentContact);

    return (
      <PageWrapper>
        <PageHeader>
          <PageHeaderTitle>{editMode ? t('contacts:header_edit') : t('contacts:header_add')}</PageHeaderTitle>
          <PageHeaderActions>
            <Button danger>
              {t('common:btns:cancel')}
            </Button>
            <Button
              primary={editMode}
              success={editMode === false}
            >
              {editMode
                ? t('common:btns:update')
                : t('common:btns:save')}
            </Button>
          </PageHeaderActions>
        </PageHeader>
        <PageContent>
          
        </PageContent>
      </PageWrapper>
    );
  }
}

// PropTypes
ContactEdit.propTypes = {
  dispatch: PropTypes.func.isRequired,
  currentContact: PropTypes.shape({
    settings: PropTypes.object.isRequired,
  }).isRequired,
};

// Map state to props & Export
const mapStateToProps = state => ({
    currentContact: getContact(state),
});

export default compose(
  connect(mapStateToProps),
  translate(),
  _withFadeInAnimation
)(ContactEdit);
