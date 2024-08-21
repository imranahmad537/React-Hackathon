// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import  {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBvJAqEPfnGeAmOiNRdLpno2bxi9Cq7DfA",
  authDomain: "react-login-b50bf.firebaseapp.com",
  projectId: "react-login-b50bf",
  storageBucket: "react-login-b50bf.appspot.com",
  messagingSenderId: "40213955482",
  appId: "1:40213955482:web:470574d2c4f862f7ebf023"
  // apiKey: "AIzaSyATH5uEyFJw2suA7_aVKlr9fnqQrMDOnk0",
  // authDomain: "attendance-1bb09.firebaseapp.com",
  // databaseURL: "https://attendance-1bb09-default-rtdb.firebaseio.com",
  // projectId: "attendance-1bb09",
  // storageBucket: "attendance-1bb09.appspot.com",
  // messagingSenderId: "389029666686",
  // appId: "1:389029666686:web:f6cfafdfa2ca3d61ca5d2f",
  // measurementId: "G-FGZT16TK26"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth();

//initialize firestore database
export const database = getFirestore(app);
export default app;





// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";

// import { getAnalytics } from "firebase/analytics";
// import { getAuth } from "firebase/auth";


// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// export const firebaseConfig = {
//   apiKey: "AIzaSyATH5uEyFJw2suA7_aVKlr9fnqQrMDOnk0",
//   authDomain: "attendance-1bb09.firebaseapp.com",
//   projectId: "attendance-1bb09",
//   storageBucket: "attendance-1bb09.appspot.com",
//   messagingSenderId: "389029666686",
//   appId: "1:389029666686:web:f6cfafdfa2ca3d61ca5d2f",
//   measurementId: "G-FGZT16TK26"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// // Initialize Firebase Authentication and get a reference to the service
// export const auth = getAuth();
// export default app;

