<template>
    <div class="outer-container">
        <!-- <h1 class="headline">Register / Login</h1> -->
            <div class="img">
                <img src="../assets/logo4.png" alt="" width="270">
            </div>
            <div class="form">
                <input v-model="email" type="text" name="username" placeholder="Email" autofocus required>
                <input v-model="password" type="password" name="password" placeholder="Password" required>
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
                    // console.log(resp)
                    window.location.href = `/`
                })
                .catch( err => {
                    alert('Wrong username/password' + err)
                })
        },
        signUp () {
            firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
                .then(response => {
                    // console.log(response)
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
                    // console.log(resp)
                    window.location.href = `/`
                })
                .catch( err => {
                    alert('Wrong username/password' + err)
                })
        }
    },
    created () {
        // window.location.replace("http://www.w3schools.com")
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
.test {
    padding:4px;
}
.headline {
    text-align: center;
    font-weight: 400;
    font-size: 26px;
}
.outer-container {
    padding-top:90px;
}
.container {
    position:absolute;
    padding:0;
    position: absolute;
    background-size: cover;
    z-index: 9;
}
.testuser {
    font-size: 12px;
}
.test {
    background:rgba(0,0,0,0);
    border:none;
    outline:none;
    color: rgb(10, 65, 83);
    cursor:pointer;
    text-decoration: underline;
    font-size: 12px;
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
.btn {
    margin-top:5px;
}
img {
    margin-left: -85px;
    margin-bottom: -25px;
}
input {
    margin: 0.5rem 0;
    padding:0.5rem;
    border:#17232f 1px solid;
    width:260px;
    font-size:0.85rem;
    border-radius:3px;
}
::placeholder {
    font-style: italic;
}
button {
    margin:auto;
    background-color: #233850;
    border:none;
    font-size: 0.85rem;
    padding:0.6rem 1.2rem;
    border-radius: 4px;
    color:white;
    cursor:pointer;
    margin-right:5px;
}

</style>