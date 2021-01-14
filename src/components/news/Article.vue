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
    border-radius:3px;
    border:1px solid #1f2c3a;
    margin:100px auto;
    padding: 50px;
    max-width:700px;
    box-shadow: rgba(162, 162, 168, 0.2) 0px 7px 29px 0px;
}
.headline {
    font-size:22px;
    font-weight: bold;
    margin-bottom:40px;
    text-align: center;
}
.content {
    max-width:800px;
}

.content >>> figcaption {
    font-size: 0.6rem;
}
.content >>> p {
    font-size: 0.75rem;
}
.content >>> img {
    max-width: 600px;
    max-height:400px;
    padding:0;
    margin:0;
    object-fit: contain;
}

</style>