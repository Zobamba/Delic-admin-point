import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import axios from '../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const RequestPasswordReset = () => {
  const { email, setEmail } = useAuth();

  const [errMsg, setErrMsg] = useState("")

  const [message, setMessage] = useState("");

  const errRef = useRef();
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (email) {
      axios
        .put("send_pwd_recovery_email", {
          recipientEmail: email,
        })
        .then((response) => {
          if (response) {
            setMessage(`An email with a link has been sent to ${email}, click on the link to complete your password reset.`);
            setErrMsg('');
          }
        })
        .catch((err) => {
          if (!err?.response) {
            setErrMsg('No Server Response!');
          } else if (err.response?.status === 404) {
            setErrMsg('We cannot find an account for this email.');
          } else if (err.response?.status === 400) {
            setErrMsg('Bad request!');
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
    <div className="page-wrapper">
      <div className="container otp-page">
        <div className="row">
          <div className="card-header">
            <h6 className="mb-0 text-sm">  <span><FontAwesomeIcon className="icon-back" icon={faArrowLeft} onClick={() => navigate(-1)} />
            </span> Email Verification</h6>
          </div>
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>

          <div className="p-reset">
            <div>
              {message && <div className="message">
                <h2>Verify your email address</h2>
                {message}
              </div>}
            </div>
            <div className="text-gray">
              <p>You can request a password reset below. We will send a security code to the email address, please make sure your email is correct.</p>
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
              className="button"
              type='submit'>Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RequestPasswordReset;
