// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Purchase from './components/Purchase';
import Service from './components/Service';
import Petrol from './components/Petrol';
import Sell from './components/Sell';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="purchase" element={<Purchase />} />
          <Route path="service" element={<Service />} />
          <Route path="petrol" element={<Petrol />} />
          <Route path="sell" element={<Sell />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;