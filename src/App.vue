<template>
    <div id="container">
        <app-header></app-header>       
        <transition name="slide" >
          <router-view></router-view>
        </transition>
  </div>
</template>
<!-- TEMPLATE -->


<!-- SCRIPT -->
<script>
import Header from './components/Header'

export default {
    components: {
      appHeader: Header
    },
  created() {
    this.$store.dispatch('initStocks')  // access to store and it's methods from main.js
  }

}
</script>



<!-- STYLE -->
<style>

  /* .slide-leave-active {
    animation: slide-out 200ms ease-out forwards;
  } */

  .slide-enter-active {
    animation: slide-in 200ms ease-out forwards;
  }


  @keyframes slide-in {
    from {
      transform: translateY(-30px);
      opacity:0;
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
