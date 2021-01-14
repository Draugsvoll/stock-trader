<template>
     <header>
        <nav class="header-nav">
            <a class="header-title" href="/">Stocktrader</a>
            <ul>
                <li><a href="/">{{ funds | currency }} </a></li>
                <li ><a href="/stocks">Buy/Sell</a></li>
                <!-- <li ><a href="/publicportfolios">Portfolios</a></li> -->
                <li ><a href="/portfolio">My Portfolio</a></li>
                <li ><a href="/news">News</a></li>
                <li ><a href="/">Profile</a></li>            
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
            var funds = this.$store.getters.funds
            return funds
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
              var funds = resp.data
              if ( funds == null) {
                   firebase.database().ref(`users/${user}/funds/`).set(10000);
                   funds = 10000
                   console.log('funds fra header')
              } 
              this.$store.dispatch('setFunds', funds)
            })
}
}
</script>

<style scoped>
* {
     color:white
 }
 header {
    font-size:0.85rem;
    padding:1.35rem;
    background-color: #1f2c3a;
}
.header-title {
    text-decoration: none; 
    font-size: 1.1rem;
}

.header-nav {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

.header-nav ul {
    display: flex;
    margin: 0;
    padding: 0;
    flex-wrap: wrap;
}

.header-nav li {
    list-style: none;
    align-items:center;
}
li:hover {
    text-decoration: underline;
}
.header-nav li a {
    text-decoration: none;
    padding-right: 2rem;
    
}
</style>