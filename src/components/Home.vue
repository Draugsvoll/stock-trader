<template>
    <div class="box">

        <p class="headline">My Account</p>

        <!-- CARD -->
        <div class="card">
            <app-nav></app-nav>
            <!-- <img v-bind:src="imageUrl" alt="" > -->
            <div class="user">
                <div class="">
                    <div class="img-container">
                        <img v-if="imageUrl == '../assets/profile.png' " src="../assets/profile.png" alt="" > 
                        <input class="file" type="file" @change="onFileSelected" accept="image/*" >
                    </div>
                    <span class="email"><i>{{ user.email }}</i></span> 
                </div>
                <div class="funds">
                    <p> <span class="sum">{{ funds | currency }}</span> </p> 
                    <p class="sum-text">Available Funds</p>
                </div>
            </div>
        </div>


        <!-- CARD -->
        <div class=" card card2">
                <p class="header">Terms & Conditions</p>
                <div class="line"></div>
                <p class="text">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's 
                    standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make 
                    a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting,
                    remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing 
                    Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions
                    of Lorem Ipsum.
                </p>

        </div>
        <button @click="logout" class="logout">Logout</button>

    </div>
</template>




<script scoped>
import firebase from 'firebase'
import axios from 'axios'
import Sidenav from '../components/Sidenav'
export default {
    data () {
        return {
            email:'',
            user:'',
            selectedFile: null,
            imageUrl: ''
        }
    },
    components: {
        appNav: Sidenav
    },
    methods: {
        logout () {
           firebase.auth().signOut()
            .then(resp => 
            console.log(resp))
            .catch(err => console.log(err))
            window.location.href = `/login`
       },
        onFileSelected (event) {
            // console.log(event)
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
* {
    border:2px solid rgba(0,0,0,0);
    font-size:14px;
    letter-spacing: 1px;
    line-height: 1.1rem;
}
.card {
    margin:25px auto;
    line-height: 1.2rem;
}
.card2 {
    margin-top:70px;
    width:600px;
}
.line {
    border-top:3px solid var(--background-dark);
    border-radius: 8px;
    width:170px;
    margin:0 auto;
    margin-top:15px;
    margin-bottom:-5px;
}
.user {
    display:flex;
    align-items: center;
    width:650px;
    margin:0 auto;
}
.user > div {
    width:50%;
}
.funds {
    margin-top:30px;
    text-align:center;
}
.headline {
    text-align: center;
    font-size: 30px;
    margin: 30px;
}
.header {
    color:var(--primary-color);
    font-size: 21px;
    margin-bottom:10px;
    text-align: center;
}
span {
    margin-right:5px;
    font-size: 13px;
}
.email {
    text-align: center;
    display:block;
}
.logout {
    background:var(--primary-color);
    font-size: 0.85rem;
    padding:0.6rem 1.2rem;
    border-radius: 4px;
    display:block;
    margin:25px auto;
    cursor:pointer;
    border:2px solid rgba(0,0,0,0);
    transition:0.25s;
}
.logout:hover {
    background:rgba(0,0,0,0);
    border:2px solid var(--primary-color);
}
.box{
    border-left:2px solid var(--primary-color);
    border-top-right-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);
    margin: 0px auto;
    margin-top:13vh;
    text-align: justify;
    padding:22px;
    width: 750px;
    font-size: 0.95rem;
    background:var(--background-light);
    }
h2 {
    margin: 0;
    margin-bottom:0;
    font-size: 1.3rem;
    font-weight: 400;
}
p {
    margin:0;
}
.text {
    margin:20px auto;
    max-width:700px;
    letter-spacing: 0.05rem;
    font-weight: 100;
    font-size: 0.87rem;
    line-height:1.1;
}
.sum {
    font-size: 27px;
    margin-right:0;
}
.sum-text {
    margin:0; 
    font-size: 13px;  
}
i {
    font-size: 1.3rem;
    color:var(--primary-color);
}
.info {
    font-size: 1.05rem;
}
.img-container {
    display: flex;
    align-items: center;
    justify-content: center;
}
img {
   width: 150px;
   max-width: fit-content;
   display:inline-block;
   margin:-10px 0 -30px 0px;
}
input {
    font-size: 13px;
    width:55px;
    display:inline-block;
    margin-left:-30px;
    margin-top:15px;
}
</style>