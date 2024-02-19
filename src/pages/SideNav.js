import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuth from '../hooks/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCartShopping, faUsers, faDrumstickBite, faListDots, faEllipsis
} from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import LogOutModal from './LogOutModal';
import DelicLogo from '../assets/img/delic-logo-2.png';
import DashboardIcon from '../assets/dashboard.svg';
import './SideNav.scss';

const SideNav = ({ currentTab }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const { menuIsOpen } = useAuth();

  const name = localStorage.getItem("name");

  return (
    <section className={`min-height-300 ${menuIsOpen ? 'open' : ''}`}>
      <div className="sidenav navbar-expand-xs" id="sidenav-main">
        <div className="sidenav-header">
          <Link className=" m-0" to="/dashboard">
            <div className="navbar-brand">
              <img src={DelicLogo} className="navbar-brand-img h-100" alt="main_logo" />
              <h6>Delic</h6>
            </div>
          </Link>
        </div>
        <hr className="horizontal dark mt-0" />
        <div className="collapse navbar-collapse  w-auto " id="sidenav-collapse-main">
          <nav>
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className={`nav-link ${currentTab === 'dashboard' ? "active" : ""}`}
                  to="/dashboard">
                  <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                    <i className="ni ni-tv-2 text-dark text-sm opacity-10">
                      <img className="fa-dashboard" src={DashboardIcon} alt="" />
                    </i>
                  </div>
                  <span className="nav-link-text ms-1">Dashboard</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${currentTab === 'meals' ? "active" : ""}`}
                  to="/meals">
                  <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                    <i className="ni ni-credit-card text-danger text-sm opacity-10">
                      <FontAwesomeIcon icon={faDrumstickBite} />
                    </i>
                  </div>
                  <span className="nav-link-text ms-1">Meals</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${currentTab === 'menus' ? "active" : ""}`}
                  to="/menus">
                  <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                    <i className="ni ni-app text-dark text-sm opacity-10">
                      <FontAwesomeIcon icon={faListDots} />
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
                      <FontAwesomeIcon icon={faUsers} />
                    </i>
                  </div>
                  <span className="nav-link-text ms-1">Users</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${currentTab === 'profile' ? "active" : ""}`}
                  to="/profile">
                  <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                    <i className="ni ni-calendar-grid-58 text-danger text-sm opacity-10">
                      <FontAwesomeIcon icon={faUser} />
                    </i>
                  </div>
                  <span className="nav-link-text ms-1">Profile</span>
                </Link>
              </li>
            </ul>
          </nav>
          <hr className="horizontal dark mt-0" />
          <div className={`logout ${menuIsOpen ? 'open' : ''}`}>
            {modalOpen && <LogOutModal modalOpen={modalOpen} setModalOpen={setModalOpen} />}
            <div className={`user ${modalOpen ? 'no-hover' : ''}`} onClick={() => setModalOpen(!modalOpen)}>
              <div className="cnt">
                <span className="nav-link-text ms-1">{name}</span>
                <i className="ni ni-calendar-grid-58 text-danger text-sm opacity-10">
                  <FontAwesomeIcon icon={faEllipsis} />
                </i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

SideNav.propTypes = {
  currentTab: PropTypes.string
}

export default SideNav
