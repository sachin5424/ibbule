var cron = require('node-cron');
const { created_uniswap_pools, getContractCreation, Liquidity24Hour, getTokenLatestTransaction, subcreated_uniswap_pools, sub_ethPriceInUSD } = require("../services/axios.service");
const { services } = require("../services/_index")
const { models } = require('../models/_index');
var sockets = require('../services/socket');
const moment = require('moment');
var sprintf = require('sprintf-js').sprintf,
  vsprintf = require('sprintf-js').vsprintf
const zerosSub = (value) => {
  return value
}

// const all_data_token =async ()=>{
//   try {
//     let all_data = await models.tokenModel.find();
//     console.log({all_data})
//     sockets.emit("all_data", all_data)
//     return all_data
//   } catch (error) {
//       throw error
//   }
// }
// all_data_token().then((data)=>{
//   console.log({data})
// }).catch((err)=>{
//   console.log(err)
// })

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
  //console.log({per})
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

function numberExponentToLarge(numIn) {
  numIn +="";                                            // To cater to numric entries
  var sign="";                                           // To remember the number sign
  numIn.charAt(0)=="-" && (numIn =numIn.substring(1),sign ="-"); // remove - sign & remember it
  var str = numIn.split(/[eE]/g);                        // Split numberic string at e or E
  if (str.length<2) return sign+numIn;                   // Not an Exponent Number? Exit with orginal Num back
  var power = str[1];                                    // Get Exponent (Power) (could be + or -)
  if (power ==0 || power ==-0) return sign+str[0];       // If 0 exponents (i.e. 0|-0|+0) then That's any easy one
 
  var deciSp = 1.1.toLocaleString().substring(1,2);  // Get Deciaml Separator
  str = str[0].split(deciSp);                        // Split the Base Number into LH and RH at the decimal point
  var baseRH = str[1] || "",                         // RH Base part. Make sure we have a RH fraction else ""
      baseLH = str[0];                               // LH base part.
 
   if (power>0) {   // ------- Positive Exponents (Process the RH Base Part)
      if (power> baseRH.length) baseRH +="0".repeat(power-baseRH.length); // Pad with "0" at RH
      baseRH = baseRH.slice(0,power) + deciSp + baseRH.slice(power);      // Insert decSep at the correct place into RH base
      if (baseRH.charAt(baseRH.length-1) ==deciSp) baseRH =baseRH.slice(0,-1); // If decSep at RH end? => remove it
 
   } else {         // ------- Negative Exponents (Process the LH Base Part)
      let  num= Math.abs(power) - baseLH.length;                               // Delta necessary 0's
      if (num>0) baseLH = "0".repeat(num) + baseLH;                       // Pad with "0" at LH
      baseLH = baseLH.slice(0, power) + deciSp + baseLH.slice(power);     // Insert "." at the correct place into LH base
      if (baseLH.charAt(0) == deciSp) baseLH="0" + baseLH;                // If decSep at LH most? => add "0"
   }
  return sign + baseLH + baseRH;                                          // Return the long number (with sign)
  }



const sub_save_token_details = async () => {
  try {

    const result = await subcreated_uniswap_pools();
    let _ethPriceInUSD = await sub_ethPriceInUSD();
    let ethPriceInUSD_price = _ethPriceInUSD
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
        createdAtTimestamp: result[index]["createdAtTimestamp"],
        inital_liquidity_eth: "0",
        inital_liquidity_usd: "0"

      }
      
      let unix_timestamp = result[index]["createdAtTimestamp"]
      var date = new Date(unix_timestamp * 1000);
      // options["createdAtTimestampplus5Min"] = moment(date, "Y-m-d H:i:s").add(5, "minutes")
      options["createdAtTimestampplus5Min"] =parseInt(moment(date).add(5, "minutes").format('mmssmmHHMMYYYY'))
      // console.log(options)
      // return 
      // numberExponentToLarge
      // result[index]["token1Price"] = 
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
      options["token_latest_price"] = numberExponentToLarge(options["token_latest_price"])
      console.log({ethPriceInUSD_price})
      options["token_latest_price"] = ethPriceInUSD_price.ethPrice * options["token_latest_price"];
      options["token_latest_price"] = numberExponentToLarge(options["token_latest_price"])
      options["buy_plus_sell"] = result[index]["txCount"];


      options["etherscan_url"] = `https://etherscan.io/token/${options["token"]}`// 'https://etherscan.io/token/'.options["token"];
      options["etherscan_address"] = `<a target="_blank" href=${options["etherscan_url"]}>${options["token"]}</a>'`  // '<a target="_blank" href='.$etherscan_url.'>'.$token.'</a>';
      let _getContractCreation = await getContractCreation(options["pair_address"]);
      if (_getContractCreation) {
        if (_getContractCreation.mints.length != 0) {
          _getContractCreation = _getContractCreation.mints[0]
          options["contract_creator"] = _getContractCreation.to;
          options["inital_liquidity_eth"] = sprintf("%0.2f", _getContractCreation.amount0);
          options["inital_liquidity_usd"] = sprintf("%0.2f", _getContractCreation.amountUSD);
          if (_getContractCreation.pair.token0.symbol == 'WETH') {
            options["inital_liquidity_eth"] = sprintf("%0.2f", _getContractCreation.amount0);
            options["macketCap"] = _getContractCreation.amount1 * options["token_latest_price"];
          } else {
            options["inital_liquidity_eth"] = sprintf("%0.2f", _getContractCreation.amount1);
            options["macketCap"] = _getContractCreation.amount0 * options["token_latest_price"];
          }
        }
      }

      options["bubble_size"] = (1 / 0.1) * options["total_liquidity"];
      options["bubble_size"] = options["bubble_size"] / 100000;
      options["bubble_size"] = sprintf("%0.2f", 70 * options["bubble_size"]);
      let _Liquidity24Hour = await Liquidity24Hour(options["token"]);
      if (_Liquidity24Hour["tokenDayDatas"]) {
        if (_Liquidity24Hour.tokenDayDatas.length != 0) {
          _Liquidity24Hour = _Liquidity24Hour.tokenDayDatas
          options["liquidity_24_hour"] = _Liquidity24Hour[0].dailyVolumeUSD
        }
      }
      if (parseFloat(options["inital_liquidity_eth"]) == 0  && options["sell"] == 0 && options["buy"] == 0) {
        options["color_flag"] = "white";
      }
  
      if (options["total_liquidity"] <= 1) {
        options["color_flag"] = "gray";
        options["liquidity_event"] = "Liquidity Removed";
      }
      if (options["total_liquidity"] < 0) {
        options["rugpull"] = "Yes";
      }
      await models.TotalLiquidity.create({
        token: options["pair_address"],
        amount: options["total_liquidity"],
        amount_in_eth: options["total_liquidity"]
      })
      let latestTransaction = await getTokenLatestTransaction(options["pair_address"]);
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
    console.log(options.createdAtTimestampplus5Min,"createdAtTimestampplus5Min",moment(date).format('mmssmmHHMMYYYY'));
 
      if (options["sell"] <= 3 && parseInt(moment().format('mmssmmHHMMYYYY')) > options["createdAtTimestampplus5Min"]) {
        options["honeypot"] = 'Yes';
        options["color_flag"] = 'red';
      }

      
      options["buy_sell_ratio"] = buy_sell_ratio
      if (buy_plus_sell == 0) {
        options["color_flag"] = "white";
        options["bubble_size"] = (1 / 0.1) * options["inital_liquidity_usd"];
        options["bubble_size"] = options["bubble_size"] / 100000;
        options["bubble_size"] = sprintf("%0.2f", 70 * options["bubble_size"]);
      }

      if (options["inital_liquidity_eth"]> 0 &&  buy_plus_sell== 0) {
        options["color_flag"] = "blue";
    }
      if (options["buy"] > 10 && options["sell"] > 10) {
        options["color_flag"] = "green";
      }
      if (sellArr[0] > 1 && sellArr[1] > 2) {
        options["color_flag"] = "yellow";
      }
      let Transactions = await models.transactionModel.findOne({ token: options["token"] }).sort({ "_id": -1 })
      if (Transactions && buy_plus_sell > 0) {
        let pre_buy_plus_sell = Transactions["buy_plus_sell"];
        options["percentChangeTran"] = (1 - pre_buy_plus_sell / buy_plus_sell) * 100;
        options["percentChangeTran"] = sprintf("%0.2f", options["percentChangeTran"]);
      }

      options["percent_range_up_down_mvmnt"] = getRange(options["percentChangeTran"]);
      options["percent_range_left_right_mvmnt"] = getRange(buy_plus_sell);

      await models.transactionModel.create({
        token: options["token"],
        buy: options["buy"],
        sell: options["sell"],
        buy_plus_sell: buy_plus_sell ? buy_plus_sell : 0
      });
      if (options["currency_symbol"] != "NAN") {
        // existingData = Tokens::where(['token' => $token])->first();
        let existingData = await models.tokenModel.findOne({ token: options["token"] });
        if (!existingData) {
          let data = await models.tokenModel.create({ ...options });
          sockets.emit('new_token_create', data);
  console.log({data})
        }
        else {
          await models.tokenModel.updateOne({ _id: existingData._id }, { ...options });
          let data = await models.tokenModel.findOne({ _id: existingData._id });
          sockets.emit(`token_update`, data);
          console.log({data})
        }
      }
    }
  } catch (error) {
    throw error
  }
}

sub_save_token_details().then((data) => {
}).catch((err) => {
})





