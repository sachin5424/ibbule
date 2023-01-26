let io;

module.exports = {
  init: (server) => {
    io = require('socket.io')
     io = new io.Server(server,{
  ...{cors: {origin: "*"}}
});
    return io;
  },
  get: () => {
    if (!io) {
      throw new Error("socket is not initialized");
    }
    return io;
  }
};