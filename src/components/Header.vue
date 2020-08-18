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
                <ul class="nav_links" id="two" >
                    <li> <button id="save" @click="saveData" href="#">Save</button></li>
                    <li> <button @click="loadData" href="#">Load</button></li>
                    <li> <button @click="updatePrices">Update Prices</button></li>
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
@media only screen and (max-width: 407px) {

#two {
    margin-top: 40px;
}
}

@media only screen and (max-width: 367px) {

#two {
    margin-top: 70px;
}
}

@media only screen and (max-width: 352px) {

#save {
    margin-top: 90px;
}
}

.item {
    margin-left: 20px;
    font-size: 26px;

}
li, a, button{
    color:white;
    
}

.nav_links li a{
    text-decoration: none;
    color:white;
    font-size: 30px;

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
    color: rgb(149, 162, 207);
}

button{
    padding: 6px 10px;
    background-color: rgb(41, 95, 177);
    border:none;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease 0s;
    outline: none;
    margin:5px;
    font-size: 22px;

}

button:hover{
    background-color: rgba(37, 90, 158, 0.8);
}

    ul {
        padding: 0px
    }
    .cta {
        font-size:20px
    }
</style>