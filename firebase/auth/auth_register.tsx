// auth_register.tsx

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

export const signUp = async (
  fullName: string,
  username: string,
  email: string,
  password: string
) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Update display name in Firebase Auth
  await updateProfile(user, {
    displayName: fullName,
  });

  // Save structured user document to Firestore
  await setDoc(doc(db, 'users', user.uid), {
    fullName: fullName, // changed from fullName
    username: username,
    email: email,
    createdAt: serverTimestamp(), // Firestore server timestamp
    updatedAt: serverTimestamp(), // Same at creation
  });
};

//index.tsx 
export async function signIn(email: string, password: string): Promise<{ fullName: string }> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch user document from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      throw new Error('User data not found');
    }

    const userData = userDoc.data();
    console.log('User signed in:', userData);
    return { fullName: userData?.fullName || 'User' };
  } catch (error: any) {
    console.error('Sign-in error:', error.code, error.message);
    throw error; // Re-throw so you can catch it in the screen
  }
}
