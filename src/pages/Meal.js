import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import DeleteMealModal from './DeleteMealModal';
import SideNav from './SideNav';

const Meal = () => {
  const [meal, setMeal] = useState();
  const [item, setItem] = useState();
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);

  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();
  const location = useLocation();

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
  }, []);

  return (
    <div className="page-wrapper">
      <SideNav currentTab="meals" />
      <div className="container">
        {modalOpen &&
          <DeleteMealModal
            setModalOpen={setModalOpen}
            modalOpen={modalOpen}
            item={item}
          />}
        <div className="row">
          <div className="card-header">
            <h6 className="mb-0 text-sm">
              <span><FontAwesomeIcon title="Back" className="icon-back" icon={faArrowLeft} onClick={() => navigate(-1)} />
              </span> {name}</h6>
          </div>
          <div className="form-data">
            <div className={`img ${imageVisible ? 'act' : ''}`}>
              <img src={imageUrl} alt="" />
            </div>
            {meal &&
              <div className="frm pt-pr">
                <div className="frm-header">
                  <h6 className="mb-0 text-sm">
                    <span>
                      <Link
                        to={`/editMeal/${meal.id}`}>
                        <FontAwesomeIcon title="Edit meal" className="icon-edit" icon={faEdit} />
                      </Link>
                    </span>Meal details
                  </h6>
                </div>
                <div className="info">
                  <p className="sub-info">
                    {meal.description}
                  </p>
                  <p className="sub-info">
                    <span className="label">Price:</span>
                    <span className="font-weight-bold">
                      &#8358;{(meal.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </span>
                  </p>
                  <p className="sub-info">
                    <span className="label">Category:</span>
                    {meal.category}
                  </p>
                  <p className="sub-info">
                    <span className="label">Meal Id:</span>
                    {meal.id}
                  </p>
                  <p className="sub-info">
                    <span className="label">Created:</span>
                    {new Date(meal.createdAt).toDateString()}
                  </p>
                  <p className="sub-info">
                    <span className="label">Updated:</span>
                    {new Date(meal.updatedAt).toDateString()}
                  </p>
                </div>
                <div className="actions">
                  <button
                    className="delete"
                    type="button"
                    onClick={() => { setModalOpen(!modalOpen); setItem(meal) }}
                  >
                    Delete
                  </button>
                </div>
              </div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Meal
