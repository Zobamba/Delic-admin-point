import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import SideNav from './SideNav';

const Meals = () => {
  const [meals, setMeals] = useState();
  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();
  const location = useLocation();

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
        navigate('/sign-in', { state: { from: location }, replace: true });
      }
    }

    getMeals();

  }, []);

  return (
    <div className="page-wrapper">
      <SideNav currentTab="meals" />
      <div className="container">
        <div className="row">
          <div className="card-header">
            <h6 className="mb-0 text-sm">  <span><FontAwesomeIcon title="Back" className="icon-back" icon={faArrowLeft} onClick={() => navigate(-1)} />
            </span> Meals</h6>
            <Link to="/addMeal">
              <span>Add Meal</span>
            </Link>
            <br />
          </div>
          <div className="table-responsive">
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
                          <p>{meal.id}</p>
                        </td>
                        <td className="align-middle">
                          <Link
                          title="View meal"
                            to={`/meals/${meal.id}`}
                            className="view">
                            {meal.name}
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
                          <span className="font-weight-bold">{new Date(meal.createdAt).toDateString()}</span>
                        </td>
                        <td className="align-middle">
                          <span className="font-weight-bold">{new Date(meal.updatedAt).toDateString()}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>}
            </table>
          </div>
        </div>
      </div>
    </div >
  );
}

export default Meals
