const { Console } = require('console')                                              
const eventEmitter = require('events')                                              
const readline = require('readline')                                                
const fs = require('fs')                                                            
const Spot = require('./binance_Adaptor/spot')                                           
const { KEY, SECRET } = require('./api.export.js')    
const { Market } = require('./binance_Adaptor/modules/market.js')                        
const output = fs.createWriteStream('./write.log')                                  
const errorOutput = fs.createWriteStream('./error.log')  

const http = require('http')

const logger = new Console({
  stdout: output,
  stderr: errorOutput
})

const client = new Spot(
  KEY,
  SECRET,
  {}
)


async function parseData(data){
  const jsonData = JSON.parse(data)
  console.log("best bid", jsonData.b)
  console.log("best ask", jsonData.a)
  if (jsonData.a < 289.8){
    console.log("buy triggered at ", jsonData.a)
    //send http GET request to localhost:8888/buy/solusdt/1
      const options = {
        hostname: 'localhost',
        port: 8888,
        path: '/buy/solusdt/1',
        method: 'GET'
      }
      const req = http.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`)
      })
      req.end()
  }
}

const callback = {
  // open: () => do something
  // close: () => do something
  message: data => {
    parseData(data)
    //client.logger.log(data)
  }
}

const symbol = "solusdt"
const stream = client.bookTickerWS(symbol, callback)
