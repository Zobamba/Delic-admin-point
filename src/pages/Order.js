import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import SideNav from './SideNav';

const Order = () => {
  const [order, setOrder] = useState();
  const [totalPrice, setTotalPrice] = useState();
  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();
  const location = useLocation();

  const handleDeleteClick = () => {
    const deleteOrder = async () => {
      const id = window.location.href.split("/")[4];
      console.log(id);

      try {
        const response = await axiosPrivate.delete(`/orders/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          withCredentials: true
        });

        console.log(response.data);
        navigate("/orders")

      } catch (err) {
        console.error(err);
        navigate('/sign-in', { state: { from: location }, replace: true });
      }
    }

    deleteOrder();
  };

  useEffect(() => {
    const getOrder = async () => {
      const id = window.location.href.split("/")[4];
      console.log(id);

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
        <div className="row">
          <div className="card-header">
            <h6 className="mb-0 text-sm">  <span><FontAwesomeIcon className="icon-back" icon={faArrowLeft} onClick={() => navigate(-1)} />
            </span> order table</h6>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th className="text-center text-secondary ">#</th>
                  <th className="text-center text-secondary">Address</th>
                  <th className="text-center text-secondary ">PhoneNumber</th>
                  <th className="text-center text-secondary">MealsCount</th>
                  <th className="text-center text-secondary">TotalPrice</th>
                  <th className="text-center text-secondary ">Created</th>
                  <th className="text-center text-secondary ">Updated</th>
                  <th className="text-secondary"></th>
                </tr>
              </thead>
              {order &&
                <tbody>
                  <tr>
                    <td className="align-middle">
                      <p className="text-xs mb-0">{order.id}</p>
                    </td>
                    <td className="align-middle">
                      <span className="font-weight-bold">{order.address}</span>
                    </td>
                    <td className="align-middle">
                      <span className="font-weight-bold">{order.phoneNumber}</span>
                    </td>
                    <td className="align-middle">
                      <span className="font-weight-bold">{order.meals.length}</span>
                    </td>
                    <td className="align-middle">
                      <h6 className="mb-0 text-sm">#{totalPrice}</h6>
                    </td>
                    <td className="align-middle">
                      <span className="font-weight-bold">{new Date(order.createdAt).toDateString()}</span>
                    </td>
                    <td className="align-middle">
                      <span className="font-weight-bold">{new Date(order.updatedAt).toDateString()}</span>
                    </td>
                    <td className="align-middle">
                      <Link
                        to={`/editOrder/${order.id}`}
                        className="edit"
                      >
                        Edit
                      </Link>
                      <button
                        className="delete"
                        type="button"
                        onClick={() => handleDeleteClick(order.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              }
            </table>
          </div>
        </div>
        <div className="row mt">
          <div className="card-header">
            <h6 className="mb-0 text-sm">  <span><FontAwesomeIcon className="icon-back" icon={faArrowLeft} onClick={() => navigate(-1)} />
            </span> order Meals</h6>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th className="text-center text-secondary ">#</th>
                  <th className="text-center text-secondary ">Meals</th>
                  <th className="text-center text-secondary">Category</th>
                  <th className="text-center text-secondary ">Price</th>
                  <th className="text-center text-secondary ">Units</th>
                  <th className="text-center text-secondary ">Created</th>
                  <th className="text-center text-secondary ">Updated</th>
                  <th className="text-secondary"></th>
                </tr>
              </thead>
              {order?.meals &&
                <tbody>
                  {order.meals.map((meal, i) => {

                    return (
                      <tr key={i}>
                        <td className="align-middle">
                          <p className="text-xs mb-0">{meal.id}</p>
                        </td>
                        <td className="align-middle">
                          <h6 className="mb-0 text-sm">{meal.name}</h6>
                          <p className="text-xs mb-0">{meal.imageUrl}</p>
                        </td>
                        <td className="align-middle">
                          <span className="badge">{meal.category}</span>
                        </td>
                        <td className="align-middle">
                          <span className="font-weight-bold">{meal.price}</span>
                        </td>
                        <td className="align-middle">
                          <span className="font-weight-bold">{meal.orderMeal.units}</span>
                        </td>
                        <td className="align-middle">
                          <span className="font-weight-bold">{new Date(meal.createdAt).toDateString()}</span>
                        </td>
                        <td className="align-middle">
                          <span className="font-weight-bold">{new Date(meal.updatedAt).toDateString()}</span>
                        </td>
                        <td className="align-middle">
                          <Link to={`/meals/${meal.id}`}>
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
  );
}

export default Order
