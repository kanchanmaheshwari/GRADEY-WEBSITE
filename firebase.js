import { sendPasswordResetEmail, signOut } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyB071Z3Mt0x04gzrF9HrGzQhySvUpPT4Wk",
  authDomain: "wit-gradey-web.firebaseapp.com",
  databaseURL: "https://wit-gradey-web-default-rtdb.firebaseio.com",
  projectId: "wit-gradey-web",
  storageBucket: "wit-gradey-web.appspot.com",
  messagingSenderId: "332956740852",
  appId: "1:332956740852:web:b6629420fdb289ea64c2a1",
  measurementId: "G-214P1JSLDF"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
const auth = firebase.auth()
const ref = firebase.database().ref('users')



export { auth, ref, sendPasswordResetEmail, signOut }