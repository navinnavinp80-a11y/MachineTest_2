const express = require('express');
const Task = require('../models/Task');
const User = require('../models/User'); 
const nodemailer = require('nodemailer');

const router = express.Router();


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  
  }
});


const sendNotification = async (userId, subject, text) => {
  try {
    const user = await User.findById(userId);
    if (user && user.email) {
      await transporter.sendMail({ from: process.env.EMAIL_USER, to: user.email, subject, text });
    }
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};


router.post('/', async (req, res) => {
  try {
    const { title, description, priority, dueDate, assignedTo, createdBy } = req.body;
    
    const newTask = new Task({ title, description, priority, dueDate, assignedTo, createdBy });
    const savedTask = await newTask.save();
    
    req.io.emit('taskUpdated', savedTask);

    
    if (assignedTo) {
      sendNotification(assignedTo, 'New Task Assigned', `You have been assigned a new task: ${title}`);
    }

    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    
    const tasks = await Task.find().populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    req.io.emit('taskUpdated', updatedTask);

    
    if (updatedTask.assignedTo) {
      sendNotification(updatedTask.assignedTo, 'Task Updated', `Task "${updatedTask.title}" status changed to ${updatedTask.status}.`);
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task' });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    
    
    req.io.emit('taskDeleted', req.params.id);
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' });
  }
});

module.exports = router;