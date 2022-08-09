import React, { useState, Fragment } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import {
  Stack,
  CircularProgress,
  TextField,
  CssBaseline,
  Container,
  Grid,
  Button,
  Box,
  Typography,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";

const ForgotPassword = () => {
  const [values, setValues] = useState({
    email: "",
    loading: false,
  });
  const [errors, setErrors] = useState({});
  const { email, loading } = values;
  const validate = () => {
    let temp = { ...errors };
    temp.email = email ? "" : "Email is required";
    if (email) {
      temp.email = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
        ? ""
        : "Email is not valid";
    }
    setErrors({ ...temp });
    const isValid = email && Object.values(temp).every((x) => x === "");
    console.log(isValid);
    return isValid;
  };

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validate()) {
      setValues({ ...values, loading: true });
      axios({
        method: "PUT",
        url: `${process.env.REACT_APP_API}/forgot-password`,
        data: { email },
      })
        .then((response) => {
          console.log(" Forgot Password Success", response);
          setValues({ ...values, loading: false, email: "" });
          toast.success(response.data.message);
        })
        .catch((error) => {
          console.log("Forgot Password Failure", error);
          setValues({ ...values, loading: false, email: "" });
          if (error && error.response.data.error) {
            toast.error(error.response.data.error);
          } else {
            toast.error(error.response.data.errors);
          }
        });
    }
  };

  const forgotPasswordForm = () => (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 10,
          display: "flex",
          flexDirection: "column",
          padding: 5,
          boxShadow: 10,
          borderRadius: "1.5rem 0 1.5rem 1.5rem",
        }}
      >
        <Typography variant="h4">Forgot password?</Typography>
        <Typography variant="caption">
          No worries, We'll send you reset instructions.
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid
            container
            spacing={2}
            direction="column"
            justifyContent="center"
          >
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                size="small"
                id="email"
                label="Email"
                name="email"
                placeholder="Enter your email"
                autoComplete="email"
                value={email}
                onChange={handleChange("email")}
                {...(errors["email"] && {
                  error: true,
                  helperText: errors["email"],
                })}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, boxShadow: 10, textTransform: "none" }}
          >
            Reset password
            {loading ? (
              <CircularProgress sx={{ ml: 2 }} color="warning" size={20} />
            ) : (
              <EmailIcon sx={{ ml: 2 }}></EmailIcon>
            )}
          </Button>
          <Stack direction="row" justifyContent="end" sx={{ mt: 2 }}>
            <Typography>
              Back to{"  "}
              <Link style={{ textDecoration: "none" }} to="/signin">
                Login
              </Link>
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Container>
  );

  return (
    <Fragment>
      <ToastContainer />
      {forgotPasswordForm()}
    </Fragment>
  );
};

export default ForgotPassword;
