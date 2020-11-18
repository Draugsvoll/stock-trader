<template>
    <div class="box">
        <div class="btn-row">
            <button>Popular</button>
            <button>Top Gainers</button>
            <button @click="get500Stocks">S&P 500</button>
        </div>
        <h2>Top Gainers</h2>
        <div class="stock-container">
            <app-stock v-for="stock in stocks" :stock="stock" :key="stock.id"></app-stock>
                                                                    <!-- sender stock til stock as props -->
        </div>
    </div>
</template>



<script>
import Stock from './Stock.vue'
import { get500, getTopGainers } from '../../data/stocksApi'

export default {
    components: {
        appStock: Stock
    },
    computed: {     // computed to access getters
        stocks() {
            return this.$store.getters.stocks
        }
    },
    methods: {
            get500Stocks () {
                this.$store.dispatch('get500Stocks')
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

* {
        color: rgb(19, 23, 48);
}
</style>