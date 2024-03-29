import { get500, getTopGainers, getTrending, getPortfolios, getNews, searchStock} from '../../data/stocksApi'

const state = {
    chartData: [],
    funds:0,
    stocks: [],
    searchedStock: ['owiegje'],
    searchResult: [],
    portfolios: [],
    articles: [ {headline: 'This is a headline'} ]
}



const mutations = {
   
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
        state.searchedStock = searchStock(searchTerm)
    },
    'RESET_STOCKS' (state) {
        state.stocks = []
    },
    'SET_FUNDS' (state, funds) {
        state.funds = funds
    },
    'SET_CHART' (state, chartData) {
        state.chartData = chartData
    },
    'SET_FAVS' (state, favourites) {
        state.stocks = favourites
    },
    'SET_SEARCHED_STOCK' (state, newStock) {
        state.stocks = [newStock]
    },
}

const actions = {   // aviable actions on this site
    buyStock: ({ commit }, order) => {
        commit('BUY_STOCK', order)  // commits 'BUY_STOCK' mutation defined in portfolio module
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
    },
    resetStocks: ({ commit } ) => {
        commit('RESET_STOCKS')
    },
    setFunds: ({ commit }, funds ) => {
        commit('SET_FUNDS', funds)
    },
    setChartData: ({ commit }, chartData ) => {
        commit('SET_CHART', chartData)
    },
    setFavourites: ({ commit }, favourites ) => {
        commit('SET_FAVS', favourites)
    },
    getSearchedStock: ({ commit }, newStock ) => {
        commit('SET_SEARCHED_STOCK', newStock)
    },
    
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
    searchedStock(state) {
        return state.searchedStock
    },
    funds(state) {
        return state.funds
    },
    chartData(state){
        return state.chartData
    },
    favourites(state){
        return state.favourites
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}

