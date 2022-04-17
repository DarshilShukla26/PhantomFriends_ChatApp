
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
    addDoc,
    collection,
    getFirestore,
    getDocs,
    serverTimestamp,
    doc,
    setDoc,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDvriiQ5TYy89DIPTalPA2rlYE6-yKNXgc",
    authDomain: "sgp-grp5-2.firebaseapp.com",
    projectId: "sgp-grp5-2",
    storageBucket: "sgp-grp5-2.appspot.com",
    messagingSenderId: "589926297307",
    appId: "1:589926297307:web:6ab8b1891141eb328966fe"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export const db = getFirestore(app);

const usersCollectionRef = collection(db, "users");

export const SignInWithGoogle = async () => {
    const userCred = await signInWithPopup(auth, provider);

    const registeredUsers = [];
    const data = await getDocs(usersCollectionRef);
    data.docs.map((user) => {
        registeredUsers.push(user.data().user);
    });
    if (registeredUsers.includes(auth.currentUser.email)) {
    } else {
        const specificUserDoc = doc(db, "users", userCred?.user?.uid);
        await setDoc(specificUserDoc, {
            user: auth.currentUser.email,
            timestamp: serverTimestamp(),
            avatar: "",
        });
    }
};

export const storage = getStorage(app);
