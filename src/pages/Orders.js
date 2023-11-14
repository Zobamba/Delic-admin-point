import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import SideNav from './SideNav';

const Orders = () => {

  const [orders, setOrders] = useState();
  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getOrders = async () => {
      console.log("here");
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
        navigate('/sign-in', { state: { from: location }, replace: true });
      }
    }

    getOrders();

  }, []);

  return (
    <div className="page-wrapper">
      <SideNav currentTab="orders" />
      <div className="container">
        <div className="row">
          <div className="card-header">
            <h6 className="mb-0 text-sm">  <span><FontAwesomeIcon title="Back" className="icon-back" icon={faArrowLeft} onClick={() => navigate(-1)} />
            </span> Orders</h6>
            <Link to="/addOrder">
              <span>Add Order</span>
            </Link>
            <br />
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th className="text-center text-secondary ">Order Id</th>
                  <th className="text-center text-secondary">Address</th>
                  <th className="text-center text-secondary ">Phone Number</th>
                  <th className="text-center text-secondary ">Created</th>
                  <th className="text-center text-secondary ">Updated</th>
                  {/* <th className="text-center text-secondary">Meals Count</th> */}
                  <th className="text-center text-secondary">See More </th>
                </tr>
              </thead>
              {orders &&
                <tbody>
                  {orders.map((order, i) => {

                    return (
                      <tr key={i}>
                        <td className="align-middle">
                          <p>{order.id}</p>
                        </td>
                        <td className="align-middle">
                          <p className="text-xs mb-0">{order.address}</p>
                        </td>
                        <td className="align-middle">
                          <span className="font-weight-bold">{order.phoneNumber}</span>
                        </td>
                        <td className="align-middle">
                          <span className="font-weight-bold">{new Date(order.createdAt).toDateString()}</span>
                        </td>
                        <td className="align-middle">
                          <span className="font-weight-bold">{new Date(order.updatedAt).toDateString()}</span>
                        </td>
                        {/* <td className="align-middle">
                          <span className="font-weight-bold">{order.meals.length}</span>
                        </td> */}
                        <td className="align-middle">
                          <Link
                            to={`/orders/${order.id}`}
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
    </div >
  );
}

export default Orders;
