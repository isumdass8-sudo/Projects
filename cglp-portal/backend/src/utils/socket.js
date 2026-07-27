let io = null;

function initSocket(server) {
  const { Server } = require('socket.io');
  io = new Server(server, {
    cors: { origin: '*' }
  });

  io.on('connection', (socket) => {
    // Clients (admin dashboards) join a room to receive live updates
    socket.on('join-admin', () => socket.join('admin-room'));
  });

  return io;
}

function emitToAdmins(event, payload) {
  if (!io) return;
  io.to('admin-room').emit(event, payload);
}

module.exports = { initSocket, emitToAdmins };
