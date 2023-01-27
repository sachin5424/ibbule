var socketIO = require('socket.io');
var io = null;
var i = 0
module.exports = {

    connect: function(server) {
        io = socketIO(server,{
            ...{cors: {origin: "*"}}
        });
        // io
    },

    emit: function(event, values) {
        console.log(i++)
        if (io) {
            // io.on('connection', async(socket) => {
            //     console.log("hjgjf")
            //     io.sockets.emit(event, values);
            // })
            io.sockets.emit(event, values);
        }
    }
}