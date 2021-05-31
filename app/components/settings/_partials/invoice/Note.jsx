import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Row, Field, Part } from '../../../shared/Part';

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

function Note({ t, note, handleInputChange }) {
  return [
    <label key="label" className="itemLabel">
      {t('settings:fields:note')}
    </label>,
    <Part key="part">
      <Row>
        <NoteContent
        cols="50"
        rows="4"
        name="note"
        onChange={handleInputChange}
        value={note}
        placeholder={t('form:fields:note')}
        />
      </Row>
    </Part>,
  ];
}

Note.propTypes = {
  note: PropTypes.any.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default Note;
