import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import SideNav from './SideNav';

const EditMeal = () => {
  const [admin, setAdmin] = useState(false);
  const [disable, setDisable] = useState(false);

  const [errMsg, setErrMsg] = useState('');

  const adminRef = useRef();
  const errRef = useRef();

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  useEffect(() => {
    adminRef.current.focus();
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();

    const id = window.location.href.split("/")[4];
    const payload = { admin, disable }
    console.log(payload)

    try {
      const response = await axiosPrivate.put(`/users/${id}`,
        JSON.stringify(payload),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      console.log(JSON.stringify(response?.data));

      navigate("/users")

    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response!');
      } else if (err.response?.status === 409) {
        setErrMsg('Meal already exist!');
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
      <SideNav currentTab="users" />
      <div className="container">
        <div className='row'>
          <div className="card-header">
            <h6 className="mb-0 text-sm">  <span><FontAwesomeIcon className="icon-back" icon={faArrowLeft} onClick={() => navigate(-1)} />
            </span> Edit Meal</h6>
          </div>
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Admin</label>
            <input
              type="text"
              name="admin"
              ref={adminRef}
              //   required="required"
              //   placeholder="Enter a meal..."
              onChange={e => setAdmin(e.target.value)} />

            <label htmlFor="category">Disable</label>
            <input
              type="text"
              name="disable"
              //   required="required"
              //   placeholder="Enter a category..."
              onChange={e => setDisable(e.target.value)} />
            <button
              className="button"
              type='submit'>Save</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditMeal
