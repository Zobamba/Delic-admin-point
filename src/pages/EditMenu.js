import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';
import SideNav from './SideNav';

const EditMenu = () => {
  const [errMsg, setErrMsg] = useState('');
  const [meals, setMeals] = useState();

  const [loading, setLoading] = useState(true);
  const [menuId, setMenuId] = useState();

  const [expiredAt, setExpiredAt] = useState();
  const [mealIds, setMealIds] = useState([]);

  const [selectedMeals, setSelectedMeals] = useState([]);
  const errRef = useRef();

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const { setNotification } = useAuth();

  const showNotification = (message, type) => {
    setNotification({ message, type });

    // Auto-hide the notification after a few seconds (e.g., 10 seconds)
    setTimeout(() => {
      setNotification(null);
    }, 10000);
  };

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
      showNotification('Save was successful', 'success');
      navigate(`/menus/${id}`);

    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response!');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized!');
      } else if (err.response?.status === 400) {
        setErrMsg('Oops! The expiry date must be in the future!');
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
        setMenuId(response.data.menu.id);
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
  }, [axiosPrivate, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      // Simulate API call or data loading delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Set loading to false once data is loaded
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div>
      {
        loading ?
          <LoadingSpinner loading={loading} />
          :
          <div className="page-wrapper">
            <div className="sidenav">
              <SideNav currentTab="menus" />
            </div>
            <div className="container">
              <div className="row mt">
                <div className="card-header">
                  <div className="header-content">
                    <h6 className="mb-0 text-sm">Edit Menu</h6>
                  </div>
                </div>
                <ol className="breadcrumb">
                  <li><Link to={"/menus"}>Menus</Link></li>
                  <li><Link to={`/menus/${menuId}`}>Menu</Link></li>
                  <li>Edit Menu</li>
                </ol>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <form onSubmit={handleSubmit}>
                  <div className="frm pt-pr date">
                    <div className="fm">
                      <div className="add-btn">
                        <button className="button" type='submit'>Save</button>
                      </div>
                      <label htmlFor="expiredAt">Expiry Date</label>
                      <input
                        type="date"
                        name="expiredAt"
                        required="required"
                        value={expiredAt}
                        onChange={e => setExpiredAt(e.target.value)} />
                    </div>
                  </div>
                  <div className="hdr">
                    <h6 className="ttl">Menu Meals</h6>
                  </div>
                  <div className="table-responsive m-top">
                    <table className="table">
                      <thead>
                        <tr>
                          <th className="text-center text-secondary ">Name</th>
                          <th className="text-center text-secondary">Category</th>
                          <th className="text-center text-secondary ">Price</th>
                          <th className="text-center text-secondary ">Action</th>
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
                                  <span className="category">
                                    {meal.category.charAt(0).toUpperCase() + meal.category.slice(1)}
                                  </span>
                                </td>
                                <td className="align-middle">
                                  <span className="font-weight-bold">{meal.price}</span>
                                </td>
                                <td className="align-middle">
                                  <div className="actions">
                                    <button
                                      type='button'
                                      className='delete'
                                      onClick={() => handleRemoveClick(meal.id)}>Remove</button>
                                  </div>
                                </td>
                              </tr>)
                          })}
                        </tbody>}
                    </table>
                  </div>
                </form>
              </div>

              <div className="row">
                <div className="hdr">
                  <h6 className="ttl">Meals Table</h6>
                </div>

                <div className="table-responsive m-top">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="text-center text-secondary ">Meal Id</th>
                        <th className="text-center text-secondary ">Name</th>
                        <th className="text-center text-secondary">Category</th>
                        <th className="text-center text-secondary ">Price</th>
                        <th className="text-center text-secondary ">Created</th>
                        <th className="text-center text-secondary ">Updated</th>
                        <th className="text-center text-secondary ">Action</th>
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
                                  to={`/meals/${meal.id}`}
                                  className="view">
                                  {meal.name}
                                </Link>
                              </td>
                              <td className="align-middle">
                                <span className="category">
                                  {meal.category.charAt(0).toUpperCase() + meal.category.slice(1)}
                                </span>
                              </td>
                              <td className="align-middle">
                                <span className="font-weight-bold">{meal.price}</span>
                              </td>
                              <td className="align-middle">
                                <span className="font-weight-bold">{new Date(meal.createdAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}</span>
                              </td>
                              <td className="align-middle">
                                <span className="font-weight-bold">{new Date(meal.updatedAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}</span>
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
                      </tbody>}
                  </table>
                </div>
              </div>
            </div>
          </div>
      }
    </div>
  );
}

export default EditMenu
