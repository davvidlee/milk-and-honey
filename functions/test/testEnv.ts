// @ts-ignore
import testFunctions from "firebase-functions-test";
import * as admin from "firebase-admin";

/*
IMPORTANT!: Make sure you rename the key as
service-account-credentials.json to ensure not only the code works
but also, so you don't accidentally commit it to
the code
 */

export default testFunctions({
    projectId: "milk-honey-order",
},"./service-account-credentials.json")

admin.initializeApp()