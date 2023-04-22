import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { FaFacebook, FaGoogle, FaTwitter } from "react-icons/fa";
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import Visibility from "@material-ui/icons/Visibility";
import InputAdornment from "@material-ui/core/InputAdornment";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Input from "@material-ui/core/Input";
import useAuth from '../hooks/useAuth';
import axios from '../api/axios';
import './SignIn.scss';

const LOGIN_URL = 'users/sign_in';

const SignIn = () => {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const userRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const [values, setValues] = React.useState({
    password: "",
    showPassword: false,
  });

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // Set the pointer to Email input
  useEffect(() => {
    userRef.current.focus();
  }, [])

  // Prevents error message from appearing while user makes changes
  useEffect(() => {
    setErrMsg('');
  }, [email, password])

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
      localStorage.setItem('token', response?.data?.token)
      console.log(localStorage);
      console.log(response?.data);
      const token = response?.data?.token;

      setAuth({ email, password, token });
      setEmail('');
      setPassword('');
      navigate(from, { replace: true });

    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response!');
      } else if (err.response?.status === 400) {
        setErrMsg('Invalid Email or Password!');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized!');
      } else {
        setErrMsg('Login Failed!');
      }
      errRef.current.focus();
    }
  }

  return (
    <section className="limiter">
      <div className="container-login100">
        <div className="wrap-login100">
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>

          <form className="login100-form" onSubmit={handleSubmit}>
            <span className="login100-form-title">
              Login
            </span>

            <div className="wrap-input100" data-validate="Email is required">
              <InputLabel className="label-input100" htmlFor="email">Email:</InputLabel>
              <Input
                className="input100"
                type="email"
                id="email"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
                placeholder="Type your email" />
              <span>
                <i>
                  <FontAwesomeIcon className="focus-input100" icon={faUser} />
                </i>
              </span>
            </div>

            <div className="wrap-input100 validate-input" data-validate="Password is required">
              <InputLabel className="label-input100" htmlFor="password">Password:</InputLabel>
              <Input
                className="input100"
                id="password"
                type={values.showPassword ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
                placeholder="Type your password"
                endAdornment={
                  <InputAdornment position="end"
                    className="fa-eye">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {values.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <span >
                <i>
                  <FontAwesomeIcon className="focus-input100" icon={faKey} />
                </i>
              </span>
            </div>

            <div className="text-right">
              <Link className="link" to="/sign-up">
                <span>Forgot password?</span>
              </Link>
            </div>

            <div className="container-login100-form-btn">
              <button>
                Login
              </button>
            </div>

            <div className="txt1">
              <span>
                Or Sign up using
              </span>
            </div>

            <div className="flex-c-m">
              <Link to="" className="login100-social-item bg1">
                <i className="fa fa-facebook"><FaFacebook /></i>
              </Link>

              <Link to="" className="login100-social-item bg2">
                <i className="fa fa-twitter"><FaTwitter /></i>
              </Link>

              <Link to="" className="login100-social-item bg3">
                <i className="fa fa-google"><FaGoogle /></i>
              </Link>
            </div>

            <div className="flex-col-c">
              <span className="txt1 p-b-17">
                Don’t have an account?
              </span>

              <Link to="/sign-up" className="txt2 link">
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>

  )
}

export default SignIn
