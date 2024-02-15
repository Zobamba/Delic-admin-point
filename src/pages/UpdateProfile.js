import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import SideNav from './SideNav';

const UpdateProfile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [loading, setLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');

  const [photoUrl, setPhotoUrl] = useState('');
  const [imageVisible, setImageVisible] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const { setNotification, menuIsOpen, setMenuIsOpen } = useAuth();

  const firstNameRef = useRef();
  const errRef = useRef();

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const showNotification = (message, type) => {
    setNotification({ message, type });

    // Auto-hide the notification after a few seconds (e.g., 10 seconds)
    setTimeout(() => {
      setNotification(null);
    }, 10000);
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

        console.log(response.data);
        setFirstName(response.data.user.firstName);
        setLastName(response.data.user.lastName);
        setPhoneNumber(response.data.user.phoneNumber);
        setPhotoUrl(response.data.user.photoUrl);
      } catch (err) {
        console.log(err);
      }
    }
    getUser();
    setImageVisible(true);
  }, [axiosPrivate]);

  useEffect(() => {
    const fetchData = async () => {
      // Simulate API call or data loading delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Set loading to false once data is loaded
      setLoading(false);
    };

    fetchData();
  }, []);

  const UploadWidget = () => {
    const cloudinaryRef = useRef();
    const widgetRef = useRef();

    useEffect(() => {
      cloudinaryRef.current = window.cloudinary;
      widgetRef.current = cloudinaryRef.current.createUploadWidget({
        cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
        uploadPreset: 'dev_setups',
      }, (error, result) => {
        if (!error && result && result.event === "success") {
          console.log('Done! Here is the image info: ', result.info);

          setPhotoUrl(result.info.secure_url);
        }

      });
    }, []);

    return (
      <div className="custom-button cam">
        <FontAwesomeIcon type="button" icon={faCamera} onClick={() => widgetRef.current.open()} />
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { firstName, lastName, phoneNumber, photoUrl };
    console.log(payload);

    try {
      const response = await axiosPrivate.put('/update-profile',
        JSON.stringify(payload),
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          withCredentials: true
        }
      );
      console.log(response);
      showNotification('Save was successful', 'success');
      navigate("/profile")

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

  return (
    <div>
      <div className="page-wrapper">
        <div className="sidenav">
          <SideNav currentTab="profile" />
        </div>
        <div className="container">
          {
            loading ?
              <LoadingSpinner loading={loading} />
              :
              <div className='row'>
                <div className="card-header">
                  <button onClick={() => setMenuIsOpen(!menuIsOpen)} type="button" className="title-bar">
                    <div className="menu-icon dark" type="button" data-toggle="main-nav"></div>
                  </button>
                  <div className="header-content">
                    <h6 className="mb-0 text-sm">Update Profile</h6>
                  </div>
                </div>
                <ol className="breadcrumb">
                  <li><Link to={"/profile"}>Profile</Link></li>
                  <li>Update Profile</li>
                </ol>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <div className="form-data">
                  <div className={`img profile-pic ${imageVisible ? 'act' : ''}`}>
                    <img className="usr-img" src={photoUrl} alt="" />
                    <div className="widget">
                      <UploadWidget />
                    </div>
                  </div>
                  <div className="form-center m-auto pt-pr">
                    <div className="fm">
                      <form onSubmit={handleSubmit}>
                        <button className="btn" type='submit'>Save</button>
                        <label htmlFor="name">First Name:
                          <input
                            type="text"
                            name="firstName"
                            ref={firstNameRef}
                            value={firstName}
                            placeholder="Enter your firstname..."
                            onChange={e => setFirstName(e.target.value)}
                          />
                        </label>

                        <label htmlFor="price">Last Name:
                          <input
                            type="text"
                            name="lastName"
                            value={lastName}
                            placeholder="Enter a price..."
                            onChange={e => setLastName(e.target.value)}
                          />
                        </label>

                        <label htmlFor="price">Phone Number:
                          <input
                            type="text"
                            name="phoneNumber"
                            value={phoneNumber}
                            placeholder="Enter the description..."
                            onChange={e => setPhoneNumber(e.target.value)}
                          />
                        </label>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
          }
        </div>
      </div>
    </div>
  )
}

export default UpdateProfile
