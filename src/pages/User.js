import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation, Link } from "react-router-dom";
import SideNav from './SideNav';

const User = () => {
  const [user, setUser] = useState();
  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getUsers = async () => {
      const id = window.location.href.split("/")[4];

      try {
        const response = await axiosPrivate.get(`/users/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          withCredentials: true
        });

        console.log(response);
        setUser(response.data.user);

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
            <h6 className="mb-0 text-sm">User</h6>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th className="text-secondary ">#</th>
                  <th className="text-secondary ">User</th>
                  <th className="text-center text-secondary">Admin</th>
                  <th className="text-center text-secondary ">Disabled</th>
                  <th className="text-center text-secondary ">Phone</th>
                  <th className="text-center text-secondary ">Created</th>
                  <th className="text-center text-secondary ">Updated</th>
                  <th className="text-secondary"></th>
                </tr>
              </thead>
              {user &&
                <tbody>
                  <tr>
                    <td>
                      <p className="text-xs mb-0">{user.id}</p>
                    </td>
                    <td>
                      <h6 className="mb-0 text-sm">{user.firstName} {user.lastName}</h6>
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
                    <td className="align-middle">
                      <Link
                        to={`/editUser/${user.id}`}
                        className="edit">
                        Edit
                      </Link>
                    </td>
                  </tr>
                </tbody>
              }
            </table>
          </div>
        </div>
      </div>
    </div >
  );
};

export default User;
