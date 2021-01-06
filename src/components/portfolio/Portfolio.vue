<template>
    <div class="box">
        <h1 class="headline">My Stocks: </h1>
        <div class="tags" v-if="stocks != '' ">
                <div class="tag name" @click="sortByLetter">Name</div>
                <div class="tag" @click="sortByChange">Change</div>
                <div class="tag" @click="sortByPrice">Market Price</div>
                <div class="tag" @click="sortByClose">Prev. Close</div>
                <div class="tag">Symbol</div>
                <div class="empty"><button>View</button></div>
        </div>
        <div class="stock-container">
            <transition-group name="slide" mode="in-out">
                <app-stock v-for="(stock, index) in stocks" :stock="stock" :key="index"></app-stock>
            </transition-group>
        </div>
    </div>
</template>



<script>
import Stock from '../stocks/Stock'
import axios from 'axios'

export default {
    data () {
        return {
            stocks: [],
            sortedByChange: false,
            sortedByPrice: false,
            sortedByClose: false,
            sortedByLetter: false,
        }
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
    },
    created () {

        //* get portfolio
        axios.get(`https://ove-stock-trader.firebaseio.com/users/portfolio.json`).then(response => {
              console.log(response.data)
              const ref = this
              const resp = response.data
              const newStocks = []
              for (let key in resp){
                newStocks.push(resp[key])
              }
              this.stocks = newStocks
              console.log(newStocks)
              //* get updated prices
              this.stocks.forEach( stock => {
                var symbol = stock.symbol
                const options = {
                method: 'GET',
                url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/get-detail',
                params: {symbol: symbol, region: 'US'},
                headers: {
                    'x-rapidapi-key': '624dc7754bmsh3f19b0e1fbd4882p18e7f1jsn0d9d641d8df8',
                    'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
                }}
                axios.request(options).then(function (response) {
                    console.log(response.data.price.regularMarketPrice.raw);
                    stock.price = response.data.price.regularMarketPrice.raw
                }).catch(function (error) {
                    console.error(error);
                });
            })
            })

        //* update prices
        const ref = this
        
  },    
    components: {
        appStock: Stock
    }

}
</script>


<style  scoped>

*{
    color: rgb(19, 23, 48);

}
.headline {
    display:inline-flex;
    margin:auto;
    justify-content: center;
}
.box {
    display: flex;
    flex-direction: column;
    margin-bottom: 100px;
}
button {
}
.stock-container {
    margin:auto;
}
.empty{
visibility: collapse;
margin-bottom: -40px;
}
.name {
    width:250px !important;
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
</style>