import { get500, getTopGainers, getTrending, getPortfolios, getNews } from '../../data/stocksApi'
// import axios from 'axios'


const state = {
    stocks: [],
    portfolios: [],
    articles: [ {headline: 'This is a headline'} ]
}

var initStocks = getTopGainers()
state.stocks = initStocks


const mutations = {
    'INIT_STOCKS' (state, stocks) {
        state.stocks = stocks
    },
    'UPDATE_PRICES' (state) {
        state.stocks.forEach(stock => {
            stock.price = Math.round(stock.price * (1 + Math.random() -0.45) ) 
        })
    },
    'GET_500_STOCKS' (state) {
        state.stocks = get500()
    },
    'GET_TRENDING_STOCKS' (state) {
        state.stocks = getTrending()
    },
    'GET_TOP_GAINERS_STOCKS' (state) {
        state.stocks = getTopGainers()
    },
    'GET_PORTFOLIOS' (state) {
        state.portfolios = getPortfolios()
    },
    'GET_NEWS' (state) {
        console.log('printer state articles fra mutation',state.articles)
        state.articles = getNews()
    }
}

const actions = {   // aviable actions on this site
    buyStock: ({ commit }, order) => {
        commit('BUY_STOCK', order)  // commits 'BUY_STOCK' mutation defined in portfolio module
    },
    initStocks: ({ commit }) => {
        commit('INIT_STOCKS', initStocks)
    },
    get500Stocks: ({ commit }) => {
        commit('GET_500_STOCKS')
    },
    getTrendingStocks: ({ commit }) => {
        commit('GET_TRENDING_STOCKS')
    },
    getTopGainersStocks: ({ commit }) => {
        commit('GET_TOP_GAINERS_STOCKS')
    },
    updatePrices: ({ commit }) => {
        commit('UPDATE_PRICES')
    }
    ,
    getPortfolios: ({ commit }) => {
        commit('GET_PORTFOLIOS')
    },
    getNews: ({ commit }) => {
        commit('GET_NEWS')
    }
}

const getters = {
    stocks(state) {
        return state.stocks
    },
    portfolios (state) {
        return state.portfolios
    },
    news(state) {
        return state.articles
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}

