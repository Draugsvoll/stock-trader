
const state = {
    funds: 10000,
    stocks: []
}

const mutations = { // mutations -> listens to triggers to update state
    'BUY_STOCK'(state, {stockId, quantity, stockPrice, stockName}) {   // disse data kommer fra en ORDER i Stock.vue
        if ( (quantity*stockPrice) < state.funds)   {
            const record = state.stocks.find(element => element.id == stockId)  // sjekker om vi allerede har denne akjsen og vil 'appende' til portfolio 
                                                                                // find() er en metode for arrays, return true/false
            if (record) {
                record.quantity += quantity
                state.funds -= quantity * stockPrice
            }else {
                state.stocks.push({
                    id: stockId,
                    quantity: quantity,
                    name: stockName
                })
            state.funds -= quantity * stockPrice
            }
        } else {(alert('Insufficient Funds'))}
    },
    'SELL_STOCK' (state, {stockId, quantity, stockPrice}) {
        const record = state.stocks.find(element => element.id == stockId)
        if (record.quantity > quantity) {
            record.quantity -= quantity
        }else { // else if sell exactly all
            state.stocks.splice(state.stocks.indexOf(record), 1) // remove this stock from stocks
        }
        state.funds += stockPrice * quantity
    },
    'SET_PORTFOLIO' (state, portfolio) {
        state.funds = portfolio.funds
                        // if exist, then set it, otherwise empty array []
        state.stocks = portfolio.stockPortfolio ? portfolio.stockPortfolio : []
    }
}

const actions = {   // available actions on this site
    sellStock({commit}, order) {
        commit('SELL_STOCK', order)
    }
}

const getters = {   // get data
/* export data UTEN map()
stockPortfolio(state) {
    return state.stocks
    */
    
    stockPortfolio(state, getters) {
        // for every stock found, fetch 'price' and return it (since we are missing that). We find the stock and its price based on stockId
        return state.stocks.map(stock => {  // map to transform each element in array
            const record = getters.stocks.find(element => element.id == stock.id)   // bruker getters fra store.js
            return {
                id: stock.id,
                quantity: stock.quantity,
                price: record.price,
                name: stock.name
            }
        })
    },
    oldFunds (state) {
        return state.funds
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}