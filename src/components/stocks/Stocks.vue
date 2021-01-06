<template>
    <div class="box">
        
        <div class="btn-row">
            <button @click="getTrending">Trending</button>
            <button @click="getTopGainers">Top Gainers</button>
            <button @click="get500Stocks">S&P 500</button>
            <button @click="getPortfolios">Portfolios</button>
        </div>

        <h2> {{ type }} </h2>

          <div class="searchfield">
            <input type="text"  v-model="searchTerm" autofocus placeholder="Tesla">
            <button class="search" @click="getSymbol" >Search</button>
        </div>

        <div class="tags" v-if="stocks != '' ">
                <div class="tag name" @click="sortByLetter">Name</div>
                <div class="tag" @click="sortByChange">Change</div>
                <div class="tag" @click="sortByPrice">Market Price</div>
                <div class="tag" @click="sortByClose">Prev. Close</div>
                <div class="tag">Symbol</div>
                <div class="empty"><button >View</button></div>
        </div>

        <div class="stock-container">
            <transition-group name="slide" mode="in-out">
                <app-stock v-for="(stock, index) in stocks" :stock="stock" :key="index"></app-stock>
            </transition-group>
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
            type: 'Top Gainers',
            sortedByChange: false,
            sortedByPrice: false,
            sortedByClose: false,
            sortedByLetter: false,
        }
    },
    components: {
        appStock: Stock,
    },
    computed: {    
        stocks() {
            return this.$store.getters.stocks
        },
    },
    methods: {
        sortByChange () {
            if ( this.sortedByChange == false ) {
                const sortedByChange = this.stocks.sort( (a, b) => {
                if ( a.change < b.change ) return 1
                return -1
                })
                this.stocks = sortedByChange
            } 
            else {
                const sortedByChange = this.stocks.sort( (a, b) => {
                if ( a.change > b.change ) return 1
                return -1
                })     
                this.stocks = sortedByChange
            }
            this.sortedByChange = !this.sortedByChange
        },
        sortByPrice () {
            if ( this.sortedByPrice == false ) {
                const sortedByPrice = this.stocks.sort( (a, b) => {
                if ( a.price < b.price ) return 1
                return -1
                })
                this.stocks = sortedByPrice
            } 
            else {
                const sortedByPrice = this.stocks.sort( (a, b) => {
                if ( a.price > b.price ) return 1
                return -1
                })     
                this.stocks = sortedByPrice
            }
            this.sortedByPrice = !this.sortedByPrice
        },
        sortByClose () {
            if ( this.sortedByClose == false ) {
                const sortedByClose = this.stocks.sort( (a, b) => {
                if ( a.prevClose < b.prevClose ) return 1
                return -1
                })
                this.stocks = sortedByClose
            } 
            else {
                const sortedByClose = this.stocks.sort( (a, b) => {
                if ( a.prevClose > b.prevClose ) return 1
                return -1
                })     
                this.stocks = sortedByClose
            }
            this.sortedByClose = !this.sortedByClose
        },
        sortByLetter () {
            if ( this.sortedByLetter == false ) {
                const sortedByLetter = this.stocks.sort( (a, b) => {
                if ( a.name.toLowerCase() < b.name.toLowerCase() ) return 1
                return -1
                })
                this.stocks = sortedByLetter
            } 
            else {
                const sortedByLetter = this.stocks.sort( (a, b) => {
                if ( a.name.toLowerCase() > b.name.toLowerCase() ) return 1
                return -1
                })     
                this.stocks = sortedByLetter
            }
            this.sortedByLetter = !this.sortedByLetter
        },
        get500Stocks () {
            this.type = 'S&P 500'
            this.$store.dispatch('get500Stocks')
        },
        getTrending () {
            this.type = 'Trending'
            this.$store.dispatch('getTrendingStocks')
        },
        getTopGainers () {
            this.type = 'Top Gainers'
            this.$store.dispatch('getTopGainersStocks')
        }
        ,
        getPortfolios () {
            this.$router.push('publicportfolios')
        },
        getSymbol () {
            this.type = 'Searching for: ' + this.searchTerm
            this.$store.dispatch('resetStocks')
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
                    // searchedStock.push(newStock)
                    ref.stocks.unshift(newStock)
                    console.log('from get single stock: ', newStock.name)
                });
                ref.searchedStock = searchedStock
            }).catch(function (error) {
                console.error(error)
            });
        }
    }
}

</script>

<style scoped>
.stock-container {
    margin:auto;
}
.box {
    display: flex;
    flex-direction: column;
    margin-bottom: 100px;
}
.btn-row {
    margin:25px auto;
    width: 300px;
    display:flex;
    justify-content:stretch;
}
.btn-row button {
    font-size: 0.8rem;
    padding:9px 8px;
    border:none;
    border-bottom:1px solid black;
    cursor: pointer;
}
.btn-row button:hover {
    background:pink;
}
h2 {
    display: flex;
    padding: 20px;
    margin:0px auto;
    margin-bottom:35px;
    justify-content: center;
}
.tags {
    display: flex;
    justify-content: center;
    text-align: left;
    max-width:630px;
    margin:auto;
    margin-top:55px;

}
.tag {
    font-weight: bold;
    font-size: 13px;
    width:100px;
    cursor:pointer;
}
.name {
    width:250px !important;
}
.searchfield {
    display:flex;
    margin:auto;
    justify-content: center;
    margin-top:100px;
}
input {
    width:200px;
}
* {
    color: rgb(19, 23, 48);
}
.empty {
    visibility: hidden;
}
.searchfield {
    margin:auto;
}


/* SLIDES */
.slide-enter-active {
  animation: slide-in 250ms ease-out forwards;
}
 .slide-leave-active {
    animation: slide-out 250ms ease-out forwards;
  } 
@keyframes slide-in {
  from {
    transform: translateY(100px);
    opacity: 0.2;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
 @keyframes slide-out {
    from {
      transform: translateY(0);
      opacity:1;
    }
    to {
      transform: translateY(100px);
      opacity: 0;
    }
  } 
</style>