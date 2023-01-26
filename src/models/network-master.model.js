const {Schema,Model} = require('mongoose');
const mongoose= require('mongoose');
const Inc = require('mongoose-sequence');
const AutoIncrement = Inc(mongoose)

// Create Network Master Schema 
const schema = Schema({
    network_id:{
        type:Number, // autoincrement network Id 
    },
    network_title:{
        type:Number
    },
    network_code:{
        type:Number
    },
    network_address:{
        type:Date,
    },
    token1:{
        type:String
    },
    
},{ timestamps: true })
schema.plugin(AutoIncrement, { inc_field: "network_id" }); // autogenerate network id 
exports.network_master_model = mongoose.model("network_master",schema)