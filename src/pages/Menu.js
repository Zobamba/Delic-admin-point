import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import DeleteMenuModal from './DeleteMenuModal';
import SideNav from './SideNav';

const Menu = () => {
  const [menu, setMenu] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [item, setItem] = useState();

  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();
  const location = useLocation();

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
        {modalOpen &&
          <DeleteMenuModal
            setModalOpen={setModalOpen}
            modalOpen={modalOpen}
            item={item}
          />}
        <div className="row mt">
          <div className="card-header">
            <h6 className="mb-0 text-sm">  <span><FontAwesomeIcon title="Back"  className="icon-back" icon={faArrowLeft} onClick={() => navigate(-1)} />
            </span> Menu Overview</h6>
          </div>
          {menu &&
            <div className="form-data">
              <div className="frm m-auto pt-pr">
                <div className="frm-header">
                  <h6 className="mb-0 text-sm">
                    <span>
                      <Link
                        to={`/editMenu/${menu.id}`}>
                        <FontAwesomeIcon title="Edit menu" className="icon-edit" icon={faEdit} />
                      </Link>
                    </span>Menu details
                  </h6>
                </div>
                <div className="info">
                  <p className="sub-info">
                    <span className="label">Menu Id:</span>
                    {menu.id}
                  </p>
                  <p className="sub-info">
                    <span className="label">Meals Count:</span>
                    {menu.meals.length}
                  </p>
                  <p className="sub-info">
                    <span className="label">Created:</span>
                    {new Date(menu.createdAt).toDateString()}
                  </p>
                  <p className="sub-info">
                    <span className="label">Updated:</span>
                    {new Date(menu.createdAt).toDateString()}
                  </p>
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
          <div className="card-header">
            <h6 className="mb-0 ml text-sm">Menu Meals</h6>
          </div>
          <div className="p-reset">
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
                  </tbody>
                }
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Menu
