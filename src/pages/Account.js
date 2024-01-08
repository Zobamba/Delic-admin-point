import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Account.scss';
import { faArrowRightToBracket, faUserCircle, faUserEdit } from '@fortawesome/free-solid-svg-icons';

const Account = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const axiosPrivate = useAxiosPrivate();

  const logout = () => {
    let keysToRemove = ["token", "email", "hash", "firstName", "name", "logoutName"];

    keysToRemove.forEach((k) => {
      localStorage.removeItem(k)
    });

    window.location.href = '/';
  }

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axiosPrivate.get('/user', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          withCredentials: true
        });

        setEmail(response.data.user.email);
        setName(response.data.user.firstName);

      } catch (err) {
        console.log(err);
      }
    }

    getUser();
  }, [axiosPrivate]);

  return (
    <section className="acc-s">
      <div className="acc">
        <div className="cnt">
          <article className="card">
            <ul className="list">
              <div className="basic-info">
                <h6>{name}</h6>
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
