import {
  setPersistence,
  browserSessionPersistence,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { firebaseAuth } from './firebaseConfig';


export default firebaseAuth;

// Sign in with email and password
export async function signInWithCredentials(email: string, password: string) {
  try {
    return setPersistence(firebaseAuth, browserSessionPersistence).then(async () => {
      const userCredential = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password,
      );
      return {
        success: true,
        user: userCredential.user,
        error: null,
      };
    });
  } catch (error: any) {
    return {
      success: false,
      user: null,
      error: error.message || 'Failed to sign in with email/password',
    };
  }
}

// Sign out functionality
export const firebaseSignOut = async () => {
  try {
    await signOut(firebaseAuth);
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Auth state observer
export const onAuthStateChanged = (callback: (user: any) => void) => {
  return firebaseAuth.onAuthStateChanged(callback);
};

// Sign up with email and password
export async function signUpWithCredentials(email: string, password: string, username: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    await updateProfile(userCredential.user, { displayName: username });
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}