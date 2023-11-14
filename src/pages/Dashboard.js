import React from 'react';
import { Link } from 'react-router-dom';
import SideNav from './SideNav';
import './Dashboard.scss';

const Dashboard = () => {
  return (
    <section>
      <SideNav currentTab="dashboard" />
      <div className="py-4">
        <div className="container">
          <div className="header">
            <h1>Delic</h1>
          </div>
          <div className="login">
            <Link className="nav-link hover"
              to="/sign-in">
              <span className="nav-link-text ms-1">Login</span>
            </Link>
          </div>
          <div className="sign-up">
            <Link className="nav-link hover"
              to="/sign-up">
              <span className="nav-link-text ms-1">Sign Up</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Dashboard
