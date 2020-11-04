import Portfolio from './components/portfolio/Portfolio'
import Stocks from './components/stocks/Stocks'
import Home from './components/Home'
import SearchLocation from './components/sites/SearchLocation'


export const routes = [
    { path: '/portfolio', component: Portfolio},
    { path: '/', component: Home},
    { path: '/searchLocation/:searchTerm', component: SearchLocation},
    { path: '/stocks', component: Stocks}
]