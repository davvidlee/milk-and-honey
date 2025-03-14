import React from "react";
import { useEffect, useState } from "react";
import {
  fetchTopingInventory,
  updateToppingInventory,
} from "../api/firestoreApi";
import { Button, CircularProgress, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../auth/AuthContext";

// order.state = {"submitted","making","made","paid"}
const ManageInventory = ({ toggleStatus, showSiteStatus }) => {
  const [hasBoba, setHasBoba] = useState(true);
  const [hasPopping, setHasPopping] = useState(true);
  const [hasJelly, setHasJelly] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [reloadSwitch, setReloadSwitch] = useState(true);
  const { isVendor } = useAuth();

  useEffect(() => {
    setLoaded(false);
    fetchTopingInventory()
      .then((res) => {
        setHasBoba(res.hasBoba);
        setHasPopping(res.hasPopping);
        setHasJelly(res.hasJelly);
      })
      .then(() => {
        setLoaded(true);
      });
  }, [reloadSwitch]);

  if (!isVendor) {
    return (
      <Typography>Only Milk and Honey vendors can see this page.</Typography>
    );
  }

  return (
    <>
      {!loaded && (
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
      )}
      {loaded && (
        <div style={{ width: "100%", paddingLeft: "5%", marginTop: "2%" }}>
          <Typography variant="h4" component="div">
            Toppings
          </Typography>
          <div className="d-flex">
            <div className="p-4">
              <Typography variant="h5" component="div">
                Honey Boba
              </Typography>
              {hasBoba ? (
                <div>
                  In stock <CheckIcon color="success" />
                </div>
              ) : (
                <div>
                  Out of stock <CloseIcon color="error" />
                </div>
              )}
              <Button
                color={hasBoba ? "error" : "primary"}
                variant="contained"
                onClick={() => {
                  updateToppingInventory("boba", !hasBoba).then(() => {
                    setReloadSwitch(!reloadSwitch);
                  });
                }}
              >
                Set to {hasBoba ? "Out Of Stock" : "In Stock"}
              </Button>
            </div>
            <div className="p-4">
              <Typography variant="h5" component="div">
                Passionfruit Popping Boba
              </Typography>
              {hasPopping ? (
                <div>
                  In stock <CheckIcon color="success" />
                </div>
              ) : (
                <div>
                  Out of stock <CloseIcon color="error" />
                </div>
              )}
              <Button
                color={hasPopping ? "error" : "primary"}
                variant="contained"
                onClick={() => {
                  updateToppingInventory("popping", !hasPopping).then(() => {
                    setReloadSwitch(!reloadSwitch);
                  });
                }}
              >
                Set to {hasPopping ? "Out Of Stock" : "In Stock"}
              </Button>
            </div>
            <div className="p-4">
              <Typography variant="h5" component="div">
                Lychee Jelly
              </Typography>
              {hasJelly ? (
                <div>
                  In stock <CheckIcon color="success" />
                </div>
              ) : (
                <div>
                  Out of stock <CloseIcon color="error" />
                </div>
              )}
              <Button
                color={hasJelly ? "error" : "primary"}
                variant="contained"
                onClick={() => {
                  updateToppingInventory("jelly", !hasJelly).then(() => {
                    setReloadSwitch(!reloadSwitch);
                  });
                }}
              >
                Set to {hasJelly ? "Out Of Stock" : "In Stock"}
              </Button>
            </div>
          </div>
          <div>
            <Typography variant="h4" component="div">
              Store Settings
            </Typography>
            <Button
              onClick={toggleStatus}
              style={{
                backgroundColor: showSiteStatus ? "#D3302F" : "#36BF76",
                color: "white",
                padding: "0.5rem",
                marginTop: "1.4rem",
              }}
            >
              STORE STATUS: {showSiteStatus ? "CLOSED" : "OPEN"}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageInventory;
