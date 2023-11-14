import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import SideNav from './SideNav';

const Users = () => {
  const [users, setUsers] = useState();
  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();
  const location = useLocation();

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
        navigate('/sign-in', { state: { from: location }, replace: true });
      }
    }

    getUsers();

  }, []);

  return (
    <div className="page-wrapper">
      <SideNav currentTab="users" />
      <div className="container">
        <div className="row">
          <div className="card-header">
            <h6 className="mb-0 text-sm">  <span><FontAwesomeIcon title="Back" className="icon-back" icon={faArrowLeft} onClick={() => navigate(-1)} />
            </span> Users table</h6>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th className="text-center text-secondary">User Id</th>
                  <th className="text-center text-secondary">Name</th>
                  <th className="text-center text-secondary">Email</th>
                  <th className="text-center text-secondary">Admin</th>
                  <th className="text-center text-secondary">Disabled</th>
                  <th className="text-center text-secondary">Phone Number</th>
                  <th className="text-center text-secondary">Created</th>
                  <th className="text-center text-secondary">Updated</th>
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
                            title="View user"
                            to={`/users/${user.id}`}
                            className="view">
                            {user.firstName} {user.lastName}
                          </Link>
                        </td>
                        <td className="align-middle">
                          <p className="text-xs mb-0">{user.email}</p>
                        </td>
                        <td className="align-middle">
                          <span className="badge">{String(user.admin)}</span>
                        </td>
                        <td className="align-middle">
                          <span className="badge">{String(user.disable)}</span>
                        </td>
                        <td className="align-middle">
                          <span className="font-weight-bold">{user.phoneNumber}</span>
                        </td>
                        <td className="align-middle">
                          <span className="font-weight-bold">{new Date(user.createdAt).toDateString()}</span>
                        </td>
                        <td className="align-middle">
                          <span className="font-weight-bold">{new Date(user.updatedAt).toDateString()}</span>
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
  );
};

export default Users;
