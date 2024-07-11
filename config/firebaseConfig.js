// firebaseConfig.js
import { initializeApp } from "firebase/app";
import {
	getAuth,
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
} from "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyDnoPG3ys4L94xRDju8dGrq8yXx9-MZdhA",
	authDomain: "gquiz-2.firebaseapp.com",
	projectId: "gquiz-2",
	storageBucket: "gquiz-2.appspot.com",
	messagingSenderId: "843856922036",
	appId: "1:843856922036:web:d486d469ad938ebd2e9ee1",
	measurementId: "G-17LYR27V2F",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };
