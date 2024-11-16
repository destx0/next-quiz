import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
let firebase_app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const storage = getStorage(firebase_app);

export const auth = getAuth(firebase_app);
export const db = getFirestore(firebase_app);
export const uploadImageToFirebase = async (file) => {
  const storageRef = ref(storage, `modified_images/${file.name}`);
  await uploadBytes(storageRef, file);

  // Construct the URL in the desired format
  const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET; // e.g., gquiz-2.appspot.com
  const imagePath = `modified_images/${file.name}`;
  const url = `https://storage.googleapis.com/${bucketName}/${imagePath}`;

  return url;
};
export default firebase_app;
