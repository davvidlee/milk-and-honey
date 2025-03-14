
# 1. Vendor (Item Creation)
### Create Ingredients
1. Add [[Ingredient|Ingredients]] -> (IngredientCollection)
	-  add [[MilkBase|milk bases]]
	- add [[Syrup| syrups]]
	- add [[Topping|toppings]]

### Create Base Milk Teas 
2.  Add [[BaseMilkTea|BaseMilkTeas]] -> (BaseMilkTeaCollection)
	- specify name
	- baseIngredient from [[MilkBase]]
	- upload image 
	- specify description (may not be needed)

---


# 2. Customer 
### View [[BaseMilkTea| Base Milk Teas]]
- get milk teas from BaseMilkTeaCollection
- render them 

### Select [[BaseMilkTea| Milk Tea]]
Render the Tea Selection Menu
- View [[Topping|Toppings]] 
- View [[Syrup|Syrups]]
- Select [[Sweetness]]
- Select [[Ice]]

### Add to Cart  (Can Repeat with 3 orders)
- Package as [[OrderItem]] 
- Check if can add to [[Order]] based upon order limits 
- add to [[Order]]

### Submit Order 
- Select Time Slot for Order
-  Add [[Order]] to OrderCollection in FireBase 
	- specify owner as userID
	- specify credited as current time
	- specify completed to be false 
	- calculate orderTotal server-side
- Update Select [[TimeSlots]]

---


# 3. Vendor (Order Queue)
### Processing Order
- get [[Order|orders]] that are attached to [[TimeSlots]]
- render them
- Vendor select [[Order|order]] and mark as in-progress
	- specify startedAt time
	- specify madeBy
- Notify user that order is in progress 
- Mark order complete
	- update [[Order]] completionTime to current time 
- Notify user that order is complete
- mark order as Paid or Abandoned 
	- if abandoned mark isPaid in [[Order]] as false and mark isClosed true 
	- if paid mark isPaid in [[Order]] as true and mark isClosed as true 

#question So will you work on a single item at a given point?

#question So will there be an order_id in a specific format? Like how will vendors match orders to customers 











