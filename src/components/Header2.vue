<template>
     <header>
        <nav class="header-nav">
            <a class="header-title" href="/">Stocktrader-X</a>
            <ul>
                <li><a href="/">{{ funds | currency }} </a></li>
                <li ><a href="/stocks"><i class="fas fa-sliders-h"></i>Buy/Sell</a></li>
                <li ><a href="/portfolio"><i class="fas fa-chart-pie"></i>Portfolio</a></li>
                <li ><a href="/"><i class="far fa-user-circle"></i>Account</a></li>
                <!-- <li ><a href="/publicportfolios">Portfolios</a></li> -->
                <!-- <li @click="logout"><a href="/login" >Logout</a></li>             -->
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
                //    console.log('funds fra header')
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
    font-size:1rem;
    padding:1.35rem;
    background:var(--background-light);
    z-index:5;
}
.header-title {
    text-decoration: none; 
    margin-left:32px;
    font-size: 1.3rem;
    z-index:5;

}
.header-title:hover {
    color:var(--primary-color);

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
    color:var(--primary-color) !important;

}
li a:hover {
    color:var(--primary-color) !important;

}
.header-nav li a {
    text-decoration: none;
    padding-right: 2rem;
    
}
i {
    margin-right:5px;
}
</style>