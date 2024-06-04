import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyA02br4OPcmbt9qtXTxZyKiKKOjh3ZYQlE",
  authDomain: "porter-clone-1c1bd.firebaseapp.com",
  projectId: "porter-clone-1c1bd",
  storageBucket: "porter-clone-1c1bd.appspot.com",
  messagingSenderId: "664828184713",
  appId: "1:664828184713:web:fef7f254c6597cd3d49e58",
  measurementId: "G-VZJFFHYREL",
};

const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp;
export const messaging = getMessaging(firebaseApp)
