// React Libraries
import React from 'react';
import PropTypes from 'prop-types';

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

const RightColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
`;

const InvoiceLogo = styled.div`
  flex: 1;
  max-height: 6em;
  img {
    width: auto;
    max-height: 4em;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  margin-bottom: 2em;
  ${props =>
    props.logoSize &&
    `
    max-width: ${props.logoSize}%;
  `};
  img {
    width: 100%;
    height: auto;
  }
`;

const Heading = styled.h1`
  margin: 0 0 10px 0;
  font-size: 2em;
  font-weight: 400;
  color: #cbc189;
  text-transform: uppercase;
  letter-spacing: 1px;
  ${props =>
    props.customAccentColor &&
    `
    color: ${props.accentColor};
  `};
`;


// Component
function Logo({t, invoice, profile, configs }) {
  const { showLogo, logoSize } = configs;
  const { language, accentColor, customAccentColor  } = configs;
  return (
    <InvoiceHeader>
      <LeftColumn>
        {showLogo && (
        <Wrapper logoSize={logoSize}>
          <img src={profile.logo} alt="Logo" />
        </Wrapper>
        )}
      </LeftColumn>
      <RightColumn>
        <Heading accentColor={accentColor} customAccentColor={customAccentColor}>
          {invoice.status == 'draft' ? t('preview:common:quote', { lng: language }) : t('preview:common:invoice', { lng: language })}
        </Heading>
      </RightColumn>
    </InvoiceHeader>  
    
  );
}

Logo.propTypes = {
  configs: PropTypes.object.isRequired,
  invoice: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};


export default Logo;
