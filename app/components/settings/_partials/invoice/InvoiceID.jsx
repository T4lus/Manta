import React, { Component } from 'react';
import PropTypes from 'prop-types';
const moment = require('moment');

import { Row, Field, Part } from '../../../shared/Part';

function InvoiceID({ t, invoiceID, handleInvoiceIDChange }) {
  return [
    <label key="label" className="itemLabel">
      {t('settings:fields:invoiceIdSettings')}
    </label>,
    <Part key="part">
      <Row>
        <Field>
          <label className="itemLabel">{t('settings:fields:invoiceID:padding')}</label>
          <input
            name="padding"
            type="number"
            step="1"
            value={invoiceID.padding}
            onChange={handleInvoiceIDChange}
            placeholder={t('common:amount')}
          />
        </Field>
        <Field>
          <label className="itemLabel">{t('settings:fields:invoiceID:prefix')}</label>
          <select name="prefix" value={invoiceID.prefix} onChange={handleInvoiceIDChange}>
            <option value="none">{t('settings:fields:invoiceID:noPrefix')}</option>
            <option value="YYYY">{moment(Date.now()).format('YYYY')} (YYYY)</option>
            <option value="YYYYMM">{moment(Date.now()).format('YYYYMM')} (YYYYMM)</option>
          </select>
        </Field>
      </Row>
    </Part>,
  ];
}

InvoiceID.propTypes = {
  invoiceID: PropTypes.object.isRequired,
  handleInvoiceIDChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default InvoiceID;
