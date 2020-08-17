import stocks from '../../data/stocks'

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

