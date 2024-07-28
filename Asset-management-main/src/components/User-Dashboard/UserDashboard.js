import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from '../../custom-hooks/user';
import UserTable from './user_requests';
import AssetsTable from "../AssetsTableAdm";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [assets, setAssets] = useState([]);

  const fetchAssets = async () => {
    try {
      const response = await fetch('http://localhost:5000/assets');
      const data = await response.json();
      setAssets(data);
    } catch (err) {
      console.error("Error fetching assets: ", err);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  function handleLogoutClick() {
    navigate('/');
    localStorage.removeItem("jwt");
    setUser(null);
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <nav className="w-64 h-screen bg-emerald-500 p-4 shadow-xl">
        <div className="flex flex-col h-full">
          <NavLink className="px-4 py-2 mb-4 text-lg uppercase font-bold text-white hover:opacity-75" to='/employee'>
            E-nventory
          </NavLink>
          <div className="flex-grow">
            <ul className="flex flex-col">
              <li className="nav-item mb-2">
                <NavLink className="px-4 py-2 text-xs uppercase font-bold text-white hover:opacity-75" to='/registercomplaint'>
                  Register Complaint
                </NavLink>
              </li>
              <li className="nav-item mb-2">
                <NavLink className="px-4 py-2 text-xs uppercase font-bold text-white hover:opacity-75" to='/updatemaintenance'>
                  Update Maintenance Status
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="flex flex-col items-center">
            <p className="px-4 py-2 text-xs font-bold uppercase text-white">
              {user ? user.name : null}
            </p>
            <button onClick={handleLogoutClick} className="px-4 py-2 mt-4 text-white hover:opacity-75">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow p-6">
        <div className="relative flex flex-wrap items-center justify-between px-5 mb-4">
          <Title className="text-lg font-bold uppercase leading-snug text-dark">
            Asset Requests
          </Title>
          <button
            type="button"
            className="inline-block px-6 py-2.5 bg-emerald-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-600 hover:shadow-lg focus:bg-green-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-700 active:shadow-lg transition duration-150 ease-in-out"
            onClick={() => navigate('/allocated')}
          >
            My Assets
          </button>
        </div>
        <Divider />
        {/* Assets Section */}
        <UserTable assets={assets} />
      </div>
    </div>
  );
};

const Divider = styled.hr`
  border: none;
  border-bottom: 2px solid green;
  margin: 20px 0;
`;

const Title = styled.h3`
  background: whitesmoke;
  font-size: 20px;
`;

export default UserDashboard;
