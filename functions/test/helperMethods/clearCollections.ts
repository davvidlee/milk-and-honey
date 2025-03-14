import * as admin from "firebase-admin"
import {BASE_TEAS_COLLECTION, INGREDIENTS_COLLECTION, USERS_COLLECTION} from "../../src/collection_constants";
import deleteCollection from "./deleteCollection";

export default async () => {
    await deleteCollection(admin.firestore(),USERS_COLLECTION,100)
    await deleteCollection(admin.firestore(),INGREDIENTS_COLLECTION,100)
    await deleteCollection(admin.firestore(),BASE_TEAS_COLLECTION,100)
}


