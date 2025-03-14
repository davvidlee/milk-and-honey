import * as admin from "firebase-admin";

export default async () => {
    const users = await admin.auth().listUsers()
    try {
        await admin.auth().deleteUsers(users.users.map(user => user.uid))
    }

    catch(err) {
        console.log(err)
    }

}
