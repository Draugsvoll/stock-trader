<template>
         <div class="container">
             <div class="article">
                <div class="headline"> {{ article.title }}</div>
                <div class="content" v-html="article.content"></div>
             </div>
         </div>
</template>


<script>

export default {

    props: ['article'], 
    data () {
        return {
        }
    },
    methods: { 
        
    }
}
</script>



<style  scoped>
.article {
    border:2px solid black;
    margin:200px auto;
    background:lightgrey;
    padding: 50px;
}
.headline {
    font-size:35px;
    font-weight: bold;
}
.content {
    max-width:1000px;
}
.content >>> img {
    max-width: 800px;
    max-height:600px;
    padding:0;
    margin:0;
    object-fit: contain;
}


</style>