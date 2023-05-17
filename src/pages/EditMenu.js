import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import SideNav from './SideNav';

const EditMenu = () => {
  const [errMsg, setErrMsg] = useState('');
  const [meals, setMeals] = useState();
  const [menu, setMenu] = useState();

  const [mealIds, setMealIds] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState([]);

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
    const payload = { meals };

    const id = window.location.href.split("/")[4];
    try {
      const response = await axiosPrivate.put(`/menus/${id}`,
        JSON.stringify(payload), {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        withCredentials: true
      });

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
                  <th className="text-center text-secondary ">#</th>
                  <th className="text-center text-secondary ">Meals</th>
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
                          <button
                            disabled={selectedMeals.includes(meal)}
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
