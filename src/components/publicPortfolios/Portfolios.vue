<template>
    <div class="box">
        <h2>Popular Portfolios</h2>
        <div class="tags">
                <div class="tag name"></div>
        </div>
        <div class="portfolio-container">
            <app-stock v-for="portfolio in portfolios" :portfolio="portfolio" :key="portfolio.userId"></app-stock>
                                                                    <!-- sender portfolio til portfolio as props -->
        </div>
    </div>
</template>



<script>
import Portfolio from '../publicPortfolios/Portfolio'
import { getPortfolios } from '../../data/stocksApi'

export default {
    components: {
        appStock: Portfolio
    },
    computed: {     // computed to access getters
        portfolios() {
            return this.$store.getters.portfolios
        }
    },
    methods: {

    },
    created() {
            this.$store.dispatch('getPortfolios')
    }
}

</script>

<style scoped>
.box {
    display: flex;
    flex-direction: column;
}
.btn-row {
    max-width:500px;
    margin:25px auto;
}
h2 {
    display: flex;
    width:400px;
    padding: 20px;
    margin:45px auto;
    justify-content: center;
}
.tags {
    display: flex;
}
.tag {
    font-weight: bolder;
    font-size: 18px;
    width:250px;
}
.name {
    width:350px;
}
.stock-container {
    width:100%; 
}

* {
        color: rgb(19, 23, 48);
}
</style>