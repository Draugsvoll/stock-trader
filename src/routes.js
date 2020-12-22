import Portfolio from './components/portfolio/Portfolio'
import PublicPortfolios from './components/publicPortfolios/Portfolios'
import ViewPortfolio from './components/publicPortfolios/ViewPortfolio'
import ViewStock from './components/stocks/ViewStock'
import Stocks from './components/stocks/Stocks'
import SearchStock from './components/stocks/SearchStock'
import News from './components/news/News'
import Home from './components/Home'


export const routes = [
    { path: '/portfolio', component: Portfolio},
    { path: '/news', component: News},
    { path: '/publicportfolios', component: PublicPortfolios},
    { path: '/publicportfolios/view/:id', component: ViewPortfolio},
    { path: '/viewportfolio', component: ViewPortfolio},
    { path: '/stocks/view/:id', component: ViewStock},
    { path: '/', component: Home},
    { path: '/stocks', component: Stocks},
    { path: '/stocks/search', component: SearchStock},
    { path: '/stocks/viewstock', component: ViewStock},
]