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
<!-- TEMPLATE -->


<!-- SCRIPT -->
<script>
import Header from "./components/Header";

export default {
  components: {
    appHeader: Header,
  },
  created() {
    this.$store.dispatch("initStocks"); // access to Store.js and it's methods from Main.js
    this.$store.dispatch('updatePrices')
  },
};
</script>



<!-- STYLE -->
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
