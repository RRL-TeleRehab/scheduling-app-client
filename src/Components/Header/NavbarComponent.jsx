import React from "react";
import { AppBar, Box, Hidden, IconButton, Toolbar } from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { Link } from "react-router-dom";
import Profile from "./ActionTab/Profile";

const NavbarComponent = ({ handleDrawerToggle, history }) => {
  return (
    <AppBar>
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
        <Hidden smDown>
          <Box>
            <Profile />
          </Box>
        </Hidden>
        <Hidden mdUp>
          <IconButton color="inherit" onClick={handleDrawerToggle}>
            <MenuRoundedIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

export default NavbarComponent;
