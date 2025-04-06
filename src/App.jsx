// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Purchase from './components/Purchase';
import Service from './components/Service';
import Petrol from './components/Petrol';
import Sell from './components/Sell';
import VehicleDetails from './components/VehicleDetails';
import Logout from './components/Logout';
import Home from './components/Home';
import AllCBEManage from './components/AllCBEManage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="purchase" element={<Purchase />} />
          <Route path="service" element={<Service />} />
          <Route path="petrol" element={<Petrol />} />
          <Route path="sell" element={<Sell />} />
          <Route path="vehicledetails" element={<VehicleDetails />} />
          <Route path="manage" element={<AllCBEManage />} />
          <Route path="logout" element={<Logout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;