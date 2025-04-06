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
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    fetchPurchases();
    fetchBrands();
    fetchEnquiries();
    if (selectedPurchase) fetchSells(selectedPurchase._id);
    else setSells([]);
  }, [selectedPurchase]);

  useEffect(() => {
    // Filter enquiries based on selected brand (make)
    if (formData.make) {
      const matchedEnquiries = enquiries.filter(
        (enquiry) => enquiry.brand === formData.make && enquiry.type === 'sell'
      );
      setFilteredEnquiries(matchedEnquiries);
    } else {
      setFilteredEnquiries([]);
    }
  }, [formData.make, enquiries]);

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

  const fetchBrands = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:8015/api/brand', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) setBrands(data.data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const fetchEnquiries = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:8015/api/enquiry', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) setEnquiries(data.data);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    }
  };

  const fetchSells = async (purchaseId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:8015/api/sell/purchase/${purchaseId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setSells(data.success && data.data.length > 0 ? data.data : []);
    } catch (error) {
      console.error('Error fetching sell records:', error);
      setSells([]);
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
    setFormData({ ...formData, purchaseId: purchase._id, make: purchase.brand || '', year: purchase.year || '' });
    setIsDropdownOpen(false);
    setSearchTerm('');
    setFilteredPurchases(purchases);
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
    Object.keys(formData).forEach((key) => form.append(key, formData[key]));
    if (adharPhoto) form.append('adharPhoto', adharPhoto);
    if (panPhoto) form.append('panPhoto', panPhoto);

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:8015/api/sell', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
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
        fetchSells(selectedPurchase._id);
      } else {
        alert(data.error || 'Kuch galat ho gaya!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Server error!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white text-black min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8 border-b-2 border-black pb-2">Sell Page</h1>
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
          <h3 className="text-lg font-bold">Selected Purchase Details</h3>
          <p><strong>Vehicle Number:</strong> {selectedPurchase.vehicleNumber}</p>
          <p><strong>Customer Name:</strong> {selectedPurchase.customerName}</p>
          <p><strong>Brand:</strong> {selectedPurchase.brand}</p>
          <p><strong>Year:</strong> {selectedPurchase.year}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8 border border-black">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="make"
            value={formData.make}
            onChange={handleChange}
            className="p-3 border border-black rounded-lg"
            required
          >
            <option value="">Select Brand</option>
            {brands.map((brand) => (
              <option key={brand._id} value={brand.name}>{brand.name}</option>
            ))}
          </select>
          <input
            name="year"
            value={formData.year}
            onChange={handleChange}
            className="p-3 border border-black rounded-lg"
            placeholder="Year"
          />
          <input
            name="executives"
            value={formData.executives}
            onChange={handleChange}
            className="p-3 border border-black rounded-lg"
            placeholder="Executives"
          />
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="p-3 border border-black rounded-lg"
            placeholder="New Owner Name"
            required
          />
          <input
            name="adharCard"
            value={formData.adharCard}
            onChange={handleChange}
            className="p-3 border border-black rounded-lg"
            placeholder="Aadhar Card"
          />
          <input
            name="panCard"
            value={formData.panCard}
            onChange={handleChange}
            className="p-3 border border-black rounded-lg"
            placeholder="PAN Card"
          />
          <input
            name="engineNumber"
            value={formData.engineNumber}
            onChange={handleChange}
            className="p-3 border border-black rounded-lg"
            placeholder="Engine Number"
          />
          <input
            name="chassisNumber"
            value={formData.chassisNumber}
            onChange={handleChange}
            className="p-3 border border-black rounded-lg"
            placeholder="Chassis Number"
          />
          <input
            name="mobileNo"
            value={formData.mobileNo}
            onChange={handleChange}
            className="p-3 border border-black rounded-lg"
            placeholder="Mobile No"
          />
          <input
            name="alternativeNo"
            value={formData.alternativeNo}
            onChange={handleChange}
            className="p-3 border border-black rounded-lg"
            placeholder="Alternative No"
          />
          <input
            name="purchasePrice"
            value={formData.purchasePrice}
            onChange={handleChange}
            className="p-3 border border-black rounded-lg"
            placeholder="Sell Price"
            type="number"
            required
          />
          <input
            type="file"
            name="adharPhoto"
            onChange={handleFileChange}
            className="p-3 border border-black rounded-lg"
          />
          <input
            type="file"
            name="panPhoto"
            onChange={handleFileChange}
            className="p-3 border border-black rounded-lg"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !formData.purchaseId}
          className="mt-6 w-full bg-black text-white p-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
        >
          {loading ? 'Adding...' : 'Add Sell Record'}
        </button>
      </form>

      {formData.make && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-black mb-8">
          <h2 className="text-2xl font-bold mb-4">Matching Sell Enquiries for {formData.make}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-black text-white">
                  <th className="p-3">Name</th>
                  <th className="p-3">Mobile</th>
                  <th className="p-3">Brand</th>
                  <th className="p-3">Model</th>
                  <th className="p-3">Color</th>
                  <th className="p-3">Budget</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Created At</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnquiries.length > 0 ? (
                  filteredEnquiries.map((enquiry) => (
                    <tr key={enquiry._id} className="border-b border-black">
                      <td className="p-3">{enquiry.name}</td>
                      <td className="p-3">{enquiry.mobile}</td>
                      <td className="p-3">{enquiry.brand}</td>
                      <td className="p-3">{enquiry.model}</td>
                      <td className="p-3">{enquiry.color}</td>
                      <td className="p-3">{enquiry.budget}</td>
                      <td className="p-3">{enquiry.type}</td>
                      <td className="p-3">{new Date(enquiry.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="p-3 text-center text-black">
                      No matching sell enquiries found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedPurchase && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-black">
          <h2 className="text-2xl font-bold mb-4">All Sell Records</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-black text-white">
                  <th className="p-3">Make</th>
                  <th className="p-3">Year</th>
                  <th className="p-3">New Owner</th>
                  <th className="p-3">Sell Price</th>
                  <th className="p-3">Created At</th>
                </tr>
              </thead>
              <tbody>
                {sells.length > 0 ? (
                  sells.map((sell) => (
                    <tr key={sell._id} className="border-b border-black">
                      <td className="p-3">{sell.make}</td>
                      <td className="p-3">{sell.year}</td>
                      <td className="p-3">{sell.newOwner?.name || 'N/A'}</td>
                      <td className="p-3">{sell.newOwner?.purchasePrice || 'N/A'}</td>
                      <td className="p-3">{new Date(sell.createdAt).toLocaleDateString()}</td>
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
      )}
    </div>
  );
}

export default Sell;