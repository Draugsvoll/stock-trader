import firebase from 'firebase'

import Portfolio from './components/portfolio/Portfolio'
import PublicPortfolios from './components/publicPortfolios/Portfolios'
import ViewPortfolio from './components/publicPortfolios/ViewPortfolio'
import ViewStock from './components/stocks/ViewStock'
import Stocks from './components/stocks/Stocks'
import SearchStock from './components/stocks/SearchStock'
import News from './components/news/News'
import Home from './components/Home'
import Login from './components/Login'

import VueRouter from 'vue-router'
import Vue from 'vue'
Vue.use(VueRouter)

const router = new VueRouter ({
    mode: 'history',
    routes : [
    { path: '/portfolio', component: Portfolio, meta: { requiresAuth: true }},
    { path: '/news', component: News, meta: { requiresAuth: true }},
    { path: '/publicportfolios', component: PublicPortfolios, meta: { requiresAuth: true }},
    { path: '/publicportfolios/view/:id', component: ViewPortfolio, meta: { requiresAuth: true }},
    { path: '/viewportfolio', component: ViewPortfolio, meta: { requiresAuth: true }},
    { path: '/stocks/view/:id', component: ViewStock, meta: { requiresAuth: true }},
    { path: '/', component: Home, meta: { requiresAuth: true }},
    { path: '/login', component: Login},
    { path: '/stocks', component: Stocks, meta: { requiresAuth: true }},
    { path: '/stocks/search', component: SearchStock, meta: { requiresAuth: true }},
    { path: '/stocks/viewstock', component: ViewStock, meta: { requiresAuth: true }},
]
})

router.beforeEach((to, from, next) => {
    const currentUser = firebase.auth().currentUser
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth) 
    console.log('user ', currentUser)
    
    if ( requiresAuth ) {
        if ( currentUser ) {
            next()
        }
        else {
            // go to login if user is not logged in
            next('/login')
        }
    }
    else {
        next()
    }
})

export default router