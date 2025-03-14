# deQueue

### Responsibility
This method is responsible for taking an order ID 
and removing it from the Orders Collection

### Type Signature
```ts
deQueue(orderID:string) -> Promise<HTTP Response>
```

---


### Requirements

### Base 
1. Order item with orderID should be removed from Orders Collection

### Validation
1. non-Admin users can only remove their own orders 
2. admin users can remove all orders
3. invalid order ids are rejected 

