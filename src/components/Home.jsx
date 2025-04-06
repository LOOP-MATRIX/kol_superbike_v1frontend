// src/components/Home.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [enquiryType, setEnquiryType] = useState('purchase');
  const [enquiryData, setEnquiryData] = useState({
    name: '', mobile: '', brand: '', budget: '', model: '', color: '',
  });
  const [loading, setLoading] = useState(false);
  const [colors, setColors] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    fetchColors();
    fetchBrands();
  }, []);

  const fetchColors = async () => {
    try {
      const response = await fetch('http://localhost:8015/api/color');
      const data = await response.json();
      if (data.success) setColors(data.data);
    } catch (error) {
      console.error('Error fetching colors:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await fetch('http://localhost:8015/api/brand');
      const data = await response.json();
      if (data.success) setBrands(data.data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEnquiryData({ ...enquiryData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8015/api/enquiry/${enquiryType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enquiryData),
      });
      const data = await response.json();
      if (response.ok) {
        alert(`${enquiryType === 'purchase' ? 'Purchase' : 'Sell'} enquiry submit ho gayi bhai!`);
        setEnquiryData({ name: '', mobile: '', brand: '', budget: '', model: '', color: '' });
      } else {
        alert(data.error || 'Kuch galat ho gaya!');
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      alert('Server error!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white text-black min-h-screen flex flex-col">
      <nav className="bg-black text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-extrabold">Kolhapur Superbikes</h1>
        <button onClick={() => navigate('/login')} className="bg-white text-black p-2 rounded-lg hover:bg-gray-200 font-semibold">
          Login
        </button>
      </nav>

      <main className="flex-grow">
        <section className="bg-black text-white py-16 px-6 md:px-12 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">Ride Your Dream Superbike</h1>
          <p className="text-lg md:text-xl mb-8">Buy or Sell Pre-Owned Superbikes with Ease</p>
          
        </section>


        <section className="p-6 md:p-12 bg-black text-white">
          <h2 className="text-3xl font-bold mb-8 text-center border-b-2 border-white pb-2">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="text-center"><h3 className="text-xl font-semibold mb-2">Top Quality Bikes</h3><p>Every superbike is thoroughly inspected.</p></div>
            <div className="text-center"><h3 className="text-xl font-semibold mb-2">Best Prices</h3><p>Competitive rates for buying and selling.</p></div>
            <div className="text-center"><h3 className="text-xl font-semibold mb-2">Trusted Service</h3><p>Hassle-free and transparent transactions.</p></div>
          </div>
        </section>

        <section className="p-6 md:p-12 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 border-b-2 border-black pb-2">About Us</h2>
            <p className="text-lg leading-relaxed">
              Kolhapur Superbikes, based in Kolhapur district, specializes in high-quality pre-owned motorcycles, with a focus on superbikes. Since 2020, we have been committed to providing the best bikes at the best prices. Whether you're looking to buy a top-condition bike or sell yours for a great value, we ensure a smooth and trustworthy experience.
              <br />
              <span className="font-semibold">Your dream ride starts here!</span>
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-black text-white p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 border-b-2 border-white pb-2">Enquiry</h2>
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setEnquiryType('purchase')}
              className={`p-3 w-1/2 rounded-l-lg font-semibold ${enquiryType === 'purchase' ? 'bg-white text-black' : 'bg-black text-white border border-white hover:bg-gray-800'}`}
            >
              Purchase Enquiry
            </button>
            <button
              onClick={() => setEnquiryType('sell')}
              className={`p-3 w-1/2 rounded-r-lg font-semibold ${enquiryType === 'sell' ? 'bg-white text-black' : 'bg-black text-white border border-white hover:bg-gray-800'}`}
            >
              Sell Enquiry
            </button>
          </div>
          <form onSubmit={handleSubmit} className="bg-white text-black p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">{enquiryType === 'purchase' ? 'Purchase Enquiry' : 'Sell Enquiry'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="name" value={enquiryData.name} onChange={handleChange} placeholder="Name" className="p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black" required />
              <input type="tel" name="mobile" value={enquiryData.mobile} onChange={handleChange} placeholder="Mobile" className="p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black" required />
              <select name="brand" value={enquiryData.brand} onChange={handleChange} className="p-3 border border-black rounded-lg" required>
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand._id} value={brand.name}>{brand.name}</option>
                ))}
              </select>
              <input type="number" name="budget" value={enquiryData.budget} onChange={handleChange} placeholder="Budget" className="p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black" required />
              <input type="text" name="model" value={enquiryData.model} onChange={handleChange} placeholder="Model" className="p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black" required />
              <select name="color" value={enquiryData.color} onChange={handleChange} className="p-3 border border-black rounded-lg" required>
                <option value="">Select Color</option>
                {colors.map((color) => (
                  <option key={color._id} value={color.name}>{color.name}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full bg-black text-white p-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
            >
              {loading ? 'Submitting...' : 'Submit Enquiry'}
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}

export default Home;