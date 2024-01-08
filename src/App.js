import React from 'react';
import { Routes, Route } from 'react-router-dom';
import EntryPoint from './pages/EntryPoint';
import Dashboard from './pages/Dashboard';
import IconTop from './pages/IconTop';
import Meals from './pages/Meals';
import Meal from './pages/Meal';
import AddMeal from './pages/AddMeal';
import EditMeal from './pages/EditMeal';
import Menus from './pages/Menus';
import Menu from './pages/Menu';
import AddMenu from './pages/AddMenu';
import EditMenu from './pages/EditMenu';
import Orders from './pages/Orders';
import Order from './pages/Order';
import AddOrder from './pages/AddOrder';
import EditOrder from './pages/EditOrder';
import EmailVerification from './pages/EmailVerification';
import Profile from './pages/Profile';
import UpdateProfile from './pages/UpdateProfile';
import ChangePassword from './pages/ChangePassword';
import ResetPassword from './pages/ResetPassword';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Users from './pages/Users';
import User from './pages/User';
import EditUser from './pages/EditUser';
import './App.scss';

function App() {
  return (
    <Routes>
      <Route path="/" element={<EntryPoint />} />
      <Route path="/dashboard"
        element={
          <>
            <Dashboard />
            <IconTop />
          </>}
      />
      <Route path="/meals"
        element={
          <>
            <Meals />
            <IconTop />
          </>}
      />
      <Route path="/meals/:id" element={<Meal />} />
      <Route path="/addMeal" element={<AddMeal />} />
      <Route path="/editMeal/:id" element={<EditMeal />} />
      <Route path="/menus"
        element={
          <>
            <Menus />
            <IconTop />
          </>}
      />
      <Route path="/menus/:id"
        element={
          <>
            <Menu />
            <IconTop />
          </>}
      />
      <Route path="/addMenu"
        element={
          <>
            <AddMenu />
            <IconTop />
          </>}
      />
      <Route path="/editMenu/:id" element={<EditMenu />} />
      <Route path="/orders"
        element={
          <>
            <Orders />
            <IconTop />
          </>}
      />
      <Route path="/orders/:id"
        element={
          <>
            <Order />
            <IconTop />
          </>}
      />
      <Route path="/addOrder"
        element={
          <>
            <AddOrder />
            <IconTop />
          </>}
      />
      <Route path="/editOrder/:id" element={<EditOrder />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/updateProfile" element={<UpdateProfile />} />
      <Route path="/changePassword" element={<ChangePassword />} />
      <Route path="/resetPassword" element={<ResetPassword />} />
      <Route path="/emailVerification" element={<EmailVerification />} />
      <Route path="/users"
        element={
          <>
            <Users />
            <IconTop />
          </>}
      />
      <Route path="/users/:id" element={<User />} />
      <Route path="/editUser/:id" element={<EditUser />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
    </Routes>
  );
}

export default App;
