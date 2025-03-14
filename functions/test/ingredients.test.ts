import testEnv from "./testEnv";
import * as MenuData from "../src/MenuData"
import * as admin from "firebase-admin"
import {createVendor} from "./helperMethods/userMethods";
import { Ingredient} from "../src/MenuData";
import {INGREDIENTS_COLLECTION} from "../src/collection_constants";
import resetFirestore from "./helperMethods/resetDatabase";
import {createIngredient} from "./helperMethods/ingredientMethods";

describe("createIngredient", () => {

    beforeEach(async () => {
        await resetFirestore()
    })

    afterAll(async () => {
        await resetFirestore()
    })
    const wrap = testEnv.wrap(MenuData.createIngredient)

    it("should reject if user is not logged in",async () => {
        const result = await wrap({},{})
        expect(result.message).toEqual("Not logged in")
    })

    it("should reject if user does not have a valid user id", async () => {
        const result = await wrap({},{auth:{}})
        expect(result.message).toEqual("Invalid User ID")
    })

    it("should reject if user does not have vendor privileges", async() => {
        const uid = "123"
        await admin.auth().createUser({
            uid,
            email:"test@mymail.pomona.edu"
        })
        const result = await wrap({},{auth:{uid}})
        expect(result.message).toEqual("User is not authorized")
    })

    it("should reject if user does not have valid data", async () => {
        const data = {
            name:"Hello",
        }

        const uid = "123"
        await createVendor(uid,"sana2018@mymail.pomona.edu")
        const result = await wrap(data,{auth:{uid}})
        expect(result.message).toEqual("Invalid ingredient data")



    })

    it("should create an ingredient with valid input", async () => {
        const uid = "123"
        const data = {
            id:"test",
            name:"Tea",
            type:"Syrup",
            description:"This is a test item",
            imageUrl:"test.png",
            isAvailable:true,
            price:2.5
        } as Ingredient
        await createVendor(uid,'test@mymail.pomona.edu')
        const result = await wrap(data,{auth:{uid}})
        const ingredient = await admin.firestore().collection(INGREDIENTS_COLLECTION).doc("test").get()
        expect(ingredient.exists).toEqual(true)
        expect(result.message).toEqual("Ingredient created")
    })
})

describe("deleteIngredient", () => {

    beforeEach(async () => {
        await resetFirestore()
    })

    afterAll(async () => {
        await resetFirestore()
    })

    const wrap = testEnv.wrap(MenuData.deleteIngredient)

    it("should reject if user is not logged in",async () => {
        const result = await wrap({},{})
        expect(result.message).toEqual("Not logged in")
    })

    it("should reject if user does not have a valid user id", async () => {
        const result = await wrap({},{auth:{}})
        expect(result.message).toEqual("Invalid User ID")
    })

    it("should reject if user does not have vendor privileges", async() => {
        const uid = "123"
        await admin.auth().createUser({
            uid,
            email:"test@mymail.pomona.edu"
        })
        const result = await wrap({},{auth:{uid}})
        expect(result.message).toEqual("User is not authorized")
    })

    it("should reject if payload does not have ingredientID", async () => {
        const uid = "123"
        await createVendor(uid,'test@mymail.pomona.edu')
        const result = await wrap({},{auth:{uid}})
        expect(result.message).toEqual("Invalid ingredient id")
    })

    it("it should delete ingredient with id", async () => {
        await createIngredient("123","123")
        await wrap({ingredientId:"123"},{auth:{uid:"123"}})
        const ingredient = await admin.firestore().collection(INGREDIENTS_COLLECTION).doc("123").get()
        expect(ingredient.exists).toEqual(false)
    })




})