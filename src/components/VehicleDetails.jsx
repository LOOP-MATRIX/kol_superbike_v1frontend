// src/components/VehicleDetails.jsx
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function VehicleDetails() {
  const [purchases, setPurchases] = useState([]);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [services, setServices] = useState([]);
  const [petrolRecords, setPetrolRecords] = useState([]);
  const [sells, setSells] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPurchases();
    if (selectedPurchase) {
      fetchAllDetails(selectedPurchase._id);
    } else {
      setServices([]);
      setPetrolRecords([]);
      setSells([]);
    }
  }, [selectedPurchase]);

  const fetchPurchases = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:8015/api/purchase', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      console.log('Purchases Response:', data);
      if (data.success) {
        setPurchases(data.data);
      }
    } catch (error) {
      console.error('Error fetching purchases:', error);
      toast.error('Failed to fetch purchases', { theme: 'dark' });
    }
  };

  const fetchAllDetails = async (purchaseId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');

      const serviceResponse = await fetch(`http://localhost:8015/api/service/purchase/${purchaseId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const serviceData = await serviceResponse.json();
      console.log('Service Response:', serviceData);
      setServices(serviceData && serviceData.length > 0 ? serviceData : []);

      const petrolResponse = await fetch(`http://localhost:8015/api/petrol/purchase/${purchaseId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const petrolData = await petrolResponse.json();
      console.log('Petrol Response:', petrolData);
      setPetrolRecords(petrolData.success && petrolData.data && petrolData.data.length > 0 ? petrolData.data : []);

      const sellResponse = await fetch(`http://localhost:8015/api/sell/purchase/${purchaseId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const sellData = await sellResponse.json();
      console.log('Sell Response:', sellData);
      setSells(sellData.success && sellData.data && sellData.data.length > 0 ? sellData.data : []);
    } catch (error) {
      console.error('Error fetching details:', error);
      toast.error('Error fetching vehicle details', { theme: 'dark' });
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseSelect = (e) => {
    const purchaseId = e.target.value;
    const selected = purchases.find((p) => p._id === purchaseId);
    setSelectedPurchase(selected || null);
  };

  const handleUpdate = async (type, id, updatedData) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const url = `http://localhost:8015/api/${type}/${id}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(`${type} updated successfully!`, { theme: 'dark' });
        fetchAllDetails(selectedPurchase._id);
      } else {
        toast.error(data.error || 'Update failed!', { theme: 'dark' });
      }
    } catch (error) {
      console.error('Error updating:', error);
      toast.error('Server error!', { theme: 'dark' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type} record?`)) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const url = `http://localhost:8015/api/${type}/${id}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(`${type} deleted successfully!`, { theme: 'dark' });
        fetchAllDetails(selectedPurchase._id);
      } else {
        toast.error(data.error || 'Delete failed!', { theme: 'dark' });
      }
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Server error!', { theme: 'dark' });
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalAmount = () => {
    const purchasePrice = Number(selectedPurchase?.purchasePrice || 0);
    const serviceTotal = services.reduce((sum, service) => sum + Number(service.serviceCost || 0), 0);
    const petrolTotal = petrolRecords.reduce((sum, record) => sum + Number(record.petrolCost || 0), 0);
    return purchasePrice + serviceTotal + petrolTotal;
  };

  return (
    <div className="p-6 bg-white text-black min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8 border-b-2 border-black pb-2">Vehicle Details</h1>
      <div className="mb-6">
        <select
          onChange={handlePurchaseSelect}
          className="w-full p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
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

      {loading && <p className="text-black text-lg">Loading...</p>}

      {selectedPurchase && (
        <>
          {/* Purchase Details */}
          <div className="mb-8 bg-white p-6 rounded-lg shadow-md border border-black">
            <h2 className="text-2xl font-bold mb-4">Purchase Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p><strong>Vehicle Number:</strong> {selectedPurchase.vehicleNumber || 'N/A'}</p>
              <p><strong>Customer Name:</strong> {selectedPurchase.customerName || 'N/A'}</p>
              <p><strong>Company Name:</strong> {selectedPurchase.companyName || 'N/A'}</p>
              <p><strong>Model Number:</strong> {selectedPurchase.modelNumber || 'N/A'}</p>
              <p><strong>Brand:</strong> {selectedPurchase.brand || 'N/A'}</p>
              <p><strong>Year:</strong> {selectedPurchase.year || 'N/A'}</p>
              <p><strong>KM:</strong> {selectedPurchase.KM || 'N/A'}</p>
              <p><strong>Insurance Status:</strong> {selectedPurchase.insurance?.status || 'N/A'}</p>
              {selectedPurchase.insurance?.status === 'valid' && (
                <p><strong>Valid Till:</strong> {selectedPurchase.insurance.validTill || 'N/A'}</p>
              )}
              <p><strong>Color:</strong> {selectedPurchase.color || 'N/A'}</p>
              <p><strong>Deal Amount:</strong> {selectedPurchase.dealAmount || 'N/A'}</p>
              <p><strong>RTO:</strong> {selectedPurchase.RTO || 'N/A'}</p>
              <p><strong>Insurance Cost:</strong> {selectedPurchase.insuranceCost || 'N/A'}</p>
              <p><strong>LIC Number:</strong> {selectedPurchase.LICNumber || 'N/A'}</p>
              <p><strong>Old Owner Aadhar:</strong> {selectedPurchase.adharCard || 'N/A'}</p>
              <p><strong>Old Owner PAN:</strong> {selectedPurchase.panCard || 'N/A'}</p>
              <p><strong>Engine Number:</strong> {selectedPurchase.engineNumber || 'N/A'}</p>
              <p><strong>Chassis Number:</strong> {selectedPurchase.chassisNumber || 'N/A'}</p>
              <p><strong>Mobile No:</strong> {selectedPurchase.mobileNo || 'N/A'}</p>
              <p><strong>Alternative No:</strong> {selectedPurchase.alternativeNo || 'N/A'}</p>
              <p><strong>Purchase Price:</strong> {selectedPurchase.purchasePrice || 'N/A'}</p>
              <p><strong>Executive Name:</strong> {selectedPurchase.executive?.name || 'N/A'}</p>
              <p><strong>Commission:</strong> {selectedPurchase.executive?.commission || 'N/A'}</p>
            </div>
            <div className="mt-4 text-lg font-semibold border-t border-black pt-2">
              <p><strong>Total Amount:</strong> ₹{calculateTotalAmount().toLocaleString()}</p>
            </div>
          </div>

          {/* Service Section */}
          <div className="mb-8 bg-white p-6 rounded-lg shadow-md border border-black">
            <h2 className="text-2xl font-bold mb-4">Service Records</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="p-3">Date</th>
                    <th className="p-3">Vehicle No</th>
                    <th className="p-3">Service Cost</th>
                    <th className="p-3">Description</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.length > 0 ? (
                    services.map((service) => (
                      <tr key={service._id} className="border-b border-black">
                        <td className="p-3">{service.date || 'N/A'}</td>
                        <td className="p-3">{service.vehicleNumber || 'N/A'}</td>
                        <td className="p-3">{service.serviceCost || 'N/A'}</td>
                        <td className="p-3">{service.description || 'N/A'}</td>
                        <td className="p-3">
                          <button
                            onClick={() => handleUpdate('service', service._id, { ...service, serviceCost: prompt('New Service Cost', service.serviceCost) })}
                            className="mr-2 bg-black text-white p-2 rounded hover:bg-gray-800"
                            disabled={loading}
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDelete('service', service._id)}
                            className="bg-black text-white p-2 rounded hover:bg-gray-800"
                            disabled={loading}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-3 text-center text-black">
                        No Data Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Petrol Section */}
          <div className="mb-8 bg-white p-6 rounded-lg shadow-md border border-black">
            <h2 className="text-2xl font-bold mb-4">Petrol Records</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="p-3">Date</th>
                    <th className="p-3">Vehicle No</th>
                    <th className="p-3">Petrol Cost</th>
                    <th className="p-3">Created At</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {petrolRecords.length > 0 ? (
                    petrolRecords.map((record) => (
                      <tr key={record._id} className="border-b border-black">
                        <td className="p-3">{record.date || 'N/A'}</td>
                        <td className="p-3">{record.vehicleNumber || 'N/A'}</td>
                        <td className="p-3">{record.petrolCost || 'N/A'}</td>
                        <td className="p-3">{record.createdAt ? new Date(record.createdAt).toLocaleDateString() : 'N/A'}</td>
                        <td className="p-3">
                          <button
                            onClick={() => handleUpdate('petrol', record._id, { ...record, petrolCost: prompt('New Petrol Cost', record.petrolCost) })}
                            className="mr-2 bg-black text-white p-2 rounded hover:bg-gray-800"
                            disabled={loading}
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDelete('petrol', record._id)}
                            className="bg-black text-white p-2 rounded hover:bg-gray-800"
                            disabled={loading}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-3 text-center text-black">
                        No Data Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sell Section */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-black">
            <h2 className="text-2xl font-bold mb-4">Sell Records</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="p-3">Make</th>
                    <th className="p-3">Year</th>
                    <th className="p-3">New Owner</th>
                    <th className="p-3">Sell Price</th>
                    <th className="p-3">Created At</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sells.length > 0 ? (
                    sells.map((sell) => (
                      <tr key={sell._id} className="border-b border-black">
                        <td className="p-3">{sell.make || 'N/A'}</td>
                        <td className="p-3">{sell.year || 'N/A'}</td>
                        <td className="p-3">{sell.newOwner?.name || 'N/A'}</td>
                        <td className="p-3">{sell.newOwner?.purchasePrice || 'N/A'}</td>
                        <td className="p-3">{sell.createdAt ? new Date(sell.createdAt).toLocaleDateString() : 'N/A'}</td>
                        <td className="p-3">
                          <button
                            onClick={() => handleUpdate('sell', sell._id, { ...sell, newOwner: { ...sell.newOwner, purchasePrice: prompt('New Sell Price', sell.newOwner?.purchasePrice) } })}
                            className="mr-2 bg-black text-white p-2 rounded hover:bg-gray-800"
                            disabled={loading}
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDelete('sell', sell._id)}
                            className="bg-black text-white p-2 rounded hover:bg-gray-800"
                            disabled={loading}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-3 text-center text-black">
                        No Data Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default VehicleDetails;