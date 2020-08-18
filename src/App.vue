<template>
  <div id="container">
    <app-header></app-header>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  
  <app-footer></app-footer>
  </div>
</template>
<!-- TEMPLATE -->


<!-- SCRIPT -->
<script>
import Header from "./components/Header";
import Footer from "./components/Footer";

export default {
  components: {
    appHeader: Header,
    appFooter: Footer
  },
  created() {
    this.$store.dispatch("initStocks"); // access to Store.js and it's methods from Main.js
    this.$store.dispatch('updatePrices')
  },
};
</script>



<!-- STYLE -->
<style>
  
body {
}

* {
    font-family: 'Montserrat', sans-serif;
    
}

.slide-enter-active {
  animation: slide-in 200ms ease-out forwards;
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
