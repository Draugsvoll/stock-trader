<template>
    <div class="box">

            <p class="info">Markets open around 9:30 a.m Eastern Time (usa), <br> 
            and 16:00 norwegian time</p>

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

        <div class="history">
            
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
                title: 'Gains Percentage %'
            },
            totalGains: 0,
            stocks: [],
            data: [],
            totalStockValue: 0,
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
        var value = 0
        axios.get(`https://ove-stock-trader.firebaseio.com/users/${user}/portfolio.json`).then(response => {
              console.log(response.data)
              const ref = this
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
              this.stocks.forEach( stock => {
                var symbol = stock.symbol
                ref.totalStockValue += (stock.price * stock.quantity)
                ref.totalGains += (stock.change*stock.quantity)
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
  },    
    components: {
        appStock: PortfolioStock,
        GChart,
    }

}
</script>


<style  scoped>

*{
    color: rgb(19, 23, 48);

}
h3 {
    margin:5px;
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
.charts {
    max-width:1000px;
    margin:auto auto;
    text-align: center;
    display: flex;
    flex-wrap: wrap;
}
</style>