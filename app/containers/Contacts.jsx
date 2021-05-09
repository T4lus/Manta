// Libs
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
const ipc = require('electron').ipcRenderer;

// Components
import ContactsList from '../components/contacts/ContactsList'
import ContactEdit from '../components/contacts/ContactEdit'

import _withFadeInAnimation from '../components/shared/hoc/_withFadeInAnimation';


// Component
class Contacts extends PureComponent {

  constructor(props) {
    super(props);
    this.editContact = this.editContact.bind(this);

    this.state = { edit : false };
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    
  }

  editContact(contactId) {  
    this.setState({ edit : true });
  }

  render() {
    return (
      <React.Fragment>
        {this.state.edit === false && <ContactsList editContact={this.editContact} />}
        {this.state.edit === true && <ContactEdit />}
      </React.Fragment>
    );
  }
}

// PropTypes
Contacts.propTypes = { };

export default compose(
  _withFadeInAnimation
)(Contacts);
