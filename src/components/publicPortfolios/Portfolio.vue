<template>
         <div class="container">
            <div class="portfolios">
                <div class="info name"> {{ portfolio.name }}</div>
                <div class="info name"> {{ portfolio.id }}</div>
                <button @click="viewPortfolio(portfolio.id, portfolio.pfId)">View Portfolio</button>
            </div>
         </div>
</template>


<script>
export default {
    props: ['portfolio'], 
    data () {
        return {
        }
    },
    methods: { 
       viewPortfolio (id, pfId) {
           window.location.href = `/publicportfolios/view/${id}?pfId=${pfId}`
       }
    }
}
</script>



<style  scoped>
*{
    /* border:1px solid purple; */
}
.container {
    width:100%;
}

.portfolios {
    display: flex;
    border:1px solid grey;
    width: 600px;
    margin: auto;
}
.info {
    width:250px;
}
.name {
    width:350px;
    overflow: hidden;
    font-weight: 600;
}


</style>