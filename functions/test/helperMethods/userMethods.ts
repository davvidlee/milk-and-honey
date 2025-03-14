import * as admin from "firebase-admin"
import testEnv from "../testEnv";
import * as Auth from "../../src/Authentication"
import {USERS_COLLECTION} from "../../src/collection_constants";

export const createVendor = async (uid:string,email:string) => {
    return admin.auth().createUser({
        uid,
        email,
        emailVerified:true,
    }).then(async user => {
        await testEnv.wrap(Auth.onSignUp)(user)
        const before = testEnv.firestore.makeDocumentSnapshot({
            isVendor:false
        },USERS_COLLECTION + "/" + uid )
        const after = testEnv.firestore.makeDocumentSnapshot({
            isVendor:true
        }, USERS_COLLECTION + "/" + uid)
        const change = testEnv.makeChange(before,after)
        await admin.firestore().doc(USERS_COLLECTION + "/" + uid).update({
            isVendor:true
        })
        await testEnv.wrap(Auth.onUserCollectionUpdate)(change,{params:{docId:uid}})
        return user
    })
        .catch(error => {
            console.log(error)
        })
}