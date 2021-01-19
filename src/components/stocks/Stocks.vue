<template>
    <div class="box">
        
        <app-nav></app-nav>

        <div class="btn-row">
            <button :class="{active: type=='Trending'}"  @click="getTrending">Trending</button>
            <button :class="{active: type=='Top Gainers'}" @click="getTopGainers">Top Gainers</button>
            <button :class="{active: type=='S&P 500'}" @click="get500Stocks">S&P 500</button>
            <button :class="{active: type=='Favourites'}" @click="getFavourites">Favourites</button>
            <!-- <button @click="getPortfolios">Portfolios</button> -->
        </div>

         <!-- SEARCH-FIELD -->
        <div class="searchfield">
            <input type="text"  v-model="searchTerm" autofocus placeholder="Any stock..">
            <button class="search" @click="getSymbol" >Search</button>
        </div>

        <p v-if="stocks != '' " class="blurred-info">You can sort by category</p>
        <!-- TAGS -->
        <div class="tags" v-if="stocks != '' ">
                <div class="tag name" @click="sortByLetter">Name</div>
                <div class="tag" @click="sortByChange">Change</div>
                <div class="tag" @click="sortByPrice">Market Price</div>
                <div class="tag" @click="sortByClose">Prev. Close</div>
                <div class="tag">Symbol</div>
                <div class="empty"><button >View</button></div>
        </div>

        <!-- STOCKS -->
        <div class="stock-container">
            <!-- <transition-group name="slide" mode="in-out"> -->
                <app-stock v-for="(stock, index) in stocks" :stock="stock" :key="index"></app-stock>
            <!-- </transition-group> -->
        </div>

    </div>
</template>



<script scoped>
import Stock from './Stock.vue'
import axios from 'axios'
import firebase from 'firebase'
import Sidenav from '../Sidenav'

export default {
    data () {
        return {
            searchTerm: '',
            type: 'Trending',
            sortedByChange: false,
            sortedByPrice: false,
            sortedByClose: false,
            sortedByLetter: false,
        }
    },
    components: {
        appStock: Stock,
        appNav: Sidenav,
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
        },
        getFavourites () {
            //* get portfolio
            this.type = 'Favourites'
            var favStocks = []
            const user = firebase.auth().currentUser.uid
            var value = 0
            axios.get(`https://ove-stock-trader.firebaseio.com/users/${user}/favourites.json`).then(response => {
                console.log(response.data)
                const ref = this
                const resp = response.data
                for (let key in resp){
                    favStocks.push(resp[key])
                }
                console.log('logging stocks from favourites', favStocks)
                ref.$store.dispatch('setFavourites', favStocks)
                })
        },
    },
    created () {
        this.$store.dispatch('getTrendingStocks')
    }
}

</script>

<style scoped>
* {
    /* border:1px solid black; */
}
.blurred-info {
    color:grey;
    font-size: 10px;
    text-align: center;
    margin-bottom:-30px;
    margin-top:50px;
}
.active {
    background: #0b2847 !important;
    color:white;
    text-decoration: underline;
    border:1px solid rgb(5, 36, 122) !important;
}
.active:hover {
    color:white !important;
}
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
    margin-top:50px;
    display:flex;
    justify-content:stretch;
}
.btn-row button {
    font-size: 0.75rem;
    padding:12px 0;
    border:none;
    border-bottom:1px solid black;
    cursor: pointer;
    background:rgb(235, 237, 238);
    width:110px;
}
.btn-row button:hover {
    color:rgb(4, 38, 90);
    border-bottom:1px solid rgb(2, 27, 65);
    background:rgb(211, 215, 218);
}
::placeholder {
    color:rgb(177, 185, 194);
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
    cursor:pointer;
    text-align: left;
    max-width:750px;
    vertical-align: bottom;
    height:fit-content;
    margin:auto;
}
.tag {
    display: flex;
    text-align: left;
    width:100px;
    margin-top:55px;
    height:fit-content;
    font-size:0.75rem;
}
.tag:hover {
    color:rgb(12, 35, 126);
    text-decoration: underline;
}
.name {
    width:175px !important;
}
.searchfield {
    display:flex;
    justify-content: center;
    margin:25px auto;
}
.search {
    background-color: #1f2c3a;
    border:none;
    color:white;
    font-size: 0.7rem;
    cursor:pointer;
    padding:0.7rem 1rem;
    border-radius: 5px;
}
input {
    width:200px;
    border:none;
    border-bottom: 1px solid  #1f2c3a;
    margin-right:7px;
    padding:0 5px;
}
* {
    color: rgb(19, 23, 48);
}
.empty {
    visibility: hidden;
}


/* SLIDES */
.slide-enter-active {
  animation: slide-in 250ms ease-out forwards;
}
 .slide-leave-active {
    animation: slide-out 0ms ease-out forwards;
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
      transform: translateY(0);
      opacity: 0;
    }
  } 
</style>