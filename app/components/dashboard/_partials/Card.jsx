// Libs
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
const ipc = require('electron').ipcRenderer;
const moment = require('moment');
import { translate } from 'react-i18next';

// Components
import styled from 'styled-components';
import _withFadeInAnimation from '../../shared/hoc/_withFadeInAnimation';


const Status = styled.div`
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  ${props => props.status === 'increase' && `color: #6BBB69;`} 
  ${props => props.status === 'decrease' && `color: #EC476E;`} 
  ${props => props.status === 'none' && `color: #4F555C;`} 
  
  span {
    font-size: 11px;
    i {
      margin-right: 5px;
    }
  }
  i.ion-minus {
    font-size: 30px;
    line-height: 30px;
  }
  i.ion-arrow-graph-up-right {
    font-size: 30px;
    line-height: 30px;
  }
  i.ion-arrow-graph-down-right {
    font-size: 30px;
    line-height: 30px;
  }
`;


// Component
class Card extends PureComponent {
  constructor(props) {
    super(props);  
  }

  getStatus(value) {
    if (value.current.total - value.last.total > 0)
      return 'increase';
    else if (value.current.total - value.last.total < 0)
      return 'decrease';
    else
      return 'none';
  }

  getCardClass(status) {
    switch (status) {
      case 'increase': {
        return "card border-success";
      }
      case 'decrease': {
        return "card border-danger";
      }
      default: {
        return 'card border-secondary';
      }
    }
  }

  calcGrowthRate(value) {
    if (value.current.total == value.last.total)
      return 0;

    let rate = (value.current.total-value.last.total)/value.last.total
    if (rate === Infinity)
      return '∞';
    return rate;
  }

  displayStatus(status, rate) {
    switch (status) {
      case 'increase': {
        return (
          <span>
            <i className="ion-arrow-graph-up-right" /><br />
            ({rate}%)
          </span>
        );
      }
      case 'decrease': {
        return (
          <span>
            <i className="ion-arrow-graph-down-right" /><br />
            ({rate}%)
          </span>
        );
      }
      default: {
        return (
          <span>
            <i className="ion-minus" /><br />
            ({rate}%)
          </span>
        );
      }
    }
  }

  render() {
    const { t, header, data} = this.props;

    return (
      <div className={this.getCardClass(this.getStatus(data))}>
        <div class="card-header">{header}</div>
        <div className="card-body row">
          <div className="col-9">
            <h5 className="card-title">
              {data.current.period} : {data.current.total}
            </h5>
            <h6 className="card-subtitle mb-2 text-muted">
              {data.last.period} : {data.last.total}
            </h6>
          </div>
          <div className="col-3 align-middle text-center">
            <Status status={this.getStatus(data)}>
              {this.displayStatus(this.getStatus(data), this.calcGrowthRate(data))}
            </Status>
          </div>
        </div>
      </div>
    );
  }
}

// PropTypes
Card.propTypes = {
    header: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
};

export default compose(
    translate(),
    _withFadeInAnimation
)(Card, {});
