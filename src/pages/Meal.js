import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import SideNav from './SideNav';

const Meal = () => {
  const [meal, setMeal] = useState();
  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();
  const location = useLocation();

  const handleDeleteClick = async (id) => {
    try {
      const response = await axiosPrivate.delete(`/meals/${id}`, {
      });
      console.log(response.data);
      navigate("/meals")

    } catch (err) {
      console.error(err);
      navigate('/sign-in', { state: { from: location }, replace: true });
    }
  }

  useEffect(() => {
    const getMeal = async () => {
      const id = window.location.href.split("/")[4];

      try {
        const response = await axiosPrivate.get(`/meals/${id}`, {
        });
        console.log(response.data);
        setMeal(response.data);

      } catch (err) {
        console.error(err);
        navigate('/sign-in', { state: { from: location }, replace: true });
      }
    }

    getMeal();
  }, []);

  return (
    <div className="page-wrapper">
      <SideNav currentTab="meals" />
      <div className="container">
        <div className="row">
          <div className="card-header">
            <h6 className="mb-0 text-sm">  <span><FontAwesomeIcon className="icon-back" icon={faArrowLeft} onClick={() => navigate(-1)} />
            </span> Meal Table</h6>
          </div>
          <div className="table-responsive">
            <table className="table">
              <tr>
                <th className="text-center text-secondary ">#</th>
                <th className="text-center text-secondary ">Name</th>
                <th className="text-center text-secondary">Category</th>
                <th className="text-center text-secondary ">Price</th>
                <th className="text-center text-secondary ">Created</th>
                <th className="text-center text-secondary ">Updated</th>
                <th className="text-secondary"></th>
              </tr>
              {meal &&
                <tbody>
                  <tr>
                    <td className="align-middle">
                      <p>{meal.id}</p>
                    </td>
                    <td className="align-middle">
                      <h6 className="mb-0 text-sm">{meal.name}</h6>
                      <Link to={`${meal.imageUrl}`} target="black">View Image</Link>
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
                      <Link
                        to={`/editMeal/${meal.id}`}
                        className="edit"
                      >
                        Edit
                      </Link>
                      <button
                        className="delete"
                        type="button"
                        onClick={() => handleDeleteClick(meal.id)}
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
      </div>
    </div>
  );
}

export default Meal
