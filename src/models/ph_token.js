const {Schema,Model} = require('mongoose');
const mongoose= require('mongoose');
const Inc = require('mongoose-sequence');
const AutoIncrement = Inc(mongoose)

// Create Network Master Schema 
const schema = Schema({
    token_id:{
        type:Number
    },
    token:{
        type:String
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
    currency_symbol:{
        type:String
    },
    token_latest_price:{
        type:String
    },
    contract_creator:{
        type:String
    },
    liquidity_event:{
        type:String
    },
    macketCap:{
        type:Number
    },
    bubble_size:{
        type:String
    },
    percent_change_movement	:{
        type:String
    },
    percent_range_up_down_mvmnt:{
        type:String
    },
    percent_range_left_right_mvmnt:{
        type:String
    },
    color_flag:{
        type:String
    },
    risk:{
        type:Number
    },
    buy:{
        type:Number
    },
    sell:{
        type:Number
    },
    buy_sell_ratio:{
        type:String
    },
    liquidity_24_hour:{
        type:String
    },
    honeypot:{
        type:String
    },
    rugpull:{
        type:String
    },
    etherscan_address:{
        type:String
    },
    pooled:{
        type:String
    },
    total_liquidity:{
        type:String
    },
    total_liquidity_usd:{
        type:String
    },
    total_liquidity_in_eth:{
        type:String
    },
    inital_liquidity_eth:{
        type:String
    },
    inital_liquidity_usd:{
        type:String
    }


    
},{ timestamps: true })
schema.pre("save", function(next) {
    var self = this;
    
    next();
});
schema.plugin(AutoIncrement, { inc_field: "token_id" }); // autogenerate network id 
exports.tokenModel = mongoose.model("token",schema)