import React, { useState, useEffect, useRef } from 'react';
import Switch from 'react-switch';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import LoadingSpinner from './LoadingSpinner';
import Notification from './Notification';
import useAuth from '../hooks/useAuth';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faUserSlash, faUserTie, } from '@fortawesome/free-solid-svg-icons';
import { faCalendarAlt, faEnvelope, faUser } from '@fortawesome/free-regular-svg-icons';
import SideNav from './SideNav';

const User = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState();
  const [photoUrl, setPhotoUrl] = useState('');

  const [admin, setAdmin] = useState(false);
  const [disable, setDisable] = useState(false);

  const [imageVisible, setImageVisible] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const axiosPrivate = useAxiosPrivate();
  const errRef = useRef();

  const navigate = useNavigate();
  const location = useLocation();

  const { notification, setNotification, menuIsOpen,setMenuIsOpen } = useAuth();

  const showNotification = (message, type) => {
    setNotification({ message, type });

    // Auto-hide the notification after a few seconds (e.g., 10 seconds)
    setTimeout(() => {
      setNotification(null);
    }, 10000);
  };

  const closeNotification = () => {
    setNotification(null);
  };

  useEffect(() => {
    const getUser = async () => {
      const id = window.location.href.split("/")[4];

      try {
        const response = await axiosPrivate.get(`/users/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          withCredentials: true
        });

        console.log(response);
        setUser(response.data.user);
        setPhotoUrl(response.data.user.photoUrl);

        setFirstName(response.data.user.firstName);
        setLastName(response.data.user.lastName);

        setAdmin(response.data.user.admin);
        setDisable(response.data.user.disable);

      } catch (err) {
        console.error(err);
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

  const handleSubmitAdmin = async () => {
    const id = window.location.href.split("/")[4];
    const payload = { admin: !admin, disable }
    console.log(payload)

    try {
      const response = await axiosPrivate.put(`/users/${id}`,
        JSON.stringify(payload),
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          withCredentials: true
        }
      );

      console.log(JSON.stringify(response?.data));
      showNotification('Save was successful', 'success');

    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response!');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized!');
      } else {
        setErrMsg('Failed!')
      }
      errRef.current.focus();
    }
  }

  const handleSubmitDisable = async () => {
    const id = window.location.href.split("/")[4];
    const payload = { admin, disable: !disable }
    console.log(payload)

    try {
      const response = await axiosPrivate.put(`/users/${id}`,
        JSON.stringify(payload),
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          withCredentials: true
        }
      );

      console.log(JSON.stringify(response?.data));
      showNotification('Save was successful', 'success');

    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response!');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized!');
      } else {
        setErrMsg('Failed!')
      }
      errRef.current.focus();
    }
  }

  const handleAdminChange = async (checked) => {
    setAdmin(checked);
    await handleSubmitAdmin();
  };

  const handleDisableChange = async (checked) => {
    setDisable(checked);
    await handleSubmitDisable();
  };

  return (
    <div>
      {
        loading ?
          <LoadingSpinner loading={loading} />
          :
          <div className="page-wrapper">
            <div className="sidenav">
              <SideNav currentTab="users" />
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
                  <li><Link to={"/users"}>Users</Link></li>
                  <li>{(firstName + ' ' + lastName)}</li>
                </ol>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <div className="form-data">
                  {photoUrl &&
                    <div className={`img profile-pic ${imageVisible ? 'act' : ''}`}>
                      <img src={photoUrl} alt="" />
                    </div>}
                  {user &&
                    <div className="form-center m-auto pt-pr">
                      <div className="frm-header">
                        <h6 className="mb-0 text-sm">
                          User details
                        </h6>
                        <div className="toggle-switch">
                          <span className="lbl">
                            Make Admin
                          </span>
                          <span className="icon-edit switch">
                            <Switch
                              onChange={handleAdminChange}
                              checked={admin}
                              onColor="#cccccc"
                              offColor="#cccccc"
                              onHandleColor="#ffffff"
                              offHandleColor="#ffffff"
                              height={22}
                              width={55}
                            />
                          </span>
                        </div>
                      </div>
                      <div className="info">
                        <div className="d-flex">
                          <p className="sub-info">
                            <span className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                              <i className="ni text-sm">
                                <FontAwesomeIcon icon={faUser} />
                              </i>
                            </span>
                            <span className="font-weight-bold">
                              {(user.firstName + ' ' + user.lastName)}
                            </span>
                          </p>
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
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                          <p className="sub-info switch">
                            <span className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                              <i className="ni text-sm">
                                <FontAwesomeIcon icon={faUserTie} />
                              </i>
                            </span>
                            <span className="label">Admin:</span>
                            {admin ?
                              <>{String(admin)}</> : <>{String(admin)}</>}
                          </p>
                          <p className="sub-info">
                            <span className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                              <i className="ni text-sm">
                                <FontAwesomeIcon icon={faUserSlash} />
                              </i>
                            </span>
                            <span className="label">Disabled:</span>
                            {disable ?
                              <>{String(disable)}</> : <>{String(disable)}</>}
                          </p>
                        </div>

                        <div className="d-flex">
                          <p className="sub-info">
                            <span className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                              <i className="ni text-sm">
                                <FontAwesomeIcon icon={faCalendarAlt} />
                              </i>
                            </span>
                            <span className="label">Updated</span>
                            {new Date(user.updatedAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                          <p className="sub-info">
                            <span className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                              <i className="ni text-sm">
                                {/* <FontAwesomeIcon icon={faCalendarAlt} /> */}
                              </i>
                            </span>
                            <span className="label">User Id:</span>
                            {user.id}
                          </p>
                        </div>
                      </div>
                      <div className="actions">
                        <span className="lbl">Disable</span>
                        <span className="delete disable">
                          <Switch
                            // className="switch"
                            onChange={handleDisableChange}
                            checked={disable}
                            // uncheckedIcon={null}
                            // checkedIcon={null}
                            onColor="#cccccc"
                            offColor="#cccccc"
                            onHandleColor="#ffffff"
                            offHandleColor="#ffffff"
                            height={22}
                            width={55}
                          />
                        </span>
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
  );
};

export default User;
