<template>
    <div class="container">
        <div class="news-container">
            <app-article v-for="article in news" :article="article" :key="article.id"></app-article>
        </div>
    </div>
</template>

<script>
import Article from './Article.vue'

export default {
    computed: {
        news() {
            return this.$store.getters.news
            // console.log('henter state fra computed', this.$store.getters.news,)
        },
    },
    components: {
        appArticle: Article
    },
    created () {
            this.$store.dispatch('getNews')
    }
}
</script>


<style scoped>
.news-container {
    margin: 200px auto;
    max-width: 1000px;
}
</style>>

