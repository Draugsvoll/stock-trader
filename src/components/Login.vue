<template>
    <div class="outer-container">
        <div class="container">
        </div>
        <div class="container overlay">
        <!-- <div class="logo"></div> -->
        <!-- <img src="../../assets/logo2.png" alt="" width="250"> -->
            <div class="form">
                <span>Username:</span>
                <input v-model="email" type="text" name="username" placeholder="Username">
                <br>
                <br>
                <br>
                <span>Password:</span>
                <input v-model="password" type="text" name="password" placeholder="Password">
                <div class="btn">
                    <button @click="login">Login</button>
                    <button @click="signUp  ">Sign Up</button>
                </div>
                <br>
                <br>
                <div> 
                    Continue as
                    <button class="test" @click="loginAsTest">Test User</button>
                </div>
            </div>
        </div>
    </div>
    
</template>


<script>
import firebase from 'firebase'
require('firebase/auth')
export default {
    name: 'Login',
    data () {
        return {
            email: '',
            password: '',
        }
    },
    methods: {
        loginAsTest () {
            firebase.auth().signInWithEmailAndPassword('test_user@gmail.com', 'pass123')
                .then( resp => {
                    console.log(resp)
                    window.location.href = `/about`
                })
                .catch( err => {
                    alert('Wrong username/password' + err)
                })
        },
        signUp () {
            console.log('her')
            firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
                .then(response => {
                    console.log(response)
                    window.location.href = `/about`
                })
                .catch(function(error) {
                // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
            });
        },
        login () {
            console.log('her')
            firebase.auth().signInWithEmailAndPassword(this.email, this.password)
                .then( resp => {
                    console.log(resp)
                    window.location.href = `/about`
                })
                .catch( err => {
                    alert('Wrong username/password' + err)
                })
        }
    }
}
</script>


<style scoped>
/* .logo {
    background-image: url('../../assets/logo.png');
} */
.outer-container {
    position:relative;
}
.container {
    padding:0;
    height:500px;
    width:500px;
    position: absolute;
    background-size: cover;
    z-index: 9;
}
.form {
    background:rgba(0,0,0,0.85);
}
.overlay {
    background:rgba(0, 3, 16, 0.1);
}
.test {
    background:rgba(0,0,0,0);
    border:none;
    outline:none;
    color: lightblue;
    cursor:pointer;
    text-decoration: underline;
}
.btn {
}
.form {
    padding:4rem 6rem;
    margin:0 auto;
    display: flex;
    flex-direction: column;
}
img {
    margin:0 auto;
}
input {
    margin: 0.5rem 0;
}
button {
    margin:auto;
}
</style>