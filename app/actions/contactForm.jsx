import * as ACTION_TYPES from '../constants/actions.jsx';
import { createAction } from 'redux-actions';

export const clearContactForm = createAction(
    ACTION_TYPES.CONTACT_FORM_CLEAR,
    (event, muted = false) => muted
  );

export const updateContactForm = createAction(
  ACTION_TYPES.CONTACT_FORM_UPDATE,
  data => data
);

export const saveContactForm = createAction(
    ACTION_TYPES.CONTACT_FORM_SAVE
);