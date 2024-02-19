import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import Notification from './Notification';
import useAuth from '../hooks/useAuth';
import axios from '../api/axios';
import DelicLogo from '../assets/img/delic-logo-2.png';
import eyeSlash from '../assets/eye-slash.svg';
import eye from '../assets/eye.svg';

const SignIn = () => {
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const LOGIN_URL = '/sign_in';
  const { email, setEmail, setAuth, notification, setNotification } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const userRef = useRef();
  const errRef = useRef();

  const closeNotification = () => {
    setNotification(null);
  };

  // Prevents error message from appearing while user makes changes
  useEffect(() => {
    setErrMsg('');
  }, [email, password]);

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

    try {
      const response = await axios.post(LOGIN_URL,
        JSON.stringify({ email, password }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }
      );
      localStorage.setItem('token', response?.data?.token);
      localStorage.setItem('email', response?.data?.email);
      // localStorage.setItem('hash', response?.data?.passwordHash);
      localStorage.setItem('logoutName', (response?.data?.firstName + '-' + response?.data?.lastName));
      localStorage.setItem('name', (response?.data?.firstName + ' ' + response?.data?.lastName));

      const token = response?.data?.token;

      setAuth({ email, password, token });
      showNotification('Login successful', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      if (!err?.response) {
        console.log(err);
        setErrMsg('Server Not Responding!');
      } else if (err.response?.status === 400) {
        setErrMsg('Oops! Something went wrong. Invalid Email or Password.');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized! Invalid Email or Password.');
      } else {
        setErrMsg('Login Failed!');
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
            <h2>Sign in to Delic</h2>
          </div>
          <ol className="breadcrumb">
            <li><Link to={"/get-started"}>Get started</Link></li>
            <li>Sign In</li>
          </ol>
        </div>
        <section className="inner">
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
          {
            loading ?
              <div style={{ position: 'fixed', top: '50%', left: '50%' }}>
                <LoadingSpinner loading={loading} />
              </div>
              :
              <form className="login100-form" onSubmit={handleSubmit}>
                <div className="frm">
                  <div className="form">
                    <div className="form-wrapper" data-validate="Email is required">
                      <div className="input-container">
                        <label className="label-input100" htmlFor="email">Email:</label>
                        <input
                          className="form-control"
                          type="email"
                          id="email"
                          ref={userRef}
                          autoComplete="off"
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="Enter your email..." />
                        <span>
                          <i>
                            <FontAwesomeIcon className="focus-input100" icon={faUser} />
                          </i>
                        </span>
                      </div>
                    </div>
                    <div className="form-wrapper" data-validate="Password is required">
                      <div className="input-container">
                        <label className="label-input100" htmlFor="password">Password:</label>
                        <input
                          className="form-control"
                          id="password"
                          type="password"
                          onChange={(e) => setPassword(e.target.value)}
                          value={password}
                          required
                          placeholder="Enter your password..."
                        />
                        <span >
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
                              className="focus-input100 input-icon"
                              onClick={() => { showPassword("password", "confirm-pwd") }}
                            />
                          </i>
                        </span>
                      </div>
                    </div>
                    <div className="btn-section login">
                      <div className="btn">
                        <button>
                          Login
                        </button>
                      </div>
                      <div className="link">
                        <Link
                          className="link"
                          to="/emailVerification"
                        >
                          <span>Forgot password?</span>
                        </Link>
                      </div>
                    </div>
                    <div className="flex-col-c">
                      <span className="txt1">
                        Don’t have an account?
                      </span>

                      <Link to="/sign-up" className="txt2">
                        Sign up
                      </Link>
                    </div>
                  </div>
                </div>
              </form>
          }
        </section>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={closeNotification}
          />
        )}
      </main>
    </div>
  )
}

export default SignIn
