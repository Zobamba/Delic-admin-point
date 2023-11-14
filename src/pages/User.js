import React, { useState, useEffect } from 'react';
import Switch from 'react-switch';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import SideNav from './SideNav';

const User = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [user, setUser] = useState();
  const [photoUrl, setPhotoUrl] = useState('');

  const [admin, setAdmin] = useState(false);
  const [disable, setDisable] = useState(false);

  const [imageVisible, setImageVisible] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();
  const location = useLocation();

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
      // navigate("/users")

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
      // navigate("/users")

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
    <div className="page-wrapper">
      <SideNav currentTab="users" />
      <div className="container">
        <div className="row">
          <div className="card-header">
            <h6 className="mb-0 text-sm">  <span><FontAwesomeIcon title="Back" className="icon-back" icon={faArrowLeft} onClick={() => navigate(-1)} />
            </span> {(firstName + ' ' + lastName)}</h6>
          </div>
          <div className="form-data">
            {photoUrl &&
              <div className={`img profile-pic ${imageVisible ? 'act' : ''}`}>
                <img src={photoUrl} alt="" />
              </div>}
            {user &&
              <div className="frm m-auto pt-pr">
                <div className="frm-header">
                  <h6 className="mb-0 text-sm">
                    <span className="icon-edit switch">
                      <Switch
                        // className="icon-edit switch"
                        onChange={handleAdminChange}
                        checked={admin}
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
                    <span className="icon-edit lbl">
                      Admin
                    </span>
                    User details
                  </h6>
                </div>
                <div className="info">
                  <p className="sub-info">
                    <span className="font-weight-bold">
                      {(user.firstName + ' ' + user.lastName)}
                    </span>
                  </p>
                  <p className="sub-info">
                    <span className=""></span>
                    {user.email}
                  </p>
                  <p className="sub-info">
                    <span className=""></span>
                    {user.phoneNumber}
                  </p>
                  <p className="sub-info switch">
                    <span className="label">Admin:</span>
                    {admin ?
                      <>{String(admin)}</> : <>{String(admin)}</>}
                  </p>
                  <p className="sub-info">
                    <span className="label">Disabled:</span>
                    {disable ?
                      <>{String(disable)}</> : <>{String(disable)}</>}
                  </p>
                  <p className="sub-info">
                    <span className="label">User Id:</span>
                    {user.id}
                  </p>
                  <p className="sub-info">
                    <span className="label">Created:</span>
                    {new Date(user.createdAt).toDateString()}
                  </p>
                  <p className="sub-info">
                    <span className="label">Updated:</span>
                    {new Date(user.updatedAt).toDateString()}
                  </p>
                </div>
                <div className="actions">
                  <span className="delete lbl">Disable</span>
                  <span className="delete">
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
    </div >
  );
};

export default User;
