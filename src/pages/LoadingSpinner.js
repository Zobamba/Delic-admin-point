import React from 'react';
import { css } from '@emotion/react';
import { RingLoader } from 'react-spinners';
import PropTypes from 'prop-types';
import './LoadingSpinner.scss';

const override = css`
display: block;
margin: 0 auto;
position: fixed;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
z-index: 9999; 
`;

const LoadingSpinner = ({ loading }) => {
  return (
    loading && (
      <div className="loading-spinner-overlay">
        <RingLoader color="#1da1f2" loading={loading} css={override} size={25} />
      </div>
    )
  );
};

LoadingSpinner.propTypes = {
  loading: PropTypes.bool.isRequired,
};

export default LoadingSpinner;
