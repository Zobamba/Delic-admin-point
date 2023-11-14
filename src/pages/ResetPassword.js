import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import axios from '../api/axios';
import eyeSlash from '../assets/img/eye-slash.svg';
import eye from '../assets/img/eye.svg';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errMsg, setErrMsg] = useState('');

  const passwordRef = useRef();
  const errRef = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    passwordRef.current.focus();
  }, []);

  const showNewPassword = (e, id) => {
    e.preventDefault();

    const input = document.querySelector(".new-pwd-field");
    const inputIcon = document.querySelector(".new-pwd");

    inputIcon.setAttribute(
      "src",
      input.getAttribute("type") === "password" ?
        eyeSlash
        :
        eye
    );

    input.setAttribute(
      "type",
      input.getAttribute("type") === "password" ?
        "text"
        :
        "password"
    )
  }

  const showPasswordConfirmation = (e) => {
    e.preventDefault();

    const input = document.querySelector(".confirm-pwd-field");
    const inputIcon = document.querySelector(".confirm-pwd");

    inputIcon.setAttribute(
      "src",
      input.getAttribute("type") === "password" ?
        eyeSlash
        :
        eye
    );

    input.setAttribute(
      "type",
      input.getAttribute("type") === "password" ?
        "text"
        :
        "password"
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const recoveryPasswordId = urlParams.get('recoveryPasswordId');

    const payload = { recoveryPasswordId, newPassword, confirmPassword };

    try {
      const response = await axios.put(`/forgot_pwd?recoveryPasswordId=${recoveryPasswordId}`,
        payload,
      );
      console.log(response.data);
      navigate("/sign-in")

    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response!');
      } else if (err.response?.status === 400) {
        setErrMsg('Bad Request!');
      } else if (err.response?.status === 404) {
        setErrMsg('User not found!');
      } else {
        setErrMsg('Failed!');
      }
      errRef.current.focus();
    }
  }

  return (
    <div className="page-wrapper">
      <div className="container p-reset">
        <div className='row'>
          <div className="card-header">
            <h6 className="mb-0 text-sm">  <span><FontAwesomeIcon className="icon-back" icon={faArrowLeft} onClick={() => navigate(-1)} />
            </span> Reset Password</h6>
          </div>
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>

          <div className="p-reset">
            <form onSubmit={handleSubmit}>
              <label htmlFor="password">New Password:
                <input
                  type="password"
                  name="newPassword"
                  className="new-pwd-field"
                  ref={passwordRef}
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
                      onClick={showNewPassword}
                    />
                  </i>
                </span>
              </label>

              <label htmlFor="password">Confirm Password:
                <input
                  type="password"
                  name="confirmPassword"
                  className="confirm-pwd-field"
                  value={confirmPassword}
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
                      onClick={showPasswordConfirmation}
                    />
                  </i>
                </span>
              </label>

              <button
                className="button"
                type='submit'>Save</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword;
