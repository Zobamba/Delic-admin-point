import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Account.scss';
import { faArrowRightToBracket, faUserCircle, faUserEdit } from '@fortawesome/free-solid-svg-icons';

const Account = () => {
  const name = localStorage.getItem('name');
  const email = localStorage.getItem('email');

  const firstName = name.split(' ')[0];


  const logout = () => {
    let keysToRemove = ["token", "email", "hash", "firstName", "name", "logoutName"];

    keysToRemove.forEach((k) => {
      localStorage.removeItem(k)
    });

    window.location.href = '/';
  }

  return (
    <section className="acc-s">
      <div className="acc">
        <div className="cnt">
          <article className="card">
            <ul className="list">
              <div className="basic-info">
                <h6>{firstName}</h6>
                <p>{email}</p>
              </div>
              <li>
                <Link to="/updateProfile">
                  <FontAwesomeIcon className="icon" icon={faUserEdit} />Edit Profile
                </Link>
              </li>
              <li>
                <Link to="/profile">
                  <FontAwesomeIcon className="icon" icon={faUserCircle} />View Profile
                </Link>
              </li>
              <div className="divider"></div>
              <li >
                <Link onClick={logout}>
                  <FontAwesomeIcon className="icon" icon={faArrowRightToBracket} />Logout
                </Link>
              </li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  )
}

export default Account
