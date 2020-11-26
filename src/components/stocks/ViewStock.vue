<template>
    <div class="container">
        <h1> {{ symbol }} </h1>

        <div class="tags">
            <div class="tag">Quarterly</div>
            <div class="tag">Annually</div>
            <div class="tag">Market Cap</div>
            <div class="tag">P/B Ratio</div>
            <div class="tag">Profit Margins</div>
            <div class="tag">Outstanding Shares</div>
        </div>
        <div class="numbers">
            <div class="number" > {{ stock.defaultKeyStatistics.earningsQuarterlyGrowth.fmt }} </div>
            <div class="number" > {{ stock.defaultKeyStatistics['52WeekChange'].fmt }} </div>
            <div class="number" > {{ stock.defaultKeyStatistics.enterpriseValue.fmt }} </div>
            <div class="number" > {{ stock.defaultKeyStatistics.priceToBook.fmt }} </div>
            <div class="number" > {{ stock.defaultKeyStatistics.profitMargins.fmt }} </div>
            <div class="number" > {{ stock.defaultKeyStatistics.sharesOutstanding.fmt }} </div>
        </div>
        
        <br>
        <br>
        <div> country{{ stock.assetProfile.country }}</div>
        <div> city{{ stock.assetProfile.city }}</div>
        <div> sector {{ stock.assetProfile.sector }}</div>
        <div> full time employees{{ stock.assetProfile.fullTimeEmployees }} </div>
        <div> {{ stock.assetProfile.website }} </div>
        <div> {{ stock.assetProfile.adress1 }} </div>
        <div> phone {{ stock.assetProfile.phone }} </div>

        <div> {{ stock.assetProfile.longBusinessSummary }}</div>
    </div>
</template>



<script>
import axios from 'axios'

export default {
    data () {
        return {
            symbol: this.$route.query.symbol,
            stock: ''
        }
    },
    created () {
            const ref = this;
            console.log('query: ', this.symbol)
            var stockInfo = {}
            const options = {
            method: 'GET',
            url: `https://yahoo-finance-low-latency.p.rapidapi.com/v11/finance/quoteSummary/${this.symbol}`,
            params: {modules: 'defaultKeyStatistics,assetProfile'},
            headers: {
                'x-rapidapi-key': '624dc7754bmsh3f19b0e1fbd4882p18e7f1jsn0d9d641d8df8',
                'x-rapidapi-host': 'yahoo-finance-low-latency.p.rapidapi.com'
            }}
            axios.request(options).then(function (response) {
                console.log(response.data.quoteSummary.result[0])
                const stock = response.data.quoteSummary.result[0]
                console.log('stock: ', stock)
                ref.stock = stock
            }).catch(function (error) {
                console.error(error);
            });
            
    }
}
</script>

<style>
* {
}
.container {
    max-width:1100px;
    margin:auto;
}
.numbers {
    display: flex;
}
.tags {
    display:flex;
}
.tag {
    font-weight: bolder;
    font-size: 18px;
    width:250px;
}
.number {
    font-size: 18px;
    width:250px;
}
</style>