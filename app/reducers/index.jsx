import { combineReducers } from 'redux';
import UIReducer from './UIReducer';
import FormReducer from './FormReducer';
import InvoicesReducer from './InvoicesReducer';
import ContactsReducer from './ContactsReducer';
import ContactReducer from './ContactReducer';
import SettingsReducer from './SettingsReducer';

export default combineReducers({
  ui: UIReducer,
  form: FormReducer,
  invoices: InvoicesReducer,
  contacts: ContactsReducer,
  contact: ContactReducer,
  settings: SettingsReducer,
});
