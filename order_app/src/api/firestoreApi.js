import app from "../firebase";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  arrayUnion,
  query,
  collection,
  where,
  onSnapshot,
} from "firebase/firestore";

const db = getFirestore(app);

const menuRef = doc(db, "menu", "drinkMenu");
const toppingRef = doc(db, "inventory", "toppings");
const vendorRef = doc(db, "users", "venders");

export async function fetchMenu() {
  const docSnap = await getDoc(menuRef);
  return docSnap.data().menu;
}

export async function fetchTopingInventory() {
  const docSnap = await getDoc(toppingRef);
  return docSnap.data();
}

// under the assumption that menuItem is a correctly formatted JSON object
export async function putMenuItem(menuItem) {
  // how do we get menu ID?
  await updateDoc(menuRef, {
    menu: arrayUnion(menuItem),
  });
}

export async function setMenu(menu) {
  menu.forEach((item) => {
    putMenuItem(item);
  });
}

export function addOrder(order) {
  return setDoc(doc(db, "orders", order.id.toString()), order);
}

export function pullOrder(startOfDay) {
  const q = query(collection(db, "orders"), where("id", ">=", startOfDay));
  return getDocs(q);
}

// Call with currentUser from useAuth() after verifying that currentUser is not null
export function getOrdersByUser(user) {
  if (!user) {
    console.error("Empty User");
    return [];
  }
  const q = query(collection(db, "orders"), where("owner", "==", user.email));
  return getDocs(q);
}

export function listenOrdersByStartOfDay(startOfDay, onNext) {
  const q = query(collection(db, "orders"), where("id", ">=", startOfDay));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push(doc.data());
    });
    onNext(orders);
  });
}

export function listenToppingInventory(setToppingInventory) {
  const unsubscribe = onSnapshot(toppingRef, (doc) => {
    setToppingInventory(doc.data());
  });
}

export async function updateToppingInventory(target, val) {
  switch (target) {
    case "boba":
      await updateDoc(toppingRef, {
        hasBoba: val,
      });
      break;
    case "popping":
      await updateDoc(toppingRef, {
        hasPopping: val,
      });
      break;
    case "jelly":
      await updateDoc(toppingRef, {
        hasJelly: val,
      });
      break;
    default:
      console.log("updateToppingInventory: No such target");
  }
}

//change id status to val
export async function updateItemStatus(id, itemId, val) {
  const changeSet = { [`items.${itemId}.itemState`]: val };
  await updateDoc(doc(db, "orders", id.toString()), changeSet);
}

export async function updateItemOwner(id, itemId, val) {
  const changeSet = { [`items.${itemId}.itemMadeBy`]: val };
  await updateDoc(doc(db, "orders", id.toString()), changeSet);
}

export async function getIsVendor(email) {
  const q = query(collection(db, "vendors"), where("email", "==", email));
  const result = await getDocs(q);
  return !result.empty;
}

// Function to update site status
export const updateSiteStatus = async (isOpen) => {
  const statusRef = doc(db, "siteStatus", "status");
  await setDoc(statusRef, { isOpen });
};

// Function to listen to site status changes
export const listenToSiteStatus = (onStatusChange) => {
  const statusRef = doc(db, "siteStatus", "status");
  return onSnapshot(statusRef, (doc) => {
    if (doc.exists()) {
      onStatusChange(doc.data().isOpen);
    } else {
      console.log("No site status document found!");
    }
  });
};
