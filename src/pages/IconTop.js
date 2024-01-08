import React from 'react';
import { Link } from 'react-router-dom';
import './IconTop.scss';

const IconTop = () => {
  return (
    <Link
      className="cd-top"
      onClick={() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      }}
    >
      Top
    </Link>
  )
}

export default IconTop
