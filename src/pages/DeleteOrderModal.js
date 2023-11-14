import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import './DeleteModal.scss';

const DeleteOrderModal = ({ setModalOpen, item }) => {
  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();

  const location = useLocation();

  const handleDeleteClick = () => {
    const deleteOrder = async () => {
      const id = window.location.href.split("/")[4];
      console.log(id);

      try {
        const response = await axiosPrivate.delete(`/orders/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          withCredentials: true
        });

        console.log(response.data);
        navigate("/orders")

      } catch (err) {
        console.error(err);
        navigate('/sign-in', { state: { from: location }, replace: true });
      }
    }

    deleteOrder();
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
            <p>All data about this order will be deleted.</p>
            <button
              className="btn"
              onClick={() => { handleDeleteClick(item.id); setModalOpen(false); }}>
              Delete order
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

DeleteOrderModal.propTypes = {
  setModalOpen: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
};

export default DeleteOrderModal;
