<template>
     <header>
        <nav class="header-nav">
            <a class="header-title" href="/">Stocktrader</a>
            <ul>
                <li><a href="/">Funds: ${{ funds }} </a></li>
                <li ><a href="/stocks">Stocks</a></li>
                <li ><a href="/publicportfolios">Portfolios</a></li>
                <li ><a href="/portfolio">My Portfolio</a></li>
                <li ><a href="/news">News</a></li>
                <li ><a href="/">About</a></li>            
                <li @click="logout"><a href="/login" >Logout</a></li>            
            </ul>
        </nav>
    </header>
</template>


<script scoped>
import firebase from 'firebase'
import axios from 'axios'

export default {
    data () {
        return {
        }
    },
    computed: {
        funds () {
            return this.$store.getters.funds
        }
    },
    methods: {
        logout () {
           firebase.auth().signOut()
            .then(resp => console.log(resp))
            .catch(err => console.log(err))
            window.location.href = `/login`
       },
    },
    created () {
        const user = firebase.auth().currentUser.uid
        axios.get(`https://ove-stock-trader.firebaseio.com/users/${user}/funds.json`).then(resp => {
              const funds = resp.data.toLocaleString()
              this.$store.dispatch('setFunds', funds)
            })
}
}
</script>

<style scoped>
* {
     color:black
 }
 header {
    font-size: 22px;
    height: 50px;
    color:black;
    background: lightgrey;
    font-size:1rem;
    /* background: linear-gradient(to right, rgb(17, 36, 58), rgb(17, 33, 54)); */
}
.header-title {
    text-decoration: none; 
}

.header-nav {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    padding-top:10px;
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
</style>