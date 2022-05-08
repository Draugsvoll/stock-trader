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
            <p class="header">Asset Allocation</p>
            <div v-if="chartData2 != null" class="charts" id="pie-chart">
            <GChart
                type="PieChart"
                :data="chartData2"
                :options="chartOptionsPie"
            />
            </div>

            
        <!-- STOCKS  -->
        <p class="header" v-if="!emptyPortfolio">My Stocks</p>
        <p class="header" v-if="emptyPortfolio">You have no stocks</p>
        <!-- TAGS -->
        <div class="tags" v-if="stocks != ''" >
                <div class="tag name" @click="sortByLetter">Name</div>
                <div class="tag" @click="sortByPrice">Market Price</div>
                <div class="tag" @click="sortByChange">24h Change</div>
                <div class="tag" @click="sortByClose">Prev. Close</div>
                <div class="tag smaller" @click="sortByQuantity">Quantity</div>
                <div class="tag smaller" @click="sortByGains">Gains</div>
        </div>  
        <div class="stock-container">
            <transition-group name="slide" mode="in-out">
                <app-stock v-for="(stock, index) in stocks" :stock="stock" :key="index"></app-stock>
            </transition-group>
        </div>

        <!-- COLUMN CHART -->
        <p class="header" v-if="stocks != ''"  >Percentage Gains </p>
        <div v-if="!emptyPortfolio" class="column">
                <!-- GainColumn -->
                <GChart
                    type="ColumnChart"
                    :data="gainsData"
                    :options="chartOptionsColumn"
                />
        </div>

         <!-- PURCHASE HISTORY -->
        <p class="header" v-if="!emptyPortfolio">Transaction History</p>
        <p class="header" v-if="emptyPortfolio">No transactions have been made</p>
        <div class="history-box">
            <div class="asd" v-for="(purchase, index) in history" :key=purchase.id>
                <div class=history-tags v-if="index == 0">
                    <!-- tags -->
                    <div class="tags2" v-if="stocks != ''">
                        <div class="tag2 name" >Purchase</div>
                        <div class="tag2" >Quantity</div>
                        <div class="tag2" >Price</div>
                        <div class="tag2" >Total Price</div>
                        <div class="tag2">Date</div>
                    </div>
                </div>
                <!-- PURCHASE HISTORY -->
                <div class="history-container">
                    <div class="info name"> {{ purchase.name }} </div>
                    <div class="info"> {{ purchase.quantity }} </div>
                    <div class="info"> {{ purchase.price | currency }} </div>
                    <div class="info"> {{ (purchase.price * purchase.quantity) | currency }} </div>
                    <div class="info date"> {{ purchase.timestamp.replace(/[TZ]/g, ' ').split('.').reverse().pop() }} </div>
                </div>
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
                title:'',
                backgroundColor:'#263047',
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
                title: '',
                tooltip: {trigger: 'both'},
                selectionMode: 'multiple',
                colors: ['rgb(32, 111, 158)'],
                hAxis: {
                    textStyle:{color: 'white'}
                },
                vAxis: {
                    textStyle:{color: 'white'}
                },
                backgroundColor:'#263047',
                'width':850,
                'height':400,
                bar: {
                    // max-width
                    groupWidth: 85,
                },
                titleTextStyle: {
                    fontSize: 22,
                    color:'white',
                },
                legend: 
                    {position: 'labeled', textStyle: {fontSize: 14, color:'white'}},
            },
            // DATA
            totalGains: 0,
            stocks: [],
            data: [],
            totalStockValue: 0,
            totalMoneySpent: 0,
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
              setTimeout(() => {
                  const funds = this.$store.getters.funds
                  this.$store.dispatch('setChartData', chartData)
                  chartData.push(['Cash Balance', funds])
                }, 200)

              //* get updated prices
              var totalStockValue = 0
              this.stocks.forEach( stock => {
                var symbol = stock.symbol
                ref.totalStockValue += (stock.price * stock.quantity)
                ref.totalGains += (stock.change * stock.quantity)
                // ref.totalGains = ( (ref.totalStockValue + ref.funds) - ref.totalMoneySpent)
                const options = {
                method: 'GET',
                url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-summary',
                params: {symbol: symbol, region: 'US'},
                headers: {
                    'x-rapidapi-host': 'yh-finance.p.rapidapi.com',
                    'x-rapidapi-key': '1660860218msh9ed4fea2bd1c6bep1a1c59jsnfe88dd4d5712'
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
                history.unshift(resp[key])
            }
            history.forEach( purchase => {
                var date = purchase.timestamp
                var date2 = date.replace('Z', ' ')
                var date3 = date.replace('T', ' ')
                var date4 = date3.replace('.', ' ')
            })
            ref.history = history
            ref.history.forEach( purchase => {
                ref.totalMoneySpent += purchase.quantity * purchase.price
                // console.log('purchase', purchase.quantity * purchase.price)
            })
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
    font-size:32px;
    text-align: center;
    margin:80px;
    margin-bottom:30px;
  letter-spacing: 1px;

}
.header {
    font-size:28px;
    text-align: center;
    margin:60px;
    margin-bottom:20px;
  letter-spacing: 1px;

}
.box {
    max-width:900px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin:0 auto;
}
#pie-chart {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin:0px auto;
    width:900px;
    background:var(--background-light);
    border-radius: var(--border-radius);
    border-left:2px solid var(--primary-color);
}
.column {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin:0 auto;
    margin-bottom:0;
    width:900px;
    padding:5px;
    background:var(--background-light);
    border-radius: var(--border-radius);
    border-left:2px solid var(--primary-color);
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
    border-left:2px solid var(--primary-color);
}
.asset-card > p {
    font-size:15px;
}
.sum {
    font-size: 24px !important;
}
p {
    margin:5px;
}
.green {
    color:var(--green);
}
.red {
    color:var(--red);
}
.container {
    margin:0;
    padding-left:15px;
}

.stock-container {
  background:var(--background-light);
  border-radius:var(--border-radius);
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
.tags {
    width:900px;
    display: flex;
    text-align: left;
    padding:15px;
    background:var(--background-grey);
     border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
}
.tag {
  cursor: pointer;
  display: flex;
  text-align: left;
  width: 100px;
  height: fit-content;
  font-size: 0.75rem;
}
.tag.smaller {
    width:65px;
}
.tag2.name {
    padding-left:20px;
}
.date {
    width:300px !important;
}
.name {
  width: 275px !important;
  padding-left:5px;
}

/* HISTORY */
.history-box {
    margin:0 auto;
    border-bottom-left-radius: var(--border-radius) !important;
    border-bottom-right-radius: var(--border-radius);
}
.info {
    font-size: 14px;
    width:100px;
    display: flex ;
    align-items: center;
}
.date {
    font-weight: 300;
    color: rgb(240, 240, 240);
}
.history-tags {
    text-align: left;
    padding:5px;
    background:var(--background-grey);
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
}
.history-container {
    background:var(--background-light);
    border-top:1px solid var(--background-dark);
    border-bottom:1px solid var(--background-dark);
    margin-top:50px;
    margin:auto;
    width:900px;
    display: flex;
    padding:23px;
    padding-left:24px;
}
.asd:last-child .history-container {
    border-bottom-right-radius: var(--border-radius);
    border-bottom-left-radius: var(--border-radius);
}
.history-container:hover {
    background:var(--background-light-hover);
}
.history-container:nth-child(1) {
  border-top:none;
}

.tags2 {
    display: flex;
    text-align: left;
    margin:auto;
    padding:10px;
    padding-left:5px;
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
    text-decoration: underline;
}

</style>