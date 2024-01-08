import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import './Notification.scss';

const Notification = ({ message, type, onClose }) => {
  return (
    <div className={`notification ${type}`}>
      <p><FontAwesomeIcon className="check" icon={faCheckCircle} /> {message}</p>
      <button className="close-btn" onClick={onClose}>
        <span className="times">&times;</span>
      </button>
    </div>
  );
};

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Notification;
