<template>
    <div class="home-container">
        <h1>Realtor AS</h1>
            <div class="buttons">
                <div><button>Buy</button></div>
                <div><button>Rent</button></div>
                <div><button>Sell</button></div>
            </div>
            <div class="form">
                    <input v-model="searchTerm" type="text" name="search" id="search" placeholder="city, neighborhood, adresss">
                    <button @click="search">Search</button>
            </div>
    </div>
</template>




<script>
//import axios from "axios";

export default {
    data () {
        return {
            searchTerm: '',
        }
    },
    computed: {
        funds() {
            return this.$store.getters.funds
        }
    },
    methods: {
         search () {
                window.location.replace(`/searchLocation/${this.searchTerm}`);
        }
    }//methods
}
</script>




<style  scoped>
.form {
    display: flex;
    justify-content: center;
}
input {
    width: 400px;
}
.home-container{
    text-align: justify;
    width: 1383px;
    color: rgb(37, 43, 78);
    height: 847px;
    justify-content: center;
    border: 1px solid white;
    background: url('../assets/main-background2.jpg');
    }

.buttons {
    display: flex;
    margin: auto;
    justify-content: center;
}
button {
    background: rgba(50, 48, 48, 0.8);
    color:white;
    padding: 10px 25px;
    border: 1px solid black;
}
h1 {
    text-align: center;
    margin: auto;
    margin-top: 400px;
    color:white;
}
</style>