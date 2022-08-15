import React, { Fragment } from "react";
import {
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { useStyles } from "./HeaderStyle";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import GroupIcon from "@mui/icons-material/Group";
import AddCardIcon from "@mui/icons-material/AddCard";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { isAuth } from "../../Common/helpers";
import { blue, blueGrey } from "@mui/material/colors";

const SideNavData = ({ handleDrawerClose }) => {
  const classes = useStyles();
  const listItemData = [
    {
      label: "Profile",
      link: "/profile",
      icon: <PersonIcon />,
      access: ["hub", "spoke"],
    },
    {
      label: "Profile",
      link: "/admin/profile",
      icon: <PersonIcon />,
      access: ["admin"],
    },
    {
      label: "Availability",
      link: "/availability",
      icon: <AssignmentTurnedInIcon />,
      access: ["hub"],
    },
    {
      label: "Requests",
      link: "/request/appointment",
      icon: <CalendarMonthIcon />,
      access: ["hub"],
    },
    {
      label: "Stories",
      link: "/admin/stories",
      icon: <AutoStoriesIcon />,
      access: ["admin"],
    },
    {
      label: "New Story",
      link: "/admin/newStory",
      icon: <AddCardIcon />,
      access: ["admin"],
    },
    {
      label: "Requests",
      link: "/admin/requests",
      icon: <CalendarMonthIcon />,
      access: ["admin"],
    },
    {
      label: "Appointments",
      link: "/admin/appointments",
      icon: <CalendarTodayIcon />,
      access: ["admin"],
    },
    {
      label: "APPOINTMENTS",
      link: "/hub/confirmedBookings",
      icon: <CalendarTodayIcon />,
      access: ["hub"],
    },
    {
      label: "Clinicians",
      link: "/clinicians",
      icon: <GroupIcon />,
      access: ["spoke"],
    },
    {
      label: "Requests",
      link: "/spoke/request/appointment",
      icon: <CalendarMonthIcon />,
      access: ["spoke"],
    },
    {
      label: "APPOINTMENTS",
      link: "/spoke/confirmedBookings",
      icon: <CalendarTodayIcon />,
      access: ["spoke"],
    },
  ];

  return (
    <List>
      {listItemData.map(
        (item, i) =>
          isAuth() &&
          item.access.includes(isAuth().role) && (
            <Fragment key={i}>
              <Button
                size="small"
                onClick={() => handleDrawerClose()}
                style={{ width: "100%", textTransform: "uppercase" }}
              >
                <ListItem
                  exact
                  key={i}
                  component={NavLink}
                  to={item.link}
                  style={{
                    color: blueGrey[700],
                    transition: "0.8s",
                    "&:hover  div": { color: blue["A400"] },
                  }}
                  activeClassName={classes.selectedNav}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText>{item.label}</ListItemText>
                </ListItem>
              </Button>
            </Fragment>
          )
      )}
    </List>
  );
};

export default SideNavData;
