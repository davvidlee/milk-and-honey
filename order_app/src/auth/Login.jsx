import React, { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useAuth } from "./AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { getErrorMessage } from "../utils/errorUtils";
import polygon1 from "../assets/polygon1.png";
import polygon2 from "../assets/polygon2.png";
import viewOpen from "../assets/viewOpen.png";
import viewClosed from "../assets/viewClosed.png";

// fixes margin issue
// adds space to beginning of textfields
const useStyles = makeStyles((theme) => ({
  textField: {
    borderBottom: "0.75rem solid #F7F7FD",
    borderLeft: "1rem solid #F7F7FD",
    borderRight: "1rem solid #F7F7FD",
  },
}));

export default function Login() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [clicked, setClicked] = useState(false);
  const [view, setView] = useState(false);
  const { signIn } = useAuth();
  let navigate = useNavigate();

  const classes = useStyles();

  function isInputCorrect() {
    return email !== "" && pwd !== "";
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    signIn(email, pwd)
      .then(() => {
        setLoading(false);
        navigate("/menu");
      })
      .catch((err) => {
        setErrorMessage(getErrorMessage(err.code));
        setLoading(false);
      });
  }

  function changeImage() {
    setView(!view);
  }

  // checks if device is mobile
  function isMobile() {
    return window.innerHeight <= 800 && window.innerWidth <= 600;
  }

  return (
    <div>
      <div id="right">
        <img src={polygon1} />
      </div>
      <div className="d-flex flex-column align-items-center">
        <Typography
          className="mb-2 mt-4"
          sx={{
            fontSize: 24,
            minWidth: isMobile() ? "21.5rem" : "24rem",
            fontWeight: 900,
          }}
        >
          Sign In To Order
        </Typography>
        {errorMessage !== "" && (
          <Typography className="mb-4" sx={{ fontSize: 15 }} color="red">
            {errorMessage}
          </Typography>
        )}
        <TextField
          required
          error={clicked && email === ""}
          label="School Email"
          variant="standard"
          color="info"
          InputLabelProps={{ required: false }}
          InputProps={{ disableUnderline: true }}
          style={{
            width: "30%",
            minWidth: "350px",
            marginBottom: "10px",
            backgroundColor: "#F7F7FD",
            borderRadius: 5,
          }}
          className={classes.textField}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />
        <TextField
          required
          error={clicked && pwd === ""}
          variant="standard"
          color="info"
          inputProps={{ textAlign: "right" }}
          InputLabelProps={{ required: false }}
          InputProps={{
            disableUnderline: true,
            endAdornment: (
              <img
                src={!view ? viewClosed : viewOpen}
                onClick={(event) => {
                  changeImage();
                }}
                style={{
                  maxWidth: "45px",
                  paddingBottom: "10px",
                  paddingRight: "20px",
                }}
              />
            ),
          }}
          style={{
            width: "30%",
            minWidth: "350px",
            marginBottom: "10px",
            backgroundColor: "#F7F7FD",
            borderRadius: 5,
          }}
          className={classes.textField}
          label="Password"
          type={view ? "text" : "password"}
          autoComplete="current-password"
          onChange={(event) => {
            setPwd(event.target.value);
          }}
        />
        <div className="w-100 text-center mt-1 mb-2">
          <Link
            to="/forgotPassword"
            style={{
              textDecoration: "none",
              maxWidth: "350px",
              fontSize: "12.5px",
              position: "relative",
              right: "-115px",
              color: "#605DEC",
            }}
          >
            Forgot Password?
          </Link>
        </div>
        <Button
          disabled={loading}
          color="primary"
          variant="contained"
          onClick={(event) => {
            setClicked(true);
            if (isInputCorrect()) {
              handleSubmit(event);
            }
          }}
          style={{
            textTransform: "none",
            width: "30%",
            minWidth: "300px",
            maxWidth: "350px",
            marginBottom: "10px",
            color: "black",
            fontSize: 15,
            borderRadius: 30,
            fontWeight: "lighter",
          }}
        >
          Sign In To Order
        </Button>
        <div className="w-100 text-center mt-1" style={{ fontSize: 15 }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ textDecoration: "none" }}>
            Sign Up
          </Link>
        </div>
      </div>
      <img src={polygon2} style={{ float: "right" }} />
    </div>
  );
}
