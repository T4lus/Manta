// Actions Verbs
import * as ACTION_TYPES from '../constants/actions.jsx';

import { handleActions, combineActions } from 'redux-actions';
import { createSelector } from 'reselect';
import * as Actions from '../actions/contacts';

const initialState = {
  company: "",
  companyID: "",
  created_at:0,
  email:"",
  phone:"",
  fullname:"",
  address:{
    line_1:"",
    line_2:"",
    postcode:"",
    city:"",
    state:"",
    country:""
  },
  note:"",
  settings: {
    editMode: false
  }
};

  const ContactFormReducer = handleActions(
    {
      [ACTION_TYPES.CONTACT_EDIT]: (state, action) => {
        const {
          company,
          companyID,
          fullname,
          phone,
          email,
          address,
          note,
          settings,
        } = action.payload;
        return Object.assign({}, state, {
          company: company !== undefined ? company : state.company,
          companyID: companyID !== undefined ? companyID : state.companyID,
          fullname: fullname !== undefined ? fullname : state.fullname,
          phone: phone !== undefined ? phone : state.phone,
          email: email !== undefined ? email : state.email,
          address: address !== undefined ? address : state.address,
          note:
            note !== undefined
              ? Object.assign({}, state.note, {
                  content: note,
                })
              : state.note,
          settings: Object.assign({}, state.settings, {
            editMode: true,
          }),
        });
      },

      [ACTION_TYPES.CONTACT_FORM_CLEAR]: state =>
        Object.assign({}, initialState)
    },
    initialState
  );

  export default ContactFormReducer;

  // Selector
const getContactFormState = state => state.contactForm;

export const getCurrentContact = createSelector(
  getContactFormState,
  contactForm => contactForm
);
