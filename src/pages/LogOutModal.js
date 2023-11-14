import React, { useEffect, useState } from 'react';
import './LogOutModal.scss';

const LogOutModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const name = localStorage.getItem("name");

  const logout = () => {
    let keysToRemove = ["token", "email", "hash", "name"];

    keysToRemove.forEach((k) => {
      localStorage.removeItem(k)
    });

    setIsModalVisible(false);
    window.location.href = '/';
  }

  useEffect(() => {
    setIsModalVisible(true);
  })

  return (
    <div className={`logout-modal ${isModalVisible ? 'act' : ''}`}>
      <div className="modal-content">
        <button onClick={logout}>Log out @{name}</button>
      </div>
    </div>
  )
}

export default LogOutModal;
