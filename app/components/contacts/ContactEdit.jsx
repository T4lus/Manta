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
    this.state = this.props.currentContact;

    this.handleChange = this.handleChange.bind(this);

    this.saveContactForm = this.saveContactForm.bind(this);
    this.clearContactForm = this.clearContactForm.bind(this);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    var parts = name.split('.');
    if (parts[1])
    {
      this.setState( { address: {...this.state.address, [parts[1]]: value } }, () => {
        this.props.boundFormActionCreators.updateContactForm(this.state)
      });
    }
    else
    {
      this.setState({ [name]: value }, () => {
        this.props.boundFormActionCreators.updateContactForm(this.state);
      });
    }
  }

  saveContactForm() {
    this.props.boundFormActionCreators.saveContactForm();
    this.props.closeEditContact();
  }

  clearContactForm() {
    this.props.boundFormActionCreators.clearContactForm();
    this.props.closeEditContact();
  }


  render() {
    const { clearContactForm, saveContactForm } = this.props.boundFormActionCreators;
    // Form Value
    const { 
      company,
      companyID,
      fullname,
      phone,
      email,
      address,
      note,
      settings, 
    } = this.props.currentContact;
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
              onClick={this.clearContactForm}
            >
              {t('common:btns:cancel')}
            </Button>
            <Button
              primary={editMode}
              success={editMode === false}
              onClick={this.saveContactForm}
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
                  value={this.state.company}
                  onChange={this.handleChange}
                />
              </Field>
              <Field>
                <label className="itemLabel">{t('contacts:fields:general:companyID')}</label>
                <input
                  name="companyID"
                  type="text"
                  value={this.state.companyID}
                  onChange={this.handleChange}
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
                  value={this.state.fullname}
                  onChange={this.handleChange}
                />
              </Field>
            </Row>
            <Row>
              <Field>
                <label className="itemLabel">{t('contacts:fields:contact:email')}</label>
                <input
                  name="email"
                  type="text"
                  value={this.state.email}
                  onChange={this.handleChange}
                />
              </Field>
              <Field>
                <label className="itemLabel">{t('contacts:fields:contact:phone')}</label>
                <input
                  name="phone"
                  type="text"
                  value={this.state.phone}
                  onChange={this.handleChange}
                />
              </Field>
            </Row>
          </Section>     
          <Section>
            <label className="itemLabel">{t('contacts:fields:address:header')}</label>
            <Field>
                <label className="itemLabel">{t('contacts:fields:address:line_1')}</label>
                <input
                  name="address.line_1"
                  type="text"
                  value={this.state.address.line_1}
                  onChange={this.handleChange}
                />
              </Field>
              <Field>
                <label className="itemLabel">{t('contacts:fields:address:line_2')}</label>
                <input
                  name="address.line_2"
                  type="text"
                  value={this.state.address.line_2}
                  onChange={this.handleChange}
                />
              </Field>
              <Field>
                <label className="itemLabel">{t('contacts:fields:address:postcode')}</label>
                <input
                  name="address.postcode"
                  type="text"
                  value={this.state.address.postcode}
                  onChange={this.handleChange}
                />
              </Field>
              <Field>
                <label className="itemLabel">{t('contacts:fields:address:city')}</label>
                <input
                  name="address.city"
                  type="text"
                  value={this.state.address.city}
                  onChange={this.handleChange}
                />
              </Field>
              <Field>
                <label className="itemLabel">{t('contacts:fields:address:state')}</label>
                <input
                  name="address.state"
                  type="text"
                  value={this.state.address.state}
                  onChange={this.handleChange}
                />
              </Field>
              <Field>
                <label className="itemLabel">{t('contacts:fields:address:country')}</label>
                <input
                  name="address.country"
                  type="text"
                  value={this.state.address.country}
                  onChange={this.handleChange}
                />
              </Field>
              

          </Section>
          <Section>
            <label className="itemLabel">{t('form:fields:note')}</label>
            <NoteContent
              cols="50"
              rows="4"
              value={this.state.note}
              onChange={this.handleChange}
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
    updateContactForm: PropTypes.func.isRequired,
    saveContactForm: PropTypes.func.isRequired,
  }).isRequired,
  currentContact: PropTypes.shape({
    settings: PropTypes.object.isRequired,
  }).isRequired,
  closeEditContact: PropTypes.func.isRequired,
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
