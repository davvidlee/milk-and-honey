import {createVendor} from "./userMethods";
import testEnv from "../testEnv";
import * as MenuData from "../../src/MenuData";
import * as admin from "firebase-admin";
import {BASE_TEAS_COLLECTION} from "../../src/collection_constants";


export const createBaseTea = async (id:string,uid:string) => {
    const data = {
        name:"Tea",
        id:"test",
        baseIngredientOptions:["1"],
        imageUrl:"image",
        toppingOptions:["2"],
        sweetnessOptions:[],
        iceOptions:['4'],
        price:2.5,
        description:"A tea"
    }
    await createVendor(uid,'test@mymail.pomona.edu')
    const wrap = testEnv.wrap(MenuData.createIngredient)
    await wrap(data,{auth:{uid}})
    return await admin.firestore().collection(BASE_TEAS_COLLECTION).doc("test").get()
}