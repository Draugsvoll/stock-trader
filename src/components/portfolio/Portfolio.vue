<template>
    <div class="box">
        <h1>My Stocks: </h1>
        <h3 :class="{empty: stocks!=''}">  You don't have any stocks</h3>
        <app-stock v-for="stock in stocks" :stock="stock" :key="stock.id"></app-stock>
                                                    <!-- pass stock as stock to props -->

    </div>
</template>



<script>
import Stock from './Stock'
import {mapGetters} from 'vuex'

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
        })
    },


    components: {
        appStock: Stock
    }

}
</script>


<style  scoped>

*{
    color: rgb(44, 51, 92);

}
.box {
    padding: 20px;
}

.empty{
visibility: collapse;
margin-bottom: -40px;
}
</style>