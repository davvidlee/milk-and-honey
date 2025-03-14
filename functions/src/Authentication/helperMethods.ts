
/*
    This method checks if the there have been a change to the isVendor
    field assigned to a user
 */
import {Change} from "firebase-functions";
import {DocumentSnapshot} from "firebase-functions/lib/providers/firestore";
import {UserRecord} from "firebase-admin/lib/auth";
import validEmails from "./validEmails";
import {USERS_COLLECTION} from "../collection_constants";
import * as admin from "firebase-admin";
import {User} from "./index";
const db = admin.firestore()

export const shouldUpdateVendorRole = (change:Change<DocumentSnapshot>) => {
    const newData = change.after.data() as User|undefined
    const oldData = change.before.data() as User|undefined
    if (!newData || !oldData) return false
    if (newData.isVendor !== oldData.isVendor) return true
    return false
}

/*
    This method checks if the user has a valid email that would be accepted
    by the system.
 */
export const hasValidEmail = (user:UserRecord) => {
    if (!user.email) return false

    for (const domain of validEmails) {
        if (user.email.endsWith(domain)) return true
    }

    return false
}


/*
   This method checks and see if the account already exists.
 */
export const accountWithEmailAlreadyExists = async (email:string) => {
    const query = await db.collection(USERS_COLLECTION).where("email","==",email).get()
    if (query.docs.length == 0) return false
    return true
}


/*
    This method creates a default user collection entry associated with a specific user
 */
export const  createUserCollectionEntry = async (uid:string,email:string) => {
    return db
        .collection(USERS_COLLECTION)
        .doc(uid)
        .set({
            email,
            firstName:"",
            lastName:"",
            isVendor:false,
        } as User)
}

/*
    This method sets a custom user claim "vendor" depending upon the value
    of the isVendor field of the specified uid
     https://firebase.google.com/docs/auth/admin/custom-claims
 */
export const checkForAndUpdateVendorRole = async (uid:string) => {
    const userData = await db.doc(USERS_COLLECTION + "/" + uid).get()
    if (!userData.data()) return
    const {isVendor} = userData.data() as User
    await admin.auth().setCustomUserClaims(uid,{vendor:isVendor})
}


/*
    This method deletes a specified user
 */
export const deleteUser = (user:UserRecord) => {
    return admin.auth().deleteUser(user.uid)
}