import React, { useState } from "react";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Fab from "@mui/material/Fab";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Box from "@mui/material/Box";
import CartItem from "./CartItem";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../auth/AuthContext";
import { addOrder } from "../api/firestoreApi";
import { useMenu } from "../menu/MenuContext";
import { useNavigate } from "react-router-dom";

// TODO: add finish create order and upload order function.

const Cart = (props) => {
  const [isInstore, setIsInStore] = React.useState(true);
  const [pickupTime, setPickupTime] = React.useState("");
  const { currentUser } = useAuth();
  const { cartItems, clearCart } = useMenu();

  let navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Consider moving to orderApi
  const buildOrder = () => {
    console.log(cartItems);
    return {
      id: Date.now(),
      name: currentUser.displayName,
      owner: currentUser.email,
      created: Date.now(),
      items: Object.assign({},cartItems.map((item, index) => {
        return {
          name: item.item.name,
          flavors: Array.from(item.flavors),
          milk: item.milk,
          sweetness: item.sweetness,
          tea: item.tea,
          ice: item.ice,
          toppings: Array.from(item.toppings),
          subtotal: item.subtotal,
          itemId: index,
          itemState: "Submitted",
          itemMadeBy: "Not Assigned",
          notes: item.notes,
        };
      })),
      orderTotal: getTotal(cartItems),
      isInstore: isInstore,
      pickupTime: isInstore ? "instore" : pickupTime,
      // state: "Submitted",
      // madeBy: "Not Assigned",
    };
  };

  // const buildOrder2 = () => {
  //   console.log(cartItems);
  //   return cartItems.map((item) => {
  //     return {
  //       id: Date.now(),
  //       name: currentUser.displayName,
  //       owner: currentUser.email,
  //       created: Date.now(),
  //       items: Array({
  //           name: item.item.name,
  //           flavor: item.flavor,
  //           milk: item.milk,
  //           sweetness: item.sweetness,
  //           tea: item.tea,
  //           ice: item.ice,
  //           toppings: Array.from(item.toppings),
  //           subtotal: item.subtotal,
  //         });
  //       }),
  //       orderTotal: getTotal(cartItems),
  //       isInstore: isInstore,
  //       pickupTime: isInstore ? "instore" : pickupTime,
  //       state: "Submitted",
  //       madeBy: "Not Assigned",
  //     };
  //   })
    
  // };

  function getTotal(cartItems) {
    let sum = 0;
    cartItems.map((item) => (sum += item.subtotal));
    return sum;
  }

  const onAddOrder = () => {
    const newOrder = buildOrder();
    // setBottom(false);
    console.log(newOrder);
    addOrder(newOrder)
      .catch((err) => {
        console.warn(err.message);
      })
      .then(() => {
        clearCart();
        handleClose();
        // sets this new order to be the first order viewed
        sessionStorage.setItem("key", JSON.stringify(newOrder.id));
        navigate("/orderstatus");
      });
  };

  return (
    <>
      <div className="floatingCart">
        <Fab
          color="primary"
          aria-label="cart"
          onClick={() => handleClickOpen()}
        >
          <Badge
            badgeContent={cartItems.length}
            overlap="circular"
            color="secondary"
          >
            <IconButton aria-label="cart" color="secondary">
              <ShoppingCartIcon color="secondary" />
            </IconButton>
          </Badge>
        </Fab>
      </div>

      <Dialog
        className="behind"
        fullScreen
        open={open}
        onClose={handleClose}
        //   BackdropProps={{ invisible: true }}

        // TransitionComponent={Transition}
      >
        {/* <AppBar sx={{ position: 'relative' }}> */}
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {/* Customize your drink */}
          </Typography>
        </Toolbar>
        {/* </AppBar> */}

        <Box sx={{ mx: 5 }}>
          <Typography sx={{ my: 2 }} variant="h4" component="div">
            My Cart
          </Typography>
        </Box>

        {/* <Divider textAlign="center"> Cutomize your ingredients </Divider> */}

        {cartItems.length > 0 ? (
          <>
            <Box className="scrollableCart" sx={{ mx: 5, mt: 3 }}>
              {cartItems.map((item) => (
                <CartItem props={item} />
              ))}
            </Box>

            <Box className="fs-2">
              <span className="subtotal d-flex justify-content-end">
                Total: ${getTotal(cartItems)}
              </span>
            </Box>

            <Box className="float">
              <Button
                fullWidth={true}
                size="large"
                variant="contained"
                onClick={() => {
                  //console.log(currentUser)
                  //console.log(currentUser.emailVerified)
                  onAddOrder();
                }}
                disabled={
                  !currentUser
                }
              >
                {currentUser
                  ? "Send in my order"
                  : "Please verify email first"}
              </Button>
            </Box>
          </>
        ) : (
          <Box sx={{ mx: 5, mt: 3 }}>
            <Typography sx={{ my: 2 }} component="div">
              You haven't added any drinks yet. What will be your treat today?
            </Typography>
          </Box>
        )}
      </Dialog>
    </>
  );
};

export default Cart;
