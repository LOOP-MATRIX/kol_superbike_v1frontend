// src/components/Sell.jsx
import { useState, useEffect } from 'react';

function Sell() {
  const [formData, setFormData] = useState({
    make: '',
    year: '',
    executives: '',
    name: '',
    adharCard: '',
    panCard: '',
    engineNumber: '',
    chassisNumber: '',
    mobileNo: '',
    alternativeNo: '',
    purchasePrice: '',
    purchaseId: '',
  });
  const [adharPhoto, setAdharPhoto] = useState(null);
  const [panPhoto, setPanPhoto] = useState(null);
  const [sells, setSells] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSells();
    fetchPurchases();
  }, []);

  const fetchSells = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:8015/api/sell', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setSells(data.data);
      }
    } catch (error) {
      console.error('Error fetching sell records:', error);
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
        purchaseId: selected._id,
        make: selected.brand || '', // Pre-fill from purchase
        year: selected.year || '',  // Pre-fill from purchase
      });
    } else {
      setSelectedPurchase(null);
      setFormData({
        ...formData,
        purchaseId: '',
        make: '',
        year: '',
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    if (e.target.name === 'adharPhoto') setAdharPhoto(e.target.files[0]);
    if (e.target.name === 'panPhoto') setPanPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();
    form.append('make', formData.make);
    form.append('year', formData.year);
    form.append('executives', formData.executives); // Assuming comma-separated string
    form.append('name', formData.name);
    form.append('adharCard', formData.adharCard);
    form.append('panCard', formData.panCard);
    form.append('engineNumber', formData.engineNumber);
    form.append('chassisNumber', formData.chassisNumber);
    form.append('mobileNo', formData.mobileNo);
    form.append('alternativeNo', formData.alternativeNo);
    form.append('purchasePrice', formData.purchasePrice);
    form.append('purchaseId', formData.purchaseId);
    if (adharPhoto) form.append('adharPhoto', adharPhoto);
    if (panPhoto) form.append('panPhoto', panPhoto);

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:8015/api/sell', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: form,
      });
      const data = await response.json();
      if (data.success) {
        alert('Sell record add ho gaya bhai!');
        setFormData({
          make: '',
          year: '',
          executives: '',
          name: '',
          adharCard: '',
          panCard: '',
          engineNumber: '',
          chassisNumber: '',
          mobileNo: '',
          alternativeNo: '',
          purchasePrice: '',
          purchaseId: selectedPurchase ? selectedPurchase._id : '',
        });
        setAdharPhoto(null);
        setPanPhoto(null);
        fetchSells();
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
      <h1 className="text-3xl font-bold mb-6">Sell Page</h1>

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

      {/* Sell Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="make"
            value={formData.make}
            onChange={handleChange}
            className="p-2 border rounded"
            placeholder="Make"
          />
          <input
            name="year"
            value={formData.year}
            onChange={handleChange}
            className="p-2 border rounded"
            placeholder="Year"
          />
          <input
            name="executives"
            value={formData.executives}
            onChange={handleChange}
            className="p-2 border rounded"
            placeholder="Executives (comma-separated)"
          />
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="p-2 border rounded"
            placeholder="New Owner Name"
          />
          <input
            name="adharCard"
            value={formData.adharCard}
            onChange={handleChange}
            className="p-2 border rounded"
            placeholder="Aadhar Card"
          />
          <input
            name="panCard"
            value={formData.panCard}
            onChange={handleChange}
            className="p-2 border rounded"
            placeholder="PAN Card"
          />
          <input
            name="engineNumber"
            value={formData.engineNumber}
            onChange={handleChange}
            className="p-2 border rounded"
            placeholder="Engine Number"
          />
          <input
            name="chassisNumber"
            value={formData.chassisNumber}
            onChange={handleChange}
            className="p-2 border rounded"
            placeholder="Chassis Number"
          />
          <input
            name="mobileNo"
            value={formData.mobileNo}
            onChange={handleChange}
            className="p-2 border rounded"
            placeholder="Mobile No"
          />
          <input
            name="alternativeNo"
            value={formData.alternativeNo}
            onChange={handleChange}
            className="p-2 border rounded"
            placeholder="Alternative No"
          />
          <input
            name="purchasePrice"
            value={formData.purchasePrice}
            onChange={handleChange}
            className="p-2 border rounded"
            placeholder="Sell Price"
            type="number"
          />
          <input
            type="file"
            name="adharPhoto"
            onChange={handleFileChange}
            className="p-2 border rounded"
          />
          <input
            type="file"
            name="panPhoto"
            onChange={handleFileChange}
            className="p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !formData.purchaseId}
          className="mt-6 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Adding...' : 'Add Sell Record'}
        </button>
      </form>

      {/* Sell Records List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">All Sell Records</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Make</th>
                <th className="p-2">Year</th>
                <th className="p-2">New Owner</th>
                <th className="p-2">Sell Price</th>
                <th className="p-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {sells.map((sell) => (
                <tr key={sell._id} className="border-b">
                  <td className="p-2">{sell.make}</td>
                  <td className="p-2">{sell.year}</td>
                  <td className="p-2">{sell.newOwner?.name || 'N/A'}</td>
                  <td className="p-2">{sell.newOwner?.purchasePrice || 'N/A'}</td>
                  <td className="p-2">{new Date(sell.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Sell;