import testEnv from "./testEnv";
import * as auth from "../src/Authentication"
import * as admin from "firebase-admin"
import clearUsers from "./helperMethods/clearCollections";
import {USERS_COLLECTION} from "../src/collection_constants";
import {makeDocumentSnapshot} from "firebase-functions-test/lib/providers/firestore";
import deleteUsers from "./helperMethods/deleteUsers"

describe("onSignUp", () => {
    const uid = "123"

    beforeEach(async () => {
        await clearUsers()
        await deleteUsers()
    })

    it("should delete an account that doesn't have an email", async () => {
        const email = undefined
        const userRecord = await admin.auth().createUser({
            uid,
            email,
            emailVerified:false,
        })
        const wrap = testEnv.wrap(auth.onSignUp)
        await wrap(userRecord)
        const user = async () => {
            await admin.auth().getUser(uid)
        }
        await expect(user).rejects.toThrow()
    })

    it ("should delete an account that doesn't have a valid pomona email", async () => {
        const email = "sana2018@hotmail.com"
        const userRecord = await admin.auth().createUser({
            uid,
            email,
            emailVerified:false,
        })
        const wrap = testEnv.wrap(auth.onSignUp)
        await wrap(userRecord)
        const user = async () => {
            await admin.auth().getUser(uid)
        }
        await expect(user).rejects.toThrow()
    })

    it("should not delete an account with a valid pomona email" ,async () => {
        const email = "test1@mymail.pomona.edu"
        const userRecord = await admin.auth().createUser({
            uid,
            email,
            emailVerified:false,
        })
        const wrap = testEnv.wrap(auth.onSignUp)
        await wrap(userRecord)
        const user = await admin.auth().getUser(uid)
        expect(user).not.toBeNull()
    })

    it("should create a User Collection Object", async () => {
        const email = "test2@mymail.pomona.edu"
        const userRecord = await admin.auth().createUser({
            uid,
            email,
            emailVerified:false,
        })
        const wrap = testEnv.wrap(auth.onSignUp)
        await wrap(userRecord)
        const doc = await admin.firestore().doc(USERS_COLLECTION + "/" + uid).get()
        expect(doc.exists).toEqual(true)
    })

    it("should create a custom user claim", async () => {
        const email = "test3@mymail.pomona.edu"
        const userRecord = await admin.auth().createUser({
            uid,
            email,
            emailVerified:false,
        })
        const wrap = testEnv.wrap(auth.onSignUp)
        await wrap(userRecord)
        const user = await admin.auth().getUser(uid)
        expect(user.customClaims!.vendor).toEqual(false)
    })
})

describe("onUserCollectionUpdate", () => {
    const uid = '123'
    beforeEach(async () => {
        await deleteUsers()
        await clearUsers()
    })

    it("should have the correct user claim value on update", async () => {

        const user = await admin.auth().createUser({
            email:"test@mymail.pomona.edu",
            uid
        })

        await testEnv.wrap(auth.onSignUp)(user)
        const docRef = admin.firestore().doc(USERS_COLLECTION + "/" + uid)
        await docRef.update({
            isVendor:true
        })

        const wrap = testEnv.wrap(auth.onUserCollectionUpdate)
        const before = makeDocumentSnapshot({isVendor:false},USERS_COLLECTION + "/" + uid)
        const after = makeDocumentSnapshot({isVendor:true},USERS_COLLECTION + "/" + uid)
        await wrap(testEnv.makeChange(before,after),{params:{docId:uid}})
        const userRecord = await admin.auth().getUser(uid)
        expect(userRecord.customClaims!.vendor).toEqual(true)

    })
})