<template>
    <div class="container">
      
    <!-- * side-menu -->
    <div class="wrapper">
      <input type="checkbox" id="btn" hidden>
     
        <nav id="sidebar">
          <div class="title">Menu</div>
            <ul class="list-items">
                <li v-bind:class="{active: path == '/portfolio'}"><a href="/portfolio"><i class="fas fa-chart-pie"></i>My Portfolio</a></li>
                <!-- <li v-bind:class="{active: path == '/news'}" ><a href="/news" ><i class="fas fa-globe-asia"></i>News</a></li> -->
                <li v-bind:class="{active: path == '/stocks'}"><a href="/stocks"><i class="fas fa-sliders-h"></i>Buy & Sell</a></li>
                <li><a href="/"><i class="fas fa-home"></i>Home</a></li>
                <li v-bind:class="{active: path == '/'}"><a href="/"><i class="fas fa-cog"></i>Account</a></li>
                <li><a href="#"><i class="fas fa-envelope"></i>Contact us</a></li>
                <li @click="logout"><a href="#" ><i class="fas fa-user"></i>Logout</a></li>
            </ul>
          <div class="title hidden">Menu</div>
        </nav>
    </div>
   <!-- * side-menu -->
    </div>
</template>

<script scoped>
import firebase from 'firebase'

export default {
  computed: {
    path () {
        return this.$route.path
    }
  },
  methods: {
    logout () {
           firebase.auth().signOut()
            .then(resp => 
            console.log(resp))
            .catch(err => console.log(err))
            window.location.href = `/login`
       },
  },
  created () {
    // console.log(this.path)
  }
}
</script>

<style css scoped>
.active {
      background-color: #112942;
}
.container {
  z-index:1;
}
.hidden {
  color:rgba(0,0,0,0) !important;
}



/* SIDE-MENU */
.wrapper{
  height: 100%;
  width: 500px;
  position: relative;
  letter-spacing: 1px;
  z-index: 99;

}
.wrapper .menu-btn{
  position:absolute;
  left: -50px;
  color: #fff;
  height: 45px;
  /* width: 18px; */
  border: 1px solid #333;
  /* border-radius: 5px; */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}
#btn:checked ~ .menu-btn{
  /* left: 247px; */
}
.wrapper .menu-btn i{
  position: absolute;
  font-size: 15px;
  transition: all 0.15s ease;
}
.wrapper .menu-btn i.fa-times{
  opacity: 0;
}
#btn:checked ~ .menu-btn i.fa-times{
  opacity: 1;
  transform: rotate(-180deg);
}
#btn:checked ~ .menu-btn i.fa-bars{
  opacity: 0;
  transform: rotate(180deg);
}

/* CLOSED */
#sidebar{
  position: fixed;
  width:64px;
  overflow: hidden;
  left:0px;
  top:20vh;
  transition: all 0.4s ease;
  border-top-right-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
}
#sidebar ul {
    background:#141e29 !important;
    z-index:99;
}
#sidebar a {
}
#sidebar i {
  margin-right:22px !important;
}
/* OPEN */
#sidebar:hover{
  width:180px;
}
#btn:checked ~ #sidebar{
  left: 0;
}
#sidebar .title{
  overflow: hidden;
  text-align: center;
  padding:20px 0;
  background-color: var(--background-light);
  font-size: 12px;
  font-weight: 600;
  color: #f2f2f2;
}
#sidebar .list-items{
  position: relative;
  width: 180px;
  padding:0;
  margin:0px;
  list-style: none;
}
#sidebar .list-items li{
  line-height: 50px;
  border-top: 1px solid rgba(255,255,255,0.1);
  border-bottom: 1px solid #333;
  transition: all 0.15s ease;
}
#sidebar .list-items li:hover{
  /* border-top: 1px solid transparent;
  border-bottom: 1px solid transparent; */
  background-color: #112942;
  box-shadow: 0 0px 10px 3px rgb(15, 56, 104);
}
#sidebar .list-items li:first-child{
  border-top: none;
}
#sidebar .list-items li a{
  padding-left:30px;
  color: #f2f2f2;
  text-decoration: none;
  font-size: 12px;
  font-weight: 500;
  height: 45px;
  width: 100%;
  display: block;
}
#sidebar .list-items li a i{
  margin-right: 15px;
}
#sidebar .list-items .icons{
  width: 90%;
  text-align: center;
  position: absolute;
  line-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top:10px;
}
#sidebar .list-items .icons a{
  height: 100%;
  /* width: 140px; */
  display: block;
  margin: 0 5px;
  font-size: 18px;
  color: #f2f2f2;
  /* border-radius: 5px; */
  border: 1px solid #383838;
  transition: all 0.15s ease;
}
#sidebar .list-items .icons a:hover{
  color:rgb(92, 104, 167);
}
.list-items .icons a:first-child{
  margin-left: 0px;
}
.content{
  position: absolute;
  /* top: 50%; */
  /* left: 50%; */
  transform: translate(-50%,-50%);
  color: #202020;
  z-index: -1;
  width: 100%;
  text-align: center;
}
.content .header{
  font-size: 45px;
  font-weight: 700;
}
.content p{
  font-size: 20px;
  font-weight: 700;
}
</style>