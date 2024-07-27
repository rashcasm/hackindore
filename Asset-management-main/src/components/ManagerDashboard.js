import React, { useEffect, useState } from 'react';
import { Pie, Doughnut, Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SideBar from './SideBar';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Chart } from 'react-google-charts';
import Modal from 'react-modal';
import logo from './logo.png';

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
    { name: 'Asset 1', department: 'Engineering', description: 'Description of Asset 1', dateOfCreation: '2023-01-01', status: 'Active', lifespan: '10 years', uid: 'UID123', barcode: 'BC123', image: 'https://via.placeholder.com/150', maintenanceRecords: [{ date: '2024-01-01', task: 'Task 1' }, { date: '2024-06-01', task: 'Task 2' }] },
    { name: 'Asset 2', department: 'HR', description: 'Description of Asset 2', dateOfCreation: '2023-02-01', status: 'Inactive', lifespan: '8 years', uid: 'UID124', barcode: 'BC124', image: 'https://via.placeholder.com/150', maintenanceRecords: [{ date: '2024-02-01', task: 'Task 1' }] },
    // Add more mock assets here
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
  maintenanceCosts: [
    { category: 'Vehicle', cost: 50000 },
    { category: 'Road', cost: 70000 },
    { category: 'Building', cost: 30000 },
    { category: 'Bridge', cost: 20000 },
    { category: 'Traffic Signals', cost: 15000 },
    { category: 'Street Medians', cost: 10000 },
    { category: 'Signage', cost: 5000 },
  ],
  revenue: [
    { category: 'Vehicle', revenue: 100000 },
    { category: 'Road', revenue: 120000 },
    { category: 'Building', revenue: 80000 },
    { category: 'Bridge', revenue: 60000 },
    { category: 'Parking', revenue: 40000 },
  ],
  probabilityOfFailure: [
    { category: 'Vehicle', probabilities: [0.1, 0.15, 0.2, 0.25, 0.3] },
    { category: 'Road', probabilities: [0.05, 0.1, 0.15, 0.2, 0.25] },
    { category: 'Building', probabilities: [0.2, 0.25, 0.3, 0.35, 0.4] },
    { category: 'Bridge', probabilities: [0.3, 0.35, 0.4, 0.45, 0.5] },
  ],
  assetUtilization: [
    { category: 'Vehicle', utilization: [70, 75, 80, 85, 90] },
    { category: 'Road', utilization: [60, 65, 70, 75, 80] },
    { category: 'Building', utilization: [50, 55, 60, 65, 70] },
    { category: 'Bridge', utilization: [80, 85, 90, 95, 100] },
  ],
};

const ManagerDashboard = () => {
  const [assets, setAssets] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [assetDirectory, setAssetDirectory] = useState([]);
  const [maintenanceTasksToday, setMaintenanceTasksToday] = useState([]);
  const [pastMaintenanceRecords, setPastMaintenanceRecords] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [maintenanceCosts, setMaintenanceCosts] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [probabilityOfFailure, setProbabilityOfFailure] = useState([]);
  const [assetUtilization, setAssetUtilization] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);

  useEffect(() => {
    // Simulate fetching data from MongoDB
    setAssets(mockData.assets);
    setNotifications(mockData.notifications);
    setAssetDirectory(mockData.assetDirectory);
    setMaintenanceTasksToday(mockData.maintenanceTasksToday);
    setPastMaintenanceRecords(mockData.pastMaintenanceRecords);
    setMaintenanceCosts(mockData.maintenanceCosts);
    setRevenue(mockData.revenue);
    setProbabilityOfFailure(mockData.probabilityOfFailure);
    setAssetUtilization(mockData.assetUtilization);
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

  // Prepare data for maintenance cost doughnut chart
  const doughnutData = {
    labels: maintenanceCosts.map(cost => cost.category),
    datasets: [
      {
        data: maintenanceCosts.map(cost => cost.cost),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FFCD56'],
      },
    ],
  };

  // Prepare data for revenue bar chart
  const barData = {
    labels: revenue.map(item => item.category),
    datasets: [
      {
        label: 'Revenue',
        data: revenue.map(item => item.revenue),
        backgroundColor: '#36A2EB',
      },
    ],
  };

  // Prepare data for probability of failure line chart
  const lineData = {
    labels: ['2024 Q1', '2024 Q2', '2024 Q3', '2024 Q4', '2025 Q1'],
    datasets: probabilityOfFailure.map((item, index) => ({
      label: item.category,
      data: item.probabilities,
      fill: false,
      borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'][index % 4],
    })),
  };

  // Prepare data for asset utilization bar chart
  const utilizationData = {
    labels: ['2024 Q1', '2024 Q2', '2024 Q3', '2024 Q4', '2025 Q1'],
    datasets: assetUtilization.map((item, index) => ({
      label: item.category,
      data: item.utilization,
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'][index % 4],
    })),
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleAssetClick = (asset) => {
    setSelectedAsset(asset);
  };

  const closeModal = () => {
    setSelectedAsset(null);
  };

  const formattedDate = selectedDate.toISOString().split('T')[0];
  const pastTasks = pastMaintenanceRecords[formattedDate] || [];

  const totalMaintenanceCost = maintenanceCosts.reduce((total, cost) => total + cost.cost, 0);

  const ganttData = [
    [
      { type: 'string', label: 'Task ID' },
      { type: 'string', label: 'Task Name' },
      { type: 'string', label: 'Resource' },
      { type: 'date', label: 'Start Date' },
      { type: 'date', label: 'End Date' },
      { type: 'number', label: 'Duration' },
      { type: 'number', label: 'Percent Complete' },
      { type: 'string', label: 'Dependencies' },
    ],
    ['creation', 'Creation', 'Asset 1', new Date(2023, 0, 1), new Date(2023, 0, 1), null, 100, null],
    ['maintenance-0', 'Task 1', 'Asset 1', new Date(2024, 0, 1), new Date(2024, 0, 1), null, 100, 'creation'],
    ['maintenance-1', 'Task 2', 'Asset 1', new Date(2024, 5, 1), new Date(2024, 5, 1), null, 100, 'maintenance-0'],
    ['today', 'Today', 'Asset 1', new Date(), new Date(), null, 0, 'maintenance-1'],
  ];

  return (
    <div className="min-h-screen">
      <nav className="relative flex flex-wrap shadow-md">
        <div className="container mx-auto flex flex-wrap">
          <div className="w-full relative flex lg:w-auto lg:static flex">
            <img src={logo} alt="SEMA Logo" className="py-2 h-12" />
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
            <div className="bg-white p-6 rounded-lg shadow-md" style={{ maxHeight: '400px', overflowY: 'scroll' }}>
              <h2 className="text-xl font-bold mb-4">Asset Directory</h2>
              <ul>
                {assetDirectory.slice(0, 5).map((asset, index) => (
                  <li key={index} className="mb-2 p-2 border-b cursor-pointer" onClick={() => handleAssetClick(asset)}>
                    <strong>{asset.name}</strong> - {asset.department}
                  </li>
                ))}
                {assetDirectory.length > 5 && (
                  <li className="text-blue-500 cursor-pointer">View more...</li>
                )}
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

            {/* Maintenance Costs Doughnut Chart Block */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Maintenance Costs by Category</h2>
              <Doughnut data={doughnutData} />
              <div className="text-center mt-4">
                <strong>Total Maintenance Cost: ${totalMaintenanceCost.toLocaleString()}</strong>
              </div>
            </div>

            {/* Revenue Bar Chart Block */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Revenue by Asset Category</h2>
              <Bar data={barData} />
            </div>

            {/* Probability of Failure Line Chart Block */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Probability of Failure of Assets</h2>
              <Line data={lineData} />
            </div>

            {/* Asset Utilization Bar Chart Block */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Asset Utilization Over Time</h2>
              <Bar data={utilizationData} />
            </div>
          </div>
        </div>
      </div>

      {selectedAsset && (
        <Modal isOpen={true} onRequestClose={closeModal} ariaHideApp={false} style={{ content: { maxWidth: '600px', margin: 'auto' } }}>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">{selectedAsset.name}</h2>
            <img src={selectedAsset.image} alt={selectedAsset.name} className="mb-4" style={{ width: '100px', height: '100px' }} />
            <p><strong>Description:</strong> {selectedAsset.description}</p>
            <p><strong>Date of Creation:</strong> {selectedAsset.dateOfCreation}</p>
            <p><strong>Status:</strong> {selectedAsset.status}</p>
            <p><strong>Lifespan:</strong> {selectedAsset.lifespan}</p>
            <p><strong>UID:</strong> {selectedAsset.uid}</p>
            <p><strong>Barcode:</strong> {selectedAsset.barcode}</p>
            <h3 className="text-xl font-bold mt-4">Maintenance Records</h3>
            <ul>
              {selectedAsset.maintenanceRecords.map((record, index) => (
                <li key={index} className="mb-2 p-2 border-b">
                  <strong>Date:</strong> {record.date} - <strong>Task:</strong> {record.task}
                </li>
              ))}
            </ul>
            <button onClick={closeModal} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
              Close
            </button>
          </div>
          {/* Gantt Chart */}
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-4">Lifecycle Gantt Chart</h3>
            <Chart
              chartType="Gantt"
              width="100%"
              height="400px"
              data={ganttData}
              options={{
                height: 400,
                gantt: {
                  trackHeight: 30,
                },
              }}
            />
          </div>
        </Modal>
      )}

      <ToastContainer />
    </div>
  );
}

export default ManagerDashboard;
