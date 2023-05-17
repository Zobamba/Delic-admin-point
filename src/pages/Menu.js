import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import SideNav from './SideNav';

const Menu = () => {
  const [menu, setMenu] = useState();
  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();
  const location = useLocation();

  const handleDeleteClick = () => {
    const deleteMenu = async () => {
      const id = window.location.href.split("/")[4];

      try {
        const response = await axiosPrivate.delete(`/menus/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          withCredentials: true
        });

        console.log(response.data);
        navigate("/menus")

      } catch (err) {
        console.error(err);
        navigate('/sign-in', { state: { from: location }, replace: true });
      }
    }

    deleteMenu();
  };

  useEffect(() => {
    const getMenu = async () => {
      const id = window.location.href.split("/")[4];

      try {
        const response = await axiosPrivate.get(`/menus/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          withCredentials: true
        });

        console.log(response.data);
        setMenu(response.data.menu);

      } catch (err) {
        console.error(err);
        navigate('/sign-in', { state: { from: location }, replace: true });
      }
    }

    getMenu();
  }, []);

  return (
    <div className="page-wrapper">
      <SideNav currentTab="menus" />
      <div className="container">
        <div className="row">
          <div className="card-header">
            <h6 className="mb-0 text-sm">  <span><FontAwesomeIcon className="icon-back" icon={faArrowLeft} onClick={() => navigate(-1)} />
            </span> Menu table</h6>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th className="text-center text-secondary ">#</th>
                  <th className="text-center text-secondary ">Created</th>
                  <th className="text-center text-secondary ">Updated</th>
                  <th className="text-center text-secondary">MealsCount</th>
                  <th className="text-secondary"></th>
                </tr>
              </thead>
              {menu &&
                <tbody>
                  <tr>
                    <td className="align-middle">
                      <p>{menu.id}</p>
                    </td>
                    <td className="align-middle">
                      <span className="font-weight-bold">{new Date(menu.createdAt).toDateString()}</span>
                    </td>
                    <td className="align-middle">
                      <span className="font-weight-bold">{new Date(menu.updatedAt).toDateString()}</span>
                    </td>
                    <td className="align-middle">
                      <span className="font-weight-bold">{menu.meals.length}</span>
                    </td>
                    <td className="align-middle">
                      <Link
                        to={`/editMenu/${menu.id}`}
                        className="edit"
                      >
                        Edit
                      </Link>
                      <button
                        className="delete"
                        type="button"
                        onClick={() => handleDeleteClick(menu.id)}
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
        <div className="row">
          <div className="card-header">
            <h6 className="mb-0 text-sm">  <span><FontAwesomeIcon className="icon-back" icon={faArrowLeft} onClick={() => navigate(-1)} />
            </span> Menu Meals</h6>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th className="text-center text-secondary ">#</th>
                  <th className="text-center text-secondary ">Meals</th>
                  <th className="text-center text-secondary">Category</th>
                  <th className="text-center text-secondary ">Price</th>
                  <th className="text-center text-secondary ">Created</th>
                  <th className="text-center text-secondary ">Updated</th>
                  <th className="text-secondary"></th>
                </tr>
              </thead>
              {menu?.meals &&
                <tbody>
                  {menu.meals.map((meal, i) => {

                    return (
                      <tr key={i}>
                        <td className="align-middle">
                          <p>{meal.id}</p>
                        </td>
                        <td className="align-middle">
                          <h6 className="mb-0 text-sm">{meal.name}</h6>
                        </td>
                        <td className="align-middle">
                          <span className="badge">{meal.category}</span>
                        </td>
                        <td className="align-middle">
                          <span className="font-weight-bold">{meal.price}</span>
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

export default Menu
