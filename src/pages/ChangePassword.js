import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import LoadingSpinner from './LoadingSpinner';
import useAuth from '../hooks/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import DelicLogo from '../assets/img/delic-logo-2.png';
import eyeSlash from '../assets/img/eye-slash.svg';
import eye from '../assets/img/eye.svg';

const ChangePassword = () => {
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
  const [currentPassword, setCurrentPassword] = useState('');
  const [loading, setLoading] = useState(true);

  const [newPassword, setNewPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const { setNotification } = useAuth();

  const passwordRef = useRef();
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
      showNotification('Save was successful', 'success');
      navigate("/profile")

    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response!');
      } else if (err.response?.status === 400) {
        setErrMsg('Oops! Wrong password.');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized!');
      } else {
        setErrMsg('Failed!')
      }
      errRef.current.focus();
    }
  }

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

  return (
    <div>
      <div className="page-wrapper">
        <div className="inside">
          <div className="navbar-brand">
            <img src={DelicLogo} className="navbar-brand-img h-100" alt="main_logo" />
            <h6>Delic</h6>
          </div>
          <div className="card-header center">
            <h2 className="">Change Password</h2>
          </div>
          <ol className="breadcrumb">
            <li><Link to={"/profile"}>Profile</Link></li>
            <li>Change Password</li>
          </ol>
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
          <div className="form-data m-top">
          {
            loading ?
              <div style={{ position: 'fixed', top: '50%', left: '50%' }}>
                <LoadingSpinner loading={loading} />
              </div>
              :
                <div className="frm pt-pr">
                  <div className="fm">
                    <form onSubmit={handleSubmit}>
                      <label htmlFor="password">Current Password:
                        <input
                          type="password"
                          name="currentPassword"
                          id="current-pwd-fld"
                          className="new-pwd-field"
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

                      <label htmlFor="password">New Password:
                        <FontAwesomeIcon icon={faCheck} className={validPassword ? "valid" : "hide"} />
                        <FontAwesomeIcon icon={faTimes} className={validPassword || !newPassword ? "hide" : "invalid"} />
                        <input
                          type="password"
                          name="newPassword"
                          id="new-pwd-fld"
                          className="new-pwd-field"
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
                              className="focus-input100 new-pwd"
                              id="new-pwd"
                              onClick={() => { showPassword("new-pwd-fld", "new-pwd") }}
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
                          value={confirmPassword}
                          className="new-pwd-field"
                          id="confirm-pwd-fld"
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
                              className="focus-input100 confirm-pwd"
                              id="confirm-pwd"
                              onClick={() => { showPassword("confirm-pwd-fld", "confirm-pwd") }}
                            />
                          </i>
                        </span>
                        <p id="confirmPwd" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                          <FontAwesomeIcon icon={faInfoCircle} />
                          Must match the new password input field.
                        </p>
                      </label>
                      <button className="btn" type='submit'>Save</button>
                    </form>
                  </div>
                </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangePassword;
