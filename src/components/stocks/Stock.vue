<template>
         <div class="container" >

            <div class="stock">
                <div class="info name"> {{ stock.name }}</div>
                <div class="info" :class="{green: stock.change > 0, red: stock.change < 0 }" > {{ stock.change.toFixed(2) }}$</div>
                <div class="info"> {{ stock.price.toFixed(2) }}$</div>
                <div class="info"> {{ stock.prevClose.toFixed(2) }}$</div>
                <div class="info"> {{ stock.symbol }}</div>
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
    }
}
</script>



<style  scoped>
*{
    /* border:1px solid purple; */
    color:rgb(3, 3, 46);
}
.container {
    border:1px solid rgb(214, 215, 216);
    border-top:none;
    max-width:750px;
    padding:10px;

}

.container:hover {
    background: rgb(232, 236, 238);
}
.container:nth-child(odd):hover {
    background: rgb(232, 236, 238);
}
.container:nth-child(odd) {
  background-color: rgb(245, 246, 247);
}
.container:nth-child(1) {
    border-top:1px solid rgb(214, 215, 216);
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
    justify-content: center;
    display: flex;
    text-align: left;
    max-width:750px;
}
.info {
    width:100px;
    font-size: 13;
}
.name {
    width:175px;
    overflow: hidden;
    font-size: 13;
}
button {
    border-radius:5px;
    color:white;
    background:#16416e;
    border:1px solid rgb(4, 4, 110);
    font-size:12px;
    cursor:pointer;
    padding:5px 7px;
}
button:hover {
    background:rgb(5, 62, 128);
    color:white;
}

</style>