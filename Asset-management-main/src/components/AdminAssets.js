import React from 'react'
import SideBar from './SideBar';
import UserAssetsTable from './UserAssetsTable';

const AdminAssets = () => {
  return (
		<div className="min-h-screen">
			<nav className="relative flex flex-wrap shadow-md">
				<div className="container mx-auto flex flex-wrap ">
					<div className="w-full relative flex lg:w-auto lg:static flex ">
						<p className= "py-2 flex text-2xl uppercase font-bold leading-snug text-dark " >SEMA</p>
					</div>
				</div>
			</nav>
			<div className='grid grid-cols-12'> 
				<SideBar/>
				<div className='col-span-9  min-h-screen pl-2 md:col-span-10'>
					<div className="relative flex flex-wrap items-center justify-between py-3 px-5">
						<p className="text-2xl">Assets Available</p>
					</div>
					<hr/>
					<UserAssetsTable />
				</div>
			</div>
		</div>
	);
}

export default AdminAssets