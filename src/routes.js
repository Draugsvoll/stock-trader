import Portfolio from './components/portfolio/Portfolio'
import PublicPortfolios from './components/publicPortfolios/Portfolios'
import ViewPortfolio from './components/publicPortfolios/ViewPortfolio'
import Stocks from './components/stocks/Stocks'
import News from './components/news/News'
import Home from './components/Home'


export const routes = [
    { path: '/portfolio', component: Portfolio},
    { path: '/news', component: News},
    { path: '/publicportfolios', component: PublicPortfolios},
    { path: '/viewportfolio', component: ViewPortfolio},
    { path: '/', component: Home},
    { path: '/stocks', component: Stocks}
]