import * as functions from "firebase-functions"
import {USERS_COLLECTION} from "../collection_constants";
import {
    accountWithEmailAlreadyExists,
    checkForAndUpdateVendorRole,
    createUserCollectionEntry,
    deleteUser,
    hasValidEmail,
    shouldUpdateVendorRole,
    } from "./helperMethods";


export interface User {
    email:string;
    firstName:string;
    lastName:string;
    isVendor:boolean;
}

/*
   This method runs when a user first signs up and runs a series of checks such as if
   the account email is valid or if they are an admin user
 */
export const onSignUp = functions.auth.user().onCreate(async (user) => {
    if (!hasValidEmail(user)) return deleteUser(user)
    if (await accountWithEmailAlreadyExists(user.email!)) return deleteUser(user)
    await createUserCollectionEntry(user.uid,user.email!)
    await checkForAndUpdateVendorRole(user.uid)
})


/*
    Source: https://firebase.google.com/docs/functions/firestore-events
    This method runs on every change to the userCollection and executes
    a series of events
 */
export const onUserCollectionUpdate = functions.firestore
    .document(USERS_COLLECTION + "/{docId}")
    .onWrite(async (change,context) => {
        if (shouldUpdateVendorRole(change)) {
            await checkForAndUpdateVendorRole(context.params.docId)
        }
    })

