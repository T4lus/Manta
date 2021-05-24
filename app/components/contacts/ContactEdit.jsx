// Libs
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
const openDialog = require('../../renderers/dialog.js');
const ipc = require('electron').ipcRenderer;
import { translate } from 'react-i18next';

// Actions
import * as ContactFormActions from '../../actions/contactForm';
import { bindActionCreators } from 'redux';

// Components
import Button from '../shared/Button';
import _withFadeInAnimation from '../shared/hoc/_withFadeInAnimation';
import {PageWrapper, PageHeader, PageHeaderTitle, PageHeaderActions, PageContent} from '../shared/Layout';
import { Section } from '../shared/Section';
import { Row, Field } from '../shared/Part';

// Selectors
import { getCurrentContact } from '../../reducers/ContactFormReducer';

// Styles
import styled from 'styled-components';

const NoteContent = styled.textarea`
  min-height: 36px;
  border-radius: 4px;
  padding: 10px;
  display: block;
  width: 100%;
  border: 1px solid #f2f3f4;
  color: #3a3e42;
  font-size: 14px;
`;

// Component
class ContactEdit extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    const { clearContactForm, saveContactForm } = this.props.boundFormActionCreators;
    // Form Value
    const { settings } = this.props.currentContact;
    const { editMode } = settings;
    // Translation
    const { t } = this.props;

    return (
      <PageWrapper>
        <PageHeader>
          <PageHeaderTitle>{editMode ? t('contacts:header_edit') : t('contacts:header_add')}</PageHeaderTitle>
          <PageHeaderActions>
            <Button 
              danger 
              onClick={clearContactForm}
            >
              {t('common:btns:cancel')}
            </Button>
            <Button
              primary={editMode}
              success={editMode === false}
              onClick={saveContactForm}
            >
              {editMode
                ? t('common:btns:update')
                : t('common:btns:save')}
            </Button>
          </PageHeaderActions>
        </PageHeader>
        <PageContent>
          <Section>
            <label className="itemLabel">{t('contacts:fields:general:header')}</label>
            <Row>
              <Field>
                <label className="itemLabel">{t('contacts:fields:general:company')}</label>
                <input
                  name="company"
                  type="text"
                />
              </Field>
              <Field>
                <label className="itemLabel">{t('contacts:fields:general:companyID')}</label>
                <input
                  name="companyID"
                  type="text"
                />
              </Field>
            </Row>
          </Section>
          <Section>
            <label className="itemLabel">{t('contacts:fields:contact:header')}</label>
            <Row>
              <Field>
                <label className="itemLabel">{t('contacts:fields:contact:fullname')} *</label>
                <input
                  name="fullname"
                  type="text"
                />
              </Field>
            </Row>
            <Row>
              <Field>
                <label className="itemLabel">{t('contacts:fields:contact:email')}</label>
                <input
                  name="email"
                  type="text"
                />
              </Field>
              <Field>
                <label className="itemLabel">{t('contacts:fields:contact:phone')}</label>
                <input
                  name="phone"
                  type="text"
                />
              </Field>
            </Row>
          </Section>     
          <Section>
            <label className="itemLabel">{t('contacts:fields:address:header')}</label>
            <Field>
                <label className="itemLabel">{t('contacts:fields:address:line_1')}</label>
                <input
                  name="line_1"
                  type="text"
                />
              </Field>
              <Field>
                <label className="itemLabel">{t('contacts:fields:address:line_2')}</label>
                <input
                  name="line_2"
                  type="text"
                />
              </Field>
              <Field>
                <label className="itemLabel">{t('contacts:fields:address:postcode')}</label>
                <input
                  name="postcode"
                  type="text"
                />
              </Field>
              <Field>
                <label className="itemLabel">{t('contacts:fields:address:city')}</label>
                <input
                  name="city"
                  type="text"
                />
              </Field>
              <Field>
                <label className="itemLabel">{t('contacts:fields:address:state')}</label>
                <input
                  name="state"
                  type="text"
                />
              </Field>
              <Field>
                <label className="itemLabel">{t('contacts:fields:address:country')}</label>
                <input
                  name="country"
                  type="text"
                />
              </Field>
              

          </Section>
          <Section>
            <label className="itemLabel">{t('form:fields:note')}</label>
            <NoteContent
              cols="50"
              rows="4"
              placeholder={t('form:fields:note')}
            />
          </Section>
        </PageContent>
      </PageWrapper>
    );
  }
}

// PropTypes
ContactEdit.propTypes = {
  boundFormActionCreators: PropTypes.shape({
    clearContactForm: PropTypes.func.isRequired,
    saveContactForm: PropTypes.func.isRequired,
  }).isRequired,
  currentContact: PropTypes.shape({
    settings: PropTypes.object.isRequired,
  }).isRequired,
};

// Map state to props & Export
const mapStateToProps = state => ({
    currentContact: getCurrentContact(state),
});

const mapDispatchToProps = dispatch => ({
  boundFormActionCreators: bindActionCreators(ContactFormActions, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  translate(),
  _withFadeInAnimation
)(ContactEdit);
