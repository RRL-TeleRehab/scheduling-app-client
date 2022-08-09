import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import jwt from "jsonwebtoken";
import {
  Box,
  Stack,
  Typography,
  CssBaseline,
  Container,
  CircularProgress,
  Button,
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import { Link } from "react-router-dom";

// match is injected from BrowserRouter which is provide as a prop to the Activate component as it is wrapped in the BrowserRouter
const Activate = ({ match }) => {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    token: "",
    loading: false,
  });

  useEffect(() => {
    let token = match.params.token;
    let { firstName, lastName } = jwt.decode(token);
    if (token) {
      setValues({ ...values, firstName, lastName, token });
    }
  }, []);

  const { firstName, lastName, token, loading } = values;

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({
      ...values,
      loading: true,
    });
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/account-activation`,
      data: { token },
    })
      .then((response) => {
        console.log("ACCOUNT ACTIVATION", response);
        toast.success(response.data.message);
        setValues({
          ...values,
          loading: false,
          redirect: true,
        });
      })
      .catch((error) => {
        console.log(error);
        setValues({
          ...values,
          loading: false,
        });
        toast.error(error.response.data.error);
      });
  };

  const activationLink = () => (
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
        <Typography variant="h4">Activate account</Typography>
        <Typography variant="overline">
          Thank you{" "}
          <strong>
            {firstName} {lastName}
          </strong>{" "}
          for signing up with <strong>promote</strong>.
        </Typography>
        <Typography variant="caption">
          Your account is ready to use. To get started activate your account
          now.
        </Typography>
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2, boxShadow: 10 }}
          onClick={clickSubmit}
        >
          Activate
          {loading ? (
            <CircularProgress sx={{ ml: 2 }} color="warning" size={20} />
          ) : (
            <DoneIcon sx={{ ml: 2 }}></DoneIcon>
          )}
        </Button>
        <Stack direction="row" justifyContent="end" sx={{ mt: 2 }}>
          <Typography>
            Back to {"  "}
            <Link style={{ textDecoration: "none" }} to="/signin">
              Login
            </Link>
          </Typography>
        </Stack>
      </Box>
    </Container>
  );

  return (
    <Fragment>
      <ToastContainer></ToastContainer>
      {activationLink()}
    </Fragment>
  );
};

export default Activate;
