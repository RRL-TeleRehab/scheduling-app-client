import React, { Fragment } from "react";
import { Stack, Button, AppBar, Toolbar, Typography, Box } from "@mui/material";
import { Link, withRouter } from "react-router-dom";
import { isAuth, signout } from "../../../Common/helpers";

const Landing = ({ match, history }) => {
  return (
    <AppBar position="static">
      <Toolbar
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexFlow: "row wrap",
        }}
      >
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Box style={{ display: "flex", alignItems: "center" }} sx={{ ml: 0 }}>
            <Box
              component="img"
              sx={{
                height: 40,
              }}
              alt="PROMOTE"
              src={`${process.env.REACT_APP_LOGO}`}
            />
          </Box>
        </Link>
        {!isAuth() && (
          <Fragment>
            {(match.path === "/signup" || match.path === "/") && (
              <Link
                to="/signin"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Button variant="contained" color="secondary">
                  Login
                </Button>
              </Link>
            )}
            {(match.path === "/signin" || match.path === "/") && (
              <Link
                to="/signup"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Button variant="contained" color="secondary">
                  Register
                </Button>
              </Link>
            )}
          </Fragment>
        )}
        {isAuth() &&
          (isAuth().role === "spoke" ||
            isAuth().role === "hub" ||
            isAuth().role === "admin") && (
            <Typography>
              {isAuth().firstName} {isAuth().lastName}
            </Typography>
          )}
        {isAuth() && (
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              signout(() => {
                history.push("/");
              });
            }}
          >
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default withRouter(Landing);
