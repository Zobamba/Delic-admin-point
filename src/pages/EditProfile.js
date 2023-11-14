import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCamera } from '@fortawesome/free-solid-svg-icons';
import SideNav from './SideNav';

const EditProfile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [imageVisible, setImageVisible] = useState(false);

  const firstNameRef = useRef();
  const errRef = useRef();

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  useEffect(() => {
    firstNameRef.current.focus();

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
      const response = await axiosPrivate.put('/edit-profile',
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
    <div className="page-wrapper">
      <SideNav currentTab="profile" />
      <div className="container">
        <div className='row'>
          <div className="card-header">
            <h6 className="mb-0 text-sm">  <span><FontAwesomeIcon title="Back" className="icon-back" icon={faArrowLeft} onClick={() => navigate(-1)} />
            </span> Edit Profile</h6>
          </div>
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
          <div className="form-data">
            <div className={`img profile-pic ${imageVisible ? 'act' : ''}`}>
              <img className="usr-img" src={photoUrl} alt="" />
              <div className="widget">
                <UploadWidget />
              </div>
            </div>
            <div className="frm m-auto pt-pr">
              <div className="fm">
                <form onSubmit={handleSubmit}>
                  <button className="btn" type='submit'>Save</button>
                  <label htmlFor="name">firstName:
                    <input
                      type="text"
                      name="firstName"
                      ref={firstNameRef}
                      value={firstName}
                      placeholder="Enter your firstname..."
                      onChange={e => setFirstName(e.target.value)}
                    />
                  </label>

                  <label htmlFor="price">lastName:
                    <input
                      type="text"
                      name="lastName"
                      value={lastName}
                      placeholder="Enter a price..."
                      onChange={e => setLastName(e.target.value)}
                    />
                  </label>

                  <label htmlFor="price">phoneNumber:
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
      </div>
    </div>
  )
}

export default EditProfile
