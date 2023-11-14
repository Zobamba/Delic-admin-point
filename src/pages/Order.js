import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import DeleteOrderModal from './DeleteOrderModal';
import SideNav from './SideNav';

const Order = () => {
  const [order, setOrder] = useState();
  const [totalPrice, setTotalPrice] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [item, setItem] = useState();

  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();
  const location = useLocation();

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
  }, [])

  return (
    <div className="page-wrapper">
      <SideNav currentTab="orders" />
      <div className="container">
        {modalOpen &&
          <DeleteOrderModal
            setModalOpen={setModalOpen}
            modalOpen={modalOpen}
            item={item}
          />}
        <div className="row mt">
          <div className="card-header">
            <h6 className="mb-0 text-sm"><span><FontAwesomeIcon title="Back" className="icon-back" icon={faArrowLeft} onClick={() => navigate(-1)} />
            </span> Order Table</h6>
          </div>
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
                    <span className="status">{order.status}</span>
                  </h6>
                </div>
                <div className="info">
                  <p className="sub-info">
                    <span className="label">Address:</span>
                    {order.address}
                  </p>
                  <p className="sub-info">
                    <span className="">
                      {order.phoneNumber}
                    </span>
                  </p>
                  <p className="sub-info">
                    <span className="label">Total Price:</span>
                    <span className="font-weight-bold">
                      &#8358;{totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </span>
                  </p>
                  <p className="sub-info">
                    <span className="label">Meals Count:</span>
                    {order.meals.length}
                  </p>
                  <p className="sub-info">
                    <span className="label">Payment Reference:</span>
                    {order.paymentReference}
                  </p>
                  <p className="sub-info">
                    <span className="label">Order Id:</span>
                    {order.id}
                  </p>
                  <p className="sub-info">
                    <span className="label">Created:</span>
                    {new Date(order.createdAt).toDateString()}
                  </p>
                  <p className="sub-info">
                    <span className="label">Updated:</span>
                    {new Date(order.createdAt).toDateString()}
                  </p>
                </div>
                <div className="actions">
                  <button
                    className="delete"
                    type="button"
                    onClick={() => { setModalOpen(!modalOpen); setItem(order) }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>}
        </div>
        <div className="row">
          <div className="card-header">
            <h6 className="mb-0 ml text-sm">Order Meals</h6>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th className="text-center text-secondary ">Meal Id</th>
                  <th className="text-center text-secondary ">Meal</th>
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
                          <span className="font-weight-bold">{new Date(meal.createdAt).toDateString()}</span>
                        </td>
                        <td className="align-middle">
                          <span className="font-weight-bold">{new Date(meal.updatedAt).toDateString()}</span>
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
  );
}

export default Order
