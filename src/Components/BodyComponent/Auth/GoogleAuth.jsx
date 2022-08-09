import axios from "axios";
import React, { Fragment } from "react";
import { GoogleLogin } from "react-google-login";
import { gapi } from "gapi-script";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import googleSvg from "../../../media/google.svg";
import { useLocation } from "react-router-dom";
import { Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

const GoogleAuth = ({ informParent, path }) => {
  const location = useLocation();
  const responseGoogle = (response) => {
    // console.log(response.tokenId);
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/${path}`,
      data: { idToken: response.tokenId },
    })
      .then((response) => {
        // console.log("GOOGLE AUTHENTICATION SUCCESS", response);
        //inform parent about the signIn and redirect to home page based on user role
        informParent(response);
      })
      .catch((error) => {
        toast.error(error.response.data.error);
        console.log("Google Authentication Error", error.response);
      });
  };

  return (
    <Fragment>
      <ToastContainer />
      <GoogleLogin
        clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        render={(renderProps) => (
          <Button
            fullWidth
            variant="contained"
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
            sx={{ boxShadow: 10, textTransform: "none", mt: 2 }}
          >
            <GoogleIcon fontSize="small" sx={{ mr: 2 }}></GoogleIcon>
            {location.pathname === "/signin" && "Sign in with Google"}
            {location.pathname === "/signup" && "Sign up with Google"}
          </Button>
        )}
        cookiePolicy={"single_host_origin"}
      />
    </Fragment>
  );
};

GoogleAuth.propTypes = {
  informParent: PropTypes.func.isRequired,
};
export default GoogleAuth;
