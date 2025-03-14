




## Sign Up
https://firebase.google.com/docs/auth/extend-with-functions
When a user signs up there should be a check that their email is in a list of valid domains. If it isn't then the email should be deleted. Since there aren't many valid emails (@mymail.pomona.edu) maybe a few others, we can just have a discrete list that is read from in the backend and not in the database.



```js
export const validDomains = ["mymail.pomona.edu"]

```



## Verification
Firebase 

---

## Vendors

### Design
1. New Collection that contains Users. Everytime a new user is created a new default entry is created as so
```ts
interface User {
	_id: 
	email:string;
	emailPrefix:string;
	isVendor:bool;
}
```

Every change to this model leads to an event which updates customClaims for the specified user. We can do this by calling the **onWrite** function trigger.

### Example
![[Pasted image 20220408152329.png]]

https://firebase.google.com/docs/auth/admin/custom-claims
https://firebase.google.com/docs/functions/firestore-events
https://firebase.google.com/docs/functions/database-events
