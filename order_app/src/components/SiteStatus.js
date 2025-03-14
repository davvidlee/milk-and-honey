import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";

const SiteStatus = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    
    return () => (document.body.style.overflow = originalStyle);
  }, []);

  const headerStyle = {
    fontSize: isMobile ? "2rem" : "3rem",
    textAlign: isMobile ? "center" : "left",
  };

  const textStyle = {
    fontSize: isMobile ? "1rem" : "1.7rem",
    textAlign: isMobile ? "center" : "left",
    // marginBottom: "2rem",
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: isMobile ? "center" : "flex-start",
  };

  return (
    <>
      <div
        className="wrapper"
        style={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingLeft: isMobile ? "1rem" : "18rem",
          paddingRight: isMobile ? "1rem" : "10rem",
        }}
      >
        <div className="container" style={containerStyle}>
          <div className="headerContainer" style={{ marginBottom: "1rem" }}>
            <h1 style={headerStyle}>Sorry!</h1>
            <h1 style={headerStyle}>Milk and Honey is currently closed.</h1>
          </div>
          <h4 style={textStyle}>You may order from 7PM-9:45PM on</h4>
          <h4 style={textStyle}>Tuesdays and Thursdays.</h4>
          <img
            src={logo}
            alt="Descriptive Text"
            style={{ width: "100px", height: "auto", marginTop: "2rem" }}
          />
        </div>
      </div>
    </>
  );
};

export default SiteStatus;
