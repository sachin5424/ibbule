const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const server = http.createServer(app);
const {environment} = require("../config/env")
const {connection} = require("../config/db");
const { Server } = require("socket.io");
const {models} = require("./models/_index");
const path = require("path");
// const {events} = require("./event/events")
const io = new Server(server,{
  ...{cors: {origin: "*"}}
});
var cron = require('./cron/_index');



const TicketManager = require("./event/events");

const ticketManager = new TicketManager();


let test = require("./cron/_index")
app.use(
  express.static(path.join(__dirname, "../build"))
);


app.use("*",(req,res)=>{
  try {
    res.sendFile(
      path.join(__dirname, "../build/index.html")
    );
  } catch (error) {
     throw error
  }
})

ticketManager.on("buy", (data) => {
    console.log("Someone bought a ticket!",data);
});
ticketManager.on("new", (data) => {
  console.log("Someone bought a ticket!",data);
});

ticketManager.on("test", (data) => {
  console.log("Someone bought a ticket!",data);
});

ticketManager.buy("test@email.com", 20);

app.use(cors());
connection()
io.on('connection', async(socket) => {
  console.log('a user connected');
  let data = await models.tokenModel.find()
    io.emit('token_data', data);
    test.myEvents.on("new_token_create",async(data)=>{
      console.log("Test started",data)
       data = await models.tokenModel.find()
       io.emit('new_token_data', data);
    })
   
});
// events.on("new_token_create",(data)=>{
//   console.log({data},"new token created");
// })
server.listen(environment.port,()=>{
  
  console.log(`server listening on ${environment.port}`)
})




