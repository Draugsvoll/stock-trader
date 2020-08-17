<template>
  <header>
          <!-- <img src=".././public/download.jpg" class="logo" height="80px"> -->
            <nav>
                <ul class="nav_links">
                    <!-- <li><a href="#">Home</a></li>
                    <li><a href="#">Services</a></li>
                    <li><a href="#">About</a></li> -->
                    <router-link to="/portfolio" tag="li"><a>Portfolio</a></router-link>
                    <router-link to="/stocks" tag="li"><a>Stocks</a></router-link>
                    <router-link to="/" tag="li"><a>Home</a></router-link>
                </ul>
            </nav>
                <ul class="nav_links two">
                    <li> <a @click="saveData" href="#"><p id="item" >Save</p></a></li>
                    <li> <a @click="loadData" href="#"><p id="item" >Load</p></a></li>
                    <li> <a href="#"><p id="item" @click="updatePrices">Update Prices</p></a></li>
                    <li class="item">Funds: {{ funds |  currency }}</li>
                </ul>
                <!-- <a class="cta" href="#"><button>Log Out</button></a> -->
        </header>
</template>



<script>
    import {mapActions} from 'vuex'

    export default {
        data() {
            return {
                isDropdownOpen: false
            }
        },
        computed: {
            funds() {
                return this.$store.getters.funds
            }
        },
        methods: {
            ...mapActions({
                update:'updatePrices',
                fetchData: 'loadData' // to use this action, import it to store.js from action.js
                }),
            updatePrices() {
                this.update() // update hentes fra mapActions
            },
            saveData() {
                const data= {
                    funds: this.$store.getters.funds,
                    stockPortfolio: this.$store.getters.stockPortfolio,
                    stocks: this.$store.getters.stocks
                }
                // accessing vue-resource i main.js
                this.$http.put('data.json', data) // need .json work
                // bruker put fordi vi vil kun ha 1 data-object
            },
            loadData() {
                this.fetchData() 
                // access action
            }
        }
    }
</script>


<style scoped>

* {
    font-family: 'Montserrat', sans-serif;
    font-size: 22px;

}
#item {
    font-size: 22px;
}
.item {
    margin-left: 20px;

}
li, a, button{
    font-family: 'Montserrat', sans-serif;
    color:white;
    
}

.nav_links li a{
    text-decoration: none;
    color:white;
    font-family: 'Montserrat', sans-serif;
    font-size: 30px;

}


.two {
    margin: 3px 0px 0 0;
    padding:0;
}

    header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgb(33, 46, 75);
    padding: 20px 3%;
    font-size: 30px;

    }

.logo{
    cursor:pointer;
}

.nav_links li{
    display: inline-block;
    padding: 0px 10px;
}

.nav_links li a{
    transition: all 0.3s ease 0s;
}

.nav_links li a:hover{
    color: rgb(198, 204, 224);
}

button{
    padding: 9px 25px;
    background-color: rgb(47, 126, 245, 1);
    border:none;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease 0s;
}

button:hover{
    background-color: rgb(47, 126, 245, 0.8);
}

    ul {
        padding: 0px
    }
    .cta {
        font-size:20px
    }
</style>