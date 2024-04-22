const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Route to serve the chat application
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Initialize an empty object to store connected users
let users = {};

// Socket.io connection handling
io.on('connection', socket => {
  // Event listener for new user joining chat
  socket.on('join', username => {
    // Add the new user to the list of connected users
    users[socket.id] = username;
    // Broadcast to all users that a new user has joined
    socket.broadcast.emit('userJoined', username);
  });

  // Event listener for incoming messages
  socket.on('message', message => {
    // Broadcast the message to all connected users
    io.emit('message', { username: users[socket.id], message });
  });

  // Event listener for user disconnection
  socket.on('disconnect', () => {
    // Broadcast to all users that a user has left the chat
    io.emit('userLeft', users[socket.id]);
    // Remove the user from the list of connected users
    delete users[socket.id];
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
