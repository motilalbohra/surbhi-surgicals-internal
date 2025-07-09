import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD1q0BGu5gL5nVjZQrv-0LKuK099H4NGBk",
    authDomain: "surbhi-surgicals-internal.firebaseapp.com",
    databaseURL: "https://surbhi-surgicals-internal-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "surbhi-surgicals-internal",
    storageBucket: "surbhi-surgicals-internal.firebasestorage.app",
    messagingSenderId: "259208391448",
    appId: "1:259208391448:web:86e1e0925cf7e365068c6d",
    measurementId: "G-V85M8S804E",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
