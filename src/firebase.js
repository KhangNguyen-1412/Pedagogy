import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import {
    getFirestore,
    collection,
    doc,
    getDocs,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    writeBatch,
    addDoc,
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAeQyzP5bLnm9hRxK2D7sjEroG4RQlDwPk",
    authDomain: "pedagogy-2233f.firebaseapp.com",
    projectId: "pedagogy-2233f",
    storageBucket: "pedagogy-2233f.firebasestorage.app",
    messagingSenderId: "48328728202",
    appId: "1:48328728202:web:328eb9207249ca5d8dd773",
    measurementId: "G-X0C8TC6D9X"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

const appId = 'pedagogy-app-v1';
export const getCollectionRef = (userId, colName) => collection(db, 'artifacts', appId, 'users', userId, colName);
export const getDocRef = (userId, colName, docId) => doc(db, 'artifacts', appId, 'users', userId, colName, docId);
export { signInAnonymously, onAuthStateChanged, getDoc, setDoc, updateDoc, addDoc, deleteDoc, onSnapshot, collection, doc };

// ─── Collection names ───────────────────────────────────────────────────────
export const COLLECTIONS = {
    SCHEDULES: "schedules",
    EXAMS: "exams",
    COURSES: "courses",
    SYLLABI: "syllabi",
    LEARNER_PROGRESS: "learnerProgress",
};

function handleFirestoreError(context, err) {
    if (err?.code === 'permission-denied') {
        console.warn(
            `[Firestore Permission Warning] ${context}: Truy cập bị từ chối do Rules của Firebase chưa cho phép đọc/ghi. ` +
            `Vui lòng vào Firebase Console -> Firestore Database -> Rules và đổi thành: allow read, write: if true;`
        );
    } else {
        console.error(`[Firestore Error] ${context}:`, err);
    }
}

/** Fetch all documents from a collection and return as array with id field. */
export async function fetchCollection(collectionName) {
    try {
        const snap = await getDocs(collection(db, collectionName));
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (err) {
        handleFirestoreError(`fetchCollection(${collectionName})`, err);
        return [];
    }
}

/** Save a single document (upsert) using the item's `id` as document id. */
export async function saveDocument(collectionName, item) {
    try {
        const { id, ...data } = item;
        await setDoc(doc(db, collectionName, String(id)), data);
    } catch (err) {
        handleFirestoreError(`saveDocument(${collectionName})`, err);
    }
}

/** Delete a single document by id. */
export async function deleteDocument(collectionName, id) {
    try {
        await deleteDoc(doc(db, collectionName, String(id)));
    } catch (err) {
        handleFirestoreError(`deleteDocument(${collectionName})`, err);
    }
}

/** Subscribe to a collection in real-time. Returns unsubscribe function. */
export function subscribeCollection(collectionName, callback) {
    return onSnapshot(
        collection(db, collectionName),
        (snap) => {
            const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            callback(data);
        },
        (err) => {
            handleFirestoreError(`subscribeCollection(${collectionName})`, err);
        }
    );
}

/** Batch-write an entire array (replaces the old approach of saving per item). */
export async function batchSaveCollection(collectionName, items) {
    try {
        const batch = writeBatch(db);
        items.forEach((item) => {
            const { id, ...data } = item;
            batch.set(doc(db, collectionName, String(id)), data);
        });
        await batch.commit();
    } catch (err) {
        handleFirestoreError(`batchSaveCollection(${collectionName})`, err);
    }
}

// ─── Learner Progress helpers ────────────────────────────────────────────────

/** Save progress for one course. */
export async function saveLearnerProgress(courseId, progressData) {
    try {
        await setDoc(doc(db, COLLECTIONS.LEARNER_PROGRESS, String(courseId)), progressData);
    } catch (err) {
        handleFirestoreError(`saveLearnerProgress(${courseId})`, err);
    }
}

/** Fetch all learner progress and return as { courseId: progressData } map. */
export async function fetchLearnerProgress() {
    try {
        const snap = await getDocs(collection(db, COLLECTIONS.LEARNER_PROGRESS));
        const result = {};
        snap.docs.forEach((d) => {
            result[d.id] = d.data();
        });
        return result;
    } catch (err) {
        handleFirestoreError("fetchLearnerProgress", err);
        return {};
    }
}

/** Subscribe to learner progress in real-time. */
export function subscribeLearnerProgress(callback) {
    return onSnapshot(
        collection(db, COLLECTIONS.LEARNER_PROGRESS),
        (snap) => {
            const result = {};
            snap.docs.forEach((d) => {
                result[d.id] = d.data();
            });
            callback(result);
        },
        (err) => {
            handleFirestoreError("subscribeLearnerProgress", err);
        }
    );
}

// ─── Syllabus helpers ────────────────────────────────────────────────────────

export async function saveSyllabus(courseId, syllabusData) {
    try {
        await setDoc(doc(db, COLLECTIONS.SYLLABI, String(courseId)), syllabusData);
    } catch (err) {
        handleFirestoreError(`saveSyllabus(${courseId})`, err);
    }
}

export async function fetchSyllabi() {
    try {
        const snap = await getDocs(collection(db, COLLECTIONS.SYLLABI));
        const result = {};
        snap.docs.forEach((d) => {
            result[d.id] = d.data();
        });
        return result;
    } catch (err) {
        handleFirestoreError("fetchSyllabi", err);
        return {};
    }
}
