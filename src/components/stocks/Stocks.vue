<template>
    <div class="box">
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

<style scoped>
h1 {
    padding: 20px;
}

.box {
        color: rgb(19, 23, 48);
}
</style>