const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http'); 
const { Server } = require('socket.io'); 
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/task'); 
const app = express();
const PORT = process.env.PORT || 5000;


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', 
  }
});


app.use(cors());
app.use(express.json());


app.use((req, res, next) => {
  req.io = io;
  next();
});


app.get('/', (req, res) => {
  res.send('Task Management Server is running');
});
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes); 


io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/task')
  .then(() => {
    console.log('Connected to MongoDB');
    
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });

module.exports = app;