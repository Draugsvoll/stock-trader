<template>
    <div class="box">
        {{ abcd }}
        <div class="btn-row">
            <button @click="getTrending">Trending</button>
            <button @click="getTopGainers">Top Gainers</button>
            <button @click="get500Stocks">S&P 500</button>
            <button @click="getPortfolios">Portfolios</button>
            <button >Search</button>
        </div>
        <input type="text" placeholder="search" v-model="searchField" >
        <button @click="searchStock" >Search</button>
        <h2>Top Gainers</h2>
        <div class="tags">
                <div class="tag name">Name</div>
                <div class="tag">Market Price</div>
                <div class="tag">Change</div>
                <div class="tag">Symbol</div>
                <div class="tag">Previous Close</div>
        </div>
        <div class="stock-container">
            <app-stock v-for="stock in stocks" :stock="stock" :key="stock.id"></app-stock>
                                                                    <!-- sender stock til stock as props -->
        </div>
    </div>
</template>



<script>
import Stock from './Stock.vue'
import axios from 'axios'

export default {
    data () {
        return {
            // search: this.$route.query.search,
            searchField: 'apple'
        }
    },
    components: {
        appStock: Stock,
    },
    computed: {    
        stocks() {
            return this.$store.getters.stocks
        },
        abcd() {
            return this.$store.getters.abcd
        }
    },
    methods: {
        get500Stocks () {
            this.$store.dispatch('get500Stocks')
        },
        getTrending () {
                this.$store.dispatch('getTrendingStocks')
        },
        getTopGainers () {
            this.$store.dispatch('getTopGainersStocks')
        }
        ,
        getPortfolios () {
            this.$store.dispatch('getPortfolios')
        },
        searchStock () {
            const searchTerm = this.searchField
            this.$store.dispatch('searchstocks', searchTerm)
        }
    }
}

</script>

<style scoped>
.box {
    display: flex;
    flex-direction: column;
}
.btn-row {
    max-width:500px;
    margin:25px auto;
}
h2 {
    display: flex;
    width:400px;
    padding: 20px;
    margin:45px auto;
    justify-content: center;
}
.tags {
    display: flex;
}
.tag {
    font-weight: bolder;
    font-size: 18px;
    width:250px;
}
.name {
    width:350px;
}
.stock-container {
    width:100%; 
}

* {
        color: rgb(19, 23, 48);
}
</style>