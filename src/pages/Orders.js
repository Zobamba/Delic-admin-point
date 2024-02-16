import React, { useState, useEffect, useRef } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import LoadingSpinner from './LoadingSpinner';
import Notification from './Notification';
import useAuth from '../hooks/useAuth';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Forbidden from '../assets/img/403-Error-Forbidden.svg';
import SideNav from './SideNav';

const Orders = () => {
  const [orders, setOrders] = useState();
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
    const getOrders = async () => {
      try {
        const response = await axiosPrivate.get('/orders', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          withCredentials: true
        });

        console.log(response.data);
        setOrders(response.data.orders);

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

    getOrders();

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
          <SideNav currentTab="orders" />
        </div>
        <div className="container">
          <div className="row">
            <div className="card-header">
              <button onClick={() => setMenuIsOpen(!menuIsOpen)} type="button" className="title-bar">
                <div className="menu-icon dark" type="button" data-toggle="main-nav"></div>
              </button>
              <div className="header-content">
                <Link to={`${orders ? "/addOrder" : ""}`}>
                  <span>Add Order</span>
                </Link>
                <h6 className="mb-0 text-sm">Orders</h6>
              </div>
            </div>
            {
              loading ?
                <LoadingSpinner loading={loading} />
                :
                <div className="table-responsive">
                  {orders ?
                    <table className="table">
                      <thead>
                        <tr>
                          <th className="text-center text-secondary ">Order Id</th>
                          <th className="text-center text-secondary ">Date</th>
                          <th className="text-center text-secondary">Status Order</th>
                          <th className="text-center text-secondary ">Phone Number</th>
                          <th className="text-center text-secondary">Location</th>
                          <th className="text-center text-secondary ">Amount</th>
                          <th className="text-center text-secondary">See More </th>
                        </tr>
                      </thead>

                      <tbody>
                        {orders.map((order, i) => {

                          return (
                            <tr key={i}>
                              <td className="align-middle">
                                <p>#DC40{order.order.id}</p>
                              </td>
                              <td className="align-middle">
                                <span className="font-weight-bold">{new Date(order.order.createdAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}</span>
                              </td>
                              <td className="align-middle">
                                <span className={`font-weight-bold status ${order.order.status === 'pending' ? 'pending'
                                  : order.order.status === 'delivered' ? 'delivered' : order.order.status === 'processing' ? 'processing' : ''}`}>
                                  {order.order.status.charAt(0).toUpperCase() + order.order.status.slice(1)}
                                </span>
                              </td>
                              <td className="align-middle">
                                <span className="font-weight-bold">{order.order.phoneNumber}</span>
                              </td>
                              <td className="align-middle">
                                <p className="text-xs mb-0 address">{order.order.address}</p>
                              </td>
                              <td className="align-middle">
                                <span className="font-weight-bold">
                                  &#8358;{order.totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </span>
                              </td>
                              <td className="align-middle">
                                <Link
                                  to={`/orders/${order.order.id}`}
                                  title='View Order'
                                  className="view">
                                  <span>View</span>
                                </Link>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                    :
                    <div className="forbidden" ref={errRef}>
                      <img src={Forbidden} alt="Forbidden" />
                      <p className={errMsg ? "err-msg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    </div>
                  }
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

export default Orders;
