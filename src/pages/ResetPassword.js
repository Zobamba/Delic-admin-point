import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import useAuth from '../hooks/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from '../api/axios';
import DelicLogo from '../assets/img/delic-logo-2.png';
import eyeSlash from '../assets/eye-slash.svg';
import eye from '../assets/eye.svg';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

  const passwordRef = useRef();
  const errRef = useRef();

  const navigate = useNavigate();
  const { setNotification } = useAuth();

  const showNotification = (message, type) => {
    setNotification({ message, type });

    // Auto-hide the notification after a few seconds (e.g., 10 seconds)
    setTimeout(() => {
      setNotification(null);
    }, 10000);
  };

  useEffect(() => {
    const fetchData = async () => {
      // Simulate API call or data loading delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Set loading to false once data is loaded
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(newPassword));
    setValidMatch(newPassword === confirmPassword);
  }, [newPassword, confirmPassword, PWD_REGEX])

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

    const v1 = PWD_REGEX.test(newPassword);
    if (!v1) {
      setErrMsg("Invalid Entry");
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const recoveryPasswordId = urlParams.get('recoveryPasswordId');

    const payload = { recoveryPasswordId, newPassword, confirmPassword };

    try {
      const response = await axios.put(`/forgot_pwd?recoveryPasswordId=${recoveryPasswordId}`,
        payload,
      );
      console.log(response.data);
      showNotification('Enter your details to login', 'success');
      navigate("/sign-in")

    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response!');
      } else if (err.response?.status === 400) {
        setErrMsg('Oops! Something went wrong. Please check your request and try again.');
      } else if (err.response?.status === 404) {
        setErrMsg('Oops! The password reset link has expired, Please request a new link');
      } else {
        setErrMsg('Failed!');
      }
      errRef.current.focus();
    }
  }

  return (
    <div>
      <div className="page-wrapper">
        <div className='inside'>
          <div className="navbar-brand">
            <img src={DelicLogo} className="navbar-brand-img h-100" alt="main_logo" />
            <h6>Delic</h6>
          </div>
          <div className="card-header center">
            <h2 className="">Reset Password</h2>
          </div>
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
          {
            loading ?
              <div style={{ position: 'fixed', top: '50%', left: '50%' }}>
                <LoadingSpinner loading={loading} />
              </div>
              :
              <div className="form-data">
                <div className="frm pt-pr">
                  <div className="fm">
                    <form onSubmit={handleSubmit}>
                      <label htmlFor="password">New Password:
                        <FontAwesomeIcon icon={faCheck} className={validPassword ? "valid" : "hide"} />
                        <FontAwesomeIcon icon={faTimes} className={validPassword || !newPassword ? "hide" : "invalid"} />
                        <input
                          type="password"
                          name="newPassword"
                          className="new-pwd-field"
                          id="new-pwd-field"
                          ref={passwordRef}
                          value={newPassword}
                          placeholder="Enter your newPassword..."
                          onChange={e => setNewPassword(e.target.value)}
                          onFocus={() => setPasswordFocus(true)}
                          onBlur={() => setPasswordFocus(false)}
                        />
                        <span>
                          <i>
                            <img
                              src={eye}
                              alt="Eye Icon"
                              title="Eye Icon"
                              id="new-pwd"
                              className="focus-input100 new-pwd"
                              onClick={() => { showPassword("new-pwd-field", "new-pwd") }}
                            />
                          </i>
                        </span>
                        <p id="pwd" className={passwordFocus && !validPassword ? "instructions" : "offscreen"}>
                          <FontAwesomeIcon icon={faInfoCircle} />
                          8 to 24 characters.<br />
                          Must include uppercase and lowercase letters, a number and a special character.<br />
                          Allowed special characters: <span aria-label="exclamation mark">!</span>
                          <span aria-label="at symbol">@</span>
                          <span aria-label="hashtag">#</span>
                          <span aria-label="dollar sign">$</span>
                          <span aria-label="percent">%</span>
                        </p>
                      </label>

                      <label htmlFor="password">Confirm Password:
                        <FontAwesomeIcon icon={faCheck} className={validMatch && confirmPassword ? "valid" : "hide"} />
                        <FontAwesomeIcon icon={faTimes} className={validMatch || !confirmPassword ? "hide" : "invalid"} />
                        <input
                          type="password"
                          name="confirmPassword"
                          className="confirm-pwd-field"
                          id="confirm-pwd-field"
                          value={confirmPassword}
                          placeholder="Enter your password confirmation..."
                          onChange={e => setConfirmPassword(e.target.value)}
                          onFocus={() => setMatchFocus(true)}
                          onBlur={() => setMatchFocus(false)}
                        />
                        <span>
                          <i>
                            <img
                              src={eye}
                              alt="Eye Icon"
                              title="Eye Icon"
                              id="confirm-pwd"
                              className="focus-input100 confirm-pwd"
                              onClick={() => { showPassword("confirm-pwd-field", "confirm-pwd") }}
                            />
                          </i>
                        </span>
                        <p id="confirmPwd" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                          <FontAwesomeIcon icon={faInfoCircle} />
                          Must match the new password input field.
                        </p>
                      </label>

                      <button
                        className="btn"
                        type='submit'>Save</button>
                    </form>
                  </div>
                </div>
              </div>
          }
        </div>
      </div>
    </div>
  )
}

export default ResetPassword;
