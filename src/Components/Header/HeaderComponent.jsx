import React, { Fragment } from "react";
import { Box, styled } from "@mui/material";
import { Route, Switch } from "react-router-dom";
import NavbarComponent from "./NavbarComponent";
import SideNav from "./SideNav";
import UserProfile from "../BodyComponent/UserProfile";
import EditUserProfile from "../BodyComponent/EditUserProfile";
import Availability from "../BodyComponent/Availability";
import RequestedHubAppointments from "../BodyComponent/RequestedHubAppointments";
import AdminProfile from "../BodyComponent/AdminProfile";
import SearchClinicians from "../BodyComponent/SearchClinicians";
import Landing from "../BodyComponent/Auth/Landing";
import ForgotPassword from "../BodyComponent/Auth/ForgotPassword";
import ResetPassword from "../BodyComponent/Auth/ResetPassword";
import SignUp from "../BodyComponent/Auth/SignUp";
import SignIn from "../BodyComponent/Auth/SignIn";
import Activate from "../BodyComponent/Auth/Activate";
import Stories from "../BodyComponent/AdminComponents/Stories";
import NewStory from "../BodyComponent/AdminComponents/NewStory";
import UpdateStory from "../BodyComponent/AdminComponents/UpdateStory";
import AdminAppointments from "../BodyComponent/AdminComponents/AdminAppointments";
import AdminRequests from "../BodyComponent/AdminComponents/AdminRequests";
import UserRoute from "../BodyComponent/Auth/UserRoute";
import HubRoute from "../BodyComponent/Auth/HubRoute";
import SpokeRoute from "../BodyComponent/Auth/SpokeRoute";
import PublicRoute from "../BodyComponent/Auth/PublicRoute";
import AdminRoute from "../BodyComponent/Auth/AdminRoute";
import RequestedHubAppointmentById from "../BodyComponent/RequestedHubAppointmentById";
import HubConfirmedBookings from "../BodyComponent/HubConfirmedBookings";
import ConfirmedAppointmentInfoById from "../BodyComponent/ConfirmedAppointmentInfoById";
import AppointmentBooking from "../BodyComponent/AppointmentBooking";
import RequestedSpokeAppointments from "../BodyComponent/SpokeComponents/RequestedSpokeAppointments";
import SpokeConfirmedBookings from "../BodyComponent/SpokeComponents/SpokeConfirmedBookings";
import RequestedSpokeAppointmentById from "../BodyComponent/SpokeComponents/RequestedSpokeAppointmentById";
import ConfirmedSpokeAppointmentInfoById from "../BodyComponent/SpokeComponents/ConfirmedSpokeAppointmentInfoById";

const StyledBox = styled(Box)(({ theme }) => ({
  width: "100%",
  minHeight: "100vh",
  height: "auto",
  background: "#efefef",
  boxSizing: "border-box",
  padding: "70px 24px 24px 270px",
  [theme.breakpoints.down("sm")]: {
    padding: "70px 24px 24px 24px",
  },
}));

export default function HeaderComponent() {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleDrawerClose = () => {
    setMobileOpen(false);
  };
  return (
    <Fragment>
      <Switch>
        <Route exact path="/" component={Landing}></Route>
        <Route exact path="/signin" component={SignIn}></Route>
        <Route exact path="/signup" render={() => <SignUp />}></Route>
        <Route exact path="/auth/activate/:token" component={Activate}></Route>
        <Route
          exact
          path="/auth/password/forgot"
          component={ForgotPassword}
        ></Route>
        <Route
          exact
          path="/auth/password/reset/:token"
          component={ResetPassword}
        ></Route>
        <StyledBox>
          <NavbarComponent handleDrawerToggle={handleDrawerToggle} />
          <SideNav
            mobileOpen={mobileOpen}
            handleDrawerClose={handleDrawerClose}
            handleDrawerToggle={handleDrawerToggle}
          />
          <UserRoute exact path="/profile" component={UserProfile}></UserRoute>
          <UserRoute
            exact
            path="/edit-profile"
            component={EditUserProfile}
          ></UserRoute>
          <HubRoute
            exact
            path="/availability"
            component={Availability}
          ></HubRoute>
          <HubRoute
            exact
            path="/request/appointment"
            component={RequestedHubAppointments}
          ></HubRoute>
          <PublicRoute
            exact
            path="/request/appointment/:appointmentId"
            component={RequestedHubAppointmentById}
          ></PublicRoute>
          <SpokeRoute
            exact
            path="/spoke/request/appointment/:appointmentId"
            component={RequestedSpokeAppointmentById}
          ></SpokeRoute>
          <HubRoute
            exact
            path="/hub/confirmedBookings"
            component={HubConfirmedBookings}
          ></HubRoute>
          <PublicRoute
            exact
            path="/hub/confirmedBookings/:appointmentId"
            component={ConfirmedAppointmentInfoById}
          ></PublicRoute>
          <SpokeRoute
            exact
            path="/spoke/confirmedBookings/:appointmentId"
            component={ConfirmedSpokeAppointmentInfoById}
          ></SpokeRoute>
          <SpokeRoute
            exact
            path="/clinicians"
            component={SearchClinicians}
          ></SpokeRoute>
          <SpokeRoute
            exact
            path="/clinicians/:clinicianId"
            component={AppointmentBooking}
          ></SpokeRoute>
          <SpokeRoute
            exact
            path="/spoke/request/appointment"
            component={RequestedSpokeAppointments}
          ></SpokeRoute>
          <SpokeRoute
            exact
            path="/spoke/confirmedBookings"
            component={SpokeConfirmedBookings}
          ></SpokeRoute>
          <AdminRoute
            exact
            path="/admin/profile"
            component={AdminProfile}
          ></AdminRoute>
          <AdminRoute
            path="/admin/stories"
            exact
            component={Stories}
          ></AdminRoute>
          <AdminRoute
            path="/admin/newStory"
            exact
            component={NewStory}
          ></AdminRoute>
          <AdminRoute
            path="/admin/requests"
            exact
            component={AdminRequests}
          ></AdminRoute>
          <AdminRoute
            path="/admin/appointments"
            exact
            component={AdminAppointments}
          ></AdminRoute>
          <AdminRoute
            path="/admin/story/update/:storyId"
            exact
            component={UpdateStory}
          ></AdminRoute>
        </StyledBox>
      </Switch>
    </Fragment>
  );
}
