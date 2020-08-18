<template>
         <div class="col-sm-4 col-md-2" id="body-box">
            <div class="panel panel-success" id=stock-box>
                <div class="panel-heading">
                    <h3 class="panel-title stock-title">  
                        <span>{{ stock.name }}</span><br>
                        <!-- henter stock fra modules -> portfolio -->
                        <small>Price: {{ stock.price }}$ | Quantity: {{ stock.quantity }}</small> 
                    </h3>
                </div>
                <div class="panel-body" id="stock">
                    <div class="">
                        <input  id="quantity"
                                type="number"
                                class=form-control
                                placeholder="0"
                                v-model.number="quantity"
                                >
                    </div>
                    <div class="">
                        <button
                                id="btn"
                                class="btn btn-success"
                                @click="sellStock"
                                :disabled="quantity <1 || (!(this.quantity % 1) == 0 ) || insufficientQuantity"
                                >Sell
                                <!-- {{ insufficientQuantity ? 'Not enough' : 'Sell' }} alternativ feil håndtering-->
                                </button>
                                <!-- add disabled attribute to button if conditions met -->
                                
                    </div>
                </div>
            </div>
         </div>
</template>



<script>
import {mapActions} from 'vuex'

export default {
    props: ['stock'], // mottar stock fra portfolio siden vi sender den i 'stock' elementet
    data () {
        return {
            quantity: 0
        }
    },
    methods: { 
        ...mapActions({ // henter actions fra Store.js, bruker den nedenfor
            placeSellOrder: 'sellStock'
         }),
        sellStock() {
            const order = {
                stockId: this.stock.id,
                stockPrice: this.stock.price,
                quantity: this.quantity
            } 
            this.placeSellOrder(order) // bruker sellStock metoden fra mapAction ^
            //this.$store.sellStock(order) kunne brukt denne istedenfor this.placeSellOrder(order)
        }
    },//methods
    computed: { // access to Store.js
        insufficientQuantity() {
            return this.quantity > this.stock.quantity // this.stock er stock fra props
        }
    }
}
</script>



<style  scoped>
  .panel-body {
        display: inline !important;

    }

    #stock {
    display: inline-flex !important;
}
#body-box {
    display: inline-flex;
    padding: 0;
    margin:20px 20px 20px 0;

}

#btn {
    background: rgb(15, 65, 158);
    border: 1px solid black;
}

</style>