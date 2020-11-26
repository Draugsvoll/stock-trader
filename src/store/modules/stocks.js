import { get500, getTopGainers, getTrending, getPortfolios, getNews, searchStock, getSingleStock } from '../../data/stocksApi'
// import axios from 'axios'


const state = {
    stocks: [],
    searchResult: [],
    portfolios: [],
    abcd: 'value from the store',
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
        state.articles = getNews()
    },
    'SEARCH_STOCK' (state, searchTerm) {
        console.log('logging the functiono', searchStock(searchTerm))
        // state.abcd = searchStock(searchTerm)
        console.log('STATE ', state.abcd)     
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
    },
    searchstocks: ({ commit }, searchTerm) => {
        commit('SEARCH_STOCK', searchTerm)
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
    },
    abcd(state) {
        return state.abcd
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}

