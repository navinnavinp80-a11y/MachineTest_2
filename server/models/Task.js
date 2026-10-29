const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'], default: 'pending'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'], default: 'Low'
  },

  dueDate: {
    type: Date,
    required: true,
  },

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);