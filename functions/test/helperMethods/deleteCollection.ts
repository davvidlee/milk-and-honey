import {firestore} from "firebase-admin";
import Firestore = firestore.Firestore;

// https://firebase.google.com/docs/firestore/manage-data/delete-data
// https://stackoverflow.com/questions/55734393/using-async-await-in-recursive-function-with-process-nexttick

export default async function deleteCollection(db:Firestore, collectionPath:string, batchSize:number) {
    const collectionRef = db.collection(collectionPath);
    const query = collectionRef.orderBy('__name__').limit(batchSize);

    return new Promise(async (resolve) => {
        return await deleteQueryBatch(db, query, resolve)
    });
}

async function deleteQueryBatch(db, query, resolve) {
    const snapshot = await query.get();

    const batchSize = snapshot.size;
    if (batchSize === 0) {
        // When there are no documents left, we are done
        resolve();
        return;
    }

    // Delete documents in a batch
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });
    await batch.commit();

    // Recurse on the next process tick, to avoid
    // exploding the stack.
    process.nextTick(() => {
        deleteQueryBatch(db, query, resolve);
    });
}