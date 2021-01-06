<template>
    <div class="box">
        <h1>Stock Trader AS</h1>
                                <!-- apply the currency filter -->
        <p><b>Available Funds:</b> <br>{{ funds | currency }}</p>
        <div class=""><b>SAVE button:<br> </b>Saves your current portfolio to a database (Firebase)</div><br>
        <div class=""><b>LOAD button:<br></b>Loads your last saved portfolio from database</div><br>

        <div><b>INFO: </b><br>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
             Suspendisse sed nisi lacus sed viverra tellus in hac habitasse. Semper auctor neque vitae tempus quam pellentesque nec nam. 
             Tellus integer feugiat scelerisque varius morbi enim. Egestas sed sed risus pretium. Mauris rhoncus aenean vel elit scelerisque 
             
              lacus luctus accumsan tortor. Mauris sit amet massa vitae tortor condimentum lacinia. Facilisi cras fermentum odio eu feugiat pretium.
               Quis vel eros donec ac odio tempor orci. Orci a scelerisque purus semper eget duis at. Porta non pulvinar neque laoreet suspendisse i
               nterdum consectetur libero. Laoreet sit amet cursus sit amet dictum sit. Dapibus ultrices in iaculis nunc sed. Arcu risus quis varius 
               quam quisque id diam. Leo vel fringilla est ullamcorper eget nulla facilisi. Proin fermentum leo vel orci. Ac tortor dignissim convallis aenean et tortor at risus. 
               Commodo ullamcorper a lacus vestibulum sed arcu non. Posuere urna nec tincidunt praesent semper. Varius quam quisque id diam. Mauris 
               augue neque gravida in fermentum et sollicitudin. Amet aliquam id diam maecenas ultricies mi. Eu consequat ac felis donec et odio pellentesque 
               diam. Sed turpis tincidunt id aliquet risus. Cursus metus aliquam eleifend mi in nulla. Amet volutpat consequat mauris nunc congue nisi. At lectus 
               urna duis convallis. Varius morbi enim nunc faucibus a pellentesque sit amet. Commodo ullamcorper a lacus vestibulum sed. Vitae congue eu consequat 
               ac felis donec et. Egestas congue quisque egestas diam in arcu cursus. Nec dui nunc mattis enim.</div>
    </div>
</template>




<script>
export default {
  
    computed: {
        funds() {
            return this.$store.getters.funds
        }
    }
}
</script>




<style  scoped>
.box{
    margin: 0 auto;
    padding: 20px;
    text-align: justify;
    width: 700px;
    color: rgb(37, 43, 78);
    margin-top: 20px;
    }

h1 {
    margin-bottom: 30px;
}
</style>