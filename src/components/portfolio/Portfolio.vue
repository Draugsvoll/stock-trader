<template>
    <div>
        <h1>My Stocks: </h1>
        <app-stock v-for="stock in stocks" :stock="stock" :key="stock.id"></app-stock>
                                                    <!-- pass stock as stock to props -->

    </div>
</template>



<script>
import Stock from './Stock'
import {mapGetters} from 'vuex'
import {mapActions} from 'vuex'

export default {
/* hente data uten map()
computed: {     
    stockPortfolio() {
        return this.$store.getters.stockPortfolio
    }
},
*/


//hente data MED map
    computed: {
        ...mapGetters({
            stocks: 'stockPortfolio'
        }),
        ...mapActions({
            fetchData: 'loadData'
        })
    },
    components: {
        appStock: Stock
    },
    created() {
        console.log('hei')
        this.$store.dispatch('loadData')
    }

}
</script>