import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import {
  isAuth,
  getCookie,
  signout,
  convertToDate,
} from "../../Common/helpers";
import NavBreadCrumb from "./NavBreadCrumb";
import {
  Stack,
  Grid,
  Box,
  Typography,
  CircularProgress,
  ListSubheader,
  Button,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import ClinicianBio from "./ClinicianBio";
import ClinicBio from "./ClinicBio";
import MapsMarker from "./MapsMarker";

const UserProfile = ({ history }) => {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    aboutClinician: "",
    affiliatedFrom: "",
    clinicAddress: {},
    clinicContact: "",
    clinicName: "",
    clinicRegisteredYear: "",
    clinicRegistrationNo: "",
    clinicianProfessionalCourses: [],
    clinicianSpecialization: [],
    clinicianTrainedLocation: "",
    createdAt: "",
    updatedAt: "",
    gender: "",
    profilePhoto: "",
    socialMediaHandles: [],
    title: "",
    username: "",
    dateOfBirth: "",
    yearsOfExperience: 0,
    _id: "",
    loading: false,
  });

  const {
    firstName,
    lastName,
    email,
    loading,
    role,
    affiliatedFrom,
    clinicAddress,
    clinicContact,
    clinicName,
    aboutClinician,
    clinicRegisteredYear,
    clinicRegistrationNo,
    clinicianProfessionalCourses,
    clinicianSpecialization,
    clinicianTrainedLocation,
    createdAt,
    updatedAt,
    gender,
    profilePhoto,
    socialMediaHandles,
    title,
    username,
    dateOfBirth,
    yearsOfExperience,
    _id,
  } = values;

  const token = getCookie("token");

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = () => {
    setValues({ ...values, loading: true });
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API}/user/${isAuth()._id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log(response);
        const {
          firstName,
          lastName,
          email,
          role,
          password,
          confirmPassword,
          aboutClinician,
          affiliatedFrom,
          clinicAddress,
          clinicContact,
          clinicName,
          clinicRegisteredYear,
          clinicRegistrationNo,
          clinicianProfessionalCourses,
          clinicianSpecialization,
          clinicianTrainedLocation,
          createdAt,
          updatedAt,
          gender,
          profilePhoto,
          socialMediaHandles,
          title,
          username,
          dateOfBirth,
          yearsOfExperience,
          _id,
        } = response.data;
        setValues({
          ...values,
          firstName,
          lastName,
          email,
          role,
          gender,
          password,
          confirmPassword,
          aboutClinician,
          affiliatedFrom,
          clinicAddress,
          clinicContact,
          clinicName,
          clinicRegisteredYear,
          clinicRegistrationNo,
          clinicianProfessionalCourses,
          clinicianSpecialization,
          clinicianTrainedLocation,
          createdAt,
          updatedAt,
          profilePhoto,
          socialMediaHandles,
          title,
          username,
          dateOfBirth,
          yearsOfExperience,
          _id,
          loading: false,
        });
      })
      .catch((error) => {
        setValues({ ...values, loading: false });
        console.log("User Profile Error", error.response.data.error);
        if (error.response.status === 401) {
          signout(() => {
            history.push("/");
          });
        }
        toast.error(error.response.data.error);
      });
  };

  return (
    <Fragment>
      <ToastContainer></ToastContainer>
      <NavBreadCrumb path="/profile" name="/Profile"></NavBreadCrumb>
      <Stack direction="row" sx={{ mt: 1 }}>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            {loading ? (
              <CircularProgress></CircularProgress>
            ) : (
              <Fragment>
                <ClinicianBio
                  title={title}
                  firstName={firstName}
                  lastName={lastName}
                  email={email}
                  gender={gender}
                  profilePhoto={profilePhoto}
                  clinicContact={clinicContact}
                  yearsOfExperience={yearsOfExperience}
                  affiliatedFrom={affiliatedFrom}
                  clinicianTrainedLocation={clinicianTrainedLocation}
                  clinicianProfessionalCourses={clinicianProfessionalCourses}
                  socialMediaHandles={socialMediaHandles}
                  aboutClinician={aboutClinician}
                  clinicianSpecialization={clinicianSpecialization}
                ></ClinicianBio>
                <ClinicBio
                  clinicName={clinicName}
                  clinicAddress={clinicAddress}
                  clinicRegisteredYear={clinicRegisteredYear}
                  clinicRegistrationNo={clinicRegistrationNo}
                ></ClinicBio>
              </Fragment>
            )}
          </Grid>
          <Grid item xs={6}>
            <Button component={Link} variant="contained" to="/edit-profile">
              Edit
            </Button>
            <Box
              sx={{
                my: 2,
                flexDirection: "column",
                bgcolor: "background.paper",
              }}
            >
              <Stack direction="row" justifyContent="center">
                <ListSubheader>
                  <Typography variant="overline">User Information</Typography>
                </ListSubheader>
              </Stack>
              <Typography>User ID: {_id}</Typography>
              <Typography>Role: {role}</Typography>
              <Typography>Username: {username}</Typography>
              <Typography>DOB: {convertToDate(dateOfBirth)}</Typography>
              <Typography>Created on: {convertToDate(createdAt)}</Typography>
              <Typography>Updated on: {convertToDate(updatedAt)}</Typography>
            </Box>
            <MapsMarker></MapsMarker>
          </Grid>
        </Grid>
      </Stack>
    </Fragment>
  );
};

export default UserProfile;
