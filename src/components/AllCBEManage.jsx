// src/components/ManageEntities.jsx
import { useState, useEffect } from 'react';

function ManageEntities() {
  // State for forms
  const [colorData, setColorData] = useState({ name: '' });
  const [brandData, setBrandData] = useState({ name: '' });
  const [executiveData, setExecutiveData] = useState({ name: '' });

  // State for lists
  const [colors, setColors] = useState([]);
  const [brands, setBrands] = useState([]);
  const [executives, setExecutives] = useState([]);

  // Loading state
  const [loading, setLoading] = useState({ color: false, brand: false, executive: false });

  // Toggle state
  const [activeTab, setActiveTab] = useState('color'); // Default: color

  // Fetch all data on mount
  useEffect(() => {
    fetchColors();
    fetchBrands();
    fetchExecutives();
  }, []);

  // Fetch functions
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

  const fetchExecutives = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:8015/api/executive', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) setExecutives(data.data);
    } catch (error) {
      console.error('Error fetching executives:', error);
    }
  };

  // Handle form changes
  const handleColorChange = (e) => setColorData({ name: e.target.value });
  const handleBrandChange = (e) => setBrandData({ name: e.target.value });
  const handleExecutiveChange = (e) => setExecutiveData({ name: e.target.value });

  // Handle form submits
  const handleColorSubmit = async (e) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, color: true }));
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:8015/api/color', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(colorData),
      });
      const data = await response.json();
      if (data.success) {
        alert('Color add ho gaya bhai!');
        setColorData({ name: '' });
        fetchColors();
      } else {
        alert(data.error || 'Kuch galat ho gaya!');
      }
    } catch (error) {
      console.error('Error adding color:', error);
      alert('Server error!');
    } finally {
      setLoading((prev) => ({ ...prev, color: false }));
    }
  };

  const handleBrandSubmit = async (e) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, brand: true }));
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:8015/api/brand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(brandData),
      });
      const data = await response.json();
      if (data.success) {
        alert('Brand add ho gaya bhai!');
        setBrandData({ name: '' });
        fetchBrands();
      } else {
        alert(data.error || 'Kuch galat ho gaya!');
      }
    } catch (error) {
      console.error('Error adding brand:', error);
      alert('Server error!');
    } finally {
      setLoading((prev) => ({ ...prev, brand: false }));
    }
  };

  const handleExecutiveSubmit = async (e) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, executive: true }));
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:8015/api/executive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(executiveData),
      });
      const data = await response.json();
      if (data.success) {
        alert('Executive add ho gaya bhai!');
        setExecutiveData({ name: '' });
        fetchExecutives();
      } else {
        alert(data.error || 'Kuch galat ho gaya!');
      }
    } catch (error) {
      console.error('Error adding executive:', error);
      alert('Server error!');
    } finally {
      setLoading((prev) => ({ ...prev, executive: false }));
    }
  };

  // Handle deletes
  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:8015/api/${type}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        alert(`${type.charAt(0).toUpperCase() + type.slice(1)} delete ho gaya bhai!`);
        if (type === 'color') fetchColors();
        if (type === 'brand') fetchBrands();
        if (type === 'executive') fetchExecutives();
      } else {
        alert(data.error || 'Delete failed!');
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      alert('Server error!');
    }
  };

  return (
    <div className="p-6 bg-white text-black min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8 border-b-2 border-black pb-2 text-center">
        Manage Entities
      </h1>

      {/* Toggle Buttons */}
      <div className="flex justify-center mb-8">
        <button
          onClick={() => setActiveTab('color')}
          className={`p-3 w-1/3 rounded-l-lg font-semibold ${
            activeTab === 'color' ? 'bg-black text-white' : 'bg-white text-black border border-black hover:bg-gray-200'
          }`}
        >
          Colors
        </button>
        <button
          onClick={() => setActiveTab('brand')}
          className={`p-3 w-1/3 font-semibold ${
            activeTab === 'brand' ? 'bg-black text-white' : 'bg-white text-black border border-black hover:bg-gray-200'
          }`}
        >
          Brands
        </button>
        <button
          onClick={() => setActiveTab('executive')}
          className={`p-3 w-1/3 rounded-r-lg font-semibold ${
            activeTab === 'executive' ? 'bg-black text-white' : 'bg-white text-black border border-black hover:bg-gray-200'
          }`}
        >Executives</button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'color' && (
        <section>
          <form onSubmit={handleColorSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6 border border-black">
            <div className="mb-4">
              <input
                type="text"
                name="name"
                value={colorData.name}
                onChange={handleColorChange}
                placeholder="Color Name"
                className="w-full p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading.color}
              className="w-full bg-black text-white p-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
            >
              {loading.color ? 'Adding...' : 'Add Color'}
            </button>
          </form>
          <div className="bg-white p-6 rounded-lg shadow-md border border-black">
            <h3 className="text-xl font-semibold mb-4">All Colors</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="p-3">Name</th>
                    <th className="p-3">Created At</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {colors.length > 0 ? (
                    colors.map((color) => (
                      <tr key={color._id} className="border-b border-black">
                        <td className="p-3">{color.name}</td>
                        <td className="p-3">{new Date(color.createdAt).toLocaleDateString()}</td>
                        <td className="p-3">
                          <button
                            onClick={() => handleDelete('color', color._id)}
                            className="bg-black text-white p-2 rounded hover:bg-gray-800"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="p-3 text-center text-black">
                        No Colors Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {activeTab === 'brand' && (
        <section>
          <form onSubmit={handleBrandSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6 border border-black">
            <div className="mb-4">
              <input
                type="text"
                name="name"
                value={brandData.name}
                onChange={handleBrandChange}
                placeholder="Brand Name"
                className="w-full p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading.brand}
              className="w-full bg-black text-white p-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
            >
              {loading.brand ? 'Adding...' : 'Add Brand'}
            </button>
          </form>
          <div className="bg-white p-6 rounded-lg shadow-md border border-black">
            <h3 className="text-xl font-semibold mb-4">All Brands</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="p-3">Name</th>
                    <th className="p-3">Created At</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {brands.length > 0 ? (
                    brands.map((brand) => (
                      <tr key={brand._id} className="border-b border-black">
                        <td className="p-3">{brand.name}</td>
                        <td className="p-3">{new Date(brand.createdAt).toLocaleDateString()}</td>
                        <td className="p-3">
                          <button
                            onClick={() => handleDelete('brand', brand._id)}
                            className="bg-black text-white p-2 rounded hover:bg-gray-800"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="p-3 text-center text-black">
                        No Brands Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {activeTab === 'executive' && (
        <section>
          <form onSubmit={handleExecutiveSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6 border border-black">
            <div className="mb-4">
              <input
                type="text"
                name="name"
                value={executiveData.name}
                onChange={handleExecutiveChange}
                placeholder="Executive Name"
                className="w-full p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading.executive}
              className="w-full bg-black text-white p-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
            >
              {loading.executive ? 'Adding...' : 'Add Executive'}
            </button>
          </form>
          <div className="bg-white p-6 rounded-lg shadow-md border border-black">
            <h3 className="text-xl font-semibold mb-4">All Executives</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="p-3">Name</th>
                    <th className="p-3">Created At</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {executives.length > 0 ? (
                    executives.map((executive) => (
                      <tr key={executive._id} className="border-b border-black">
                        <td className="p-3">{executive.name}</td>
                        <td className="p-3">{new Date(executive.createdAt).toLocaleDateString()}</td>
                        <td className="p-3">
                          <button
                            onClick={() => handleDelete('executive', executive._id)}
                            className="bg-black text-white p-2 rounded hover:bg-gray-800"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="p-3 text-center text-black">
                        No Executives Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default ManageEntities;