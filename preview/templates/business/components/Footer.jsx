// React Libraries
import React from 'react';
import PropTypes from 'prop-types';

const appConfig = require('electron').remote.require('electron-settings');
const invoiceSettings = appConfig.getSync('invoice');

import styled from 'styled-components';
const InvoiceFooter = styled.div`
  flex: none;
  h4 {
    padding-bottom: 0.83333em;
    border-bottom: 4px solid #efefd1;
  }
  ${props =>
    props.customAccentColor &&
    `
    h4 { border-bottom: 4px solid ${props.accentColor}; }
  `};
`;

// Component
function Footer({ t, invoice, configs }) {
  const { language, accentColor, customAccentColor  } = configs;
  const { tax } = invoice;
  return invoice.note ? (
    <InvoiceFooter
      accentColor={accentColor}
      customAccentColor={customAccentColor}
    >
      <h4>{ t('preview:common:notice', {lng: language}) }</h4>
      {!tax && (<p>{invoiceSettings.tax.noTaxMessage}</p>)}
      <p dangerouslySetInnerHTML={{__html: invoice.note}}></p>
    </InvoiceFooter>
  ) : null;
}

Footer.propTypes = {
  configs: PropTypes.object.isRequired,
  invoice: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default Footer;
