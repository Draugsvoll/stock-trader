<template>
    <div>
        <h1>Available Stocks: </h1>
        <app-stock v-for="stock in stocks" :stock="stock" :key="stock.id"></app-stock>
                                                           <!-- sender stock til stock as props -->
    </div>
</template>



<script>
import Stock from './Stock.vue'

export default {
    components: {
        appStock: Stock
    },
    computed: {     // computed to access getters
        stocks() {
            return this.$store.getters.stocks
        }
    }
}

</script>