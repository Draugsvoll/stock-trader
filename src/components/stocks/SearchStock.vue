<template>
    <div class="box">
        
        <div class="btn-row">
            <button @click="getTrending">Trending</button>
            <button @click="getTopGainers">Top Gainers</button>
            <button @click="get500Stocks">S&P 500</button>
            <button @click="getPortfolios">Portfolios</button>
        </div>

        <h2>Search stock</h2>

        <div class="searchField">
            <input type="text"  v-model="searchTerm" autofocus placeholder="Tesla">
            <button class="search" @click="getSymbol" >Search</button>
        </div>
        
        <div class="tags">
                <div class="tag name">Name</div>
                <div class="tag">Market Price</div>
                <div class="tag">Change</div>
                <div class="tag">Symbol</div>
                <div class="tag">Previous Close</div>
        </div>

        <div class="stock-container">
            <app-stock v-for="stock in searchedStock" :stock="stock" :key="stock.id"></app-stock>
        </div>
    </div>
</template>



<script>
import Stock from './Stock.vue'
import axios from 'axios'

export default {
    data () {
        return {
            searchTerm: '',
            searchedStock: undefined
        }
    },
    components: {
        appStock: Stock,
    },
    methods: {
        searchStock () {
            const searchTerm = this.searchField
            this.$store.dispatch('searchstocks', searchTerm)
        },
        get500Stocks () {
            this.$store.dispatch('get500Stocks')
        },
        getTrending () {
            this.$store.dispatch('getTrendingStocks')
        },
        getTopGainers () {
            this.$store.dispatch('getTopGainersStocks')
        }
        ,
        getPortfolios () {
            this.$store.dispatch('getPortfolios')
        },
        getSymbol () {
            const ref = this
            var results = []
            const options = {
            method: 'GET',
            url: 'https://yahoo-finance-low-latency.p.rapidapi.com/v6/finance/autocomplete',
            params: {query: this.searchTerm, lang: 'en'},
            headers: {
                'x-rapidapi-key': '624dc7754bmsh3f19b0e1fbd4882p18e7f1jsn0d9d641d8df8',
                'x-rapidapi-host': 'yahoo-finance-low-latency.p.rapidapi.com'
            }}
            axios.request(options).then(function (response) {
                results = response.data
                const symbols = results.ResultSet.Result[0].symbol
                console.log('from api: ', symbols)
                ref.getStock(symbols)
            }).catch(function (error) {
                console.error(error);
            });
        },
        getStock (symbol) {
            const ref = this
            var searchedStock = []
            const options = {
            method: 'GET',
            url: 'https://rapidapi.p.rapidapi.com/market/get-quotes',
            params: {region: 'US', symbols: symbol},
            headers: {
                'x-rapidapi-key': '624dc7754bmsh3f19b0e1fbd4882p18e7f1jsn0d9d641d8df8',
                'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
            }};
            axios.request(options).then(function (response) {
                const returnedStocks = response.data.quoteResponse.result
                console.log(returnedStocks)
                // return array name+price of each stock
                returnedStocks.forEach( stock => {
                    const newStock = { name: stock.shortName, price: stock.regularMarketPrice, change: stock.regularMarketChange, symbol: stock.symbol, prevClose: stock.regularMarketPreviousClose}
                    searchedStock.push(newStock)
                    console.log('from get single stock: ', newStock.name)
                });
                ref.searchedStock = searchedStock
            }).catch(function (error) {
                console.error(error)
            });
        }
    },
}
</script>

<style scoped>
.box {
    display: flex;
    flex-direction: column;
}
.btn-row {
    margin:25px auto;
}
h2 {
    display: flex;
    padding: 20px;
    margin:45px auto;
    justify-content: center;
}
.tags {
    display: flex;
    justify-content: center;
    text-align: left;
}
.tag {
    font-weight: bold;
    font-size: 12px;
    width:100px;
}
.name {
    width:200px !important;
}
.tags {
    margin-top:50px;
}

* {
    color: rgb(19, 23, 48);
}
.empty {
    visibility: hidden;
}
.searchField {
    display: inline-flex;
    justify-content: center;
    margin:auto;
}
input {
    width:200px;
}
</style>