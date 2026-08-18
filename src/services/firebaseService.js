import {
    auth,
    googleProvider,
    signInWithPopup,
    onAuthStateChanged,
    getDoc,
    setDoc,
    deleteDoc,
    onSnapshot,
    getCollectionRef,
    getDocRef,
    setPersistence,
    browserLocalPersistence,
    handleFirestoreError,
    db
} from '../firebase';
import { signOut } from 'firebase/auth';
import { writeBatch } from 'firebase/firestore';

export {
    auth,
    googleProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    getDoc,
    setDoc,
    deleteDoc,
    onSnapshot,
    getCollectionRef,
    getDocRef,
    setPersistence,
    browserLocalPersistence,
    handleFirestoreError,
    writeBatch,
    db
};
