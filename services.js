const firebase = require('firebase/app')
require('firebase/firestore')
require('firebase/auth')
let admin = require('firebase-admin')
/*
const firebaseConfig = {
    apiKey: "AIzaSyASRYiYTYnugzvvbKGmhUw10W4qufTO1_A",
    authDomain: "thingz-admin-api.firebaseapp.com",
    projectId: "thingz-admin-api",
    storageBucket: "thingz-admin-api.appspot.com",
    messagingSenderId: "771581750979",
    appId: "1:771581750979:web:11802bcf7272dfd6d67c76",
    measurementId: "G-VR4P5RW4J3"
};*/

const firebaseConfig = {
    apiKey: "AIzaSyBg0tQOG9npwEBgE_RfqLH1gn1sVM9sjCw",
    authDomain: "thingz-cloud.firebaseapp.com",
    projectId: "thingz-cloud",
    storageBucket: "thingz-cloud.appspot.com",
    messagingSenderId: "353134762639",
    appId: "1:353134762639:web:b954adbebf8827ff59aefa"
};

firebase.initializeApp(firebaseConfig)

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
})
  
const auth = firebase.auth
const firestore = firebase.firestore()

module.exports = {
    admin,
    auth,
    firestore
}