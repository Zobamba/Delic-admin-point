import React, { useState, useEffect, useRef } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Notification from './Notification';
import useAuth from '../hooks/useAuth';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import SideNav from './SideNav';

const Menus = () => {
  const [menus, setMenus] = useState();
  const [loading, setLoading] = useState(true);

  const errRef = useRef();
  const [errMsg, setErrMsg] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const axiosPrivate = useAxiosPrivate();
  const { notification, setNotification, menuIsOpen, setMenuIsOpen } = useAuth();

  const closeNotification = () => {
    setNotification(null);
  };

  useEffect(() => {
    const getMenus = async () => {
      try {
        const response = await axiosPrivate.get('/menus', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          withCredentials: true
        });

        setMenus(response.data.menus);

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

    getMenus();

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
      <div className="page-wrapper">
        <div className="sidenav">
          <SideNav currentTab="menus" />
        </div>
        <div className="container">
          <div className="row">
            <div className="card-header">
              <button onClick={() => setMenuIsOpen(!menuIsOpen)} type="button" className="title-bar">
                <div className="menu-icon dark" type="button" data-toggle="main-nav"></div>
              </button>
              <div className="header-content">
                <Link to="/addMenu">
                  <span>Add Menu</span>
                </Link>
                <h6 className="mb-0 text-sm">Menus</h6>
              </div>
            </div>
            {
              loading ?
                <LoadingSpinner loading={loading} />
                :
                <div className="table-responsive">
                  <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="text-center text-secondary ">Menu Id</th>
                        <th className="text-center text-secondary ">Created</th>
                        <th className="text-center text-secondary ">Updated</th>
                        <th className="text-center text-secondary ">Expiry Date</th>
                        <th className="text-center text-secondary">Meals Count</th>
                        <th className="text-center text-secondary">See More</th>
                      </tr>
                    </thead>
                    {menus &&
                      <tbody>
                        {menus.map((menu, i) => {

                          return (
                            <tr key={i}>
                              <td className="align-middle">
                                <p>#DC40{menu.id}</p>
                              </td>
                              <td className="align-middle">
                                <span className="font-weight-bold">{new Date(menu.createdAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}</span>
                              </td>
                              <td className="align-middle">
                                <span className="font-weight-bold">{new Date(menu.updatedAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}</span>
                              </td>
                              <td className="align-middle">
                                <span className="font-weight-bold">{menu.expiredAt === null ? "" : new Date(menu.expiredAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}</span>
                              </td>
                              <td className="align-middle">
                                <span className="font-weight-bold">{menu.meals.length}</span>
                              </td>
                              <td className="align-middle">
                                <Link
                                  to={`/menus/${menu.id}`}
                                  title='View Menu'
                                  className="view">
                                  <span>View</span>
                                </Link>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    }
                  </table>
                </div>
            }
          </div>
        </div>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={closeNotification}
          />
        )}
      </div>
    </div>
  );
}

export default Menus
