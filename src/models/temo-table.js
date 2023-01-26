const {Schema,Model} = require('mongoose');
const mongoose= require('mongoose');
const Inc = require('mongoose-sequence');

const AutoIncrement = Inc(mongoose)

const schema = Schema({
  
    network_id:{
        type:Number
    },
  
    
},{ timestamps: true })
exports.temp_table = mongoose.model("temp_table",schema)