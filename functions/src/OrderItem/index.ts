import * as admin from "firebase-admin";
import * as functions from "firebase-functions"
import {isValidUser} from "../validateUser";
import {isValidStringArray} from "../MenuData/helperMethods";
import {BASE_TEAS_COLLECTION, INGREDIENTS_COLLECTION, ORDER_ITEMS_COLLECTION} from "../collection_constants";
import {BaseTea} from "../BaseTea";
import {Ingredient} from "../MenuData";
import createObject from "../MenuData/createObject";
const db = admin.firestore()

export interface OrderItem {
    owner:string;
    subtotal:number;
    baseItem:string;
    syrup:string|null;
    orderIsPlaced:boolean;
    sweetness:string;
    ice:string;
    toppings:string[];
}

/*
This method allows users and vendors to create and update Order Items
and accepts a Partial<OrderItem> where owner and subtotal are not specified.
Also accepts an option id property which can be used to update an existing order.
Note that it does not allow updates if an order has been placed.
*/
export const createOrderItem = functions.https.onCall(async (data,context) => {
    const userIsAValidCustomerStatus = await isValidUser(context)
    if (userIsAValidCustomerStatus !== true) return userIsAValidCustomerStatus
    if (!isValidOrderItem(data)) return {
        status:"error",
        code:401,
        message:"Invalid Order Item received."
    }
    const orderIsPlacedStatus = await orderPlacementStatus(data.id)
    if (orderIsPlacedStatus != false) return orderIsPlacedStatus

    const orderItem = {
        owner: context.auth!.uid as string,
        baseItem: data.baseItem as string,
        orderIsPlaced: false,
        syrup: data.syrup as string,
        sweetness: data.sweetness as string,
        ice: data.ice as string,
        toppings: data.toppings as string[],
        subtotal: 0
    } as OrderItem
    const subtotal = await calculateSubTotal(orderItem)
    if (subtotal == false) return {
        status:"error",
        code:401,
        message:"subtotal could not be calculated.Ensure that item ids are valid"

    }
    orderItem.subtotal = subtotal

    return createObject(
        data.id,
        ORDER_ITEMS_COLLECTION,
        orderItem,
        "order item has been successfully created"
    )
})

/*
This method allows you to delete an order item.
 */
export const deleteOrderItem = functions.https.onCall(async (data,context) => {
    const userIsValidCustomer = await isValidUser(context)
    if (userIsValidCustomer !== true) return userIsValidCustomer
    if (!data.id || typeof data.id !== "string") {
        return {
            status:"error",
            code:401,
            message:"A valid id was not provided"
        }
    }
    const orderIsPlacedStatus = await orderPlacementStatus(data.id)
    if (orderIsPlacedStatus != false) return orderIsPlacedStatus
    if (!await userIsVendor(context.auth!.uid) || await userOwnsOrderItem(context.auth!.uid,data.id)) {
        return {
            status:"error",
            code:401,
            message:"You are not permitted to delete this order."
        }
    }
    await db.collection(ORDER_ITEMS_COLLECTION).doc(data.id).delete()
    return {
        status:"success",
        code:200,
        message:"Order Item has been successfully deleted."
    }
})


const userOwnsOrderItem = async (uid:string,orderId:string) => {
    const orderItem = await db.collection(ORDER_ITEMS_COLLECTION).doc(orderId).get()
    if (!orderItem.exists) return false
    return orderItem.data()!.owner == uid
}

const userIsVendor = async (uid:string) => {
    const user = await admin.auth().getUser(uid)
    return user.customClaims!.isVendor
}

const orderPlacementStatus = async (id:string|undefined) => {
    if (id == undefined) return false
    const order = await db.collection(ORDER_ITEMS_COLLECTION).doc(id).get()
    if (order.exists && order.data()!.orderIsPlaced) {
        return {
            status:"error",
            code:401,
            message:"This order item can not be updated as an order has already been placed."
        }
    }
    return false
}

const calculateSubTotal = async (orderItem:OrderItem) => {
    const baseTea = await db.collection(BASE_TEAS_COLLECTION).doc(orderItem.baseItem).get()
    if (!baseTea.exists) return false
    let subTotal = 0
    const {price} = baseTea.data() as BaseTea
    subTotal += price

    for (const toppingID of orderItem.toppings) {
        const toppingItem = await db.collection(INGREDIENTS_COLLECTION).doc(toppingID).get()
        if (!toppingItem.exists) return false
        const topping = toppingItem.data() as Ingredient
        subTotal += topping.price
    }
    return subTotal
}

const isValidOrderItem = (data:any) => {
    if (!data.hasOwnProperty("baseItem")) return false
    if (!(typeof data.item == "string")) return false
    if (!data.hasOwnProperty("syrup")) return false
    if (!data.hasOwnProperty("orderIsPlaced")) return false
    if (!(typeof data.orderIsPlaced == "boolean")) return false
    if (!(typeof data.syrup == "string") || data.syrup == null) return false
    if (!data.hasOwnProperty("sweetness")) return false
    if (!(typeof data.sweetness == "string")) return false
    if (!data.hasOwnProperty("ice")) return false
    if (!(typeof data.ice == "string")) return false
    if (!data.hasOwnProperty("toppings")) return false
    if (!isValidStringArray(data.toppings)) return false
    return true
}