import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import SideNav from './SideNav';

const EditMenu = () => {

  const [date, setDate] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const [meals, setMeals] = useState();
  const [menu, setMenu] = useState();

  const [mealIds, setMealIds] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState([]);

  const dateRef = useRef();
  const errRef = useRef();

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const handleAddMealClick = (meal) => {
    setSelectedMeals([...selectedMeals, meal]);
    setMealIds([...mealIds, meal.id]);
  }

  const handleRemoveClick = (id) => {
    setSelectedMeals(selectedMeals.filter(item => item.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const meals = selectedMeals.map(item => item.id)
    const payload = { date, meals };

    const id = window.location.href.split("/")[4];
    try {
      const response = await axiosPrivate.put(`/menus/${id}`,
        JSON.stringify(payload),
      );
      console.log(JSON.stringify(response?.data));

      navigate("/menus")

    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response!');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized!');
      } else if (err.response?.status === 400) {
        setErrMsg('A menu for the selected date already exist! It could be that the date is in the past!');
      } else {
        setErrMsg('Failed!')
      }
      errRef.current.focus();
    }
  }

  useEffect(() => {
    const getMeals = async () => {
      try {
        const response = await axiosPrivate.get('/meals', {
        });
        console.log(response.data);
        setMeals(response.data.meals);

      } catch (err) {
        console.error(err);
      }
    }

    const getMenu = async () => {
      const id = window.location.href.split("/")[4];
      try {
        const response = await axiosPrivate.get(`/menus/${id}`, {
        });

        setMenu(response.data.menu);
        setSelectedMeals(response.data.menu.meals);
        setMealIds(...mealIds, response.data.menu.meals.map(meal => meal.id));

      } catch (err) {
        console.error(err);
        navigate('/sign-in', { state: { from: location }, replace: true });
      }
    }

    getMenu(menu);
    getMeals();
  }, []);

  return (
    <div className="page-wrapper">
      <SideNav currentTab="menus" />
      <div className="container">
        <div className="row">
          <div className="card-header">
            <h6 className="mb-0 text-sm">  <span><FontAwesomeIcon className="icon-back" icon={faArrowLeft} onClick={() => navigate(-1)} />
            </span> Selected Meals</h6>
          </div>
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="date">Date</label>
            <input
              type="date"
              name="date"
              ref={dateRef}
              required="required"
              placeholder="Enter a meal..."
              onChange={e => setDate(e.target.value)} />

            <br />
            <br />
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th className="text-center text-secondary ">Selected Meals</th>
                    <th className="text-center text-secondary">Category</th>
                    <th className="text-center text-secondary ">Price</th>
                    <th className="text-secondary"></th>
                  </tr>
                </thead>
                {selectedMeals &&
                  <tbody>
                    {selectedMeals.map((meal, i) => {

                      return (
                        <tr key={i}>
                          <td className="align-link">
                            <Link to={`/meals/${meal.id}`}>
                              {meal.name}
                            </Link>
                          </td>
                          <td className="align-middle">
                            <span className="badge">{meal.category}</span>
                          </td>
                          <td className="align-middle">
                            <span className="font-weight-bold">{meal.price}</span>
                          </td>
                          <td className="align-middle">
                            <button
                              type='button'
                              className='delete'
                              onClick={() => handleRemoveClick(meal.id)}>remove</button>
                          </td>
                        </tr>
                      )
                    }
                    )}
                  </tbody>
                }
              </table>
            </div>
            <br />
            <button
              className="button"
              type='submit'>Edit Menu</button>
          </form>
        </div>
        <div className="row">
          <div className="card-header">
            <h6 className="mb-0 text-sm">  <span><FontAwesomeIcon className="icon-back" icon={faArrowLeft} onClick={() => navigate(-1)} />
            </span> Meals table</h6>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th className="text-secondary ">#</th>
                  <th className="text-secondary ">Meals</th>
                  <th className="text-center text-secondary">Category</th>
                  <th className="text-center text-secondary ">Price</th>
                  <th className="text-center text-secondary ">Created</th>
                  <th className="text-center text-secondary ">Updated</th>
                  <th className="text-secondary"></th>
                </tr>
              </thead>
              {meals &&
                <tbody>
                  {meals.map((meal, i) => {

                    return (
                      <tr key={i}>
                        <td id='id'>
                          <p className="text-xs mb-0">{meal.id}</p>
                        </td>
                        <td>
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
                          <span className="font-weight-bold">{new Date(meal.createdAt).toDateString()}</span>
                        </td>
                        <td className="align-middle">
                          <span className="font-weight-bold">{new Date(meal.updatedAt).toDateString()}</span>
                        </td>
                        <td className="align-middle">
                          <button
                            disabled={mealIds.includes(meal.id)}
                            className='button'
                            onClick={() => handleAddMealClick(meal)}>Add Meal</button>
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

export default EditMenu
