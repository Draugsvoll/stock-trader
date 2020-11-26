<template>
     <header>
        <nav class="header-nav">
            <a class="header-title" href="/">Mybrary</a>
            <ul>
                <li ><a href="/stocks">Stocks</a></li>
                <li ><a href="/publicportfolios">portfolios</a></li>
                <li ><a href="/news">News</a></li>
                <li ><a href="/">unused</a></li>            
            </ul>
        </nav>
    </header>
</template>

<style scoped>
* {
     color:black
 }
 header {
    font-size: 22px;
    height: 50px;
    color:black;
    background: lightgrey;
    /* background: linear-gradient(to right, rgb(17, 36, 58), rgb(17, 33, 54)); */
}
.header-title {
    text-decoration: none; 
}

.header-nav {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
}

.header-nav ul {
    display: flex;
    margin: 0;
    padding: 0;
    flex-wrap: wrap;
}

.header-nav li {
    list-style: none;
}

.header-nav li a {
    text-decoration: none;
    padding-right: 2rem;
    
}
</style>