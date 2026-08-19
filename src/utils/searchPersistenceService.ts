import { openDB, type IDBPDatabase } from "idb";

const dbPromise: Promise<IDBPDatabase<unknown>> = openDB("searchResultDB", 1, {
  upgrade(db: IDBPDatabase<unknown>) {
    if (!db.objectStoreNames.contains("searchResults")) {
      db.createObjectStore("searchResults", {
        keyPath: "id",
        autoIncrement: true
      });
    }
  }
});

export async function saveSearchResult(result: unknown) {
  const db = await dbPromise;
  const tx = db.transaction("searchResults", "readwrite");
  const store = tx.objectStore("searchResults");
  await store.add(result);
  await tx.done;
}

export async function getSearchResults() {
  const db = await dbPromise;
  const tx = db.transaction("searchResults", "readonly");
  const store = tx.objectStore("searchResults");
  const results = await store.getAll();
  await tx.done;
  return results[0];
}

export async function clearSearchResults() {
  const db = await dbPromise;
  const tx = db.transaction("searchResults", "readwrite");
  const store = tx.objectStore("searchResults");
  await store.clear();
  await tx.done;
}

export async function deleteDatabase() {
  const db = await dbPromise;
  await db.close();
  indexedDB.deleteDatabase("searchResultDB");
}
