// React Libraries
import React from 'react';
import PropTypes from 'prop-types';
import { truncate } from 'lodash';
const moment = require('moment');

// Helper
import { calTermDate } from '../../../../helpers/date';

// Styles
import styled from 'styled-components';

const InvoiceHeader = styled.div`
  flex: 1;
  flex: none;
  display: flex;
  justify-content: space-between;
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
`;

const Company = styled.div`
  margin-bottom: 1.66667em;
`;

const CompanyInfo = styled.div`
  margin-bottom: 0.66667em;
  font-size: 0.8em;
`;

const CompanyContact = styled.div`
  margin-top: 0.66667em;
`;

const InvoiceInfos = styled.div`
  margin-top:20px;
`;

const RightColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
`;

const Recipient = styled.div`
  width: 75%;
`;

// Component
function Header({ t, invoice, profile, configs }) {
  const { tax, recipient } = invoice;
  const { language, accentColor, customAccentColor  } = configs;
  return (
    <InvoiceHeader>
      <LeftColumn>
        <Company>
          <h4>{profile.company}</h4>
          <CompanyInfo>
            {profile.companyID &&<p>{t('common:fields:companyID')} : {profile.companyID}</p>}
            { tax && tax.tin && <p>{t('form:fields:tax:id')} : { tax.tin }</p> }
          </CompanyInfo>
          <p>{profile.fullname}</p>
          <p>{profile.address.line_1}</p>
          <p>{profile.address.line_2}</p>
          <p>{profile.address.postcode} {profile.address.city}</p>
          <p>{profile.address.state}</p>
          <p>{profile.address.country}</p>
          <CompanyContact>
            <p>{profile.email}</p>
            <p>{profile.phone}</p>
          </CompanyContact>
          
        </Company>
        <InvoiceInfos>
          <h4>
            #{invoice.invoiceID ? invoice.invoiceID : truncate(invoice._id, { length: 8, omission: '', })}
          </h4>
          <p>
            {t('preview:common:created', { lng: language })}:{' '}
            {moment(invoice.created_at)
              .locale(language)
              .format(configs.dateFormat)}
          </p>
          {invoice.dueDate && [
            <p key="dueDate">
              {t('preview:common:due', { lng: language })}:{' '}
              {invoice.dueDate.useCustom
                ? moment(invoice.dueDate.selectedDate)
                    .locale(language)
                    .format(configs.dateFormat)
                : moment(
                    calTermDate(invoice.created_at, invoice.dueDate.paymentTerm)
                  )
                    .locale(language)
                    .format(configs.dateFormat)}
            </p>,
            <p key="dueDateNote">
              {!invoice.dueDate.useCustom &&
                `
              (
                ${t(
                  `form:fields:dueDate:paymentTerms:${
                    invoice.dueDate.paymentTerm
                  }:description`
                )}
              )
              `}
            </p>,
          ]}
        </InvoiceInfos>
      </LeftColumn>
      <RightColumn>
        {configs.showRecipient && (
          <Recipient>
            <h4>{t('preview:common:billedTo', { lng: language })}</h4>
            <p>{recipient.company}</p>
            <p>{recipient.fullname}</p>
            <p>{recipient.address.line_1}</p>
            <p>{recipient.address.line_2}</p>
            <p>{recipient.address.postcode} {recipient.address.city}</p>
            <p>{recipient.address.state}</p>
            <p>{recipient.address.country}</p>
            <p>{recipient.email}</p>
            <p>{recipient.phone}</p>
          </Recipient>
        )}
      </RightColumn>
    </InvoiceHeader>
  );
}

Header.propTypes = {
  configs: PropTypes.object.isRequired,
  invoice: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default Header;
