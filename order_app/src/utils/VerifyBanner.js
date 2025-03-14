import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { sendEmailVerification } from "firebase/auth";

const VerifyBanner = () => {
  return (
    // <Stack sx={{ width: '100%' }} spacing={2}>
    <Alert
      severity="warning"
      action={
        <Button
          color="inherit"
          size="small"
          onClick={() => sendEmailVerification()}
        >
          resend email
        </Button>
      }
    >
      Please verify your email before you order
    </Alert>
    // </Stack>
  );
};

export default VerifyBanner;
