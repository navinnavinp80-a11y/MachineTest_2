import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '',
    assignedTo: ''
  });

  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/tasks', taskData);
      alert('Task successfully created and assigned!');
      
     
      setTaskData({ title: '', description: '', priority: 'Medium', dueDate: '', assignedTo: '' });
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create & Assign Task</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none"
              value={taskData.title}
              onChange={(e) => setTaskData({...taskData, title: e.target.value})}
            />
          </div>

          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              rows="3"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none"
              value={taskData.description}
              onChange={(e) => setTaskData({...taskData, description: e.target.value})}
            ></textarea>
          </div>

          <div className="flex gap-4">
            
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select 
                className="w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 outline-none"
                value={taskData.priority}
                onChange={(e) => setTaskData({...taskData, priority: e.target.value})}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

        
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input 
                type="date" 
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none"
                value={taskData.dueDate}
                onChange={(e) => setTaskData({...taskData, dueDate: e.target.value})}
              />
            </div>
          </div>

          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
            <select 
              required
              className="w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 outline-none"
              value={taskData.assignedTo}
              onChange={(e) => setTaskData({...taskData, assignedTo: e.target.value})}
            >
              <option value="" disabled>Select a User</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
          </div>

          <button 
            type="submit" 
            className="mt-4 bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Assign Task
          </button>
        </form>
      </div>
    </div>
  );
}