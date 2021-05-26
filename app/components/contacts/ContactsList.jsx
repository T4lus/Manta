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
import * as InvoicesActions from '../../actions/invoices';

// Components
import Contact from '../contacts/Contact';
import Message from '../shared/Message';
import Button from '../shared/Button';
import { Table, THead, TBody, TH, TR } from '../shared/Table';
import _withFadeInAnimation from '../shared/hoc/_withFadeInAnimation';
import {
  PageWrapper,
  PageHeader,
  PageHeaderTitle,
  PageHeaderActions,
  PageContent,
} from '../shared/Layout';

// Selectors
import { getContacts } from '../../reducers/ContactsReducer';

// Component
class ContactsList extends PureComponent {
  constructor(props) {
    super(props);
    this.newInvoice = this.newInvoice.bind(this);
    this.deleteContact = this.deleteContact.bind(this);
  }

  componentDidMount() {
    ipc.on('confirmed-delete-contact', (event, index, contactId) => {
      if (index === 0) {
        this.confirmedDeleteContact(contactId);
      }
    });
  }

  componentWillUnmount() {
    ipc.removeAllListeners('confirmed-delete-contact');
  }

  newInvoice(contact) {
    const { dispatch } = this.props;
    dispatch(InvoicesActions.newInvoiceFromContact(contact));
  }

  deleteContact(contactId) {
    const { t } = this.props;
    openDialog(
      {
        type: 'warning',
        title: t('dialog:deleteContact:title'),
        message: t('dialog:deleteContact:message'),
        buttons: [
          t('common:yes'),
          t('common:noThanks')
        ],
      },
      'confirmed-delete-contact',
      contactId
    );
  }

  confirmedDeleteContact(contactId) {
    const { dispatch } = this.props;
    dispatch(ContactsActions.deleteContact(contactId));
  }

  render() {
    const { t, contacts, editContact } = this.props;
    const contactsComponent = contacts.map((contact, index) => (
      <Contact
        key={contact._id}
        contact={contact}
        index={index}
        deleteContact={this.deleteContact}
        editContact={editContact}
        newInvoice={this.newInvoice}
      />
    ));
    return (
      <PageWrapper>
        <PageHeader>
          <PageHeaderTitle>{t('contacts:header')}</PageHeaderTitle>
          <PageHeaderActions>
            <Button primary onClick={editContact}>
              {t('contacts:btns:new')}
            </Button>
          </PageHeaderActions>
        </PageHeader>
        <PageContent>
          {contacts.length === 0 ? (
            <Message info text={t('messages:noContact')} />
          ) : (
            <Table hasBorders bg>
              <THead>
                <TR>
                  <TH>{t('contacts:fields:general:company')}</TH>
                  <TH>{t('contacts:fields:contact:header')}</TH>
                  <TH>{t('contacts:fields:email')}</TH>
                  <TH>{t('contacts:fields:phone')}</TH>
                  <TH actions>{t('contacts:fields:actions')}</TH>
                </TR>
              </THead>
              <TBody>{contactsComponent}</TBody>
            </Table>
          )}
        </PageContent>
      </PageWrapper>
    );
  }
}

// PropTypes
ContactsList.propTypes = {
  contacts: PropTypes.arrayOf(PropTypes.object).isRequired,
  dispatch: PropTypes.func.isRequired,
  editContact: PropTypes.func.isRequired,
};

// Map state to props & Export
const mapStateToProps = state => ({
  contacts: getContacts(state),
});

export default compose(
  connect(mapStateToProps),
  translate(),
  _withFadeInAnimation
)(ContactsList);
