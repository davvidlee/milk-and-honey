import * as functions from "firebase-functions";
import * as admin from "firebase-admin"
admin.initializeApp()
import * as auth from  "./Authentication"

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", {structuredData: true});
    response.send("Hello from Firebase!");
});


// Auth Functions
export const onUserCollectionUpdate = auth.onUserCollectionUpdate
export const onSignUp = auth.onSignUp