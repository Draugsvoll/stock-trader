import { getNews } from '../../data/stocksApi'
// import axios from 'axios'


const state = {
    articles: [ {headline: 'oeirgjh'} ]
}


const mutations = {
    'GET_NEWS' (state) {
        state.articles = getNews()
    }
}

const actions = {   // aviable actions on this site
    getNews: ({ commit }) => {
        commit('GET_NEWS')
    }
}

const getters = {
    getNews: ({ commit }) => {
        commit('GET_NEWS')
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}

