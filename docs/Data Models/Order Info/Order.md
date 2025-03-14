 # Order

### Description
The Order Data Model refers to the Order Collection which holds all of the orders that have been placed.


### Model
```ts
interface Order {
    id: string;
    owner: string;
    created: timestamp;
    items: OrderItem[];
    startedAt: timestamp|null;
    madeBy: string| null;
    completionTime: timestamp | null;
    isPaid:boolean;
    isClosed:boolean;
    orderTotal: decimal;
}
```

---
### Considerations 

What types of things do we need to do with an Order?

1. Asign it to a staff 
2. Specify when it was made 
3. Give it an id 
4. Present the items in the order
5. Limit how many items are attached to the order and how many orders a user has made within a set period?
6. Specify when the drink has been started and indicate to user that their order have been started 
7. Specify that the order is completed and indicate to customer that it is completed 
8. Show staff what the order total is 