<template>
         <div class="container" >

            <div class="stock">
                <div class="info name"> {{ stock.name }}</div>
                <!-- <div class="info"> {{ gains.toFixed(2) }}%</div> -->
                <div class="info" :class="{green: stock.change > 0, red: stock.change < 0 }" > {{ stock.change.toFixed(2) }}$</div>
                <div class="info"> {{ stock.price.toFixed(2) }}$</div>
                <div class="info"> {{ stock.prevClose.toFixed(2) }}$</div>
                <div class="info smaller"> {{ stock.quantity }}</div>
                <div class="info smaller" :class="{green: stock.change > 0, red: stock.change < 0 }"> {{ gains }}%</div>
                <div class="info smaller"> {{ stock.symbol }}</div>
                <div class="btn"><button @click="viewStock(stock.symbol)">View</button></div>
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
           window.location.href = `/stocks/viewstock?symbol=${stock}`
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
*{
    /* border:1px solid purple; */
    color:rgb(3, 3, 46);
}
.container:hover {
    background: rgb(232, 236, 238);
}
.container:nth-child(odd):hover {
    background: rgb(232, 236, 238);
}
.container {
    border:1px solid rgb(214, 215, 216);
    border-top:none;
    width:750px;
    padding-top: 9px;
    padding-bottom: 7px;
    padding-left: 5px;
    padding-right: 5px;
}
.smaller {
    width:65px !important;
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
    :750px;
}
.info {
    width:100px;
    font-size: 12px;
}
.name {
    width:175px;
    overflow: hidden;
    font-size: 12px;
}
.container:nth-child(odd) {
  background-color: rgb(245, 246, 247);
}
.container:nth-child(1) {
    border-top:1px solid rgb(214, 215, 216);
}
button {
    border-radius:5px;
    color:rgb(6, 6, 104);
    border:1px solid rgb(4, 4, 110);
    background:rgba(255,255,255, 0.1);
    font-size:0.75rem;
    cursor:pointer;
    padding:2px 6px;
    font-weight: 350;
}
button:hover {
    background:rgb(5, 62, 128);
    color:white;
}


</style>