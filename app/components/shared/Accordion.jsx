import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class AlertAccordion extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {expanded:false}
    this.setExpanded = this.setExpanded.bind(this);
  }

  setExpanded(state) {
    this.setState({expanded:state});
  }

  render() {
    const { className, title, content } = this.props;

    return (
      <div className={className} role="alert">
        <strong className='alert-heading' onClick={() => this.setExpanded(!this.state.expanded)} >
          {title}
          <button className='close' onClick={() => this.setExpanded(!this.state.expanded)}>
            {this.state.expanded ? <i className="ion-android-arrow-dropup" /> : <i className="ion-android-arrow-dropdown" />}
          </button>
        </strong>
        {this.state.expanded && <div><hr />{content}</div>}
      </div>
    );

  }
}

AlertAccordion.propTypes = {
  className: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.any.isRequired,
};
  
export default AlertAccordion;