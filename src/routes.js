import Portfolio from './components/portfolio/Portfolio'
import Stocks from './components/stocks/Stocks'
import Home from './components/Home'


export const routes = [
    { path: '/portfolio', component: Portfolio},
    { path: '/', component: Home},
    { path: '/stocks', component: Stocks}
]