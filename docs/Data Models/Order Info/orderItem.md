# OrderItem

### Description
The Order Item Data Model refers to an instance of a drink that is built / customized by a customer.


### Model
```ts
interface OrderItem {
    owner: customUserID;
    baseItem: BaseMilkTeaID;
    syrup: SyrupID | Null;
    sweetness: Sweetness;
    ice: Ice;
    toppings: ToppingID[];
    subtotal: number;
}

```



---
### Considerations 


What information do we need from an Order Item?

1. We need to know the ingredients it is composed of so its sweetness, syrup, base, Ice,  toppings, and also the price 
2. We need an image preview of the menuItem it comes with.
	- This can be incliuded in the BaseMilkTea
Questions:
	- What's the point of the [[BaseMilkTea]]? I'm not sure what it is for. Like we have most of the info except the image.
	- So what I ended up doing is I moved the base out of here and into the [[BaseMilkTea]] so that it is easier to make sense of that type. The [[BaseMilkTea]] has the image as well as the base  ingredient ID.
