const {Schema,Model} = require('mongoose');
const mongoose= require('mongoose');
const Inc = require('mongoose-sequence');

const AutoIncrement = Inc(mongoose)

const schema = Schema({
    uniswap_pool_id:{
        type:Number,
    },
    network_id:{
        type:Number
    },
    height:{
        type:Number
    },
    token0_time:{
        type:Date,
    },
    token0_address:{
        type:String
    },
    token1_time:{
        type:Date
    },
    token1_address:{
        type:String
    },
    pair_time:{
        type:Date,
    },
    pair_address:{
        type:String
    },
    
},{ timestamps: true });

schema.plugin(AutoIncrement, { inc_field: "uniswap_pool_id" });
exports.uniswap_pools_model = mongoose.model("uniswap_pools",schema)