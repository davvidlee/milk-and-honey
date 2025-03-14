import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import {
  listenOrdersByStartOfDay,
  updateItemOwner,
  updateItemStatus,
} from "../api/firestoreApi";
import { useAuth } from "../auth/AuthContext";
import { useMediaQuery, useTheme } from "@mui/material";
// Change this to change the color of the buttons when it gets changed from Paid to Made
const useStyles = makeStyles((theme) => ({
  Submitted: {
    background: "#FFFFFF",
    borderRadius: "16px",
    fontSize: "0.9rem",
    [theme.breakpoints.down("md")]: {
      fontSize: "0.8rem",
    },
  },
  Making: {
    background: "#F49D1A",
    borderRadius: "16px",
    fontSize: "0.9rem",
    [theme.breakpoints.down("md")]: {
      fontSize: "0.8rem",
    },
  },
  Made: {
    background: "#D7E9B9",
    borderRadius: "16px",
    fontSize: "0.9rem",
    [theme.breakpoints.down("md")]: {
      fontSize: "0.8rem",
    },
  },
  Paid: {
    background: "#FFEB99",
    borderRadius: "16px",
    fontSize: "0.9rem",
    [theme.breakpoints.down("md")]: {
      fontSize: "0.8rem",
    },
  },
  table: {
    width: "100%",
    overflowX: "auto",
    "& .MuiTableCell-root": {
      border: "1px solid black",
      padding: theme.spacing(1),
      [theme.breakpoints.down("md")]: {
        padding: theme.spacing(0.3),
        fontSize: "0.7rem",
      },
    },
  },
  responsiveMargin: {
    margin: theme.spacing(3),
    [theme.breakpoints.down("md")]: {
      margin: theme.spacing(2),
    },
  },
}));
function toppingColor(val) {
  let toppingColor;
  if (val === "POPP") {
    toppingColor = "rgb(255, 109, 1)";
  } else if (val === "LYCH") {
    toppingColor = "rgb(252, 229, 205)";
  } else if (val === "BOBA") {
    toppingColor = "rgb(180, 95, 6)";
  } else {
    toppingColor = "rgb(180, 95, 6)";
  }
  return toppingColor;
}
function toppingTextColor(val) {
  let toppingtextColor;
  if (val === "BOBA") {
    toppingtextColor = "rgb(255, 255,255)";
  } else {
    toppingtextColor = "rgb(0, 0, 0)";
  }
  return toppingtextColor;
}
function iceColor(val) {
  let iceColor;
  if (val === "Regular") {
    iceColor = "rgb(34, 99, 198)";
  } else if (val === "Low") {
    iceColor = "rgb(88, 145, 230)";
  } else if (val === "No") {
    iceColor = "rgb(208, 222, 245)";
  } else {
    iceColor = "rgb(208, 222, 245)";
  }
  return iceColor;
}
function iceTextColor(val) {
  let icetextColor;
  if (val === "Regular" || val === "Low") {
    icetextColor = "rgb(255, 255,255)";
  } else {
    icetextColor = "rgb(0, 0, 0)";
  }
  return icetextColor;
}

function sweetColor(val) {
  let sweetColor;
  if (val === "0%") {
    sweetColor = "rgb(218, 235, 224)";
  } else if (val === "25%") {
    sweetColor = "rgb(159, 215, 178)";
  } else if (val === "50%") {
    sweetColor = "rgb(82, 191, 119)";
  } else if (val === "75%") {
    sweetColor = "rgb(30, 163, 75)";
  } else if (val === "100%") {
    sweetColor = "rgb(16, 117, 50)";
  } else {
    sweetColor = "rgb(208, 222, 245)";
  }
  return sweetColor;
}
function sweetTextColor(val) {
  let sweettextColor;
  if (val === "100%" || val === "75%") {
    sweettextColor = "rgb(255, 255,255)";
  } else {
    sweettextColor = "rgb(0, 0, 0)";
  }
  return sweettextColor;
}
function teaNameColor(val) {
  let teanameColor;
  if (val === "Oolong") {
    teanameColor = "rgb(220, 169, 115)";
  } else if (val === "Jasmine") {
    teanameColor = "rgb(128, 198, 98)";
  } else if (val === "BSL") {
    teanameColor = "rgb(73, 73, 73)";
  } else if (val === "Matcha" || val === "DTYMatcha") {
    teanameColor = "rgb(169, 225, 185)";
  } else if (val === "Thai") {
    teanameColor = "rgb(236, 148, 67)";
  } else if (val === "Black") {
    teanameColor = "rgb(123, 122, 127)";
  } else if (val === "Special") {
    teanameColor = "rgb(222, 100, 99)";
  } else if (val === "Taro") {
    teanameColor = "rgb(182, 180, 255)";
  } else {
    teanameColor = "rgb(0, 0, 0)";
  }
  return teanameColor;
}

function teaTextColor(val) {
  let teatextColor;
  if (val === "BSL" || val === "Black") {
    teatextColor = "rgb(255, 255,255)";
  } else {
    teatextColor = "rgb(0, 0, 0)";
  }
  return teatextColor;
}

function milkNameColor(val) {
  let milkNameColor;
  if (val === "Milk") {
    milkNameColor = "rgb(255, 184, 46)";
  } else if (val === "Oat") {
    milkNameColor = "rgb(255, 219, 156)";
  } else if (val === "Soy") {
    milkNameColor = "rgb(255, 242, 220)";
  } else if (val === "Almond") {
    milkNameColor = "rgb(255, 250, 242)";
  } else {
    milkNameColor = "rgb(255, 184, 46)";
  }
  return milkNameColor;
}

const toppingNameMap = new Map();
toppingNameMap.set("Honey Boba", "BOBA");
toppingNameMap.set("Lychee Jelly", "LYCH");
toppingNameMap.set("Passionfruit Popping Boba", "POPP");

const iceNameMap = new Map();
iceNameMap.set("No Ice", "No");
iceNameMap.set("Low Ice", "Low");
iceNameMap.set("Regular Ice", "Regular");

// DO WE NEED TO MATCH FROM Lactose-Free Creamer (Default) AND FROM Lactose-free Milk AND FROM Fresh Milk AND Whole Milk
// LIKE ARE THOSE DIFFERENT OPTIONS?
const milkNameMap = new Map();
milkNameMap.set("Lactose-free Milk", "Milk");
milkNameMap.set("Oat Milk", "Oat");
milkNameMap.set("Almond Milk", "Almond");
milkNameMap.set("Soy Milk", "Soy");
milkNameMap.set("Lactose-free Creamer (Default)", "Milk");
milkNameMap.set("Whole Milk", "Milk");
milkNameMap.set("Fresh Milk", "Milk");

const teaNameMap = new Map();
teaNameMap.set("Black", "Black");
teaNameMap.set("Jasmine", "Jasmine");
teaNameMap.set("Oolong", "Oolong");
teaNameMap.set("Thai", "Thai");
teaNameMap.set("Dirty Matcha", "DTYMatcha");
teaNameMap.set("Matcha", "Matcha");
teaNameMap.set("Taro", "Taro");
teaNameMap.set("Brown Sugar", "BSL");

// SHOULD THIS MAP TO "/"?
teaNameMap.set("/", "Special");

const TrackOrder = () => {
  const [orders, setOrders] = useState([]);
  const { isVendor } = useAuth();
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.only("md"));
  const onStatus = (id, itemId, e) => {
    // set target order.status to event.target.value
    updateItemStatus(id, itemId, e.target.value);
  };

  // const onOwner = (id, itemId, e) => {
  //   // set target order.owner to event.target.value
  //   updateItemOwner(id, itemId, e.target.value);
  // };

  useEffect(() => {
    const day = new Date();
    day.setHours(0, 0, 0, 0);
    listenOrdersByStartOfDay(day.getTime(), setOrders);
  }, []);

  function getRows(orders) {
    let rows = [];
    orders.forEach((order) =>
      Object.entries(order.items).map((itemKey) => {
        const item = itemKey[1];
        const tempDate = new Date(order.id);
        const date = tempDate.toLocaleTimeString("en-US");
        const currRow = {
          itemId: item.itemId,
          tea: item.tea,
          flavors: item.flavors,
          milk: item.milk,
          ice: item.ice,
          sweetness: item.sweetness,
          toppings: item.toppings,
          id: order.id,
          orderId: order.id,
          name: item.name,
          //status: order.state,
          status: item.itemState,
          created: date,
          notes: item.notes,
          total: order.orderTotal,
          ownedBy: order.name,
          madeBy: item.itemMadeBy,
        };
        rows.push(currRow);
      })
    );
    return rows;
  }

  const classes = useStyles();
  const statusToClass = (status) => {
    switch (status) {
      case "Submitted":
        return classes.Submitted;
      case "Making":
        return classes.Making;
      case "Made":
        return classes.Made;
      case "Paid":
        return classes.Paid;
      default:
        return "default";
    }
  };

  // formats flavors into string
  const getFlavors = (flavors) => {
    var extendedFlavors = "";
    for (var i = 0; i < flavors.length; i++) {
      extendedFlavors += flavors[i] + ", ";
    }
    extendedFlavors = extendedFlavors.substring(0, extendedFlavors.length - 2);
    return extendedFlavors;
  };

  if (!orders) {
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

  if (!isVendor) {
    return (
      <Typography>Only Milk and Honey vendors can see this page.</Typography>
    );
  }

  // className={classes.responsiveMargin}

  return (
    <Box className={classes.responsiveMargin}>
      <Typography sx={{ my: 2 }} variant="h4" component="div">
        Track Order
      </Typography>
      <TableContainer component={Paper} className={classes.table}>
        <Table
          style={{ borderBottom: "5px solid black" }}
          size="small"
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <TableCell align="center">Customer</TableCell>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Special Notes</TableCell>
              <TableCell align="center">Tea</TableCell>
              <TableCell align="center">Flavor</TableCell>
              <TableCell align="center">Milk</TableCell>
              <TableCell align="center">Ice</TableCell>
              <TableCell align="center">Sweetness</TableCell>
              <TableCell align="center">Toppings</TableCell>
              <TableCell align="center">Status</TableCell>
              {/* <TableCell align="center">Made by</TableCell> */}
              <TableCell align="center">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody style={{ border: "1px solid black" }}>
            {getRows(orders).map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell
                  align="center"
                  component="th"
                  scope="row"
                  style={{ border: "1px solid black" }}
                >
                  {row.ownedBy}
                </TableCell>
                <TableCell align="center" style={{ border: "1px solid black" }}>
                  {row.name}
                </TableCell>
                <TableCell
                  align="center"
                  style={{
                    maxWidth: "150px",
                    overflowWrap: "break-word",
                    border: "1px solid black",
                  }}
                >
                  {row.notes}
                </TableCell>

                {/* TEA */}
                <TableCell align="center" style={{ border: "1px solid black" }}>
                  <Chip
                    className="mx-1 my-1"
                    style={{
                      backgroundColor: teaNameColor(teaNameMap.get(row.tea)),
                      color: teaTextColor(teaNameMap.get(row.tea)),
                    }}
                    label={teaNameMap.get(row.tea)}
                    variant="outlined"
                  />
                </TableCell>

                {/* FLAVOR */}
                <TableCell align="center" style={{ border: "1px solid black" }}>
                  {getFlavors(row.flavors)}
                </TableCell>

                {/* MILK */}
                <TableCell align="center" style={{ border: "1px solid black" }}>
                  {row.milk != "/" ? (
                    <Chip
                      className="mx-1 my-1"
                      style={{
                        backgroundColor: milkNameColor(
                          milkNameMap.get(row.milk)
                        ),
                      }}
                      label={milkNameMap.get(row.milk)}
                      variant="outlined"
                    />
                  ) : (
                    "/"
                  )}
                </TableCell>
                {/* ICE */}
                <TableCell align="center" style={{ border: "1px solid black" }}>
                  {row.ice != "/" ? (
                    <Chip
                      className="mx-1 my-1"
                      style={{
                        backgroundColor: iceColor(iceNameMap.get(row.ice)),
                        color: iceTextColor(iceNameMap.get(row.ice)),
                      }}
                      label={iceNameMap.get(row.ice)}
                      variant="outlined"
                    />
                  ) : (
                    "/"
                  )}
                </TableCell>

                {/* SWEETNESS */}
                <TableCell align="center" style={{ border: "1px solid black" }}>
                  {row.sweetness != "/" ? (
                    <Chip
                      className="mx-1 my-1"
                      style={{
                        backgroundColor: sweetColor(row.sweetness),
                        color: sweetTextColor(row.sweetness),
                      }}
                      label={row.sweetness}
                      variant="outlined"
                    />
                  ) : (
                    "/"
                  )}
                </TableCell>

                {/* TOPPING */}
                <TableCell align="center" style={{ border: "1px solid black" }}>
                  {row.toppings.map((topping) => {
                    return (
                      <Chip
                        className="mx-1 my-1"
                        style={{
                          backgroundColor: toppingColor(
                            toppingNameMap.get(topping)
                          ),
                          color: toppingTextColor(toppingNameMap.get(topping)),
                          fontSize: "0.8rem",
                        }}
                        label={toppingNameMap.get(topping)}
                        variant="outlined"
                      />
                    );
                  })}
                </TableCell>

                <TableCell align="center" style={{ border: "1px solid black" }}>
                  <FormControl
                    sx={{
                      m: 1,
                      minWidth: {
                        md: "80px",
                        lg: "100px",
                      },
                    }}
                    size="small"
                  >
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={row.status}
                      onChange={(e) => onStatus(row.id, row.itemId, e)}
                      className={statusToClass(row.status)}
                      variant="outlined"
                      sx={{
                        "& legend": { display: "none" },
                        "& fieldset": { top: 0 },
                        borderRadius: "30px",
                      }}
                    >
                      <MenuItem value={"Submitted"}>Submitted</MenuItem>
                      <MenuItem value={"Making"}>Making</MenuItem>
                      <MenuItem value={"Made"}>Made</MenuItem>
                      <MenuItem value={"Paid"}>Paid</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                {/* <TableCell align="right">
                  <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={row.madeBy}
                      onChange={(e) => onOwner(row.id, row.itemId, e)}
                    >
                      <MenuItem value={"Not Assigned"}>Not Assigned</MenuItem>
                      <MenuItem value={"Vendor A"}>Vendor A</MenuItem>
                      <MenuItem value={"Vendor B"}>Vendor B</MenuItem>
                      <MenuItem value={"Vendor C"}>Vendor C</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell> */}
                <TableCell align="center">{"$" + row.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TrackOrder;
