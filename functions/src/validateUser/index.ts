import {CallableContext} from "firebase-functions/lib/common/providers/https";
import * as admin from "firebase-admin";


export const isValidUser = async (context:CallableContext) => {
    if (!context.auth) return {status:"error", code:401, message:"Not logged in"}
    if (!context.auth.uid) return {status:"error", code:401,message:"Invalid User ID"}
    const user = await admin.auth().getUser(context.auth!.uid)
    // remove verification
    // if (!user.emailVerified) return {status:"error", code:401,message:"User does not have a verified email"}
    return true
}

export const getUserVendorStatus = async (context:CallableContext) => {
    const userContext = await isValidUser(context)
    if (userContext !== true) return userContext
    const user = await admin.auth().getUser(context.auth!.uid)
    if (user.customClaims && user.customClaims.vendor) return true
    return {status:"error",code:401,message:"User is not authorized"}
}