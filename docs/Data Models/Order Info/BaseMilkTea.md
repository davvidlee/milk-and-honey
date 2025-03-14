# BaseMilkTea

### Description
The Base Milk Tea Data Model refers to th Base Milk Teas Collection which holds all of the base drink options available.


### Model
```ts
interface BaseMilkTea {
    name: str;
    baseIngredientOptions:string[];
    imageUrl:string|null;
    toppingOptions:toppingID[];
    sweetnessOptions:string[];
    iceOptions:string[]    
    price: number;
    description: str;
    
}
```
---
### Considerations 
1. We need for Vendors to be able to add them 
2. We need for pictures to be uploaded here 

 Questions:
- Is this related to base?