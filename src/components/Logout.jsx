// src/components/Logout.jsx
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('adminToken');
    
    // Redirect to login page
    navigate('/');
    
    // Optional: Show alert
    alert('Logout ho gaya bhai!');
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Logout</h1>
      <p className="mb-4">Kya sachme logout karna hai?</p>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}

export default Logout;