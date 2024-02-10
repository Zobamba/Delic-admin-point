import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import LoadingSpinner from './LoadingSpinner';
import Notification from './Notification';
import useAuth from '../hooks/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faUserSlash, faUserTie, } from '@fortawesome/free-solid-svg-icons';
import { faCalendarAlt, faEnvelope, faUser } from '@fortawesome/free-regular-svg-icons';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import SideNav from './SideNav';

const Profile = () => {
  const [user, setUser] = useState();
  const [firstName, setFirstName] = useState('');

  const [lastName, setLastName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const [loading, setLoading] = useState(true);
  const [imageVisible, setImageVisible] = useState(false);

  const axiosPrivate = useAxiosPrivate();
  const { notification, setNotification, menuIsOpen, setMenuIsOpen } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  let hash = localStorage.getItem('hash');

  const closeNotification = () => {
    setNotification(null);
  };

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

        setUser(response.data.user);
        setFirstName(response.data.user.firstName);
        setLastName(response.data.user.lastName);
        setPhotoUrl(response.data.user.photoUrl);
      } catch (err) {
        console.log(err);
        navigate('/sign-in', { state: { from: location }, replace: true });
      }
    }

    getUser();
    setImageVisible(true);
  }, [axiosPrivate, navigate, location]);

  useEffect(() => {
    const fetchData = async () => {
      // Simulate API call or data loading delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Set loading to false once data is loaded
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div>
      {
        loading ?
          <LoadingSpinner loading={loading} />
          :
          <div className="page-wrapper">
            <div className="sidenav">
              <SideNav currentTab="profile" />
            </div>
            <div className="container">
              <div className="row">
                <div className="card-header">
                  <button onClick={() => setMenuIsOpen(!menuIsOpen)} type="button" className="title-bar">
                    <div className="menu-icon dark" type="button" data-toggle="main-nav"></div>
                  </button>
                  <div className="header-content">
                    <h6 className="mb-0 text-sm">{(firstName + ' ' + lastName)}</h6>
                  </div>
                </div>
                <ol className="breadcrumb">
                </ol>
                <div className="form-data">
                  {photoUrl &&
                    <div className={`img profile-pic ${imageVisible ? 'act' : ''}`}>
                      <img src={photoUrl} alt="" />
                    </div>}
                  {user &&
                    <div className="form-center m-auto pt-pr">
                      <div className="frm-header">
                        <h6 className="mb-0 text-sm">
                          Account Overview
                        </h6>
                        <span>
                          <Link
                            to={'/updateProfile'}>
                            <FontAwesomeIcon title="Edit profile" className="icon-edit" icon={faEdit} />
                          </Link>
                        </span>
                      </div>
                      <div className="info">
                        <div className="d-flex">
                          <p className="sub-info">
                            <span className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                              <i className="ni text-sm">
                                <FontAwesomeIcon icon={faEnvelope} />
                              </i>
                            </span>
                            {user.email}
                          </p>
                          <p className="sub-info">
                            <span className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                              <i className="ni text-sm">
                                <FontAwesomeIcon icon={faPhone} />
                              </i>
                            </span>
                            {user.phoneNumber}
                          </p>
                        </div>

                        <div className="d-flex">
                          <p className="sub-info">
                            <span className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                              <i className="ni text-sm">
                                <FontAwesomeIcon icon={faCalendarAlt} />
                              </i>
                            </span>
                            <span className="label">Joined</span>
                            {new Date(user.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <p className="sub-info">
                            <span className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                              <i className="ni text-sm">
                                <FontAwesomeIcon icon={faCalendarAlt} />
                              </i>
                            </span>
                            <span className="label">Updated</span>
                            {new Date(user.updatedAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>

                        <div className="d-flex">
                          <p className="sub-info switch">
                            <span className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                              <i className="ni text-sm">
                                <FontAwesomeIcon icon={faUserTie} />
                              </i>
                            </span>
                            <span className="label">Admin:</span>
                            {String(user.admin)}
                          </p>
                          <p className="sub-info">
                            <span className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                              <i className="ni text-sm">
                                <FontAwesomeIcon icon={faUserSlash} />
                              </i>
                            </span>
                            <span className="label">Disabled:</span>
                            {String(user.disable)}
                          </p>
                        </div>
                      </div>
                      <div className="actions">
                        <Link
                          to={hash ? '/sign-up' : '/changePassword'}
                          className="edit">
                          Change Password
                        </Link>
                      </div>
                    </div>}
                </div>
              </div>
            </div>
            {notification && (
              <Notification
                message={notification.message}
                type={notification.type}
                onClose={closeNotification}
              />
            )}
          </div>
      }
    </div>
  )
}

export default Profile;
