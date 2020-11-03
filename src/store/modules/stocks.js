import stocks from '../../data/stocks'
import axios from 'axios'

var newStocks = []

// GET MULTIPLE STOCKS
const apiStocks = 'AMD, IBM, AAPL, TSLA, AMZN'
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
        console.log('Name: ', stock.shortName + ' Price: ', stock.regularMarketPrice)
        const newStock = { name: stock.shortName, price: stock.regularMarketPrice}
        newStocks.push(newStock)
    });
    state.stocks = newStocks
}).catch(function (error) {
    console.error(error)
});//multiple stocks

const state = {
    stocks: []
}

const mutations = {
    'SET_STOCKS' (state, stocks) {
        state.stocks = stocks
    },
    'UPDATE_PRICES' (state) {
        state.stocks.forEach(stock => {
            stock.price = Math.round(stock.price * (1 + Math.random() -0.45) ) 
        });
    }
}

const actions = {   // aviable actions on this site
    buyStock: ({ commit }, order) => {
        commit('BUY_STOCK', order)  // commits 'BUY_STOCK' mutation defined in portfolio module
    },
    initStocks: ({ commit }) => {
        commit('SET_STOCKS', stocks)
    },
    updatePrices: ({ commit }) => {
        commit('UPDATE_PRICES')
    }
}

const getters = {
    stocks(state) {
        return state.stocks
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}

