<template>
  <div class="box">
    <app-nav></app-nav>

    <p class="headline">Live Market Watch</p>
    <p class=header>Top stocks by category</p>

    <!-- SEARCH-FIELD -->
    <div class="searchfield">
      <input
        type="text"
        v-model="searchTerm"
        autofocus
        placeholder="Search.."
        @keyup.enter="getStockSymbol"
      />
      <button class="search" @click="getStockSymbol">Search</button>
    </div>

    <div class="btn-row">
      <button :class="{ active: type == 'S&P 500' }" @click="get500Stocks">
        S&P 500
      </button>
      <button :class="{ active: type == 'Top Gainers' }" @click="getTopGainers">
        Top Gainers
      </button>
      <button :class="{ active: type == 'Trending' }" @click="getTrending">
        Trending
      </button>
      <button :class="{ active: type == 'Favourites' }" @click="getFavourites">
        My Favourites
      </button>
      <!-- <button @click="getPortfolios">Portfolios</button> -->
    </div>

    <!-- <p v-if="stocks != ''" class="blurred-info">You can sort by category</p> -->
    <!-- TAGS -->
    <div class="tags" >
      <div class="tag name" @click="sortByLetter">Name</div>
      <div class="tag" @click="sortByPrice">Market Price</div>
      <div class="tag" @click="sortByChange">24h Change</div>
      <div class="tag" @click="sortByClose">Prev. Close</div>
      <div class="tag">Symbol</div>
      <div class="empty"><button>Trade</button></div>
    </div>


    <!-- STOCKS -->
    <div class="stock-container">
    <div class="loader" v-if="stocks == ''" ></div>
      <transition-group name="slide" mode="in-out">
      <app-stock
        v-for="(stock, index) in stocks"
        :stock="stock"
        :key="index"
      ></app-stock>
      </transition-group>
    </div>
  </div>
</template>



<script scoped>
import Stock from "./Stock.vue";
import axios from "axios";
import firebase from "firebase";
import Sidenav from "../Sidenav";

export default {
  data() {
    return {
      searchTerm: "",
      type: "S&P 500",
      sortedByChange: false,
      sortedByPrice: false,
      sortedByClose: false,
      sortedByLetter: false,
    };
  },
  components: {
    appStock: Stock,
    appNav: Sidenav,
  },
  computed: {
    stocks() {
      return this.$store.getters.stocks;
    },
  },
  methods: {
    sortByChange() {
      if (this.sortedByChange == false) {
        const sortedByChange = this.stocks.sort((a, b) => {
          if (a.change < b.change) return 1;
          return -1;
        });
        this.stocks = sortedByChange;
      } else {
        const sortedByChange = this.stocks.sort((a, b) => {
          if (a.change > b.change) return 1;
          return -1;
        });
        this.stocks = sortedByChange;
      }
      this.sortedByChange = !this.sortedByChange;
    },
    sortByPrice() {
      if (this.sortedByPrice == false) {
        const sortedByPrice = this.stocks.sort((a, b) => {
          if (a.price < b.price) return 1;
          return -1;
        });
        this.stocks = sortedByPrice;
      } else {
        const sortedByPrice = this.stocks.sort((a, b) => {
          if (a.price > b.price) return 1;
          return -1;
        });
        this.stocks = sortedByPrice;
      }
      this.sortedByPrice = !this.sortedByPrice;
    },
    sortByClose() {
      if (this.sortedByClose == false) {
        const sortedByClose = this.stocks.sort((a, b) => {
          if (a.prevClose < b.prevClose) return 1;
          return -1;
        });
        this.stocks = sortedByClose;
      } else {
        const sortedByClose = this.stocks.sort((a, b) => {
          if (a.prevClose > b.prevClose) return 1;
          return -1;
        });
        this.stocks = sortedByClose;
      }
      this.sortedByClose = !this.sortedByClose;
    },
    sortByLetter() {
      if (this.sortedByLetter == false) {
        const sortedByLetter = this.stocks.sort((a, b) => {
          if (a.name.toLowerCase() < b.name.toLowerCase()) return 1;
          return -1;
        });
        this.stocks = sortedByLetter;
      } else {
        const sortedByLetter = this.stocks.sort((a, b) => {
          if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
          return -1;
        });
        this.stocks = sortedByLetter;
      }
      this.sortedByLetter = !this.sortedByLetter;
    },
    get500Stocks() {
      this.type = "S&P 500";
      this.$store.dispatch("get500Stocks");
    },
    getTrending() {
      this.type = "Trending";
      this.$store.dispatch("getTrendingStocks");
    },
    getTopGainers() {
      this.type = "Top Gainers";
      this.$store.dispatch("getTopGainersStocks");
    },
    getPortfolios() {
      this.$router.push("publicportfolios");
    },
    getSymbol() {
      this.type = "Searching for: " + this.searchTerm;
      this.$store.dispatch("resetStocks");
      const ref = this;
      var results = [];
      const options = {
        method: "GET",
        url:
          "https://yahoo-finance-low-latency.p.rapidapi.com/v6/finance/autocomplete",
        params: { query: this.searchTerm, lang: "en" },
        headers: {
          "x-rapidapi-key":
            "624dc7754bmsh3f19b0e1fbd4882p18e7f1jsn0d9d641d8df8",
          "x-rapidapi-host": "yahoo-finance-low-latency.p.rapidapi.com",
        },
      };
      axios
        .request(options)
        .then(function (response) {
          results = response.data;
          const symbols = results.ResultSet.Result[0].symbol;
          console.log("from api: ", symbols);
          ref.getStock(symbols);
        })
        .catch(function (error) {
          console.error(error);
        });
    },
    getStock(symbol) {
      const ref = this;
      var searchedStock = [];

      const options = {
        method: 'GET',
        url: 'https://yh-finance.p.rapidapi.com/stock/v2/get-summary',
        params: {symbol: symbol, region: 'US'},
        headers: {
          'x-rapidapi-host': 'yh-finance.p.rapidapi.com',
          'x-rapidapi-key': '624dc7754bmsh3f19b0e1fbd4882p18e7f1jsn0d9d641d8df8'
        }};
      axios.request(options).then(function (response) {
        const data = response.data;
        // console.log(data);
        const newStock = {
          name: data.quoteType.shortName,
          symbol: data.quoteType.symbol,
          price: data.price.regularMarketPrice.raw,
          change: data.price.regularMarketChangePercent.raw*100,
          prevClose: data.price.regularMarketPreviousClose.raw
        }
        // console.log("from get single stock: ", newStock)
        ref.$store.dispatch("getSearchedStock", newStock);
      }).catch(function (error) {
        console.error(error);
      });
    },
    getStockSymbol () {
      this.$store.dispatch("resetStocks");
      const ref = this
      const options = {
        method: 'GET',
        url: 'https://yh-finance.p.rapidapi.com/auto-complete',
        params: {q: this.searchTerm, region: 'US'},
        headers: {
          'x-rapidapi-host': 'yh-finance.p.rapidapi.com',
          'x-rapidapi-key': '624dc7754bmsh3f19b0e1fbd4882p18e7f1jsn0d9d641d8df8'
        }};
      axios.request(options).then(function (response) {
        console.log(response.data.quotes[0]);
        let symbol = response.data.quotes[0].symbol
        // console.log(symbol)
        ref.getStock(symbol);
      }).catch(function (error) {
        console.error(error);
      });
    },
    //* get portfolio
    getFavourites() {
      this.type = "Favourites";
      this.$store.dispatch("resetStocks");
      var favStocks = [];
      const user = firebase.auth().currentUser.uid;
      var value = 0;
      axios
        .get(
          `https://ove-stock-trader.firebaseio.com/users/${user}/favourites.json`
        )
        .then((response) => {
          console.log(response.data);
          const ref = this;
          const resp = response.data;
          for (let key in resp) {
            favStocks.push(resp[key]);
          }
          // console.log("logging stocks from favourites", favStocks);
          ref.$store.dispatch("setFavourites", favStocks);
        });
    },
  },
  created() {
    this.$store.dispatch("get500Stocks");
  },
};
</script>

<style scoped>
* {
}
.loader {
   border: 5px solid #f3f3f3; 
  border-top: 5px solid #234d8b;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 0.75s linear infinite;
  margin-top:55px;
  position:absolute;
  right:48%;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.headline {
  text-align: center;
  font-size:32px;
  margin:75px auto 0 auto;
  letter-spacing: 1px;

}
.header {
  text-align: center;
  font-size:15px;
  margin: 5px auto;
}
.stock-container {
  margin: auto;
  background:var(--background-light);
  width:850px;
  border-radius:var(--border-radius);
  border-top-right-radius: 0;
    border-top-left-radius: 0;
}
.blurred-info {
  color: grey;
  font-size: 10px;
  text-align: center;
  margin-top: 30px;
  margin-bottom:20px;
}
.active {
  color:black !important;
  background: rgb(201, 207, 211) !important;
  text-decoration: underline;
}
.active:hover {
  background: rgb(211, 215, 218);
}
.box {
  display: flex;
  flex-direction: column;
  margin-bottom: 100px;
}
.btn-row {
  margin:0 auto;
  display: flex;
  border-bottom:1px solid rgba(0,0,0,0);
  justify-content: space-between;
  width:850px;
}
.btn-row button {
  font-size: 0.87rem;
  padding: 0.83rem 0;
  border: none;
  cursor: pointer;
  width: 208px;
  margin-top:0 auto;
  background: #373e41d4;
  color:white;
  letter-spacing: 1px;
  transition: all 0.15s;
}
.btn-row button:last-child {
  border-top-right-radius: var(--border-radius);
}
.btn-row button:nth-child(1) {
  border-top-left-radius: var(--border-radius);
}
.btn-row button:hover {
  color: rgb(4, 38, 90);
  background: rgb(211, 215, 218);
}
::placeholder {
  color: rgb(177, 185, 194);
  padding-left:2px;
}
h2 {
  display: flex;
  padding: 20px;
  margin: 0px auto;
  margin-bottom: 35px;
  justify-content: center;
}
.tags {
  display: flex;
  align-items: center;
  text-align: left;
  width: 850px;
  vertical-align: bottom;
  height: fit-content;
  margin: auto;
  padding:10px;
  padding-left:24px;
  background:var(--background-grey);
  
}
.tag {
  color:white;
  cursor: pointer;
  display: flex;
  text-align: left;
  width: 100px;
  height: fit-content;
  font-size: 0.75rem;
}
.tag:hover {
  text-decoration: underline;
}
.name {
  width: 275px !important;
  padding-left:5px;
}
.searchfield {
  display: flex;
  justify-content: center;
  margin: 50px auto;
}
.search {
  background:var(--background-light);
  border: none;
  color: white;
  font-size: 0.8rem;
  cursor: pointer;
  padding: 0.7rem 1.2rem;
  border-radius: 5px;
}
.search:hover {
  background:var(--background-light-hover);

}
input {
  caret-color:white;
  width: 215px;
  border: none;
  margin-right: 7px;
  background:var(--background-grey);
  border-radius: var(--border-radius);
  padding-left:10px;
}

.empty {
  visibility: hidden;
}

/* SLIDES */
.slide-enter-active {
  animation: slide-in 450ms ease-out forwards;
}
.slide-leave-active {
  animation: slide-out 450ms ease-out forwards;
}
@keyframes slide-in {
  from {
    transform: translateY(200px);
    opacity: 0.1;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
@keyframes slide-out {
  from {
    transform: translateY(0px);
    opacity: 1;
  }
  to {
    transform: translateY(0px);
    opacity: 0;
  }
}
</style>