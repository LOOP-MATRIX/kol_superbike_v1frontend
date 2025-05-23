// src/components/Petrol.jsx
import { useState, useEffect } from 'react';

function Petrol() {
  const [formData, setFormData] = useState({ vehicleNumber: '', petrolCost: '', date: '', purchaseId: '' });
  const [petrolRecords, setPetrolRecords] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    fetchPurchases();
    if (selectedPurchase) fetchPetrolRecords(selectedPurchase._id);
    else setPetrolRecords([]);
  }, [selectedPurchase]);

  const fetchPurchases = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:8015/api/purchase', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setPurchases(data.data);
        setFilteredPurchases(data.data);
      }
    } catch (error) {
      console.error('Error fetching purchases:', error);
    }
  };

  const fetchPetrolRecords = async (purchaseId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:8015/api/petrol/purchase/${purchaseId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setPetrolRecords(data.success && data.data.length > 0 ? data.data : []);
    } catch (error) {
      console.error('Error fetching petrol records:', error);
      setPetrolRecords([]);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = purchases.filter((purchase) =>
      purchase.vehicleNumber.toLowerCase().includes(term)
    );
    setFilteredPurchases(filtered);
  };

  const handlePurchaseSelect = (purchase) => {
    setSelectedPurchase(purchase);
    setFormData({ ...formData, vehicleNumber: purchase.vehicleNumber, purchaseId: purchase._id });
    setIsDropdownOpen(false);
    setSearchTerm('');
    setFilteredPurchases(purchases);
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
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        alert('Petrol record add ho gaya bhai!');
        setFormData({ vehicleNumber: selectedPurchase.vehicleNumber, petrolCost: '', date: '', purchaseId: selectedPurchase._id });
        fetchPetrolRecords(selectedPurchase._id);
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
    <div className="p-6 bg-white text-black min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8 border-b-2 border-black pb-2">Petrol Page</h1>
      <div className="mb-6 relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full p-3 border border-black rounded-lg text-left bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
        >
          {selectedPurchase ? `${selectedPurchase.vehicleNumber} - ${selectedPurchase.customerName}` : 'Select a Vehicle'}
        </button>
        {isDropdownOpen && (
          <div className="absolute z-10 w-full bg-white border border-black rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search by Vehicle Number"
              className="w-full p-2 border-b border-black focus:outline-none"
            />
            {filteredPurchases.length > 0 ? (
              filteredPurchases.map((purchase) => (
                <div
                  key={purchase._id}
                  onClick={() => handlePurchaseSelect(purchase)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {purchase.vehicleNumber} - {purchase.customerName}
                </div>
              ))
            ) : (
              <div className="p-2 text-center text-black">No vehicles found</div>
            )}
          </div>
        )}
      </div>

      {selectedPurchase && (
        <div className="mb-6 bg-white p-4 rounded-lg shadow-md border border-black">
          <h3 className="text-lg font-bold">Selected Purchase</h3>
          <p><strong>Vehicle Number:</strong> {selectedPurchase.vehicleNumber}</p>
          <p><strong>Customer:</strong> {selectedPurchase.customerName}</p>
          <p><strong>Brand:</strong> {selectedPurchase.brand}</p>
          <p><strong>Purchase Price:</strong> {selectedPurchase.oldOwner?.purchasePrice || 'N/A'}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8 border border-black">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="vehicleNumber"
            value={formData.vehicleNumber}
            onChange={handleChange}
            className="p-3 border border-black rounded-lg"
            placeholder="Vehicle Number"
            disabled={!!selectedPurchase}
          />
          <input
            name="petrolCost"
            value={formData.petrolCost}
            onChange={handleChange}
            className="p-3 border border-black rounded-lg"
            placeholder="Petrol Cost"
            type="number"
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="p-3 border border-black rounded-lg"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !formData.purchaseId}
          className="mt-6 w-full bg-black text-white p-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
        >
          {loading ? 'Adding...' : 'Add Petrol Record'}
        </button>
      </form>

      {selectedPurchase && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-black">
          <h2 className="text-2xl font-bold mb-4">All Petrol Records</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-black text-white">
                  <th className="p-3">Date</th>
                  <th className="p-3">Vehicle No</th>
                  <th className="p-3">Petrol Cost</th>
                  <th className="p-3">Created At</th>
                </tr>
              </thead>
              <tbody>
                {petrolRecords.length > 0 ? (
                  petrolRecords.map((record) => (
                    <tr key={record._id} className="border-b border-black">
                      <td className="p-3">{record.date}</td>
                      <td className="p-3">{record.vehicleNumber}</td>
                      <td className="p-3">{record.petrolCost}</td>
                      <td className="p-3">{new Date(record.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-3 text-center text-black">
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

export default Petrol;