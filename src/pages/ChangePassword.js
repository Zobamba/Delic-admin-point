import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import eyeSlash from '../assets/img/eye-slash.svg';
import eye from '../assets/img/eye.svg';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const passwordRef = useRef();
  const errRef = useRef();

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  useEffect(() => {
    passwordRef.current.focus();
  }, []);

  const showPassword = (inputId, iconId) => {
    const input = document.getElementById(inputId);
    const inputIcon = document.getElementById(iconId);

    if (input && inputIcon) {
      // Toggle the eye icon source between eye and eyeSlash
      inputIcon.setAttribute(
        "src",
        input.getAttribute("type") === "password" ? eyeSlash : eye
      );

      // Toggle the input type between password and text
      input.setAttribute(
        "type",
        input.getAttribute("type") === "password" ? "text" : "password"
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { currentPassword, newPassword, confirmPassword };

    try {
      const response = await axiosPrivate.put('/change_pwd',
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
      } else if (err.response?.status === 400) {
        setErrMsg('Wrong password!');
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
      <div className="container">
        <div className='row'>
          <div className="card-header">
            <h6 className="mb-0 text-sm">  <span><FontAwesomeIcon className="icon-back" icon={faArrowLeft} onClick={() => navigate(-1)} />
            </span> Change Password</h6>
          </div>
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
          <div className="form-data">
            <div className="frm pt-pr">
              <div className="fm">
                <form onSubmit={handleSubmit}>
                  <button className="btn" type='submit'>Save</button>
                  <label htmlFor="name">Current Password:
                    <input
                      type="password"
                      name="currentPassword"
                      id="current-pwd-fld"
                      ref={passwordRef}
                      value={currentPassword}
                      placeholder="Enter your currentPassword..."
                      onChange={e => setCurrentPassword(e.target.value)}
                    />
                    <span>
                      <i>
                        <img
                          src={eye}
                          alt="Eye Icon"
                          title="Eye Icon"
                          className="focus-input100 current-pwd"
                          id="current-pwd"
                          onClick={() => { showPassword("current-pwd-fld", "current-pwd") }}
                        />
                      </i>
                    </span>
                  </label>

                  <label htmlFor="price">New Password:
                    <input
                      type="password"
                      name="newPassword"
                      id="new-pwd-fld"
                      value={newPassword}
                      placeholder="Enter your newPassword..."
                      onChange={e => setNewPassword(e.target.value)}
                    />
                    <span>
                      <i>
                        <img
                          src={eye}
                          alt="Eye Icon"
                          title="Eye Icon"
                          className="focus-input100 new-pwd"
                          id="new-pwd"
                          onClick={() => { showPassword("new-pwd-fld", "new-pwd") }}
                        />
                      </i>
                    </span>
                  </label>

                  <label htmlFor="price">Confirm Password:
                    <input
                      type="password"
                      name="confirmPassword"
                      value={confirmPassword}
                      id="confirm-pwd-fld"
                      placeholder="Enter your password confirmation..."
                      onChange={e => setConfirmPassword(e.target.value)}
                    />
                    <span>
                      <i>
                        <img
                          src={eye}
                          alt="Eye Icon"
                          title="Eye Icon"
                          className="focus-input100 confirm-pwd"
                          id="confirm-pwd"
                          onClick={() => { showPassword("confirm-pwd-fld", "confirm-pwd") }}
                        />
                      </i>
                    </span>
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

export default ChangePassword;
