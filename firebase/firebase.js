import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore} from 'firebase/firestore'
const firebaseConfig = {
    apiKey: "AIzaSyAjD5hGcTkSlziuJgXqyd30XcU9N4dwp7Q",
    authDomain: "fir-todo-25940.firebaseapp.com",
    projectId: "fir-todo-25940",
    storageBucket: "fir-todo-25940.appspot.com",
    messagingSenderId: "437466467345",
    appId: "1:437466467345:web:8a9bd7efbf098d460535b0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);