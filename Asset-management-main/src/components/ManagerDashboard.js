import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto'; // Required for Chart.js
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SideBar from './SideBar';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// Mock Data
const mockData = {
  assets: [
    { category: 'Vehicle', count: 40 },
    { category: 'Road', count: 30 },
    { category: 'Building', count: 20 },
    { category: 'Bridge', count: 10 },
  ],
  notifications: [
    { message: 'Asset 123 needs maintenance', severity: 'High' },
    { message: 'Asset 456 is overdue for inspection', severity: 'Medium' },
    { message: 'Asset 789 has minor issues', severity: 'Low' },
  ],
  assetDirectory: [
    { name: 'Asset 1', department: 'Engineering' },
    { name: 'Asset 2', department: 'HR' },
    { name: 'Asset 3', department: 'Finance' },
  ],
  maintenanceTasksToday: [
    { assetId: '123', task: 'Oil Change', time: '10:00 AM' },
    { assetId: '456', task: 'Filter Replacement', time: '1:00 PM' },
  ],
  pastMaintenanceRecords: {
    '2024-07-25': [
      { assetId: '789', task: 'Brake Check', time: '9:00 AM' },
    ],
    '2024-07-24': [
      { assetId: '101', task: 'Battery Replacement', time: '11:00 AM' },
    ],
  },
};

const ManagerDashboard = () => {
  const [assets, setAssets] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [assetDirectory, setAssetDirectory] = useState([]);
  const [maintenanceTasksToday, setMaintenanceTasksToday] = useState([]);
  const [pastMaintenanceRecords, setPastMaintenanceRecords] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    // Simulate fetching data from MongoDB
    setAssets(mockData.assets);
    setNotifications(mockData.notifications);
    setAssetDirectory(mockData.assetDirectory);
    setMaintenanceTasksToday(mockData.maintenanceTasksToday);
    setPastMaintenanceRecords(mockData.pastMaintenanceRecords);
  }, []);

  // Prepare data for pie chart
  const pieData = {
    labels: assets.map(asset => asset.category),
    datasets: [
      {
        data: assets.map(asset => asset.count),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const formattedDate = selectedDate.toISOString().split('T')[0];
  const pastTasks = pastMaintenanceRecords[formattedDate] || [];

  return (
    <div className="min-h-screen">
      <nav className="relative flex flex-wrap shadow-md">
        <div className="container mx-auto flex flex-wrap">
          <div className="w-full relative flex lg:w-auto lg:static flex">
            <p className="py-2 flex text-2xl uppercase font-bold leading-snug text-dark">SEMA</p>
          </div>
        </div>
      </nav>
      <div className='grid grid-cols-12 gap-6 p-6'>
        <SideBar />
        <div className='col-span-9 min-h-screen'>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pie Chart Block */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Asset Distribution</h2>
              <Pie data={pieData} />
            </div>

            {/* Notifications Block */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Notifications</h2>
              <ul>
                {notifications.map((notif, index) => (
                  <li key={index} className={`mb-2 p-2 rounded-lg ${notif.severity === 'High' ? 'bg-red-100' : notif.severity === 'Medium' ? 'bg-yellow-100' : 'bg-green-100'}`}>
                    {notif.message}
                  </li>
                ))}
              </ul>
            </div>

            {/* Asset Directory Block */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Asset Directory</h2>
              <ul>
                {assetDirectory.map((asset, index) => (
                  <li key={index} className="mb-2 p-2 border-b">
                    <strong>{asset.name}</strong> - {asset.department}
                  </li>
                ))}
              </ul>
            </div>

            {/* Today's Maintenance Tasks Block */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Today's Maintenance Tasks</h2>
              <ul>
                {maintenanceTasksToday.map((task, index) => (
                  <li key={index} className="mb-2 p-2 border-b">
                    <strong>Asset ID: {task.assetId}</strong> - {task.task} at {task.time}
                  </li>
                ))}
              </ul>
            </div>

            {/* Past Maintenance Records Block */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Past Maintenance Records</h2>
              <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                className="mb-4"
              />
              <ul>
                {pastTasks.length > 0 ? (
                  pastTasks.map((task, index) => (
                    <li key={index} className="mb-2 p-2 border-b">
                      <strong>Asset ID: {task.assetId}</strong> - {task.task} at {task.time}
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-gray-500">No records for this date.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ManagerDashboard;
