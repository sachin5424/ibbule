const mongoose  = require('mongoose');
const {environment} = require('./env');
mongoose.set('strictQuery', false);
exports.connection = async() =>{
 
     var connectionString = environment.db_url
    await mongoose.connect(connectionString,{useNewUrlParser: true})
      mongoose.connection.on('connected', function () {
     console.log(`****************************************************\n****************************************************\n******************* ${'bubble'} *******************\n****************************************************\n****************************************************
     `)
    });
 
    mongoose.connection.on('error', function (err) {
        //console.log(("Mongoose default connection has occured " + err + " error"));
    });
        mongoose.connection.on('disconnected', function () {
        //console.log(("Mongoose default connection is disconnected"));
    });
    
}




// const { MongoClient } = require('mongodb');

// const connectionString = 'mongodb://localhost:27017happyTaxi';

// export const mongodb =  MongoClient.connect(connectionString, {}).then((client) => {
//     const db = client.db('node-mongo-blog');
//     // do database things
// }).catch((error) => {
//     // handle connection errors
// });