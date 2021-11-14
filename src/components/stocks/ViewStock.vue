<template>
    <div class="container1">

        <!-- VIEW STOCK -->
        <div class="intro">
            <h2 class="headline"> {{ stock.quoteType.longName }}
                    <span> <i @click="add" class="fas fa-heart icon" :class="{added: favourite }"></i></span> </h2> 
                    <div> <button class="notice" > testing{{ notice }} </button></div>
        </div>
            <div>
                <p class="price"> ${{ stock.price.regularMarketPrice.raw.toFixed(2) }} </p>
                <!-- <p class="smallName">You have {{ this.oldQuantity }} {{stock.symbol}} Stocks. </p> -->
            </div>

        <!-- STOCK INFO -->
            <!-- STATISTICS -->
            <div class="numbers">
                <div class="number" 
                    id="number-first" ><div class="tag">Daily Volume</div> <span class="tag-price">${{ stock.price.averageDailyVolume10Day.longFmt }} </span>  </div>
                <div class="number" ><div class="tag">Market Cap</div> <span class="tag-price">${{ stock.price.marketCap.fmt }}  </span> </div>
                <div class="number" ><div class="tag">50 Day AVG</div> <span class="tag-price">${{ stock.summaryDetail.fiftyDayAverage.fmt }} </span>  </div>
                <div class="number" ><div class="tag">52 Week High</div> <span class="tag-price"> ${{ stock.summaryDetail.fiftyTwoWeekHigh.fmt }}</span>  </div>
                <div class="number" ><div class="tag">Volume</div> <span class="tag-price"> ${{ stock.summaryDetail.volume.fmt }}</span>  </div>
            </div>
            <!-- INFO -->


        <!-- BUY-SELL CONTAINER -->
        <div class="buy-sell-container">
            <!-- BUY-BOX -->
            <div class="buy">
                <div>
                    <p class="action-label"><span class="green">Buy </span>{{stock.symbol}} </p> 
                    <p class="funds">Available funds: <b class="green ">${{funds.toFixed(0)}} </b>  </p>
                </div>
                <p class="price2">Price ${{ stock.price.regularMarketPrice.raw.toFixed(2) }}</p>
                <div class="input-container">
                    <span>Amount</span>
                    <input type="number" v-model="toBuy" placeholder="" value="1" min="1">
                </div>
                <div class="input-container total-price">
                    <span>Total Price $</span>
                    <input type="number" placeholder="Total Price" :value="toBuyTotalPrice" min="1" style="pointer-events: none">
                </div>
                <button class="buy-btn">Buy</button>
            </div>
            <!-- SELL-BOX -->
            <div class="sell">
                <div>
                    <p class="action-label"><span class="red">Sell </span>{{ stock.symbol}} </p> 
                    <p class="funds">Stocks to sell: <b class="green"> {{oldQuantity}} </b>  </p>
                </div>
                <p class="price2">Price ${{ stock.price.regularMarketPrice.raw.toFixed(2) }}</p>
                <div class="input-container">
                    <span>Amount</span>
                    <input v-model="toSell" type="number" placeholder="" value="1" min="1" :max="oldQuantity">
                </div>
                <div class="input-container total-price">
                    <span>Profit $</span>
                    <input type="number" :value="toSellTotalPrice" min="0" style="pointer-events: none">
                </div>
                <button class="sell-btn">Sell</button>
            </div>
        </div>

    <!-- STOCK SUMMARY -->
    <h2>About {{stock.quoteType.longName}} </h2>
    <div class="summary"> {{ stock.assetProfile.longBusinessSummary }}</div>
    <div class="info">
        <div> <p class="line">{{ stock.assetProfile.country }}, {{ stock.assetProfile.city }} </p> </div>
        <div> <p class="line">{{ stock.assetProfile.address1 }} </p> </div>
        <div> <p class="line">{{ stock.assetProfile.industry }} </p> </div>
        <div> <p class="line">Employees: {{ stock.assetProfile.fullTimeEmployees }} </p>  </div>
        <div> <p class="line">{{ stock.assetProfile.website }}  </p> </div>
        <div> <p class="line"> {{ stock.assetProfile.adress1 }}</p>  </div>
        <div> <p class="line"> Phone: {{ stock.assetProfile.phone }}</p>  </div>
    </div>











        <!-- BUY MODAL -->
        <div class="modal" v-if="showBuyModal">
                
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

        <app-nav></app-nav>

        

        

        
        
       

        
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
            funds:0,
            toSell:1,
            toBuy:1,
        }
    },
    components: {
        // appNav: Sidenav
    },
    computed: {
        validQuantity: function(){
            return false
        },
        buyPrice () {
            return this.stock.price.regularMarketPrice.raw * this.quantity
        },
        toSellTotalPrice () {
            return (this.stock.price.regularMarketPrice.raw * this.toSell).toFixed(2)
        },
        toBuyTotalPrice () {
            return (this.stock.price.regularMarketPrice.raw * this.toBuy).toFixed(2)
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
                'x-rapidapi-host': 'yh-finance.p.rapidapi.com',
                'x-rapidapi-key': '1660860218msh9ed4fea2bd1c6bep1a1c59jsnfe88dd4d5712'
            }}
            axios.request(options).then(function (response) {
                const stock = response.data
                console.log(stock)
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
             //* check funds
             var ref2 = this
            axios.get(`https://ove-stock-trader.firebaseio.com/users/${user}/funds.json`)
                    .then(function (response) {
                        const funds = response.data
                        ref2.funds = funds
                    })
    }// created
}
</script>

<style css scoped>

.headline {
    font-size:18px;
}
.buy-sell-container {
    display: flex;
    width:900px;
    justify-content: space-between;
    border:2px solid var(--background-grey);
    border-radius:3px;
}
.buy, .sell {
    display: flex;
    flex-direction: column;
    width:49%;
}
.buy > div, .sell > div {
    display:flex;
}
.funds {
    width:50%;
    text-align: right;
}
.action-label {
    width:50%;
}
.buy-btn {
    background:var(--green);
}
.sell-btn {
    background:var(--red);
}
button {
    margin:5px 0;
}
.green {
    color:var(--green);
    font-weight: bold;
}
.red {
    color:var(--red);
    font-weight: bold;
}
b {
    margin:0;
}
input {
    font-size:17px;
    background:rgba(0,0,0,0);
    border:none;
    border-bottom:1px solid grey;
    width:100%;
    text-align:right;
    height:50px;
    margin:2px 0;
}
.total-price input {
    padding-right:20px;
}
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button {
    margin-left:20px;
    opacity: 1;
    height:50px;
}
.total-price input[type=number]::-webkit-inner-spin-button,
.total-price input[type=number]::-webkit-outer-spin-button {
    display:none;
}
.info-container{
    display: flex;
    justify-content: space-between;
    padding:25px;
    background:var(--background-light);
    border-radius:var(--border-radius);
}
.info-container > div{
}
.numbers {
    display:flex;
    justify-content: space-between;
}

.number {
    font-size: 1rem;
    width: 140px;
    border-top: 2px solid var(--background-grey);
    border-bottom: 2px solid var(--background-grey);
    margin: 15px 0px;
    padding: 5px;
}
.info {
    width:600px;
}




.input-container {
    position:relative;
}
.input-container span {
    position:absolute;
    bottom:10px;
    color:grey;
}
h2 {
    margin:0;
    padding:0;
    font-weight: 500;
}
.added {
    color:var(--red) !important;
}
.icon {
    cursor:pointer;
    color:grey;
    margin:5px;
    font-size:22px;
}
.icon:hover {
}
.notice {
    background:rgba(0,0,0,0);
    border:none;
    color:var(--primary-color);
    display:inline-block;
    margin:8px;
    padding:0;
}
.notice:hover {
     color:rgb(55, 57, 179) !important;
    background:none !important;
}
.smallName {
    font-size: 0.85rem;
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
.intro {
    display: flex;
    margin:20px auto;
    justify-content: center;
}
.summary {
    margin-bottom:25px;
    margin-top:20px;
    font-size:15px;
}

.container1 {
    margin:auto;
    margin-bottom: 90px;
    width:900px;
}

.tags {
    margin-top:10px;
    display:flex;
    flex-wrap: wrap;
}
.tag {
    font-size: 15px;
    width:100px;
    margin-bottom:8px;
}
.tag-price {
    font-weight: bold;
    font-size:18px;
}

.price {
    text-align: center;
    font-size: 28px;
    margin:0;
    font-weight: 400;
}
.price2 {
    display:inline;
    margin: auto auto;
    font-size: 18px;
    margin-left:0;
    font-weight: 400;
    vertical-align: middle;
}
.buy, .sell {
    margin:10px 2px;
    padding:6px 15px;
    width:44%;
}
button {
    border-radius:5px;
    border:none;
    background:var(--background-light);
    color:white;
    font-size:15px;
    cursor:pointer;
    font-weight: 350;
    padding:10px;
    margin:15px 0;
}
.sell-btn:hover {
    background:var(--red-hover);
}
.buy-btn:hover {
    background:var(--green-hover);
}
.line {
    margin:2px;
    font-size: 0.85rem;
}
</style>