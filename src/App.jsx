import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import './App.css';
import './index.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { useState } from 'react';
import Header from './Layouts/Header';
import Dashboard from './Components/Dashboard';
import Login from './Components/Authentication/Login';
import Logout from './Components/Authentication/Logout';
import Addcategories from './Components/Addcategories';
import Additems from './Components/Additems';
import Users from './Components/Users';
import Addexercisecategories from './Components/Addexercisecategories';
import Addexercises from './Components/Addexercises';
import Challanges from './Components/Challanges';
import Userdetails from './Components/Userdetails';

const isAuthenticated = () => {
  const userId = localStorage.getItem('getfituserid');
  return userId !== null && userId !== '';
};

function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

function LayoutWrapper({ children }) {
  const location = useLocation();
  const hideHeader = location.pathname === '/login';
  return (
    <>
      {!hideHeader && <Header />}
      {children}
    </>
  );
}

function App() {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/addcategories"
            element={
              <PrivateRoute>
                <Addcategories />
              </PrivateRoute>
            }
          />
          <Route
            path="/additems"
            element={
              <PrivateRoute>
                <Additems />
              </PrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <Users />
              </PrivateRoute>
            }
          />
          <Route
            path="/addexercises"
            element={
              <PrivateRoute>
                <Addexercises />
              </PrivateRoute>
            }
          />
          <Route
            path="/addexercisecategories"
            element={
              <PrivateRoute>
                <Addexercisecategories />
              </PrivateRoute>
            }
          />
          <Route
            path="/challanges"
            element={
              <PrivateRoute>
                <Challanges />
              </PrivateRoute>
            }
          />
            <Route
            path="/details/:id"
            element={
              <PrivateRoute>
                <Userdetails />
              </PrivateRoute>
            }
          />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;
