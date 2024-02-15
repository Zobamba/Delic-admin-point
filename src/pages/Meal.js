import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Notification from './Notification';
import useAuth from '../hooks/useAuth';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBowlRice, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { faCreditCard, faEdit, faListAlt } from '@fortawesome/free-regular-svg-icons';
import DeleteMealModal from './DeleteMealModal';
import SideNav from './SideNav';

const Meal = () => {
  const [meal, setMeal] = useState();
  const [item, setItem] = useState();

  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);

  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();

  const { notification, setNotification, menuIsOpen, setMenuIsOpen } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const closeNotification = () => {
    setNotification(null);
  };

  useEffect(() => {
    const getMeal = async () => {
      const id = window.location.href.split("/")[4];

      try {
        const response = await axiosPrivate.get(`/meals/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          withCredentials: true
        });

        console.log(response.data);
        setMeal(response.data);
        setName(response.data.name);
        setImageUrl(response.data.imageUrl);

      } catch (err) {
        console.error(err);
        navigate('/sign-in', { state: { from: location }, replace: true });
      }
    }

    getMeal();
    setImageVisible(true);
  }, [axiosPrivate, navigate, location]);


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
      <div className="page-wrapper">
        <div className="sidenav">
          <SideNav currentTab="meals" />
        </div>
        <div className="container">
          {modalOpen &&
            <DeleteMealModal
              setModalOpen={setModalOpen}
              modalOpen={modalOpen}
              item={item}
            />}
          {
            loading ?
              <LoadingSpinner loading={loading} />
              :
              <div className="row">
                <div className="card-header">
                  <button onClick={() => setMenuIsOpen(!menuIsOpen)} type="button" className="title-bar">
                    <div className="menu-icon dark" type="button" data-toggle="main-nav"></div>
                  </button>
                  <div className="header-content">
                    <h6 className="mb-0 text-sm">{name}</h6>
                  </div>
                </div>
                <ol className="breadcrumb">
                  <li><Link to={"/meals"}>Meals</Link></li>
                  <li>{name}</li>
                </ol>
                <div className="form-data">
                  <div className={`img ${imageVisible ? 'act' : ''}`}>
                    <img src={imageUrl} alt="" />
                  </div>
                  {meal &&
                    <div className="form-center pt-pr">
                      <div className="frm-header">
                        <h6 className="mb-0 text-sm">
                          Meal details
                        </h6>
                        <span>
                          <Link
                            to={`/editMeal/${meal.id}`}>
                            <FontAwesomeIcon title="Edit meal" className="icon-edit" icon={faEdit} />
                          </Link>
                        </span>
                      </div>
                      <div className="info">
                        <div className="d-flex">
                          <p className="sub-info">
                            <span className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                              <i className="ni text-sm">
                                <FontAwesomeIcon icon={faBowlRice} />
                              </i>
                            </span>
                            {meal.description}
                          </p>
                          <p className="sub-info">
                            <span className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                              <i className="ni text-sm">
                                <FontAwesomeIcon icon={faCreditCard} />
                              </i>
                            </span>
                            <span className="label">Price:</span>
                            <span className="font-weight-bold">
                              &#8358;{(meal.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </span>
                          </p>
                        </div>

                        <div className="d-flex">
                          <p className="sub-info">
                            <span className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                              <i className="ni text-sm">
                                <FontAwesomeIcon icon={faListAlt} />
                              </i>
                            </span>
                            <span className="label">Category:</span>
                            {meal.category}
                          </p>
                          <p className="sub-info">
                            <span className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                              <i className="ni text-sm">
                                {/* <FontAwesomeIcon icon={faListAlt} /> */}
                              </i>
                            </span>
                            <span className="label">Meal Id:</span>
                            #DC40{meal.id}
                          </p>
                        </div>

                        <div className="d-flex">
                          <p className="sub-info">
                            <span className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                              <i className="ni text-sm">
                                <FontAwesomeIcon icon={faCalendarAlt} />
                              </i>
                            </span>
                            <span className="label">Created</span>
                            {new Date(meal.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <p className="sub-info">
                            <span className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                              <i className="ni text-sm">
                                <FontAwesomeIcon icon={faCalendarAlt} />
                              </i>
                            </span>
                            <span className="label">Updated</span>
                            {new Date(meal.updatedAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="actions">
                        <button
                          className="delete"
                          type="button"
                          onClick={() => { setModalOpen(!modalOpen); setItem(meal) }}>
                          Delete
                        </button>
                      </div>
                    </div>}
                </div>
              </div>
          }
        </div>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={closeNotification}
          />
        )}
      </div>
    </div>
  );
}

export default Meal
