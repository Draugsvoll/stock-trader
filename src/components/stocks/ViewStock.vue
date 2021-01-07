<template>
    <div class="container">

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

        <div class="headline">
            <h2> {{ stock.quoteType.longName }} </h2>
            <div>
                <p class="price"> ${{ stock.price.regularMarketPrice.raw.toFixed(2) }} </p>
                <input type="number" v-model.number="quantity">
                <button class="buy" @click="buyDialogue" >Buy</button>
                <button class="sell" @click="sellStock2" >Sell</button>
                <p class="smallName">You have {{ this.oldQuantity }} stocks. </p>
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



<script>
import axios from 'axios'
import database from '../../firebase'
import firebase from 'firebase'

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
            currentStock: {},
        }
    },
    computed: {
        validQuantity: function(){
            return false
        },
        buyPrice () {
            return this.stock.price.regularMarketPrice.raw*this.quantity
        },
    },
    methods: {
        hideBuyModal () {
            this.showBuyModal = false
        },
        buyDialogue () {
            this.showBuyModal = true
        },
        buyStock() {
            const ref = this
            var updatedFunds = 0
            const user = firebase.auth().currentUser.uid
            //* check funds
            axios.get(`https://ove-stock-trader.firebaseio.com/users/${user}/funds.json`)
                    .then(function (response) {
                        console.log('checking funds: ',response.data)
                        const funds = response.data
                        const price = ref.buyPrice
                        if (funds > price) {
                            updatedFunds = funds - price
                            console.log('you can afford, new funds are: ', updatedFunds)
                            firebase.database().ref(`users/${user}/funds/`).set(updatedFunds);
                        }
                    })
            this.showBuyModal = true
            //* dont have stock in portfolio
            console.log('logging current stock: ', this.currentStock)
            if (this.currentStock.name == undefined) {
                if (this.quantity % 1 == 0) {
                    const order = {
                        name: this.stock.quoteType.longName,
                        price: this.stock.price.regularMarketPrice.raw,
                        quantity: this.quantity,
                        symbol: this.stock.symbol,
                        prevClose: this.stock.price.regularMarketPreviousClose.raw,
                        change: this.stock.price.regularMarketChange.raw
                    }
                    console.log(order)
                    console.log(user)
                    axios.post(`https://ove-stock-trader.firebaseio.com/users/${user}/portfolio/.json`, order)
                    .then(function (response) {
                        console.log(response);
                    })
                    this.quantity = 0
                }
            //* already have the stock
            } else {
            const newStockAmount = this.oldQuantity + this.quantity
                const order = {
                        name: this.stock.quoteType.longName,
                        price: this.stock.price.regularMarketPrice.raw,
                        quantity: this.quantity,
                        symbol: this.stock.symbol,
                        prevClose: this.stock.price.regularMarketPreviousClose.raw,
                        change: this.stock.price.regularMarketChange.raw
                    }
                Object.assign(order, {quantity: newStockAmount})
                firebase.database().ref(`users/${user}/portfolio/` + this.key).set(order);
                console.log('hadde fra før')
            }
        },
        sellStock2 () {
            const user = firebase.auth().currentUser.uid
            const newStockAmount = this.oldQuantity - this.quantity
            //* invalid amount
            if ( newStockAmount < 0 || newStockAmount%1 != 0) {
                console.log('invalid amount')
            }
            else {
                var updatedFunds
                const ref = this
                 axios.get(`https://ove-stock-trader.firebaseio.com/users/${user}/funds.json`).then(resp => {
                    const funds = resp.data
                    updatedFunds = funds + this.buyPrice
                    console.log('old funds: '. funds)
                    console.log('updated funds: '. updatedFunds)
                    Object.assign(this.currentStock, {quantity: newStockAmount})
                    if ( newStockAmount < 1) {
                        var dbRef = firebase.database().ref(`users/${user}/portfolio/${ref.key}`);
                        dbRef.remove()
                        .then(function() {
                            console.log("Remove succeeded.")
                        })
                        .catch(function(error) {
                            console.log("Remove failed: " + error.message)
                        });
                    } else {
                        firebase.database().ref(`users/${user}/portfolio/` + this.key).set(this.currentStock);
                    }
                    firebase.database().ref(`users/${user}/funds/`).set(updatedFunds);
                })
                
            }
        },
    },
    created () {
        console.log(this.stock)
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
                console.log(response.data);
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
                      console.log('fins i portfolio', stock.key)
                      ref.key = stock.key
                      ref.oldQuantity = parseInt(stock.quantity)
                      ref.currentStock = stock
                      console.log('quantity: ', stock.quantity)
                  }
              })
            })
    }// created
}
</script>

<style scoped>
* {
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
.smallName {
    font-size: 0.7rem;
}
.modal {
    background:white;
    width:400px;
    height:150px;
    border:1px solid rgb(124, 153, 177);
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
    margin-top: 25px;
    border:1px solid rgb(206, 207, 207);
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
    background:rgb(5, 62, 128);
    color:white;
    font-size:0.75rem;
    cursor:pointer;
    font-weight: 350;
}
button:hover {
    background:rgb(14, 77, 148);
}
.line {
    margin:2px;
    font-size: 0.55rem;
}
</style>