// src/components/Petrol.jsx
import { useState, useEffect } from 'react';

function Petrol() {
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    petrolCost: '',
    date: '',
    purchaseId: '',
  });
  const [petrolRecords, setPetrolRecords] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPetrolRecords();
    fetchPurchases();
  }, []);

  const fetchPetrolRecords = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:8015/api/petrol', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setPetrolRecords(data.data);
      }
    } catch (error) {
      console.error('Error fetching petrol records:', error);
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
      const response = await fetch('http://localhost:8015/api/petrol', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        alert('Petrol record add ho gaya bhai!');
        setFormData({
          vehicleNumber: selectedPurchase ? selectedPurchase.vehicleNumber : '',
          petrolCost: '',
          date: '',
          purchaseId: selectedPurchase ? selectedPurchase._id : '',
        });
        fetchPetrolRecords(); // Refresh list
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
      <h1 className="text-3xl font-bold mb-6">Petrol Page</h1>

      {/* Dropdown Section */}
      <div className="mb-6">
        <select
          onChange={handlePurchaseSelect}
          className="w-full p-2 border rounded"
          defaultValue=""
        >
          <option value="" disabled>Select a Vehicle</option>
          {purchases.map((purchase) => (
            <option key={purchase._id} value={purchase._id}>
              {purchase.vehicleNumber} - {purchase.customerName}
            </option>
          ))}
        </select>
      </div>

      {/* Selected Purchase Info */}
      {selectedPurchase && (
        <div className="mb-6 bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-bold">Selected Purchase</h3>
          <p>Vehicle Number: {selectedPurchase.vehicleNumber}</p>
          <p>Customer: {selectedPurchase.customerName}</p>
          <p>Brand: {selectedPurchase.brand}</p>
          <p>Purchase Price: {selectedPurchase.purchasePrice || 'N/A'}</p>
        </div>
      )}

      {/* Petrol Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="vehicleNumber"
            value={formData.vehicleNumber}
            onChange={handleChange}
            className="p-2 border rounded"
            placeholder="Vehicle Number"
            disabled={!!selectedPurchase} // Disable if purchase selected
          />
          <input
            name="petrolCost"
            value={formData.petrolCost}
            onChange={handleChange}
            className="p-2 border rounded"
            placeholder="Petrol Cost"
            type="number"
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="p-2 border rounded"
            placeholder="Date"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !formData.purchaseId}
          className="mt-6 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Adding...' : 'Add Petrol Record'}
        </button>
      </form>

      {/* Petrol Records List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">All Petrol Records</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Date</th>
                <th className="p-2">Vehicle No</th>
                <th className="p-2">Petrol Cost</th>
                <th className="p-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {petrolRecords.map((record) => (
                <tr key={record._id} className="border-b">
                  <td className="p-2">{record.date}</td>
                  <td className="p-2">{record.vehicleNumber}</td>
                  <td className="p-2">{record.petrolCost}</td>
                  <td className="p-2">{new Date(record.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Petrol;