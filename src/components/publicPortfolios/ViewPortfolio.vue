<template>
         <div class="container">
             <h1>xxxxxx's Portfolio</h1>
            <div class="portfolio">
                <h2> {{ portfolioId }}</h2>
                <h2> {{ pfName }}</h2>
                <div v-for="position in positions" :key="position.id">
                    {{ position.symbol }}
                    {{ position.price }}
                    {{ position.quantity }}
                </div>
            </div>
         </div>
</template>


<script>
import axios from 'axios'

export default {
    data () {
        return {
            portfolioId: this.$route.params.id,
            portfolioName: '',
            positions: [],
            pfName: this.$route.query.pfName
        }
    },
    methods: { 
       getPortfolio () {
           var positions = []
           var newPortfolioName = ''
           const options = {
            method: 'GET',
            url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-watchlist-detail',
            params: {userId: this.portfolioId, pfId: 'the_berkshire_hathaway_portfolio'},
            headers: {
                'x-rapidapi-key': '624dc7754bmsh3f19b0e1fbd4882p18e7f1jsn0d9d641d8df8',
                'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
            }
            };

            axios.request(options).then(function (response) {
                console.log(response.data.finance.result[0].portfolios[0]);
                response = response.data.finance.result[0].portfolios[0]
                // get name
                console.log(response.pfName)
                newPortfolioName = response.pfName
                // get positions
                response = response.positions
                response.forEach(position => {
                    const newPosition = { symbol: position.symbol, price: position.lots[0].purchasePrice, quantity: position.lots[0].quantity }
                    console.log('new position: ', newPosition)
                    positions.push(newPosition)
                }) // forEach
            }).catch(function (error) {
                console.error(error);
            })//axios
                this.portfolioName = newPortfolioName
                this.positions = positions

       } // get portfolio
    },
    created () {
        this.getPortfolio()
    }
}
</script>



<style  scoped>

h1,h2 {
    display: flex;
    max-width:300px;
    margin:auto;
}
.portfolio {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width:1000px;
    margin:auto;
}

</style>