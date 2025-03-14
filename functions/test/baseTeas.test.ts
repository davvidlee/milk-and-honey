import resetFirestore from "./helperMethods/resetDatabase";
import testEnv from "./testEnv";
import * as BaseTea from "../src/BaseTea"
import * as admin from "firebase-admin";
import {createVendor} from "./helperMethods/userMethods";
import {BASE_TEAS_COLLECTION, INGREDIENTS_COLLECTION} from "../src/collection_constants";
import {createBaseTea} from "./helperMethods/baseTeaMethods";

describe("createBasesTea", () => {
    beforeEach(async () => {
        await resetFirestore()
    })

    afterAll(async () => {
        await resetFirestore()
    })

    const wrap = testEnv.wrap(BaseTea.createBaseTea)

    it ("should reject if user is not logged in", async () => {
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
            email:"test@mymail.pomona.edu",
            emailVerified:true,
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
        expect(result.message).toEqual("Invalid base tea values")



    })

    it("should create a base tea with valid input", async () => {
        const uid = "123"
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
        await createVendor(uid,'test2@mymail.pomona.edu')
        const result = await wrap(data,{auth:{uid}})
        const ingredient = await admin.firestore().collection(BASE_TEAS_COLLECTION).doc("test").get()
        expect(ingredient.exists).toEqual(true)
        expect(result.message).toEqual("Base Tea created or updated successfully")
    })
})

describe("deleteBaseTea", () => {
    beforeEach(async () => {
        await resetFirestore()
    })

    afterAll(async () => {
        await resetFirestore()
    })

    const wrap = testEnv.wrap(BaseTea.deleteBaseTea)
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
            email:"test@mymail.pomona.edu",
            emailVerified:true,
        })
        const result = await wrap({},{auth:{uid}})
        expect(result.message).toEqual("User is not authorized")
    })

    it("should reject if payload does not have id", async () => {
        const uid = "123"
        await createVendor(uid,'test@mymail.pomona.edu')
        const result = await wrap({},{auth:{uid}})
        expect(result.message).toEqual("Invalid Base Tea Id")
    })

    it("it should delete ingredient with id", async () => {
        await createBaseTea("123","123")
        await wrap({id:"123"},{auth:{uid:"123"}})
        const ingredient = await admin.firestore().collection(INGREDIENTS_COLLECTION).doc("123").get()
        expect(ingredient.exists).toEqual(false)
    })


})

