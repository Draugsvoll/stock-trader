import axios from 'axios'

// GET S&P 500
export function get500 () {
    var newStocks = []
    const apiStocks = 'AMD, IBM, AAPL, TSLA, AMZN, MMM, CCL, KMX, CAT, IRM, SJM, ORLY, ORCL, VRSK, WYNN, ZBRA, UAL, UPS, ZTS, BA, BWA, DISCA, FTNT'
    const options = {
    method: 'GET',
    url: 'https://rapidapi.p.rapidapi.com/market/get-quotes',
    params: {region: 'US', symbols: apiStocks},
    headers: {
        'x-rapidapi-key': '624dc7754bmsh3f19b0e1fbd4882p18e7f1jsn0d9d641d8df8',
        'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
    }};
    axios.request(options).then(function (response) {
        const returnedStocks = response.data.quoteResponse.result
        console.log(returnedStocks)
        // return array name+price of each stock
        returnedStocks.forEach( stock => {
            const newStock = { name: stock.shortName, price: stock.regularMarketPrice, change: stock.regularMarketChange, symbol: stock.symbol}
            newStocks.push(newStock)
        });
        return newStocks
    }).catch(function (error) {
        console.error(error)
    });// S&P 500
    return newStocks
 } // get500


// GET TOP GAINERS
export function getTopGainers() {
    var newStocks = []
    const options = {
        method: 'GET',
        url: 'https://yahoo-finance15.p.rapidapi.com/api/yahoo/ga/topgainers',
        params: {start: '0'},
        headers: {
        'x-rapidapi-key': '624dc7754bmsh3f19b0e1fbd4882p18e7f1jsn0d9d641d8df8',
        'x-rapidapi-host': 'yahoo-finance15.p.rapidapi.com'
        }
    };
    axios.request(options).then(function (response) {
        response = response.data.quotes
        console.log(response)
        response.forEach( stock => {
                        const newStock = { name: stock.shortName, price: stock.regularMarketPrice, change: stock.regularMarketChange, symbol: stock.symbol}
                        newStocks.push(newStock)
                    });
    }).catch(function (error) {
        console.error(error)
    });
    return newStocks
} // top gainers


// GET TRENDING
export function getTrending () {
    var newStocks = []
    const options = {
    method: 'GET',
    url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-trending-tickers',
    params: {region: 'US'},
    headers: {
        'x-rapidapi-key': '624dc7754bmsh3f19b0e1fbd4882p18e7f1jsn0d9d641d8df8',
        'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
    }
    };

    axios.request(options).then(function (response) {
            const stocks = response.data.finance.result[0].quotes
            console.log('RESPNONSE ', stocks)
            stocks.forEach(stock => {
                const newStock = { name: stock.shortName, price: stock.regularMarketPrice, change: stock.regularMarketChange, symbol: stock.symbol}
                newStocks.push(newStock)
            });
        }).catch(function (error) {
            console.error(error)
        });
        return newStocks
} // get trending


export default {
    get500,
    getTopGainers,
    getTrending
}
