import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faKey, faPhone, faEnvelope, faUserCircle, faCheck, faTimes, faInfoCircle
}
  from '@fortawesome/free-solid-svg-icons';
import { } from '@fortawesome/free-solid-svg-icons';
import axios from '../api/axios';
import useAuth from '../hooks/useAuth';
import DelicLogo from '../assets/img/delic-logo-2.png';
import eyeSlash from '../assets/img/eye-slash.svg';
import eye from '../assets/img/eye.svg';
import './SignUp.scss';

const SignUp = () => {
  const USER_REGEX = /^[A-z][A-z]{2,23}$/;
  const EMAIL_REGEX = /^[a-z0-9.]{1,64}@[a-z0-9.]{1,64}$/;
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
  const REGISTER_URL = '/sign_up';

  const { setAuth, setNotification } = useAuth();

  const userRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState();
  const [validEMail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [validFirstName, setValidFirstName] = useState(false);
  const [firstNameFocus, setFirstNameFocus] = useState(false);

  const [lastName, setLastName] = useState('');
  const [validLastName, setValidLastName] = useState(false);
  const [lastNameFocus, setLastNameFocus] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(true);

  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const navigate = useNavigate()


  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email, EMAIL_REGEX])

  useEffect(() => {
    setValidFirstName(USER_REGEX.test(firstName));
    setValidLastName(USER_REGEX.test(lastName));
  }, [firstName, lastName, USER_REGEX])

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
    setValidMatch(password === passwordConfirmation);
  }, [password, passwordConfirmation, PWD_REGEX])

  useEffect(() => {
    setErrMsg('');
  }, [email, firstName, lastName, phoneNumber, password, passwordConfirmation])

  useEffect(() => {
    const fetchData = async () => {
      // Simulate API call or data loading delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Set loading to false once data is loaded
      setLoading(false);
    };

    fetchData();
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

  const showNotification = (message, type) => {
    setNotification({ message, type });

    // Auto-hide the notification after 10 seconds
    setTimeout(() => {
      setNotification(null);
    }, 10000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Will effect if button validations are removed
    const v1 = EMAIL_REGEX.test(email);
    const v2 = PWD_REGEX.test(password);
    const v3 = USER_REGEX.test(firstName, lastName);
    if (!v1 || !v2 || !v3) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      const response = await axios.post(REGISTER_URL,
        JSON.stringify({ email, firstName, lastName, phoneNumber, password, passwordConfirmation }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      localStorage.setItem('token', response?.data?.token);
      localStorage.setItem('email', response?.data?.email);
      localStorage.setItem('firstName', response?.data?.firstName);

      localStorage.setItem('logoutName', (response?.data?.firstName + '-' + response?.data?.lastName));
      localStorage.setItem('name', (response?.data?.firstName + ' ' + response?.data?.lastName));
      const token = response?.data?.token;

      setAuth({ email, password, token });
      showNotification('Account created successful', 'success');
      navigate("/sign-in")
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response!');
      } else if (err.response?.status === 409) {
        setErrMsg('Email already exist!');
      } else {
        setErrMsg('Registration Failed!')
      }
      errRef.current.focus();
    }
  }

  return (
    <div>
      <main className="wrapper">
        <div className="header">
          <div className="navbar-brand">
            <img src={DelicLogo} className="navbar-brand-img h-100" alt="main_logo" />
            <h6>Delic</h6>
          </div>
          <div className="center">
            <h2>Create your account</h2>
          </div>
          <ol className="breadcrumb">
            <li><Link to={"/"}>Entry Point</Link></li>
            <li>Sign Up</li>
          </ol>
        </div>
        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
        <section className="inner">
          {
            loading ?
              <div style={{ position: 'fixed', top: '50%', left: '50%' }}>
                <LoadingSpinner loading={loading} />
              </div>
              :
              <form className="login100-form" onSubmit={handleSubmit}>
                <div className="frm">
                  <div className="form">
                    <div className="form-group">
                      <div className="name-group">
                        <div className="form-wrapper">
                          <div className="input-container">
                            <label className="label-input100" htmlFor="firstName">
                              First Name:
                              <FontAwesomeIcon icon={faCheck} className={validFirstName ? "valid" : "hide"} />
                              <FontAwesomeIcon icon={faTimes} className={validFirstName || !firstName ? "hide" : "invalid"} />
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              ref={userRef}
                              id="firstName"
                              placeholder="Enter your first name..."
                              autoComplete="off"
                              onChange={(e) => setFirstName(e.target.value)}
                              value={firstName}
                              required
                              aria-invalid={validFirstName ? false.toString() : true.toString()}
                              aria-describedby="firstName"
                              onFocus={() => setFirstNameFocus(true)}
                              onBlur={() => setFirstNameFocus(false)}
                            />
                            <span>
                              <i>
                                <FontAwesomeIcon className="focus-input100" icon={faUserCircle} />
                              </i>
                            </span>
                          </div>
                          <p id="firstName" className={firstNameFocus && firstName && !validFirstName ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            3 to 24 characters.<br />
                            Must begin with a letter.<br />
                          </p>
                        </div>
                        <div className="form-wrapper">
                          <div className="input-container">
                            <label className="label-input100" htmlFor="lastName">
                              Last Name:
                              <FontAwesomeIcon icon={faCheck} className={validLastName ? "valid" : "hide"} />
                              <FontAwesomeIcon icon={faTimes} className={validLastName || !lastName ? "hide" : "invalid"} />
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              id="lastName"
                              placeholder="Enter your last name..."
                              autoComplete="off"
                              onChange={(e) => setLastName(e.target.value)}
                              value={lastName}
                              required
                              aria-invalid={validLastName ? false.toString() : true.toString()}
                              aria-describedby="lastName"
                              onFocus={() => setLastNameFocus(true)}
                              onBlur={() => setLastNameFocus(false)}
                            />
                            <span>
                              <i>
                                <FontAwesomeIcon className="focus-input100" icon={faUserCircle} />
                              </i>
                            </span>
                          </div>
                          <p id="lastName" className={lastNameFocus && lastName && !validLastName ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            3 to 24 characters.<br />
                            Must begin with a letter.<br />
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="form-wrapper">
                      <div className="input-container">
                        <label className="label-input100" htmlFor="phone">
                          Phone No:
                        </label>
                        <input
                          className="form-control"
                          type="tel"
                          id="phone"
                          placeholder="Enter your phone number..."
                          autoComplete="off"
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          value={phoneNumber}
                          required
                          aria-describedby="phone"
                        />
                        <span>
                          <i>
                            <FontAwesomeIcon className="focus-input100" icon={faPhone} />
                          </i>
                        </span>
                      </div>
                    </div>
                    <div className="form-wrapper">
                      <div className="input-container">
                        <label className="label-input100" htmlFor="email">
                          Email:
                          <FontAwesomeIcon icon={faCheck} className={validEMail ? "valid" : "hide"} />
                          <FontAwesomeIcon icon={faTimes} className={validEMail || !email ? "hide" : "invalid"} />
                        </label>
                        <input
                          className="form-control"
                          type="email"
                          id="email"
                          placeholder="Enter your email..."
                          autoComplete="off"
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          aria-invalid={validEMail ? false.toString() : true.toString()}
                          aria-describedby="email"
                          onFocus={() => setEmailFocus(true)}
                          onBlur={() => setEmailFocus(false)}
                        />
                        <span>
                          <i>
                            <FontAwesomeIcon className="focus-input100" icon={faEnvelope} />
                          </i>
                        </span>
                      </div>
                      <p id="eml" className={emailFocus && email && !validEMail ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        2 to 65 characters before @.<br />
                        Must begin with a letter.<br />
                      </p>
                    </div>
                    <div className="form-wrapper">
                      <div className="input-container">
                        <label className="label-input100" htmlFor="password">
                          Password:
                          <FontAwesomeIcon icon={faCheck} className={validPassword ? "valid" : "hide"} />
                          <FontAwesomeIcon icon={faTimes} className={validPassword || !password ? "hide" : "invalid"} />
                        </label>
                        <input
                          className="input-field"
                          type="password"
                          id="password-fld"
                          placeholder="Enter your password..."
                          name="password"
                          onChange={(e) => setPassword(e.target.value)}
                          value={password}
                          required
                          aria-invalid={validPassword ? false.toString() : true.toString()}
                          aria-describedby="pwd"
                          onFocus={() => setPasswordFocus(true)}
                          onBlur={() => setPasswordFocus(false)}
                        />
                        <span>
                          <i>
                            <FontAwesomeIcon className="focus-input100" icon={faKey} />
                          </i>
                        </span>
                        <span>
                          <i>
                            <img
                              src={eye}
                              alt="Eye Icon"
                              title="Eye Icon"
                              id="password"
                              className="focus-input100 input-icon"
                              onClick={() => { showPassword("password-fld", "password") }}
                            />
                          </i>
                        </span>
                      </div>
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
                    </div>
                    <div className="form-wrapper">
                      <div className="input-container">
                        <label className="label-input100" htmlFor="confirm_pwd">
                          Confirm Password:
                          <FontAwesomeIcon icon={faCheck} className={validMatch && passwordConfirmation ? "valid" : "hide"} />
                          <FontAwesomeIcon icon={faTimes} className={validMatch || !passwordConfirmation ? "hide" : "invalid"} />
                        </label>
                        <input
                          className="input-field-c-pwd"
                          type="password"
                          name="confirmPwd"
                          id="confirm-pwd-fld"
                          placeholder="Confirm your password..."
                          onChange={(e) => setPasswordConfirmation(e.target.value)}
                          value={passwordConfirmation}
                          required
                          aria-invalid={validPassword ? false.toString() : true.toString()}
                          aria-describedby="confirmPwd"
                          onFocus={() => setMatchFocus(true)}
                          onBlur={() => setMatchFocus(false)}
                        />
                        <span>
                          <i>
                            <FontAwesomeIcon className="focus-input100" icon={faKey} />
                          </i>
                        </span>
                        <span>
                          <i>
                            <img
                              src={eye}
                              alt="Eye Icon"
                              title="Eye Icon"
                              id="confirm-pwd"
                              className="focus-input100 input-icon-c-pwd"
                              onClick={() => { showPassword("confirm-pwd-fld", "confirm-pwd") }}
                            />
                          </i>
                        </span>
                      </div>
                      <p id="confirmPwd" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Must match the first password input field.
                      </p>
                    </div>
                    <div className="btn-section">
                      <div className="btn">
                        <button
                          className=""
                          disabled={!validFirstName || !validLastName || !validEMail || !validPassword || !validMatch ? true : false}>
                          Register
                        </button>
                      </div>
                      <div className="link">
                        <Link className="link" to="/sign-in">I am already a member</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
          }
        </section>
      </main>
    </div>
  )
}

export default SignUp
