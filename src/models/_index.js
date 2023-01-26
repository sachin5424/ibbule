const {network_master_model} = require('./network-master.model');
const {uniswap_pools_model} = require('./uniswap-pools.model');
const {temp_table} = require('./temo-table');
const {TotalLiquidity} = require('./TotalLiquidity');
const {transactionModel} = require('./transaction');
const {tokenModel} = require("./ph_token")

// -------------------------------- model ----------------------------------------------------
exports.models = {
    network_master_model,
    uniswap_pools_model,
    temp_table,
    TotalLiquidity,
    transactionModel,
    tokenModel
}
// temp_table.create({
//     network_id:1
// }).then((data)=>{
//     console.log({data})
// })