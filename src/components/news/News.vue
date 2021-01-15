<template>
    <div class="container">
      <app-nav></app-nav>
      <div class="news-container">
          <app-article v-for="article in news" :article="article" :key="article.id"></app-article>
      </div>
    </div>
</template>

<script>
import Article from './Article.vue'
import Sidenav from '../Sidenav'

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
        appArticle: Article,
        appNav: Sidenav
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

</style>>

