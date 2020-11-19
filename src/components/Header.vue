<template>
    <header>
        <nav class="header-nav">
            <a class="header-title" href="/">Mybrary</a>
            <ul>
                <li ><a href="/stocks">Stocks</a></li>
                <li ><a href="/publicportfolios">portfolios</a></li>
                <li ><a href="/news">News</a></li>
                <li ><a href="/">unused</a></li>            
            </ul>
        </nav>
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
header {
    color:yellow !important;
    font-size: 22px;
    height: 50px;
    background: linear-gradient(to right, rgb(17, 36, 58), rgb(17, 33, 54));
}
.header-title {
    text-decoration: none; 
}

.header-nav {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
}

.header-nav ul {
    display: flex;
    margin: 0;
    padding: 0;
    flex-wrap: wrap;
}

.header-nav li {
    list-style: none;
}

.header-nav li a {
    text-decoration: none;
    padding-right: 2rem;
    
}

.header-nav li a:hover, .header-title:hover {
}
  
</style>