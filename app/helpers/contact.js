const openDialog = require('../renderers/dialog');
const appConfig = require('electron').remote.require('electron-settings');
import { getInvoiceValue } from './invoice';
import { isEmpty, pick, includes } from 'lodash';
import i18n from '../../i18n/i18n';
import uuidv4 from 'uuid/v4';

function getContactData(ContactFormData) {
    const {
        company,
        companyID,
        fullname,
        phone,
        email,
        address,
        note,
        settings,
    } = ContactFormData;
    const { editMode, editData } = settings;

    const contactData = { company, companyID, fullname, phone, email, address, note }
    // Return final value
    return Object.assign({}, contactData, {
      // Metadata
      _id: editMode ? editData._id : uuidv4(),
      _rev: editMode ? editData._rev : null,
      created_at: editMode ? editData.created_at : Date.now(),
    });
}


export {
    getContactData,
};
  