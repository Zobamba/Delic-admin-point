/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import './SideNav.scss';
import PropTypes from 'prop-types';
import { faTv, faCartShopping, faFileLines, faUtensils, faBowlRice, faUserCircle, faEllipsis, faSignOut, faSignIn } from "@fortawesome/free-solid-svg-icons";
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CtDark from '../assets/img/logo-ct-dark.png';
import SideBarLogo from '../assets/img/icon-documentation.svg'


const SideNav = ({ currentTab }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

    const logout = () => {
      localStorage.removeItem('token');
      window.location.href = '/';
  }

  return (
    <section className="min-height-300 w-100 position-absolute">
      <div className="sidenav bg-white navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-4 " id="sidenav-main">
        <div className="sidenav-header">
          <i className="fas fa-times p-3 cursor-pointer text-secondary opacity-5 position-absolute end-0 top-0 d-none d-xl-none" aria-hidden="true" id="iconSidenav"></i>
          <Link className="navbar-brand m-0" to="/">
            <img src={CtDark} className="navbar-brand-img h-100" alt="main_logo" />
            <span className="ms-1 font-weight-bold">Delic-View-Point</span>
          </Link>
          <hr className="horizontal dark mt-0" />
        </div>
        <div className="collapse navbar-collapse  w-auto " id="sidenav-collapse-main">
          {isLoggedIn && <ul className="navbar-nav">
            <li className="nav-item">
              <Link className={`nav-link ${currentTab === 'dashboard' ? "active" : ""}`}
                to="/">
                <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                  <i className="ni ni-tv-2 text-primary text-sm opacity-10">
                    <FontAwesomeIcon icon={faTv} />
                  </i>
                </div>
                <span className="nav-link-text ms-1">Dashboard</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${currentTab === 'meals' ? "active" : ""}`}
                to="/meals">
                <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                  <i className="ni ni-credit-card text-success text-sm opacity-10">
                    <FontAwesomeIcon icon={faUtensils} />
                  </i>
                </div>
                <span className="nav-link-text ms-1">Meals</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${currentTab === 'menus' ? "active" : ""}`}
                to="/menus">
                <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                  <i className="ni ni-app text-info text-sm opacity-10">
                    <FontAwesomeIcon icon={faBowlRice} />
                  </i>
                </div>
                <span className="nav-link-text ms-1">Menus</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${currentTab === 'orders' ? "active" : ""}`}
                to="/orders">
                <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                  <i className="ni ni-world-2 text-danger text-sm opacity-10">
                    <FontAwesomeIcon icon={faCartShopping} />
                  </i>
                </div>
                <span className="nav-link-text ms-1">Orders</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${currentTab === 'users' ? "active" : ""}`}
                to="/users">
                <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                  <i className="ni ni-single-02 text-dark text-sm opacity-10">
                    <FontAwesomeIcon icon={faUserCircle} />
                  </i>
                </div>
                <span className="nav-link-text ms-1">Users</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${currentTab === 'profile' ? "active" : ""}`}
                to="/profile">
                <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                  <i className="ni ni-calendar-grid-58 text-warning text-sm opacity-10">
                    <FontAwesomeIcon icon={faUser} />
                  </i>
                </div>
                <span className="nav-link-text ms-1">Profile</span>
              </Link>
              <hr className="horizontal dark mt-0" />
            </li>
            <br />
            <li className="nav-item d-flex">
              <span>Account pages</span>
              <FontAwesomeIcon icon={faEllipsis} className="ellipsis" onClick={() => setIsLoggedIn(!isLoggedIn)} />
            </li>
          </ul>}
          {!isLoggedIn && <ul className="navbar-nav account-pages">
            <li className="nav-item mt-3">
              <h6 className="ps-4 ms-2 text-uppercase text-xs font-weight-bolder opacity-6">Account pages</h6>
            </li>
            <li className="nav-item" onClick={() => setIsLoggedIn(!isLoggedIn)}>
              <Link className="nav-link hover"
                to="/sign-in">
                <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                  <i className="ni ni-single-copy-04 text-warning text-sm opacity-10">
                    <FontAwesomeIcon icon={faSignIn} />
                  </i>
                </div>
                <span className="nav-link-text ms-1">Sign In</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link hover"
                to="/sign-up">
                <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                  <i className="ni ni-collection text-info text-sm opacity-10">
                    <FontAwesomeIcon icon={faFileLines} />
                  </i>
                </div>
                <span className="nav-link-text ms-1">Sign Up</span>
              </Link>
            </li>
            <li className="nav-item" onClick={logout}>
              <Link className= "nav-link hovers"
                to="">
                <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                  <i className="ni ni-collection text-info text-sm opacity-10">
                    <FontAwesomeIcon icon={faSignOut} />
                  </i>
                </div>
                <span className="nav-link-text ms-1">Sign Out</span>
              </Link>
            </li>
          </ul>}
        </div>
        <div className="sidenav-footer mx-3 ">
          <div className="card card-plain shadow-none" id="sidenavCard">
            <img className="w-50 mx-auto" src={SideBarLogo} alt="sidebar_illustration" />
            <div className="card-body text-center p-3 w-100 pt-0">
              <div className="docs-info">
                <h6 className="mb-0">Need help?</h6>
                <p className="text-xs font-weight-bold mb-0">Please check our docs</p>
              </div>
            </div>
          </div>
          <a className="btn btn-dark btn-sm w-100 mb-3">Documentation</a>
          <a className="btn btn-primary btn-sm mb-0 w-100">Upgrade to pro</a>
        </div>
      </div>
    </section>
  )
}

SideNav.propTypes = {
  currentTab: PropTypes.string
}

export default SideNav
