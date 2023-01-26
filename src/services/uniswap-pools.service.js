var axios = require('axios');
const {models} = require("../models/_index")

// step 1   per 1 mint call


exports.created_uniswap_pools =async(payload)=>{
     try {
       return  models.network_master_model.create(payload)
     } catch (error) {
         throw error
     }
    
}


exports.findOne_uniswap_pools =async(query)=>{
    try {
      return  models.network_master_model.findOne(query)
    } catch (error) {
        throw error
    }
   
}

