<template>
         <div class="col-sm-4 col-md-2" id="body-box">
            <div class="panel panel-success" id=stock-box>
                <div class="panel-heading">
                    <h3 class="panel-title">  
                        {{ stock.name }}<br>
                        <small>Price: {{ stock.price }}$</small>
                    </h3>
                </div>
                <div class="panel-body" id="stock">
                    <div class="">
                        <input  id="quantity"
                                type="number"
                                class=form-control
                                placeholder="Quantity"
                                v-model.number="quantity"
                                >
                    </div>
                    <div class="">
                        <button
                                id="btn"
                                class="btn btn-success"
                                @click="buyStock"
                                :disabled="quantity <1 || (!(this.quantity % 1) == 0 )"
                                >Buy</button>
                                <!-- add disabled attribute to button if conditions met -->
                    </div>
                </div>
            </div>
         </div>
</template>



<script>
export default {
    props: ['stock'], // mottar stock fra Stocks, passeres som props
    data () {
        return {
            quantity: 0
        }
    },
    methods: { 
        buyStock() {
            if (this.quantity % 1 == 0) {
                const order = {
                    stockId: this.stock.id,
                    stockPrice: this.stock.price,
                    quantity: this.quantity
                }
                this.$store.dispatch('buyStock', order) // bruker buyStock action ifra Store.js
                this.quantity = 0
            }
        }
    }
}
</script>



<style  scoped>
    #stock-box {
        margin: 10px 10 10 0;
        border-radius: 10px;
        min-width: 240px;
        min-width: 241px;

    }

    .panel-body {
        display: inline !important;
    }


#stock {
    display: inline-flex !important;
}

#body-box {
    display: inline-flex;
    padding: 0;
}

#btn {
    background: rgb(15, 65, 158);
    border: 1px solid black;
}

</style>