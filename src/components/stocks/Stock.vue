<template>
         <div class="container">
            <div class="stock">
                <div class="info name"> {{ stock.name }}</div>
                <div class="info"> {{ stock.price.toFixed(2) }}$</div>
                <div class="info"> {{ stock.change.toFixed(2) }}$</div>
                <div class="info"> {{ stock.symbol }}</div>
                <div class="info"> {{ stock.prevClose.toFixed(2) }}$</div>
            </div>
         </div>
</template>


<script>
export default {
    props: ['stock'], // mottar stock fra Stocks.vue, passeres som props
    data () {
        return {
            quantity: 0,
            symbol: ''
        }
    },
    methods: { 
        buyStock() {
            if (this.quantity % 1 == 0) {
                const order = {
                    stockId: this.stock.id,
                    stockPrice: this.stock.price,
                    quantity: this.quantity,
                    stockName: this.stock.name
                }
                this.$store.dispatch('buyStock', order) // bruker buyStock action ifra Store.js
                this.quantity = 0
            }
        },
        moreInfo() {
            console.log('symbol: ', )
        }
    }
}
</script>



<style  scoped>
*{
    /* border:1px solid purple; */
}
.containier {
    width:100%;
}

.stock {
    display: flex;
    border:1px solid grey;
}
.info {
    width:250px;
}
.name {
    width:350px;
    overflow: hidden;
    font-weight: 600;
}


</style>