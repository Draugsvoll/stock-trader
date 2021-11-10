<template>
         <div class="container" >

            <div class="stock">
                <div class="info name"> {{ stock.name }}</div>
                <div class="info" :class="{green: stock.change > 0, red: stock.change < 0 }" > {{ stock.change.toFixed(2) }}$</div>
                <div class="info"> {{ stock.price.toFixed(2) }}$</div>
                <div class="info"> {{ stock.prevClose.toFixed(2) }}$</div>
                <div class="info"> {{ stock.symbol }}</div>
                <div class="btn"><button @click="viewStock(stock.symbol)">Trade</button></div>
            </div>

         </div>
</template>


<script>
import axios from 'axios'

export default {
    props: ['stock'], 
    data () {
        return {
            quantity: 0,
            symbol: '',
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
                this.$store.dispatch('buyStock', order) 
                this.quantity = 0
            }
        },
        viewStock(stock) {
           window.location.href = `/viewstock?symbol=${stock}`
        },
    }
}
</script>



<style  scoped>
.container {
    border-top:1px solid var(--background-dark);
    width:800px;
    padding:15px 0px;
    margin:0 10px;
    /* padding-left:26px;    */
}

.container:hover {
  background:var(--background-light-hover);
}

.container:nth-child(odd) {

}
.container:nth-child(even) {
}
.container:nth-child(1) {
    border-top:1px solid var(--background-dark);
}
.green {
    color:green !important
}
.red {
    color:red !important
}
.grey {
    background:grey;
}
.stock {
    display: flex;
    text-align: left;
    max-width:800px;
}
.info {
    width:100px;
    font-size: 14px;
    display: flex;
    align-items: center;
}
.name {
    width:275px;
    padding:0 8px;
    overflow: hidden;
    font-size: 13px;
}
button {
    border-radius:5px;
    color:white;
    background:var(--background-dark);
    border:none;
    font-size:12px;
    cursor:pointer;
    padding:7px 10px;
}
button:hover {
    background:rgb(5, 62, 128);
    color:white;
}

</style>