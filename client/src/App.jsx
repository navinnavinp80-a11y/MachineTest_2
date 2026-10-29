import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';


const Dashboard = () => <div className="p-4 text-2xl font-bold">User/Manager Dashboard</div>;
const AdminPanel = () => <div className="p-4 text-2xl font-bold">Admin Panel</div>;

export default function App() {
  return (
    <Routes>
      
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      
      <Route element={<ProtectedRoute allowedRoles={['User', 'Manager', 'Admin']} />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      
      
      <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
        <Route path="/admin-panel" element={<AdminPanel />} />
      </Route>
    </Routes>
  );
}