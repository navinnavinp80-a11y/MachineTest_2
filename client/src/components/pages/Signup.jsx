import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User'); 
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        name, 
        email, 
        password, 
        role
      });
      alert('Signup successful! Please login.');
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSignup} className="bg-white p-6 rounded shadow-md w-80 flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        
        <input 
          type="text" 
          placeholder='Enter your name' 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
          className="border p-2 rounded" 
        />

        <input 
          type="email" 
          placeholder='Enter your Email'
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          className="border p-2 rounded" 
        />

        <input 
          type="password" 
          placeholder='Enter your password' 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          className="border p-2 rounded" 
        />

        <select 
          className="border p-2 rounded" 
          value={role} 
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="User">User</option>
          <option value="Manager">Manager</option>
          <option value="Admin">Admin</option>
        </select>

        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Sign Up
        </button>

        <p className="text-sm text-center mt-2">
          Already have an account? <Link to="/login" className="text-blue-500 underline">Login</Link>
        </p>
      </form>
    </div>
  );
}
