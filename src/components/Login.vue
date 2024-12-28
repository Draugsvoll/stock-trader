<template>
    <div class="outer-container">
        <div ref="overlay" class="overlay"></div>
        
        <div class="intro">
            <h1 class="headline">Stocktrader-X</h1>
            <p class="sub-header">A better way to trade stocks.</p>

        </div>

        <div class="card-container">
            <div class="card left">
                <p class="card-title">
                    Create Account
                </p>
                <i class="fas fa-user-circle logo"></i>
                <ul>
                    <li>Create Account</li>
                    <li>Trade stocks </li>
                    <li>Track personal portfolio </li>
                </ul>
                <button @click="openSignup()" class="signup">Sign Up</button>
            </div>

            <div class="card right">
                <p class="card-title">
                    Guest User
                </p>
                <i class="fas fa-user-secret logo"></i>
                <ul>
                    <li>No registration needed</li>
                    <li>Pre-defined portfolio</li>
                    <li>Trade stocks instantly</li>
                </ul>
                <button class="login" @click="loginAsTest()">Login</button>
            </div>

        </div>

        <a class="text" @click="openLogin()">I have an account</a>

        <!-- LOGIN FORM -->
        <div ref="form" class="form">
            <p v-if="newUser == true"  class="form-title">Sign Up</p>
            <p v-else class="form-title">Login</p>
            <input ref="email" class="form-" v-model="email" type="text" name="username" placeholder="Email" autofocus required>
            <input v-model="password" type="password" name="password" placeholder="Password" required>
            <div class="btn">
                <button v-if="newUser == true"  @click="signUp">Sign Up</button>
                <button v-else  @click="login">Login</button>
            </div>
            <p class="close" @click="closeForm()">Back</p>
        </div>

    <!-- container -->
    </div>
    
</template>


<script>
import firebase from 'firebase'
require('firebase/auth')
export default {
    name: 'Login',
    data () {
        return {
            newUser: false,
            email: '',
            password: '',
        }
    },
    methods: {
        loginAsTest () {
            firebase.auth().signInWithEmailAndPassword('test_user@gmail.com', 'pass123')
                .then( resp => {
                    // console.log(resp)
                    window.location.href = `/portfolio`
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
                    window.location.href = `/portfolio`
                })
                .catch( err => {
                    alert('Wrong username/password' + err)
                })
        },
        openLogin() {
            this.newUser = false
            this.$refs.form.style.display = 'block'
            this.$refs.overlay.style.display = 'block'
            this.$refs.email.focus()
        },
        openSignup() {
            this.newUser = true
            this.$refs.form.style.display = 'block'
            this.$refs.overlay.style.display = 'block'
            this.$refs.email.focus()
        },
        closeForm() {
            this.$refs.form.style.display = 'none'
            this.$refs.overlay.style.display = 'none'
        },
    },
    created () {
        // window.location.replace("http://www.w3schools.com")
    }
}
</script>


<style scoped>

a {
    transition:0.25s;
}
.overlay {
    position:absolute;
    width:100vw;
    max-width:100%;
    height:100vh;
    background:rgba(0,0,0,0.6);
    padding:0;
    margin:0;
    top:0;
    bottom:0;
    left:0;
    right:0;
    display:none;
}
.outer-container {
    padding-top:50px;
}
.intro {
    width:fit-content;
    margin:0 auto;
}
.headline {
    color:var(--primary-color);
    font-weight: 400;
    font-size: 25px;
    letter-spacing: 1px;
    text-align: center;
    margin:5px auto;
}
.sub-header{
    font-size: 28px;
    margin:0;
    margin-top:15px;
    font-weight: 100;
}
.text {
    display:block;
    font-size: 17px;
    text-align: center;
    margin:0 auto;
    letter-spacing: 0.05rem;
    color:var(--primary-color);
}
.text:hover {
    /* color:var(--primary-color-hover); */
    color:white;
}
.card-container {
    display:flex;
    justify-content:space-between;
    width:900px;
    margin:50px auto;
}
.card{
    width:400px;
    background:var(--background-light);
    border-top-right-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);
    padding:25px;
    letter-spacing: 1px;
    transition:0.35s;
    border-left:2px solid var(--primary-color);
}
.card:hover {
    background:var(--background-light-hover);
}
.card-title {
    text-align: center;
    font-size: 17px;
    font-weight: 400;
    margin:0;
}
ul {
    width:230px;
    margin:25px auto;    
}
li {
    margin:0.55rem auto;
    font-size: 0.85rem;
}
.logo {
    color:rgb(199, 225, 231);
    font-size: 70px;
    margin:15px auto;
    margin-bottom:0;
    width:100%;
    text-align: center;
    cursor:text;
}
.container {
    position:absolute;
    padding:0;
    position: absolute;
    background-size: cover;
    z-index: 9;
}
.form {
    position:absolute;
    top:0;
    bottom:0;
    left: 0; 
    right: 0; 
    margin:auto;
    width: fit-content;
    height:fit-content;

    padding:45px 65px;
    display: flex;
    flex-direction: column;
    background: var(--background-grey);
    border-left:2px solid var(--primary-color);
    border-radius: var(--border-radius);

    display: none;
}
.form-title {
    text-align: center;
    font-size: 24px;
    margin-top:0;
    color: var(--primary-color);
}
.close {
    font-size: 10px;
    font-weight:lighter;
    text-align: center;
    margin-top:15px;
    margin-bottom:0px;
    cursor:pointer;
    color:var(--primary-color);
    text-decoration: underline;
}
.close:hover {
    color:white;
}
.btn {
    margin-top:30px;
    margin-bottom:10px;
    display:flex;
    justify-content:space-between;
}
.btn button {
    margin:0 auto;
}

input {
    margin: 1rem 0;
    padding:0.5rem;
    width:260px;
    border:none;
    border-bottom:1px solid var(--background-light-hover);
    font-size:0.85rem;
    border-radius:3px;
    background:var(--background-light-hover);
    display:block;
}
::placeholder {
    font-style: italic;
    color:rgba(172, 172, 172, 0.735);
    padding-left:1px;
}
button {
    display:block;
    margin:0 auto;
    background-color: var(--primary-color);
    border:none;
    font-size: 0.75rem;
    padding:0.6rem 1.2rem;
    border-radius: 4px;
    color:white;
    cursor:pointer;
    transition: 0.2s;
    width:115px;
    letter-spacing: 0.06rem;
    font-weight: 600;
}
.signup {
    background:rgba(0,0,0,0);
    border:2px solid var(--primary-color);
}
.signup:hover {
    background:var(--primary-color);
}
.login:hover {
    background:rgba(0,0,0,0);
    border:2px solid var(--primary-color);
}
.login {
    border:2px solid rgba(0,0,0,0);
}
@media screen and (min-height: 1050px) {
    .outer-container {
        padding-top:16vh;
    }
}
</style>