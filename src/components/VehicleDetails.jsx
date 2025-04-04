// src/components/VehicleDetails.jsx
import { useState, useEffect } from 'react';

function VehicleDetails() {
    const [purchases, setPurchases] = useState([]);
    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [services, setServices] = useState([]);
    const [petrolRecords, setPetrolRecords] = useState([]);
    const [sells, setSells] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPurchases();
        if (selectedPurchase) {
            fetchAllDetails(selectedPurchase._id);
        } else {
            setServices([]);
            setPetrolRecords([]);
            setSells([]);
            setError(null);
        }
    }, [selectedPurchase]);

    const fetchPurchases = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('http://localhost:8015/api/purchase', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const data = await response.json();
            console.log('Purchases Response:', data); // Debugging
            if (data.success) {
                setPurchases(data.data);
            } else {
                setError('Failed to fetch purchases');
            }
        } catch (error) {
            console.error('Error fetching purchases:', error);
            setError('Error fetching purchases');
        }
    };

    const fetchAllDetails = async (purchaseId) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('adminToken');

            // Fetch Services
            const serviceResponse = await fetch(`http://localhost:8015/api/service/purchase/${purchaseId}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const serviceData = await serviceResponse.json();
            console.log('Service Response:', serviceData); // Debugging
            setServices(serviceData && serviceData.length > 0 ? serviceData : []);

            // Fetch Petrol Records
            const petrolResponse = await fetch(`http://localhost:8015/api/petrol/purchase/${purchaseId}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const petrolData = await petrolResponse.json();
            console.log('Petrol Response:', petrolData); // Debugging
            setPetrolRecords(petrolData.success && petrolData.data && petrolData.data.length > 0 ? petrolData.data : []);

            // Fetch Sells
            const sellResponse = await fetch(`http://localhost:8015/api/sell/purchase/${purchaseId}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const sellData = await sellResponse.json();
            console.log('Sell Response:', sellData); // Debugging
            setSells(sellData.success && sellData.data && sellData.data.length > 0 ? sellData.data : []);
        } catch (error) {
            console.error('Error fetching details:', error);
            setError('Error fetching vehicle details');
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
                alert(`${type} updated successfully!`);
                fetchAllDetails(selectedPurchase._id);
            } else {
                alert(data.error || 'Update failed!');
            }
        } catch (error) {
            console.error('Error updating:', error);
            alert('Server error!');
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
                alert(`${type} deleted successfully!`);
                fetchAllDetails(selectedPurchase._id);
            } else {
                alert(data.error || 'Delete failed!');
            }
        } catch (error) {
            console.error('Error deleting:', error);
            alert('Server error!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Vehicle Details</h1>
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

            {loading && <p className="text-blue-500">Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {selectedPurchase && (
                <>
                    {/* Purchase Details */}
                    <div className="mb-8 bg-gray-100 p-4 rounded-lg">
                        <h2 className="text-2xl font-bold mb-4">Purchase Details</h2>
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

                    {/* Service Section */}
                    <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-4">Service Records</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="p-2">Date</th>
                                        <th className="p-2">Vehicle No</th>
                                        <th className="p-2">Service Cost</th>
                                        <th className="p-2">Description</th>
                                        <th className="p-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {services.length > 0 ? (
                                        services.map((service) => (
                                            <tr key={service._id} className="border-b">
                                                <td className="p-2">{service.date || 'N/A'}</td>
                                                <td className="p-2">{service.vehicleNumber || 'N/A'}</td>
                                                <td className="p-2">{service.serviceCost || 'N/A'}</td>
                                                <td className="p-2">{service.description || 'N/A'}</td>
                                                <td className="p-2">
                                                    <button
                                                        onClick={() => handleUpdate('service', service._id, { ...service, serviceCost: prompt('New Service Cost', service.serviceCost) })}
                                                        className="mr-2 bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600"
                                                        disabled={loading}
                                                    >
                                                        Update
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete('service', service._id)}
                                                        className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                                                        disabled={loading}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="p-2 text-center text-gray-500">
                                                No Data Found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Petrol Section */}
                    <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-4">Petrol Records</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="p-2">Date</th>
                                        <th className="p-2">Vehicle No</th>
                                        <th className="p-2">Petrol Cost</th>
                                        <th className="p-2">Created At</th>
                                        <th className="p-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {petrolRecords.length > 0 ? (
                                        petrolRecords.map((record) => (
                                            <tr key={record._id} className="border-b">
                                                <td className="p-2">{record.date || 'N/A'}</td>
                                                <td className="p-2">{record.vehicleNumber || 'N/A'}</td>
                                                <td className="p-2">{record.petrolCost || 'N/A'}</td>
                                                <td className="p-2">{record.createdAt ? new Date(record.createdAt).toLocaleDateString() : 'N/A'}</td>
                                                <td className="p-2">
                                                    <button
                                                        onClick={() => handleUpdate('petrol', record._id, { ...record, petrolCost: prompt('New Petrol Cost', record.petrolCost) })}
                                                        className="mr-2 bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600"
                                                        disabled={loading}
                                                    >
                                                        Update
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete('petrol', record._id)}
                                                        className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                                                        disabled={loading}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="p-2 text-center text-gray-500">
                                                No Data Found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Sell Section */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-4">Sell Records</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="p-2">Make</th>
                                        <th className="p-2">Year</th>
                                        <th className="p-2">New Owner</th>
                                        <th className="p-2">Sell Price</th>
                                        <th className="p-2">Created At</th>
                                        <th className="p-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sells.length > 0 ? (
                                        sells.map((sell) => (
                                            <tr key={sell._id} className="border-b">
                                                <td className="p-2">{sell.make || 'N/A'}</td>
                                                <td className="p-2">{sell.year || 'N/A'}</td>
                                                <td className="p-2">{sell.newOwner?.name || 'N/A'}</td>
                                                <td className="p-2">{sell.newOwner?.purchasePrice || 'N/A'}</td>
                                                <td className="p-2">{sell.createdAt ? new Date(sell.createdAt).toLocaleDateString() : 'N/A'}</td>
                                                <td className="p-2">
                                                    <button
                                                        onClick={() => handleUpdate('sell', sell._id, { ...sell, newOwner: { ...sell.newOwner, purchasePrice: prompt('New Sell Price', sell.newOwner?.purchasePrice) } })}
                                                        className="mr-2 bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600"
                                                        disabled={loading}
                                                    >
                                                        Update
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete('sell', sell._id)}
                                                        className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                                                        disabled={loading}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="p-2 text-center text-gray-500">
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
        </div>
    );
}

export default VehicleDetails;