import React, { useState, useEffect, useRef } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import LoadingSpinner from './LoadingSpinner';
import Notification from './Notification';
import useAuth from '../hooks/useAuth';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactComponent as Insta } from '../assets/insta.svg';
import { ReactComponent as Fb } from '../assets/fb.svg';
import { faBell, faMoon } from '@fortawesome/free-regular-svg-icons';
import {
  faAngleDown, faAngleUp, faBowlRice, faListDots, faShoppingCart, faUsers
} from '@fortawesome/free-solid-svg-icons';
import LightOn from '../assets/img/light-on-sun.svg'
import { Chart } from 'singledivui';
import 'singledivui/dist/singledivui.min.css';
import Account from './Account';
import SideNav from './SideNav';
import './Dashboard.scss';

const Dashboard = () => {
  const [orders, setOrders] = useState();
  const [menusCount, setMenusCount] = useState();

  const [ordersCount, setOrdersCount] = useState();
  const [usersCount, setUsersCount] = useState();

  const [mealsCount, setMealsCount] = useState();
  const [isModalVisible, setIsModalVisible] = useState();

  const errRef = useRef();
  const [errMsg, setErrMsg] = useState('');

  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();
  const location = useLocation();

  const fullName = localStorage.getItem('name');
  const lastName = fullName.split(' ')[1];

  const nameAbbr = `${fullName.charAt(0)}${lastName.charAt(0)}`
  const { theme, toggleTheme, notification, setNotification } = useAuth();

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

        setMenusCount(response.data.count);

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

    const getOrders = async () => {
      try {
        const response = await axiosPrivate.get('/last-ten-orders', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          withCredentials: true
        });

        setOrders(response.data.orders);
        setOrdersCount(response.data.count);

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

    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get('/users', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          withCredentials: true
        });

        setUsersCount(response.data.count);

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

    const getMeals = async () => {
      try {
        const response = await axiosPrivate.get('/meals', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          withCredentials: true
        });

        setMealsCount(response.data.count);

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
    getOrders();
    getUsers();
    getMeals();
  }, [axiosPrivate, navigate, location]);

  const options = {
    data: {
      labels: ['Jun', 'Jul', 'Aug', 'Oct', 'Nov', 'Dec'],
      series: {
        points: [15, 9, 25, 18, 31, 25],
        pointRadius: '5px',
      }
    },
    height: 200,
    width: 350
  };

  useEffect(() => {
    new Chart('#chart1', {
      type: 'line',
      ...options,
      width: '100%',
      responsive: true,
      graphSettings: {
        yAxis: {
          startFromZero: true,
          gridLineSize: 0
        },

        xAxis: {
          startFromZero: true,
          gridLineSize: 0
        }
      },
    });

    new Chart('#chart2', {
      type: 'bar',
      ...options,
      width: '100%',
      responsive: true,
      graphSettings: {
        yAxis: {
          startFromZero: true,
          gridLineSize: 0
        },

        xAxis: {
          startFromZero: true,
          gridLineSize: 0
        }
      }
    });
  }, [options]);

  useEffect(() => {
    const fetchData = async () => {
      // Simulate API call or data loading delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Set loading to false once data is loaded
      setLoading(false);
    };

    fetchData();
  }, []);


  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <div>
      {
        loading ?
          <LoadingSpinner loading={loading} />
          :
          <div className="py-4" id={theme}>
            <div className="sidenav">
              <SideNav currentTab="dashboard" />
            </div>
            <div className="container">
              <div className="header" id={theme}>
                <div className="top-menu  scroll-reveal">
                  <div className="menu">
                    <nav>
                      <ul className="main-navigation open">
                        <li className="m-anim" onClick={() => toggleTheme()} >
                          {theme === "light" ?
                            <span><FontAwesomeIcon icon={faMoon} /></span>
                            :
                            <span><img src={LightOn} alt="" /></span>}
                        </li>
                        <li className="m-anim">
                          <span><FontAwesomeIcon icon={faBell} /></span>
                        </li>
                        <li className="m-anim no-hover">
                          <p className="wcm">Welcome</p>
                        </li>
                        <li className="m-anim no-hover">
                          <div className="user">
                            <p className="abbr">{nameAbbr}</p>
                          </div>
                        </li>
                        <li className="m-anim no-hover" onClick={() => setIsModalVisible(!isModalVisible)}>
                          {!isModalVisible ?
                            <span><FontAwesomeIcon icon={faAngleDown} /></span>
                            :
                            <span><FontAwesomeIcon icon={faAngleUp} /></span>}
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
              <div className="account">
                {isModalVisible && <Account />}
              </div>
              <div className="content">
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <div className="body">
                  <ul className="stats open" id={theme}>
                    <li className="stat-box">
                      <div className="box-cnt">
                        <div className="box-data">
                          {menusCount &&
                            <h2>{String(menusCount).padStart(2, '0')}</h2>}
                          <p className="box-text">Total Menus</p>
                        </div>
                        <span className="icon">
                          <i className="ni text-sm"><FontAwesomeIcon icon={faListDots} /></i>
                        </span>
                      </div>
                      <div className="btm-txt">
                        <div className="progress-container">
                          <div className="label">
                            <div className="percentage-label left">0%</div>
                            <div className="percentage-label right">45%</div>
                          </div>
                          <div className="progress-bar">
                            <div className="progress" style={{ width: "45%" }}></div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="stat-box">
                      <div className="box-cnt">
                        <div className="box-data">
                          {ordersCount &&
                            <h2>{String(ordersCount).padStart(2, '0')}</h2>}
                          <p className="box-text">Total Orders</p>
                        </div>
                        <span className="icon">
                          <i className="ni text-sm"><FontAwesomeIcon icon={faShoppingCart} /></i>
                        </span>
                      </div>
                      <div className="btm-txt">
                        <div className="progress-container">
                          <div className="label">
                            <div className="percentage-label left">0%</div>
                            <div className="percentage-label right">62%</div>
                          </div>
                          <div className="progress-bar">
                            <div className="progress" style={{ width: "62%" }}></div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="stat-box">
                      <div className="box-cnt">
                        <div className="box-data">
                          {usersCount &&
                            <h2>{String(usersCount).padStart(2, '0')}</h2>}
                          <p className="box-text">Total Clients</p>
                        </div>
                        <span className="icon">
                          <i className="ni text-sm"><FontAwesomeIcon icon={faUsers} /></i>
                        </span>
                      </div>
                      <div className="btm-txt">
                        <div className="progress-container">
                          <div className="label">
                            <div className="percentage-label left">0%</div>
                            <div className="percentage-label right">80%</div>
                          </div>
                          <div className="progress-bar">
                            <div className="progress" style={{ width: "80%" }}></div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="stat-box">
                      <div className="box-cnt">
                        <div className="box-data">
                          {usersCount &&
                            <h2>{String(mealsCount).padStart(2, '0')}</h2>}
                          <p className="box-text">Total Dishes</p>
                        </div>
                        <span className="icon">
                          <i className="ni text-sm"><FontAwesomeIcon icon={faBowlRice} /></i>
                        </span>
                      </div>
                      <div className="btm-txt">
                        <div className="progress-container">
                          <div className="label">
                            <div className="percentage-label left">0%</div>
                            <div className="percentage-label right">85%</div>
                          </div>
                          <div className="progress-bar">
                            <div className="progress" style={{ width: "85%" }}></div>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="info">
                  <ul className="info-list open" id={theme}>
                    <li className="info-box">
                      <div className="chart1" id="chart1">
                        <h2 id={theme}>Revenue</h2>
                      </div>
                    </li>
                    <li className="info-box">
                      <div className="chart2" id="chart2">
                        <h2 id={theme}>Order summary</h2>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="info">
                  <div className="info-list open" id={theme}>
                    <div className="order-box">
                      <div className="odr-hdr" id={theme}>
                        <h2 className="" id={theme}>Order List</h2>
                      </div>
                      <div className="table-responsive">
                        <table className="table" id={theme}>
                          <thead>
                            <tr>
                              <th className="text-center text-secondary ">Order Id</th>
                              <th className="text-center text-secondary ">Date</th>
                              <th className="text-center text-secondary">Location</th>
                              <th className="text-center text-secondary">Status Order</th>
                              <th className="text-center text-secondary ">Phone Number</th>
                              <th className="text-center text-secondary ">Amount</th>
                              <th className="text-center text-secondary">See More </th>
                            </tr>
                          </thead>
                          {orders &&
                            <tbody>
                              {orders.map((order, i) => {

                                return (
                                  <tr key={i} id={theme}>
                                    <td className="align-middle">
                                      <p>{order.order.id}</p>
                                    </td>
                                    <td className="align-middle">
                                      <span className="font-weight-bold">{new Date(order.order.createdAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                      })}</span>
                                    </td>
                                    <td className="align-middle">
                                      <p className="text-xs mb-0">{order.order.address}</p>
                                    </td>
                                    <td className="align-middle">
                                      <span className={`font-weight-bold status ${order.order.status === 'pending' ? 'pending'
                                        : order.order.status === 'delivered' ? 'delivered' : ''}`} id={theme}>
                                        {order.order.status.charAt(0).toUpperCase() + order.order.status.slice(1)}
                                      </span>
                                    </td>
                                    <td className="align-middle">
                                      <span className="font-weight-bold">{order.order.phoneNumber}</span>
                                    </td>
                                    <td className="align-middle">
                                      <span className="font-weight-bold">
                                        &#8358;{order.totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                      </span>
                                    </td>
                                    <td className="align-middle">
                                      <Link
                                        to={`/orders/${order.order.id}`}
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
                    </div>
                  </div>
                </div>
                <div className="footer">
                  <div className="footer-content">
                    <div className="copyright">
                      <p className="copy-info">Copyright © 2024 Delic, Inc. All rights reserved.</p>
                    </div>
                    <div className="social-icons scroll-reveal" data-duration="1500">
                      <div className="fb-i">
                        <Link to="">
                          <Fb />
                        </Link>
                      </div>
                      <div className="insta-i">
                        <Link to="">
                          <Insta />
                        </Link>
                      </div>
                    </div>
                  </div>
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
          </div>
      }
    </div>
  )
}

export default Dashboard
