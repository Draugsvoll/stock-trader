<template>
    <div class="container1">

        <!-- INTRO -->
        <div class="intro">
            <h2 class="headline stockname">{{ stock.quoteType.longName }}</h2>
            <h2 class="headline"> {{ stock.price.regularMarketPrice.raw | currency }} 
                <span class="price price-change" :class="{green: stock.price.regularMarketChange.raw > 0, red: stock.price.regularMarketChange.raw < 0 }"> 
                    <span v-if="stock.price.regularMarketChange.raw > 0" class="green up">+</span> 
                        {{ stock.price.regularMarketChangePercent.fmt }} Today 
                </span> 
            </h2>
            <span class="icon-container"> <i @click="add" class="fas fa-star" :class="{added: favourite }"></i>
                <span v-if="favourite" class="add-to-favourite"> In Favourites</span>
                <span v-if="!favourite" class="add-to-favourite"> Not in favourites</span>
            </span >
        </div>

        <!-- STATISTICS -->
        <div class="numbers">
            <div class="number" 
                id="number-first" ><div class="tag">Daily Volume</div> <span class="tag-price">${{ stock.price.averageDailyVolume10Day.longFmt }} </span>  </div>
            <div class="number" ><div class="tag">Market Cap</div> <span class="tag-price">${{ stock.price.marketCap.fmt }}  </span> </div>
            <div class="number" ><div class="tag">50 Day AVG</div> <span class="tag-price">${{ stock.summaryDetail.fiftyDayAverage.fmt }} </span>  </div>
            <div class="number" ><div class="tag">52 Week High</div> <span class="tag-price"> ${{ stock.summaryDetail.fiftyTwoWeekHigh.fmt }}</span>  </div>
            <div class="number" ><div class="tag">Volume</div> <span class="tag-price"> ${{ stock.summaryDetail.volume.fmt }}</span>  </div>
        </div>

        <!-- BUY-SELL CONTAINER -->
        <div class="buy-sell-container">
            <!-- BUY-BOX -->
            <div class="buy">
                <div>
                    <p class="action-label"><span class="green">Buy </span> {{stock.symbol}} </p> 
                    <p class="funds">Available Funds: <span class="green ">{{funds | currency}} </span>  </p>
                </div>
                <p class="price2">Price: {{ stock.price.regularMarketPrice.raw | currency }}</p>
                <div class="input-container">
                    <span>Amount</span>
                    <input class="input" type="number" v-model="toBuy" placeholder="" value="1" min="1">
                </div>
                <div class="input-container total-price">
                    <span>Total Price $</span>
                    <input type="number" placeholder="Total Price" :value="toBuyTotalPrice" min="1" style="pointer-events: none">
                </div>
                <button @click="buyDialogue" class="buy-btn">Buy</button>
            </div>
            <!-- SELL-BOX -->
            <div class="sell">
                <div>
                    <p class="action-label"><span class="red">Sell </span> {{ stock.symbol}} </p> 
                    <p class="funds">You have {{oldQuantity}} {{ stock.symbol}} stocks  </p>
                </div>
                <p class="price2">Price: {{ stock.price.regularMarketPrice.raw | currency  }}</p>
                <div class="input-container">
                    <span>Amount</span>
                    <input class="input" v-model="toSell" type="number" placeholder="" value="1" min="1" :max="oldQuantity">
                </div>
                <div class="input-container total-price">
                    <span>Profit $</span>
                    <input type="number" :value="toSellTotalPrice" min="0" style="pointer-events: none">
                </div>
                <button  @click="sellDialogue" class="sell-btn">Sell</button>
            </div>
        </div>

    <!-- STOCK SUMMARY -->
    <div class="summary-card">
        <h2 class="header">About {{stock.quoteType.longName}} </h2>
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

    </div>




    <!-- BUY MODAL -->
    <div class="modal" v-if="showBuyModal">
        <div class="modal-content">
            <p class="buy-text">
                Buy {{ this.toBuy }} stocks of {{ stock.quoteType.longName }}? <br> <br>
            </p>
            Total price: {{ buyPrice | currency }}
        </div>
        <div class="button-row">
            <button class="modal-button btn-buy" @click="buyStock">Yes</button>
            <button class="modal-button btn-cancel" @click="hideBuyModal">Cancel</button>
        </div>
    </div>

    <!-- SELL MODAL  -->
    <div class="modal" v-if="showSellModal">
            <div class="modal-content">
            <p class="buy-text">
                Sell {{ this.toSell }} stocks of {{ stock.quoteType.longName }}? <br> <br>
            </p>
            Total price: {{ sellPrice | currency }}
        </div>
        <div class="button-row">
            <button class="modal-button btn-buy" @click="sellStock2">Yes</button>
            <button class="modal-button btn-cancel" @click="hideSellModal">Cancel</button>
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
            favKey:'',
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
        appNav: Sidenav
    },
    computed: {
        validQuantity: function(){
            return false
        },
        buyPrice () {
            return this.stock.price.regularMarketPrice.raw * this.toBuy
        },
        sellPrice () {
            return this.stock.price.regularMarketPrice.raw * this.toSell
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
            this.toBuy = parseInt(this.toBuy)
            //* check if valid quantity
            if ( this.toBuy % 1 != 0 || this.toBuy < 1) {
                alert ('Invalid amount of stocks')
            }
            else {
            //* check funds
            const ref = this
            var updatedFunds = 0
            const user = firebase.auth().currentUser.uid
            console.log('quantity: ', this.toBuy, typeof this.toBuy)
            axios.get(`https://ove-stock-trader.firebaseio.com/users/${user}/funds.json`)
                    .then(function (response) {
                        const funds = response.data
                        const price = ref.stock.price.regularMarketPrice.raw * ref.toBuy
                        if (funds > price) {
                            updatedFunds = funds - price
                            firebase.database().ref(`users/${user}/funds/`).set(updatedFunds);
                            //* show buy dialogue
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
            if ( this.toSell % 1 != 0 || this.toSell < 1 || this.toSell > this.oldQuantity ) {
                alert ('Invalid amount of stocks')
            }
            else {
                this.showSellModal = true
            }
        },
        add () {
            const user = firebase.auth().currentUser.uid
            const ref = this

            //* remove if favourite
            if ( this.favourite ) {
                ref.favKey = ''
                // * get stock.key so we can remove it
                axios.get(`https://ove-stock-trader.firebaseio.com/users/${user}/favourites.json`).then(resp => {
                    console.log('DATABASE: ', resp.data)
                    resp = resp.data
                    const favouriteStocks = []
                    for (let key in resp){
                        Object.assign(resp[key], {key: key})
                        favouriteStocks.push(resp[key])
                    }
                    ref.favouriteStocks = favouriteStocks
                    favouriteStocks.forEach( stock => {
                        if ( stock.symbol == this.symbol ) {
                            ref.favKey = stock.key
                        }
                    })
                })
                setTimeout(() => {
                    console.log('trying to remove, key is: ', ref.favKey)
                    //* empty key deletes every child
                    if (this.favKey.length > 3 ) {
                        var dbRef = firebase.database().ref(`users/${user}/favourites/${ref.favKey}`);
                        dbRef.remove()
                        this.favourite = false
                        this.notice = 'Removed from Favourites'
                        setTimeout(() => {  this.notice = null }, 2500);
                    }
                }, 500)

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
                        quantity: this.toBuy,
                        symbol: this.stock.symbol,
                        prevClose: this.stock.price.regularMarketPreviousClose.raw,
                        change: this.stock.price.regularMarketChange.raw,
            }
            if (this.currentStock.name == undefined) {
                if (this.toBuy % 1 == 0) {
                    axios.post(`https://ove-stock-trader.firebaseio.com/users/${user}/portfolio/.json`, order)
                    .then(function (response) {
                    })
                }
            } 
            //* already have the stock
            else {
                const newStockAmount = this.oldQuantity + this.toBuy
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
            this.toSell = parseInt(this.toSell)
            const user = firebase.auth().currentUser.uid
            const newStockAmount = this.oldQuantity - this.toSell
            //* invalid amount
            if ( newStockAmount < 0 || newStockAmount%1 != 0 || this.toSell < 1) {
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
                Object.assign(order, {quantity: this.toSell})
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
                      ref.favKey = stock.key
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
.intro {
    display: flex;
    flex-direction: column;
    margin:50px auto;
    margin-bottom:15px;
    margin-left:0;
    width: fit-content;
}
.headline {
    letter-spacing: 1px;
    font-size: 28px;
}
.stockname {
    font-size: 30px;
}
.up {
    margin-right:-5px;
    font-weight: 200 !important;
}
.icon-container {
    margin-top:5px;
    font-size:20px;
}
i {
    color:grey;
}
i:hover {
    color:rgb(165, 165, 165);

}
.add-to-favourite {
    font-size: 12px;
    color:rgba(128, 128, 128, 0.809);
}
.buy-sell-container {
    display: flex;
    width:900px;
    justify-content: space-between;
    margin-top:10px;
    margin-bottom:10px;
    border-radius:3px;
}
.buy, .sell {
    display: flex;
    flex-direction: column;
    width:49%;
    border-radius: var(--border-radius);
}
.buy > div, .sell > div {
    display:flex;
}
.funds {
    width:60%;
    text-align: right;
    font-size: 15px;
}
.action-label {
    width:50%;
}
.buy-btn {
    background:var(--green);
    margin-top:20px;
}
.sell-btn {
    background:var(--red);
    margin-top:20px;
}
button {
    margin:5px 0;
}
.green {
    color:var(--green) !important;
}
.red {
    color:var(--red) !important;
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
    margin-right:-2px;
    opacity: 0.35;
    height:50px;
    padding-bottom:7px;
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
    margin:0px auto;
}

.number {
    font-size: 1rem;
    width: 140px;
    border-top: 2px solid var(--background-grey);
    border-bottom: 2px solid var(--background-grey);
    margin: 15px 0px;
    padding:8px 5px;
}
.info {
    width:600px;
}




.input-container {
    position:relative;
}
.input {
    transition: 0.25s;
    background:rgba(0, 0, 0, 0.2);
    border-top-left-radius: var(--border-radius);
    height:45px;
    margin-top:10px;
}
.input:focus {
    border-bottom:1px solid rgb(226, 236, 236);
}
.input-container span {
    position:absolute;
    bottom:10px;
    color:grey;
    margin-left:7px;
}
h2 {
    margin:0;
    padding:0;
    font-weight: 500;
}

.added {
    color:var(--primary-color) !important;
    /* color:var(--red) !important; */
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
    color:red;
    /* color:var(--primary-color); */
    display:inline-block;
    margin:8px;
    padding:0;
}
.notice:hover {
     color:rgb(55, 57, 179) !important;
    background:none !important;
}
.smallName {
    font-size: 1rem;
    text-align: right;
    color:var(--primary-color);
    margin-bottom:0px;
    margin-right:110px;
}
.modal {
    position:absolute;
    top:0;
    bottom:0;
    left: 0; 
    right: 0; 
    margin:auto;
    width: fit-content;
    height:fit-content;

    padding:45px 65px;
    display: flex;
    flex-direction: column;
    background: var(--background-grey);
    border-left:2px solid var(--primary-color);
    border-radius: var(--border-radius);
}
.modal-content {
    margin:25px auto;
    text-align: center;
    font-size:18px;
}
.buy-text {
    text-align: center;
    font-size: 22px;
    margin-top:0;
}
.modal-button {
    display:inline-block;
    margin:0 10px;
    background-color: var(--primary-color);
    border:none;
    font-size: 0.85rem;
    padding:0.6rem 1.2rem;
    border-radius: 4px;
    color:white;
    cursor:pointer;
    transition: 0.2s;
    width:115px;
    border:2px solid rgba(0,0,0,0);
}

.btn-cancel {
    background:rgba(0,0,0,0);
    border:2px solid var(--red);
    border-radius: 4px;
    }
.btn-cancel:hover {
    background:var(--red);
    border-radius: 4px;
}
.button-row {
    margin:10px auto;
}
.header {
    font-size:25px;
    font-weight: 100;
    color:var(--primary-color);
}
.summary-card {
    margin:30px auto;
    background:var(--background-light);
    padding:25px 35px;
    border-radius: var(--border-radius);
    border-left:1px solid var(--primary-color);
}
.summary {
    margin:30px auto;
    font-size:14px;
    font-weight: 100;
    text-align: justify;
    letter-spacing: 1px;
   
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
    text-align: left;
    margin:0;
    margin-top:5px;
    margin-bottom:10px;
    margin-left:28px;
    font-weight: 400;
    font-size: 28px;
}
.price-change {
    text-align: left;
    font-size: 19px;
    margin:0;
    font-weight: 400;
}
.price2 {
    display:inline;
    margin: auto auto;
    font-size: 17px;
    margin-left:0;
    font-weight: 400;
    vertical-align: middle;
}
.buy, .sell {
    margin:15px 2px;
    padding:10px 15px;
    width:44%;
    border:2px solid var(--background-grey);
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
    color:rgb(186, 186, 186);
}

</style>