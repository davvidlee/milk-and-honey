import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { CircularProgress, Hidden } from "@mui/material";
import { useAuth } from "../auth/AuthContext";
import { getOrdersByUser } from "../api/firestoreApi";
import OrderItem from "./OrderItem";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useNavigate, Link } from "react-router-dom";
import bell from "../assets/bell.png";
import { withStyles } from "@mui/styles";
import StepConnector from "@mui/material/StepConnector";
import {
  listenOrdersByStartOfDay,
  updateItemOwner,
  updateItemStatus,
} from "../api/firestoreApi";
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

import { SystemSecurityUpdate } from "@mui/icons-material";
import { blue } from "@mui/material/colors";
import { isOverflown } from "@mui/x-data-grid/utils/domUtils";
import { hasFormSubmit } from "@testing-library/user-event/dist/utils";
import "../App.css";

const steps = ["Order Placed", "Making your drink", "Drink is ready", "Paid"];

const db = getFirestore(app);

const InvisibleConnector = () => <div style={{ display: "none" }} />;

var hasTouchScreen = false;

if ("maxTouchPoints" in navigator) {
  hasTouchScreen = navigator.maxTouchPoints > 0;
} else if ("msMaxTouchPoints" in navigator) {
  hasTouchScreen = navigator.msMaxTouchPoints > 0;
} else {
  var mQ = window.matchMedia && matchMedia("(pointer:coarse)");
  if (mQ && mQ.media === "(pointer:coarse)") {
    hasTouchScreen = !!mQ.matches;
  } else if ("orientation" in window) {
    hasTouchScreen = true; // deprecated, but good fallback
  } else {
    // Only as a last resort, fall back to user agent sniffing
    var UA = navigator.userAgent;
    hasTouchScreen =
      /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
      /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA);
  }
}

if (hasTouchScreen) {
  console.log("MOBILE");
} else {
  console.log("NOT MOBILE");
}

const ColorlibConnector = withStyles((theme) => ({
  alternativeLabel: {
    top: 22,
  },
  active: {
    "& $line": {
      borderColor: "#FADAA2",
    },
  },
  completed: {
    "& $line": {
      borderColor: "#FADAA2",
    },
  },
  line: {
    borderColor: "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
  },
}))(StepConnector);

const OrderStatus = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [currOrder, setCurrOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const handleChange = (event) => {
    setCurrOrder(event.target.value);
  };
  const getStatusList = (o) => {
    var arr = [];
    for (var i = 0; i < o.length; i++) {
      var arr2 = [];
      for (var j = 0; j < Object.keys(o[i].items).length; j++) {
        arr2.push(o[i].items[j].itemState);
      }
      arr.push(arr2);
    }
    return arr;
  };

  const toTime = (id) => {
    const tempDate = new Date(id);
    return (
      tempDate.toLocaleDateString("en-US") +
      " " +
      tempDate.toLocaleTimeString("en-US")
    );
  };

  const sameDay = (id) => {
    const orderDate = new Date(id);
    const lastDay = Date.now() - 24 * 60 * 60 * 1000;
    return orderDate > lastDay ? true : false;
  };

  useEffect(() => {
    setIsFetching(true);
    var statusList;
    const originalOrder = JSON.parse(sessionStorage.getItem("key"));

    if (currentUser) {
      const day = new Date();
      day.setHours(0, 0, 0, 0);
      const q = query(
        collection(db, "orders"),
        where("owner", "==", currentUser.email),
        where("id", ">=", day.getTime())
      );

      const snap = onSnapshot(q, (querySnapshot) => {
        const fetchedOrders = [];
        querySnapshot.forEach((doc) => {
          fetchedOrders.push(doc.data());
        });

        setOrders(fetchedOrders.reverse());
        var index = 0;

        outerFor: for (var i = 0; i < fetchedOrders.length; i++) {
          if (statusList != undefined) {
            for (var j = 0; j < Object.keys(fetchedOrders[i].items).length; j++) {
              if (fetchedOrders[i].items[j].itemState != statusList[i][j]) {
                index = i;
                break outerFor;
              }
            }
          }
          if (fetchedOrders[i].id === originalOrder) {
            index = i;
          }
        }

        statusList = getStatusList(fetchedOrders);
        setCurrOrder(fetchedOrders[index]);
        setIsFetching(false);
      });
      setLoading(false);
      return () => snap();
    }
  }, [currentUser]);

  useEffect(() => {
    if (currOrder) {
      // stores the current order that is being viewed
      sessionStorage.setItem("key", JSON.stringify(currOrder.id));
    }
  }, [currOrder]);

  const getOrderName = (order) => {
    var name = "";
    var i = 0;
    while (order.items[i]) {
      var tail = order.items[i++].name + ", ";
      name = name.concat(tail);
    }
    name = name.substring(0, name.length - 2);
    return name;
  };

  const getLabel = (statusNum) => {
    var label;

    switch (statusNum) {
      case 0:
        label = "Order Placed";
        break;
      case 1:
        label = "Making Your Drink(s)";
        break;
      case 2:
        label = "Pay and Pickup at Counter";
        break;
      case 3:
        label = "Payment Confirmed";
        break;
    }
    return label;
  };

  const fontThickness = (currOrder, statusNum) => {
    const actualStatus = getStatus(currOrder);

    var fontThickness = "300";
    if (statusNum <= actualStatus) {
      fontThickness = "800";
    }

    return fontThickness;
  };

  //algorithm for calculating the number of drinks before
  useEffect(() => {
    const day = new Date();
    day.setHours(0, 0, 0, 0);
    const q = query(collection(db, "orders"), where("id", ">=", day.getTime()));
    
    const snap = onSnapshot(q, (querySnapshot) => {
      const fetchedOrders = [];
      querySnapshot.forEach((doc) => {
          fetchedOrders.push(doc.data());
      });

      setAllOrders(fetchedOrders.reverse());
      var index = 0;
    });
  }, []);

  let drinksBefore = 0;
  let revOrders = allOrders.slice().reverse();

  topfor: for (const order of revOrders) {
    for (const i of Object.entries(order.items)) {
      const item = i[1];
      const tempDate = new Date(order.id);
      const date = tempDate.toLocaleTimeString("en-US");
      const currRow = {
        status: item.itemState,
        id: order.id,
      };
      if (currOrder) {
        if (currOrder.id == currRow.id) {
          break topfor;
        }
      }
      if (currRow.status == "Making" || currRow.status == "Submitted") {
        drinksBefore++;
      }
    }
  }

  const getMessage = (currOrder, statusNum) => {
    var statusMessage;
    const actualStatus = getStatus(currOrder);

    // if the status of the order != step in the box
    if (statusNum != actualStatus) return;

    switch (statusNum) {
      case 0:
        statusMessage = (
          <span>
            There are
            <span style={{ fontWeight: "bold", color: "#f9d454" }}>
              {" "}
              {drinksBefore}{" "}
            </span>
            drinks before.
          </span>
        );
        break;
      case 1:
        statusMessage = "Get your drink(s) soon!";
        break;
      case 2:
        statusMessage = "We take claremont cash/card/flex";
        break;
      case 3:
        statusMessage = "Thank you for your purchase!";
        break;
    }
    return statusMessage;
  };

  // NOTE: the statusNum may change depending on what happens when there are multiple drinks
  const getStatus = (currOrder) => {
    var statusNum = 0;
    var making = 0;
    var allMade = 0;
    var allPaid = 0;
    var i = 0;
    var total = 0;
    while (currOrder.items[total]) {
      total++;
    }

    if (currOrder) {
      while (currOrder.items[i]) {
        if (currOrder.items[i].itemState === "Submitted") {
          statusNum = 0;
        } else if (currOrder.items[i].itemState === "Making") {
          making = 1;
        } else if (currOrder.items[i].itemState === "Made") {
          allMade++;
        } else if (currOrder.items[i].itemState === "Paid") {
          allPaid++;
        }
        i++;
      }
    }

    return allPaid === total
      ? 3
      : allMade === total 
      ? 2
      : making === 1 || allMade
      ? 1
      : statusNum;
  };
  if (!currentUser || isFetching) {
    return (
      <div
        style={{
          width: "100%",
          height: "500px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </div>
    );
  }
  // appears if there are no orders
  else if (orders.length === 0) {
    return (
      <div>
        <Box sx={{ mx: 5 }}>
          <Typography sx={{ my: 2 }} variant="h4" component="div">
            No recent orders!
          </Typography>
        </Box>
      </div>
    );
  }

  return (
    <>
      <Box
        sx={
          hasTouchScreen
            ? { ml: "2rem", mt: "2rem" }
            : { ml: "7.1rem", mt: "2rem" }
        }
      >
        <Typography
          style={
            hasTouchScreen
              ? {
                  fontSize: "1.5625rem",
                  fontWeight: 800,
                  marginRight: "10rem",
                }
              : {
                  fontSize: "1.5625rem",
                  fontWeight: 800,
                  marginLeft: "3.5rem",
                }
          }
        >
          Track Order
        </Typography>
      </Box>
      <Box>
        {currOrder && (
          <>
            <Box sx={hasTouchScreen ? { my: 2 } : { my: 5 }}>
              {/* // update this part */}

              <div>
                <Stepper
                  activeStep={getStatus(currOrder)}
                  connector={<ColorlibConnector />}
                  style={
                    hasTouchScreen
                      ? {
                          marginLeft: "2rem",
                          paddingRight: "9.5rem",
                          position: "absolute",
                        }
                      : {
                          marginLeft: "10rem",
                          paddingRight: "9.5rem",
                        }
                  }
                  orientation={hasTouchScreen ? "vertical" : "horizontal"}
                  // style={{ marginLeft: "6.5rem", marginRight: "9rem" }}
                >
                  {steps.map((label, index) => {
                    const labelProps = {};
                    return (
                      <Step key={label}>
                        <StepLabel
                          key={index}
                          {...labelProps}
                          style={
                            hasTouchScreen
                              ? {
                                  height: "3rem",
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "start",
                                }
                              : {}
                          }
                        ></StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
                <Stepper
                  activeStep={getStatus(currOrder)}
                  connector={<InvisibleConnector />}
                  alternativeLabel
                  orientation={hasTouchScreen ? "vertical" : "horizontal"}
                  style={
                    hasTouchScreen
                      ? {
                          marginLeft: "5rem",
                          height: "18.6rem",
                        }
                      : {}
                  }
                >
                  {steps.map((label, index) => (
                    <Step
                      key={label}
                      style={
                        hasTouchScreen
                          ? {
                              height: "5rem",
                              verticalAlign: "top",
                              marginTop: "-1.3rem",
                            }
                          : {}
                      }
                      //style={hasTouchScreen ? {height: "4rem"}: {}}
                    >
                      <StepLabel
                        style={
                          hasTouchScreen
                            ? {
                                height: "4rem",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "start",
                                marginTop: ".25rem",
                              }
                            : {}
                        }
                        StepIconComponent={() => <></>}
                      >
                        <div
                          style={
                            hasTouchScreen
                              ? {
                                  textAlign: "left",
                                }
                              : {
                                  textAlign: "center",
                                }
                          }
                        >
                          <Typography
                            style={{
                              fontSize: hasTouchScreen ? "1rem" : "1.25rem",
                              fontWeight: fontThickness(currOrder, index),
                            }}
                          >
                            {getLabel(index)}
                          </Typography>
                          <Typography
                            style={{
                              fontSize: hasTouchScreen ? "1rem" : "1.25rem",
                              fontWeight: "300",
                            }}
                          >
                            {getMessage(currOrder, index)}
                          </Typography>
                        </div>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </div>
            </Box>
            <div
              style={
                hasTouchScreen
                  ? {
                      borderTop: "2px dashed #D9D9D9",
                      width: "100%",
                      alignSelf: "center",
                      marginTop: "-1.5rem",
                    }
                  : {}
              }
            ></div>
            <div
              style={
                hasTouchScreen
                  ? {
                      display: "flex",
                      flexDirection: "column",
                      overflowX: "hidden",
                      marginTop: "1.5rem",
                    }
                  : {
                      display: "flex",
                      flexDirection: "row",
                      overflowX: "hidden",
                      height: "35vh",
                      marginTop: "5rem",
                    }
              }
            >
              <div
                style={
                  hasTouchScreen
                    ? { marginRight: "1rem" }
                    : { marginRight: "5rem", marginLeft: "6.5rem" }
                }
              >
                <Typography
                  style={{
                    fontSize: "1.5rem",
                    marginBottom: "0.5rem",
                    fontWeight: 800,
                    marginLeft: hasTouchScreen ? "2rem" : "4rem",
                  }}
                >
                  Order Details
                </Typography>
                {Object.entries(currOrder.items).map((entry) => (
                  <div style={{ marginLeft: hasTouchScreen ? "2rem" : "4rem" }}>
                    <OrderItem props={entry[1]} />
                    {/* Subtotal: ${entry[1].subtotal} */}
                  </div>
                ))}
                <div style={{ marginLeft: hasTouchScreen ? "2rem" : "4rem" }}>
                  Total: ${currOrder.orderTotal}
                </div>
              </div>
              <div
                style={
                  hasTouchScreen
                    ? {}
                    : {
                        borderLeft: "2px dotted #D9D9D9",
                        height: "100%",
                        alignSelf: "center",
                      }
                }
              ></div>{" "}
              <div style={hasTouchScreen ? {} : { marginLeft: "2rem" }}>
                {orders.length > 1 ? (
                  <div>
                    <div
                      style={
                        hasTouchScreen
                          ? {
                              borderTop: "2px dashed #D9D9D9",
                              alignSelf: "center",
                              marginLeft: "-2rem",
                              width: "100vm",
                              marginTop: "1.5rem",
                              marginBottom: "1.5rem",
                            }
                          : {}
                      }
                    ></div>
                    <Typography
                      style={{
                        fontSize: "1.5rem",
                        marginBottom: "0.25rem",
                        marginLeft: hasTouchScreen ? "2rem" : ".25rem",
                        fontWeight: "800",
                      }}
                    >
                      Track Other Orders
                    </Typography>
                    <Box
                      sx={{ mx: 1, my: 4 }}
                      style={{ marginLeft: hasTouchScreen ? "2rem" : ".25rem" }}
                    >
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-helper-label">
                          Select Another Order
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-helper-label"
                          id="demo-simple-select-helper"
                          label="Select Another Order"
                          value={currOrder || ""}
                          onChange={handleChange}
                          sx={{
                            width: "16rem",
                          }}
                        >
                          {orders.map((object) => (
                            <MenuItem value={object} key={object.id}>
                              <div
                                style={{
                                  overflowX: "hidden",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {getOrderName(object)}
                                {getStatus(object) === 2 ? (
                                  <img
                                    src={bell}
                                    style={{
                                      maxWidth: "4.5rem",
                                      paddingLeft: "3rem",
                                      paddingTop: "5px",
                                      paddingBottom: "10px",
                                    }}
                                  />
                                ) : (
                                  ""
                                )}
                              </div>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </>
        )}

        {currOrder == null && (
          <Typography sx={{ my: 2 }} variant="h6" component="div">
            You don't have any active order
          </Typography>
        )}

        <div
          className="w-100 text-center"
          style={{
            fontSize: 15,
            position: "fixed",
            bottom: 0,
            left: 0,
            marginBottom: "2rem",
          }}
        >
          <Link to="/menu" style={{ textDecoration: "none" }}>
            Back To Menu
          </Link>
        </div>
      </Box>
    </>
  );
};

export default OrderStatus;
