import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      
      alert('Login successful!');

      
      if (response.data.role === 'Admin') {
        navigate('/admin-panel');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80 flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        
        <input 
          type="email" 
          placeholder="Email" 
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        
        <input 
          type="password" 
          placeholder="Password" 
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />

        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Login
        </button>

        <p className="text-sm text-center mt-2">
          Don't have an account? <Link to="/signup" className="text-blue-500 underline">Sign Up</Link>
        </p>
      </form>
    </div>
  );
}