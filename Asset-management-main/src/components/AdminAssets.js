import React from 'react';
import SideBar from './SideBar';
import UserAssetsTable from './UserAssetsTable';
import Navbar from './NavBar'; // Import the Navbar component

const AdminAssets = () => {
  return (
    <div className="min-h-screen">
      <Navbar /> {/* Use the Navbar component */}
      <div className='grid grid-cols-12'>
        <SideBar />
        <div className='col-span-9 min-h-screen pl-2 md:col-span-10'>
          <div className="relative flex flex-wrap items-center justify-between py-3 px-5">
            <p className="text-2xl">Assets Available</p>
          </div>
          <hr />
          <UserAssetsTable />
        </div>
      </div>
    </div>
  );
}

export default AdminAssets;
