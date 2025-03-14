import React, { useContext, useEffect, useState } from "react";
import { fetchMenu, listenToppingInventory } from "../api/firestoreApi";
import blackmilktea from "../assets/drinkPics/Black Milk Tea.png";
import blackrosemilktea from "../assets/drinkPics/Black Rose Milk Tea.png";
import brownsugarlatte from "../assets/drinkPics/Brown Sugar Latte.png";
import dirtymatchalatte from "../assets/drinkPics/Dirty Matcha Latte.png";
import jasminemangopassionfruit from "../assets/drinkPics/Jasmine Mango Passionfruit.png";
import jasminemilktea from "../assets/drinkPics/Jasmine Milk Tea.png";
import kumquatlycheejasmine from "../assets/drinkPics/Kumquat Lychee Jasmine.png";
import matchalatte from "../assets/drinkPics/Matcha Latte.png";
import oolonghoneypeach from "../assets/drinkPics/Oolong Honey Peach.png";
import oolongmilktea from "../assets/drinkPics/Oolong Milk Tea.png";
import tarolatte from "../assets/drinkPics/Taro Latte.png";
import thaimilktea from "../assets/drinkPics/Thai Milk Tea.png";
import defaultDrink from "../assets/drinkPics/defaultDrink.png";

const MenuContext = React.createContext();

export function useMenu() {
  return useContext(MenuContext);
}

export function MenuProvider({ children }) {
  const [contextLoaded, setContextLoaded] = useState(false);
  const [menu, setMenu] = useState([]);
  const [toppingInventory, setToppingInventory] = useState([]);
  const [orders, setOrders] = React.useState([]);
  const [cartItems, setCartItems] = React.useState([]);

// NOTE: THIS SHIT UPDATES THROUGH FIREBASE I.E. DESCRIPTIONS for fresh milk -> whole milk

  const constantMenuItem = [
    {
      id: 0,
      name: "Black milk Tea",
      category: "Classic Milk Tea",
      tea: ["Black"],
      milk: [
        "Lactose-free Creamer (Default)",
        "Oat Milk",
        "Almond Milk",
        "Soy Milk",
      ],
      flavor: ["/"],
      toppings: ["Honey Boba", "Lychee Jelly", "Passionfruit Popping Boba"],
      ice: ["No Ice", "Low Ice", "Regular Ice"],
      sweetness: ["0%", "25%", "50%", "75%", "100%"],
      price: 4.5,
      description: "Assam black tea with lactose-free creamer",
      picture: blackmilktea,
    },
    {
      id: 1,
      name: "Jasmine milk tea",
      category: "Classic Milk Tea",
      tea: ["Jasmine"],
      milk: [
        "Lactose-free Creamer (Default)",
        "Oat Milk",
        "Almond Milk",
        "Soy Milk",
      ],
      flavor: ["/"],
      toppings: ["Honey Boba", "Lychee Jelly", "Passionfruit Popping Boba"],
      ice: ["No Ice", "Low Ice", "Regular Ice"],
      sweetness: ["0%", "25%", "50%", "75%", "100%"],
      price: 4.5,
      description: "Jasmine green tea with lactose-free creamer",
      picture: jasminemilktea,
    },
    {
      id: 2,
      name: "Oolong milk tea",
      category: "Classic Milk Tea",
      tea: ["Oolong"],
      milk: [
        "Lactose-free Creamer (Default)",
        "Oat Milk",
        "Almond Milk",
        "Soy Milk",
      ],
      flavor: ["/"],
      toppings: ["Honey Boba", "Lychee Jelly", "Passionfruit Popping Boba"],
      ice: ["No Ice", "Low Ice", "Regular Ice"],
      sweetness: ["0%", "25%", "50%", "75%", "100%"],
      price: 4.5,
      description: "Oolong tea with lactose-free creamer",
      picture: oolongmilktea,
    },
    {
      id: 3,
      name: "Thai milk tea",
      category: "Classic Milk Tea",
      tea: ["Thai"],
      milk: [
        "Lactose-free Creamer (Default)",
        "Oat Milk",
        "Almond Milk",
        "Soy Milk",
      ],
      flavor: ["/"],
      toppings: ["Honey Boba", "Lychee Jelly", "Passionfruit Popping Boba"],
      ice: ["No Ice", "Low Ice", "Regular Ice"],
      sweetness: ["0%", "25%", "50%", "75%", "100%"],
      price: 4.5,
      description: "Thai tea with lactose-free creamer",
      picture: thaimilktea,
    },
    {
      id: 4,
      name: "Wintermelon Jasmine Milk Tea",
      category: "Classic Milk Tea",
      tea: ["Jasmine"],
      milk: [
        "Lactose-free Creamer (Default)",
        "Oat Milk",
        "Almond Milk",
        "Soy Milk",
      ],
      flavor: ["Wintermelon"],
      toppings: ["Honey Boba", "Lychee Jelly", "Passionfruit Popping Boba"],
      ice: ["No Ice", "Low Ice", "Regular Ice"],
      sweetness: ["25%", "50%", "75%", "100%"],
      price: 4.5,
      description: "Thai tea with lactose-free creamer",
      picture: jasminemilktea,
    },
    {
      id: 5,
      name: "Rose Black Milk Tea",
      category: "Classic Milk Tea",
      tea: ["Black"],
      milk: [
        "Lactose-free Creamer (Default)",
        "Oat Milk",
        "Almond Milk",
        "Soy Milk",
      ],
      flavor: ["Rose"],
      toppings: ["Honey Boba", "Lychee Jelly", "Passionfruit Popping Boba"],
      ice: ["No Ice", "Low Ice", "Regular Ice"],
      sweetness: ["25%", "50%", "75%", "100%"],
      price: 4.5,
      description: "Rose syrup and assam black tea with lactose-free creamer",
      picture: blackrosemilktea,
    },
    {
      id: 6,
      name: "Matcha Latte",
      category: "Fresh Milk Lattes",
      tea: ["Matcha"],
      milk: ["Whole Milk", "Oat Milk", "Almond Milk", "Soy Milk"],
      flavor: ["/"],
      toppings: ["Honey Boba", "Lychee Jelly", "Passionfruit Popping Boba"],
      ice: ["/"],
      sweetness: ["/"],
      price: 5.0,
      description: "Matcha with whole milk",
      picture: matchalatte,
    },
    {
      id: 7,
      name: "Dirty Matcha Latte",
      category: "Fresh Milk Lattes",
      tea: ["Dirty Matcha"],
      milk: ["Whole Milk", "Oat Milk", "Almond Milk", "Soy Milk"],
      flavor: ["/"],
      toppings: ["Honey Boba", "Lychee Jelly", "Passionfruit Popping Boba"],
      ice: ["/"],
      sweetness: ["/"],
      price: 5.0,
      description: "Matcha and brown sugar with whole milk",
      picture: dirtymatchalatte,
    },
    {
      id: 8,
      name: "Taro Latte",
      category: "Fresh Milk Lattes",
      tea: ["Taro"],
      milk: ["Whole Milk", "Oat Milk", "Almond Milk", "Soy Milk"],
      flavor: ["/"],
      toppings: ["Honey Boba", "Lychee Jelly", "Passionfruit Popping Boba"],
      ice: ["No Ice", "Low Ice", "Regular Ice"],
      sweetness: ["0%", "25%", "50%", "75%", "100%"],
      price: 5.0,
      description: "Taro with whole milk",
      picture: tarolatte,
    },
    {
      id: 9,
      name: "Brown Sugar Latte",
      category: "Fresh Milk Lattes",
      tea: ["Brown Sugar"],
      milk: ["Whole Milk", "Oat Milk", "Almond Milk", "Soy Milk"],
      flavor: ["/"],
      toppings: ["Honey Boba", "Lychee Jelly", "Passionfruit Popping Boba"],
      ice: ["/"],
      sweetness: ["/"],
      price: 5.0,
      description: "Brown sugar with whole milk",
      picture: brownsugarlatte,
    },
    {
      id: 10,
      name: "Mango Passion Fruit Jasmine Tea",
      category: "Fruit Teas",
      tea: ["Jasmine"],
      milk: ["/"],
      flavor: ["Mango, Passionfruit"],
      toppings: ["Honey Boba", "Lychee Jelly", "Passionfruit Popping Boba"],
      ice: ["No Ice", "Low Ice", "Regular Ice"],
      sweetness: ["25%", "50%", "75%", "100%"],
      price: 4.5,
      description: "Mango and passionfruit syrup with jasmine green tea",
      picture: jasminemangopassionfruit,
    },
    {
      id: 11,
      name: "Kumquat Lychee Green Tea",
      category: "Fruit Teas",
      tea: ["Jasmine"],
      milk: ["/"],
      flavor: ["Kumquat, Lychee"],
      toppings: ["Honey Boba", "Lychee Jelly", "Passionfruit Popping Boba"],
      ice: ["No Ice", "Low Ice", "Regular Ice"],
      sweetness: ["25%", "50%", "75%", "100%"],
      price: 4.5,
      description: "Kumquat and lychee syrup with jasmine green tea",
      picture: kumquatlycheejasmine,
    },
    {
      id: 12,
      name: "Honey Peach Oolong Tea",
      category: "Fruit Teas",
      tea: ["Oolong"],
      milk: ["/"],
      flavor: ["Honey, Peach"],
      toppings: ["Honey Boba", "Lychee Jelly", "Passionfruit Popping Boba"],
      ice: ["No Ice", "Low Ice", "Regular Ice"],
      sweetness: ["25%", "50%", "75%", "100%"],
      price: 4.5,
      description: "Honey and peach syrup with oolong tea",
      picture: oolonghoneypeach,
    },
    {
      id: 13,
      name: "Custom Fruit Tea",
      category: "Custom Fruit Teas",
      tea: ["Black", "Jasmine", "Oolong"],
      milk: ["/"],
      flavor: ["Mango", "Peach", "Passion Fruit", "Lychee", "Kumquat", "Rose"],
      toppings: ["Honey Boba", "Lychee Jelly", "Passionfruit Popping Boba"],
      ice: ["No Ice", "Low Ice", "Regular Ice"],
      sweetness: ["25%", "50%", "75", "100%"],
      price: 4.5,
      description: "Make your own drink!",
      picture: defaultDrink,
    },
    {
      id: 14,
      name: "Today's Special",
      category: "Specials",
      tea: ["/"],
      milk: ["/"],
      flavor: ["/"],
      toppings: ["Honey Boba", "Lychee Jelly", "Passionfruit Popping Boba"],
      ice: ["/"],
      sweetness: ["/"],
      price: 5.0,
      description:
        "Today's special offering. Check our instagram @milkandhoneyclaremont for details!",
      picture: defaultDrink,
    },
  ];

  const categoryDescription = [
    {
      id: 1,
      category: "Specials",
      description: "Check our instagram for details!",
    },
    {
      id: 2,
      category: "Classic Milk Tea",
      description: "Caffeinated and made with lactose-free creamer",
    },
    {
      id: 3,
      category: "Fresh Milk Lattes",
      description: "Low/no caffeine and made with whole milk",
    },
    {
      id: 4,
      category: "Fruit Teas",
      description: "Caffeinated and made without milk",
    },
    {
      id: 5,
      category: "Custom Fruit Tea",
      description: "Create your own fruit tea"
    }
  ];

  useEffect(() => {
    // test commit
    setContextLoaded(false);
    setMenu([]);
    fetchMenu()
      .then((res) => {
        res.forEach((item) => {
          setMenu((arr) => [...arr, item]);
        });
      })
      .then(() => {
        listenToppingInventory(setToppingInventory);
      })
      .then(() => {
        setContextLoaded(true);
      });
  }, []);

  const handleAddOrder = (newOrder) => {
    setOrders([...orders, newOrder]);
    setCartItems([]);
    console.log(newOrder);
  };

  const handleRemoveFromCart = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleAddToCart = (newCartItem) => {
    setCartItems([...cartItems, newCartItem]);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const value = {
    menu,
    toppingInventory,
    contextLoaded,
    cartItems,
    handleAddOrder,
    handleRemoveFromCart,
    handleAddToCart,
    clearCart,
    constantMenuItem,
    categoryDescription,
  };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}
