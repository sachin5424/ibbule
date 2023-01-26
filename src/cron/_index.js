var cron = require('node-cron');
const { created_uniswap_pools, ethPriceInUSD, getTokenPriceandTotalLiquidity, getContractCreation, Liquidity24Hour, getTokenLatestTransaction, getCirculatingSupply, subcreated_uniswap_pools, sub_ethPriceInUSD } = require("../services/axios.service");
const { services } = require("../services/_index")
const { models } = require('../models/_index');
const TicketManager = require("../event/events");
const EventEmitter = require("events");
// const io = require('../socket')
const ticketManager = new TicketManager();
// const {events} = require("../event/events")
const moment = require('moment');
var sprintf = require('sprintf-js').sprintf,
  vsprintf = require('sprintf-js').vsprintf
const zerosSub = (value) => {
  return value
}


let Evenets = new EventEmitter.EventEmitter();

Evenets.on("test", () => {
  console.log("test started")
})
exports.myEvents = Evenets
// const etherscan_address_html = (etherscan_url,token)=>{
//   return `<a target="_blank" href='${options["etherscan_url"]}'>${options["token"]}</a>'`
// }

function findRatio(num1, num2) {
  for (i = num2; i > 1; i--) {
    if ((num1 % i) == 0 && (num2 % i) == 0) {
      num1 = num1 / i;
      num2 = num2 / i;
    }
  }
  return `${num1}/${num2}`;
}

function getRange(per) {
  console.log({per})
  per = parseInt(per);

  if (per >= 0 && per <= 25) return 1;
  else if (per > 25 && per <= 50) return 2;
  else if (per > 50 && per <= 75) return 3;
  else if (per > 75 && per <= 100) return 4;
  else if (per > 100 && per <= 125) return 5;
  else if (per > 125 && per <= 150) return 6;
  else if (per > 150 && per <= 175) return 7;
  else if (per > 175 && per <= 200) return 8;
  else if (per > 200 && per <= 225) return 9;
  else if (per > 225 && per <= 250) return 10;
  else if (per > 250) return 11;
  else if (per < 0 && per >= -25) return -1;
  else if (per < -25 && per >= -50) return -2;
  else if (per < -50 && per >= -75) return -3;
  else if (per < -75 && per >= -100) return -4;
  else if (per < -100 && per >= -125) return -5;
  else if (per < -125 && per >= -150) return -6;
  else if (per < -150 && per >= -175) return -7;
  else if (per < -175 && per >= -200) return -8;
  else if (per < -200 && per >= -225) return -9;
  else if (per < -225 && per >= -250) return -10;
  else if (per < -250) return -11;
  else return 15;
}
let test = async () => {
  let data = await created_uniswap_pools();

  // let data1 = await data.arguments.map(async (v) => {
  //     console.log( v.block.height)
  //      v['height'] = await v.block.height
  // })
  // console.log({data1})
  for (let index = 0; index < data.arguments.length; index++) {
    data.arguments[index]['height'] = data.arguments[index].block.height
    if (data.arguments[index].argument.name != "pair") {
      data.arguments[index][data.arguments[index].argument.name] = data.arguments[index].argument.name;
    }
    data.arguments[index][data.arguments[index].argument.name + '_' + 'address'] = data.arguments[index].reference.address;
    data.arguments[index][data.arguments[index].argument.name + '_' + 'time'] = data.arguments[index].block.timestamp.time;

  }

  //   const result = inventory.group(({ type }) => type);
  function groupBy(objectArray, property) {
    return objectArray.reduce((acc, obj) => {
      const key = obj[property];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }, {});
  }
  const groupedPeople = groupBy(data.arguments, 'height');
  console.log(groupedPeople, '/');
  let tempKey = Object.keys(groupedPeople)
  console.log(tempKey, '/');
  tempKey.map(async (v, id) => {
    console.log({ v },)
    console.log({ ...groupedPeople[v][0], ...groupedPeople[v][1], ...groupedPeople[v][2] })
    let result = await models.uniswap_pools_model.findOne({ height: v });
    if (!result) {
      await models.uniswap_pools_model.create({
        height: v,
        ...{ ...groupedPeople[v][0], ...groupedPeople[v][1], ...groupedPeople[v][2] }
      })
    }
    // groupedPeople[v].map((k,id)=>{
    //     let obj ={}
    //     obj ={...obj,...k}
    //     console.log({...obj,id})
    // })
  })
  //  console.log(groupedPeople[tempKey[0]][0])
  //  console.log(groupedPeople[tempKey[0]][1])
  //  console.log(groupedPeople[tempKey[0]][1])
  //  console.log({...groupedPeople[tempKey[0]][0],...groupedPeople[tempKey[0]][1],...groupedPeople[tempKey[0]][2]})
  //      let arry =[]
  //   console.log(groupedPeople[tempKey[0]])
  //   console.log(groupedPeople[tempKey[0][1]])
  //   arry = [...arry,]
  //   console.log(arry)
  //  tempKey.map((v,id)=>{
  //     let obj = {}
  //     groupedPeople[v].map((k)=>{
  //         console.log(k,":")

  //     })
  //     // console.log(groupedPeople[v],"?")
  //  })
  //  console.log({data:data,result})
  // console.log({result:result[0]})
  // for (let index = 0; index < data.arguments.length; index++) {
  //     // const element = array[index];

  //     let result = await models.uniswap_pools_model.findOne({height:data.arguments[index].block.height});

  //     if(!result){
  //         console.log(data.arguments[index].block.height,result)
  //         await models.uniswap_pools_model.create({
  //             height:data.arguments[index].block.height
  //         })
  //     }
  //     // console.log(result)
  //     if(result){
  //         if(data.arguments[index].block.height == result.height){
  //             // console.log(result);

  //             let obj = {

  //             }
  //             let obj1 = {

  //             }

  //             let pair ={}
  //             let k ={}
  //             if(data.arguments[index].argument.name == "token0"){

  //                 obj['token0_time'] = data.arguments[index].block.timestamp.time
  //                 obj['token0_address'] = data.arguments[index].reference.address
  //                 k ={...k,...obj}
  //             }

  //             if(data.arguments[index].argument.name == "token1"){

  //                 obj1['token1_time'] = data.arguments[index].block.timestamp.time
  //                 obj1['token1_address'] = data.arguments[index].reference.address
  //                 k ={...k,...obj1}
  //             }
  //             if(data.arguments[index].argument.name == "pair"){

  //                 pair ={
  //                     pair_time:data.arguments[index].block.timestamp.time,
  //                     pair_address:data.arguments[index].reference.address
  //                 }
  //                 k ={...k,...pair}
  //             }

  //             // await models.uniswap_pools_model.updateOne({_id:result._id},{
  //             //    ...obj,...obj1,...pair
  //             // })
  //             console.log({k})
  //         }
  //     }

  // }

  // data.arguments.


}




// const save_token_details = async () => {
//     try {
//         let startdate = moment().subtract(6, 'd');
//         const result = await models.uniswap_pools_model.find()
//         let _ethPriceInUSD = await ethPriceInUSD();
//         let ethPriceInUSD_price = _ethPriceInUSD.data.data.ethereum.dexTrades[0].quotePrice;
//         // console.log({ data: ethPriceInUSD_price })
//         for (let index = 0; index < result.length; index++) {
//             let options = {
//                 token: result[index]["token0_address"],
//                 pair_address: result[index]["pair_address"],
//                 color_change: 0,
//                 color_flag: "yellow",
//                 currency_symbol: "NA",
//                 token_latest_price: "NA",
//                 contract_creator: 'NA',
//                 liquidity_event: 'Liquidity Add',
//                 risk: 0,
//                 percentChangeTran: 0,
//                 buy: 0,
//                 sell: 0,
//                 buy_plus_sell: 0,
//                 buy_sell_ratio: '0/0',
//                 liquidity_24_hour: 0,
//                 honeypot: 'No',
//                 rugpull: 'No',
//                 bubble_size: 0,
//                 macketCap: 0,
//             }
//             if (result[index]["token0_address"] == "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2") {
//                 options["token"] = result[index]["token1_address"]
//                 options["risk"] = 1;
//             }


//             options["etherscan_url"] = `https://etherscan.io/token/${options["token"]}`// 'https://etherscan.io/token/'.options["token"];
//             options["etherscan_address"] = `<a target="_blank" href='${options["etherscan_url"]}'>'${options["token"]}'</a>'`  // '<a target="_blank" href='.$etherscan_url.'>'.$token.'</a>';
//             const tokenPriceDetails = await getTokenPriceandTotalLiquidity(options["pair_address"]); //Subgraph/total liquidity
//             // console.log({ tokenPriceDetails: tokenPriceDetails })
//             if (tokenPriceDetails) {
//                 let   _getContractCreation = await  getContractCreation(options["token"]);
//                 if(_getContractCreation){
//                     options["contract_creator"] = _getContractCreation.contractCreator
//                 }
//                 console.log({_getContractCreation})
//                 options["currency_symbol"] = tokenPriceDetails["token1"]["symbol"];
//                 if (tokenPriceDetails.token0.id == "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2") {
//                     options["currency_symbol"] = tokenPriceDetails.token1.symbol;
//                   }
//                 options["token_latest_prices"] = parseFloat(tokenPriceDetails.token1Price) * parseFloat(ethPriceInUSD_price)
//                 options["token_latest_price"] = zerosSub(options["token_latest_prices"]);
//                 options["pooled"] = zerosSub(tokenPriceDetails.reserve0);
//                 options["options"] =zerosSub(tokenPriceDetails.reserveUSD);
//                 options["total_liquidity_in_eth"] =zerosSub(tokenPriceDetails.reserve1);
//                 options["bubble_size"] = tokenPriceDetails.reserve1
//                 options["bubble_size"] = (1/0.1)*options["bubble_size"];
//                 options["bubble_size"] = (50* options["bubble_size"])/100;  //pixel
//                 let   _Liquidity24Hour = await Liquidity24Hour(options["token"]);
//                    console.log({_Liquidity24Hour})
//                 if (_Liquidity24Hour.length !=0) {
//                      options["liquidity_24_hour"] =  _Liquidity24Hour[0].dailyVolumeUSD
//                   }

//                 let TotalLiquidityArr =  await models.TotalLiquidity.findOne({token:options["pair_address"]}).sort({"_id":-1}) //TotalLiquidity::where("token", $pair_address)->orderBy("liquidity_id", "asc")->first();
//                console.log({TotalLiquidityArr})
//                 if(TotalLiquidityArr){
//                     if(tokenPriceDetails.reserveUSD !=0){
//                         options["pre_TotalLiquidity"] = TotalLiquidityArr["amount"];
//                         options["colorChange"] = (1 - options["pre_TotalLiquidity"] / tokenPriceDetails.reserveUSD) * 100;
//                         options["color_change"] = options["colorChange"];
//                     }
//                 }
//                 if (options["color_change"] > 0) {
//                     options["color_flag"] = "green";
//                   }else{
//                     options["color_flag"] = "red";
//                   }
//                   if(tokenPriceDetails.reserveUSD<=1){
//                     options["color_flag"] = "gray";
//                     options["liquidity_event"] = "Liquidity Removed";
//                   }
//                   if(tokenPriceDetails.reserveUSD<0){
//                     options["rugpull"] = "Yes";
//                   }
//                   await models.TotalLiquidity.create({
//                     token: options["pair_address"],
//                     amount:tokenPriceDetails.reserveUSD,
//                     amount_in_eth:tokenPriceDetails.reserve1
//                   })
//                   let latestTransaction = await getTokenLatestTransaction(options["pair_address"]);

//                 //   console.log({latestTransaction})
//                   if (latestTransaction) {
//                     latestTransaction.map((v)=>{
//                     if (v.amount1In > 0) {
//                         options["buy"]+=1;
//                       }else{
//                         options["sell"]+=1;

//                       }
//                     })

//                   }
//                   let buy_plus_sell = options["buy"]+options["sell"];
//                   let buy_sell_ratio = findRatio( options["buy"],options["sell"]);
//                   let sellArr= buy_sell_ratio.split('/');
//                   console.log({buy_sell_ratio})
//                   // options["buy_plus_sell"] = buy_sell_ratio
//                   options["buy_sell_ratio"] = buy_sell_ratio
//                   if(sellArr[1]<=3){

//                     options["honeypot"] = 'Yes';
//                   }

//                   if(buy_sell_ratio == 0){
//                     options["color_flag"] = "yellow";
//                   }

//                   let Transactions = await models.transactionModel.findOne({token:options["token"]}).sort({"_id":-1})
//                  // $Transactions = Transactions::where("token", $token)->orderBy("transaction_id", "desc")->first();
//                  if (Transactions && buy_plus_sell>0) {
//                     let pre_buy_plus_sell = Transactions["buy_plus_sell"];

//                      options["percentChangeTran"] = (1 - pre_buy_plus_sell / buy_plus_sell) * 100;
//                      options["percentChangeTran"] = sprintf("%0.2f",  options["percentChangeTran"]);
//                   }

//                   options["percentChangeTran"] = getRange(options["percentChangeTran"]);

//                   await models.transactionModel.create({
//                     token:options["token"],
//                     buy:options["buy"],
//                     sell:options["sell"],
//                     buy_plus_sell
//                   });
//                   let _getCirculatingSupply = await getCirculatingSupply(options["token"]);  
//                   console.log({_getCirculatingSupply})
//                   let GetCirculatingSupply = _getCirculatingSupply.data.data.ethereum.transfers
//                 //   _getCirculatingSupply= _getCirculatingSupply.data.data.ethereum.transfers
//                   console.log({GetCirculatingSupply})
//                   if (GetCirculatingSupply.length !=0) {
//                       let totalSupply = GetCirculatingSupply[0].minted -GetCirculatingSupply[0].burned;
//                      options["macketCap"] = totalSupply*  options["token_latest_prices"];
//                      options["macketCap"] = sprintf("%.15f", parseFloat(options["macketCap"]))
//                   } 
//                   if(options["currency_symbol"] != "NAN"){
//                     // existingData = Tokens::where(['token' => $token])->first();
//                     let existingData = await models.tokenModel.findOne({token:options["token"]});
//                     if(!existingData){
//                         await models.tokenModel.create({...options})
//                     }
//                     else{
//                         await models.tokenModel.updateOne({_id:existingData._id},{...options})
//                     }
//                   }
//                 //   Transactions::Create(["token" => $token, "buy" => $buy, "sell" => $sell, "buy_plus_sell" => $buy_plus_sell]);
//                   console.log({buy_sell_ratio,buy_plus_sell,sellArr})
//                   //findRatio
//             }

//             // getContractCreation
//             console.log({ options })
//         }

//         // console.log({result})
//     } catch (error) {
//         throw error
//     }
// }


const sub_save_token_details = async () => {
  try {

    let startdate = moment().subtract(6, 'd');
    const result = await subcreated_uniswap_pools();
    // console.log({result})
    let _ethPriceInUSD = await sub_ethPriceInUSD();

    let ethPriceInUSD_price = _ethPriceInUSD
    // console.log({ data: ethPriceInUSD_price })
    for (let index = 0; index < result.length; index++) {
      let options = {
        token: result[index]["token0"]["id"],
        pair_address: result[index]["id"],
        color_change: 0,
        color_flag: "white",
        currency_symbol: result[index]["token0"]["symbol"],
        token_latest_price: "NA",
        contract_creator: 'NA',
        liquidity_event: 'Liquidity Add',
        risk: 0,
        percentChangeTran: 0,
        buy: 0,
        sell: 0,
        buy_plus_sell: "0",
        buy_sell_ratio: '0/0',
        liquidity_24_hour: 0,
        honeypot: 'No',
        rugpull: 'No',
        bubble_size: 0,
        macketCap: 0,
        total_liquidity_in_eth: result[index]["reserve1"],
        total_liquidity: result[index]["reserveUSD"],
        pooled: result[index]["reserve0"],
        pair_time: result[index]["createdAtTimestamp"],
        createdAtTimestamp  :result[index]["createdAtTimestamp"],
        inital_liquidity_eth:"0",
        inital_liquidity_usd:"0"
        // createdAtTimestampplus5Min : moment( result[index]["createdAtTimestamp"],"Y-m-d H:i:s").add(5,"minutes")

      }
//       const dt = +new Date(result[index]["createdAtTimestamp"],)
//     const dateString = moment(dt).format("MM/DD/YYYY");
//     console.log(dateString)
//     const timestamp = result[index]["createdAtTimestamp"]
// const formatted = moment(timestamp).format('L');

// console.log(formatted); // "02/24/2018"


let unix_timestamp = result[index]["createdAtTimestamp"]
// Create a new JavaScript Date object based on the timestamp
// multiplied by 1000 so that the argument is in milliseconds, not seconds.
var date = new Date(unix_timestamp * 1000);
 options["createdAtTimestampplus5Min"] = moment( date,"Y-m-d H:i:s").add(5,"minutes")
      if (result[index]["token0"]["id"] == "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2") {
        options["token"] = result[index]["token1"]["id"];
        options["currency_symbol"] = result[index]["token1"]["symbol"],
          options["risk"] = 1;
      }
      if (result[index]["token0"]["id"] != "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2") {
        options["token_latest_price"] = result[index]["token1Price"];
      }
      else {
        options["token_latest_price"] = result[index]["token0Price"];
      }
      options["token_latest_price"] = ethPriceInUSD_price.ethPrice *options["token_latest_price"];
      options["buy_plus_sell"] = result[index]["txCount"];


      options["etherscan_url"] = `https://etherscan.io/token/${options["token"]}`// 'https://etherscan.io/token/'.options["token"];
      options["etherscan_address"] = `<a target="_blank" href=${options["etherscan_url"]}>${options["token"]}</a>'`  // '<a target="_blank" href='.$etherscan_url.'>'.$token.'</a>';
      // const tokenPriceDetails = await getTokenPriceandTotalLiquidity(options["pair_address"]); //Subgraph/total liquidity
      // console.log({ tokenPriceDetails: tokenPriceDetails })
      // if (tokenPriceDetails) {
      // getInitialLiquidityAndContractCreation
      let _getContractCreation = await getContractCreation(options["pair_address"]);
        // console.log({_getContractCreation})
        // return
      if (_getContractCreation) {
         if( _getContractCreation.mints.length != 0 ){
          _getContractCreation = _getContractCreation.mints[0]
          options["contract_creator"] = _getContractCreation.to;
          console.log(options["contract_creator"], _getContractCreation)
          // $contract_creator     = $getInitLqdtyCtrctCrtion[0]->to;
          options["inital_liquidity_eth"] = sprintf("%0.2f", _getContractCreation.amount0);
          // $inital_liquidity_eth = sprintf("%0.2f", $getInitLqdtyCtrctCrtion[0]->amount0);
          options["inital_liquidity_usd"] = sprintf("%0.2f", _getContractCreation.amountUSD);
          // $inital_liquidity_eth = 
          // $inital_liquidity_usd = sprintf("%0.2f", $getInitLqdtyCtrctCrtion[0]->amountUSD);
          if (_getContractCreation.pair.token0.symbol == 'WETH') {
            console.log({_getContractCreation})
            options["inital_liquidity_eth"] = sprintf("%0.2f", _getContractCreation.amount0);
            options["macketCap"] = _getContractCreation.amount1 * options["token_latest_price"];
  
          } else {
            options["inital_liquidity_eth"] = sprintf("%0.2f", _getContractCreation.amount1);
            options["macketCap"] = _getContractCreation.amount0 * options["token_latest_price"];
          }
         }
       
        // $macketCap =  number_abbr(sprintf("%.2f", floatval($macketCap)));
      }

      // console.log({_getContractCreation})
      // options["currency_symbol"] = tokenPriceDetails["token1"]["symbol"];
      // if (tokenPriceDetails.token0.id == "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2") {
      //     options["currency_symbol"] = tokenPriceDetails.token1.symbol;
      //   }
      // options["token_latest_prices"] = parseFloat(tokenPriceDetails.token1Price) * parseFloat(ethPriceInUSD_price)
      // options["token_latest_price"] = options["token_latest_prices"]
      // options["pooled"] = result[index]["reserve0"],
      // options["options"] =zerosSub(tokenPriceDetails.reserveUSD);
      // options["total_liquidity_in_eth"] =zerosSub(tokenPriceDetails.reserve1);
      // options["bubble_size"] = options["total_liquidity_in_eth"]
      // options["bubble_size"] = (1 / 0.1) * options["bubble_size"];
      // options["bubble_size"] = (50 * options["bubble_size"]) / 100;  //pixel
       options["bubble_size"]            = (1/0.1)*options["total_liquidity"];
       options["bubble_size"]            =    options["bubble_size"]  /100000;
       options["bubble_size"]             = sprintf("%0.2f", 70*options["bubble_size"]  );  
      let _Liquidity24Hour = await Liquidity24Hour(options["token"]);
      //  console.log({_Liquidity24Hour})
      if(_Liquidity24Hour["tokenDayDatas"]){
        if (_Liquidity24Hour.tokenDayDatas.length != 0) {
          _Liquidity24Hour = _Liquidity24Hour.tokenDayDatas
          // console.log({_Liquidity24Hour})
          options["liquidity_24_hour"] = _Liquidity24Hour[0].dailyVolumeUSD
        }
      }
     

      // let TotalLiquidityArr = await  models.TotalLiquidity.findOne({token:options["pair_address"]}).sort({"_id":-1}) //TotalLiquidity::where("token", $pair_address)->orderBy("liquidity_id", "asc")->first();
      // if(TotalLiquidityArr){
      //     if(options["total_liquidity"] !=0){
      //         options["pre_TotalLiquidity"] = TotalLiquidityArr["amount"];
      //         options["colorChange"] = (1 - options["pre_TotalLiquidity"] / options["total_liquidity"]) * 100;
      //         options["color_change"] = options["colorChange"];
      //     }
      // }

      // if (options["color_change"] > 0) {
      //     options["color_flag"] = "green";
      //   }else{
      //     options["color_flag"] = "red";
      //   }
      if (options["inital_liquidity_eth"] == 0) {
        options["color_flag"] = "white";
      }
      if (options["inital_liquidity_eth"] > 0) {
        options["color_flag"] = "blue";
      }
      if (options["total_liquidity"] <= 1) {
        options["color_flag"] = "gray";
        options["liquidity_event"] = "Liquidity Removed";
      }
      if (options["total_liquidity"] < 0) {
        options["rugpull"] = "Yes";
      }
      //  ................................................................


      // if($value->reserveUSD<=1){
      //   $color_flag = "gray";
      //   $liquidity_event = "Liquidity Removed";
      // }
      // if($value->reserveUSD<0){
      //   $rugpull = "Yes";
      // }



      await models.TotalLiquidity.create({
        token: options["pair_address"],
        amount: options["total_liquidity"],
        amount_in_eth: options["total_liquidity"]
      })
      let latestTransaction = await getTokenLatestTransaction(options["pair_address"]);

      //   console.log({latestTransaction})
      if (latestTransaction) {
        latestTransaction.map((v) => {
          if (v.amount1In > 0) {
            options["buy"] += 1;
          } else {
            options["sell"] += 1;

          }
        })

      }

      let buy_plus_sell = options["buy"] + options["sell"];
  
      let buy_sell_ratio = findRatio(options["buy"], options["sell"]);
      let sellArr = buy_sell_ratio.split('/');
     
      if(options["sell"]<=3 &&  moment().format("Y-m-d H:i:s") > options["createdAtTimestampplus5Min"]){
        options["honeypot"]    = 'Yes';
        options["color_flag"] = 'red';
      }
 
      // options["buy_plus_sell"] = buy_sell_ratio
      options["buy_sell_ratio"] = buy_sell_ratio
      // if (sellArr[1] <= 3) {

      //   options["honeypot"] = 'Yes';
      // }
      console.log({ buy_plus_sell })
      if (buy_plus_sell == 0) {
        // options["color_flag"] = "yellow";
        options["color_flag"] = "white";
        options["bubble_size"]            = (1/0.1)*options["inital_liquidity_usd"];
        options["bubble_size"]            = options["bubble_size"]/100000;
        options["bubble_size"]            = sprintf("%0.2f", 70*options["bubble_size"]);
      }

           if(options["buy"]>10 && options["sell"]>10){
           options["color_flag"] = "green";
        }
        if(sellArr[0]>1 && sellArr[1]>2){
           options["color_flag"] = "yellow";
        }
   ////////////////////////////////////////////////////////////////

      
        
        // if($buy_plus_sell == 0){
        //   $color_flag = "white";
        //   $bubble_size            = (1/0.1)*$inital_liquidity_usd;
        //   $bubble_size            = $bubble_size/100000;
        //   $bubble_size            = sprintf("%0.2f", 70*$bubble_size);
        // }

   

   ////////////////////////////////////////////////////////////////

      let Transactions = await models.transactionModel.findOne({ token: options["token"] }).sort({ "_id": -1 })
      // $Transactions = Transactions::where("token", $token)->orderBy("transaction_id", "desc")->first();
      if (Transactions && buy_plus_sell > 0) {
        console.log({Transactions})
        let pre_buy_plus_sell = Transactions["buy_plus_sell"];
  //  console.log({pre_buy_plus_sell , buy_plus_sell},"???") 
        options["percentChangeTran"] = (1 - pre_buy_plus_sell / buy_plus_sell) * 100;
        console.log( options["percentChangeTran"],pre_buy_plus_sell,buy_plus_sell,"............1")
      
        options["percentChangeTran"] = sprintf("%0.2f", options["percentChangeTran"]);
        console.log( options["percentChangeTran"],".............4")
      }

      options["percent_range_up_down_mvmnt"]    = getRange(options["percentChangeTran"]);
      options["percent_range_left_right_mvmnt"] = getRange(buy_plus_sell);
      // options["percentChangeTran"] = getRange(options["percentChangeTran"]);

      await models.transactionModel.create({
        token: options["token"],
        buy: options["buy"],
        sell: options["sell"],
        buy_plus_sell:buy_plus_sell?buy_plus_sell:0
      });
      //   let _getCirculatingSupply = await getCirculatingSupply(options["token"]);  
      //   let GetCirculatingSupply = _getCirculatingSupply.data.data.ethereum.transfers
      // //   _getCirculatingSupply= _getCirculatingSupply.data.data.ethereum.transfers
      //   // console.log({_getCirculatingSupply:_getCirculatingSupply.data.data});
      //   if(GetCirculatingSupply){
      //     if (GetCirculatingSupply.length !=0) {
      //       let totalSupply = GetCirculatingSupply[0].minted -GetCirculatingSupply[0].burned;
      //       console.log({totalSupply},totalSupply, parseFloat( options["token_latest_price"]))
      //      options["macketCap"] = totalSupply*  options["token_latest_price"];
      //      options["macketCap"] = sprintf("%.15f", parseFloat(options["macketCap"]))
      //   } 
      //   }

      if (options["currency_symbol"] != "NAN") {
        // existingData = Tokens::where(['token' => $token])->first();
        let existingData = await models.tokenModel.findOne({ token: options["token"] });
        if (!existingData) {
          let data = await models.tokenModel.create({ ...options });
          Evenets.emit("new_token_create", data)
          //  console.log({newData:data})
          //  let socket = io.get();
          //  socket.emit('token_data', data);
          //  ticketManager.new_token_create(data)
          //  ticketManager.buy("test@email.com", 20);
          //  events.on("new_token_create",data)
          // events.on("new_token_create",()=>{
          //   console.log("jhsghgsh")
          // })
          // events.emit('new_token_create', "First event");
        }
        else {
          await models.tokenModel.updateOne({ _id: existingData._id }, { ...options })
          Evenets.emit("test", options)
        }
      }

      //   Transactions::Create(["token" => $token, "buy" => $buy, "sell" => $sell, "buy_plus_sell" => $buy_plus_sell]);
      console.log({ buy_sell_ratio, buy_plus_sell, sellArr })
      //findRatio
      // }

      // getContractCreation
      console.log({ options })
      // return
    }

    // console.log({result})
  } catch (error) {
    throw error
  }
}

sub_save_token_details().then((data) => {
  // console.log({data})
}).catch((err) => {
  console.log({ err })
})
cron.schedule('* * * * *', async () => {

  console.log(data)
  // save_token_details()
  test()

  console.log('running a task every minute');
});




