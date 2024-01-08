import React, { useEffect, useState } from 'react';
import './LogOutModal.scss';

const LogOutModal = () => {
  const name = localStorage.getItem("logoutName");
  const [isModalVisible, setIsModalVisible] = useState(false)

  const logout = () => {
    let keysToRemove = ["token", "email", "hash", "firstName", "name", "logoutName"];

    keysToRemove.forEach((k) => {
      localStorage.removeItem(k)
    });

    setIsModalVisible(false);
    window.location.href = '/';
  }

  useEffect(() => {
    setIsModalVisible(true);
  }, [setIsModalVisible])

  return (
    <div className={`logout-modal ${isModalVisible ? 'act' : ''}`}>
      <div className="modal-content">
        <button onClick={logout}>Log out @{name}</button>
      </div>
    </div>
  )
}

export default LogOutModal;
