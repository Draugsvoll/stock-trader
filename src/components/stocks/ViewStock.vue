<template>
    <div ref="topOfSite" class="container1">


        <div v-if="stock != '' " class="container2" style="display:flex">
            <!-- INTRO -->
            <div>
                <div class="intro">
                    <h2 class="headline stockname">{{ stock.quoteType.longName }}</h2>
                    <h2 class="headline stockprice"> {{ stock.price.regularMarketPrice.raw | currency }} 
                        <span class="price price-change" :class="{green: stock.price.regularMarketChange.raw > 0, red: stock.price.regularMarketChange.raw < 0 }"> 
                            <span v-if="stock.price.regularMarketChange.raw > 0" class="green up">+ </span> 
                               ({{ stock.price.regularMarketChangePercent.fmt }} Today) 
                        </span> 
                    </h2>
                    <span class="icon-container"> <i @click="add" class="fas fa-star" :class="{added: favourite }"></i>
                        <span v-if="favourite" class="add-to-favourite"> In Favourites</span>
                        <span v-if="!favourite" class="add-to-favourite"> Not in favourites</span>
                        <p class="data-error" v-if="!(stock.summaryDetail.forwardPE.raw)">Stock is lacking price-data.</p>
                        <p class="data-error" v-if="renderError"> Error rendering price graph.</p>
                    </span >
                </div>
            </div>
            <!-- STATISTICS -->
            <div class="numbers-container">
                <div class="numbers">
                    <div class="number" ><div class="tag">Market Cap</div> <span class="tag-price">${{ stock.price.marketCap.fmt }}  </span> </div>
                    <div class="number" ><div class="tag">PE/Ratio</div> <span v-if="stock.summaryDetail.forwardPE.raw" class="tag-price">{{ stock.summaryDetail.forwardPE.raw.toFixed(2) }}  </span>  </div>
                    <div class="number" ><div class="tag">Daily Volume</div> <span class="tag-price">${{ stock.price.averageDailyVolume10Day.longFmt }} </span>  </div>
                </div>
                <div class="numbers">
                    <div class="number" ><div class="tag">50 Day AVG</div> <span class="tag-price">${{ stock.summaryDetail.fiftyDayAverage.fmt }} </span>  </div>
                    <div class="number" ><div class="tag">52 Week High</div> <span class="tag-price"> ${{ stock.summaryDetail.fiftyTwoWeekHigh.fmt }}</span>  </div>
                    <div class="number" ><div class="tag">Volume</div> <span class="tag-price"> ${{ stock.summaryDetail.volume.fmt }}</span>  </div>
                </div>
            </div>
        </div>
        <p v-if="errMsg !== null"  class="data-error">{{errMsg}}</p>
        <!-- end container2 -->


        <div v-if="stock != '' " class="test">

            <div class="trade-succesful" v-if="tradeSuccesful" >
                <i class="far fa-check-circle checkmark"></i>
                Trade Successful! 
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

        </div>

        <!-- STOCK SUMMARY -->
        <div v-if="stock != '' " class="summary-card">
            <h2 class="header">{{stock.quoteType.longName}} </h2>
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
        <div ref="buyModal" class="modal" v-if="showBuyModal">
            <div class="modal-content">
                <p class="buy-text" >
                    Buy {{ this.toBuy }} stocks of <span class="modal-stockname">{{ stock.quoteType.longName }}</span> ? <br> <br>
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
                    Sell {{ this.toSell }} stocks of <span class="modal-stockname">{{ stock.quoteType.longName }}</span> ? <br> <br>
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
import { createChart } from 'lightweight-charts'

import Sidenav from '../Sidenav'

export default {
    data () {
        return {
            labels: undefined,
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
            tradeSuccesful: false,
            renderError: false,
            errMsg: null,
        }
    },
    components: {
        appNav: Sidenav,
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
            // console.log('quantity: ', this.toBuy, typeof this.toBuy)
            axios.get(`https://ove-stock-trader.firebaseio.com/users/${user}/funds.json`)
                    .then(function (response) {
                        const funds = response.data
                        const price = ref.stock.price.regularMarketPrice.raw * ref.toBuy
                        if (funds > price) {
                            updatedFunds = funds - price
                            //* show buy dialogue
                            ref.showBuyModal = true
                            let el = ref.$refs.topOfSite
                            el.scrollIntoView({behavior: 'smooth'});
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
                let el = this.$refs.topOfSite
                el.scrollIntoView({behavior: 'smooth'});
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
                    // console.log('DATABASE: ', resp.data)
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
                    // console.log('trying to remove, key is: ', ref.favKey)
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
            this.tradeSuccesful = true
            setTimeout(() => {  
                this.tradeSuccesful = false 
                window.location.reload();
            }, 2500);
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
                this.tradeSuccesful = true
                setTimeout(() => {  
                    this.tradeSuccesful = false 
                    window.location.reload();
                }, 2500);
                this.trade = true
                setTimeout(() => {  this.trade = false }, 2500);
                this.hideSellModal()
            }
        },
    },
    created () {
            // * GET STOCK
            const ref = this;
            let options = {
            method: 'GET',
            url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-profile',
            params: {symbol: this.symbol, region: 'US'},
            headers: {
                'x-rapidapi-host': 'yh-finance.p.rapidapi.com',
                'x-rapidapi-key': '624dc7754bmsh3f19b0e1fbd4882p18e7f1jsn0d9d641d8df8'
            }}
            axios.request(options).then(function (response) {
                const stock = response.data
                console.log('the stock ', stock)
                ref.stock = stock
                if (stock === '' || !stock){
                    ref.errMsg = 'Error fetching data'
                }
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

        //* SETUP CHARTS
        var chart = createChart(document.body, {
            width: 900,
            height: 450,
            layout: {
                backgroundColor: '#111318',
                textColor: '#d1d4dc',
            },
            rightPriceScale: {
                scaleMargins: {
                    top: 0.3,
                    bottom: 0.25,
                },
            },
            crosshair: {
                vertLine: {
                    width: 5,
                    color: 'rgba(224, 227, 235, 0.1)',
                    style: 0,
                },
                horzLine: {
                    visible: false,
                    labelVisible: false,
                },
            },
            grid: {
                vertLines: {
                    color: 'rgba(42, 46, 57, 0)',
                },
                horzLines: {
                    color: 'rgba(42, 46, 57, 0)',
                },
            },
        })
        var areaSeries = chart.addAreaSeries({
            topColor: 'rgba(38, 198, 218, 0.56)',
            bottomColor: 'rgba(38, 198, 218, 0.04)',
            lineColor: 'rgba(38, 198, 218, 1)',
            lineWidth: 2,
            crossHairMarkerVisible: false,
        })
        var legend = document.createElement('div');
        legend.classList.add('legend');
        document.body.appendChild(legend);

        // header title for chart
        // var firstRow = document.createElement('div');
        // firstRow.innerText = 'ETC USD 7D VWAP';
        // firstRow.style.color = 'white';
        // legend.appendChild(firstRow);
        // function pad(n) {
        //     var s = ('0' + n);
        //     return s.substr(s.length - 2);
        // }
        // chart.subscribeCrosshairMove((param) => {
        //     if (param.time) {
        //         const price = param.seriesPrices.get(areaSeries);
        //         firstRow.innerText = 'ETC USD 7D VWAP' + '  ' + price.toFixed(2);
        //     }
        // else {
        //     firstRow.innerText = 'ETC USD 7D VWAP';
        // }
        // });
        // end SETUP CHARTS

        // style charts 
        const chartEl = document.getElementsByClassName('tv-lightweight-charts')
        chartEl[0].style.position = "absolute"
        chartEl[0].style.border = "none"
        chartEl[0].style.top = "299px"
        chartEl[0].style.left = "0px"
        chartEl[0].style.right = "0px"
        chartEl[0].style.marginLeft = "auto"
        chartEl[0].style.marginRight = "auto"
        chartEl[0].style.width = "900px" // same height here as when defined
        chartEl[0].style.visibility = "hidden"

        //* FETCH PRICE DATA
        var timeStamps
        var priceData
        var dataSet = []
        var timeStampsFormatted = []
        // var priceDataFormatted = []
        options = {
        method: 'GET',
        url: 'https://yh-finance.p.rapidapi.com/stock/v2/get-chart',
        params: {interval: '1d', symbol: ref.symbol, range: '1y', region: 'US'},
        headers: {
            'x-rapidapi-host': 'yh-finance.p.rapidapi.com',
            'x-rapidapi-key': '624dc7754bmsh3f19b0e1fbd4882p18e7f1jsn0d9d641d8df8'
        }}
        axios.request(options).then(function (response) {
            timeStamps = response.data.chart.result[0].timestamp
            priceData = response.data.chart.result[0].indicators.quote[0].close
            // format timestamps
            timeStamps.forEach( timestamp => {
                timeStampsFormatted.push(new Date(timestamp * 1000).toLocaleString().split(',')[0].split('.'))
            })
            // format price data
            priceData.forEach( (price, index) => {
                let fullDate = timeStampsFormatted[index]
                // console.log('fulldate ', fullDate)
                let date = fullDate[0]
                let month = fullDate[1]
                let year = fullDate[2]
                let dateFormatted = year + '-' + month + '-' + date
                let dataObject = { time: dateFormatted, value: priceData[index] } 
                dataSet.push(dataObject)
            })
            areaSeries.setData(
                dataSet
            );
            chartEl[0].style.visibility = "visible"
        }).catch(function (error) {
            console.error(error);
            ref.renderError = true
            chartEl[0].style.visibility = "visible"
        })
        // end fetch price data


    }// created
}
</script>

<style css scoped>
* {
    transition:0.2s;
}
.data-error {
    font-size:15px;
    margin:0;
    margin-left:10px;
    font-weight: 300;
    color:var(--red);
    display:inline-block;
}
.container2 {
    display:flex;
    padding:14px;
    padding-top:24px;
    padding-bottom:0px;
    background: #111318;
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
    letter-spacing: var(--letter-spacing-small);
}
.testDiv {
    width:300px;
    height:300px;
    background:red;
}
.legend {
    position:absolute;
    left: 12px;
	top: 12px;
	z-index: 1;
	font-size: 12px;
	line-height: 18px;
	font-weight: 300;
}
.tv-lightweight-charts {
   
}
.test {
    /* border: 2px solid rgb(20 26 32); */
    background: rgb(19 27 37);
    border-bottom-left-radius:var(--border-radius);
    border-bottom-right-radius:var(--border-radius);
    margin-top:450px;
    padding:10px 0;
}
.top-content {
    display:flex;
    margin-top:90px;
    padding-top:30px;
}
.intro {
    display: flex;
    flex-direction: column;
    width: fit-content;
    height: fit-content;
    margin: 0 0;
    margin-left:4px;
    margin-top:2px;
    max-width: 405px;
    margin-left:5px;
    letter-spacing: var(--letter-spacing-small);
}
.headline {
    font-size: 28px;
    font-weight: 300;
}
.stockname {
    font-size: 28px;
    /* font-weight: 400; */
    margin-top:-6px;
}
.stockprice {
    margin-top:2px;
    font-size:24px;
    font-weight: 400;
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
    transition:0.2s;
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
    margin: 12px 0;
}
.buy, .sell {
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    padding: 10px 10px;
    width: 42%;
    margin:0 37px;
}
.buy {
    /* border: 2px solid var(--green-dim); */
}
.sell {
    /* border: 2px solid var(--red-dim);     */
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
    margin:auto;
    font-size:16px;
}
.buy-btn {
    background:var(--green);
    margin-top:13px;
    padding:11px;
}
.sell-btn {
    background:var(--red);
    margin-top:13px;
    padding:11px;

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

.total-price input {
    padding-right:20px;
}
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button {
    margin-left:20px;
    margin-right:-2px;
    opacity: 0.35;
    height:50px;

    -moz-margin-left:20px;
    -moz-margin-right:-2px;
    -moz-opacity: 0.35;
    -moz-height:50px;
}
input[type="number"] {
    -moz-appearance: textfield; /* Hides the spin buttons in Firefox */
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none; /* Hides the spin buttons in WebKit-based browsers like Chrome, Brave, Edge */
    margin: 0; /* Removes additional margin */
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
.numbers-container {
    width: 405px;
    margin-left: auto;
    font-weight: 400;

}
.numbers {
    display:flex;
    margin:0px;
    margin-left:auto;
    justify-content: space-between;
}
.number {
    display:flex;
    flex-direction: column;
    font-size: 1rem;
    width:120px;
    border-top:1px solid var(--primary-color);
    border-bottom:1px solid #51c6c2ea;
    padding:4px 3px;
    margin-bottom:11px;
}

.input-container {
    position:relative;
}
input {
    transition: 0.25s;background: rgb(33 49 59 / 80%);
    border-radius: var(--border-radius);
    border:1px solid rgba(0, 0, 0, 0);
    height:42px;
    margin:8px 0;
    font-size:16px;
    width:100%;
    text-align:right;
    padding-right: 1rem;
}
.buy .input:hover {
    border:1px solid var(--green-dim);
}
.sell .input:hover {
    border:1px solid var(--red-dim);
}
.buy .input:focus {
    border:1px solid var(--green-dim);
}
.sell .input:focus {
    border:1px solid var(--red-dim);
}
.input-container span {
    position: absolute;
    bottom: 21px;
    color: grey;
    margin-left: 12px;
}
h2 {
    margin:0;
    padding:0;
    font-weight: 500;
}

.added {
    color:var(--primary-color) !important;
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
    /* transition-delay: 0.3s;
    transition: 0.7s; */
    z-index:99;
    position:absolute;
    top:0;
    bottom:0;
    left: 0; 
    right: 0; 
    margin:auto;
    width: fit-content;
    height:fit-content;

    padding:45px 80px;
    display: flex;
    flex-direction: column;
    background: var(--background-grey);
    border-left:1px solid var(--primary-color);
    border-radius: var(--border-radius);
}
.modal-stockname {
    color:var(--primary-color);
}
.modal-content {
    margin:25px auto;
    text-align: center;
    font-size:18px;
}
.buy-text {
    text-align: center;
    font-size: 18px;
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
    font-weight: 400;
}
.btn-buy:hover {
    background:rgba(0,0,0,0);
    border:2px solid var(--primary-color);
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
    font-size:30px;
    font-weight: 100;
    color:var(--primary-color);
}
.summary-card {
    margin:80px auto;
    margin-bottom:175px;
    background: rgb(19 27 37);
    letter-spacing: var(--letter-spacing-small);

    padding:35px 45px;
    border-radius: var(--border-radius);
    border-left:1px solid var(--primary-color);
}
.summary {
    margin:30px auto;
    line-height: 1.3;
    font-size: 0.95rem;
    font-weight: 100;
    text-align: justify;
    /* letter-spacing: 1px; */
}

.container1 {
    margin:auto;
    margin-bottom: 90px;
    width:900px;
    margin-top:88px;
}

.tags {
    margin-top:10px;
    display:flex;
    flex-wrap: wrap;
}
.tag {
    font-size: 13px;
    width:100px;
    margin-bottom:1px;
    color:rgb(175, 175, 175);
}
.tag-price {
    /* letter-spacing: 1px; */
    font-size:17px;
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
    display:none;
    /* display:inline; */
    margin: auto auto;
    font-size: 17px;
    margin-left:0;
    font-weight: 400;
    vertical-align: middle;
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
    font-size: 0.82rem;
    color:rgb(206, 206, 206);
}
.trade-succesful {
    transition-delay: 0.3s;
    transition: 0.7s;
    position:absolute;
    top:0;
    bottom:0;
    left: 0; 
    right: 0; 
    margin:auto;
    width: 310px;
    height:fit-content;
    font-size:18px;
    color:var(--primary-color);
    text-align: center;

    padding:50px;
    display: flex;
    flex-direction: column;
    background: var(--background-grey);
    border-left:2px solid var(--primary-color);
    border-radius: var(--border-radius);
    z-index:99;
}
.checkmark {
    font-size: 35px;
    margin:0 auto;
    margin-bottom:15px;
    color:var(--primary-color);
}
</style>