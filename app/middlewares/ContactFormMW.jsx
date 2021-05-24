// Node Libs
import uuidv4 from 'uuid/v4';

// Actions Verbs
import * as ACTION_TYPES from '../constants/actions.jsx';

//Actions
import * as UIActions from '../actions/ui';
import * as ContactFormActions from '../actions/contactForm';
import * as ContactsActions from '../actions/contacts';

// Helper
import { getContactData, validateFormData } from '../helpers/contact';
import i18n from '../../i18n/i18n';

const ContactFormMW = ({ dispatch, getState }) => next => action => {
    switch (action.type) {
        case ACTION_TYPES.CONTACT_FORM_SAVE: {
            const currentContactData = getContactData(getState().contactForm);
            console.log(currentContactData);

            if (currentContactData.settings.editMode) {
                dispatch(ContactsActions.updateContact(currentContactData));
              } else {
                dispatch(ContactsActions.saveContact(currentContactData));
              }

            // Clear The Form
            dispatch(ContactFormActions.clearContactForm(null, true));
            break;
        }
        case ACTION_TYPES.CONTACT_FORM_CLEAR: {
            next(action);
            break;
        }
        default: {
            return next(action);
        }
    }
};
      
export default ContactFormMW;