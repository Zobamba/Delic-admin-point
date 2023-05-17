import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation, Link } from "react-router-dom";
import SideNav from './SideNav';

const Orders = () => {

  const [orders, setOrders] = useState();
  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();
  const location = useLocation();

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
            <h6 className="mb-0 text-sm">Orders table</h6>

            <Link to="/addOrder">
              <span>Create order</span>
            </Link>
            <br />
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th className="text-center text-secondary ">#</th>
                  <th className="text-center text-secondary">Address</th>
                  <th className="text-center text-secondary ">PhoneNumber</th>
                  <th className="text-center text-secondary ">Created</th>
                  <th className="text-center text-secondary ">Updated</th>
                  <th className="text-center text-secondary">MealsCount</th>
                  <th className="text-secondary"></th>
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
                          <span className="font-weight-bold">{order.address}</span>
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
                        <td className="align-middle">
                          <span className="font-weight-bold">{order.meals.length}</span>
                        </td>
                        <td className="align-middle">
                          <Link to={`/orders/${order.id}`}>
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
