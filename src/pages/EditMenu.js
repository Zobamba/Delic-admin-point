import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import SideNav from './SideNav';

const EditMenu = () => {
  const [errMsg, setErrMsg] = useState('');
  const [meals, setMeals] = useState();

  const [expiredAt, setExpiredAt] = useState();
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

    const meals = selectedMeals.map((item) => item.id)
    const payload = { meals, expiredAt };

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
        setErrMsg('The expiry date must be in the future!');
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

        setMeals(response.data.meals);

      } catch (err) {
        console.error(err);
        navigate('/sign-in');
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

        setSelectedMeals(response.data.menu.meals);
        setMealIds(response.data.menu.meals.map((meal) => meal.id));

        const originalDate = new Date(response.data.menu.expiredAt);

        const year = originalDate.getFullYear();
        const month = String(originalDate.getMonth() + 1).padStart(2, '0');
        const day = String(originalDate.getDate()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;

        setExpiredAt(formattedDate)
      } catch (err) {
        console.error(err);
        navigate('/sign-in');
      }
    }

    getMenu();
    getMeals();
  }, []);

  return (
    <div className="page-wrapper">
      <SideNav currentTab="menus" />
      <div className="container">
        <div className="row mt">
          <div className="card-header">
            <h6 className="mb-0 text-sm">  <span><FontAwesomeIcon title="Back" className="icon-back" icon={faArrowLeft} onClick={() => navigate(-1)} />
            </span> Edit Menu</h6>
          </div>
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
          <form onSubmit={handleSubmit}>
            <div className="table-responsive">
              <div className="add-btn">
                <button className="button" type='submit'>Edit Menu</button>
              </div>
              <div className="frm pt-pr date">
                <div className="fm">
                  <label htmlFor="expiredAt">Expiry Date</label>
                  <input
                    type="date"
                    name="expiredAt"
                    required="required"
                    value={expiredAt}
                    onChange={e => setExpiredAt(e.target.value)} />
                </div>
              </div>

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
                          <td className="align-middle">
                            <Link
                              to={`/meals/${meal.id}`}
                              className="view">
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
                            <div className="actions">
                              <button
                                type='button'
                                className='delete'
                                onClick={() => handleRemoveClick(meal.id)}>remove</button>
                            </div>
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
          </form>
        </div>
        <div className="row">
          <div className="card-header">
            <h6 className="mb-0 ml text-sm">Meals table</h6>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th className="text-center text-secondary ">Meal Id</th>
                  <th className="text-center text-secondary ">Meal</th>
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
                            disabled={mealIds.includes(meal.id)}
                            className='button'
                            onClick={() => handleAddMealClick(meal)}>
                            Add Meal
                          </button>
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
