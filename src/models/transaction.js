const {Schema,Model} = require('mongoose');
const mongoose= require('mongoose');
const Inc = require('mongoose-sequence');

const AutoIncrement = Inc(mongoose)

const schema = Schema({
    transaction_id:{
        type:Number,
    },
    token:{
        type:String
    },
    buy:{
        type:String
    },
    sell:{
        type:String,
    },
    buy_plush_sell:{
        type:String,
    },
 
},{ timestamps: true })
schema.plugin(AutoIncrement, { inc_field: "transaction_id" });
exports.transactionModel = mongoose.model("transaction",schema)