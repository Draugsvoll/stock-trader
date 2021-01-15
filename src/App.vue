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
    font-family: Roboto,Segoe UI,Helvetica Neue,Helvetica,Arial,sans-serif-light,sans-serif;
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
  font-size:0.8rem;
}

.footer {
  width: 100%;
  background-color: rgb(5 25 31);
  color: white;
  text-align: center;
  height: 20rem;
}
.copyright {
    font-size:0.7rem;

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
