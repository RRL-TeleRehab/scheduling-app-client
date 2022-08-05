import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { isAuth, getCookie, signout } from "../../Common/helpers";
import Box from "@mui/material/Box";
import NavBreadCrumb from "./NavBreadCrumb";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";

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
      {loading ? (
        <CircularProgress></CircularProgress>
      ) : (
        <Box mt={2} sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} lg={8}>
              <div>
                {firstName}
                {lastName}
                {title}
              </div>
              <img
                alt={process.env.REACT_APP_DEFAULT_USER_PROFILE_AVATAR}
                src={profilePhoto}
                style={{ width: "100px", height: "100px" }}
              ></img>
              <div>Experience: {yearsOfExperience}</div>
              <div>clinicName: {clinicName}</div>
              <div>{email}</div>
              <div>{aboutClinician}</div>
              <div>{dateOfBirth}</div>
              <div>
                {clinicAddress.address1}
                {clinicAddress.address2}
                {clinicAddress.city}
                {clinicAddress.postCode}
                {clinicAddress.province}
                {clinicAddress.country}
              </div>
              <div>{gender}</div>
              <div> {affiliatedFrom}</div>
              <div> {clinicContact}</div>
              <div> {clinicRegistrationNo}</div>
              <div> {clinicianProfessionalCourses}</div>
              <div> {clinicName}</div>
              <div> {clinicianSpecialization}</div>
              <div> {clinicianTrainedLocation}</div>
              <div> Account created on{createdAt}</div>
              <div> Account Last updated on {updatedAt}</div>
              <div>{socialMediaHandles.facebook}</div>
              <div>{socialMediaHandles.twitter}</div>
              <div>{socialMediaHandles.linkedin}</div>
              <div>{socialMediaHandles.instagram}</div>
              <div>userId : {_id}</div>
              <div>Roke : {role}</div>
              <div>Registered Year : {clinicRegisteredYear}</div>
              <div>username : {username}</div>
            </Grid>
            <Grid item xs={12} md={6} lg={4}></Grid>
            <IconButton component={Link} to="/edit-profile">
              <EditIcon></EditIcon>
            </IconButton>
          </Grid>
        </Box>
      )}
    </Fragment>
  );
};

export default UserProfile;
