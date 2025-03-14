import React, { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useAuth } from "./AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { getErrorMessage } from "../utils/errorUtils";
import { is5cEmail } from "../utils/is5cEmail";
import polygon1 from "../assets/polygon1.png";
import polygon2 from "../assets/polygon2.png";
import viewOpen from "../assets/viewOpen.png";
import viewClosed from "../assets/viewClosed.png";
import { FormHelperText } from "@mui/material";
import { ClassNames } from "@emotion/react";

// fixes margin issue
// adds space to beginning of textfields
const useStyles = makeStyles((theme) => ({
  textField: {
    borderBottom: "0.75rem solid #F7F7FD",
    borderLeft: "1rem solid #F7F7FD",
    borderRight: "1rem solid #F7F7FD",
  },
}));

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwdConf, setPwdConf] = useState("");
  const [loading, setLoading] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [viewOne, setViewOne] = useState(false);
  const [viewTwo, setViewTwo] = useState(false);

  const { signUp } = useAuth();
  let navigate = useNavigate();

  function isInputCorrect() {
    return (
      email !== "" &&
      is5cEmail(email) &&
      name !== "" &&
      pwd !== "" &&
      pwdConf === pwd
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    signUp(email, pwd, name)
      .then(() => {
        setLoading(false);
        navigate("/menu");
        window.location.reload();
      })
      .catch((err) => {
        setErrorMessage(getErrorMessage(err.code));
        setLoading(false);
      });
  }

  function changeImageOne() {
    setViewOne(!viewOne);
  }

  function changeImageTwo() {
    setViewTwo(!viewTwo);
  }

  // checks if device is mobile
  function isMobile() {
    return window.innerHeight <= 800 && window.innerWidth <= 600;
  }

  const classes = useStyles();

  return (
    <div>
      <div id="right">
        <img src={polygon1} style={{ position: "relative" }} />
      </div>
      <div className="d-flex flex-column align-items-center">
        <Typography
          className="mt-4"
          sx={{
            fontSize: 24,
            minWidth: isMobile() ? "21.5rem" : "24rem",
            fontWeight: 900,
          }}
        >
          Sign Up
        </Typography>
        {errorMessage !== "" && (
          <Typography className="mb-4" sx={{ fontSize: 15 }} color="red">
            {errorMessage}
          </Typography>
        )}
        <TextField
          required
          error={clicked && name === ""}
          label="Full Name"
          variant="standard"
          color="info"
          InputLabelProps={{ required: false }}
          InputProps={{ disableUnderline: true }}
          className={classes.textField}
          style={{
            width: "30%",
            minWidth: "350px",
            marginTop: "20px",
            marginBottom: "10px",
            backgroundColor: "#F7F7FD",
            borderRadius: 5,
          }}
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
        <Typography
          style={{
            fontSize: "12.5px",
            position: "relative",
            right: "-125px",
            color: "#605DEC",
            marginTop: "-5px",
            marginBottom: "5px",
          }}
        >
          {name != "" && !name.includes(" ") ? "Must use ID name" : ""}
        </Typography>
        <TextField
          required
          error={clicked && (email === "" || !is5cEmail(email))}
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
        <Typography
          style={{
            fontSize: "12.5px",
            position: "relative",
            right: "-125px",
            color: "#605DEC",
            marginTop: "-5px",
            marginBottom: "5px",
          }}
        >
          {email != "" && !is5cEmail(email) ? "Must be 5C email" : ""}
        </Typography>
        <TextField
          required
          error={clicked && pwd === ""}
          variant="standard"
          color="info"
          InputLabelProps={{ required: false }}
          InputProps={{
            disableUnderline: true,
            endAdornment: (
              <img
                src={!viewOne ? viewClosed : viewOpen}
                onClick={(event) => {
                  changeImageOne();
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
          label="Create Password"
          type={viewOne ? "text" : "password"}
          autoComplete="current-password"
          className={classes.textField}
          onChange={(event) => {
            setPwd(event.target.value);
          }}
        />
        <Typography
          style={{
            fontSize: "12.5px",
            position: "relative",
            right: "-95px",
            color: "#605DEC",
            marginTop: "-5px",
            marginBottom: "5px",
          }}
        >
          {pwd.length != 0 && pwd.length < 6
            ? "Must be at least 6 characters"
            : ""}
        </Typography>
        <TextField
          required
          error={
            clicked
              ? pwd !== pwdConf || pwdConf === ""
              : pwd !== pwdConf && pwdConf !== ""
          }
          variant="standard"
          color="info"
          InputLabelProps={{ required: false }}
          InputProps={{
            disableUnderline: true,
            endAdornment: (
              <img
                src={!viewTwo ? viewClosed : viewOpen}
                onClick={(event) => {
                  changeImageTwo();
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
            outline: "none",
            borderRadius: 5,
          }}
          label="Confirm Password"
          type={viewTwo ? "text" : "password"}
          autoComplete="current-password"
          className={classes.textField}
          onChange={(event) => {
            setPwdConf(event.target.value);
          }}
        />
        <Typography
          style={{
            fontSize: "12.5px",
            position: "relative",
            right: "-110px",
            color: "#605DEC",
            marginTop: "-5px",
          }}
        >
          {pwd !== pwdConf && pwdConf !== "" ? "Passwords must match" : ""}
        </Typography>
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
            marginTop: "30px",
            marginBottom: "10px",
            color: "black",
            fontSize: 15,
            borderRadius: 30,
            fontWeight: "lighter",
          }}
        >
          Sign Up
        </Button>
        <div
          className="w-100 text-center mt-1"
          style={{ fontSize: 15, marginBottom: "-10px" }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              textDecoration: "none",
              fontSize: 15,
              fontWeight: "bold",
              color: "#4787F3",
            }}
          >
            Sign In
          </Link>
        </div>
      </div>
      <img src={polygon2} style={{ float: "right" }} />
    </div>
  );
}
