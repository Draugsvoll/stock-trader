<template>
    <div class="box">

            <p class="headline">My Portfolio</p>

            <!-- ASSETS -->
            <div class="assets">
                <div class="asset-card">
                    <p class="sum" >{{ totalStockValue + funds | currency }}</p> 
                    <p > Total assets   </p> 
                </div>
                <div class="asset-card">
                    <p class="sum" > {{ totalStockValue | currency }}</p> 
                    <p class="value">Stocks</p> 
                </div>
                <div class="asset-card">
                    <p class="sum" > {{ funds | currency }}</p> 
                    <p class="value">Cash Balance</p> 
                </div>
                <div class="asset-card">
                    <p  class="sum"  :class="{green: totalGains > 0, red: totalGains < 0 }"> {{ totalGains | currency }}</p>
                    <p class="value">Total Gains</p> 
                </div>
            </div>

            <app-nav></app-nav>

            <!-- PIE CHART  -->
            <div v-if="chartData2 != null" class="charts" id="pie-chart">
            <GChart
                type="PieChart"
                :data="chartData2"
                :options="chartOptionsPie"
            />
            </div>

            

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
            // PIE-CHART
            chartOptionsPie: {
                title:'Asset Allocation ',
                backgroundColor:'#293143',
                is3D: true,
                    'width':850,
                    'height':300,
                legend: 
                    {position: 'labeled',
                     textStyle: {fontSize: 14, color:'white'}
                     },
                tooltip:
                     {position: 'center', textStyle: {fontSize: 14}, color:'white'},
                titleTextStyle: {
                    fontSize: 22,
                    color:'white',
                },

            },

            // COLUMN CHART
            chartOptionsColumn: {
                'width':1000,
                'height':400,
                title: 'Percentage Gains %',
                titleTextStyle: {
                    fontSize: 20,
                },
            },

            // DATA
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
.headline {
    font-size:35px;
    text-align: center;
    margin:50px
}
.box {
    max-width:900px;
    display: flex;
    padding-top:50px;
    flex-direction: column;
    justify-content: center;
    margin:0 auto;
}
#pie-chart {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin:35px auto;
    width:900px;
    padding:5px;
    padding-top:25px;
    background:var(--background-light);
    border-radius: var(--border-radius);
}
.assets {
    display: flex;
    justify-content: space-between;
}
.asset-card {
    background:var(--background-light);
    width:200px;
    padding:17px;
    border-radius: var(--border-radius);
}
.sum {
    font-size: 24px;
}
p {
    margin:5px;
}
.green {
    color:green;
}
.red {
    color:red;
}

</style>