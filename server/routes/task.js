const express = require('express');
const Task = require('../models/Task');
const { verifyToken, verifyRole } = require('../middleware/auth'); 

const router = express.Router();


router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, description, priority, dueDate, assignedTo } = req.body;
    const newTask = new Task({
      title,
      description,
      priority,
      dueDate,
      assignedTo: assignedTo || req.user.id,
      createdBy: req.user.id
    });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
});


router.get('/', verifyToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority } = req.query;
    let query = {};
    
    
    if (req.user.role === 'User') {
      query.assignedTo = req.user.id;
    }

    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});


router.put('/:id', verifyToken, async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task' });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' });
  }
});

module.exports = router;