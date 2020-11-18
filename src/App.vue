<template>
  <div class="app-container">
        <app-header></app-header>
        <div class="page-container">
          <transition name="slide">
            <router-view></router-view>
          </transition>
      </div>
  </div>
</template>


<script>
import Header from "./components/Header";
import axios from 'axios'
//import axios from 'axios'

export default {
  components: {
    appHeader: Header,
  },
  created() {
    //this.$store.dispatch("initStocks"); // access to Store.js and it's methods from Main.js
    //this.$store.dispatch('updatePrices')

    // // QUERY A STOCK -> GET SYMBOL
    // const apiCall = {
    //   method: 'GET',
    //   url: 'https://rapidapi.p.rapidapi.com/market/auto-complete',
    //   params: {query: 'tesla', region: 'US'},
    //   headers: {
    //     'x-rapidapi-key': '624dc7754bmsh3f19b0e1fbd4882p18e7f1jsn0d9d641d8df8',
    //     'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
    //   }
    // }; // response
    // axios.request(apiCall).then(function (response) {
    //   const symbol = response.data.ResultSet.Result[0].symbol
    //   console.log(symbol);
    //   }).catch(function (error) {
    //     console.error(error);
    //   }); //query stock


  // // GET SINGLE STOCK
  // const options = {
  // method: 'GET',
  // url: 'https://rapidapi.p.rapidapi.com/stock/v2/get-financials',
  // params: {symbol: 'AMRN', region: 'US'},
  // headers: {
  //   'x-rapidapi-key': '624dc7754bmsh3f19b0e1fbd4882p18e7f1jsn0d9d641d8df8',
  //   'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
  // }};
  // axios.request(options).then(function (response) {
  //   const price = response.data.price.regularMarketPrice.fmt
  //   console.log(price)
  // }).catch(function (error) {
  //   console.error(error);
  // });//single stock


// // GET MULTIPLE STOCKS
//       const stocks = 'AMD, IBM, AAPL, TSLA, AMZN'
//       const options = {
//       method: 'GET',
//       url: 'https://rapidapi.p.rapidapi.com/market/get-quotes',
//       params: {region: 'US', symbols: stocks},
//       headers: {
//           'x-rapidapi-key': '624dc7754bmsh3f19b0e1fbd4882p18e7f1jsn0d9d641d8df8',
//           'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
//       }};
//       axios.request(options).then(function (response) {
//           const returnedStocks = response.data.quoteResponse.result
//           console.log(returnedStocks)
//           // return array name+price of each stock
//           var stocksForPage = [ ]
//           returnedStocks.forEach( stock => {
//               console.log('Name: ', stock.shortName + ' Price: ', stock.regularMarketPrice)
//               const newStock = { name: stock.shortName, price: stock.regularMarketPrice}
//               stocksForPage.push(newStock)
//           });
//           console.log('stocks for page: ', stocksForPage)
//       }).catch(function (error) {
//           console.error(error)
//       });//multiple stocks
      


  },//created
};//default
</script>




<style>
* {
    font-family: 'Montserrat', sans-serif;
    outline: none;
}

html, body{
  height: 100%;
  padding:0;
}

.page-container {
  min-height: 350px;
  margin-left: 50px;
  margin-right: 50px;
  margin-bottom: 25px;
}

.footer {
  width: 100%;
  background-color: rgb(33, 46, 75);
  color: white;
  text-align: center;
  height: 20rem;
}



/* SLIDES */
.slide-enter-active {
  animation: slide-in 350ms ease-out forwards;
}
/* .slide-leave-active {
    animation: slide-out 200ms ease-out forwards;
  } */
@keyframes slide-in {
  from {
    transform: translateY(-30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
/* @keyframes slide-out {
    from {
      transform: translateY(0);
      opacity:1;
    }
    to {
      transform: translateY(-30px);
      opacity: 0;
    }
  } */
</style>
