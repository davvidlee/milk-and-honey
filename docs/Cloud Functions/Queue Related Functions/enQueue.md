# EnQueue

### Responsibility
This method is responsible for taking a request, validating it, and enqueueing
orders to the Orders Collection

###  Type Signature
```ts
enQueue(order:IDrinkInfo) -> Promise<HTTP Response>
```

---
## Considerations
1. UNIX Timestamps have 1 sec resolution (Conflict Resolution) 

---
## Requirements 

### Data Storage
1. It should insert a valid IOrder object where:
   1. id is a uuidv4 
   2. owner is the userID 
   3. created is the current unix time 
   4. startedAt is null
   5. madeBy is null
   6. completed is false 
   7. drinkInfo is the validated drinkInfo

### Validation
1. it should reject orders with incorrect base field
2. it should reject orders with incorrect toppings 
3. it should reject orders with more than 5 toppings 
4. it should reject orders without a base or toppings field
5. it should reject orders with more than 2 fields 
6. it should reject orders made with without authorization (not logged on/ not validated email)

---
### Example I (Valid Order)

1. Customer A Sends drink Info through a POST request to /enQueue
```ts
    drinkInfo: [{base:"MilkTea", toppings:["boba"]}]
```
2. enQueue checks if the order is valid, then places it into the FireStore's **Order** Collection.

3. sends a success response **200**

---

### Example II (Invalid Order)

1. Customer A Sends Order through a POST request to /enQueue with invalid drinkInfo
```ts

    drinkInfo: [{base:"MilkTea", toppings:["fakeTopping"]}]
```

2. enQueue checks if the order is valid, it sees that it is invalid so it rejects

3. sends a forbidden response **403**

