<template>
    <div class="box">

        <p class="headline">My Account</p>

        <div class="card">
            <app-nav></app-nav>
            <!-- <img v-bind:src="imageUrl" alt="" > -->
            <div class="user">
                <img v-if="imageUrl == '../assets/profile.png' " src="../assets/profile.png" alt="" > 
                <span class="email"><i>{{ user.email }}</i></span> 
                <div class="funds">
                    <p> <span class="sum">{{ funds | currency }}</span> </p> 
                    <p class="sum-text">Available Funds</p>
                </div>
            </div>
            <input class="file" type="file" @change="onFileSelected" accept="image/*" >
            <button @click="logout" class="logout">Logout</button>

        </div>

            <div class=" card">
                    <p class="header">Terms & Conditions</p>
                    <p class="text">
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's 
                      standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make 
                      a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting,
                       remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing 
                       Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions
                        of Lorem Ipsum.
                    </p>

            </div>

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
    padding:23px 50px;
    margin:25px auto;
    line-height: 1.2rem;
}
.user {
    display:flex;
    align-items: center;
}
.funds {
    margin-left:200px;
    margin-top:30px;
}
.headline {
    text-align: center;
    font-size: 30px;
    margin: 30px;
}
.header {
    color:var(--primary-color);
    font-size: 25px;
    margin-bottom:10px;
    text-align: center;
    font-weight: 600;
}
span {
    margin-right:5px;
    font-size: 13px;
}
.email {
    margin-top:0;
    margin-left:-25px;
}
.logout {
    background:var(--primary-color);
    font-size: 0.85rem;
    padding:0.6rem 1.2rem;
    border-radius: 4px;
    display:block;
    margin:0px auto;
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
    /* border-bottom-right-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius); */
    border-radius: var(--border-radius);
    margin: 0px auto;
    margin-top:75px;
    text-align: justify;
    padding:25px;
    width: 900px;
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
}
.sum {
    font-size: 30px;
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
img {
   width: 150px;
   max-width: fit-content;
   display:inline-block;
   margin:-10px 0 -30px -35px;
}
input {
    font-size: 13px;
    width:55px;
    margin-bottom:45px;
    margin-left:15px;
}
</style>