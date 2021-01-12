<template>
    <div class="outer-container">
            <div class="img">
                <img src="../assets/logo3.png" alt="" width="60">
            </div>
            <div class="form">
                <input v-model="email" type="text" name="username" placeholder="Email" autofocus >
                <input v-model="password" type="password" name="password" placeholder="Password">
                <div class="btn">
                    <button @click="login">Login</button>
                    <button @click="signUp  ">Sign Up</button>
                </div>
                <div> 
                    <p class="testuser">Continue as<button class="test" @click="loginAsTest">Test User</button></p> 
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
                    window.location.href = `/`
                })
                .catch( err => {
                    alert('Wrong username/password' + err)
                })
        },
        signUp () {
            firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
                .then(response => {
                    console.log(response)
                    window.location.href = `/`
                })
                .catch(function(error) {
                    alert('Invalid username/password format')
              var errorCode = error.code;
              var errorMessage = error.message;
            });
        },
        login () {
            firebase.auth().signInWithEmailAndPassword(this.email, this.password)
                .then( resp => {
                    console.log(resp)
                    window.location.href = `/`
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
* {
    /* border:1px solid black; */
}
.testuser{
    color:black;
}
.outer-container {
    padding-top:70px;
}
.container {
    position:absolute;
    padding:0;
    position: absolute;
    background-size: cover;
    z-index: 9;
}
.testuser {
    font-size: 0.7rem;
}
.test {
    background:rgba(0,0,0,0);
    border:none;
    outline:none;
    color: lightblue;
    cursor:pointer;
    text-decoration: underline;
    font-size: 0.65rem;
}
.form {
    padding:4rem 6rem;
    width:250px;
    margin:0 auto;
    display: flex;
    flex-direction: column;
    background: rgba(0,0,0,0);
}
.img {
    margin:auto;
    width:60px;
    margin-bottom:-30px;
}
img {
    margin:0 auto;
}
input {
    margin: 0.5rem 0;
    padding:0.3rem;
    width:250px;
    font-size:0.75rem;
}
button {
    margin:auto;
    background-color: #1f2c3a;
    border:none;
    font-size: 0.7rem;
    padding:0.5rem;
    color:white;
    cursor:pointer;
    margin-right:5px;
}
</style>