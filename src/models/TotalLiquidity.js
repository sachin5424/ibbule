const {Schema,Model} = require('mongoose');
const mongoose= require('mongoose');
const Inc = require('mongoose-sequence');

const AutoIncrement = Inc(mongoose)

const schema = Schema({
    liquidity_id:{
        type:Number,
    },
    amount_in_eth:{
        type:String
    },
    token:{
        type:String
    },
    amount:{
        type:String,
    },
 
},{ timestamps: true })
schema.plugin(AutoIncrement, { inc_field: "liquidity_id" });
exports.TotalLiquidity = mongoose.model("total_liquidity",schema)