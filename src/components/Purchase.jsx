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
    insuranceStatus: 'expired',
    validTill: '',
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
    executiveName: 'Self',
    commissionPrice: '0',
  });
  const [adharPhoto, setAdharPhoto] = useState(null);
  const [panPhoto, setPanPhoto] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:8015/api/purchase', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setPurchases(data.data);
      }
    } catch (error) {
      console.error('Error fetching purchases:', error);
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
    form.append('date', formData.date);
    form.append('vehicleNumber', formData.vehicleNumber);
    form.append('customerName', formData.customerName);
    form.append('companyName', formData.companyName);
    form.append('modelNumber', formData.modelNumber);
    form.append('brand', formData.brand);
    form.append('year', formData.year);
    form.append('KM', formData.KM);
    form.append('insuranceStatus', formData.insuranceStatus);
    form.append('validTill', formData.validTill);
    form.append('color', formData.color);
    form.append('dealAmount', formData.dealAmount);
    form.append('RTO', formData.RTO);
    form.append('insuranceCost', formData.insuranceCost);
    form.append('LICNumber', formData.LICNumber);
    form.append('adharCard', formData.adharCard);
    form.append('panCard', formData.panCard);
    form.append('engineNumber', formData.engineNumber);
    form.append('chassisNumber', formData.chassisNumber);
    form.append('mobileNo', formData.mobileNo);
    form.append('alternativeNo', formData.alternativeNo);
    form.append('purchasePrice', formData.purchasePrice);
    form.append('executiveName', formData.executiveName);
    form.append('commissionPrice', formData.commissionPrice);
    if (adharPhoto) form.append('adharPhoto', adharPhoto);
    if (panPhoto) form.append('panPhoto', panPhoto);

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:8015/api/purchase', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: form,
      });
      const data = await response.json();
      console.log('Backend Response:', data); // Debug ke liye
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
          insuranceStatus: 'expired',
          validTill: '',
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
          executiveName: 'Self',
          commissionPrice: '0',
        });
        setAdharPhoto(null);
        setPanPhoto(null);
        fetchPurchases();
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
      <h1 className="text-3xl font-bold mb-6">Purchase Page</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="date" name="date" value={formData.date} onChange={handleChange} className="p-2 border rounded" />
          <input name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} className="p-2 border rounded" placeholder="Vehicle Number" />
          <input name="customerName" value={formData.customerName} onChange={handleChange} className="p-2 border rounded" placeholder="Customer Name" />
          <input name="companyName" value={formData.companyName} onChange={handleChange} className="p-2 border rounded" placeholder="Company Name" />
          <input name="modelNumber" value={formData.modelNumber} onChange={handleChange} className="p-2 border rounded" placeholder="Model Number" />
          <input name="brand" value={formData.brand} onChange={handleChange} className="p-2 border rounded" placeholder="Brand" />
          <input name="year" value={formData.year} onChange={handleChange} className="p-2 border rounded" placeholder="Year" />
          <input name="KM" value={formData.KM} onChange={handleChange} className="p-2 border rounded" placeholder="KM" type="number" />
          <select name="insuranceStatus" value={formData.insuranceStatus} onChange={handleChange} className="p-2 border rounded">
            <option value="expired">Expired</option>
            <option value="valid">Valid</option>
          </select>
          {formData.insuranceStatus === 'valid' && (
            <input type="date" name="validTill" value={formData.validTill} onChange={handleChange} className="p-2 border rounded" />
          )}
          <input name="color" value={formData.color} onChange={handleChange} className="p-2 border rounded" placeholder="Color" />
          <input name="dealAmount" value={formData.dealAmount} onChange={handleChange} className="p-2 border rounded" placeholder="Deal Amount" type="number" />
          <input name="RTO" value={formData.RTO} onChange={handleChange} className="p-2 border rounded" placeholder="RTO" type="number" />
          <input name="insuranceCost" value={formData.insuranceCost} onChange={handleChange} className="p-2 border rounded" placeholder="Insurance Cost" type="number" />
          <input name="LICNumber" value={formData.LICNumber} onChange={handleChange} className="p-2 border rounded" placeholder="LIC Number" />
          <input name="adharCard" value={formData.adharCard} onChange={handleChange} className="p-2 border rounded" placeholder="Aadhar Card" />
          <input name="panCard" value={formData.panCard} onChange={handleChange} className="p-2 border rounded" placeholder="PAN Card" />
          <input name="engineNumber" value={formData.engineNumber} onChange={handleChange} className="p-2 border rounded" placeholder="Engine Number" />
          <input name="chassisNumber" value={formData.chassisNumber} onChange={handleChange} className="p-2 border rounded" placeholder="Chassis Number" />
          <input name="mobileNo" value={formData.mobileNo} onChange={handleChange} className="p-2 border rounded" placeholder="Mobile No" />
          <input name="alternativeNo" value={formData.alternativeNo} onChange={handleChange} className="p-2 border rounded" placeholder="Alternative No" />
          <input name="purchasePrice" value={formData.purchasePrice} onChange={handleChange} className="p-2 border rounded" placeholder="Purchase Price" type="number" />
          <input type="file" name="adharPhoto" onChange={handleFileChange} className="p-2 border rounded" />
          <input type="file" name="panPhoto" onChange={handleFileChange} className="p-2 border rounded" />
          <select name="executiveName" value={formData.executiveName} onChange={handleChange} className="p-2 border rounded">
            <option value="Self">Self</option>
            <option value="Other">Other</option>
          </select>
          {formData.executiveName !== 'Self' && (
            <input name="commissionPrice" value={formData.commissionPrice} onChange={handleChange} className="p-2 border rounded" placeholder="Commission" type="number" />
          )}
        </div>
        <button type="submit" disabled={loading} className="mt-6 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400">
          {loading ? 'Adding...' : 'Add Purchase'}
        </button>
      </form>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">All Purchases</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Date</th>
                <th className="p-2">Vehicle No</th>
                <th className="p-2">Customer</th>
                <th className="p-2">Brand</th>
                <th className="p-2">Purchase Price</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase) => (
                <tr key={purchase._id} className="border-b">
                  <td className="p-2">{purchase.date}</td>
                  <td className="p-2">{purchase.vehicleNumber}</td>
                  <td className="p-2">{purchase.customerName}</td>
                  <td className="p-2">{purchase.brand}</td>
                  <td className="p-2">{purchase.purchasePrice || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Purchase;