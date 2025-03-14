import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Logout from "@mui/icons-material/Logout";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import InventoryIcon from "@mui/icons-material/Inventory";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import logo from "../assets/logo.png";
import textLogo from "../assets/textLogo.svg";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { setMenu } from "../api/firestoreApi";
import { useMenu } from "../menu/MenuContext";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { logout, currentUser, isVendor } = useAuth();
  const { constantMenuItem } = useMenu();
  const openMenu = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // fixes margin issue where there's a bunch of right padding
  const getName = (name) => {
    var splitIndex = name.indexOf(" ");
    const firstName = splitIndex === -1 ? name : name.substring(0, splitIndex);
    return firstName;
  };

  let navigate = useNavigate();

  return (
    <>
      <div
        className={"sticky"}
        style={{ borderBottomWidth: "2px", width: "100%" }}
      >
        <Grid
          container
          sx={{ alignItems: "center" }}
          className="header pt-1 pb-1"
        >
          <Grid item xs={12}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ marginLeft: "0.5vw" }}>
                <Link to="/menu">
                  <img
                    src={logo}
                    style={{ height: "5vh", width: "5vh" }}
                    alt="logo"
                  />
                </Link>
              </div>
              <div>
                <Link to="/menu">
                  <img
                    src={textLogo}
                    style={{ height: "5vh" }}
                    alt="text logo"
                  />
                </Link>
              </div>
              {!currentUser && (
                <div style={{ marginLeft: "auto", marginRight: "10px" }}>
                  <Button
                    variant="outlined"
                    style={{ width: "90px" }}
                    onClick={() => {
                      navigate("/login");
                      // console.log("setting")
                      // setMenu(constantMenuItem);
                    }}
                  >
                    Sign In
                  </Button>
                </div>
              )}
              {/* {!currentUser && (
                <div style={{ marginRight: "0.5vw" }}>
                  <Button
                    variant="outlined"
                    style={{ width: "70px" }}
                    onClick={() => {
                      navigate("/signup");
                    }}
                  >
                    Join
                  </Button>
                </div>
              )} */}
              {currentUser && (
                <div style={{ marginLeft: "auto", marginRight: "10px" }}>
                  <Typography variant="button">
                    {getName(currentUser.displayName)}
                  </Typography>
                </div>
              )}
              {currentUser && (
                <div style={{ marginRight: "0.5vw" }}>
                  <IconButton
                    className=""
                    onClick={handleClick}
                    size="small"
                    aria-controls={openMenu ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={openMenu ? "true" : undefined}
                  >
                    <MenuIcon style={{ height: "5vh", width: "5vh" }} />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={openMenu}
                    onClose={handleCloseMenu}
                    onClick={handleCloseMenu}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 0.5,
                        "& .MuiAvatar-root": {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        "&:before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: "background.paper",
                          transform: "translateY(-50%) rotate(45deg)",
                          zIndex: 0,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    <MenuItem style={{ pointerEvents: "none" }}>
                      <ListItemIcon>
                        <PersonOutlineIcon fontSize="small" />
                      </ListItemIcon>{" "}
                      Hi, {currentUser && currentUser.displayName}
                    </MenuItem>
                    <Divider />
                    <MenuItem
                      onClick={() => {
                        navigate("/menu");
                      }}
                    >
                      <ListItemIcon>
                        <MenuIcon fontSize="small" />
                      </ListItemIcon>
                      Menu
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        navigate("/orderstatus");
                      }}
                    >
                      <ListItemIcon>
                        <NotificationsNoneIcon fontSize="small" />
                      </ListItemIcon>
                      Order Status
                    </MenuItem>
                    {isVendor && (
                      <MenuItem
                        onClick={() => {
                          navigate("/trackOrder");
                        }}
                      >
                        <ListItemIcon>
                          <SignalCellularAltIcon fontSize="small" />
                        </ListItemIcon>
                        Track Order (Vendor)
                      </MenuItem>
                    )}
                    {isVendor && (
                      <MenuItem
                        onClick={() => {
                          navigate("/manageInventory");
                        }}
                      >
                        <ListItemIcon>
                          <InventoryIcon fontSize="small" />
                        </ListItemIcon>
                        Manage Inventory
                      </MenuItem>
                    )}
                    <MenuItem
                      onClick={() => {
                        logout().then(() => {
                          navigate("/login");
                        });
                      }}
                    >
                      <ListItemIcon>
                        <Logout fontSize="small" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>
                </div>
              )}
            </div>
          </Grid>
        </Grid>
        <hr />
      </div>
    </>
  );
};

export default Header;
