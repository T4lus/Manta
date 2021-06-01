// Libs
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Custom Components
import { TR, TD } from '../shared/Table';
import Button from '../shared/Button';

// Component
class Contact extends PureComponent {
  constructor(props) {
    super(props);
    this.deleteContact = this.deleteContact.bind(this);
    this.editContact = this.editContact.bind(this);
    this.newInvoice = this.newInvoice.bind(this);
  }

  newInvoice() {
    const { newInvoice, contact } = this.props;
    newInvoice(contact);
  }

  deleteContact() {
    const { contact, deleteContact } = this.props;
    deleteContact(contact._id);
  }

  editContact() {
    const { contact, editContact } = this.props;
    editContact(contact);
  }

  render() {
    const { contact } = this.props;
    return (
      <TR>
        <TD bold>{contact.company}</TD>
        <TD>{contact.fullname}</TD>
        <TD>{contact.email}</TD>
        <TD>{contact.phone}</TD>
        <TD actions>
        <Button link primary onClick={this.editContact}>
            <i className="ion-edit" />
          </Button>
          <Button link primary onClick={this.newInvoice}>
            <i className="ion-plus-round" />
          </Button>
          <Button link danger onClick={this.deleteContact}>
            <i className="ion-close-circled" />
          </Button>
        </TD>
      </TR>
    );
  }
}

Contact.propTypes = {
  contact: PropTypes.object.isRequired,
  deleteContact: PropTypes.func.isRequired,
  editContact: PropTypes.func.isRequired,
  newInvoice: PropTypes.func.isRequired,
};

export default Contact;
