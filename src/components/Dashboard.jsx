// src/components/Dashboard.jsx
import { Link, Outlet } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
        <nav className="mt-4">
          <Link
            to="/dashboard/purchase"
            className="block p-4 hover:bg-blue-500 hover:text-white"
          >
            Purchase
          </Link>
          <Link
            to="/dashboard/service"
            className="block p-4 hover:bg-blue-500 hover:text-white"
          >
            Service
          </Link>
          <Link
            to="/dashboard/petrol"
            className="block p-4 hover:bg-blue-500 hover:text-white"
          >
            Petrol
          </Link>
          <Link
            to="/dashboard/sell"
            className="block p-4 hover:bg-blue-500 hover:text-white"
          >
            Sell
          </Link>
          <Link
            to="/dashboard/vehicledetails"
            className="block p-4 hover:bg-blue-500 hover:text-white"
          >
            All Vehicle Details
          </Link>
          <Link
            to="/dashboard/logout"
            className="block p-4 hover:bg-blue-500 hover:text-white"
          >Logout
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <Outlet /> {/* Yaha pe navigation pages show honge */}
      </div>
    </div>
  );
}

export default Dashboard;