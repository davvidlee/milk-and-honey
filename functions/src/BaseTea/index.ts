import * as admin from "firebase-admin";
import * as functions from "firebase-functions"
import {getUserVendorStatus} from "../validateUser";
import createObject from "../MenuData/createObject";
import {BASE_TEAS_COLLECTION} from "../collection_constants";
import {isValidStringArray} from "../MenuData/helperMethods";
const db = admin.firestore()

export interface BaseTea {
   name:string;
   baseIngredientOptions:string[];
   imageUrl:string|null;
   toppingOptions:string[];
   sweetnessOptions:string[];
   iceOptions:string[];
   price:number;
   description:string;
}

/*
This method allows vendors to create base teas.
Keep in mind that all valid options per array must have a length
less than 20 for the tea to be created.
 */
export const createBaseTea = functions.https.onCall(async (data, context) => {
    const userIsVendorResponse = await getUserVendorStatus(context)
    if (userIsVendorResponse !== true) return userIsVendorResponse
    if (!isValidBaseTea(data)) return {
        status:"error",
        code:401,
        message:"Invalid base tea values"
    }

    const baseTea = {
        name:data.name as string,
        baseIngredientOptions: data.baseIngredientOptions as string[],
        imageUrl: data.imageUrl as string|null,
        toppingOptions: data.toppingOptions as string[],
        sweetnessOptions: data.sweetnessOptions as string[],
        iceOptions:data.iceOptions as string[],
        price:data.price as number,
        description: data.description as string,
    } as BaseTea

    return createObject(
        data.id,
        BASE_TEAS_COLLECTION,
        baseTea,
        "Base Tea created or updated successfully"
    )
})

/*
This method allows vendors to delete base teas.
the data object should contain an id property which matches the
id of the base tea you would like to delete
 */
export const deleteBaseTea = functions.https.onCall(async (data,context) => {
    const userIsVendorResponse = await getUserVendorStatus(context)
    if (userIsVendorResponse !== true) return userIsVendorResponse
    const hasValidTeaId = data.id && (typeof data.id == "string")
    if (!hasValidTeaId) return {
        status:"error",
        code:401,
        message:"" +
            "" +
            ""
    }
    await db.collection(BASE_TEAS_COLLECTION).doc(data.id).delete()
    return {status:"success",code:200,message:"base tea successfully deleted"}
})

const isValidBaseTea = (data:any) => {
    if (!data.hasOwnProperty("name")) return false
    if (!(typeof data.name == "string")) return false
    if (!data.hasOwnProperty("baseIngredientOptions")) return false
    if (!isValidStringArray(data.baseIngredientOptions)) return false
    if (!data.hasOwnProperty("imageUrl")) return false
    if (!data.imageUrl == null || !(typeof data.imageUrl == "string")) return false
    if (!data.hasOwnProperty("toppingOptions")) return false
    if (!isValidStringArray(data.toppingOptions)) return false
    if (!data.hasOwnProperty("sweetnessOptions")) return false
    if (!isValidStringArray(data.sweetnessOptions)) return false
    if (!data.hasOwnProperty("iceOptions")) return false
    if (!isValidStringArray(data.iceOptions)) return false
    if (!data.hasOwnProperty("price")) return false
    if (!(typeof data.price == "number")) return false
    if (!data.hasOwnProperty("description")) return false
    if (!(typeof data.description == "string")) return false
    return true

}

