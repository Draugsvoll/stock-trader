<template>
  <div class="app-container">
        <app-header2></app-header2>
        <div class="page-container">
          <transition name="slide">
            <router-view></router-view>
          </transition>
      </div>
  </div>
</template>


<script>
import Header2 from "./components/Header2";
import axios from 'axios'

export default {
  components: {
    appHeader2: Header2,
  },
};
</script>


<style>

* {
    outline: none;
  color:white;
  box-sizing: border-box;
}
html, body{
  height: 100%;
  padding:0;
  background:var(--background-dark);
}

.page-container {
  min-height: 350px;
  margin-left: 50px;
  margin-right: 50px;
  margin-bottom: 25px;
  font-size:0.8rem;
  padding-bottom:75px;
}
.footer {
  width: 100%;
  text-align: center;
  height: 20rem;
}
.icons a {
  margin-right:2px;
}
.copyright {
    font-size:0.7rem;
}
.copyright a {
  color:rgb(225, 219, 219);
}
.footer-headline {
  font-size: 0.8rem;
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
