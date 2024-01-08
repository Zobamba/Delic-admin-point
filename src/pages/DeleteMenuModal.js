import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';
import './DeleteModal.scss';

const DeleteMenuModal = ({ setModalOpen, item }) => {
  const axiosPrivate = useAxiosPrivate();
  const { setNotification } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const showNotification = (message, type) => {
    setNotification({ message, type });

    // Auto-hide the notification after a few seconds (e.g., 10 seconds)
    setTimeout(() => {
      setNotification(null);
    }, 10000);
  };

  const handleDeleteClick = () => {
    const deleteMenu = async () => {
      const id = window.location.href.split("/")[4];

      try {
        const response = await axiosPrivate.delete(`/menus/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          withCredentials: true
        });

        console.log(response.data);
        showNotification('Menu deleted successfully', 'success');
        navigate("/menus")

      } catch (err) {
        console.error(err);
        navigate('/sign-in', { state: { from: location }, replace: true });
      }
    }

    deleteMenu();
  };

  return (
    <section className="r-mdl">
      <div className="modal">
        <button
          className="close-btn"
          title="Close"
          onClick={() => { setModalOpen(); }}>
          <span>&times;</span>
        </button>
        <div className="modal-content">
          <h2 className="ttl">Do you want to continue?</h2>
          <div className="mdl">
            <p>All data about this menu will be deleted.</p>
            <button
              className="btn"
              onClick={() => { handleDeleteClick(item.id); setModalOpen(false); }}>
              Delete menu
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

DeleteMenuModal.propTypes = {
  setModalOpen: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
};

export default DeleteMenuModal;
