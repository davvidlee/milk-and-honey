import {Ingredient} from "../../src/MenuData";
import testEnv from "../testEnv";
import {createVendor} from "./userMethods";
import * as admin from "firebase-admin";
import * as MenuData from "../../src/MenuData"
import {INGREDIENTS_COLLECTION} from "../../src/collection_constants";


export const createIngredient = async (id:string,uid:string) => {
    const data = {
        id,
        name:"Tea",
        type:"Syrup",
        description:"This is a test item",
        imageUrl:"test.png",
        isAvailable:true,
        price:2.5
    } as Ingredient
    await createVendor(uid,'test@mymail.pomona.edu')
    const wrap = testEnv.wrap(MenuData.createIngredient)
    await wrap(data,{auth:{uid}})
    return await admin.firestore().collection(INGREDIENTS_COLLECTION).doc("test").get()
}





