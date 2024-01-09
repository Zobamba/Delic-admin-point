import React, { useState, useEffect, useRef } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import LoadingSpinner from './LoadingSpinner';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import SideNav from './SideNav';

const Users = () => {
  const [errMsg, setErrMsg] = useState('');
  const [users, setUsers] = useState();
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const axiosPrivate = useAxiosPrivate();
  const errRef = useRef();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get('/users', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          withCredentials: true
        });

        console.log(response);
        setUsers(response.data.users);

      } catch (err) {
        console.error(err);
        if (!err?.response) {
          setErrMsg('No Server Response!');
        } else if (err.response?.status === 403) {
          setErrMsg('Oops! You are not authorized to consume this resource.')
        } else {
          navigate('/sign-in', { state: { from: location }, replace: true });
        }
      }
    }

    getUsers();

  }, [axiosPrivate, location, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      // Simulate API call or data loading delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Set loading to false once data is loaded
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div>
      {
        loading ?
          <LoadingSpinner loading={loading} />
          :
          <div className="page-wrapper">
            <div className="sidenav">
              <SideNav currentTab="users" />
            </div>
            <div className="container">
              <div className="row">
                <div className="card-header">
                  <div className="header-content">
                    <h6 className="mb-0 text-sm">Users</h6>
                  </div>
                </div>
                <div className="table-responsive">
                  <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="text-center text-secondary">User Id</th>
                        <th className="text-center text-secondary">Name</th>
                        <th className="text-center text-secondary">Email</th>
                        <th className="text-center text-secondary">Admin</th>
                        <th className="text-center text-secondary">Disabled</th>
                        <th className="text-center text-secondary">Phone Number</th>
                        <th className="text-center text-secondary">Joined</th>
                      </tr>
                    </thead>
                    {users &&
                      <tbody>
                        {users.map((user, i) => {
                          return (
                            <tr key={i}>
                              <td className="align-middle">
                                <p>{user.id}</p>
                              </td>
                              <td className="align-middle">
                                <Link
                                  title="View User"
                                  to={`/users/${user.id}`}
                                  className="view">
                                  {user.firstName} {user.lastName}
                                </Link>
                              </td>
                              <td className="align-middle">
                                <p className="text-xs mb-0">{user.email}</p>
                              </td>
                              <td className="align-middle">
                                <span className="badge">{String(user.admin).charAt(0).toUpperCase() + String(user.admin).slice(1)}</span>
                              </td>
                              <td className="align-middle">
                                <span className="badge">{String(user.disable).charAt(0).toUpperCase() + String(user.disable).slice(1)}</span>
                              </td>
                              <td className="align-middle">
                                <span className="font-weight-bold">{user.phoneNumber}</span>
                              </td>
                              <td className="align-middle">
                                <span className="font-weight-bold">{new Date(user.createdAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}</span>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>}
                  </table>
                </div>
              </div>
            </div>
          </div >
      }
    </div>
  );
};

export default Users;
