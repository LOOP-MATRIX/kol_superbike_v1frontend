// src/components/Service.jsx
import { useState, useEffect } from 'react';

function Service() {
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    serviceCost: '',
    description: '',
    date: '',
    purchaseId: '',
  });
  const [services, setServices] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPurchases();
    if (selectedPurchase) {
      fetchServices(selectedPurchase._id);
    } else {
      setServices([]);
    }
  }, [selectedPurchase]);

  const fetchServices = async (purchaseId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:8015/api/service/purchase/${purchaseId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.length > 0) {
        setServices(data);
      } else {
        setServices([]); // No data or 404
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices([]);
    }
  };

  const fetchPurchases = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:8015/api/purchase', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setPurchases(data.data);
      }
    } catch (error) {
      console.error('Error fetching purchases:', error);
    }
  };

  const handlePurchaseSelect = (e) => {
    const purchaseId = e.target.value;
    const selected = purchases.find((p) => p._id === purchaseId);
    if (selected) {
      setSelectedPurchase(selected);
      setFormData({
        ...formData,
        vehicleNumber: selected.vehicleNumber,
        purchaseId: selected._id,
      });
    } else {
      setSelectedPurchase(null);
      setFormData({
        ...formData,
        vehicleNumber: '',
        purchaseId: '',
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:8015/api/service', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Service add ho gaya bhai!');
        setFormData({
          vehicleNumber: selectedPurchase ? selectedPurchase.vehicleNumber : '',
          serviceCost: '',
          description: '',
          date: '',
          purchaseId: selectedPurchase ? selectedPurchase._id : '',
        });
        fetchServices(selectedPurchase._id);
      } else {
        alert(data.error || 'Kuch galat ho gaya!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Server se baat nahi ban rahi!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Service Page</h1>
      <div className="mb-6">
        <select onChange={handlePurchaseSelect} className="w-full p-2 border rounded" defaultValue="">
          <option value="" disabled>Select a Vehicle</option>
          {purchases.map((purchase) => (
            <option key={purchase._id} value={purchase._id}>
              {purchase.vehicleNumber} - {purchase.customerName}
            </option>
          ))}
        </select>
      </div>
      {selectedPurchase && (
        <div className="mb-6 bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-bold">Selected Purchase</h3>
          <p>Vehicle Number: {selectedPurchase.vehicleNumber}</p>
          <p>Customer: {selectedPurchase.customerName}</p>
          <p>Brand: {selectedPurchase.brand}</p>
          <p>Purchase Price: {selectedPurchase.purchasePrice || 'N/A'}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} className="p-2 border rounded" placeholder="Vehicle Number" disabled={!!selectedPurchase} />
          <input name="serviceCost" value={formData.serviceCost} onChange={handleChange} className="p-2 border rounded" placeholder="Service Cost" type="number" />
          <input name="description" value={formData.description} onChange={handleChange} className="p-2 border rounded" placeholder="Description" />
          <input type="date" name="date" value={formData.date} onChange={handleChange} className="p-2 border rounded" placeholder="Date" />
        </div>
        <button type="submit" disabled={loading || !formData.purchaseId} className="mt-6 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400">
          {loading ? 'Adding...' : 'Add Service'}
        </button>
      </form>
      {selectedPurchase && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">All Services</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2">Date</th>
                  <th className="p-2">Vehicle No</th>
                  <th className="p-2">Service Cost</th>
                  <th className="p-2">Description</th>
                </tr>
              </thead>
              <tbody>
                {services.length > 0 ? (
                  services.map((service) => (
                    <tr key={service._id} className="border-b">
                      <td className="p-2">{service.date}</td>
                      <td className="p-2">{service.vehicleNumber}</td>
                      <td className="p-2">{service.serviceCost}</td>
                      <td className="p-2">{service.description}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-2 text-center text-gray-500">
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Service;