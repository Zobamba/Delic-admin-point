import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import SideNav from './SideNav';

const AddOrder = () => {

  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const [meals, setMeals] = useState();
  const [mealIds, setMealIds] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState([]);

  const addressRef = useRef();
  const errRef = useRef();

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const handleAddMealClick = (meal) => {
    const newMeal = { ...meal, units: 1 };

    setSelectedMeals([...selectedMeals, newMeal]);
    setMealIds([...mealIds, meal.id]);
  }

  const handleRemoveClick = (id) => {
    setSelectedMeals(selectedMeals.filter(item => item.id !== id));
    setMealIds(mealIds.filter(item => item !== id));
  };

  const handleUnitsChange = (e, id) => {
    const meals = selectedMeals;

    const mealIndex = meals.findIndex(item => item.id === id);

    const meal = meals[mealIndex];

    meals[mealIndex] = { ...meal, units: e.target.value };

    setSelectedMeals([...meals]);
    console.log(selectedMeals);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const meals = selectedMeals.map(item => { return { mealId: item.id, units: parseInt(item.units) } })

    const payload = { address, phoneNumber, meals };
    console.log(payload);

    try {
      const response = await axiosPrivate.post('/orders',
        JSON.stringify(payload), {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        withCredentials: true
      }
      );

      console.log(JSON.stringify(response?.data));
      navigate("/orders")

    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response!');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized!');
      } else {
        setErrMsg('Failed!')
      }
      errRef.current.focus();
    }
  }

  useEffect(() => {
    addressRef.current.focus();
  }, [])

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
      }
    }

    getMeals();

  }, []);

  return (
    <div className="page-wrapper">
      <SideNav currentTab="orders" />
      <div className="container">
        <div className="row mt">
          <div className="card-header">
            <h6 className="mb-0 text-sm">  <span><FontAwesomeIcon title="Back" className="icon-back" icon={faArrowLeft} onClick={() => navigate(-1)} />
            </span> Create Order Record</h6>
          </div>
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
          <form onSubmit={handleSubmit}>
            <div className="table-responsive">
              <div className="add-btn">
                <button className="button order-btn" type='submit'>Create Order</button>
              </div>
              <div className="frm date pt-pr">
                <div className="fm">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    name="address"
                    ref={addressRef}
                    required="required"
                    placeholder="Enter an address..."
                    onChange={e => setAddress(e.target.value)} />
                  <label htmlFor="phone">PhoneNumber</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    required="required"
                    placeholder="Enter a phoneNumber..."
                    onChange={e => setPhoneNumber(e.target.value)} />
                </div>
              </div>
              <br />
              <table className="table">
                <thead>
                  <tr>
                    <th className="text-center text-secondary ">Selected Meals</th>
                    <th className="text-center text-secondary ">Units</th>
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
                              title="View meal"
                              className="view">
                              {meal.name}
                            </Link>
                          </td>
                          <td className="align-middle">
                            <input
                              type="number"
                              name="units"
                              defaultValue={meal.units}
                              min={1}
                              onChange={(e) => handleUnitsChange(e, meal.id)}
                            />
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
                  </tbody>}
              </table>
            </div>
          </form>
        </div>
        <div className="row">
          <div className="card-header">
            <h6 className="mb-0 ml text-sm">Meals Table</h6>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th className="text-center text-secondary ">Meal Id</th>
                  <th className="text-center text-secondary ">Meals</th>
                  <th className="text-center text-secondary">Category</th>
                  <th className="text-center text-secondary ">Price</th>
                  <th className="text-center text-secondary ">Created</th>
                  <th className="text-center text-secondary ">Updated</th>
                  <th className="text-center text-secondary"></th>
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

export default AddOrder
