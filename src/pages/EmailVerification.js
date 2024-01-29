import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import DelicLogo from '../assets/img/delic-logo-2.png';
import useAuth from '../hooks/useAuth';
import axios from '../api/axios';

const EmailVerification = () => {
  const { email, setEmail } = useAuth();
  const [errMsg, setErrMsg] = useState("")

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const errRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      // Simulate API call or data loading delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Set loading to false once data is loaded
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSubmit = () => {
    if (email) {
      axios
        .put("send_pwd_recovery_email", {
          recipientEmail: email,
        })
        .then((response) => {
          if (response) {
            setMessage(`Check your ${email} inbox for instructions from us on how to reset your password.`);
            setErrMsg('');
          }
        })
        .catch((err) => {
          if (!err?.response) {
            setErrMsg('No Server Response!');
          } else if (err.response?.status === 404) {
            setErrMsg('We cannot find an account for this email.');
          } else if (err.response?.status === 400) {
            setErrMsg('Oops! Something went wrong. Please check your request and try again.');
          } else if (err.response?.status === 401) {
            setErrMsg('Unauthorized!');
          } else {
            setErrMsg('Failed!')
          }
        });
    } else {
      setErrMsg("Please enter your email");
    }
  }

  return (
    <div>
      {
        loading ?
          <LoadingSpinner loading={loading} />
          :
          <div className="page-wrapper">
            <div className="inside">
              <div className="navbar-brand">
                <img src={DelicLogo} className="navbar-brand-img h-100" alt="main_logo" />
                <h6>Delic</h6>
              </div>
              <div className="card-header center">
                <h2 className="">Email Verification</h2>
              </div>
              <ol className="breadcrumb">
                <li><Link to={"/sign-in"}>Sign In</Link></li>
                <li>Email Verification</li>
              </ol>
              <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
              <div className="form-data">
                <div className="frm pt-pr">
                  <div className="fm">
                    <div>
                      {message && <div className="message">
                        <h2>Verify your email address</h2>
                        {message}
                      </div>}
                    </div>
                    <div className="text-gray">
                      <p>
                        You can request a password reset below.
                        We will send a security code to the email address,
                        please make sure your email is correct.
                      </p>
                    </div>
                    <label>Email:
                      <input
                        className="input100"
                        type="email"
                        id="email"
                        autoComplete="off"
                        onChange={(e) => setEmail(e.target.value)}
                        // value={email}
                        required
                        placeholder="Enter your email..."
                      ></input>
                    </label>
                    <button
                      onClick={handleSubmit}
                      className="btn"
                      type='submit'>Submit
                    </button>
                  </div>
                  <br />
                </div>
              </div>
            </div>
          </div>
      }
    </div>
  )
}

export default EmailVerification;
