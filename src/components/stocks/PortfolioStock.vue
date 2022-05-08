<template>
         <div class="container" >

            <div class="stock">
                <div class="info name"> {{ stock.name }}</div>
                <!-- <div class="info"> {{ gains.toFixed(2) }}%</div> -->
                <div class="info"> {{ stock.price | currency }}</div>
                <div class="info" :class="{green: stock.change > 0, red: stock.change < 0 }" > {{ stock.change.toFixed(2) }}$</div>
                <div class="info"> {{ stock.prevClose | currency }}</div>
                <div class="info smaller"> {{ stock.quantity }}</div>
                <div class="info smaller" :class="{green: stock.change > 0, red: stock.change < 0 }"> {{ gains }}%</div>
                <div class="info smaller ticker"> {{ stock.symbol }}</div>
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
    },
    computed: {
        gains () {
            const change = this.stock.change
            const prevClose = this.stock.prevClose
            const gains = (change/prevClose) * 100
            return gains.toFixed(2)
        }
    },
}
</script>



<style  scoped>
.container {
    border-top:1px solid var(--background-dark);
    padding:var(--stock-padding) 0px;
    margin:0 10px;
}
.container:hover {
border-radius:var(--border-radius);
  background:var(--background-light-hover);
}
.container:nth-child(1) {
}
.smaller {
    width:65px !important;
}
.green {
    color:var(--green) !important
}
.red {
    color:var(--red) !important
}
.grey {
    background:grey;
}
.stock {
    display: flex;
    text-align: left;
}
.info {
    width:100px;
    font-size: 14px;
    display: flex;
    align-items: center;
    font-weight: 400;
}
.ticker {
    font-size: 13px;
    margin-top:2px;
}
.name {
    width:275px;
    padding:0 8px;
    overflow: hidden;
    font-size: 15px;
    font-weight: 500;
}
.container:nth-child(odd) {
}
.container:nth-child(1) {
}
button {
  border-radius:5px;
    color:white;
    border:none;
    font-size:12px;
    cursor:pointer;
    padding:10px 17px;
    background:var(--background-dark);
}
button:hover {
    background:var(--background-light);
}
</style>