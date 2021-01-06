// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from 'firebase'

import 'firebase/firebase-database'

const firebaseConfig = {
    apiKey: "AIzaSyAuJGJmPc1BmhXqnSXChYWeswfwRUSqdqU",
    authDomain: "ove-stock-trader.firebaseapp.com",
    databaseURL: "https://ove-stock-trader.firebaseio.com",
    projectId: "ove-stock-trader",
    storageBucket: "ove-stock-trader.appspot.com",
    messagingSenderId: "558247390632",
    appId: "1:558247390632:web:1919b1da48d8f7b081c19d",
    measurementId: "G-WR34C1LTN0"
};

const app = firebase.initializeApp(firebaseConfig)
export const database = firebase.database()
