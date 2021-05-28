// Libs
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
const ipc = require('electron').ipcRenderer;

// Actions
import * as Actions from '../actions/contacts';

// Components
import ContactsList from '../components/contacts/ContactsList'
import ContactEdit from '../components/contacts/ContactEdit'

import _withFadeInAnimation from '../components/shared/hoc/_withFadeInAnimation';


// Component
class Contacts extends PureComponent {

  constructor(props) {
    super(props);
    this.editContact = this.editContact.bind(this);
    this.closeEditContact = this.closeEditContact.bind(this);

    this.state = { edit : false };
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    
  }

  closeEditContact() {
    this.setState({ edit : false });
  }

  editContact(contact) {  
    this.setState({ edit : true });
    const { dispatch } = this.props;
    dispatch(Actions.editContact(contact));
  }

  render() {
    return (
      <React.Fragment>
        {this.state.edit === false && <ContactsList editContact={this.editContact} />}
        {this.state.edit === true && <ContactEdit closeEditContact={this.closeEditContact}/>}
      </React.Fragment>
    );
  }
}

// PropTypes
Contacts.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default compose(
  connect(),
  _withFadeInAnimation
)(Contacts);
