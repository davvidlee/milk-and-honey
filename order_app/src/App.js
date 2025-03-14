import React, { useState, useEffect } from "react";
import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Typography } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { MenuProvider } from "./menu/MenuContext";
import Header from "./components/Header";
import SiteStatus from "./components/SiteStatus";
import Login from "./auth/Login";
import MainApp from "./components/MainApp";
import SignUp from "./auth/SignUp";
import OrderStatus from "./components/OrderStatus";
import TrackOrder from "./components/TrackOrder";
import ManageInventory from "./components/ManageInventory";
import ForgotPassword from "./auth/ForgotPassword";
import { listenToSiteStatus, updateSiteStatus } from "./api/firestoreApi"; // Make sure these functions are implemented

const theme = createTheme({
  typography: {
    fontFamily: "Avenir",
  },
  palette: {
    primary: {
      main: "#f9d454",
    },
    secondary: {
      main: "#c3a31f",
    },
    info: {
      main: "#3e424b",
    },
  },
});

function App() {
  const [showSiteStatus, setShowSiteStatus] = useState(false);
  const { isVendor } = useAuth();

  useEffect(() => {
    // Listen for changes in site status in real-time
    const unsubscribe = listenToSiteStatus(setShowSiteStatus);
    return () => unsubscribe();
  }, []);

  // Function to toggle site status, to be called from components where needed
  const toggleStatus = async () => {
    await updateSiteStatus(!showSiteStatus); // Toggle the site status in Firestore
  };

  if (!isVendor && showSiteStatus) {
    return (
      <>
        <AuthProvider>
          <MenuProvider>
            <ThemeProvider theme={theme}>
              <Header toggleStatus={toggleStatus} />
              <Routes>
                <Route path="/menu" element={<SiteStatus />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/orderStatus" element={<SiteStatus />} />
              </Routes>
            </ThemeProvider>
          </MenuProvider>
        </AuthProvider>
      </>
    );
  }

  return (
    <div className="wrapper">
      <AuthProvider>
        <MenuProvider>
          <ThemeProvider theme={theme}>
            <Header toggleStatus={toggleStatus} />
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<MainApp theme={theme} />} />
              <Route path="/menu" element={<MainApp theme={theme} />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/orderStatus" element={<OrderStatus />} />
              <Route path="/trackOrder" element={<TrackOrder />} />
              <Route
                path="/manageInventory"
                element={
                  <ManageInventory
                    toggleStatus={toggleStatus}
                    showSiteStatus={showSiteStatus}
                  />
                }
              />
              <Route path="/forgotPassword" element={<ForgotPassword />} />
              <Route
                path="*"
                element={<Typography>Oops, there's nothing here!</Typography>}
              />
            </Routes>
          </ThemeProvider>
        </MenuProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
