// lager action her siden den påvirker begge modules
import Vue from 'vue'

//action
export const loadData = ({commit}) => {
    Vue.http.get('data.json')
        .then(response => response.json())
        .then(data => {
            if (data) {
                const funds = data.funds
                const stockPortfolio = data.stockPortfolio

                const portfolio = {
                    stockPortfolio,
                    funds
                }
                commit('SET_PORTFOLIO', portfolio)
            }
        })
}