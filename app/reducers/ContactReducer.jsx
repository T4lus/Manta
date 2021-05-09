import { handleActions, combineActions } from 'redux-actions';
import { createSelector } from 'reselect';
import * as Actions from '../actions/contacts';

const initialState = {
  company: "",
  created_at:0,
  email:"",
  fullname:"",
  settings: {
    editMode: false
  },
  required_fields: {},
};

  const ContactReducer = handleActions(
    {
      [combineActions(
        Actions.saveContact,
        Actions.deleteContact
      )]: (state, action) => action.payload,
    },
    initialState
  );

  export default ContactReducer;

  // Selector
const getContactState = state => state.contact;

export const getContact = createSelector(
  getContactState,
  contacts => contacts
);
