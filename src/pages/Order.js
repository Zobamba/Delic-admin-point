import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import LoadingSpinner from './LoadingSpinner';
import Notification from './Notification';
import useAuth from '../hooks/useAuth';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import DeleteOrderModal from './DeleteOrderModal';
import SideNav from './SideNav';

const Order = () => {
  const [order, setOrder] = useState();
  const [totalPrice, setTotalPrice] = useState();

  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [item, setItem] = useState();
  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();
  const location = useLocation();

  const { notification, setNotification } = useAuth();

  const closeNotification = () => {
    setNotification(null);
  };


  useEffect(() => {
    const getOrder = async () => {
      const id = window.location.href.split("/")[4];

      try {
        const response = await axiosPrivate.get(`/orders/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          withCredentials: true
        });

        console.log(response.data);
        setOrder(response.data.order);
        setTotalPrice(response.data.totalPrice);

      } catch (err) {
        console.error(err);
        navigate('/sign-in', { state: { from: location }, replace: true });
      }
    }

    getOrder();
  }, [axiosPrivate, navigate, location]);

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
              <SideNav currentTab="orders" />
            </div>
            <div className="container">
              {modalOpen &&
                <DeleteOrderModal
                  setModalOpen={setModalOpen}
                  modalOpen={modalOpen}
                  item={item}
                />}

              <div className="row mt">
                <div className="card-header">
                  <div className="header-content">
                    <h6 className="mb-0 text-sm">Order Overview</h6>
                  </div>
                </div>
                <ol className="breadcrumb">
                  <li><Link to={"/orders"}>Orders</Link></li>
                  <li>Order Overview</li>
                </ol>

                {order &&
                  <div className="form-data">
                    <div className="frm m-auto pt-pr">
                      <div className="frm-header">
                        <h6 className="mb-0 text-sm">
                          <span>
                            <Link
                              to={`/editOrder/${order.id}`}>
                              <FontAwesomeIcon title="Edit order" className="icon-edit" icon={faEdit} />
                            </Link>
                          </span>Order details
                          <span className={`font-weight-bold status ${order.status === 'pending' ? 'pending'
                            : order.status === 'delivered' ? 'delivered' : order.status === 'processing' ? 'processing' : ''}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                        </h6>
                      </div>
                      <div className="info">
                        <div className="d-flex">
                          <p className="sub-info">
                            <span className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                              <i className="ni text-sm">
                                <FontAwesomeIcon icon={faLocationDot} />
                              </i>
                            </span>
                            {order.address}
                          </p>
                          <p className="sub-info">
                            <span className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                              <i className="ni text-sm">
                                <FontAwesomeIcon icon={faPhone} />
                              </i>
                            </span>
                            {order.phoneNumber}
                          </p>
                          <p className="sub-info">
                            <span className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                              <i className="ni text-sm">
                                {/* <FontAwesomeIcon icon={faLocationDot} /> */}
                              </i>
                            </span>
                            <span className="label">Total:</span>
                            <span className="font-weight-bold">
                              &#8358;{totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </span>
                          </p>
                        </div>
                        <div className="d-flex">
                          <p className="sub-info">
                            <span className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                              <i className="ni text-sm">
                                <FontAwesomeIcon icon={faCalendarAlt} />
                              </i>
                            </span>
                            <span className="label">Created</span>
                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <p className="sub-info">
                            <span className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                              <i className="ni text-sm">
                                {/* <FontAwesomeIcon icon={faList12} /> */}
                              </i>
                            </span>
                            <span className="label">Meals Count:</span>
                            {order.meals.length}
                          </p>
                          <p className="sub-info">
                            <span className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                              <i className="ni text-sm">
                                {/* <FontAwesomeIcon icon={faLocationDot} /> */}
                              </i>
                            </span>
                            <span className="label">Order Id:</span>
                            {order.id}
                          </p>
                        </div>
                        <div className="d-flex">
                          <p className="sub-info">
                            <span className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                              <i className="ni text-sm">
                                <FontAwesomeIcon icon={faCalendarAlt} />
                              </i>
                            </span>
                            <span className="label">Updated</span>
                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <p className="sub-info">
                            <span className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                              <i className="ni text-sm">
                                {/* <FontAwesomeIcon icon={faLocationDot} /> */}
                              </i>
                            </span>
                            <span className="label">Payment Reference:</span>
                            {order.paymentReference}
                          </p>
                        </div>
                      </div>
                      <div className="actions">
                        <button
                          className="delete"
                          type="button"
                          onClick={() => { setModalOpen(!modalOpen); setItem(order) }}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>}
              </div>
              <div className="row">
                <div className="hdr">
                  <h6 className="ttl">Order Meals</h6>
                </div>
                <div className="table-responsive m-top">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="text-center text-secondary ">Meal Id</th>
                        <th className="text-center text-secondary ">Name</th>
                        <th className="text-center text-secondary">Category</th>
                        <th className="text-center text-secondary ">Price</th>
                        <th className="text-center text-secondary ">Units</th>
                        <th className="text-center text-secondary ">Created</th>
                        <th className="text-center text-secondary ">Updated</th>
                      </tr>
                    </thead>
                    {order?.meals &&
                      <tbody>
                        {order.meals.map((meal, i) => {

                          return (
                            <tr key={i}>
                              <td className="align-middle">
                                <p>{meal.id}</p>
                              </td>
                              <td className="align-middle">
                                <Link
                                  to={`/meals/${meal.id}`}
                                  className="view">
                                  <span>{meal.name}</span>
                                </Link>
                              </td>
                              <td className="align-middle">
                                <span className="badge">{meal.category}</span>
                              </td>
                              <td className="align-middle">
                                <span className="font-weight-bold">
                                  {(meal.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </span>
                              </td>
                              <td className="align-middle">
                                <span className="font-weight-bold">
                                  {meal.orderMeal.units}
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
          </div>
      }
    </div>
  );
}

export default Order
