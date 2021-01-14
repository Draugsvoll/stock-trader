<template>
    <div class="container">




   <!-- NEW STUFF -->
    <div class="wrapper">
      <input type="checkbox" id="btn" hidden>
      <label for="btn" class="menu-btn">
        <i class="fas fa-bars"></i>
        <i class="fas fa-times"></i>
      </label>
      <nav id="sidebar">
        <div class="title">
        Side Menu</div>
        <ul class="list-items">
        <li><a href="#"><i class="fas fa-home"></i>Home</a></li>
        <li><a href="#"><i class="fas fa-sliders-h"></i>Clients</a></li>
        <li><a href="#"><i class="fas fa-address-book"></i>Services</a></li>
        <li><a href="#"><i class="fas fa-cog"></i>Settings</a></li>
        <li><a href="#"><i class="fas fa-stream"></i>Features</a></li>
        <li><a href="#"><i class="fas fa-user"></i>About us</a></li>
        <li><a href="#"><i class="fas fa-globe-asia"></i>Languages</a></li>
        <li><a href="#"><i class="fas fa-envelope"></i>Contact us</a></li>
        <div class="icons">
                    <a href="#"><i class="fab fa-facebook-f"></i></a>
                    <a href="#"><i class="fab fa-twitter"></i></a>
                    <a href="#"><i class="fab fa-github"></i></a>
                    <!-- <a href="#"><i class="fab fa-youtube"></i></a> -->
                </div>
        </ul>
        </nav>
    </div>















        <div class="news-container">
            <app-article v-for="article in news" :article="article" :key="article.id"></app-article>
        </div>
    <div class="arrow" v-if="news != '' ">
        <div > <a href="#"><i class="fas fa-long-arrow-alt-up "></i></a> </div>
    </div>
    </div>
</template>

<script>
import Article from './Article.vue'

export default {
    data() {
      return {
        scrollpx: 0
      };
    },
    computed: {
        news() {
            return this.$store.getters.news
        },
    },
    components: {
        appArticle: Article
    },
    methods: {
       handleScroll() {
        this.scrollpx = window.scrollY;
      }
    },
    mounted () {
            // this.$store.dispatch('getNews')
            document.body.addEventListener('scroll', this.handleScroll);
    }
}
</script>


<style scoped>
* {
    /* border:1px solid black; */
}
.top {
    font-size:11px;
}
.arrow {
    width:100px;
    height:50px;
    position:sticky;
    bottom:20px;
    margin-left:auto;
    cursor:pointer;
}
a {
color:rgb(41, 40, 40)
}
i {
    margin-left:3px;
}
.container {
    /* margin-top:-50px; */
}
.news-container {
    margin: 200px auto;
    max-width: 1000px;
}






/* NEW STUFF */
.wrapper{
  height: 100%;
  width: 500px;
  position: relative;
}
.wrapper .menu-btn{
  position:absolute;
  left: -50px;
  background-color: #1f2c3a;
  color: #fff;
  height: 45px;
  width: 45px;
  z-index: 9999;
  border: 1px solid #333;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}
#btn:checked ~ .menu-btn{
  /* left: 247px; */
}
.wrapper .menu-btn i{
  position: absolute;
  font-size: 15px;
  transition: all 0.3s ease;
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
#sidebar{
  position: fixed;
  background-color: #1f2c3a;
  height: 100%;
  width: 170px;
  overflow: hidden;
  left: -270px;
  transition: all 0.3s ease;
}
#btn:checked ~ #sidebar{
  left: 0;
}
#sidebar .title{
  line-height: 65px;
  text-align: center;
  background-color: #081524;
  font-size: 18px;
  font-weight: 600;
  color: #f2f2f2;
  border-bottom: 1px solid #222;
  margin-bottom:-20px;
}
#sidebar .list-items{
  position: relative;
  background-color: #1f2c3a;
  width: 175px;
  padding-left:0px;
  height: 100%;
  list-style: none;
}
#sidebar .list-items li{
  line-height: 50px;
  border-top: 1px solid rgba(255,255,255,0.1);
  border-bottom: 1px solid #333;
  transition: all 0.3s ease;
}
#sidebar .list-items li:hover{
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
  box-shadow: 0 0px 10px 3px #222;
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
  width: 40px;
  display: block;
  margin: 0 5px;
  font-size: 18px;
  color: #f2f2f2;
  background: #3c3c3f;
  border-radius: 5px;
  border: 1px solid #383838;
  transition: all 0.3s ease;
}
#sidebar .list-items .icons a:hover{
  background: #404040;
  color:rgb(92, 104, 167);
}
.list-items .icons a:first-child{
  margin-left: 0px;
}
.content{
  position: absolute;
  top: 50%;
  left: 50%;
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
</style>>

