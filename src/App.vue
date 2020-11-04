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
//import axios from 'axios'

export default {
  components: {
    appHeader: Header,
  },
  created() {


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
 
}

.footer {
  width: 100%;
  background-color: rgb(33, 46, 75);
  color: white;
  text-align: center;
  height: 20rem;
}
</style>
