<template>
    <div class="box">
        <h2>Welcome, <i>{{ user.email }}</i></h2>
        <img v-bind:src="imageUrl" alt="" >
        <img v-if="imageUrl == '../assets/profile.png' " src="../assets/profile.png" alt="" > <br>
        <span>Upload Avatar</span> <br>
        <input class="file" type="file" @change="onFileSelected" accept="image/*" >
                                <!-- apply the currency filter -->
        <p><b class="info">Available Funds:</b> <br>{{ funds | currency }}</p>
        <div class=""><b class="info">Info:<br> </b>Stocks, funds and trade history are saved
                                                    in a Firebase Database (with registered user).</div><br>

        <div><b class="info">More Info: </b><br>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
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




<script scoped>
import firebase from 'firebase'
import axios from 'axios'

export default {
    data () {
        return {
            email:'',
            user:'',
            selectedFile: null,
            imageUrl: ''
        }
    },
    methods: {
        onFileSelected (event) {
            console.log(event)
            this.selectedFile = event.target.files[0]
            this.onUpload()
        },
        onUpload() {
            const image = this.selectedFile
            firebase.storage().ref('users/' + this.user.uid + '/image' ).put(image).then(resp => {
                this.setImage()
            })
        },
        getImage() {
            firebase.storage().ref('users/' + this.user.uid + '/image' ).getDownloadURL().then( resp => {
                console.log(resp)
                this.imageUrl = resp
            }).catch( err => {
                console.log(err)
                this.imageUrl = '../assets/profile.png'
            })
        },
        setImage() {
            firebase.storage().ref('users/' + this.user.uid + '/image' ).getDownloadURL().then( resp => {
                console.log(resp)
                this.imageUrl = resp
                // this.$router.go()
            }).catch( err => {
                console.log(err)
            })
        },
    },
    computed: {
        funds() {
            return this.$store.getters.funds
        },
        // imageUrl () {
        //     const image = this.getImage()
        //     return image
        // }
    },
    created () {
            const currentUser = firebase.auth().currentUser
            this.user = currentUser
            this.getImage()
        },
}
</script>




<style  scoped>
span {
    margin-right:5px;
    font-size: 11px;

}
.box{
    margin: 0 auto;
    padding: 20px;
    text-align: justify;
    width: 700px;
    color: rgb(15, 17, 31);
    font-size: 0.75rem;
    margin-top: 20px;
    }
h2 {
    margin:25px 0;
    margin-bottom:0;
}
.info {
    font-size: 0.95rem;
}
img {
   max-width: 150px;
   max-height: 150px;
}
input {
    font-size: 11px;
    width:50px;
}
</style>