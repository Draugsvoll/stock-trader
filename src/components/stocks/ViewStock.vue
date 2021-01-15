<template>
    <div class="container">

        <app-nav></app-nav>

        <!-- BUY MODAL -->
        <div class="modal" v-if="showBuyModal">
                <div class="modal-content">
                    Buy {{ this.quantity }} stocks of {{ stock.quoteType.longName }}? <br> <br>
                    Total price: {{ buyPrice.toFixed(2) }}$
                </div>
                <div class="button-row">
                    <button class="modal-button" @click="buyStock">Yes</button>
                    <button class="modal-button" @click="hideBuyModal">Cancel</button>
                </div>
        </div>

        <!-- SELL MODAL  -->
        <div class="modal" v-if="showSellModal">
                <div class="modal-content">
                    Sell {{ this.quantity }} stocks of {{ stock.quoteType.longName }}? <br> <br>
                    Total price: {{ buyPrice.toFixed(2) }}$
                </div>
                <div class="button-row">
                    <button class="modal-button" @click="sellStock2">Yes</button>
                    <button class="modal-button" @click="hideSellModal">Cancel</button>
                </div>
        </div>

        <!-- VIEW STOCK -->
        <div class="headline">
            <h2> {{ stock.quoteType.longName }} </h2>
            <div>
                <p class="price"> ${{ stock.price.regularMarketPrice.raw.toFixed(2) }} </p>
                <input type="number" v-model.number="quantity">
                <button class="buy" @click="buyDialogue" >Buy</button>
                <button class="sell" @click="sellDialogue" >Sell</button>
                <i @click="add" class="fas fa-heart icon" :class="{added: favourite }"></i>
                <button class="notice" v-if="notice != null"> {{ notice }} </button>
                <p class="smallName">You have {{ this.oldQuantity }} stocks. </p>
                <p v-if="trade" class="trade">Trade Succesful !</p>
            </div>
        </div>

        <div class="tags">
            <div class="tag">Daily Volume</div>
            <div class="tag">Market Cap</div>
            <div class="tag">50 Day AVG</div>
            <div class="tag">52 Week High</div>
            <div class="tag">Volume</div>
        </div>

        <div class="numbers">
            <div class="number" > {{ stock.price.averageDailyVolume10Day.longFmt }} </div>
            <div class="number" > {{ stock.price.marketCap.fmt }} </div>
            <div class="number" > ${{ stock.summaryDetail.fiftyDayAverage.fmt }} </div>
            <div class="number" > ${{ stock.summaryDetail.fiftyTwoWeekHigh.fmt }} </div>
            <div class="number" > {{ stock.summaryDetail.volume.fmt }} </div>
        </div>
        
        <!-- INFO -->
        <div class="info">
            <div class="summary"> {{ stock.assetProfile.longBusinessSummary }}</div>
            <div> <p class="line">{{ stock.assetProfile.country }}, {{ stock.assetProfile.city }} </p> </div>
            <div> <p class="line">{{ stock.assetProfile.address1 }} </p> </div>
            <div> <p class="line">{{ stock.assetProfile.industry }} </p> </div>
            <div> <p class="line">Employees: {{ stock.assetProfile.fullTimeEmployees }} </p>  </div>
            <div> <p class="line">{{ stock.assetProfile.website }}  </p> </div>
            <div> <p class="line"> {{ stock.assetProfile.adress1 }}</p>  </div>
            <div> <p class="line"> Phone: {{ stock.assetProfile.phone }}</p>  </div>
        </div>
        
    </div>
</template>



<script scoped>
import axios from 'axios'
import database from '../../firebase'
import firebase from 'firebase'

import Sidenav from '../Sidenav'

export default {
    data () {
        return {
            symbol: this.$route.query.symbol,
            stock: '',
            portfolioStocks: [],
            quantity: 1,
            oldQuantity: 0,
            key: '',
            showBuyModal: false,
            showSellModal: false,
            currentStock: {},
            favourite: false,
            notice: null,
            trade: null,
        }
    },
    components: {
        appNav: Sidenav
    },
    computed: {
        validQuantity: function(){
            return false
        },
        buyPrice () {
            return this.stock.price.regularMarketPrice.raw * this.quantity
        },
    },
    methods: {
        hideBuyModal () {
            this.showBuyModal = false
        },
        hideSellModal () {
            this.showSellModal = false
        },
        buyDialogue () {
            //* check if valid quantity
            if ( this.quantity % 1 != 0 || this.quantity < 1) {
                alert ('Invalid amount of stocks')
            }
            else {
            //* check funds
            const ref = this
            var updatedFunds = 0
            const user = firebase.auth().currentUser.uid
            axios.get(`https://ove-stock-trader.firebaseio.com/users/${user}/funds.json`)
                    .then(function (response) {
                        const funds = response.data
                        const price = ref.stock.price.regularMarketPrice.raw * ref.quantity
                        if (funds > price) {
                            updatedFunds = funds - price
                            firebase.database().ref(`users/${user}/funds/`).set(updatedFunds);
                            ref.showBuyModal = true
                        } 
                        else {
                            alert('Not enough funds')
                        }
                    })
            }
        },
        sellDialogue () {
            //* check if valid quantity
            if ( this.quantity % 1 != 0 || this.quantity < 1 || this.quantity > this.oldQuantity ) {
                alert ('Invalid amount of stocks')
            }
            else {
                this.showSellModal = true
            }
        },
        add () {
            const user = firebase.auth().currentUser.uid
            const ref = this
            //* remove favourite
            if ( this.favourite ) {
                var dbRef = firebase.database().ref(`users/${user}/favourites/${ref.key}`);
                dbRef.remove()
                this.favourite = false
                this.notice = 'Removed from Favourites'
                setTimeout(() => {  this.notice = null }, 2500);
            } 
            //* add favourite
            else {
                    const favourite = {
                        name: this.stock.quoteType.longName,
                        price: this.stock.price.regularMarketPrice.raw,
                        symbol: this.stock.symbol,
                        prevClose: this.stock.price.regularMarketPreviousClose.raw,
                        change: this.stock.price.regularMarketChange.raw,
                    }
                axios.post(`https://ove-stock-trader.firebaseio.com/users/${user}/favourites/.json`, favourite)
                    .then(function (response) {
                    })
                    this.favourite = true
                    this.notice = 'Added to Favourites'
                    setTimeout(() => {  this.notice = null }, 2500);
            }
        },
        buyStock() {
            const ref = this
            var updatedFunds = 0
            const user = firebase.auth().currentUser.uid
            //* dont have stock in portfolio
            const order = {
                        name: this.stock.quoteType.longName,
                        price: this.stock.price.regularMarketPrice.raw,
                        quantity: this.quantity,
                        symbol: this.stock.symbol,
                        prevClose: this.stock.price.regularMarketPreviousClose.raw,
                        change: this.stock.price.regularMarketChange.raw,
                    }
            if (this.currentStock.name == undefined) {
                if (this.quantity % 1 == 0) {
                    axios.post(`https://ove-stock-trader.firebaseio.com/users/${user}/portfolio/.json`, order)
                    .then(function (response) {
                    })
                }
            } 
            //* already have the stock
            else {
                const newStockAmount = this.oldQuantity + this.quantity
                Object.assign(order, {quantity: newStockAmount})
                firebase.database().ref(`users/${user}/portfolio/` + this.key).set(order);
            }
            //* add to history
            const date = new Date()
            Object.assign(order, {timestamp: date})
            axios.post(`https://ove-stock-trader.firebaseio.com/users/${user}/history/.json`, order)
                    .then(function (response) {
                    })
            this.hideBuyModal()
            this.trade = true
            setTimeout(() => {  this.trade = false }, 2500);
        },
        sellStock2 () {
            const user = firebase.auth().currentUser.uid
            const newStockAmount = this.oldQuantity - this.quantity
            //* invalid amount
            if ( newStockAmount < 0 || newStockAmount%1 != 0 || this.quantity < 1) {
                alert('Invalid Amount')
            }
            else {
                var updatedFunds
                const ref = this
                 axios.get(`https://ove-stock-trader.firebaseio.com/users/${user}/funds.json`).then(resp => {
                    const funds = resp.data
                    updatedFunds = funds + this.buyPrice
                    Object.assign(this.currentStock, {quantity: newStockAmount})
                    if ( newStockAmount < 1) {
                        var dbRef = firebase.database().ref(`users/${user}/portfolio/${ref.key}`);
                        dbRef.remove()
                        .then(function() {
                        })
                        .catch(function(error) {
                            console.log("Remove failed: " + error.message)
                        });
                    } else {
                        firebase.database().ref(`users/${user}/portfolio/` + this.key).set(this.currentStock);
                    }
                    firebase.database().ref(`users/${user}/funds/`).set(updatedFunds);
                })
                //* add to history
                const date = new Date()
                const order = this.currentStock
                Object.assign(order, {timestamp: date})
                Object.assign(order, {quantity: this.quantity})
                axios.post(`https://ove-stock-trader.firebaseio.com/users/${user}/history/.json`, order)
                    .then(function (response) {
                    })
                this.trade = true
                setTimeout(() => {  this.trade = false }, 2500);
                this.hideSellModal()
            }
        },
    },
    created () {
            // * GET STOCK
            const ref = this;
            const options = {
            method: 'GET',
            url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-profile',
            params: {symbol: this.symbol, region: 'US'},
            headers: {
                'x-rapidapi-key': '624dc7754bmsh3f19b0e1fbd4882p18e7f1jsn0d9d641d8df8',
                'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
            }}
            axios.request(options).then(function (response) {
                const stock = response.data
                ref.stock = stock
            }).catch(function (error) {
                console.error(error);
            });

            //* Check if stock in portfolio
            const user = firebase.auth().currentUser.uid
            axios.get(`https://ove-stock-trader.firebaseio.com/users/${user}/portfolio.json`).then(resp => {
              resp = resp.data
              const portfolioStocks = []
              for (let key in resp){
                Object.assign(resp[key], {key: key})
                portfolioStocks.push(resp[key])
              }
              ref.portfolioStocks = portfolioStocks
              portfolioStocks.forEach( stock => {
                  if ( stock.symbol == this.symbol ) {
                      ref.key = stock.key
                      ref.oldQuantity = parseInt(stock.quantity)
                      ref.currentStock = stock
                  }
              })
            })

            //* check if in favourites
            axios.get(`https://ove-stock-trader.firebaseio.com/users/${user}/favourites.json`).then(resp => {
              resp = resp.data
              const favouriteStocks = []
              for (let key in resp){
                Object.assign(resp[key], {key: key})
                favouriteStocks.push(resp[key])
              }
              ref.favouriteStocks = favouriteStocks
              favouriteStocks.forEach( stock => {
                  if ( stock.symbol == this.symbol ) {
                      ref.favourite = true
                  }
              })
            })
    }// created
}
</script>

<style scoped>
* {
}
.trade {
    color:green;
}
input {
    width:75px;
    margin: auto 8px;
}
h2 {
    margin:0;
    padding:0;
    font-weight: 500;
}
.added {
    color:rgb(55, 57, 179) !important;
}
.icon {
    cursor:pointer;
    color:rgb(214, 208, 208);
    margin:5px;
}
.icon:hover {
        color:rgb(156, 183, 196);
}
.notice {
    background:rgba(0,0,0,0);
    border:none;
    color:rgb(55, 57, 179);
}
.notice:hover {
     color:rgb(55, 57, 179) !important;
    background:none !important;
}
.smallName {
    font-size: 0.7rem;
}
.modal {
    background:white;
    width:400px;
    height:150px;
    border:1px solid #1f2c3a;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    position: absolute;
}
.modal-content {
    margin:25px auto;
}
.modal-button {
    margin-right:10px;
    padding:0.45rem 0.55rem;
}
.button-row {
    margin:10px auto;
}
.headline {
    display: flex;
    flex-direction: column;
}
.summary {
    max-width:500px;
    margin-bottom:25px;
    margin-top:20px;
    font-size:0.7rem;
    font-family: Arial, Helvetica, sans-serif;
}
.info {
    margin:25px auto;
    max-width: 500px;
    font-size: 0.7rem;
}
.container {
    max-width:500px;
    margin:auto;
    margin-top: 55px;
    border:1px solid #1f2c3a;
    border-radius:3px;
    padding:18px;
    box-shadow: rgba(162, 162, 168, 0.2) 0px 7px 29px 0px;

}
.numbers {
    display: flex;
    max-width:500px;
}
.tags {
    margin-top:10px;
    display:flex;
    flex-wrap: wrap;
}
.tag {
    font-weight: bold;
    font-size: 0.71rem;
    width:100px;
}
.number {
    font-size: 0.75rem;
    width:200px;
}
.price {
    display:inline;
    margin: auto auto;
    font-size: 1.5rem;
    margin-left:0;
    font-weight: 400;
    vertical-align: middle;
}
.buy, .sell {
    margin:10px 2px;
    padding:6px 15px;
}
button {
    border-radius:5px;
    color:rgb(6, 6, 104);
    border:1px solid rgb(4, 4, 110);
    background:#2a4057;
    color:white;
    font-size:0.75rem;
    cursor:pointer;
    font-weight: 350;
}
button:hover {
}
.line {
    margin:2px;
    font-size: 0.55rem;
}
</style>