// src/components/Purchase.jsx
import { useState, useEffect } from 'react';

function Purchase() {
  const [formData, setFormData] = useState({
    date: '',
    vehicleNumber: '',
    customerName: '',
    companyName: '',
    modelNumber: '',
    brand: '',
    year: '',
    KM: '',
    insuranceStatus: '',
    insuranceValidTill: '',
    color: '',
    dealAmount: '',
    RTO: '',
    insuranceCost: '',
    LICNumber: '',
    adharCard: '',
    panCard: '',
    engineNumber: '',
    chassisNumber: '',
    mobileNo: '',
    alternativeNo: '',
    purchasePrice: '',
    executiveName: '',
    commissionPrice: '',
  });
  const [adharPhoto, setAdharPhoto] = useState(null);
  const [panPhoto, setPanPhoto] = useState(null);
  const [colors, setColors] = useState([]);
  const [brands, setBrands] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchColors();
    fetchBrands();
    fetchEnquiries();
  }, []);

  useEffect(() => {
    // Filter enquiries based on selected brand
    if (formData.brand) {
      const matchedEnquiries = enquiries.filter(
        (enquiry) => enquiry.brand === formData.brand
      );
      setFilteredEnquiries(matchedEnquiries);
    } else {
      setFilteredEnquiries([]);
    }
  }, [formData.brand, enquiries]);

  const fetchColors = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:8015/api/color', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) setColors(data.data);
    } catch (error) {
      console.error('Error fetching colors:', error);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'adharPhoto') setAdharPhoto(files[0]);
    if (name === 'panPhoto') setPanPhoto(files[0]);
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
      const response = await fetch('http://localhost:8015/api/purchase', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: form,
      });
      const data = await response.json();
      if (data.success) {
        alert('Purchase add ho gaya bhai!');
        setFormData({
          date: '',
          vehicleNumber: '',
          customerName: '',
          companyName: '',
          modelNumber: '',
          brand: '',
          year: '',
          KM: '',
          insuranceStatus: '',
          insuranceValidTill: '',
          color: '',
          dealAmount: '',
          RTO: '',
          insuranceCost: '',
          LICNumber: '',
          adharCard: '',
          panCard: '',
          engineNumber: '',
          chassisNumber: '',
          mobileNo: '',
          alternativeNo: '',
          purchasePrice: '',
          executiveName: '',
          commissionPrice: '',
        });
        setAdharPhoto(null);
        setPanPhoto(null);
      } else {
        alert(data.error || 'Kuch galat ho gaya!');
      }
    } catch (error) {
      console.error('Error submitting purchase:', error);
      alert('Server error!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white text-black min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8 border-b-2 border-black pb-2 text-center">
        Add Purchase
      </h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border border-black mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vehicle Details */}
          <div>
            <label className="block text-sm font-semibold mb-1">Purchase Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Vehicle Number</label>
            <input
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleChange}
              className="w-full p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Vehicle Number"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Customer Name</label>
            <input
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              className="w-full p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Customer Name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Company Name</label>
            <input
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Company Name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Model Number</label>
            <input
              name="modelNumber"
              value={formData.modelNumber}
              onChange={handleChange}
              className="w-full p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Model Number"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Brand</label>
            <select
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            >
              <option value="">Select Brand</option>
              {brands.map((brand) => (
                <option key={brand._id} value={brand.name}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Year</label>
            <input
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Year"
              type="number"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">KM Driven</label>
            <input
              name="KM"
              value={formData.KM}
              onChange={handleChange}
              className="w-full p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="KM Driven"
              type="number"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Color</label>
            <select
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="w-full p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            >
              <option value="">Select Color</option>
              {colors.map((color) => (
                <option key={color._id} value={color.name}>
                  {color.name}
                </option>
              ))}
            </select>
          </div>

          {/* Insurance Details */}
          <div>
            <label className="block text-sm font-semibold mb-1">Insurance Status</label>
            <select
              name="insuranceStatus"
              value={formData.insuranceStatus}
              onChange={handleChange}
              className="w-full p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Select Status</option>
              <option value="valid">Valid</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          {formData.insuranceStatus === 'valid' && (
            <div>
              <label className="block text-sm font-semibold mb-1">Insurance Valid Till</label>
              <input
                name="insuranceValidTill"
                value={formData.insuranceValidTill}
                onChange={handleChange}
                className="w-full p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                type="date"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold mb-1">Deal Amount</label>
            <input
              name="dealAmount"
              value={formData.dealAmount}
              onChange={handleChange}
              className="w-full p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Deal Amount"
              type="number"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">RTO</label>
            <input
              name="RTO"
              value={formData.RTO}
              onChange={handleChange}
              className="w-full p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="RTO"
              type="number"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Insurance Cost</label>
            <input
              name="insuranceCost"
              value={formData.insuranceCost}
              onChange={handleChange}
              className="w-full p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Insurance Cost"
              type="number"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">LIC Number</label>
            <input
              name="LICNumber"
              value={formData.LICNumber}
              onChange={handleChange}
              className="w-full p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="LIC Number"
            />
          </div>

          {/* Old Owner Details */}
          <div>
            <label className="block text-sm font-semibold mb-1">Aadhar Card</label>
            <input
              name="adharCard"
              value={formData.adharCard}
              onChange={handleChange}
              className="w-full p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Aadhar Card"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">PAN Card</label>
            <input
              name="panCard"
              value={formData.panCard}
              onChange={handleChange}
              className="w-full p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="PAN Card"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Engine Number</label>
            <input
              name="engineNumber"
              value={formData.engineNumber}
              onChange={handleChange}
              className="w-full p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Engine Number"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Chassis Number</label>
            <input
              name="chassisNumber"
              value={formData.chassisNumber}
              onChange={handleChange}
              className="w-full p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Chassis Number"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Mobile Number</label>
            <input
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleChange}
              className="w-full p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Mobile Number"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Alternative Number</label>
            <input
              name="alternativeNo"
              value={formData.alternativeNo}
              onChange={handleChange}
              className="w-full p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Alternative Number"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Purchase Price</label>
            <input
              name="purchasePrice"
              value={formData.purchasePrice}
              onChange={handleChange}
              className="w-full p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Purchase Price"
              type="number"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Aadhar Photo</label>
            <input
              type="file"
              name="adharPhoto"
              onChange={handleFileChange}
              className="w-full p-3 border border-black rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">PAN Photo</label>
            <input
              type="file"
              name="panPhoto"
              onChange={handleFileChange}
              className="w-full p-3 border border-black rounded-lg"
            />
          </div>

          {/* Executive Details */}
          <div>
            <label className="block text-sm font-semibold mb-1">Executive Name</label>
            <input
              name="executiveName"
              value={formData.executiveName}
              onChange={handleChange}
              className="w-full p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Executive Name (or 'Self')"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Commission Price</label>
            <input
              name="commissionPrice"
              value={formData.commissionPrice}
              onChange={handleChange}
              className="w-full p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Commission Price"
              type="number"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full bg-black text-white p-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
        >
          {loading ? 'Adding...' : 'Add Purchase'}
        </button>
      </form>

      {/* Matching Enquiries Section */}
      {formData.brand && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-black">
          <h2 className="text-2xl font-bold mb-4">Matching Enquiries for {formData.brand}</h2>
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
                      No matching enquiries found
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

export default Purchase;