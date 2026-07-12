import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  serverTimestamp,
  DocumentData,
} from "firebase/firestore";
import { db } from "../config/firebase";

/**
 * Sync progress entry to Firestore
 * @param {string} userId - Current user ID
 * @param {Object} entry - Progress entry data
 * @returns {Promise<string>} Created document ID
 */
export const syncProgressToCloud = async (
  userId: string,
  entry: Record<string, any>,
) => {
  if (!userId || !entry) return null;

  try {
    const historyRef = collection(db, "users", userId, "history");
    const docRef = await addDoc(historyRef, {
      ...entry,
      userId,
      cloudTimestamp: serverTimestamp(),
      synced: true,
    });
    return docRef.id;
  } catch (error) {
    console.error("Error syncing to cloud:", error);
    return null;
  }
};

/**
 * Fetch progress history from Firestore
 * @param {string} userId - Current user ID
 * @param {number} maxEntries - Max entries to fetch
 * @returns {Promise<Array>} Array of progress entries
 */
export const fetchCloudHistory = async (
  userId: string,
  maxEntries: number = 50,
) => {
  if (!userId) return [];

  try {
    const historyRef = collection(db, "users", userId, "history");
    const q = query(
      historyRef,
      orderBy("timestamp", "desc"),
      limit(maxEntries),
    );

    const querySnapshot = await getDocs(q);
    const history: DocumentData[] = [];
    querySnapshot.forEach((doc) => {
      history.push({ id: doc.id, ...doc.data() });
    });
    return history;
  } catch (error) {
    console.error("Error fetching from cloud:", error);
    return [];
  }
};
