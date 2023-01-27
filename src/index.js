const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const server = http.createServer(app);
const {environment} = require("../config/env")
const {connection} = require("../config/db");
var sockets = require('./services/socket');
const {models} = require("./models/_index");
const path = require("path");
const tokenController = require('./controllers/token.controller')
var cron = require('./cron/_index');

let test = require("./cron/_index")
// app.use(
//   express.static(path.join(__dirname, "../build"))
// );
// app.use("/admin/*",(req,res)=>{
//   try {
//     res.sendFile(
//       path.join(__dirname, "../build/index.html")
//     );
//   } catch (error) {
//      throw error
//   }
// })
app.use(cors());
app.post('/api/all_data',tokenController.all_token_data)
// app.use('/static',express.static(path.join(__dirname, '../upload/')));


connection()
sockets.connect(server)
sockets.emit('event', { message: 'This is an event!' });
server.listen(environment.port,()=>{
  
  console.log(`server listening on ${environment.port}`)
})




