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
    border:1px solid #1f2c3a46;
    margin:100px auto;
    padding: 50px;
    max-width:700px;
    box-shadow: rgba(162, 162, 168, 0.2) 0px 7px 29px 0px;
}
.headline {
    font-size:21px;
    font-weight: bold;
    margin:auto;
    margin-bottom:40px;
    text-align: center;
    max-width:700px;
}
.content {
    max-width:600px;
    margin:auto;
}

.content >>> figcaption {
    font-size: 0.6rem;
}
.content >>> p {
    font-size: 13px;
}
.content >>> img {
    max-width: 600px;
    max-height:400px;
    padding:0;
    margin:0 auto;
    display: inline-flex;
    object-fit: contain;
}

</style>