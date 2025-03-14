import * as admin from "firebase-admin";
const db = admin.firestore()

/*
This method adds a given item to a specified collection.
if an id is specified, it overwrites that item. After a successful
input it returns a success 200 status code with a specified message
 */
export default async (id:string|undefined,collection:string,item:any,message:string) => {
    const hasId = id && (typeof id == "string")
    if (hasId) {
        await db.collection(collection).doc(id).set(item)
    }
    else {
        await db.collection(collection).doc().set(item)
    }
    return {status:"success",code:200,message}
}