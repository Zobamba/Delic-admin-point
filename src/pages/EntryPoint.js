import React, { useState, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LoginSocialFacebook } from 'reactjs-social-login';
import { FacebookLoginButton } from 'react-social-login-buttons';
import { LoginSocialGoogle } from 'reactjs-social-login';
import { GoogleLoginButton } from 'react-social-login-buttons';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import DelicLogo from '../assets/img/delic-logo-2.png';
import useAuth from '../hooks/useAuth';
import "./EntryPoint.scss";

const Home = () => {
  const [errMsg, setErrMsg] = useState('');
  const { setAuth } = useAuth();

  const AUTH_LOGIN_URL = '/auth_sign_in';
  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const errRef = useRef();

  const authLogin = async (email, firstName, lastName) => {
    try {
      const response = await axiosPrivate.post(AUTH_LOGIN_URL,
        JSON.stringify({ email, firstName, lastName }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }
      );
      const token = response?.data?.token;
      localStorage.setItem('token', response?.data?.token);
      localStorage.setItem('email', response?.data?.email);

      localStorage.setItem('logoutName', (response?.data?.firstName + '-' + response?.data?.lastName));
      localStorage.setItem('name', (response?.data?.firstName + ' ' + response?.data?.lastName));

      setAuth({ email, token });
      navigate(from, { replace: true });
    } catch (err) {
      console.log(err);
      if (!err?.response) {
        setErrMsg('No Server Response!');
      } else if (err.response?.status === 400) {
        setErrMsg('Oops! Something went wrong. Please check your request and try again.');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized!');
      } else {
        setErrMsg('Login Failed!');
      }
      errRef.current.focus();
    }
  }

  return (
    <div>
      <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
      <div className="pg-wrapper">
        <div className="logo">
          <img height={250} width={250} src={DelicLogo} alt="" />
        </div>
        <div className="container">
          <div className="title">
            <h1>Delic admin point</h1>
            <p>Get started.</p>
          </div>
          <div className="content">
            <div className="s-login">
              {/* <LoginSocialFacebook
                className="s-lgn"
                autoLoad={true}
                fieldsProfile="name, email, picture"
                appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                onResolve={(response) => {
                  authLogin(response?.data?.email, response?.data?.name.split(" ")[0], response?.data?.name.split(" ")[1]);
                }}

                onReject={(error) => {
                  console.log(error);
                }}>
                <FacebookLoginButton
                  style={{
                    background: '#1da1f2',
                    border: 'none',
                    padding: '10px 20px',
                    height: '38px',
                    borderRadius: '25px',
                    boxShadow: 'none',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                  }}
                  hoverStyle={{
                    background: '#1da1f2',
                  }}
                />
              </LoginSocialFacebook> */}

              <LoginSocialGoogle
                className="s-lgn"
                client_id={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                // fetch_basic_profile='true'
                // scope='https://www.googleapis.com/auth/userinfo.email'

                onResolve={(response) => {
                  console.log(response);
                  authLogin(response?.data?.email, response?.data?.given_name, response?.data?.family_name);
                }}

                onReject={(error) => {
                  console.log(error);
                }}>
                <GoogleLoginButton
                  style={{
                    border: '1px solid #dae1e7',
                    padding: '10px 20px',
                    height: '38px',
                    borderRadius: '25px',
                    boxShadow: 'none',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                  }}
                />
              </LoginSocialGoogle>
            </div>
            <div className="separator">
              <span className="line"></span>
              <p className="or">or</p>
              <span className="line"></span>
            </div>
            <div className="axn">
              <Link className="sign-up"
                to="/sign-up">
                <span className="axn-text ms-1">Create account</span>
              </Link>
              <p className="terms">By signing up, you agree to Terms and Service and Privacy Policy, including Cookie Use.</p>
            </div>
            <br />
            <p className="have-acc">Already have an account?</p>
            <div className="axn">
              <Link className="sign-in"
                to="/sign-in">
                <span className="axn-text ms-1">Sign in</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
