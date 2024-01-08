import React, { useState, useEffect, useRef } from 'react'
import Switch from 'react-switch';
import { useNavigate } from 'react-router-dom'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import SideNav from './SideNav';

const EditMeal = () => {
  const [admin, setAdmin] = useState(false);
  const [disable, setDisable] = useState(false);

  const [errMsg, setErrMsg] = useState('');

  const errRef = useRef();

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  // const handleAdminChange = (checked) => {
  //   setAdmin(checked);
  // };

  const handleAdminChange = async (checked) => {
    setAdmin(checked);
    await handleSubmit();
  };

  const handleDisableChange = (checked) => {
    setDisable(checked);
  };

  useEffect((e) => {
    const getUser = async () => {
      const id = window.location.href.split("/")[4];

      try {
        const response = await axiosPrivate.get(`/users/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          withCredentials: true
        });

        setAdmin(response.data.user.admin);
        setDisable(response.data.user.disable);

      } catch (err) {
        console.error(err);
        navigate('/sign-in');
      }
    }

    getUser();
  }, [axiosPrivate, navigate])

  const handleSubmit = async () => {

    const id = window.location.href.split("/")[4];
    const payload = { admin: !admin, disable }
    console.log(payload)

    try {
      const response = await axiosPrivate.put(`/users/${id}`,
        JSON.stringify(payload),
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          withCredentials: true
        }
      );

      console.log(JSON.stringify(response?.data));
      // navigate("/users")

    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response!');
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
            </span> Edit User</h6>
          </div>
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
          <div className="form-data">
            <div className="frm m-auto pt-pr">
              <div className="fm">
                <form onSubmit={handleSubmit}>
                  <button className="btn" type='submit'>Save</button>
                  <label>
                    <span>Admin:</span>
                    <Switch
                      className="switch"
                      onChange={handleAdminChange}
                      checked={admin}
                      uncheckedIcon={null}
                      checkedIcon={null}
                      onColor="#86d3ff"
                      offColor="#cccccc"
                      onHandleColor="#2693e6"
                      offHandleColor="#ffffff"
                      height={25}
                      width={55}
                    />
                  </label>
                  <br />
                  <label>
                    <span>Disable:</span>
                    <Switch
                      className="switch"
                      onChange={handleDisableChange}
                      checked={disable}
                      uncheckedIcon={null}
                      checkedIcon={null}
                      onColor="#86d3ff"
                      offColor="#cccccc"
                      onHandleColor="#2693e6"
                      offHandleColor="#ffffff"
                      height={25}
                      width={55}
                    />
                  </label>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditMeal
