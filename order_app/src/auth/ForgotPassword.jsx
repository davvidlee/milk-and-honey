import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography
} from "@mui/material";
import { useAuth } from "./AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { getErrorMessage } from '../utils/errorUtils'

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("")
  const [clicked, setClicked] = useState(false);
  const { resetPassword } = useAuth();
  //let navigate = useNavigate();

  function isInputCorrect() {
    return email !== ""
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true)
    setErrorMessage("")
    resetPassword(email).then(() => {
      setLoading(false)
      setSucceeded(true)
    }).catch( err => {
      setErrorMessage(getErrorMessage(err.code))
      setLoading(false)
    })
  }

  return (
    <div className="d-flex flex-column align-items-center">
      <Typography className="mb-4 mt-4" sx={{ fontSize: 20 }}>
        Forgot your password?
      </Typography>
      {!succeeded && <Typography className="mb-4 mt-4" sx={{ fontSize: 15, width: "18rem"}}>
        Enter your email for Milk & Honey and we will send you a reset link!
      </Typography>}
      {errorMessage !== "" &&
        <Typography className="mb-4" sx={{ fontSize: 15 }} color='red'>
          {errorMessage}
        </Typography>
      }
      {succeeded &&
        <Typography className="mb-4" sx={{ fontSize: 15 }} color='info'>
          We have sent you an email! Check your junk or resend if you did not receive.
        </Typography>
      }
      <TextField
        required
        error={clicked && (email === "")}
        label="Email"
        style={{ width: '30%', minWidth: '300px', maxWidth: '350px', marginBottom: '10px' }}
        onChange={(event) => {
          setEmail(event.target.value)
        }}
      />
      <Button
        disabled={loading || email===""}
        color="primary"
        variant="contained"
        onClick={event => {
          setClicked(true)
          if (isInputCorrect()) {
            handleSubmit(event)
          }
        }}
        style={{ width: '30%', minWidth: '300px', maxWidth: '350px', marginBottom: '10px', color: 'white', fontSize: 15 }}
      >
        send password reset email
      </Button>
    </div>
  );
}