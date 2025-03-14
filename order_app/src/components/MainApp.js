import React from "react";
import "../App.css";
import Menu from "./Menu";
import Cart from "./Cart";
// import VerifyBanner from "../utils/VerifyBanner";
import { useAuth } from "../auth/AuthContext";
import Footer from "./Footer";
import Login from "../auth/Login";

const MainApp = ({ theme }) => {
  const { currentUser } = useAuth();

  return (
    <>
      <div>
        {/* Removed verifciation banner */}
        {/* {currentUser && !currentUser.emailVerified && <VerifyBanner />} */}
        <Menu />
        <Cart />
      </div>
    </>
  );
};

export default MainApp;
