<template>
         <div class="container">
            <div class="portfolio">
                <h2> {{ pfId }} </h2>
                <div class="stocks" v-for="position in positions" :key="position.id">
                    {{ position.symbol }}
                    {{ position.price }}
                    {{ position.name }}
                    <button @click="viewStock(position.symbol)">View Stock</button>
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
            pfId: this.$route.query.pfId,    
            positions: [],
        }
    },
    methods: { 
       getPortfolio () {
           var positions = []
           const options = {
            method: 'GET',
            url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-watchlist-detail',
            params: {userId: this.portfolioId, pfId: this.pfId},
            headers: {
                'x-rapidapi-key': '624dc7754bmsh3f19b0e1fbd4882p18e7f1jsn0d9d641d8df8',
                'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
            }
            }
            axios.request(options).then( response => {
                var stocks = response.data.finance.result[0].quotes
                console.log(stocks)
                var newStocks = Object.entries(stocks)
                newStocks.forEach( stock => {
                    const newStock = { symbol: stock[0], name: stock[1].shortName, price: stock[1].regularMarketPrice}
                    positions.push(newStock)
                })
            }).catch(function (error) {
                console.error(error);
            })//axios
                this.positions = positions
       }, // get portfolio
       viewStock (symbol) {
        //    console.log('view stock', symbol)
       },
       testApi () {
           const options = {
                method: 'POST',
                url: 'https://colorme-ai.p.rapidapi.com/v1',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'x-rapidapi-key': '624dc7754bmsh3f19b0e1fbd4882p18e7f1jsn0d9d641d8df8',
                    'x-rapidapi-host': 'colorme-ai.p.rapidapi.com'
                },
                data: {
                    image: 'http://dujye7n3e5wjl.cloudfront.net/photographs/1080-tall/time-100-influential-photos-lunch-atop-skyscraper-19.jpg'
                }
                };

                axios.request(options).then(function (response) {
                    console.log(response.data);
                }).catch(function (error) {
                    console.error(error);
                });//axios
       }//method
    },
    created () {
        //this.getPortfolio()
        this.testApi()
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
    max-width:1000px;
    margin:auto;
    border:1px solid purple;
}
.stocks {
    display: inline-flex;
    margin:auto;
}

</style>