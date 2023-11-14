import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import SideNav from './SideNav';

const Profile = () => {
  const [user, setUser] = useState();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [photoUrl, setPhotoUrl] = useState('');
  const [imageVisible, setImageVisible] = useState(false);

  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();

  let hash = localStorage.getItem('hash');

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

        console.log(response.data);
        setUser(response.data.user);
        setFirstName(response.data.user.firstName);
        setLastName(response.data.user.lastName);
        setPhotoUrl(response.data.user.photoUrl);
      } catch (err) {
        console.log(err);
      }
    }

    getUser();
    setImageVisible(true);
  }, [])

  return (
    <div className="page-wrapper">
      <SideNav currentTab="profile" />
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
                    <span>
                      <Link
                        to={'/editProfile'}>
                        <FontAwesomeIcon title="Edit profile" className="icon-edit" icon={faEdit} />
                      </Link>
                    </span>Account Overview
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
                </div>
                <div className="actions">
                  <Link
                    to={hash = '' ? '/sign-up' : '/changePassword'}
                    className="edit">
                    Change Password
                  </Link>
                </div>
              </div>}
          </div>
        </div>
      </div>
    </div >
  )
}

export default Profile;
