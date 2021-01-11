<template>
    <div class="box">

             <!-- VALUES -->
             <div class="headline">
                 <div class="head">
                    <h3>Stocks: ${{ totalStockValue.toFixed(2) }}</h3> 
                 </div>
                 <div class="head">
                    <h3>Cash: ${{ funds.toFixed(2) }}</h3>
                 </div>
                <div class="head">
                    <h3>Total Gains: {{ totalGains.toFixed(2) }}$</h3>
                </div>
            </div>

            <!-- CHARTS  -->
            <div class="charts">
                <!-- PieChart -->
                <GChart
                    type="PieChart"
                    :data="chartData2"
                    :options="chartOptionsPie"
                />

                <!-- GainColumn -->
                <GChart
                    type="ColumnChart"
                    :data="gainsData"
                    :options="chartOptionsColumn"
                />
            </div>
           
         <!-- OPENING -->
        <p class="opening">Markets open around 9:30 a.m Eastern Time (usa), and 16:00 norwegian time</p>

        <!-- TAGS -->
        <div class="tags" v-if="stocks != '' ">
                <div class="tag width" @click="sortByLetter">Name</div>
                <div class="tag" @click="sortByChange">Change</div>
                <div class="tag" @click="sortByPrice">Market Price</div>
                <div class="tag" @click="sortByClose">Prev. Close</div>
                <div class="tag">Symbol</div>
                <div class="empty"><button>View</button></div>
        </div>

        <!-- STOCKS  -->
        <div class="stock-container">
            <transition-group name="slide" mode="in-out">
                <app-stock v-for="(stock, index) in stocks" :stock="stock" :key="index"></app-stock>
            </transition-group>
        </div>

        <!-- PURCHASE HISTORY -->
        <div class="history" v-for="(purchase, index) in history" :key=purchase.key>
            <div class=history-tags v-if="index == 0">
                <!-- tags -->
                <div class="tags2" v-if="stocks != '' ">
                    <div class="tag2 name" >Purchase History</div>
                    <div class="tag2" >Quantity</div>
                    <div class="tag2" >Price</div>
                    <div class="tag2">Date</div>
                    <div class="empty"><button>View</button></div>
                </div>
            </div>
            <!-- PURCHASE HISTORY -->
            <div class="history-container">
                <div class="info name"> {{ purchase.name }} </div>
                <div class="info"> {{ purchase.quantity }} </div>
                <div class="info"> {{ purchase.price }} </div>
                <div class="info"> {{ purchase.timestamp }} </div>
            </div>
        </div>

    </div>
</template>


<script>
import PortfolioStock from '../stocks/PortfolioStock'
import axios from 'axios'
import firebase from 'firebase'
import { GChart } from 'vue-google-charts'

export default {
    data () {
        return {
            chartOptionsPie: {
                title: 'Asset Allocation',
                is3D: true,
                'width':500,
                'height':300,
            },
            chartOptionsColumn: {
                is3D: true,
                'width':500,
                'height':300,
                title: 'Percentage Gains %'
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
              console.log(response.data)
              const resp = response.data
              const newStocks = []
              for (let key in resp){
                newStocks.push(resp[key])
              }
              this.stocks = newStocks
              console.log('logging stocks from portfolio', newStocks)
              var chartData = [
                        ['Stocks', 'Value'],
                    ]
              newStocks.forEach( stock => {
                  value = stock.price
                  value *= stock.quantity
                  value = value.toFixed(2)
                  value = parseFloat(value)
                  chartData.push([stock.name, value])
              })
              const funds = this.$store.getters.funds
              chartData.push(['Cash Balance', funds])
              console.log(chartData)
              this.$store.dispatch('setChartData', chartData)

              //* get updated prices
              var totalStockValue = 0
            //   this.stocks.forEach( stock => {
            //     var symbol = stock.symbol
            //     ref.totalStockValue += (stock.price * stock.quantity)
            //     ref.totalGains += (stock.change*stock.quantity)
            //     const options = {
            //     method: 'GET',
            //     url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/get-detail',
            //     params: {symbol: symbol, region: 'US'},
            //     headers: {
            //         'x-rapidapi-key': '624dc7754bmsh3f19b0e1fbd4882p18e7f1jsn0d9d641d8df8',
            //         'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
            //     }}
            //     axios.request(options).then(function (response) {
            //         console.log(response.data.price.regularMarketPrice.raw);
            //         stock.price = response.data.price.regularMarketPrice.raw
            //     }).catch(function (error) {
            //         console.error(error);
            //     });
            // })
            })

        //* get history
        var history = []
        axios.get(`https://ove-stock-trader.firebaseio.com/users/${user}/history.json`).then(resp => {
            console.log(resp.data)
            resp = resp.data
            for (let key in resp){
                history.push(resp[key])
            }
            ref.history = history
            console.log('logger history: ', ref.history)
        })
  },    
    components: {
        appStock: PortfolioStock,
        GChart,
    }

}
</script>


<style  scoped>
* {
    /* border:1px solid black; */
}
.width {
    width:175px !important;
}
.opening {
    width:750px;
    font-size: 0.55rem;
    margin:auto;
    margin-top:100px;
    margin-bottom:-30px;
}
.info {
    width:100px;
    font-size: 0.65rem !important;
    color: rgb(243, 240, 240);
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
    width:750px;
    display: flex;
    
}
.green {
    color:green;
}
.info {
    font-size: 0.65rem;
    color:rgb(29, 28, 28);
}
.headline {
    display:inline-flex;
    flex-direction: column;
    margin:auto;
    margin-top:50px;
    max-width:300px;
}
.box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-bottom: 100px;
}
button {
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
    margin-left:0;
}
.history-container {
    border:1px solid rgb(214, 215, 216);
    margin-top:50px;
    width:750px;
    
    margin:auto;
    display: flex;
}
.history:nth-child(odd) {
  background-color: rgb(245, 246, 247);
}

.history-container:nth-child(1) {
  border-top:none;
}
.empty{
    visibility: collapse;
    margin-bottom: -40px;
}
.tags {
    display: flex;
    text-align: left;
    width:750px;
    margin:auto;
    margin-top:55px;
}
.tags2 {
    display: flex;
    text-align: left;
    width:750px;
    margin:auto;
    margin-top:55px;
    margin-left:0;
}
.tag {
    font-size: 12px;
    width:100px;
    cursor:pointer;
}
.tag2 {
    font-size: 12px;
    width:100px;
    cursor:pointer;
    margin-left:0;
}
.charts {
    max-width:1000px;
    margin:auto auto;
    text-align: center;
    display: flex;
    flex-wrap: wrap;
}
</style>