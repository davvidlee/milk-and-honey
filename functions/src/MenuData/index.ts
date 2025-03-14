import * as functions from "firebase-functions"
import * as admin from "firebase-admin"
import {INGREDIENTS_COLLECTION} from "../collection_constants";
import {getUserVendorStatus} from "../validateUser";
import createObject from "./createObject";

/*

https://stackoverflow.com/questions/51066434/firebase-cloud-functions-difference-between-onrequest-and-oncall

 */

const db = admin.firestore()
export type IngredientType = "Syrup" | "Base" | "Topping"
export interface Ingredient  {
    name:string;
    type: IngredientType;
    description:string;
    imageUrl:string;
    isAvailable:boolean;
    price:number;
}


/*
    This method takes a request and allows vendors to create ingredients
    and has as variety of checks to prevent unintended usage. It takes
    an Ingredient plus an optional id. If id is specified then it will simply
    update the doc in question.
 */
export const createIngredient = functions.https.onCall(async (data,context) => {
    const userContext = await getUserVendorStatus(context)
    if (userContext !== true) return userContext
    if (!hasValidData(data)) return {status:"error",code:401,message:"Invalid ingredient data"}
    const ingredient = {
        name:data.name! as string,
        type:data.type! as IngredientType,
        description:data.description! as string,
        imageUrl:data.imageUrl! as string,
        isAvailable:data.isAvailable! as boolean,
        price:data.price! as number
    } as Ingredient

    return createObject(
        data.id,
        INGREDIENTS_COLLECTION,
        ingredient,
        "Ingredient created"
    )
})

/*
This method deletes an ingredient with the specified id
 */
export const deleteIngredient = functions.https.onCall(async (data,context) => {
    const userIsVendor = await getUserVendorStatus(context)
    if (userIsVendor !== true) return userIsVendor
    if (!data.hasOwnProperty("ingredientId")) return {status:"error",code:401,message:"Invalid ingredient id"}
    if (!(typeof data.ingredientId == "string")) return {status:"error",code:401,message:"Invalid ingredient id"}
    await db.collection(INGREDIENTS_COLLECTION).doc(data.ingredientId).delete()
    return {status:"success",code:200,message:"Ingredient deleted"}
})

const hasValidData = (data:any) => {
    if (!data.hasOwnProperty("name")) return false
    if (!(typeof data.name == "string")) return false
    if (!data.hasOwnProperty("type")) return false
    if (["Syrup","Base","Topping"].find(x => x == data.type) == null) return false
    if (!data.hasOwnProperty("description")) return false
    if (!(typeof data.description == "string")) return false
    if (!data.hasOwnProperty("imageUrl")) return false
    if (!(typeof data.imageUrl == "string")) return false
    if (!data.hasOwnProperty("isAvailable")) return false
    if (!(typeof data.isAvailable == "boolean")) return false
    if (!data.hasOwnProperty("price")) return false
    if (!(typeof data.price == "number")) return false
    return true
}



