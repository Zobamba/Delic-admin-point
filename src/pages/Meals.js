import React, { useState, useEffect, useRef } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Notification from './Notification';
import useAuth from '../hooks/useAuth';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import SideNav from './SideNav';
import './Table.scss';

const Meals = () => {
  const [meals, setMeals] = useState();
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
    const getMeals = async () => {
      try {
        const response = await axiosPrivate.get('/meals', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          withCredentials: true
        });

        console.log(response.data);
        setMeals(response.data.meals);

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

    getMeals();

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
              <SideNav currentTab="meals" />
            </div>
            <div className="container">
              <div className="row">
                <div className="card-header">
                  <button onClick={() => setMenuIsOpen(!menuIsOpen)} type="button" className="title-bar">
                    <div className="menu-icon dark" type="button" data-toggle="main-nav"></div>
                  </button>
                  <div className="header-content">
                    <Link to="/addMeal">
                      Add Meal
                    </Link>
                    <h6 className="mb-0 text-sm">Meals</h6>
                  </div>
                </div>
                <div className="table-responsive">
                  <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="text-center text-secondary ">Meal Id</th>
                        <th className="text-center text-secondary ">Name</th>
                        <th className="text-center text-secondary">Category</th>
                        <th className="text-center text-secondary ">Price</th>
                        <th className="text-center text-secondary ">Created</th>
                        <th className="text-center text-secondary ">Updated</th>
                      </tr>
                    </thead>
                    {meals &&
                      <tbody>
                        {meals.map((meal, i) => {
                          return (
                            <tr key={i}>
                              <td className="align-middle">
                                <p>#DC40{meal.id}</p>
                              </td>
                              <td className="align-middle">
                                <Link
                                  title="View Meal"
                                  to={`/meals/${meal.id}`}
                                  className="view">
                                  {meal.name}
                                </Link>
                              </td>
                              <td className="align-middle">
                                <span className="category">
                                  {meal.category.charAt(0).toUpperCase() + meal.category.slice(1)}
                                </span>
                              </td>
                              <td className="align-middle">
                                <span className="font-weight-bold">
                                  {(meal.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </span>
                              </td>
                              <td className="align-middle">
                                <span className="font-weight-bold">{new Date(meal.createdAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}</span>
                              </td>
                              <td className="align-middle">
                                <span className="font-weight-bold">{new Date(meal.updatedAt).toLocaleDateString("en-US", {
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
            {notification && (
              <Notification
                message={notification.message}
                type={notification.type}
                onClose={closeNotification}
              />
            )}
          </div >}
    </div>
  );
}

export default Meals
