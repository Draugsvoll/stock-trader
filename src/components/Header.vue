<template>
  <header>
          <!-- <img src=".././public/download.jpg" class="logo" height="80px"> -->
            <nav>
                <ul class="nav_links">
                    <router-link to="/portfolio" tag="li"><a>Buy</a></router-link>
                    <router-link to="/stocks" tag="li"><a>Rent</a></router-link>
                    <router-link to="/NEEDROUTE" tag="li"><a>Sell</a></router-link>
                    <router-link to="/" tag="li"><a>Home</a></router-link>
                </ul>
            </nav>
                <ul class="nav_links" id="two" >
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

@media only screen and (max-width: 659px) {
header {
    display: flex;
    flex-direction: column;
    justify-content: start;
}

}

h1 {
  color: white;

}

.item {
    margin-left: 10px;
    font-size: 26px;
}
li, a, button{
    
}

.nav_links li a{
    text-decoration: none;
    font-size: 30px;
}


    header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* background-color: rgb(33, 46, 75); */
    padding: 20px 2%;
    font-size: 30px;
background-color: rgb(33, 46, 75);
  color: white;
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
  color: white;

}

.nav_links li a:hover{
}

button{
    padding: 6px 10px;
    border:none;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease 0s;
    outline: none;
    margin:3px;
    font-size: 22px;
}

button:hover{
    background-color: rgba(45, 73, 109, 0.8);
}

    ul {
        padding: 0px
    }
    .cta {
        font-size:20px
    }
</style>