<template>
    <div class="container">
        <div class="news-container">
            <app-article v-for="article in news" :article="article" :key="article.id"></app-article>
        </div>
    <div class="arrow" v-if="scrollpx > -1">
        <div @click="up"> <a href="#"><i class="fas fa-long-arrow-alt-up fa-2x"></i></a> </div>
        <div class="top">Top</div>
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
            this.$store.dispatch('getNews')
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
    margin-top:-50px;
}
.news-container {
    margin: 200px auto;
    max-width: 1000px;
}
</style>>

