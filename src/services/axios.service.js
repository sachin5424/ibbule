var axios = require('axios');

// step 1   per 1 mint call


exports.created_uniswap_pools = async () => {
  try {
    var data = {
      query: `{
          ethereum {
            arguments(smartContractAddress: 
              {is: "0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f"},
              smartContractEvent: {is: "PairCreated"}, 
              options: {desc: "block.height", limit: 90}) {
              block {
                timestamp {
                  time(format: "%Y-%m-%d %H:%M:%S")
                }
                height
              }
              argument {
                name
              }
              reference {
                address
              }
            }
          }
        }`,
      variables: {}
    }

    var config = {
      method: 'post',
      url: 'https://graphql.bitquery.io/',
      headers: {
        'X-API-KEY': 'BQYVYE0zXszpg0WGjGLukNwRlEYGXB04',
        'Content-Type': 'application/json'
      },
      data: data
    };

    let result = await axios(config)
    return result.data.data.ethereum

  } catch (error) {
    throw error
  }

}


exports.subcreated_uniswap_pools = async () => {
  try {
    var data = JSON.stringify({
      query: `{
     pairs(first: 500, orderBy: createdAtTimestamp, orderDirection: desc) {
    id
      liquidityProviderCount
    token0 {
           id
           symbol
           name
           derivedETH
           totalSupply
             
    }
         token1 {
           id
           symbol
           name
           derivedETH
          totalSupply
         }
         reserve0
         reserve1
         reserveUSD
         trackedReserveETH
         token0Price
         token1Price
         volumeUSD
         txCount
         totalSupply
        createdAtTimestamp
      
      
     }
    }`,
      variables: {}
    });
    
    var config = {
      method: 'post',
      url: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
      headers: { 
        'X-API-KEY': 'BQYVYE0zXszpg0WGjGLukNwRlEYGXB04', 
        'Content-Type': 'application/json'
      },
      data : data
    };
    
   let result = await  axios(config)
   
  //  console.log({result:result.data.data})
   return result.data.data.pairs

  } catch (error) {
    throw error
  }

}


// set 2 

exports.ethPriceInUSD = async () => {
  try {
    var data = JSON.stringify({
      query: `{
      ethereum(network: bsc) {
        dexTrades(
          baseCurrency: {is: "0x2170ed0880ac9a755fd29b2688956bd959f933f8"}
          quoteCurrency: {is: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d"}
          options: {desc: ["block.height", "transaction.index"], limit: 1}
          date: {}
        ) {
          block {
            height
            timestamp {
              time(format: "%Y-%m-%d %H:%M:%S")
            }
          }
          transaction {
            index
          }
          baseCurrency {
            symbol
          }
          quoteCurrency {
            symbol
          }
          quotePrice
        }
      }
    }`,
      variables: {}
    });

    var config = {
      method: 'post',
      url: 'https://graphql.bitquery.io/',
      headers: {
        'X-API-KEY': 'BQYVYE0zXszpg0WGjGLukNwRlEYGXB04',
        'Content-Type': 'application/json'
      },
      data: data
    };

    return axios(config)


  } catch (error) {
    throw error
  }
}

exports.sub_ethPriceInUSD = async () => {
  try {
    var data = JSON.stringify({
      query: `{
     bundle(id: "1" ) {
       ethPrice
     }
    }`,
      variables: {}
    });
    
    var config = {
      method: 'post',
      url: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
      headers: { 
        'X-API-KEY': 'BQYVYE0zXszpg0WGjGLukNwRlEYGXB04', 
        'Content-Type': 'application/json'
      },
      data : data
    };
    
   let result = await axios(config);
   return result.data.data.bundle
  } catch (error) {
    throw error
  }
}


//set 3 


exports.getTokenPriceandTotalLiquidity = async (token) => {
  try {
    console.log({ token })
    var data = JSON.stringify({
      query: `{
        pair(id:"${token}"){
            token0 {
              id
              symbol
              name
              derivedETH
            }
            token1 {
              id
              symbol
              name
              derivedETH
            }
            reserve0
            reserve1
            reserveUSD
            trackedReserveETH
            token0Price
            token1Price
            volumeUSD
            txCount
 }
}`,
      variables: {}
    });

    var config = {
      method: 'post',
      url: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
      headers: {
        'X-API-KEY': 'BQYVYE0zXszpg0WGjGLukNwRlEYGXB04',
        'Content-Type': 'application/json'
      },
      data: data
    };

    let result = await axios(config)
    console.log({result:result.data})
    return result.data.data.pair

  } catch (error) {
    throw error
  }
}


exports.getContractCreation = async(token)=>{
  try {

    var config = {
      method: 'get',
      url: `https://api.etherscan.io/api?module=contract&action=getcontractcreation&contractaddresses=${token}&apikey=N2FUHGCAJBNN3YS6AVQXJIH7DR4XPTK463`,
      headers: { }
    };
    
   let {data}= await axios(config);
   return data.result[0]
   console.log({getContractCreation_data:data.result})
  } catch (error) {
      throw error
  }
}


exports.Liquidity24Hour =async(token)=>{
   try {
var data = JSON.stringify({
  query: `{
 tokenDayDatas(orderBy: date, orderDirection: desc,
  where: {
    token: "${token}"
  }
 ) {
    id
    date
    priceUSD
    totalLiquidityToken
    totalLiquidityUSD
    totalLiquidityETH
    dailyVolumeETH
    dailyVolumeToken
    dailyVolumeUSD
 }
}`,
  variables: {}
});

var config = {
  method: 'post',
  url: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data
};

 let result = await axios(config)
  //  console.log({Liquidity24Hour:result.data.data.tokenDayDatas});
   return result.data.data.tokenDayDatas
   } catch (error) {
      throw error
   }
}






exports.getTokenLatestTransaction =async(pair_address)=>{
  try {
    var axios = require('axios');
var data = JSON.stringify({
  query: `{
swaps(orderBy: timestamp, orderDirection: desc, where:
 { pair: "${pair_address}" }
) {
     pair {
       token0 {
         symbol
       }
       token1 {
         symbol
       }
     }
     amount0In
     amount0Out
     amount1In
     amount1Out
     amountUSD
     to
 }
}`,
  variables: {}
});

var config = {
  method: 'post',
  url: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data
};

let result = await axios(config)
// console.log({pair_address:result.data.data.swaps})
return result.data.data.swaps

  } catch (error) {
    throw error
  }
}



exports.getCirculatingSupply =(token)=>{
  try {
var data = JSON.stringify({
  query: `{
  ethereum(network: ethereum) {
    transfers(date: {since: null, till: null}, amount: {gt: 0}) {
      minted: amount(
        calculate: sum
        sender: {in: ["0x0000000000000000000000000000000000000000", "0x000000000000000000000000000000000000dead"]}
      )
      burned: amount(
        calculate: sum
        receiver: {in: ["0x0000000000000000000000000000000000000000", "0x000000000000000000000000000000000000dead"]}
      )
      currency(currency: {is: "${token}"}) {
        symbol
        name
        tokenId
      }
    }
  }
}`,
  variables: {}
});

var config = {
  method: 'post',
  url: 'https://graphql.bitquery.io',
  headers: { 
    'X-API-KEY': 'BQYbbpYesEf6ISh66IdZp7AkMasygBjL', 
    'Content-Type': 'application/json'
  },
  data : data
};

return axios(config)


  } catch (error) {
      throw error
  }
}