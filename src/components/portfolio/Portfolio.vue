<template>
    <div class="box">

            <app-nav></app-nav>

            <!-- PIE CHART  -->
            <div v-if="chartData2 != null" class="charts">
                <!-- PieChart -->
                <GChart
                    type="PieChart"
                    :data="chartData2"
                    :options="chartOptionsPie"
                />
            </div>

            <!-- VALUES -->
             <div class="headline">
                 <div class="head">
                    <h3> <span class="value">Stocks Value:</span> {{ totalStockValue | currency }}</h3> 
                 </div>
                 <div class="head">
                    <h3><span class="value">Cash Balance:</span> {{ funds | currency }}</h3>
                 </div>
                <div class="head">
                    <h3> <span class="value">Total Gains:</span> <span class="total-gains" :class="{green: totalGains > 0, red: totalGains < 0 }"> {{ totalGains | currency }}</span></h3>
                </div>
            </div>
           
         <!-- OPENING -->
        <!-- <p class="opening">Markets open around 9:30 a.m Eastern Time (usa), and 16:00 norwegian time</p> -->
        <h2 v-if="!emptyPortfolio">My Stocks</h2>
        <h2 v-if="emptyPortfolio">You have no stocks</h2>

        <!-- TAGS -->
        <div class="tags" v-if="stocks != '' ">
                <div class="tag width" @click="sortByLetter">Name</div>
                <div class="tag" @click="sortByChange">24h Change</div>
                <div class="tag" @click="sortByPrice">Market Price</div>
                <div class="tag" @click="sortByClose">Prev. Close</div>
                <div class="tag smaller" @click="sortByQuantity">Quantity</div>
                <div class="tag smaller" @click="sortByGains">Gains</div>
                <div class="empty"><button>Trade</button></div>
        </div>

        <!-- STOCKS  -->
        <div class="stock-container">
            <transition-group name="slide" mode="in-out">
                <app-stock v-for="(stock, index) in stocks" :stock="stock" :key="index"></app-stock>
            </transition-group>
        </div>

        <!-- COLUMN CHART -->
        <div v-if="!emptyPortfolio" class="column">
                <!-- GainColumn -->
                <GChart
                    type="ColumnChart"
                    :data="gainsData"
                    :options="chartOptionsColumn"
                />
        </div>

        <!-- PURCHASE HISTORY -->
        <h2 v-if="!emptyPortfolio">Trading History</h2>
        <h2 v-if="emptyPortfolio">No trades have been made</h2>
        <div class="history" v-for="(purchase, index) in history" :key=purchase.id>
            <div class=history-tags v-if="index == 0">
                <!-- tags -->
                <div class="tags2" v-if="stocks != '' ">
                    <div class="tag2 name" >Purchase</div>
                    <div class="tag2" >Quantity</div>
                    <div class="tag2" >Price</div>
                    <div class="tag2" >Total Price</div>
                    <div class="tag2">Date</div>
                    <div class="empty"><button>Trade</button></div>
                </div>
            </div>
            <!-- PURCHASE HISTORY -->
            <div class="history-container">
                <div class="info name"> {{ purchase.name }} </div>
                <div class="info"> {{ purchase.quantity }} </div>
                <div class="info"> {{ purchase.price }} </div>
                <div class="info"> {{ purchase.price.toFixed(2) * purchase.quantity.toFixed(2) }} </div>
                <div class="info date"> {{ purchase.timestamp.replace(/[TZ]/g, ' ').split('.').reverse().pop() }} </div>
            </div>
        </div>

    </div>
</template>


<script>
import PortfolioStock from '../stocks/PortfolioStock'
import axios from 'axios'
import Sidenav from '../Sidenav'

import firebase from 'firebase'
import { GChart } from 'vue-google-charts'

export default {
    data () {
        return {
            chartOptionsPie: {
                title:'Asset Allocation',
                is3D: true,
                    'width':1000,
                    'height':400,
                legend: 
                    {position: 'labeled',
                     textStyle: {fontSize: 14, color:'black'}
                     },
                tooltip:
                     {position: 'center', textStyle: {fontSize: 14}},
                titleTextStyle: {
                    fontSize: 22,
                },

            },
            chartOptionsColumn: {
                'width':1000,
                'height':400,
                title: 'Percentage Gains %',
                titleTextStyle: {
                    fontSize: 20,
                },
            },
            totalGains: 0,
            stocks: [],
            data: [],
            totalStockValue: 0,
            history: [],
            sortedByChange: false,
            sortedByPrice: false,
            sortedByClose: false,
            sortedByLetter: false,
            emptyPortfolio: false,
            sortedByGains: false,
            sortedByQuantity: false,
        }
    },
    computed: {
        chartData2() {
            return this.$store.getters.chartData
        },
        gainsData () {
            const ref = this
            const gainsData = [
                ['Stock', 'Gains'],
            ]
            this.stocks.forEach( stock => {
                const gain = (stock.change/stock.price) * 100
                gainsData.push([stock.name, gain])
            })
            return gainsData
        },
        funds() {
            return this.$store.getters.funds
        }
    },
    methods: {
        sortByQuantity () {
            if ( this.sortedByQuantity == false ) {
                const sortedByQuantity = this.stocks.sort( (a, b) => {
                if ( a.quantity < b.quantity ) return 1
                return -1
                })
                this.stocks = sortedByQuantity
            } 
            else {
                const sortedByQuantity = this.stocks.sort( (a, b) => {
                if ( a.quantity > b.quantity ) return 1
                return -1
                })     
                this.stocks = sortedByQuantity
            }
            this.sortedByQuantity = !this.sortedByQuantity
        },
        sortByGains () {
            if ( this.sortedByGains == false ) {
                const sortedByGains = this.stocks.sort( (a, b) => {
                a.gains = (a.change/a.price)*(100)
                b.gains = (b.change/b.price)*(100)
                if ( a.gains < b.gains )    return 1
                return -1
                })
            } 
            else {
                const sortedByGains = this.stocks.sort( (a, b) => {
                a.gains = (a.change/a.price)*(100)
                b.gains = (b.change/b.price)*(100)
                if ( a.gains >b.gains )    return 1
                return -1
                })
            }
            this.sortedByGains = !this.sortedByGains
        },
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
        const user = firebase.auth().currentUser.uid
        const ref = this
        var value = 0
        axios.get(`https://ove-stock-trader.firebaseio.com/users/${user}/portfolio.json`).then(response => {
              const resp = response.data
              const newStocks = []
              for (let key in resp){
                newStocks.push(resp[key])
              }
              this.stocks = newStocks
              var chartData = [
                        ['Stocks', 'Value'],
                    ]
              if ( newStocks.length == 0 ) {
                  this.emptyPortfolio = true
              }
              newStocks.forEach( stock => {
                  value = stock.price
                  value *= stock.quantity
                  value = value.toFixed(2)
                  value = parseFloat(value)
                  chartData.push([stock.name, value])
              })
              const funds = this.$store.getters.funds
              chartData.push(['Cash Balance', funds])
              this.$store.dispatch('setChartData', chartData)

              //* get updated prices
              var totalStockValue = 0
              this.stocks.forEach( stock => {
                var symbol = stock.symbol
                ref.totalStockValue += (stock.price * stock.quantity)
                ref.totalGains += (stock.change * stock.quantity)
                const options = {
                method: 'GET',
                url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/get-detail',
                params: {symbol: symbol, region: 'US'},
                headers: {
                    'x-rapidapi-key': '624dc7754bmsh3f19b0e1fbd4882p18e7f1jsn0d9d641d8df8',
                    'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
                }}
                axios.request(options).then(function (response) {
                    stock.price = response.data.price.regularMarketPrice.raw
                }).catch(function (error) {
                    console.error(error);
                });
            })
            })

        //* get history
        var history = []
        axios.get(`https://ove-stock-trader.firebaseio.com/users/${user}/history.json`).then(resp => {
            resp = resp.data
            for (let key in resp){
                // if ( resp[key].timestamp ) {
                //     timestamp = resp[key]
                //     var date = resp[key].timestamp.replace('Z', ' ')  
                //     var date2 = date.replace('T', ' ')  
                //     var date3 = date2.split('.')  
                //     var date4 = date3.splice('.', 1) 
                //     var timestamp = { timestamp: 'prgjroi' }
                //     history.push(timestamp)
                // }             
            history.push(resp[key])
            }
            history.forEach( purchase => {
                var date = purchase.timestamp
                var date2 = date.replace('Z', ' ')
                var date3 = date.replace('T', ' ')
                var date4 = date3.replace('.', ' ')

            })
            ref.history = history
        })
  },    
    components: {
        appStock: PortfolioStock,
        GChart,
        appNav: Sidenav
    }
}
</script>


<style scoped>
* {
    /* border:1px solid black; */
}

h2 {
    margin:auto;
    font-size: 22px;
    margin-top:75px;
}
.smaller {
    width:65px !important;
} 
.green {
    color:green;
}
.red {
    color:red;
}
.date {
    width:175px !important;
}
.width {
    width:175px !important;
}
.opening {
    width:750px;
    font-size: 0.55rem;
    margin:auto;
    z-index:1;
    margin-top:25px;
    margin-bottom:-30px;
}
.name {
    width:175px !important;
    overflow: hidden;
}
*{
    color: rgb(19, 23, 48);
    /* border:1px solid black; */
}
h3 {
    margin:5px;
    font-weight: 400;
    display: flex;
}
.green {
    color:green;
}
.info {
    font-size: 14px;
    color:rgb(1, 2, 8);
    width:100px;
    padding:8px 0;
    display: flex ;
}
.headline {
    display: flex;
    margin:auto;
    margin-top:-20px;
    z-index:1;
    width:750px;
    font-size:19px;
    justify-content: space-between;
}
.box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-bottom: 100px;
}
.stock-container {
    margin:auto;
}
.history {
    text-align: left;
    width:750px;
    margin:auto;
}
.history-tags {
    text-align: left;
    margin-left:20px;
    margin-bottom:5px;
}
.history-container {
    border:1px solid rgb(214, 215, 216);
    margin-top:50px;
    margin:auto;
    display: flex;
    padding:14px 0px 14px 24px;
}
.history-container:hover {
    background: rgb(232, 236, 238);

}
.history:nth-child(even) {
  background-color: rgb(245, 246, 247);
}

.history-container:nth-child(1) {
  border-top:none;
}
.empty{
    visibility: collapse;
    margin-bottom: -40px
}
.tags {
    display: flex;
    text-align: left;
    width:750px;
    margin:auto;
    margin-top:55px;
    margin-bottom:5px;
}
.tags2 {
    display: flex;
    text-align: left;
    width:750px;
    margin:auto;
    margin-top:55px;
    margin-left:5px;
}
.tag {
    font-size:0.75rem;
    width:100px;
    cursor:pointer;
}
.tag2 {
    font-size:0.75rem;
    width:100px;
    margin-left:0;
}
.tag:hover {
    color:rgb(12, 35, 126);
    text-decoration: underline;
}
.charts {
    max-width:1000px;
    margin:auto auto;
    margin-top:50px;
    text-align: center;
    display: flex;
    flex-wrap: wrap;
}
span {
    margin-right:8px;
}
.column {
    margin:auto;
    margin-top:50px;
}
.value {
    font-size: 16px !important;
}
</style>