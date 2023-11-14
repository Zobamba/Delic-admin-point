/* eslint-disable react/react-in-jsx-scope */
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Table from './pages/Table';
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
import RequestPasswordReset from './pages/RequestPasswordReset';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
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
      <Route path="/" element={<Dashboard />} />
      <Route path="/table" element={<Table />} />
      <Route path="/meals" element={<Meals />} />
      <Route path="/meals/:id" element={<Meal />} />
      <Route path="/addMeal" element={<AddMeal />} />
      <Route path="/editMeal/:id" element={<EditMeal />} />
      <Route path="/menus" element={<Menus />} />
      <Route path="/menus/:id" element={<Menu />} />
      <Route path="/addMenu" element={<AddMenu />} />
      <Route path="/editMenu/:id" element={<EditMenu />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/orders/:id" element={<Order />} />
      <Route path="/addOrder" element={<AddOrder />} />
      <Route path="/editOrder/:id" element={<EditOrder />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/editProfile" element={<EditProfile />} />
      <Route path="/changePassword" element={<ChangePassword />} />
      <Route path="/resetPassword" element={<ResetPassword />} />
      <Route path="/requestPasswordReset" element={<RequestPasswordReset />} />
      <Route path="/users" element={<Users />} />
      <Route path="/users/:id" element={<User />} />
      <Route path="/editUser/:id" element={<EditUser />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
    </Routes>
  );
}

export default App;
