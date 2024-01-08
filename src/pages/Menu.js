import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Notification from './Notification';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import DeleteMenuModal from './DeleteMenuModal';
import SideNav from './SideNav';

const Menu = () => {
  const [menu, setMenu] = useState();
  const [item, setItem] = useState();

  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const axiosPrivate = useAxiosPrivate();
  const { notification, setNotification } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const closeNotification = () => {
    setNotification(null);
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
      {
        loading ?
          <LoadingSpinner loading={loading} />
          :
          <div className="page-wrapper">
            <div className="sidenav">
              <SideNav currentTab="menus" />
            </div>
            <div className="container">
              {modalOpen &&
                <DeleteMenuModal
                  setModalOpen={setModalOpen}
                  modalOpen={modalOpen}
                  item={item}
                />}

              <div className="row mt">
                <div className="card-header">
                  <div className="header-content">
                    <h6 className="mb-0 text-sm">Menu Overview</h6>
                  </div>
                </div>

                <ol className="breadcrumb">
                  <li><Link to={"/menus"}>Menus</Link></li>
                  <li>Menu Overview</li>
                </ol>

                {menu &&
                  <div className="form-data">
                    <div className="frm m-auto pt-pr">
                      <div className="frm-header">
                        <h2 className="mb-0 text-sm">
                          <span>
                            <Link
                              to={`/editMenu/${menu.id}`}>
                              <FontAwesomeIcon title="Edit menu" className="icon-edit" icon={faEdit} />
                            </Link>
                          </span>Menu details
                        </h2>
                      </div>

                      <div className="info">
                        <div className="d-flex">
                          <p className="sub-info">
                            <span className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                              <i className="ni text-sm">
                                <FontAwesomeIcon icon={faCalendarAlt} />
                              </i>
                            </span>
                            <span className="label">Created</span>
                            {new Date(menu.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <p className="sub-info">
                            <span className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                              <i className="ni text-sm">
                                {/* <FontAwesomeIcon icon={faCalendarAlt} /> */}
                              </i>
                            </span>
                            <span className="label">Meals Count:</span>
                            {menu.meals.length}
                          </p>
                        </div>

                        <div className="d-flex">
                          <p className="sub-info">
                            <span className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                              <i className="ni text-sm">
                                <FontAwesomeIcon icon={faCalendarAlt} />
                              </i>
                            </span>
                            <span className="label">Updated</span>
                            {new Date(menu.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <p className="sub-info">
                            <span className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                              <i className="ni text-sm">
                                {/* <FontAwesomeIcon icon={faCalendarAlt} /> */}
                              </i>
                            </span>
                            <span className="label">Menu Id:</span>
                            {menu.id}
                          </p>
                        </div>
                        <div className="d-flex">
                          <p className="sub-info">
                            <span className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                              <i className="ni text-sm">
                                <FontAwesomeIcon icon={faCalendarAlt} />
                              </i>
                            </span>
                            <span className="label">Expires</span>
                            {new Date(menu.expiredAt).toLocaleDateString("en-US", {
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
                          onClick={() => { setModalOpen(!modalOpen); setItem(menu) }}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>}
              </div>
              <div className="row">
                <div className="hdr">
                  <h6 className="ttl">Menu Meals</h6>
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
                                <span className="font-weight-bold">
                                  {(meal.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </span>
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
                            </tr>
                          )
                        })}
                      </tbody>
                    }
                  </table>
                </div>
              </div>
            </div>
            {notification && (
              <Notification
                message={notification.message}
                type={notification.type}
                onClose={closeNotification}
              />
            )}
          </div>
      }
    </div>
  );
}

export default Menu
